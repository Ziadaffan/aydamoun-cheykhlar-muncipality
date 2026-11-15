import { NextRequest, NextResponse } from 'next/server';
import { signMobileToken } from '@/lib/mobile-auth';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { findOrCreateGoogleUser, verifyGoogleIdToken } from '@/packages/auth/service/google.service';
import { toPublicUser } from '@/packages/user/services/user.service';

export const dynamic = 'force-dynamic';

/**
 * Google sign-in for the app. Body: { idToken } (from Google Sign-In on the device).
 * Returns { token, user, isNew }, like /api/auth/mobile-login plus whether the account
 * was just created. Errors: 400 MISSING_ID_TOKEN, 401 INVALID_GOOGLE_TOKEN,
 * 503 GOOGLE_NOT_CONFIGURED (GOOGLE_CLIENT_IDS not set).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    const identity = await verifyGoogleIdToken(body?.idToken);
    const { user, isNew } = await findOrCreateGoogleUser(identity);

    const token = await signMobileToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });

    const { id, name, email, phone, image, role, createdAt, updatedAt, password } = user;
    return NextResponse.json({
      token,
      user: toPublicUser({ id, name, email, phone, image, role, createdAt, updatedAt, password }),
      isNew,
    });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
