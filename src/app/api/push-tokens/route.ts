import { NextRequest, NextResponse } from 'next/server';
import { BadRequestError } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import {
  PushNotificationsService,
  isValidPlatform,
  isValidPushToken,
} from '@/packages/notifications/services/pushNotifications.service';

export const dynamic = 'force-dynamic';
const pushNotificationsService = PushNotificationsService.instance();

// The app registers its Expo push token here on every launch; no sign-in
// needed, since announcements go to every install.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const token = body?.token;
    const platform = body?.platform;

    if (!isValidPushToken(token)) {
      throw new BadRequestError('Invalid push token', 'INVALID_PUSH_TOKEN');
    }
    if (!isValidPlatform(platform)) {
      throw new BadRequestError('Invalid platform', 'INVALID_PLATFORM');
    }

    await pushNotificationsService.register(token, platform);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
