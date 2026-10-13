import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { requireAdmin } from '@/lib/mobile-auth';
import { UserService } from '@/packages/user/services/user.service';

export const dynamic = 'force-dynamic';

const userService = UserService.instance();

export const GET = ApiErrorHandler(async (request: NextRequest): Promise<NextResponse> => {
  try {
    await requireAdmin(request);

    const users = await userService.listUsers();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
