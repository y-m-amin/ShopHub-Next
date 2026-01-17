/**
 * Property-based tests for Form Validation Enforcement
 * Feature: e-commerce-platform, Property 6: Form Validation Enforcement
 * Validates: Requirements 5.7
 */

import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import { AddItemForm } from '../AddItemForm';

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
    pageEnter: jest.fn(),
  },
}));

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Form Validation Enforcement Property Tests', () => {
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

  /**
   * Property 6: Form Validation Enforcement
   * For any form submission with missing required fields, the system should
   * prevent submission and display appropriate validation errors
   */
  test('Property 6: Form validation prevents submission with invalid data', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.oneof(
            // Invalid names: empty, too short, too long
            fc.constant(''),
            fc.constant('   '), // whitespace only
            fc.string({ maxLength: 1 }),
            fc.string({ minLength: 101, maxLength: 200 }),
          ),
          description: fc.oneof(
            // Invalid descriptions: empty, too short, too long
            fc.constant(''),
            fc.constant('   '), // whitespace only
            fc.string({ maxLength: 9 }),
            fc.string({ minLength: 501, maxLength: 1000 }),
          ),
          price: fc.oneof(
            // Invalid prices: empty, non-numeric, negative, too large
            fc.constant(''),
            fc.constant('not-a-number'),
            fc.constant('-10'),
            fc.constant('1000000'), // too large
          ),
          image: fc.oneof(
            // Invalid URLs (when provided)
            fc.constant('not-a-url'),
            fc.constant('ftp://invalid-protocol.com'),
            fc.constant('just-text'),
          ),
          category: fc.oneof(
            // Invalid categories: too long
            fc.string({ minLength: 51, maxLength: 100 }),
          ),
        }),
        async (invalidData) => {
          // Render the AddItemForm
          render(<AddItemForm />);

          // Wait for form to be rendered
          await waitFor(() => {
            expect(
              screen.getByRole('button', { name: /create item/i }),
            ).toBeInTheDocument();
          });

          // Fill in the form with invalid data
          const nameInput = screen.getByLabelText(/item name/i);
          const descriptionInput = screen.getByLabelText(/description/i);
          const priceInput = screen.getByLabelText(/price/i);
          const imageInput = screen.getByLabelText(/image url/i);
          const categoryInput = screen.getByLabelText(/category/i);

          fireEvent.change(nameInput, { target: { value: invalidData.name } });
          fireEvent.change(descriptionInput, {
            target: { value: invalidData.description },
          });
          fireEvent.change(priceInput, {
            target: { value: invalidData.price },
          });
          fireEvent.change(imageInput, {
            target: { value: invalidData.image },
          });
          fireEvent.change(categoryInput, {
            target: { value: invalidData.category },
          });

          // Attempt to submit the form
          const submitButton = screen.getByRole('button', {
            name: /create item/i,
          });
          fireEvent.click(submitButton);

          // Wait for validation to complete
          await waitFor(() => {
            // Form should not have been submitted (no API call should be made)
            expect(fetch).not.toHaveBeenCalled();
          });

          // Verify that validation errors are displayed
          const errorMessages = screen.getAllByText(
            /required|must be|invalid|valid/i,
          );
          expect(errorMessages.length).toBeGreaterThan(0);

          // Verify that the form is still visible (not redirected)
          expect(
            screen.getByRole('button', { name: /create item/i }),
          ).toBeInTheDocument();
          expect(mockPush).not.toHaveBeenCalled();
        },
      ),
      { numRuns: 50 },
    );
  });

  test('Form validation shows specific error messages for each field', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          testCase: fc.oneof(
            fc.constant('empty-name'),
            fc.constant('short-name'),
            fc.constant('long-name'),
            fc.constant('empty-description'),
            fc.constant('short-description'),
            fc.constant('long-description'),
            fc.constant('empty-price'),
            fc.constant('invalid-price'),
            fc.constant('negative-price'),
            fc.constant('large-price'),
            fc.constant('invalid-url'),
            fc.constant('long-category'),
          ),
        }),
        async ({ testCase }) => {
          // Render the AddItemForm
          render(<AddItemForm />);

          await waitFor(() => {
            expect(
              screen.getByRole('button', { name: /create item/i }),
            ).toBeInTheDocument();
          });

          // Get form inputs
          const nameInput = screen.getByLabelText(/item name/i);
          const descriptionInput = screen.getByLabelText(/description/i);
          const priceInput = screen.getByLabelText(/price/i);
          const imageInput = screen.getByLabelText(/image url/i);
          const categoryInput = screen.getByLabelText(/category/i);

          // Set up test data based on test case
          const testData = {
            name: 'Valid Name',
            description:
              'Valid description that is long enough to pass validation',
            price: '10.00',
            image: 'https://example.com/image.jpg',
            category: 'Valid Category',
          };

          // Modify one field to be invalid based on test case
          switch (testCase) {
            case 'empty-name':
              testData.name = '';
              break;
            case 'short-name':
              testData.name = 'A';
              break;
            case 'long-name':
              testData.name = 'A'.repeat(101);
              break;
            case 'empty-description':
              testData.description = '';
              break;
            case 'short-description':
              testData.description = 'Short';
              break;
            case 'long-description':
              testData.description = 'A'.repeat(501);
              break;
            case 'empty-price':
              testData.price = '';
              break;
            case 'invalid-price':
              testData.price = 'not-a-number';
              break;
            case 'negative-price':
              testData.price = '-10';
              break;
            case 'large-price':
              testData.price = '1000000';
              break;
            case 'invalid-url':
              testData.image = 'not-a-url';
              break;
            case 'long-category':
              testData.category = 'A'.repeat(51);
              break;
          }

          // Fill in the form
          fireEvent.change(nameInput, { target: { value: testData.name } });
          fireEvent.change(descriptionInput, {
            target: { value: testData.description },
          });
          fireEvent.change(priceInput, { target: { value: testData.price } });
          fireEvent.change(imageInput, { target: { value: testData.image } });
          fireEvent.change(categoryInput, {
            target: { value: testData.category },
          });

          // Submit the form
          const submitButton = screen.getByRole('button', {
            name: /create item/i,
          });
          fireEvent.click(submitButton);

          // Wait for validation
          await waitFor(() => {
            // Should show appropriate error message
            const errorMessages = screen.getAllByText(
              /required|must be|invalid|valid/i,
            );
            expect(errorMessages.length).toBeGreaterThan(0);
          });

          // Verify no API call was made
          expect(fetch).not.toHaveBeenCalled();

          // Verify specific error messages based on test case
          switch (testCase) {
            case 'empty-name':
            case 'short-name':
            case 'long-name':
              expect(screen.getByText(/name/i)).toBeInTheDocument();
              break;
            case 'empty-description':
            case 'short-description':
            case 'long-description':
              expect(screen.getByText(/description/i)).toBeInTheDocument();
              break;
            case 'empty-price':
            case 'invalid-price':
            case 'negative-price':
            case 'large-price':
              expect(screen.getByText(/price/i)).toBeInTheDocument();
              break;
            case 'invalid-url':
              expect(screen.getByText(/url/i)).toBeInTheDocument();
              break;
            case 'long-category':
              expect(screen.getByText(/category/i)).toBeInTheDocument();
              break;
          }
        },
      ),
      { numRuns: 30 },
    );
  });

  test('Form validation allows submission with valid data', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc
            .string({ minLength: 2, maxLength: 100 })
            .filter((s) => s.trim().length >= 2),
          description: fc
            .string({ minLength: 10, maxLength: 500 })
            .filter((s) => s.trim().length >= 10),
          price: fc
            .float({ min: 0.01, max: 999999, noNaN: true })
            .map((p) => p.toFixed(2)),
          image: fc.option(fc.webUrl()),
          category: fc.option(
            fc
              .string({ minLength: 1, maxLength: 50 })
              .filter((s) => s.trim().length > 0),
          ),
          inStock: fc.boolean(),
        }),
        async (validData) => {
          // Mock successful API response
          fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
              success: true,
              item: { id: 'test-id', ...validData },
            }),
          });

          // Render the AddItemForm
          render(<AddItemForm />);

          await waitFor(() => {
            expect(
              screen.getByRole('button', { name: /create item/i }),
            ).toBeInTheDocument();
          });

          // Fill in the form with valid data
          const nameInput = screen.getByLabelText(/item name/i);
          const descriptionInput = screen.getByLabelText(/description/i);
          const priceInput = screen.getByLabelText(/price/i);
          const imageInput = screen.getByLabelText(/image url/i);
          const categoryInput = screen.getByLabelText(/category/i);
          const inStockCheckbox = screen.getByLabelText(/item is in stock/i);

          fireEvent.change(nameInput, { target: { value: validData.name } });
          fireEvent.change(descriptionInput, {
            target: { value: validData.description },
          });
          fireEvent.change(priceInput, { target: { value: validData.price } });
          fireEvent.change(imageInput, {
            target: { value: validData.image || '' },
          });
          fireEvent.change(categoryInput, {
            target: { value: validData.category || '' },
          });

          if (inStockCheckbox.checked !== validData.inStock) {
            fireEvent.click(inStockCheckbox);
          }

          // Submit the form
          const submitButton = screen.getByRole('button', {
            name: /create item/i,
          });
          fireEvent.click(submitButton);

          // Wait for submission to complete
          await waitFor(() => {
            // API should have been called
            expect(fetch).toHaveBeenCalledWith('/api/items', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: validData.name.trim(),
                description: validData.description.trim(),
                price: parseFloat(validData.price),
                image: validData.image || null,
                category: validData.category || null,
                inStock: validData.inStock,
              }),
            });
          });

          // Should show success message
          await waitFor(() => {
            expect(
              screen.getByText(/created successfully/i),
            ).toBeInTheDocument();
          });
        },
      ),
      { numRuns: 30 },
    );
  });

  test('Form validation clears errors when user corrects input', async () => {
    // Render the AddItemForm
    render(<AddItemForm />);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /create item/i }),
      ).toBeInTheDocument();
    });

    // Submit form with empty fields to trigger validation errors
    const submitButton = screen.getByRole('button', { name: /create item/i });
    fireEvent.click(submitButton);

    // Wait for validation errors to appear
    await waitFor(() => {
      const errorMessages = screen.getAllByText(/required/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    // Start typing in name field
    const nameInput = screen.getByLabelText(/item name/i);
    fireEvent.change(nameInput, { target: { value: 'Valid Name' } });

    // Name error should be cleared
    await waitFor(() => {
      // The specific name error should be gone, but other errors may remain
      const nameErrors = screen.queryAllByText(/name.*required/i);
      expect(nameErrors.length).toBe(0);
    });

    // Start typing in description field
    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, {
      target: { value: 'Valid description that is long enough' },
    });

    // Description error should be cleared
    await waitFor(() => {
      const descriptionErrors = screen.queryAllByText(/description.*required/i);
      expect(descriptionErrors.length).toBe(0);
    });
  });
});
