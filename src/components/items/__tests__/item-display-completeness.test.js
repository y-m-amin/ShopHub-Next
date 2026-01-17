/**
 * Property-based tests for Item Display Completeness
 * Feature: e-commerce-platform, Property 3: Item Display Completeness
 * Validates: Requirements 3.3, 4.2
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

describe('Item Display Completeness Property Tests', () => {
  beforeEach(() => {
    // Clear any previous DOM state
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = '';
  });

  /**
   * Property 3: Item Display Completeness
   * For any item in the system, when displayed as a card or in detail view,
   * all required fields (name, description, price, image) should be present in the rendered output
   */
  test('Property 3: Item display completeness for item cards', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 50 }),
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
          render(<ItemCard item={item} />);

          // Verify that the item name is displayed
          const nameElement = screen.getByText(item.name);
          expect(nameElement).toBeInTheDocument();

          // Verify that the item description is displayed
          const descriptionElement = screen.getByText(item.description);
          expect(descriptionElement).toBeInTheDocument();

          // Verify that the price is displayed in the correct format
          const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(item.price);
          const priceElement = screen.getByText(formattedPrice);
          expect(priceElement).toBeInTheDocument();

          // Verify that image handling is correct
          if (item.image) {
            // If item has an image, verify the img element is present with correct src and alt
            const imageElement = screen.getByRole('img', { name: item.name });
            expect(imageElement).toBeInTheDocument();
            expect(imageElement).toHaveAttribute('src', item.image);
            expect(imageElement).toHaveAttribute('alt', item.name);
          } else {
            // If no image, verify the placeholder is shown
            const placeholderElement = screen.getByText('📦');
            expect(placeholderElement).toBeInTheDocument();
          }

          // Verify that category is displayed if present
          if (item.category) {
            const categoryElement = screen.getByText(item.category);
            expect(categoryElement).toBeInTheDocument();
          }

          // Verify stock status is displayed correctly
          if (!item.inStock) {
            const outOfStockElement = screen.getByText('Out of Stock');
            expect(outOfStockElement).toBeInTheDocument();
          }

          // Verify that the card is clickable and links to the correct product page
          const linkElement = screen.getByRole('link');
          expect(linkElement).toBeInTheDocument();
          expect(linkElement).toHaveAttribute('href', `/products/${item.id}`);

          // Verify that all required elements are contained within the card structure
          const cardContainer = linkElement.querySelector('div');
          expect(cardContainer).toBeInTheDocument();
          expect(cardContainer).toHaveClass('bg-white', 'dark:bg-slate-800');
        },
      ),
      { numRuns: 100 },
    );
  });

  test('Item card handles edge cases correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 50 }),
          name: fc.oneof(
            // Normal names
            fc
              .string({ minLength: 1, maxLength: 100 })
              .filter((s) => s.trim().length > 0),
            // Very long names that should be truncated
            fc.string({ minLength: 100, maxLength: 200 }),
            // Names with special characters
            fc
              .string({ minLength: 1, maxLength: 50 })
              .map((s) => `${s} & Co. "Special" <Item>`),
          ),
          description: fc.oneof(
            // Normal descriptions
            fc
              .string({ minLength: 1, maxLength: 500 })
              .filter((s) => s.trim().length > 0),
            // Very long descriptions that should be truncated
            fc.string({ minLength: 500, maxLength: 1000 }),
            // Descriptions with special characters and line breaks
            fc
              .string({ minLength: 10, maxLength: 100 })
              .map((s) => `${s}\n\nNew line & special chars: <>&"`),
          ),
          price: fc.oneof(
            // Normal prices
            fc
              .float({
                min: Math.fround(0.01),
                max: Math.fround(1000),
                noNaN: true,
              })
              .map((p) => Math.round(p * 100) / 100),
            // Very small prices
            fc.constant(0.01),
            // Very large prices
            fc.float({ min: 10000, max: 999999, noNaN: true }),
          ),
          image: fc.option(fc.webUrl()),
          category: fc.option(
            fc.oneof(
              fc
                .string({ minLength: 1, maxLength: 50 })
                .filter((s) => s.trim().length > 0),
              // Very long category names
              fc.string({ minLength: 50, maxLength: 100 }),
            ),
          ),
          inStock: fc.boolean(),
          createdAt: fc.date().map((d) => d.toISOString()),
          updatedAt: fc.date().map((d) => d.toISOString()),
        }),
        async (item) => {
          // Render the ItemCard component
          render(<ItemCard item={item} />);

          // Verify that the component renders without crashing
          const linkElement = screen.getByRole('link');
          expect(linkElement).toBeInTheDocument();

          // Verify that text content is properly escaped and displayed
          // (React automatically escapes text content, so special characters should be safe)
          const nameElement = screen.getByText(item.name);
          expect(nameElement).toBeInTheDocument();

          const descriptionElement = screen.getByText(item.description);
          expect(descriptionElement).toBeInTheDocument();

          // Verify price formatting works for edge cases
          const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(item.price);
          const priceElement = screen.getByText(formattedPrice);
          expect(priceElement).toBeInTheDocument();

          // Verify that very long text doesn't break the layout
          // (The CSS should handle overflow with ellipsis)
          const cardContainer = linkElement.querySelector('div');
          expect(cardContainer).toBeInTheDocument();
        },
      ),
      { numRuns: 50 },
    );
  });

  test('Item card accessibility requirements', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.string({ minLength: 1, maxLength: 50 }),
          name: fc
            .string({ minLength: 1, maxLength: 100 })
            .filter((s) => s.trim().length > 0),
          description: fc
            .string({ minLength: 1, maxLength: 500 })
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
              .string({ minLength: 1, maxLength: 50 })
              .filter((s) => s.trim().length > 0),
          ),
          inStock: fc.boolean(),
          createdAt: fc.date().map((d) => d.toISOString()),
          updatedAt: fc.date().map((d) => d.toISOString()),
        }),
        async (item) => {
          // Render the ItemCard component
          render(<ItemCard item={item} />);

          // Verify accessibility: link should be properly labeled
          const linkElement = screen.getByRole('link');
          expect(linkElement).toBeInTheDocument();

          // Verify accessibility: image should have proper alt text if present
          if (item.image) {
            const imageElement = screen.getByRole('img', { name: item.name });
            expect(imageElement).toBeInTheDocument();
            expect(imageElement).toHaveAttribute('alt', item.name);
          }

          // Verify that the card has proper semantic structure
          // The link should contain all the item information
          expect(linkElement).toContainElement(screen.getByText(item.name));
          expect(linkElement).toContainElement(
            screen.getByText(item.description),
          );

          const formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(item.price);
          expect(linkElement).toContainElement(
            screen.getByText(formattedPrice),
          );
        },
      ),
      { numRuns: 50 },
    );
  });
});
