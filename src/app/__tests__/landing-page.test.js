import { AuthProvider } from '@/components/auth/AuthProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock GSAP animations to avoid issues in test environment
jest.mock('@/lib/animations', () => ({
  animations: {
    fadeIn: jest.fn(),
    staggerFadeIn: jest.fn(),
  },
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock fetch for auth provider
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: false,
    status: 401,
    json: () => Promise.resolve({ error: 'Unauthorized' }),
  }),
);

// Test wrapper component
const TestWrapper = ({ children }) => (
  <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
    <AuthProvider>{children}</AuthProvider>
  </ThemeProvider>
);

describe('Landing Page', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders exactly 7 content sections plus hero', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    );

    // Count all sections using querySelector since sections don't have role="region"
    const sections = document.querySelectorAll('section');

    // Should have 8 sections total (hero + 7 content sections)
    expect(sections).toHaveLength(8);
  });

  test('displays main heading and platform name', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    );

    // Check for main heading
    expect(screen.getByText('Welcome to ShopHub')).toBeInTheDocument();

    // Check for platform description
    expect(screen.getByText(/modern e-commerce platform/i)).toBeInTheDocument();
  });

  test('contains navigation links to login and products pages', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    );

    // Check for Browse Products links
    const browseProductsLinks = screen.getAllByText(/browse products/i);
    expect(browseProductsLinks.length).toBeGreaterThan(0);

    // Check for Login/Get Started links
    const loginLinks = screen.getAllByText(/get started|create account/i);
    expect(loginLinks.length).toBeGreaterThan(0);
  });

  test('displays all required content sections', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    );

    // Section 1: Features Overview
    expect(screen.getByText('Powerful Features')).toBeInTheDocument();
    expect(screen.getByText('Product Browsing')).toBeInTheDocument();
    expect(screen.getByText('Secure Authentication')).toBeInTheDocument();
    expect(screen.getByText('Fast Performance')).toBeInTheDocument();

    // Section 2: Technology Stack
    expect(
      screen.getByText('Built with Modern Technology'),
    ).toBeInTheDocument();
    expect(screen.getByText('Next.js 15')).toBeInTheDocument();
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
    expect(screen.getByText('Shadcn UI')).toBeInTheDocument();
    expect(screen.getByText('GSAP')).toBeInTheDocument();

    // Section 3: User Experience
    expect(screen.getByText('Exceptional User Experience')).toBeInTheDocument();
    expect(
      screen.getByText(/responsive design for all devices/i),
    ).toBeInTheDocument();

    // Section 4: Product Management
    expect(screen.getByText('Powerful Product Management')).toBeInTheDocument();
    expect(screen.getByText('Start Managing Products')).toBeInTheDocument();

    // Section 5: Security & Authentication
    expect(screen.getByText('Security First')).toBeInTheDocument();
    expect(screen.getByText('Secure Sessions')).toBeInTheDocument();
    expect(screen.getByText('Multiple Auth Options')).toBeInTheDocument();
    expect(screen.getByText('Route Protection')).toBeInTheDocument();

    // Section 6: Performance & Reliability
    expect(screen.getByText('Built for Performance')).toBeInTheDocument();
    expect(screen.getByText('Lightning Fast')).toBeInTheDocument();
    expect(screen.getByText('Reliable Data')).toBeInTheDocument();

    // Section 7: Call to Action
    expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
    expect(screen.getByText('Browse Products Now')).toBeInTheDocument();
  });

  test('has responsive design elements', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    );

    // Check for responsive classes in the DOM
    const heroSection = document.querySelector('section');
    expect(heroSection).toHaveClass('py-20'); // Responsive padding

    // Check for responsive grid classes
    const gridElements = document.querySelectorAll('.grid');
    expect(gridElements.length).toBeGreaterThan(0);

    // Check for responsive text classes
    const responsiveText = document.querySelector('.text-5xl');
    expect(responsiveText).toBeInTheDocument();
  });

  test('contains proper semantic HTML structure', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    );

    // Check for proper heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();

    const h2Elements = screen.getAllByRole('heading', { level: 2 });
    expect(h2Elements.length).toBeGreaterThan(0);

    const h3Elements = screen.getAllByRole('heading', { level: 3 });
    expect(h3Elements.length).toBeGreaterThan(0);
  });

  test('includes call-to-action buttons with proper links', () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>,
    );

    // Check for buttons that should link to products page
    const productLinks = document.querySelectorAll('a[href="/products"]');
    expect(productLinks.length).toBeGreaterThan(0);

    // Check for buttons that should link to login page
    const loginLinks = document.querySelectorAll('a[href="/login"]');
    expect(loginLinks.length).toBeGreaterThan(0);
  });
});
