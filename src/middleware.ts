import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (!token) return false;

        const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

        if (isAdminRoute) {
          return token.role === 'ADMIN';
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/services/forms/:path*', '/profile', '/admin/:path*'],
};
