/**
 * Unit Tests for Authentication Components
 * Tests login form validation, submission, session management, and middleware behavior
 * Requirements: 2.1, 2.2, 2.6
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import {
  createSessionToken,
  validateCredentials,
  verifySessionToken,
} from '../../lib/auth';
import { AuthProvider, useAuth } from '../auth/AuthProvider';
import LoginForm from '../form/LoginForm';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch for API calls
global.fetch = jest.fn();

describe('Authentication Components Unit Tests', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
    fetch.mockClear();
    mockPush.mockClear();
    mockRefresh.mockClear();
  });

  describe('LoginForm Component', () => {
    test('should render login form with all required fields', () => {
      render(<LoginForm />);

      expect(
        screen.getByRole('heading', { name: 'Login' }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /login/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Demo credentials: user@nexus.com / password123'),
      ).toBeInTheDocument();
    });

    test('should show validation error for empty fields', async () => {
      render(<LoginForm />);

      const submitButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(submitButton);

      // HTML5 validation should prevent submission
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');

      expect(emailInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });

    test('should handle successful login', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: { id: '1', email: 'test@mail.com', name: 'Test User' },
        }),
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'user@nexus.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'user@nexus.com',
            password: 'password123',
          }),
        });
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/products');
        expect(mockRefresh).toHaveBeenCalled();
      });
    });

    test('should handle login failure', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid credentials' }),
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'wrong@mail.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });

    test('should show loading state during submission', async () => {
      fetch.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      render(<LoginForm />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /login/i });

      fireEvent.change(emailInput, { target: { value: 'user@nexus.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      expect(screen.getByText('Logging in...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Session Management Functions', () => {
    test('validateCredentials should return user for valid credentials', () => {
      const user = validateCredentials('user@nexus.com', 'password123');

      expect(user).not.toBeNull();
      expect(user.email).toBe('user@nexus.com');
      expect(user.id).toBe('1');
      expect(user.name).toBe('Test User');
      expect(user.role).toBe('user');
    });

    test('validateCredentials should return null for invalid credentials', () => {
      const user = validateCredentials('wrong@mail.com', 'wrongpassword');
      expect(user).toBeNull();
    });

    test('createSessionToken should generate valid token', () => {
      const user = { id: '1', email: 'test@mail.com' };
      const token = createSessionToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    test('verifySessionToken should validate correct token', () => {
      const user = { id: '1', email: 'test@mail.com' };
      const token = createSessionToken(user);
      const sessionData = verifySessionToken(token);

      expect(sessionData).not.toBeNull();
      expect(sessionData.userId).toBe(user.id);
      expect(sessionData.email).toBe(user.email);
    });

    test('verifySessionToken should reject invalid token', () => {
      const sessionData = verifySessionToken('invalid-token');
      expect(sessionData).toBeNull();
    });

    test('verifySessionToken should reject expired token', () => {
      // Create an expired token (25 hours old)
      const expiredTokenData = {
        userId: '1',
        email: 'test@mail.com',
        timestamp: Date.now() - 25 * 60 * 60 * 1000,
      };
      const expiredToken = Buffer.from(
        JSON.stringify(expiredTokenData),
      ).toString('base64');

      const sessionData = verifySessionToken(expiredToken);
      expect(sessionData).toBeNull();
    });
  });

  describe('AuthProvider Component', () => {
    // Test component that uses the auth context
    const TestComponent = () => {
      const { user, loading, isAuthenticated } = useAuth();

      if (loading) return <div>Loading...</div>;
      if (isAuthenticated) return <div>Authenticated: {user.email}</div>;
      return <div>Not authenticated</div>;
    };

    test('should provide authentication context to children', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          authenticated: true,
          user: { id: '1', email: 'test@mail.com', name: 'Test User' },
        }),
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      // Should show loading initially
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Should show authenticated state after session check
      await waitFor(() => {
        expect(
          screen.getByText('Authenticated: test@mail.com'),
        ).toBeInTheDocument();
      });
    });

    test('should handle unauthenticated state', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          authenticated: false,
          user: null,
        }),
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('Not authenticated')).toBeInTheDocument();
      });
    });

    test('should handle session check failure', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>,
      );

      await waitFor(() => {
        expect(screen.getByText('Not authenticated')).toBeInTheDocument();
      });
    });
  });
});
