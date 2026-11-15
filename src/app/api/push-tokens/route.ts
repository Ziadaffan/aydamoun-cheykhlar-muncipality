import { NextRequest, NextResponse } from 'next/server';
import { BadRequestError } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { getAuthSession } from '@/lib/mobile-auth';
import {
  PushNotificationsService,
  isValidLocale,
  isValidPlatform,
  isValidPushToken,
  isValidTopics,
} from '@/packages/notifications/services/pushNotifications.service';

export const dynamic = 'force-dynamic';
const pushNotificationsService = PushNotificationsService.instance();

/**
 * The app registers its Expo push token here on every launch, signed in or not.
 * Body: { token, platform, locale?: 'ar'|'en', topics?: string[], signedOut?: true }
 * - A valid Bearer token links the install to that user (personal notifications);
 *   without one the last known user is kept, unless `signedOut: true` is sent.
 * - Omitted locale/topics keep the stored values (new installs: 'ar', every topic).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const token = body?.token;
    const platform = body?.platform;
    const locale = body?.locale;
    const topics = body?.topics;

    if (!isValidPushToken(token)) {
      throw new BadRequestError('Invalid push token', 'INVALID_PUSH_TOKEN');
    }
    if (!isValidPlatform(platform)) {
      throw new BadRequestError('Invalid platform', 'INVALID_PLATFORM');
    }
    if (locale !== undefined && locale !== null && !isValidLocale(locale)) {
      throw new BadRequestError('Invalid locale', 'INVALID_LOCALE');
    }
    if (topics !== undefined && topics !== null && !isValidTopics(topics)) {
      throw new BadRequestError('Invalid topics', 'INVALID_TOPICS');
    }

    let userId: string | null | undefined;
    if (body?.signedOut === true) {
      userId = null;
    } else if (request.headers.get('authorization')?.toLowerCase().startsWith('bearer ')) {
      // An expired or invalid token only means the install isn't linked this time.
      userId = (await getAuthSession(request))?.user.id ?? undefined;
    }

    const registration = { token, platform, locale: locale ?? undefined, topics: topics ?? undefined, userId };
    try {
      await pushNotificationsService.register(registration);
    } catch (error) {
      // The token's account was deleted in the meantime: register the install unlinked.
      if ((error as { code?: string })?.code !== 'P2003') throw error;
      await pushNotificationsService.register({ ...registration, userId: null });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}

/** Body: { token }. The user turned notifications off: the install is forgotten. */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const token = body?.token;

    if (!isValidPushToken(token)) {
      throw new BadRequestError('Invalid push token', 'INVALID_PUSH_TOKEN');
    }

    await pushNotificationsService.unregister(token);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
