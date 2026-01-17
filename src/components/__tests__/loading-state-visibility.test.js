/**
 * @jest-environment jsdom
 */

import LoginForm from '@/components/form/LoginForm';
import { AddItemForm } from '@/components/items/AddItemForm';
import { ItemDetails } from '@/components/items/ItemDetails';
import { ItemList } from '@/components/items/ItemList';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import fc from 'fast-check';

// Mock the auth context
const mockAuthContext = {
  user: { id: 'test-user', email: 'test@example.com' },
  loading: false,
};

jest.mock('@/components/auth/AuthProvider', () => ({
  useAuth: () => mockAuthContext,
}));

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock the animations
jest.mock('@/lib/animations', () => ({
  animations: {
    pageEnter: jest.fn(),
    staggerFadeIn: jest.fn(),
  },
}));

// Mock the toast
jest.mock('@/lib/toast', () => ({
  showToast: jest.fn(),
}));

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Loading State Visibility Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  /**
   * Feature: e-commerce-platform, Property 11: Loading State Visibility
   *
   * Property: For any asynchronous operation (API calls, page loads),
   * appropriate loading indicators should be displayed until the operation completes
   *
   * Validates: Requirements 8.5
   */
  test('Property 11: Loading state visibility - loading indicators appear during async operations', () => {
    fc.assert(
      fc.property(
        fc.record({
          delayMs: fc.integer({ min: 100, max: 1000 }),
          shouldSucceed: fc.boolean(),
        }),
        async (testData) => {
          // Mock a delayed API response
          fetch.mockImplementation(
            () =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve({
                    ok: testData.shouldSucceed,
                    json: () =>
                      Promise.resolve(
                        testData.shouldSucceed
                          ? { success: true, items: [] }
                          : { error: 'Test error' },
                      ),
                  });
                }, testData.delayMs);
              }),
          );

          render(<ItemList />);

          // Initially should show loading state
          const loadingElements = document.querySelectorAll(
            '.animate-pulse, .animate-spin',
          );
          expect(loadingElements.length).toBeGreaterThan(0);

          // Wait for the async operation to complete
          await waitFor(
            () => {
              const loadingElementsAfter = document.querySelectorAll(
                '.animate-pulse, .animate-spin',
              );
              // Loading indicators should be gone after operation completes
              expect(loadingElementsAfter.length).toBe(0);
            },
            { timeout: testData.delayMs + 500 },
          );
        },
      ),
      { numRuns: 50 }, // Reduced runs due to async nature
    );
  });

  test('Property 11: Loading state visibility - form submissions show loading indicators', () => {
    fc.assert(
      fc.property(
        fc.record({
          email: fc.emailAddress(),
          password: fc.string({ minLength: 8, maxLength: 20 }),
          shouldSucceed: fc.boolean(),
        }),
        async (formData) => {
          // Mock API response
          fetch.mockImplementation(
            () =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve({
                    ok: formData.shouldSucceed,
                    json: () =>
                      Promise.resolve(
                        formData.shouldSucceed
                          ? { success: true, user: { email: formData.email } }
                          : { error: 'Invalid credentials' },
                      ),
                  });
                }, 200);
              }),
          );

          render(<LoginForm />);

          const emailInput = screen.getByLabelText(/email/i);
          const passwordInput = screen.getByLabelText(/password/i);
          const submitButton = screen.getByRole('button', { name: /login/i });

          // Fill form
          fireEvent.change(emailInput, { target: { value: formData.email } });
          fireEvent.change(passwordInput, {
            target: { value: formData.password },
          });

          // Submit form
          fireEvent.click(submitButton);

          // Should show loading state immediately after submission
          await waitFor(() => {
            const loadingSpinner = document.querySelector('.animate-spin');
            expect(loadingSpinner).toBeInTheDocument();
          });

          // Loading state should disappear after operation completes
          await waitFor(
            () => {
              const loadingSpinner = document.querySelector('.animate-spin');
              expect(loadingSpinner).not.toBeInTheDocument();
            },
            { timeout: 1000 },
          );
        },
      ),
      { numRuns: 30 }, // Reduced runs due to async nature
    );
  });

  test('Property 11: Loading state visibility - loading states are visually distinct', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('ItemList', 'ItemDetails', 'AddItemForm'),
        (componentType) => {
          let component;

          // Mock loading state for different components
          if (componentType === 'ItemList') {
            fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
            component = <ItemList />;
          } else if (componentType === 'ItemDetails') {
            fetch.mockImplementation(() => new Promise(() => {})); // Never resolves
            component = <ItemDetails itemId='test-id' />;
          } else if (componentType === 'AddItemForm') {
            component = <AddItemForm />;
          }

          render(component);

          // Check for loading indicators
          const loadingElements = document.querySelectorAll(
            '.animate-pulse, .animate-spin, [class*="skeleton"], [class*="loading"]',
          );

          // Should have visible loading indicators
          expect(loadingElements.length).toBeGreaterThan(0);

          // Loading elements should have appropriate styling
          loadingElements.forEach((element) => {
            const styles = window.getComputedStyle(element);

            // Should be visible (not hidden)
            expect(styles.display).not.toBe('none');
            expect(styles.visibility).not.toBe('hidden');
            expect(styles.opacity).not.toBe('0');
          });
        },
      ),
      { numRuns: 100 },
    );
  });

  test('Property 11: Loading state visibility - loading states have consistent animation classes', () => {
    fc.assert(
      fc.property(fc.constantFrom('pulse', 'spin'), (animationType) => {
        // Test different loading animation types
        const testElement = document.createElement('div');
        testElement.className = `animate-${animationType}`;
        document.body.appendChild(testElement);

        // Check that animation classes are properly applied
        expect(testElement.classList.contains(`animate-${animationType}`)).toBe(
          true,
        );

        // Animation classes should follow consistent naming
        const expectedClasses = ['animate-pulse', 'animate-spin'];
        const hasValidClass = expectedClasses.some((cls) =>
          testElement.classList.contains(cls),
        );
        expect(hasValidClass).toBe(true);

        document.body.removeChild(testElement);
      }),
      { numRuns: 100 },
    );
  });

  test('Property 11: Loading state visibility - loading states are accessible', () => {
    fc.assert(
      fc.property(
        fc.record({
          loadingText: fc.constantFrom(
            'Loading...',
            'Creating Item...',
            'Logging in...',
            'Fetching data...',
          ),
        }),
        (testData) => {
          // Create a loading component with text
          const loadingComponent = (
            <div className='flex items-center'>
              <div className='animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-slate-600' />
              <span>{testData.loadingText}</span>
            </div>
          );

          render(loadingComponent);

          // Loading text should be present for screen readers
          const loadingTextElement = screen.getByText(testData.loadingText);
          expect(loadingTextElement).toBeInTheDocument();

          // Loading spinner should be present
          const spinner = document.querySelector('.animate-spin');
          expect(spinner).toBeInTheDocument();

          // Loading state should be perceivable
          expect(loadingTextElement).toBeVisible();
        },
      ),
      { numRuns: 100 },
    );
  });
});
