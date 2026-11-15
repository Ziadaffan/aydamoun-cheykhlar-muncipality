import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/mobile-auth';
import { readAdminBody } from '@/packages/common/utils/request-body.utils';
import { AboutUsService } from '@/packages/about-us/services/about-us.service';
import { parseCouncilMemberInput } from '@/packages/about-us/validation/council.validation';

export const dynamic = 'force-dynamic';
const councilService = AboutUsService.instance();

export const GET = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    const { id } = await context.params;
    return NextResponse.json(await councilService.getCouncilMemberById(id), { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

/** Admin: any of the POST fields; `removeImage=true` / `image: null` clears the photo. */
export const PUT = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const { data, imageFile, imageRef, removeImage } = await readAdminBody(request, 'INVALID_COUNCIL_MEMBER');

    const member = await councilService.updateCouncilMember(id, parseCouncilMemberInput(data, true), { imageFile, imageRef, removeImage });

    return NextResponse.json(member, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export const DELETE = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    await requireAdmin(request);
    const { id } = await context.params;

    await councilService.deleteCouncilMember(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
