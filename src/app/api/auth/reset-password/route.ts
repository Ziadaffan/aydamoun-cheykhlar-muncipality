import { NextRequest, NextResponse } from 'next/server';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { PasswordResetService } from '@/packages/auth/service/password-reset.service';

export const dynamic = 'force-dynamic';

const passwordResetService = PasswordResetService.instance();

/**
 * Body: { token, password }
 */
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    await passwordResetService.resetPassword(String(token ?? ''), String(password ?? ''));

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
