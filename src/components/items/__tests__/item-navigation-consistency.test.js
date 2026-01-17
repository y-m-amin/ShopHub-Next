/**
 * Property-based tests for Item Navigation Consistency
 * Feature: e-commerce-platform, Property 4: Item Navigation Consistency
 * Validates: Requirements 3.6
 */

import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { ItemCard } from '../ItemCard';

// Mock Next.js Image component for testing
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock Next.js Link component for testing
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock GSAP animations for testing
jest.mock('@/lib/animations', () => ({
  animations: {
    cardHover: jest.fn(),
    cardHoverOut: jest.fn(),
  },
}));

describe('Item Navigation Consistency Property Tests', () => {
  beforeEach(() => {
    // Clear any previous DOM state
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = '';
  });

  /**
   * Property 4: Item Navigation Consistency
   * For any item card displayed in the list, clicking on it should navigate
   * to the corresponding item detail page with the correct item ID
   */
  test('Property 4: Item navigation consistency for item cards', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc
            .string({ minLength: 1, maxLength: 50 })
            .filter((s) => s.trim().length > 0),
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
          image: fc.option(fc.webUrl()),
          category: fc.option(
            fc
              .string({ minLength: 1, maxLength: 50 })
              .filter((s) => s.trim().length > 0),
          ),
          inStock: fc.boolean(),
          createdAt: fc.date().map((d) => d.toISOString()),
          updatedAt: fc.date().map((d) => d.toISOString()),
        }),
        async (item) => {
          // Render the ItemCard component with the generated item
          const { container } = render(<ItemCard item={item} />);

          // Find the link element (should be the main clickable area)
          const linkElement = container.querySelector('a[href]');
          expect(linkElement).toBeInTheDocument();

          // Verify that the link href matches the expected pattern
          const expectedHref = `/products/${item.id}`;
          expect(linkElement).toHaveAttribute('href', expectedHref);

          // Verify that the entire card is clickable (link wraps the card content)
          const cardContent = linkElement.querySelector('div');
          expect(cardContent).toBeInTheDocument();

          // Verify that the card contains the item information
          expect(linkElement).toContainElement(screen.getByText(item.name));
          expect(linkElement).toContainElement(
            screen.getByText(item.description),
          );

          // Verify that the link is accessible (has proper structure)
          expect(linkElement.tagName.toLowerCase()).toBe('a');
          expect(linkElement.getAttribute('href')).toBeTruthy();

          // Verify that the item ID in the href is exactly the same as the item's ID
          const hrefItemId = linkElement.getAttribute('href').split('/').pop();
          expect(hrefItemId).toBe(item.id);
        },
      ),
      { numRuns: 100 },
    );
  });

  test('Navigation consistency with special characters in item IDs', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // Generate IDs with various special characters that might appear in URLs
          id: fc.oneof(
            // Normal alphanumeric IDs
            fc
              .string({ minLength: 1, maxLength: 20 })
              .filter((s) => /^[a-zA-Z0-9_-]+$/.test(s) && s.length > 0),
            // IDs with spaces (should be URL encoded)
            fc
              .string({ minLength: 1, maxLength: 20 })
              .map((s) => s.replace(/[^a-zA-Z0-9]/g, ' ').trim())
              .filter((s) => s.length > 0),
            // UUIDs
            fc.uuid(),
            // Numeric IDs
            fc.integer({ min: 1, max: 999999 }).map((n) => n.toString()),
          ),
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
          image: fc.option(fc.webUrl()),
          category: fc.option(
            fc
              .string({ minLength: 1, maxLength: 30 })
              .filter((s) => s.trim().length > 0),
          ),
          inStock: fc.boolean(),
          createdAt: fc.date().map((d) => d.toISOString()),
          updatedAt: fc.date().map((d) => d.toISOString()),
        }),
        async (item) => {
          // Render the ItemCard component
          const { container } = render(<ItemCard item={item} />);

          // Find the link element
          const linkElement = container.querySelector('a[href]');
          expect(linkElement).toBeInTheDocument();

          // Verify that the href is properly constructed
          const href = linkElement.getAttribute('href');
          expect(href).toMatch(/^\/products\/.+/);

          // Extract the ID from the href and verify it matches
          const hrefPath = href.split('/products/')[1];
          expect(hrefPath).toBeTruthy();

          // For IDs with special characters, the href should contain the ID
          // (Next.js Link component handles URL encoding automatically)
          expect(href).toBe(`/products/${item.id}`);

          // Verify the link is functional (has proper attributes)
          expect(linkElement.tagName.toLowerCase()).toBe('a');
          expect(linkElement.getAttribute('href')).toBeTruthy();
        },
      ),
      { numRuns: 50 },
    );
  });

  test('Multiple item cards have unique navigation targets', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc
          .array(
            fc.record({
              id: fc
                .string({ minLength: 1, maxLength: 20 })
                .filter((s) => s.trim().length > 0),
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
              image: fc.option(fc.webUrl()),
              category: fc.option(
                fc
                  .string({ minLength: 1, maxLength: 30 })
                  .filter((s) => s.trim().length > 0),
              ),
              inStock: fc.boolean(),
              createdAt: fc.date().map((d) => d.toISOString()),
              updatedAt: fc.date().map((d) => d.toISOString()),
            }),
            { minLength: 2, maxLength: 5 },
          )
          .filter((items) => {
            // Ensure all items have unique IDs
            const ids = items.map((item) => item.id);
            return new Set(ids).size === ids.length;
          }),
        async (items) => {
          // Render multiple ItemCard components
          const { container } = render(
            <div>
              {items.map((item, index) => (
                <ItemCard key={index} item={item} />
              ))}
            </div>,
          );

          // Find all link elements
          const linkElements = container.querySelectorAll('a[href]');
          expect(linkElements).toHaveLength(items.length);

          // Verify that each link has a unique href corresponding to its item
          const hrefs = Array.from(linkElements).map((link) =>
            link.getAttribute('href'),
          );
          const expectedHrefs = items.map((item) => `/products/${item.id}`);

          // Check that we have the expected number of unique hrefs
          expect(new Set(hrefs).size).toBe(items.length);

          // Check that each href matches the expected pattern for its corresponding item
          hrefs.forEach((href, index) => {
            expect(href).toBe(expectedHrefs[index]);
          });

          // Verify that each link contains the correct item information
          linkElements.forEach((linkElement, index) => {
            const item = items[index];
            expect(linkElement).toContainElement(screen.getByText(item.name));
            expect(linkElement).toContainElement(
              screen.getByText(item.description),
            );
          });
        },
      ),
      { numRuns: 30 },
    );
  });

  test('Navigation consistency with empty or whitespace IDs is handled', async () => {
    // Test edge case where IDs might be problematic
    const problematicItems = [
      {
        id: ' ', // Single space
        name: 'Test Item',
        description: 'Test Description',
        price: 10.0,
        image: null,
        category: null,
        inStock: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    problematicItems.forEach((item) => {
      const { container } = render(<ItemCard item={item} />);

      const linkElement = container.querySelector('a[href]');
      expect(linkElement).toBeInTheDocument();

      // Even with problematic IDs, the href should be constructed
      const href = linkElement.getAttribute('href');
      expect(href).toBe(`/products/${item.id}`);

      // The link should still be functional
      expect(linkElement.tagName.toLowerCase()).toBe('a');
    });
  });
});
