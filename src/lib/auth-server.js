import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifySessionToken } from './auth';

/**
 * Server-side authentication check for pages
 * @param {string} redirectTo - Where to redirect if not authenticated
 * @returns {Object|null} User object if authenticated, redirects if not
 */
export async function requireAuth(redirectTo = '/login') {
  const cookieStore = cookies();
  const authToken = cookieStore.get('auth-token')?.value;

  if (!authToken) {
    redirect(redirectTo);
  }

  const sessionData = verifySessionToken(authToken);
  if (!sessionData) {
    redirect(redirectTo);
  }

  // Return mock user data for authenticated sessions
  return {
    id: '1',
    email: 'user@nexus.com',
    name: 'Test User',
    role: 'user',
  };
}

/**
 * Server-side check if user is authenticated (without redirect)
 * @returns {Object|null} User object if authenticated, null if not
 */
export async function getServerUser() {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('auth-token')?.value;

    if (!authToken) {
      return null;
    }

    const sessionData = verifySessionToken(authToken);
    if (!sessionData) {
      return null;
    }

    return {
      id: '1',
      email: 'user@nexus.com',
      name: 'Test User',
      role: 'user',
    };
  } catch (error) {
    console.error('Server auth check error:', error);
    return null;
  }
}
