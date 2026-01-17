import { NextResponse } from 'next/server';
import { verifySessionToken } from './lib/auth';

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/add-item', '/profile'];

// Define public routes that should redirect authenticated users
const authRoutes = ['/login'];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies (check both new and old cookie names for compatibility)
  const authToken = request.cookies.get('auth-token')?.value;
  const oldAuthCookie = request.cookies.get('auth')?.value === 'true';

  // Verify if user is authenticated
  const isAuthenticated = authToken
    ? verifySessionToken(authToken) !== null
    : oldAuthCookie;

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check if current path is an auth route (like login)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to products page
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/products', request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
