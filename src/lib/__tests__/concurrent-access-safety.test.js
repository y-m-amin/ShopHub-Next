/**
 * Property-based tests for Concurrent Access Safety
 * Feature: e-commerce-platform, Property 10: Concurrent Access Safety
 * Validates: Requirements 6.7
 */

import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import fc from 'fast-check';
import fs from 'fs/promises';
import path from 'path';

describe('Concurrent Access Safety Property Tests', () => {
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
   * Property 10: Concurrent Access Safety
   * For any set of simultaneous API operations on the same data,
   * the final state should be consistent and no data should be lost or corrupted
   */
  test('Property 10: Concurrent operations maintain data consistency', async () => {
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
          // Initialize database
          await database.initializeDatabase();

          // Simulate concurrent operations by running them in parallel
          const createPromises = itemsData.map((itemData) =>
            databaseOperations.createItem(itemData),
          );

          // Wait for all operations to complete
          const createdItems = await Promise.all(createPromises);

          // Verify all items were created successfully
          expect(createdItems.length).toBe(itemsData.length);

          // Verify each item has a unique ID
          const ids = createdItems.map((item) => item.id);
          const uniqueIds = [...new Set(ids)];
          expect(uniqueIds.length).toBe(ids.length);

          // Verify all items are retrievable
          for (const createdItem of createdItems) {
            const retrievedItem = await databaseOperations.getItemById(
              createdItem.id,
            );
            expect(retrievedItem).toBeTruthy();
            expect(retrievedItem.id).toBe(createdItem.id);
          }

          // Verify database consistency
          const allItems = await databaseOperations.getAllItems();
          expect(allItems.items.length).toBe(createdItems.length);

          // Verify database file integrity
          const databaseContent = await database.readDatabase();
          expect(databaseContent.items.length).toBe(createdItems.length);

          // Verify no data corruption
          for (const createdItem of createdItems) {
            const persistedItem = databaseContent.items.find(
              (item) => item.id === createdItem.id,
            );
            expect(persistedItem).toBeTruthy();
            expect(persistedItem.name).toBe(createdItem.name);
            expect(persistedItem.description).toBe(createdItem.description);
            expect(persistedItem.price).toBe(createdItem.price);
          }
        },
      ),
      { numRuns: 30 },
    );
  });

  test('Concurrent read operations are safe', async () => {
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
          // Initialize database
          await database.initializeDatabase();

          // Create items first
          const createdItems = [];
          for (const itemData of itemsData) {
            const item = await databaseOperations.createItem(itemData);
            createdItems.push(item);
          }

          // Simulate concurrent read operations
          const readPromises = [];

          // Multiple getAllItems calls
          for (let i = 0; i < 3; i++) {
            readPromises.push(databaseOperations.getAllItems());
          }

          // Multiple getItemById calls for each item
          for (const item of createdItems) {
            for (let i = 0; i < 2; i++) {
              readPromises.push(databaseOperations.getItemById(item.id));
            }
          }

          // Execute all read operations concurrently
          const results = await Promise.all(readPromises);

          // Verify all getAllItems calls return the same data
          const getAllItemsResults = results.slice(0, 3);
          for (let i = 1; i < getAllItemsResults.length; i++) {
            expect(getAllItemsResults[i]).toEqual(getAllItemsResults[0]);
          }

          // Verify all getItemById calls return consistent data
          const getItemByIdResults = results.slice(3);
          let resultIndex = 0;
          for (const item of createdItems) {
            const itemResults = getItemByIdResults.slice(
              resultIndex,
              resultIndex + 2,
            );
            expect(itemResults[0]).toEqual(itemResults[1]);
            expect(itemResults[0]).toEqual(item);
            resultIndex += 2;
          }
        },
      ),
      { numRuns: 30 },
    );
  });

  test('Mixed concurrent operations maintain consistency', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          initialItems: fc.array(
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
            { minLength: 2, maxLength: 4 },
          ),
          newItems: fc.array(
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
            { minLength: 1, maxLength: 2 },
          ),
        }),
        async ({ initialItems, newItems }) => {
          // Initialize database
          await database.initializeDatabase();

          // Create initial items
          const createdInitialItems = [];
          for (const itemData of initialItems) {
            const item = await databaseOperations.createItem(itemData);
            createdInitialItems.push(item);
          }

          // Prepare concurrent operations
          const operations = [];

          // Add read operations
          operations.push(databaseOperations.getAllItems());
          operations.push(
            databaseOperations.getItemById(createdInitialItems[0].id),
          );

          // Add create operations
          for (const itemData of newItems) {
            operations.push(databaseOperations.createItem(itemData));
          }

          // Add update operation
          if (createdInitialItems.length > 1) {
            operations.push(
              databaseOperations.updateItem(createdInitialItems[1].id, {
                name: 'Updated Name',
              }),
            );
          }

          // Execute all operations concurrently
          const results = await Promise.all(operations);

          // Verify database consistency after concurrent operations
          const finalState = await databaseOperations.getAllItems();
          const expectedItemCount = initialItems.length + newItems.length;
          expect(finalState.items.length).toBe(expectedItemCount);

          // Verify all items have unique IDs
          const ids = finalState.items.map((item) => item.id);
          const uniqueIds = [...new Set(ids)];
          expect(uniqueIds.length).toBe(ids.length);

          // Verify database file integrity
          const databaseContent = await database.readDatabase();
          expect(databaseContent.items.length).toBe(expectedItemCount);

          // Verify no data corruption
          for (const item of finalState.items) {
            const persistedItem = databaseContent.items.find(
              (dbItem) => dbItem.id === item.id,
            );
            expect(persistedItem).toEqual(item);
          }
        },
      ),
      { numRuns: 20 },
    );
  });

  test('File locking prevents data corruption', async () => {
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
          { minLength: 3, maxLength: 6 },
        ),
        async (itemsData) => {
          // Initialize database
          await database.initializeDatabase();

          // Create items with rapid succession to test file locking
          const createPromises = itemsData.map(
            (itemData, index) =>
              // Add small delays to increase chance of concurrent access
              new Promise((resolve) =>
                setTimeout(
                  () => resolve(databaseOperations.createItem(itemData)),
                  index * 10,
                ),
              ),
          );

          // Wait for all operations to complete
          const createdItems = await Promise.all(createPromises);

          // Verify all items were created
          expect(createdItems.length).toBe(itemsData.length);

          // Verify database integrity
          const databaseContent = await database.readDatabase();
          expect(databaseContent.items.length).toBe(itemsData.length);

          // Verify JSON structure is valid (not corrupted)
          expect(Array.isArray(databaseContent.items)).toBe(true);
          expect(Array.isArray(databaseContent.users)).toBe(true);
          expect(Array.isArray(databaseContent.sessions)).toBe(true);
          expect(typeof databaseContent.metadata).toBe('object');

          // Verify all created items are in the database
          for (const createdItem of createdItems) {
            const persistedItem = databaseContent.items.find(
              (item) => item.id === createdItem.id,
            );
            expect(persistedItem).toBeTruthy();
            expect(persistedItem).toEqual(createdItem);
          }
        },
      ),
      { numRuns: 25 },
    );
  });
});
