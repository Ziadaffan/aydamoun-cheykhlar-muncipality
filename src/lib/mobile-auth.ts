import { getServerSession } from 'next-auth';
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';
import prisma from '@/packages/lib/db';
import { ForbiddenError, UnauthorizedError } from '@/packages/common/errors';

/**
 * Token-based auth for non-browser clients (e.g. the React Native app).
 *
 * Web clients keep using NextAuth's cookie session. Mobile clients call
 * /api/auth/mobile-login to receive a Bearer JWT (signed below with
 * NEXTAUTH_SECRET) and send it as `Authorization: Bearer <token>`.
 *
 * getAuthSession() accepts either, so protected API routes work for both.
 */

// Residents open a municipal app rarely, so app tokens last 30 days and GET /api/user
// swaps any token older than a day for a fresh one (sliding session). The web's
// cookie session keeps NextAuth's own lifetime.
const MOBILE_TOKEN_MAX_AGE = 30 * 24 * 60 * 60;
const MOBILE_TOKEN_RENEW_AFTER = 24 * 60 * 60;

function getSecretKey(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not set');
  }
  return new TextEncoder().encode(secret);
}

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  createdAt?: Date | string | null;
}

export interface AuthSession {
  user: SessionUser;
  /** Set when the request authenticated with a Bearer token: the token's `iat`, in seconds. */
  bearerIssuedAt?: number;
}

export async function signMobileToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    name: user.name ?? null,
    email: user.email ?? null,
    role: user.role ?? null,
    createdAt: user.createdAt ?? null,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MOBILE_TOKEN_MAX_AGE}s`)
    .sign(getSecretKey());
}

async function verifyBearer(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ['HS256'] });
    if (!payload.sub) return null;
    return {
      user: {
        id: payload.sub,
        name: (payload.name as string) ?? null,
        email: (payload.email as string) ?? null,
        role: (payload.role as string) ?? null,
        createdAt: (payload.createdAt as string) ?? null,
      },
      bearerIssuedAt: payload.iat ?? 0,
    };
  } catch {
    return null;
  }
}

/**
 * A fresh token when the session came from a Bearer token older than a day,
 * otherwise undefined. Cookie (web) sessions are left to NextAuth.
 */
export async function renewMobileToken(session: AuthSession, user: SessionUser): Promise<string | undefined> {
  if (session.bearerIssuedAt === undefined) return undefined;
  const ageSeconds = Math.floor(Date.now() / 1000) - session.bearerIssuedAt;
  return ageSeconds > MOBILE_TOKEN_RENEW_AFTER ? signMobileToken(user) : undefined;
}

/**
 * Returns the current session from either a Bearer token (mobile) or the
 * NextAuth cookie (web), or null if unauthenticated.
 */
export async function getAuthSession(request?: NextRequest): Promise<AuthSession | null> {
  const authHeader = request?.headers.get('authorization');
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) {
      return verifyBearer(token);
    }
  }

  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return session as AuthSession;
  }
  return null;
}

/**
 * Guards for API routes. Both throw an HttpError, which every handler's
 * catch block already maps to the right status via returnProperErrorMessage /
 * ApiErrorHandler.
 */
export async function requireAuth(request?: NextRequest): Promise<AuthSession> {
  const session = await getAuthSession(request);
  if (!session?.user?.id) {
    throw new UnauthorizedError('Unauthorized');
  }
  return session;
}

export async function requireAdmin(request?: NextRequest): Promise<AuthSession> {
  const session = await requireAuth(request);
  // An app token's role claim can be up to 30 days old, so a demoted admin is caught here.
  const role =
    session.bearerIssuedAt === undefined
      ? session.user.role
      : (await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } }))?.role;
  if (role !== 'ADMIN') {
    throw new ForbiddenError('Admin access required');
  }
  return session;
}
