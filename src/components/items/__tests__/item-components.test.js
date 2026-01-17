/**
 * Unit tests for Item Components
 * Tests item card rendering, item details page, and add item form
 * Requirements: 3.3, 4.2, 5.3
 */

import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AddItemForm } from '../AddItemForm';
import { ItemCard } from '../ItemCard';
import { ItemDetails } from '../ItemDetails';

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock AuthProvider
const mockAuthContext = {
  user: { id: 'test-user', email: 'test@example.com' },
  loading: false,
};

jest.mock('@/components/auth/AuthProvider', () => ({
  useAuth: () => mockAuthContext,
}));

// Mock GSAP animations
jest.mock('@/lib/animations', () => ({
  animations: {
    cardHover: jest.fn(),
    cardHoverOut: jest.fn(),
    pageEnter: jest.fn(),
  },
}));

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Item Components Unit Tests', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    mockPush.mockClear();
    fetch.mockClear();

    // Clear DOM
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = '';
  });

  describe('ItemCard Component', () => {
    const mockItem = {
      id: 'test-item-1',
      name: 'Test Item',
      description: 'This is a test item description',
      price: 29.99,
      image: 'https://example.com/image.jpg',
      category: 'Electronics',
      inStock: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    test('renders item card with all required information', () => {
      render(<ItemCard item={mockItem} />);

      // Check that all required fields are displayed
      expect(screen.getByText(mockItem.name)).toBeInTheDocument();
      expect(screen.getByText(mockItem.description)).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();
      expect(screen.getByText(mockItem.category)).toBeInTheDocument();

      // Check image
      const image = screen.getByRole('img', { name: mockItem.name });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', mockItem.image);
      expect(image).toHaveAttribute('alt', mockItem.name);

      // Check link
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', `/products/${mockItem.id}`);
    });

    test('renders item card without image (shows placeholder)', () => {
      const itemWithoutImage = { ...mockItem, image: null };
      render(<ItemCard item={itemWithoutImage} />);

      // Should show placeholder emoji
      expect(screen.getByText('📦')).toBeInTheDocument();

      // Should not have an img element
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    test('shows out of stock indicator when item is not in stock', () => {
      const outOfStockItem = { ...mockItem, inStock: false };
      render(<ItemCard item={outOfStockItem} />);

      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });

    test('renders item card without category', () => {
      const itemWithoutCategory = { ...mockItem, category: null };
      render(<ItemCard item={itemWithoutCategory} />);

      // Should still render other information
      expect(screen.getByText(mockItem.name)).toBeInTheDocument();
      expect(screen.getByText(mockItem.description)).toBeInTheDocument();
      expect(screen.getByText('$29.99')).toBeInTheDocument();

      // Category should not be present
      expect(screen.queryByText(mockItem.category)).not.toBeInTheDocument();
    });

    test('formats price correctly for different values', () => {
      const testCases = [
        { price: 0.01, expected: '$0.01' },
        { price: 10, expected: '$10.00' },
        { price: 999.99, expected: '$999.99' },
        { price: 1234.56, expected: '$1,234.56' },
      ];

      testCases.forEach(({ price, expected }) => {
        const { unmount } = render(<ItemCard item={{ ...mockItem, price }} />);
        expect(screen.getByText(expected)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('ItemDetails Component', () => {
    const mockItem = {
      id: 'test-item-1',
      name: 'Test Item Details',
      description:
        'This is a detailed test item description with more information',
      price: 49.99,
      image: 'https://example.com/detail-image.jpg',
      category: 'Electronics',
      inStock: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    };

    beforeEach(() => {
      // Mock successful API response
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          item: mockItem,
        }),
      });
    });

    test('renders item details with all information', async () => {
      render(<ItemDetails itemId={mockItem.id} />);

      // Wait for item to load
      await waitFor(() => {
        expect(screen.getByText(mockItem.name)).toBeInTheDocument();
      });

      // Check all details are displayed
      expect(screen.getByText(mockItem.description)).toBeInTheDocument();
      expect(screen.getByText('$49.99')).toBeInTheDocument();
      expect(screen.getByText(mockItem.category)).toBeInTheDocument();
      expect(screen.getByText('In Stock')).toBeInTheDocument();

      // Check breadcrumb
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Products')).toBeInTheDocument();

      // Check back button
      expect(screen.getByText('← Back to Products')).toBeInTheDocument();

      // Check action buttons
      expect(screen.getByText('Add to Cart')).toBeInTheDocument();
      expect(screen.getByText('Add to Wishlist')).toBeInTheDocument();
    });

    test('shows loading state initially', () => {
      render(<ItemDetails itemId={mockItem.id} />);

      // Should show loading skeleton
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    test('handles item not found error', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({
          success: false,
          error: 'Item not found',
        }),
      });

      render(<ItemDetails itemId='non-existent-id' />);

      await waitFor(() => {
        expect(screen.getByText('Item Not Found')).toBeInTheDocument();
      });

      expect(
        screen.getByText(
          "The item you're looking for doesn't exist or may have been removed.",
        ),
      ).toBeInTheDocument();
      expect(screen.getByText('Browse All Products')).toBeInTheDocument();
    });

    test('handles API error', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      render(<ItemDetails itemId={mockItem.id} />);

      await waitFor(() => {
        expect(
          screen.getByText('Oops! Something went wrong'),
        ).toBeInTheDocument();
      });

      expect(screen.getByText('Network error')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    test('shows out of stock state correctly', async () => {
      const outOfStockItem = { ...mockItem, inStock: false };
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          item: outOfStockItem,
        }),
      });

      render(<ItemDetails itemId={mockItem.id} />);

      await waitFor(() => {
        expect(screen.getByText('Out of Stock')).toBeInTheDocument();
      });

      // Add to cart button should be disabled
      const addToCartButton = screen.getByText('Out of Stock');
      expect(addToCartButton.closest('button')).toBeDisabled();
    });
  });

  describe('AddItemForm Component', () => {
    beforeEach(() => {
      // Mock successful API response
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          item: { id: 'new-item-id' },
        }),
      });
    });

    test('renders form with all required fields', () => {
      render(<AddItemForm />);

      // Check all form fields are present
      expect(screen.getByLabelText(/item name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/item is in stock/i)).toBeInTheDocument();

      // Check buttons
      expect(
        screen.getByRole('button', { name: /create item/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /cancel/i }),
      ).toBeInTheDocument();
    });

    test('validates required fields on submission', async () => {
      render(<AddItemForm />);

      // Submit form without filling required fields
      const submitButton = screen.getByRole('button', { name: /create item/i });
      fireEvent.click(submitButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/item name is required/i)).toBeInTheDocument();
        expect(
          screen.getByText(/description is required/i),
        ).toBeInTheDocument();
        expect(screen.getByText(/price is required/i)).toBeInTheDocument();
      });

      // Should not make API call
      expect(fetch).not.toHaveBeenCalled();
    });

    test('submits form with valid data', async () => {
      render(<AddItemForm />);

      // Fill in form with valid data
      fireEvent.change(screen.getByLabelText(/item name/i), {
        target: { value: 'Test Item' },
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'This is a test item description' },
      });
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '29.99' },
      });
      fireEvent.change(screen.getByLabelText(/image url/i), {
        target: { value: 'https://example.com/image.jpg' },
      });
      fireEvent.change(screen.getByLabelText(/category/i), {
        target: { value: 'Electronics' },
      });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create item/i });
      fireEvent.click(submitButton);

      // Should make API call with correct data
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Test Item',
            description: 'This is a test item description',
            price: 29.99,
            image: 'https://example.com/image.jpg',
            category: 'Electronics',
            inStock: true,
          }),
        });
      });

      // Should show success message
      await waitFor(() => {
        expect(screen.getByText(/created successfully/i)).toBeInTheDocument();
      });
    });

    test('clears validation errors when user starts typing', async () => {
      render(<AddItemForm />);

      // Submit form to trigger validation errors
      const submitButton = screen.getByRole('button', { name: /create item/i });
      fireEvent.click(submitButton);

      // Wait for validation errors
      await waitFor(() => {
        expect(screen.getByText(/item name is required/i)).toBeInTheDocument();
      });

      // Start typing in name field
      const nameInput = screen.getByLabelText(/item name/i);
      fireEvent.change(nameInput, { target: { value: 'Test' } });

      // Name error should be cleared
      await waitFor(() => {
        expect(
          screen.queryByText(/item name is required/i),
        ).not.toBeInTheDocument();
      });
    });

    test('handles API error during submission', async () => {
      fetch.mockRejectedValue(new Error('Server error'));

      render(<AddItemForm />);

      // Fill in valid form data
      fireEvent.change(screen.getByLabelText(/item name/i), {
        target: { value: 'Test Item' },
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'This is a test item description' },
      });
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '29.99' },
      });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create item/i });
      fireEvent.click(submitButton);

      // Should show error message
      await waitFor(() => {
        expect(screen.getByText(/server error/i)).toBeInTheDocument();
      });
    });

    test('validates price field correctly', async () => {
      render(<AddItemForm />);

      const priceInput = screen.getByLabelText(/price/i);
      const submitButton = screen.getByRole('button', { name: /create item/i });

      // Test invalid price values
      const invalidPrices = ['abc', '-10', ''];

      for (const invalidPrice of invalidPrices) {
        // Clear previous errors
        document.body.innerHTML = '';
        render(<AddItemForm />);

        const newPriceInput = screen.getByLabelText(/price/i);
        const newSubmitButton = screen.getByRole('button', {
          name: /create item/i,
        });

        fireEvent.change(newPriceInput, { target: { value: invalidPrice } });
        fireEvent.click(newSubmitButton);

        await waitFor(() => {
          const errorMessages = screen.getAllByText(/price/i);
          expect(errorMessages.length).toBeGreaterThan(1); // Label + error message
        });
      }
    });

    test('validates URL field correctly', async () => {
      render(<AddItemForm />);

      // Fill required fields
      fireEvent.change(screen.getByLabelText(/item name/i), {
        target: { value: 'Test Item' },
      });
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'This is a test item description' },
      });
      fireEvent.change(screen.getByLabelText(/price/i), {
        target: { value: '29.99' },
      });

      // Enter invalid URL
      fireEvent.change(screen.getByLabelText(/image url/i), {
        target: { value: 'not-a-valid-url' },
      });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create item/i });
      fireEvent.click(submitButton);

      // Should show URL validation error
      await waitFor(() => {
        expect(screen.getByText(/valid url/i)).toBeInTheDocument();
      });
    });
  });
});
