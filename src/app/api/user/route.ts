import { authOptions } from '@/lib/auth';
import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { UserService } from '@/packages/user/services/user.service';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const userService = UserService.instance();

export const PUT = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const user = await userService.updateUser(session.user.id, body);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export const PATCH = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    const session = await getServerSession(authOptions);
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
