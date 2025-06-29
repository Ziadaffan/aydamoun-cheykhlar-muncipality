import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { NextResponse } from 'next/server';
import { AboutUsService } from '@/packages/about-us/services/about-us.service';

export const dynamic = 'force-dynamic';
const councilService = AboutUsService.instance();

export const GET = ApiErrorHandler(async (): Promise<NextResponse> => {
  try {
    const councilMembers = await councilService.getCouncilMembers();

    const response = NextResponse.json(councilMembers, { status: 200 });

    return response;
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
