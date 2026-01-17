import { AuthProvider } from '@/components/auth/AuthProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { fireEvent, render, screen } from '@testing-library/react';
import { Footer } from '../Footer';
import { Navbar } from '../Navbar';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock theme toggle component
jest.mock('@/components/theme-toggle', () => ({
  ThemeToggle: () => <button data-testid='theme-toggle'>Theme Toggle</button>,
}));

// Mock fetch for auth provider
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: false,
    status: 401,
    json: () => Promise.resolve({ error: 'Unauthorized' }),
  }),
);

// Create a mock AuthProvider that accepts initialUser prop
const MockAuthProvider = ({ children, initialUser = null }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

// Test wrapper component
const TestWrapper = ({ children, user = null }) => (
  <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
    <MockAuthProvider initialUser={user}>{children}</MockAuthProvider>
  </ThemeProvider>
);

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders navbar with logo and brand name', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>,
    );

    expect(screen.getByText('ShopHub')).toBeInTheDocument();
    expect(screen.getByText('SH')).toBeInTheDocument(); // Logo initials
  });

  test('displays navigation links to login and products pages', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>,
    );

    // Check for navigation links
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('shows login and sign up buttons when user is not authenticated', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>,
    );

    // Only check for desktop version since mobile menu is hidden by default
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('includes theme toggle component', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>,
    );

    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  test('mobile menu toggles correctly', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>,
    );

    // Mobile menu should not be visible initially
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    expect(mobileMenuButton).toBeInTheDocument();

    // Click to open mobile menu
    fireEvent.click(mobileMenuButton);

    // Mobile menu should now be visible (check for mobile-specific elements)
    const mobileMenuContainer = document.querySelector(
      '.md\\:hidden .flex-col',
    );
    expect(mobileMenuContainer).toBeInTheDocument();
  });

  test('has responsive design classes', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>,
    );

    // Check for responsive classes
    const navbar = document.querySelector('nav');
    expect(navbar).toHaveClass('sticky', 'top-0', 'z-50');

    // Check for hidden mobile menu classes
    const desktopNav = document.querySelector('.hidden.md\\:flex');
    expect(desktopNav).toBeInTheDocument();
  });
});

describe('Footer Component', () => {
  test('renders footer with company information', () => {
    render(<Footer />);

    expect(screen.getByText('ShopHub')).toBeInTheDocument();
    expect(screen.getByText(/modern e-commerce platform/i)).toBeInTheDocument();
  });

  test('displays current year in copyright', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${currentYear} ShopHub`)),
    ).toBeInTheDocument();
  });

  test('contains quick links section', () => {
    render(<Footer />);

    expect(screen.getByText('Quick Links')).toBeInTheDocument();

    // Check for navigation links in footer
    const footerLinks = screen.getAllByText('Home');
    expect(footerLinks.length).toBeGreaterThan(0);

    expect(screen.getAllByText('Products').length).toBeGreaterThan(0);
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getAllByText('Contact').length).toBeGreaterThan(0);
  });

  test('contains support section', () => {
    render(<Footer />);

    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  test('includes social media links', () => {
    render(<Footer />);

    // Check for social media link elements (by aria-label)
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
  });

  test('displays technology stack information', () => {
    render(<Footer />);

    expect(
      screen.getByText(/Built with Next.js, Tailwind CSS, and Shadcn UI/i),
    ).toBeInTheDocument();
  });

  test('has responsive grid layout', () => {
    render(<Footer />);

    // Check for responsive grid classes
    const gridContainer = document.querySelector(
      '.grid.grid-cols-1.md\\:grid-cols-4',
    );
    expect(gridContainer).toBeInTheDocument();
  });
});
