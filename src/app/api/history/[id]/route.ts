import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/mobile-auth';
import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { readAdminBody } from '@/packages/common/utils/request-body.utils';
import { HistoryService } from '@/packages/history/services/history.service';
import { parseHistoryEntryInput } from '@/packages/history/validation/history.validation';

export const dynamic = 'force-dynamic';
const historyService = HistoryService.instance();

export const GET = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    const { id } = await context.params;
    return NextResponse.json(await historyService.getEntryById(id), { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

/** Admin: any of { period, title, description, periodEn, titleEn, descriptionEn, order, image }; `removeImage=true` / `image: null` clears the image. */
export const PUT = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const { data, imageFile, imageRef, removeImage } = await readAdminBody(request, 'INVALID_HISTORY_ENTRY');

    const entry = await historyService.update(id, parseHistoryEntryInput(data, true), { imageFile, imageRef, removeImage });

    return NextResponse.json(entry, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export const DELETE = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    await requireAdmin(request);
    const { id } = await context.params;

    await historyService.delete(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
