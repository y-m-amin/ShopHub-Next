/**
 * Unit tests for Items API endpoints
 * Tests all CRUD operations with various data inputs
 * Tests error handling for invalid requests
 * Tests authentication requirements for protected endpoints
 * Requirements: 6.1, 6.4
 */

import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { NextRequest } from 'next/server';

// Mock the database operations
jest.mock('@/lib/database-operations.js');
jest.mock('next/headers');

describe('Items API Endpoints', () => {
  let mockCreateItem,
    mockGetAllItems,
    mockGetItemById,
    mockUpdateItem,
    mockDeleteItem;
  let mockCookies;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock database operations
    const databaseOperations = require('@/lib/database-operations.js');
    mockCreateItem = databaseOperations.createItem = jest.fn();
    mockGetAllItems = databaseOperations.getAllItems = jest.fn();
    mockGetItemById = databaseOperations.getItemById = jest.fn();
    mockUpdateItem = databaseOperations.updateItem = jest.fn();
    mockDeleteItem = databaseOperations.deleteItem = jest.fn();

    // Mock cookies
    const headers = require('next/headers');
    mockCookies = jest.fn();
    headers.cookies = jest.fn(() => Promise.resolve(mockCookies));
  });

  describe('GET /api/items', () => {
    test('should return all items successfully', async () => {
      // Mock data
      const mockItems = [
        { id: '1', name: 'Item 1', description: 'Description 1', price: 10.99 },
        { id: '2', name: 'Item 2', description: 'Description 2', price: 20.99 },
      ];

      mockGetAllItems.mockResolvedValue({
        items: mockItems,
        total: 2,
      });

      // Import and test the GET handler
      const { GET } = await import('../items/route.js');
      const request = new NextRequest('http://localhost:3000/api/items');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.items).toEqual(mockItems);
      expect(data.total).toBe(2);
      expect(mockGetAllItems).toHaveBeenCalledWith({
        limit: undefined,
        offset: undefined,
        category: undefined,
        inStock: undefined,
      });
    });

    test('should handle query parameters correctly', async () => {
      mockGetAllItems.mockResolvedValue({ items: [], total: 0 });

      const { GET } = await import('../items/route.js');
      const request = new NextRequest(
        'http://localhost:3000/api/items?limit=10&offset=5&category=electronics&inStock=true',
      );

      await GET(request);

      expect(mockGetAllItems).toHaveBeenCalledWith({
        limit: 10,
        offset: 5,
        category: 'electronics',
        inStock: true,
      });
    });

    test('should handle database errors', async () => {
      mockGetAllItems.mockRejectedValue(
        new Error('Database connection failed'),
      );

      const { GET } = await import('../items/route.js');
      const request = new NextRequest('http://localhost:3000/api/items');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to fetch items');
    });
  });

  describe('POST /api/items', () => {
    test('should create item successfully with authentication', async () => {
      // Mock authentication
      mockCookies.get = jest
        .fn()
        .mockReturnValue({ value: 'valid-session-token' });

      const newItem = {
        id: '123',
        name: 'New Item',
        description: 'New Description',
        price: 15.99,
        createdAt: new Date().toISOString(),
      };

      mockCreateItem.mockResolvedValue(newItem);

      const { POST } = await import('../items/route.js');
      const request = new NextRequest('http://localhost:3000/api/items', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Item',
          description: 'New Description',
          price: 15.99,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.item).toEqual(newItem);
      expect(mockCreateItem).toHaveBeenCalledWith({
        name: 'New Item',
        description: 'New Description',
        price: 15.99,
        image: null,
        category: null,
        inStock: true,
        createdBy: 'valid-session-token',
      });
    });

    test('should reject request without authentication', async () => {
      // Mock no authentication
      mockCookies.get = jest.fn().mockReturnValue(undefined);

      const { POST } = await import('../items/route.js');
      const request = new NextRequest('http://localhost:3000/api/items', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Item',
          description: 'New Description',
          price: 15.99,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Authentication required');
      expect(mockCreateItem).not.toHaveBeenCalled();
    });

    test('should validate required fields', async () => {
      mockCookies.get = jest
        .fn()
        .mockReturnValue({ value: 'valid-session-token' });

      const { POST } = await import('../items/route.js');
      const request = new NextRequest('http://localhost:3000/api/items', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Item',
          // Missing description and price
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid input');
      expect(mockCreateItem).not.toHaveBeenCalled();
    });

    test('should validate price is non-negative', async () => {
      mockCookies.get = jest
        .fn()
        .mockReturnValue({ value: 'valid-session-token' });

      const { POST } = await import('../items/route.js');
      const request = new NextRequest('http://localhost:3000/api/items', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Item',
          description: 'New Description',
          price: -5.99,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid input');
      expect(data.message).toBe('Price must be a non-negative number');
      expect(mockCreateItem).not.toHaveBeenCalled();
    });

    test('should handle database validation errors', async () => {
      mockCookies.get = jest
        .fn()
        .mockReturnValue({ value: 'valid-session-token' });
      mockCreateItem.mockRejectedValue(
        new Error('Invalid item data: Name is required'),
      );

      const { POST } = await import('../items/route.js');
      const request = new NextRequest('http://localhost:3000/api/items', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Item',
          description: 'New Description',
          price: 15.99,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation error');
    });
  });

  describe('GET /api/items/[id]', () => {
    test('should return specific item successfully', async () => {
      const mockItem = {
        id: '123',
        name: 'Test Item',
        description: 'Test Description',
        price: 25.99,
      };

      mockGetItemById.mockResolvedValue(mockItem);

      const { GET } = await import('../items/[id]/route.js');
      const request = new NextRequest('http://localhost:3000/api/items/123');
      const params = { id: '123' };

      const response = await GET(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.item).toEqual(mockItem);
      expect(mockGetItemById).toHaveBeenCalledWith('123');
    });

    test('should return 404 for non-existent item', async () => {
      mockGetItemById.mockResolvedValue(null);

      const { GET } = await import('../items/[id]/route.js');
      const request = new NextRequest('http://localhost:3000/api/items/999');
      const params = { id: '999' };

      const response = await GET(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Item not found');
    });

    test('should handle database errors', async () => {
      mockGetItemById.mockRejectedValue(new Error('Database error'));

      const { GET } = await import('../items/[id]/route.js');
      const request = new NextRequest('http://localhost:3000/api/items/123');
      const params = { id: '123' };

      const response = await GET(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to fetch item');
    });
  });

  describe('PUT /api/items/[id]', () => {
    test('should update item successfully with authentication', async () => {
      mockCookies.get = jest
        .fn()
        .mockReturnValue({ value: 'valid-session-token' });

      const existingItem = {
        id: '123',
        name: 'Old Name',
        description: 'Old Description',
        price: 10.99,
      };

      const updatedItem = {
        id: '123',
        name: 'New Name',
        description: 'Old Description',
        price: 10.99,
      };

      mockGetItemById.mockResolvedValue(existingItem);
      mockUpdateItem.mockResolvedValue(updatedItem);

      const { PUT } = await import('../items/[id]/route.js');
      const request = new NextRequest('http://localhost:3000/api/items/123', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'New Name',
        }),
      });
      const params = { id: '123' };

      const response = await PUT(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.item).toEqual(updatedItem);
      expect(mockUpdateItem).toHaveBeenCalledWith('123', { name: 'New Name' });
    });

    test('should reject update without authentication', async () => {
      mockCookies.get = jest.fn().mockReturnValue(undefined);

      const { PUT } = await import('../items/[id]/route.js');
      const request = new NextRequest('http://localhost:3000/api/items/123', {
        method: 'PUT',
        body: JSON.stringify({ name: 'New Name' }),
      });
      const params = { id: '123' };

      const response = await PUT(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Authentication required');
      expect(mockUpdateItem).not.toHaveBeenCalled();
    });

    test('should return 404 for non-existent item', async () => {
      mockCookies.get = jest
        .fn()
        .mockReturnValue({ value: 'valid-session-token' });
      mockGetItemById.mockResolvedValue(null);

      const { PUT } = await import('../items/[id]/route.js');
      const request = new NextRequest('http://localhost:3000/api/items/999', {
        method: 'PUT',
        body: JSON.stringify({ name: 'New Name' }),
      });
      const params = { id: '999' };

      const response = await PUT(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Item not found');
      expect(mockUpdateItem).not.toHaveBeenCalled();
    });

    test('should validate update data', async () => {
      mockCookies.get = jest
        .fn()
        .mockReturnValue({ value: 'valid-session-token' });
      mockGetItemById.mockResolvedValue({ id: '123', name: 'Test' });

      const { PUT } = await import('../items/[id]/route.js');
      const request = new NextRequest('http://localhost:3000/api/items/123', {
        method: 'PUT',
        body: JSON.stringify({
          name: '', // Invalid empty name
        }),
      });
      const params = { id: '123' };

      const response = await PUT(request, { params: Promise.resolve(params) });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid input');
      expect(mockUpdateItem).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /api/items/[id]', () => {
    test('should delete item successfully with authentication', async () => {
      mockCookies.get = jest
        .fn()
        .mockReturnValue({ value: 'valid-session-token' });

      const existingItem = {
        id: '123',
        name: 'Test Item',
        description: 'Test Description',
        price: 10.99,
      };

      mockGetItemById.mockResolvedValue(existingItem);
      mockDeleteItem.mockResolvedValue(true);

      const { DELETE } = await import('../items/[id]/route.js');
      const request = new NextRequest('http://localhost:3000/api/items/123', {
        method: 'DELETE',
      });
      const params = { id: '123' };

      const response = await DELETE(request, {
        params: Promise.resolve(params),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Item deleted successfully');
      expect(mockDeleteItem).toHaveBeenCalledWith('123');
    });

    test('should reject delete without authentication', async () => {
      mockCookies.get = jest.fn().mockReturnValue(undefined);

      const { DELETE } = await import('../items/[id]/route.js');
      const request = new NextRequest('http://localhost:3000/api/items/123', {
        method: 'DELETE',
      });
      const params = { id: '123' };

      const response = await DELETE(request, {
        params: Promise.resolve(params),
      });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Authentication required');
      expect(mockDeleteItem).not.toHaveBeenCalled();
    });

    test('should return 404 for non-existent item', async () => {
      mockCookies.get = jest
        .fn()
        .mockReturnValue({ value: 'valid-session-token' });
      mockGetItemById.mockResolvedValue(null);

      const { DELETE } = await import('../items/[id]/route.js');
      const request = new NextRequest('http://localhost:3000/api/items/999', {
        method: 'DELETE',
      });
      const params = { id: '999' };

      const response = await DELETE(request, {
        params: Promise.resolve(params),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Item not found');
      expect(mockDeleteItem).not.toHaveBeenCalled();
    });
  });
});
