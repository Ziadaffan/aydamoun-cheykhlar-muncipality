import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/mobile-auth';
import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { readAdminBody } from '@/packages/common/utils/request-body.utils';
import { HistoryService } from '@/packages/history/services/history.service';
import { parseHistoryEntryInput } from '@/packages/history/validation/history.validation';

export const dynamic = 'force-dynamic';
const historyService = HistoryService.instance();

/** Public: the village history timeline, oldest first. */
export const GET = ApiErrorHandler(async (): Promise<NextResponse> => {
  try {
    return NextResponse.json(await historyService.getEntries(), { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

/** Admin: { period, title, description, periodEn?, titleEn?, descriptionEn?, order?, image? } as JSON or form data. */
export const POST = ApiErrorHandler(async (request: NextRequest): Promise<NextResponse> => {
  try {
    await requireAdmin(request);
    const { data, imageFile, imageRef } = await readAdminBody(request, 'INVALID_HISTORY_ENTRY');

    const entry = await historyService.create(parseHistoryEntryInput(data), { imageFile, imageRef });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
