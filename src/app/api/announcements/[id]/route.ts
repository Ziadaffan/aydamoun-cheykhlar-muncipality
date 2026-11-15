import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/mobile-auth';
import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { readAdminBody } from '@/packages/common/utils/request-body.utils';
import { AnnouncementsService } from '@/packages/announcements/services/announcements.service';
import { parseAnnouncementInput } from '@/packages/announcements/validation/announcements.validation';

export const dynamic = 'force-dynamic';
const announcementsService = AnnouncementsService.instance();

/** Public, expired ones included (a notification can be opened later). 404 ANNOUNCEMENT_NOT_FOUND. */
export const GET = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    const { id } = await context.params;
    const announcement = await announcementsService.getAnnouncementById(id);
    return NextResponse.json(announcement, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

/** Admin: any of { title, body, titleEn, bodyEn, priority, pinned, expiresAt, image }; `removeImage=true` / `image: null` clears the image. */
export const PUT = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const { data, imageFile, imageRef, removeImage } = await readAdminBody(request, 'INVALID_ANNOUNCEMENT');

    const announcement = await announcementsService.update(id, parseAnnouncementInput(data, true), { imageFile, imageRef, removeImage });

    return NextResponse.json(announcement, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export const DELETE = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    await requireAdmin(request);
    const { id } = await context.params;

    await announcementsService.delete(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
