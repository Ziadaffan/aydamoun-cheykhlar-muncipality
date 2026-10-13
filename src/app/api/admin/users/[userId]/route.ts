import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler, BadRequestError } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { requireAdmin } from '@/lib/mobile-auth';
import { UserService } from '@/packages/user/services/user.service';

export const dynamic = 'force-dynamic';

const userService = UserService.instance();

/**
 * Body: { password } to set a temporary password, or { role } to change the role.
 */
export const PATCH = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    const session = await requireAdmin(request);
    const { userId } = await context.params;
    const { password, role } = await request.json();

    if (password !== undefined) {
      const user = await userService.adminSetPassword(userId, String(password));
      return NextResponse.json({ user }, { status: 200 });
    }

    if (role !== undefined) {
      const user = await userService.adminSetRole(userId, role, session.user.id);
      return NextResponse.json({ user }, { status: 200 });
    }

    throw new BadRequestError('Nothing to update');
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
