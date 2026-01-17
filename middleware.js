import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is authenticated for protected routes
        const { pathname } = req.nextUrl;

        // Protected routes that require authentication
        const protectedRoutes = ['/add-item', '/dashboard'];

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
    // - api/auth (NextAuth.js routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
