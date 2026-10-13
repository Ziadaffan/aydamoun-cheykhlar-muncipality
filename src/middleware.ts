import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

// Pages that only admins may open: the /admin area plus every create/edit page
// for managed content (news, jobs, documents, associations, taxi stops).
const ADMIN_ROUTE = /^\/(admin(\/.*)?|(news|jobs|associations|taxi-stops|documents)\/create|(news|jobs|associations|taxi-stops)\/[^/]+\/edit)$/;

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    pages: { signIn: '/auth/login' },
    callbacks: {
      authorized: ({ token, req }) => {
        if (!token) return false;

        if (ADMIN_ROUTE.test(req.nextUrl.pathname)) {
          return token.role === 'ADMIN';
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/services/forms/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/news/create',
    '/news/:id/edit',
    '/jobs/create',
    '/jobs/:id/edit',
    '/documents/create',
    '/associations/create',
    '/associations/:id/edit',
    '/taxi-stops/create',
    '/taxi-stops/:id/edit',
  ],
};
