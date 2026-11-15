import { NextRequest, NextResponse, after } from 'next/server';
import { requireAdmin } from '@/lib/mobile-auth';
import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { readAdminBody } from '@/packages/common/utils/request-body.utils';
import { AnnouncementsService } from '@/packages/announcements/services/announcements.service';
import { parseAnnouncementInput } from '@/packages/announcements/validation/announcements.validation';
import { PushNotificationsService } from '@/packages/notifications/services/pushNotifications.service';
import { announcementPush } from '@/packages/notifications/services/pushMessages';

export const dynamic = 'force-dynamic';
const announcementsService = AnnouncementsService.instance();
const pushNotificationsService = PushNotificationsService.instance();

/**
 * Public: announcements that haven't expired, pinned first then newest (`?limit=N`).
 * `?all=1` (admin) includes expired ones.
 */
export const GET = ApiErrorHandler(async (request: NextRequest): Promise<NextResponse> => {
  try {
    const params = request.nextUrl.searchParams;
    const all = params.get('all') === '1';
    if (all) await requireAdmin(request);

    const limit = Number.parseInt(params.get('limit') ?? '', 10);
    const announcements = await announcementsService.getAnnouncements({
      includeExpired: all,
      limit: Number.isFinite(limit) && limit > 0 ? limit : undefined,
    });

    return NextResponse.json(announcements, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

/** Admin: { title, body, titleEn?, bodyEn?, priority?, pinned?, expiresAt?, image? } as JSON or form data. Pushes to "announcements". */
export const POST = ApiErrorHandler(async (request: NextRequest): Promise<NextResponse> => {
  try {
    const session = await requireAdmin(request);
    const { data, imageFile, imageRef } = await readAdminBody(request, 'INVALID_ANNOUNCEMENT');

    const announcement = await announcementsService.create(parseAnnouncementInput(data), session.user.id, { imageFile, imageRef });

    // An announcement that is already expired isn't listed anywhere, so nobody is told.
    if (!announcement.expiresAt || announcement.expiresAt > new Date()) {
      after(() => pushNotificationsService.broadcast('announcements', announcementPush(announcement)));
    }

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
