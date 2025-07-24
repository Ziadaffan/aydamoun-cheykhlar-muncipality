import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { NextRequest, NextResponse } from 'next/server';
import { ServiceService } from '@/packages/services/services/services.service';

export const dynamic = 'force-dynamic';
const serviceService = ServiceService.instance();

export const GET = ApiErrorHandler(async (request: NextRequest): Promise<NextResponse> => {
  try {
    const services = await serviceService.getServices();

    const response = NextResponse.json(services, { status: 200 });

    return response;
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
