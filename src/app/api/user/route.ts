import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { UserService } from '@/packages/user/services/user.service';
import { getAuthSession, renewMobileToken } from '@/lib/mobile-auth';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const userService = UserService.instance();

/**
 * Who am I: the app calls this at launch and when it returns to the foreground.
 * Returns `{ user }`, plus a fresh `token` when the Bearer token is older than a day.
 */
export const GET = ApiErrorHandler(async (request: NextRequest): Promise<NextResponse> => {
  try {
    const session = await getAuthSession(request);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await userService.getProfile(session.user.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found', code: 'USER_NOT_FOUND' }, { status: 401 });
    }

    const token = await renewMobileToken(session, user);

    return NextResponse.json(token ? { user, token } : { user }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export const PUT = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    const session = await getAuthSession(request);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, phone } = await request.json();

    const user = await userService.updateUser(session.user.id, { name, email, phone });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export const PATCH = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    const session = await getAuthSession(request);
    const body = await request.json();
    const { oldPassword, newPassword } = body;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await userService.updatePassword(session.user.id, oldPassword, newPassword);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export const DELETE = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    const session = await getAuthSession(request);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { password } = await request.json().catch(() => ({ password: '' }));

    await userService.deleteAccount(session.user.id, String(password ?? ''));

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
