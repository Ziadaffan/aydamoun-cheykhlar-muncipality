import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/packages/auth/service/auth.service';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { toPublicUser } from '@/packages/user/services/user.service';

const authService = AuthService.instance();

export async function POST(request: NextRequest) {
  try {
    // Phone + password; an email is no longer taken for new accounts (400 PHONE_REQUIRED without a phone).
    const { name, phone, password } = await request.json();

    const user = await authService.signup({ name, phone, password });

    return NextResponse.json({ message: 'User created successfully', user: toPublicUser(user) }, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
