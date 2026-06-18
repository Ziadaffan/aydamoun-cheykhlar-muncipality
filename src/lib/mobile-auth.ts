import { getServerSession } from 'next-auth';
import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';

/**
 * Token-based auth for non-browser clients (e.g. the React Native app).
 *
 * Web clients keep using NextAuth's cookie session. Mobile clients call
 * /api/auth/mobile-login to receive a Bearer JWT (signed below with
 * NEXTAUTH_SECRET) and send it as `Authorization: Bearer <token>`.
 *
 * getAuthSession() accepts either, so protected API routes work for both.
 */

const MOBILE_TOKEN_MAX_AGE = 24 * 60 * 60; // 24h, matches the NextAuth session

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
    };
  } catch {
    return null;
  }
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
