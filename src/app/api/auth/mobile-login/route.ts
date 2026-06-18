import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/packages/lib/db';
import { signMobileToken } from '@/lib/mobile-auth';

export const dynamic = 'force-dynamic';

/**
 * Token-based login for non-browser clients (React Native app).
 * Body: { identifier: string (email or phone), password: string }
 * Returns: { token, user } — send the token as `Authorization: Bearer <token>`.
 */
export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const trimmed = String(identifier).trim();
    const isEmail = trimmed.includes('@');

    const user = await prisma.user.findFirst({
      where: isEmail ? { email: trimmed.toLowerCase() } : { phone: trimmed.replace(/\s|-/g, '') },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
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
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
