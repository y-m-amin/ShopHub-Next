/**
 * Unit Tests for NextAuth.js Integration
 * Tests Google OAuth flow, credential authentication flow, and session management with NextAuth
 * Requirements: 2.5
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AuthProvider, useAuth } from '../auth/AuthProvider';
import NextAuthProvider from '../auth/NextAuthProvider';
import LoginForm from '../form/LoginForm';

// Mock NextAuth.js
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  SessionProvider: ({ children }) => children,
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch for fallback API calls
global.fetch = jest.fn();

describe('NextAuth.js Integration Unit Tests', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });

    // Reset all mocks
    jest.clearAllMocks();
    fetch.mockClear();
    mockPush.mockClear();
    mockRefresh.mockClear();
  });

  describe('Google OAuth Flow', () => {
    test('should handle successful Google OAuth login', async () => {
      // Mock successful Google sign-in
      signIn.mockResolvedValueOnce({
        ok: true,
        error: null,
        url: '/products',
      });

      // Mock session state
      useSession.mockReturnValue({
        data: {
          user: {
            id: 'google-123',
            email: 'user@gmail.com',
            name: 'Google User',
            role: 'user',
            provider: 'google',
          },
        },
        status: 'authenticated',
      });

      const TestComponent = () => {
        const { login } = useAuth();

        const handleGoogleLogin = async () => {
          await login('', '', 'google');
        };

        return <button onClick={handleGoogleLogin}>Login with Google</button>;
      };

      render(
        <NextAuthProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </NextAuthProvider>,
      );

      const googleButton = screen.getByText('Login with Google');
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith('google', {
          redirect: false,
          callbackUrl: '/products',
        });
      });
    });

    test('should handle Google OAuth login failure', async () => {
      // Mock failed Google sign-in
      signIn.mockResolvedValueOnce({
        ok: false,
        error: 'OAuthAccountNotLinked',
      });

      useSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      const TestComponent = () => {
        const { login } = useAuth();

        const handleGoogleLogin = async () => {
          try {
            await login('', '', 'google');
          } catch (error) {
            // Error should be thrown
            expect(error.message).toBe('OAuthAccountNotLinked');
          }
        };

        return <button onClick={handleGoogleLogin}>Login with Google</button>;
      };

      render(
        <NextAuthProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </NextAuthProvider>,
      );

      const googleButton = screen.getByText('Login with Google');
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith('google', {
          redirect: false,
          callbackUrl: '/products',
        });
      });
    });

    test('should render Google login button in LoginForm', () => {
      useSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      render(
        <NextAuthProvider>
          <AuthProvider>
            <LoginForm />
          </AuthProvider>
        </NextAuthProvider>,
      );

      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
      expect(screen.getByText('Or continue with')).toBeInTheDocument();
      expect(screen.getByText('Login with Credentials')).toBeInTheDocument();
    });
  });

  describe('Credential Authentication Flow', () => {
    test('should handle successful NextAuth credentials login', async () => {
      // Mock successful credentials sign-in
      signIn.mockResolvedValueOnce({
        ok: true,
        error: null,
      });

      useSession.mockReturnValue({
        data: {
          user: {
            id: '1',
            email: 'test@mail.com',
            name: 'Test User',
            role: 'user',
            provider: 'credentials',
          },
        },
        status: 'authenticated',
      });

      render(
        <NextAuthProvider>
          <AuthProvider>
            <LoginForm />
          </AuthProvider>
        </NextAuthProvider>,
      );

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', {
        name: /login with credentials/i,
      });

      fireEvent.change(emailInput, { target: { value: 'test@mail.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith('credentials', {
          email: 'test@mail.com',
          password: 'password123',
          redirect: false,
        });
      });
    });

    test('should fallback to mock auth when NextAuth credentials fail', async () => {
      // Mock NextAuth credentials failure
      signIn.mockResolvedValueOnce({
        ok: false,
        error: 'CredentialsSignin',
      });

      // Mock successful fallback to mock auth
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: { id: '1', email: 'test@mail.com', name: 'Test User' },
        }),
      });

      useSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      render(
        <NextAuthProvider>
          <AuthProvider>
            <LoginForm />
          </AuthProvider>
        </NextAuthProvider>,
      );

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', {
        name: /login with credentials/i,
      });

      fireEvent.change(emailInput, { target: { value: 'test@mail.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith('credentials', {
          email: 'test@mail.com',
          password: 'password123',
          redirect: false,
        });
      });

      // Should fallback to mock auth API
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@mail.com',
            password: 'password123',
          }),
        });
      });
    });
  });

  describe('Session Management with NextAuth', () => {
    test('should use NextAuth session when available', () => {
      const mockSession = {
        user: {
          id: 'nextauth-123',
          email: 'nextauth@example.com',
          name: 'NextAuth User',
          role: 'user',
          provider: 'google',
        },
      };

      useSession.mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      });

      const TestComponent = () => {
        const { user, isAuthenticated, session } = useAuth();

        return (
          <div>
            <div data-testid='auth-status'>
              {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </div>
            <div data-testid='user-email'>{user?.email}</div>
            <div data-testid='user-provider'>{user?.provider}</div>
            <div data-testid='session-exists'>
              {session ? 'Session exists' : 'No session'}
            </div>
          </div>
        );
      };

      render(
        <NextAuthProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </NextAuthProvider>,
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Authenticated',
      );
      expect(screen.getByTestId('user-email')).toHaveTextContent(
        'nextauth@example.com',
      );
      expect(screen.getByTestId('user-provider')).toHaveTextContent('google');
      expect(screen.getByTestId('session-exists')).toHaveTextContent(
        'Session exists',
      );
    });

    test('should fallback to mock auth when no NextAuth session', async () => {
      useSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      // Mock successful mock auth session check
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          authenticated: true,
          user: { id: '1', email: 'mock@example.com', name: 'Mock User' },
        }),
      });

      const TestComponent = () => {
        const { user, isAuthenticated, loading } = useAuth();

        if (loading) return <div>Loading...</div>;

        return (
          <div>
            <div data-testid='auth-status'>
              {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </div>
            <div data-testid='user-email'>{user?.email}</div>
          </div>
        );
      };

      render(
        <NextAuthProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </NextAuthProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Authenticated',
        );
        expect(screen.getByTestId('user-email')).toHaveTextContent(
          'mock@example.com',
        );
      });

      expect(fetch).toHaveBeenCalledWith('/api/auth/session');
    });

    test('should handle NextAuth logout', async () => {
      const mockSession = {
        user: {
          id: 'nextauth-123',
          email: 'nextauth@example.com',
          name: 'NextAuth User',
        },
      };

      useSession.mockReturnValue({
        data: mockSession,
        status: 'authenticated',
      });

      signOut.mockResolvedValueOnce({ url: '/login' });

      const TestComponent = () => {
        const { logout } = useAuth();

        return <button onClick={logout}>Logout</button>;
      };

      render(
        <NextAuthProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </NextAuthProvider>,
      );

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(signOut).toHaveBeenCalledWith({ redirect: false });
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
    });

    test('should handle mock auth logout when no NextAuth session', async () => {
      useSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const TestComponent = () => {
        const { logout } = useAuth();

        return <button onClick={logout}>Logout</button>;
      };

      render(
        <NextAuthProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </NextAuthProvider>,
      );

      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/auth/logout', {
          method: 'POST',
        });
        expect(mockPush).toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('Loading States', () => {
    test('should show loading state while NextAuth session is loading', () => {
      useSession.mockReturnValue({
        data: null,
        status: 'loading',
      });

      const TestComponent = () => {
        const { loading } = useAuth();

        return (
          <div data-testid='loading-state'>
            {loading ? 'Loading...' : 'Not Loading'}
          </div>
        );
      };

      render(
        <NextAuthProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </NextAuthProvider>,
      );

      expect(screen.getByTestId('loading-state')).toHaveTextContent(
        'Loading...',
      );
    });

    test('should show loading state in LoginForm during Google login', async () => {
      useSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      // Mock delayed Google sign-in
      signIn.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ ok: true }), 100),
          ),
      );

      render(
        <NextAuthProvider>
          <AuthProvider>
            <LoginForm />
          </AuthProvider>
        </NextAuthProvider>,
      );

      const googleButton = screen.getByText('Continue with Google');
      fireEvent.click(googleButton);

      expect(screen.getByText('Signing in with Google...')).toBeInTheDocument();

      // Check that the button element itself is disabled
      const buttonElement = screen.getByRole('button', {
        name: /signing in with google/i,
      });
      expect(buttonElement).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    test('should handle NextAuth session error gracefully', async () => {
      useSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      // Mock session check failure
      fetch.mockRejectedValueOnce(new Error('Session check failed'));

      const TestComponent = () => {
        const { user, isAuthenticated, loading } = useAuth();

        if (loading) return <div>Loading...</div>;

        return (
          <div data-testid='auth-status'>
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </div>
        );
      };

      render(
        <NextAuthProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </NextAuthProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent(
          'Not Authenticated',
        );
      });
    });

    test('should handle Google login network error', async () => {
      useSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      });

      signIn.mockRejectedValueOnce(new Error('Network error'));

      const TestComponent = () => {
        const { login } = useAuth();
        const [error, setError] = useState('');

        const handleGoogleLogin = async () => {
          try {
            await login('', '', 'google');
          } catch (err) {
            setError(err.message);
          }
        };

        return (
          <div>
            <button onClick={handleGoogleLogin}>Login with Google</button>
            {error && <div data-testid='error'>{error}</div>}
          </div>
        );
      };

      render(
        <NextAuthProvider>
          <AuthProvider>
            <TestComponent />
          </AuthProvider>
        </NextAuthProvider>,
      );

      const googleButton = screen.getByText('Login with Google');
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Network error');
      });
    });
  });
});
