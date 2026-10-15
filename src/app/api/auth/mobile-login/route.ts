import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/packages/lib/db';
import { signMobileToken } from '@/lib/mobile-auth';
import { normalizePhone, phoneLookupValues } from '@/packages/common/utils/phone.utils';

export const dynamic = 'force-dynamic';

const invalidCredentials = () => NextResponse.json({ error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }, { status: 401 });

/**
 * Token-based login for non-browser clients (React Native app).
 * Body: { identifier: string (email or phone), password: string }
 * Returns: { token, user } — send the token as `Authorization: Bearer <token>`.
 */
export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Missing credentials', code: 'MISSING_CREDENTIALS' }, { status: 400 });
    }

    const trimmed = String(identifier).trim();
    const isEmail = trimmed.includes('@');
    const phone = isEmail ? '' : normalizePhone(trimmed);

    if (!isEmail && !phone) {
      return invalidCredentials();
    }

    const user = await prisma.user.findFirst({
      where: isEmail ? { email: trimmed.toLowerCase() } : { phone: { in: phoneLookupValues(trimmed) } },
    });

    if (!user || !user.password) {
      return invalidCredentials();
    }

    const isPasswordValid = await bcrypt.compare(String(password), user.password);
    if (!isPasswordValid) {
      return invalidCredentials();
    }

    const token = await signMobileToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
