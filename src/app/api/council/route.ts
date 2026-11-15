import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/mobile-auth';
import { readAdminBody } from '@/packages/common/utils/request-body.utils';
import { AboutUsService } from '@/packages/about-us/services/about-us.service';
import { parseCouncilMemberInput } from '@/packages/about-us/validation/council.validation';

export const dynamic = 'force-dynamic';
const councilService = AboutUsService.instance();

/** Public: president, vice-president, then members by `order` and name (with role and major). */
export const GET = ApiErrorHandler(async (): Promise<NextResponse> => {
  try {
    const councilMembers = await councilService.getCouncilMembers();

    return NextResponse.json(councilMembers, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

/** Admin: { name, position, role?, major?, nameEn?, roleEn?, majorEn?, phone?, email?, order?, image? } as JSON or form data. */
export const POST = ApiErrorHandler(async (request: NextRequest): Promise<NextResponse> => {
  try {
    await requireAdmin(request);
    const { data, imageFile, imageRef } = await readAdminBody(request, 'INVALID_COUNCIL_MEMBER');

    const member = await councilService.createCouncilMember(parseCouncilMemberInput(data), { imageFile, imageRef });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
