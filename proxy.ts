import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function proxy(req) {
    // Handle CORS for API routes
    if (req.nextUrl.pathname.startsWith('/api/')) {
      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        return new NextResponse(null, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers':
              'Content-Type, Authorization, x-seller-id',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      // Add CORS headers to all API responses
      const response = NextResponse.next();
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS',
      );
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, x-seller-id',
      );
      return response;
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Protected routes that require authentication
        const protectedRoutes = [
          '/add-item',
          '/dashboard',
          '/checkout',
          '/my-listings',
        ];

        // Check if the current path is protected
        const isProtectedRoute = protectedRoutes.some((route) =>
          pathname.startsWith(route),
        );

        // If it's a protected route, require authentication
        if (isProtectedRoute) {
          return !!token;
        }

        // Allow access to non-protected routes
        return true;
      },
    },
  },
);

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
