'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // NextAuth.js session
  const { data: session, status } = useSession();

  // Check authentication status - works with both NextAuth and mock auth
  const checkAuth = async () => {
    try {
      // If NextAuth session exists, use it
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role || 'user',
          provider: session.user.provider,
        });
        setLoading(false);
        return;
      }

      // Fallback to mock auth session check
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function - supports both NextAuth and mock auth
  const login = async (email, password, provider = 'credentials') => {
    if (provider === 'google') {
      // Use NextAuth for Google login
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/products',
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    } else {
      // Use NextAuth credentials provider or fallback to mock auth
      try {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          // Fallback to mock auth if NextAuth credentials fail
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Login failed');
          }

          if (data.success && data.user) {
            setUser(data.user);
            return data.user;
          }

          throw new Error('Login failed');
        }

        return result;
      } catch (error) {
        throw error;
      }
    }
  };

  // Logout function - works with both NextAuth and mock auth
  const logout = async () => {
    try {
      // If using NextAuth session, sign out with NextAuth
      if (session) {
        await signOut({ redirect: false });
      } else {
        // Fallback to mock auth logout
        await fetch('/api/auth/logout', {
          method: 'POST',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  // Update user when NextAuth session changes
  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role || 'user',
        provider: session.user.provider,
      });
      setLoading(false);
    } else {
      // Check for mock auth session if no NextAuth session
      checkAuth();
    }
  }, [session, status]);

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    session, // Expose NextAuth session
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
