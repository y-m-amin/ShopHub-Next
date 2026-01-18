import { withAuth } from "next-auth/middleware";

export default withAuth(
  function proxy(req) {
    // Add any custom proxy logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard", "/add-item", "/checkout"],
};