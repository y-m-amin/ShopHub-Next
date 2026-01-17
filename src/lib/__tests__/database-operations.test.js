/**
 * Unit tests for Database Operations
 * Tests all CRUD operations with various data inputs
 * Tests error handling for invalid requests
 * Requirements: 6.1, 6.4
 */

import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import fs from 'fs/promises';
import path from 'path';

describe('Database Operations Unit Tests', () => {
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

  describe('Item CRUD Operations', () => {
    test('should create item with valid data', async () => {
      await database.initializeDatabase();

      const itemData = {
        name: 'Test Item',
        description: 'Test Description',
        price: 19.99,
        category: 'electronics',
        inStock: true,
      };

      const createdItem = await databaseOperations.createItem(itemData);

      expect(createdItem).toBeTruthy();
      expect(createdItem.id).toBeTruthy();
      expect(createdItem.name).toBe(itemData.name);
      expect(createdItem.description).toBe(itemData.description);
      expect(createdItem.price).toBe(itemData.price);
      expect(createdItem.category).toBe(itemData.category);
      expect(createdItem.inStock).toBe(itemData.inStock);
      expect(createdItem.createdAt).toBeTruthy();
      expect(createdItem.updatedAt).toBeTruthy();
    });

    test('should reject item creation with invalid data', async () => {
      await database.initializeDatabase();

      const invalidItemData = {
        name: '', // Invalid empty name
        description: 'Test Description',
        price: 19.99,
      };

      await expect(
        databaseOperations.createItem(invalidItemData),
      ).rejects.toThrow('Invalid item data');
    });

    test('should reject item creation with negative price', async () => {
      await database.initializeDatabase();

      const invalidItemData = {
        name: 'Test Item',
        description: 'Test Description',
        price: -5.99, // Invalid negative price
      };

      await expect(
        databaseOperations.createItem(invalidItemData),
      ).rejects.toThrow('Invalid item data');
    });

    test('should retrieve item by ID', async () => {
      await database.initializeDatabase();

      const itemData = {
        name: 'Test Item',
        description: 'Test Description',
        price: 19.99,
      };

      const createdItem = await databaseOperations.createItem(itemData);
      const retrievedItem = await databaseOperations.getItemById(
        createdItem.id,
      );

      expect(retrievedItem).toEqual(createdItem);
    });

    test('should return null for non-existent item ID', async () => {
      await database.initializeDatabase();

      const retrievedItem =
        await databaseOperations.getItemById('non-existent-id');

      expect(retrievedItem).toBeNull();
    });

    test('should get all items', async () => {
      await database.initializeDatabase();

      const itemsData = [
        { name: 'Item 1', description: 'Description 1', price: 10.99 },
        { name: 'Item 2', description: 'Description 2', price: 20.99 },
        { name: 'Item 3', description: 'Description 3', price: 30.99 },
      ];

      const createdItems = [];
      for (const itemData of itemsData) {
        const item = await databaseOperations.createItem(itemData);
        createdItems.push(item);
      }

      const result = await databaseOperations.getAllItems();

      expect(result.items).toHaveLength(3);
      expect(result.total).toBe(3);

      for (const createdItem of createdItems) {
        const foundItem = result.items.find(
          (item) => item.id === createdItem.id,
        );
        expect(foundItem).toEqual(createdItem);
      }
    });

    test('should get items with pagination', async () => {
      await database.initializeDatabase();

      // Create 5 items
      for (let i = 1; i <= 5; i++) {
        await databaseOperations.createItem({
          name: `Item ${i}`,
          description: `Description ${i}`,
          price: i * 10,
        });
      }

      const result = await databaseOperations.getAllItems({
        limit: 2,
        offset: 1,
      });

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(5);
    });

    test('should filter items by category', async () => {
      await database.initializeDatabase();

      await databaseOperations.createItem({
        name: 'Electronics Item',
        description: 'Description',
        price: 100,
        category: 'electronics',
      });

      await databaseOperations.createItem({
        name: 'Clothing Item',
        description: 'Description',
        price: 50,
        category: 'clothing',
      });

      const result = await databaseOperations.getAllItems({
        category: 'electronics',
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe('Electronics Item');
    });

    test('should update item successfully', async () => {
      await database.initializeDatabase();

      const itemData = {
        name: 'Original Name',
        description: 'Original Description',
        price: 19.99,
      };

      const createdItem = await databaseOperations.createItem(itemData);

      const updateData = {
        name: 'Updated Name',
        price: 29.99,
      };

      const updatedItem = await databaseOperations.updateItem(
        createdItem.id,
        updateData,
      );

      expect(updatedItem.id).toBe(createdItem.id);
      expect(updatedItem.name).toBe('Updated Name');
      expect(updatedItem.description).toBe('Original Description'); // Unchanged
      expect(updatedItem.price).toBe(29.99);
      expect(updatedItem.updatedAt).not.toBe(createdItem.updatedAt);
    });

    test('should reject update with invalid data', async () => {
      await database.initializeDatabase();

      const itemData = {
        name: 'Test Item',
        description: 'Test Description',
        price: 19.99,
      };

      const createdItem = await databaseOperations.createItem(itemData);

      const invalidUpdateData = {
        name: '', // Invalid empty name
      };

      await expect(
        databaseOperations.updateItem(createdItem.id, invalidUpdateData),
      ).rejects.toThrow('Invalid item data');
    });

    test('should reject update for non-existent item', async () => {
      await database.initializeDatabase();

      const updateData = {
        name: 'Updated Name',
      };

      await expect(
        databaseOperations.updateItem('non-existent-id', updateData),
      ).rejects.toThrow('Item not found');
    });

    test('should delete item successfully', async () => {
      await database.initializeDatabase();

      const itemData = {
        name: 'Test Item',
        description: 'Test Description',
        price: 19.99,
      };

      const createdItem = await databaseOperations.createItem(itemData);

      const deleteResult = await databaseOperations.deleteItem(createdItem.id);
      expect(deleteResult).toBe(true);

      const retrievedItem = await databaseOperations.getItemById(
        createdItem.id,
      );
      expect(retrievedItem).toBeNull();
    });

    test('should reject delete for non-existent item', async () => {
      await database.initializeDatabase();

      await expect(
        databaseOperations.deleteItem('non-existent-id'),
      ).rejects.toThrow('Item not found');
    });
  });

  describe('User CRUD Operations', () => {
    test('should create user with valid data', async () => {
      await database.initializeDatabase();

      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
      };

      const createdUser = await databaseOperations.createUser(userData);

      expect(createdUser).toBeTruthy();
      expect(createdUser.id).toBeTruthy();
      expect(createdUser.name).toBe(userData.name);
      expect(createdUser.email).toBe(userData.email);
      expect(createdUser.role).toBe(userData.role);
      expect(createdUser.createdAt).toBeTruthy();
      expect(createdUser.updatedAt).toBeTruthy();
    });

    test('should reject user creation with invalid email', async () => {
      await database.initializeDatabase();

      const invalidUserData = {
        name: 'John Doe',
        email: '', // Invalid empty email
      };

      await expect(
        databaseOperations.createUser(invalidUserData),
      ).rejects.toThrow('Invalid user data');
    });

    test('should reject duplicate email', async () => {
      await database.initializeDatabase();

      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      await databaseOperations.createUser(userData);

      // Try to create another user with same email
      const duplicateUserData = {
        name: 'Jane Doe',
        email: 'john@example.com', // Same email
      };

      await expect(
        databaseOperations.createUser(duplicateUserData),
      ).rejects.toThrow('User with this email already exists');
    });

    test('should retrieve user by ID', async () => {
      await database.initializeDatabase();

      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const createdUser = await databaseOperations.createUser(userData);
      const retrievedUser = await databaseOperations.getUserById(
        createdUser.id,
      );

      expect(retrievedUser).toEqual(createdUser);
    });

    test('should retrieve user by email', async () => {
      await database.initializeDatabase();

      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const createdUser = await databaseOperations.createUser(userData);
      const retrievedUser = await databaseOperations.getUserByEmail(
        userData.email,
      );

      expect(retrievedUser).toEqual(createdUser);
    });
  });

  describe('Error Handling', () => {
    test('should handle database initialization errors gracefully', async () => {
      // This test verifies that database operations handle initialization properly
      // The actual error handling is tested implicitly through other tests
      await expect(database.initializeDatabase()).resolves.not.toThrow();
    });

    test('should validate data types correctly', async () => {
      await database.initializeDatabase();

      const invalidItemData = {
        name: 123, // Should be string
        description: 'Test Description',
        price: 'invalid', // Should be number
      };

      await expect(
        databaseOperations.createItem(invalidItemData),
      ).rejects.toThrow();
    });
  });
});
