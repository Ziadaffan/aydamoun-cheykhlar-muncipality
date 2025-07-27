import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/packages/auth/service/auth.service';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';

const authService = AuthService.instance();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    const user = await authService.signup({ name, email, password });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ message: 'User created successfully', user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
