/**
 * Property-based tests for API Data Persistence
 * Feature: e-commerce-platform, Property 5: API Data Persistence
 * Validates: Requirements 5.4, 6.3
 */

import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import fc from 'fast-check';
import fs from 'fs/promises';
import path from 'path';

describe('API Data Persistence Property Tests', () => {
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
   * Property 5: API Data Persistence
   * For any valid item created through the API, the item should be retrievable
   * through subsequent API calls and persist in the JSON database
   */
  test('Property 5: API data persistence across operations', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
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
          image: fc.option(fc.webUrl()),
        }),
        async (itemData) => {
          // Initialize database
          await database.initializeDatabase();

          // Create an item through the database operations (simulating API)
          const createdItem = await databaseOperations.createItem(itemData);

          // Verify the item was created with correct data (sanitized)
          expect(createdItem).toBeTruthy();
          expect(createdItem.id).toBeTruthy();
          expect(createdItem.name).toBe(itemData.name.trim());
          expect(createdItem.description).toBe(itemData.description.trim());
          expect(createdItem.price).toBe(
            Math.round(itemData.price * 100) / 100,
          );
          expect(createdItem.category).toBe(itemData.category || null);
          expect(createdItem.inStock).toBe(itemData.inStock);
          expect(createdItem.image).toBe(itemData.image || null);

          // Verify the item is immediately retrievable
          const retrievedItem = await databaseOperations.getItemById(
            createdItem.id,
          );
          expect(retrievedItem).toEqual(createdItem);

          // Verify the item persists in the database file
          const databaseContent = await database.readDatabase();
          const persistedItem = databaseContent.items.find(
            (item) => item.id === createdItem.id,
          );
          expect(persistedItem).toBeTruthy();
          expect(persistedItem.name).toBe(itemData.name.trim());
          expect(persistedItem.description).toBe(itemData.description.trim());
          expect(persistedItem.price).toBe(
            Math.round(itemData.price * 100) / 100,
          );

          // Verify the item appears in getAllItems
          const allItems = await databaseOperations.getAllItems();
          const foundItem = allItems.items.find(
            (item) => item.id === createdItem.id,
          );
          expect(foundItem).toBeTruthy();
          expect(foundItem).toEqual(createdItem);
        },
      ),
      { numRuns: 50 },
    );
  });

  test('Item updates persist correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // Initial item data
          initial: fc.record({
            name: fc
              .string({ minLength: 1, maxLength: 100 })
              .filter((s) => s.trim().length > 0),
            description: fc
              .string({ minLength: 1, maxLength: 500 })
              .filter((s) => s.trim().length > 0),
            price: fc
              .float({
                min: Math.fround(0.01),
                max: Math.fround(1000),
                noNaN: true,
              })
              .map((p) => Math.round(p * 100) / 100),
          }),
          // Update data
          update: fc.record({
            name: fc.option(
              fc
                .string({ minLength: 1, maxLength: 100 })
                .filter((s) => s.trim().length > 0),
            ),
            description: fc.option(
              fc
                .string({ minLength: 1, maxLength: 500 })
                .filter((s) => s.trim().length > 0),
            ),
            price: fc.option(
              fc
                .float({
                  min: Math.fround(0.01),
                  max: Math.fround(1000),
                  noNaN: true,
                })
                .map((p) => Math.round(p * 100) / 100),
            ),
          }),
        }),
        async ({ initial, update }) => {
          // Initialize database
          await database.initializeDatabase();

          // Create initial item
          const createdItem = await databaseOperations.createItem(initial);

          // Prepare update data (only include defined values)
          const updateData = {};
          if (update.name !== null) updateData.name = update.name;
          if (update.description !== null)
            updateData.description = update.description;
          if (update.price !== null) updateData.price = update.price;

          // Skip test if no updates to apply
          if (Object.keys(updateData).length === 0) {
            return;
          }

          // Update the item
          const updatedItem = await databaseOperations.updateItem(
            createdItem.id,
            updateData,
          );

          // Verify update was applied
          expect(updatedItem.id).toBe(createdItem.id);
          if (updateData.name) expect(updatedItem.name).toBe(updateData.name);
          if (updateData.description)
            expect(updatedItem.description).toBe(updateData.description);
          if (updateData.price)
            expect(updatedItem.price).toBe(updateData.price);

          // Verify update persists in retrieval
          const retrievedItem = await databaseOperations.getItemById(
            createdItem.id,
          );
          expect(retrievedItem).toEqual(updatedItem);

          // Verify update persists in database file
          const databaseContent = await database.readDatabase();
          const persistedItem = databaseContent.items.find(
            (item) => item.id === createdItem.id,
          );
          expect(persistedItem).toEqual(updatedItem);
        },
      ),
      { numRuns: 50 },
    );
  });

  test('Item deletion removes data permanently', async () => {
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
          // Initialize database
          await database.initializeDatabase();

          // Create an item
          const createdItem = await databaseOperations.createItem(itemData);

          // Verify item exists
          const beforeDelete = await databaseOperations.getItemById(
            createdItem.id,
          );
          expect(beforeDelete).toBeTruthy();

          // Delete the item
          await databaseOperations.deleteItem(createdItem.id);

          // Verify item is no longer retrievable
          const afterDelete = await databaseOperations.getItemById(
            createdItem.id,
          );
          expect(afterDelete).toBeNull();

          // Verify item is removed from getAllItems
          const allItems = await databaseOperations.getAllItems();
          const foundItem = allItems.items.find(
            (item) => item.id === createdItem.id,
          );
          expect(foundItem).toBeUndefined();

          // Verify item is removed from database file
          const databaseContent = await database.readDatabase();
          const persistedItem = databaseContent.items.find(
            (item) => item.id === createdItem.id,
          );
          expect(persistedItem).toBeUndefined();
        },
      ),
      { numRuns: 50 },
    );
  });

  test('Multiple items persist independently', async () => {
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
          { minLength: 2, maxLength: 5 },
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

          // Create all items
          const createdItems = [];
          for (const itemData of itemsData) {
            const item = await databaseOperations.createItem(itemData);
            createdItems.push(item);
          }

          // Verify all items are retrievable individually
          for (const createdItem of createdItems) {
            const retrievedItem = await databaseOperations.getItemById(
              createdItem.id,
            );
            expect(retrievedItem).toEqual(createdItem);
          }

          // Verify all items appear in getAllItems
          const allItems = await databaseOperations.getAllItems();
          expect(allItems.items.length).toBe(createdItems.length);

          for (const createdItem of createdItems) {
            const foundItem = allItems.items.find(
              (item) => item.id === createdItem.id,
            );
            expect(foundItem).toEqual(createdItem);
          }

          // Verify all items persist in database file
          const databaseContent = await database.readDatabase();
          expect(databaseContent.items.length).toBe(createdItems.length);

          for (const createdItem of createdItems) {
            const persistedItem = databaseContent.items.find(
              (item) => item.id === createdItem.id,
            );
            expect(persistedItem).toEqual(createdItem);
          }
        },
      ),
      { numRuns: 30 },
    );
  });
});
