/**
 * Feature: e-commerce-platform, Property 8: Theme System Consistency
 * Validates: Requirements 7.3, 7.4, 7.7
 */

import { ThemeProvider, useTheme } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';

// Test component to access theme context
function TestThemeComponent() {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <div data-testid='current-theme'>{theme}</div>
      <button data-testid='set-light' onClick={() => setTheme('light')}>
        Set Light
      </button>
      <button data-testid='set-dark' onClick={() => setTheme('dark')}>
        Set Dark
      </button>
      <button data-testid='set-system' onClick={() => setTheme('system')}>
        Set System
      </button>
    </div>
  );
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Theme System Property Tests', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    document.documentElement.className = '';
  });

  /**
   * Property 8: Theme System Consistency
   * For any theme change (light to dark or vice versa), all pages and components
   * should reflect the new theme immediately and the preference should persist across sessions
   */
  test('Property 8: Theme changes are applied consistently and persist', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light', 'dark'),
        fc.constantFrom('light', 'dark'),
        (initialTheme, targetTheme) => {
          // Skip if themes are the same (no change expected)
          if (initialTheme === targetTheme) {
            return true;
          }
          // Setup: Render theme provider with initial theme
          const { unmount } = render(
            <ThemeProvider defaultTheme={initialTheme}>
              <TestThemeComponent />
            </ThemeProvider>,
          );

          try {
            // Action: Change theme
            const setButton = screen.getByTestId(`set-${targetTheme}`);
            fireEvent.click(setButton);

            // Verification 1: Theme context reflects the change immediately
            const currentThemeElement = screen.getByTestId('current-theme');
            expect(currentThemeElement.textContent).toBe(targetTheme);

            // Verification 2: localStorage is updated for persistence
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
              'ui-theme',
              targetTheme,
            );

            // Verification 3: DOM classes are applied correctly
            const root = document.documentElement;
            if (targetTheme === 'light') {
              expect(root.classList.contains('light')).toBe(true);
              expect(root.classList.contains('dark')).toBe(false);
            } else if (targetTheme === 'dark') {
              expect(root.classList.contains('dark')).toBe(true);
              expect(root.classList.contains('light')).toBe(false);
            }

            return true; // Property holds
          } finally {
            // Cleanup: Always unmount to prevent DOM conflicts
            unmount();
            // Clear localStorage mock calls for next iteration
            localStorageMock.setItem.mockClear();
            localStorageMock.getItem.mockClear();
          }
        },
      ),
      { numRuns: 50 },
    );
  });

  test('Property 8: Theme persistence across component remounts', () => {
    fc.assert(
      fc.property(fc.constantFrom('light', 'dark'), (theme) => {
        // Setup: Mock localStorage to return the theme
        localStorageMock.getItem.mockReturnValue(theme);

        // Action: Mount component (simulating page reload)
        const { unmount } = render(
          <ThemeProvider>
            <TestThemeComponent />
          </ThemeProvider>,
        );

        try {
          // Verification: Theme is restored from localStorage
          expect(localStorageMock.getItem).toHaveBeenCalledWith('ui-theme');

          // Wait for useEffect to apply the theme
          return waitFor(() => {
            const currentThemeElement = screen.getByTestId('current-theme');
            expect(currentThemeElement.textContent).toBe(theme);
          });
        } finally {
          // Cleanup
          unmount();
          localStorageMock.getItem.mockClear();
        }
      }),
      { numRuns: 100 },
    );
  });

  test('Property 8: Theme toggle component consistency', () => {
    fc.assert(
      fc.property(fc.constantFrom('light', 'dark'), (initialTheme) => {
        // Setup: Render theme toggle with initial theme
        const { unmount } = render(
          <ThemeProvider defaultTheme={initialTheme}>
            <ThemeToggle />
            <TestThemeComponent />
          </ThemeProvider>,
        );

        try {
          // Action: Click theme toggle (use more specific selector)
          const toggleButton = screen.getByRole('button', {
            name: /toggle theme/i,
          });
          fireEvent.click(toggleButton);

          // Verification: Theme switches to opposite
          const expectedTheme = initialTheme === 'light' ? 'dark' : 'light';
          const currentThemeElement = screen.getByTestId('current-theme');
          expect(currentThemeElement.textContent).toBe(expectedTheme);

          // Verification: Persistence is maintained
          expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'ui-theme',
            expectedTheme,
          );

          return true; // Property holds
        } finally {
          // Cleanup
          unmount();
          localStorageMock.setItem.mockClear();
        }
      }),
      { numRuns: 100 },
    );
  });
});
