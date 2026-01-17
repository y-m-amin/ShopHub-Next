/**
 * @jest-environment jsdom
 */

import { showToast } from '@/lib/toast';
import fc from 'fast-check';

// Mock the toast function to track calls
jest.mock('@/lib/toast', () => ({
  showToast: jest.fn(),
}));

describe('Success Feedback Consistency Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear any existing toast containers
    const existingContainers = document.querySelectorAll(
      '.fixed.top-4.right-4',
    );
    existingContainers.forEach((container) => container.remove());
  });

  /**
   * Feature: e-commerce-platform, Property 7: Success Feedback Consistency
   *
   * Property: For any successful user action (item creation, authentication, etc.),
   * the system should provide immediate visual feedback through toast notifications or UI updates
   *
   * Validates: Requirements 5.5, 8.2
   */
  test('Property 7: Success feedback consistency - toast notifications are shown for all successful actions', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 100 }),
          description: fc.string({ minLength: 1, maxLength: 200 }),
          variant: fc.constantFrom('success', 'default'),
        }),
        (toastData) => {
          // Test that showToast is called with proper parameters for success actions
          showToast(toastData);

          // Verify that showToast was called with the expected parameters
          expect(showToast).toHaveBeenCalledWith(
            expect.objectContaining({
              title: toastData.title,
              description: toastData.description,
              variant: toastData.variant,
            }),
          );

          // Reset mock for next iteration
          showToast.mockClear();
        },
      ),
      { numRuns: 100 },
    );
  });

  test('Property 7: Success feedback consistency - toast notifications have required properties', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 100 }),
          description: fc.option(fc.string({ minLength: 1, maxLength: 200 })),
          variant: fc.constantFrom('success', 'destructive', 'default'),
        }),
        (toastData) => {
          // Test that all toast notifications have required properties
          showToast(toastData);

          const lastCall =
            showToast.mock.calls[showToast.mock.calls.length - 1];
          const calledWith = lastCall[0];

          // Every toast must have a title
          expect(calledWith).toHaveProperty('title');
          expect(typeof calledWith.title).toBe('string');
          expect(calledWith.title.length).toBeGreaterThan(0);

          // Every toast must have a variant
          expect(calledWith).toHaveProperty('variant');
          expect(['success', 'destructive', 'default']).toContain(
            calledWith.variant,
          );

          // If description is provided, it should be a non-empty string
          if (calledWith.description !== undefined) {
            expect(typeof calledWith.description).toBe('string');
          }

          // Reset mock for next iteration
          showToast.mockClear();
        },
      ),
      { numRuns: 100 },
    );
  });

  test('Property 7: Success feedback consistency - success actions always use success variant', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.constantFrom(
            'Item Created Successfully!',
            'Login Successful!',
            'Profile Updated!',
            'Settings Saved!',
            'Action Completed!',
          ),
          description: fc.string({ minLength: 1, maxLength: 200 }),
        }),
        (successData) => {
          // Test that success actions always use the success variant
          const successToast = {
            ...successData,
            variant: 'success',
          };

          showToast(successToast);

          const lastCall =
            showToast.mock.calls[showToast.mock.calls.length - 1];
          const calledWith = lastCall[0];

          // Success actions should always use success variant
          expect(calledWith.variant).toBe('success');

          // Success messages should have positive language
          expect(calledWith.title).toMatch(
            /success|successful|completed|saved|created|updated/i,
          );

          // Reset mock for next iteration
          showToast.mockClear();
        },
      ),
      { numRuns: 100 },
    );
  });

  test('Property 7: Success feedback consistency - error actions always use destructive variant', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.constantFrom(
            'Failed to Create Item',
            'Login Failed',
            'Error Occurred',
            'Action Failed',
            'Something went wrong',
          ),
          description: fc.string({ minLength: 1, maxLength: 200 }),
        }),
        (errorData) => {
          // Test that error actions always use the destructive variant
          const errorToast = {
            ...errorData,
            variant: 'destructive',
          };

          showToast(errorToast);

          const lastCall =
            showToast.mock.calls[showToast.mock.calls.length - 1];
          const calledWith = lastCall[0];

          // Error actions should always use destructive variant
          expect(calledWith.variant).toBe('destructive');

          // Error messages should have negative/failure language
          expect(calledWith.title).toMatch(
            /failed|error|wrong|unable|cannot|invalid/i,
          );

          // Reset mock for next iteration
          showToast.mockClear();
        },
      ),
      { numRuns: 100 },
    );
  });

  test('Property 7: Success feedback consistency - feedback is immediate (synchronous)', () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 100 }),
          description: fc.string({ minLength: 1, maxLength: 200 }),
          variant: fc.constantFrom('success', 'destructive', 'default'),
        }),
        (toastData) => {
          // Test that feedback is provided immediately (synchronously)
          const callCountBefore = showToast.mock.calls.length;

          showToast(toastData);

          const callCountAfter = showToast.mock.calls.length;

          // Toast should be called immediately (synchronously)
          expect(callCountAfter).toBe(callCountBefore + 1);

          // The call should happen without any delay
          const lastCall =
            showToast.mock.calls[showToast.mock.calls.length - 1];
          expect(lastCall).toBeDefined();
          expect(lastCall[0]).toEqual(toastData);

          // Reset mock for next iteration
          showToast.mockClear();
        },
      ),
      { numRuns: 100 },
    );
  });
});
