import { createRemoteJWKSet, jwtVerify } from 'jose';
import { User } from '@prisma/client';
import prisma from '@/packages/lib/db';
import { BadRequestError, UnauthorizedError } from '@/packages/common/errors';
import { HttpError } from '@/packages/common/errors/HttpError';

/**
 * Google sign-in, shared by the app (POST /api/auth/google with a Google ID token)
 * and the website (NextAuth's Google provider): both end up with the same User row.
 */

const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
const GOOGLE_ISSUERS = ['accounts.google.com', 'https://accounts.google.com'];
export const GOOGLE_PROVIDER = 'google';

class ServiceUnavailableError extends HttpError {
  constructor(msg: string, code?: string) {
    super(msg, 503, code);
  }
}

export type GoogleIdentity = {
  /** Google's stable account id (`sub`). */
  sub: string;
  email: string;
  name: string | null;
  picture: string | null;
};

/** Client ids allowed as the token audience: GOOGLE_CLIENT_IDS (comma list) plus the website's GOOGLE_CLIENT_ID. */
function allowedAudiences(): string[] {
  const ids = [...(process.env.GOOGLE_CLIENT_IDS ?? '').split(','), process.env.GOOGLE_CLIENT_ID ?? ''].map(id => id.trim()).filter(Boolean);
  return Array.from(new Set(ids));
}

/**
 * Verifies a Google ID token (signature, issuer, audience, expiry) and returns the
 * identity. 503 GOOGLE_NOT_CONFIGURED, 400 MISSING_ID_TOKEN, 401 INVALID_GOOGLE_TOKEN.
 */
export async function verifyGoogleIdToken(idToken: unknown): Promise<GoogleIdentity> {
  const audiences = allowedAudiences();
  if (audiences.length === 0) {
    throw new ServiceUnavailableError('Google sign-in is not configured', 'GOOGLE_NOT_CONFIGURED');
  }
  if (typeof idToken !== 'string' || !idToken.trim()) {
    throw new BadRequestError('Missing ID token', 'MISSING_ID_TOKEN');
  }

  const invalid = () => new UnauthorizedError('Invalid Google token', 'INVALID_GOOGLE_TOKEN');
  let payload;
  try {
    ({ payload } = await jwtVerify(idToken.trim(), GOOGLE_JWKS, { issuer: GOOGLE_ISSUERS, audience: audiences }));
  } catch {
    throw invalid();
  }

  const emailVerified = payload.email_verified === true || payload.email_verified === 'true';
  if (!payload.sub || typeof payload.email !== 'string' || !emailVerified) {
    throw invalid();
  }

  return {
    sub: payload.sub,
    email: payload.email.trim().toLowerCase(),
    name: typeof payload.name === 'string' ? payload.name : null,
    picture: typeof payload.picture === 'string' ? payload.picture : null,
  };
}

/**
 * The account of a (verified) Google identity: the user already linked to it, else the
 * user with that email (and the Google account gets linked), else a new user.
 */
export async function findOrCreateGoogleUser(identity: GoogleIdentity): Promise<{ user: User; isNew: boolean }> {
  const linked = await prisma.account.findUnique({
    where: { provider_providerAccountId: { provider: GOOGLE_PROVIDER, providerAccountId: identity.sub } },
    include: { user: true },
  });
  if (linked) return { user: linked.user, isNew: false };

  const accountData = { type: 'oauth', provider: GOOGLE_PROVIDER, providerAccountId: identity.sub };

  const existing = await prisma.user.findUnique({ where: { email: identity.email } });
  if (existing) {
    await linkAccount(existing.id, accountData);
    // Google has just confirmed the address.
    const user = existing.emailVerified ? existing : await prisma.user.update({ where: { id: existing.id }, data: { emailVerified: new Date() } });
    return { user, isNew: false };
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: identity.name,
        email: identity.email,
        image: identity.picture,
        emailVerified: new Date(),
        accounts: { create: accountData },
      },
    });
    return { user, isNew: true };
  } catch (error) {
    // Two sign-ins racing (same email or same Google account): the other one won.
    if ((error as { code?: string })?.code === 'P2002') {
      return findOrCreateGoogleUser(identity);
    }
    throw error;
  }
}

async function linkAccount(userId: string, accountData: { type: string; provider: string; providerAccountId: string }) {
  try {
    await prisma.account.create({ data: { ...accountData, userId } });
  } catch (error) {
    // Already linked by a parallel sign-in.
    if ((error as { code?: string })?.code !== 'P2002') throw error;
  }
}
