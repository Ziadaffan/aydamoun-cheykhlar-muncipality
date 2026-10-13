import { NextRequest, NextResponse } from 'next/server';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { PasswordResetService } from '@/packages/auth/service/password-reset.service';

export const dynamic = 'force-dynamic';

const passwordResetService = PasswordResetService.instance();

/**
 * Body: { email }
 * Always answers 200 so the response doesn't reveal whether an account exists.
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    await passwordResetService.requestReset(email);

    return NextResponse.json({ message: 'If an account exists for this email, a reset link has been sent' }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
