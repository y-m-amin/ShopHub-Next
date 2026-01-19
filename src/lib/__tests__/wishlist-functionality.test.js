/**
 * @jest-environment jsdom
 */

import { apiService } from '../../../services/apiService';

// Mock fetch for testing
global.fetch = jest.fn();

describe('Wishlist Functionality', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('apiService.getWishlist', () => {
    it('should fetch user wishlist successfully', async () => {
      const mockWishlistData = [
        {
          id: 1,
          userId: 'user@nexus.com',
          productId: '1',
          name: 'Test Product',
          price: '99.99',
          image: 'test.jpg',
          verified: true,
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWishlistData,
      });

      const result = await apiService.getWishlist('user@nexus.com');
      
      expect(fetch).toHaveBeenCalledWith('/api/wishlist/user@nexus.com', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockWishlistData);
    });

    it('should handle empty wishlist', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await apiService.getWishlist('user@nexus.com');
      expect(result).toEqual([]);
    });

    it('should handle API errors gracefully', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' }),
      });

      await expect(apiService.getWishlist('user@nexus.com')).rejects.toThrow();
    });
  });

  describe('apiService.toggleWishlist', () => {
    it('should add item to wishlist', async () => {
      const mockResponse = { action: 'added' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.toggleWishlist('user@nexus.com', '1');
      
      expect(fetch).toHaveBeenCalledWith('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user@nexus.com',
          productId: '1',
          action: 'toggle'
        }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should remove item from wishlist', async () => {
      const mockResponse = { action: 'removed' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await apiService.toggleWishlist('user@nexus.com', '1');
      expect(result).toEqual(mockResponse);
    });
  });
});