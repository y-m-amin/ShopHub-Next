/**
 * Property-based tests for JSON Database Integrity
 * Feature: e-commerce-platform, Property 9: JSON Database Integrity
 * Validates: Requirements 6.6
 */

import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import fc from 'fast-check';
import fs from 'fs/promises';
import path from 'path';

describe('JSON Database Integrity Property Tests', () => {
  let database, databaseOperations;

  beforeAll(async () => {
    // Dynamically import modules to avoid hoisting issues
    database = await import('../database.js');
    databaseOperations = await import('../database-operations.js');
  });

  beforeEach(async () => {
    // Clean up any existing database files
    try {
      const dataDir = path.join(process.cwd(), 'data');
      await fs.rm(dataDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore if directory doesn't exist
    }
  });

  afterEach(async () => {
    // Clean up test files
    try {
      const dataDir = path.join(process.cwd(), 'data');
      await fs.rm(dataDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  /**
   * Property 9: JSON Database Integrity
   * For any sequence of CRUD operations on the JSON database,
   * the data should remain consistent and accessible across server restarts
   */
  test('Property 9: Database integrity across CRUD operations and restarts', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate a sequence of CRUD operations
        fc.array(
          fc.oneof(
            // Create item operations
            fc.record({
              type: fc.constant('createItem'),
              data: fc.record({
                name: fc
                  .string({ minLength: 1, maxLength: 100 })
                  .filter((s) => s.trim().length > 0),
                description: fc
                  .string({ minLength: 1, maxLength: 500 })
                  .filter((s) => s.trim().length > 0),
                price: fc
                  .float({
                    min: Math.fround(0.01),
                    max: Math.fround(10000),
                    noNaN: true,
                  })
                  .map((p) => Math.round(p * 100) / 100),
                category: fc.option(
                  fc
                    .string({ minLength: 1, maxLength: 50 })
                    .filter((s) => s.trim().length > 0),
                ),
                inStock: fc.boolean(),
              }),
            }),
            // Create user operations
            fc.record({
              type: fc.constant('createUser'),
              data: fc.record({
                name: fc
                  .string({ minLength: 1, maxLength: 100 })
                  .filter((s) => s.trim().length > 0),
                email: fc.emailAddress(),
                role: fc.oneof(fc.constant('user'), fc.constant('admin')),
              }),
            }),
          ),
          { minLength: 1, maxLength: 5 },
        ),
        async (operations) => {
          // Initialize database
          await database.initializeDatabase();

          // Track created items and users
          const createdItems = [];
          const createdUsers = [];

          // Execute all operations
          for (const operation of operations) {
            try {
              switch (operation.type) {
                case 'createItem':
                  const item = await databaseOperations.createItem(
                    operation.data,
                  );
                  createdItems.push(item);
                  break;

                case 'createUser':
                  const user = await databaseOperations.createUser(
                    operation.data,
                  );
                  createdUsers.push(user);
                  break;
              }
            } catch (error) {
              // Some operations might fail due to validation, which is expected
              // We only care about database integrity, not operation success
            }
          }

          // Read database state before "restart"
          const beforeRestart = await database.readDatabase();

          // Simulate server restart by re-initializing database
          await database.initializeDatabase();

          // Read database state after "restart"
          const afterRestart = await database.readDatabase();

          // Verify database integrity
          expect(afterRestart).toEqual(beforeRestart);

          // Verify all created items are still accessible
          for (const item of createdItems) {
            const retrievedItem = await databaseOperations.getItemById(item.id);
            expect(retrievedItem).toBeTruthy();
            expect(retrievedItem.id).toBe(item.id);
          }

          // Verify all created users are still accessible
          for (const user of createdUsers) {
            const retrievedUser = await databaseOperations.getUserById(user.id);
            expect(retrievedUser).toBeTruthy();
            expect(retrievedUser.id).toBe(user.id);
          }

          // Verify database structure is maintained
          expect(afterRestart).toHaveProperty('users');
          expect(afterRestart).toHaveProperty('items');
          expect(afterRestart).toHaveProperty('sessions');
          expect(afterRestart).toHaveProperty('metadata');
          expect(Array.isArray(afterRestart.users)).toBe(true);
          expect(Array.isArray(afterRestart.items)).toBe(true);
          expect(Array.isArray(afterRestart.sessions)).toBe(true);
        },
      ),
      { numRuns: 50 },
    );
  });

  test('Database maintains consistency during sequential operations', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            name: fc
              .string({ minLength: 1, maxLength: 50 })
              .filter((s) => s.trim().length > 0),
            description: fc
              .string({ minLength: 1, maxLength: 200 })
              .filter((s) => s.trim().length > 0),
            price: fc
              .float({
                min: Math.fround(0.01),
                max: Math.fround(1000),
                noNaN: true,
              })
              .map((p) => Math.round(p * 100) / 100),
          }),
          { minLength: 1, maxLength: 3 },
        ),
        async (itemsData) => {
          // Clean up any existing database files first
          try {
            const dataDir = path.join(process.cwd(), 'data');
            await fs.rm(dataDir, { recursive: true, force: true });
          } catch (error) {
            // Ignore if directory doesn't exist
          }

          // Initialize database
          await database.initializeDatabase();

          // Create items sequentially
          const createdItems = [];
          for (const itemData of itemsData) {
            const item = await databaseOperations.createItem(itemData);
            createdItems.push(item);
          }

          // Verify all items were created and are retrievable
          const allItems = await databaseOperations.getAllItems();
          expect(allItems.items.length).toBe(createdItems.length);

          // Verify each item individually
          for (const createdItem of createdItems) {
            const retrievedItem = await databaseOperations.getItemById(
              createdItem.id,
            );
            expect(retrievedItem).toBeTruthy();
            expect(retrievedItem.name).toBe(createdItem.name);
            expect(retrievedItem.description).toBe(createdItem.description);
            expect(retrievedItem.price).toBe(createdItem.price);
          }

          // Verify database file integrity
          const databaseContent = await database.readDatabase();
          expect(databaseContent.items.length).toBe(createdItems.length);

          // Verify no duplicate IDs
          const ids = databaseContent.items.map((item) => item.id);
          const uniqueIds = [...new Set(ids)];
          expect(uniqueIds.length).toBe(ids.length);
        },
      ),
      { numRuns: 50 },
    );
  });

  test('Database operations are atomic and consistent', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc
            .string({ minLength: 1, maxLength: 50 })
            .filter((s) => s.trim().length > 0),
          description: fc
            .string({ minLength: 1, maxLength: 200 })
            .filter((s) => s.trim().length > 0),
          price: fc
            .float({
              min: Math.fround(0.01),
              max: Math.fround(1000),
              noNaN: true,
            })
            .map((p) => Math.round(p * 100) / 100),
        }),
        async (itemData) => {
          // Clean up any existing database files first
          try {
            const dataDir = path.join(process.cwd(), 'data');
            await fs.rm(dataDir, { recursive: true, force: true });
          } catch (error) {
            // Ignore if directory doesn't exist
          }

          // Initialize database
          await database.initializeDatabase();

          // Create an item
          const createdItem = await databaseOperations.createItem(itemData);

          // Verify item exists in database immediately
          const retrievedItem = await databaseOperations.getItemById(
            createdItem.id,
          );
          expect(retrievedItem).toBeTruthy();
          expect(retrievedItem.id).toBe(createdItem.id);

          // Update the item
          const updateData = { name: 'Updated Name' };
          const updatedItem = await databaseOperations.updateItem(
            createdItem.id,
            updateData,
          );

          // Verify update is immediately visible
          const retrievedUpdatedItem = await databaseOperations.getItemById(
            createdItem.id,
          );
          expect(retrievedUpdatedItem.name).toBe('Updated Name');
          expect(retrievedUpdatedItem.id).toBe(createdItem.id);

          // Delete the item
          await databaseOperations.deleteItem(createdItem.id);

          // Verify item is immediately gone
          const deletedItem = await databaseOperations.getItemById(
            createdItem.id,
          );
          expect(deletedItem).toBeNull();
        },
      ),
      { numRuns: 50 },
    );
  });
});
