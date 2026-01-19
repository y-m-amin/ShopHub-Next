import { cookies } from 'next/headers';

// Hardcoded credentials for mock authentication
const MOCK_CREDENTIALS = {
  email: 'user@nexus.com',
  password: 'password123',
};

// Mock user data
const MOCK_USER = {
  id: '1',
  email: 'user@nexus.com',
  name: 'Test User',
  role: 'user',
};

/**
 * Validates user credentials against hardcoded values
 * @param {string} email
 * @param {string} password
 * @returns {Object|null} User object if valid, null if invalid
 */
export function validateCredentials(email, password) {
  if (
    email === MOCK_CREDENTIALS.email &&
    password === MOCK_CREDENTIALS.password
  ) {
    return MOCK_USER;
  }
  return null;
}

/**
 * Creates a session token (simplified for mock auth)
 * @param {Object} user
 * @returns {string} Session token
 */
export function createSessionToken(user) {
  // In a real app, this would be a JWT or secure random token
  return Buffer.from(
    JSON.stringify({
      userId: user.id,
      email: user.email,
      timestamp: Date.now(),
    }),
  ).toString('base64');
}

/**
 * Verifies and decodes a session token
 * @param {string} token
 * @returns {Object|null} Session data if valid, null if invalid
 */
export function verifySessionToken(token) {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    // Check if token is not older than 24 hours
    const isValid =
      decoded.timestamp && Date.now() - decoded.timestamp < 24 * 60 * 60 * 1000;
    return isValid ? decoded : null;
  } catch (error) {
    return null;
  }
}

/**
 * Sets authentication cookie
 * @param {string} token
 */
export async function setAuthCookie(token) {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });
}

/**
 * Gets authentication cookie
 * @returns {string|null} Auth token or null
 */
export async function getAuthCookie() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('auth-token');
  return authCookie?.value || null;
}

/**
 * Removes authentication cookie
 */
export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

/**
 * Gets current user from session
 * @returns {Object|null} User object if authenticated, null if not
 */
export async function getCurrentUser() {
  const token = await getAuthCookie();
  if (!token) return null;

  const sessionData = verifySessionToken(token);
  if (!sessionData) return null;

  // Return the mock user data
  return MOCK_USER;
}

/**
 * Checks if user is authenticated
 * @returns {boolean} True if authenticated, false if not
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
