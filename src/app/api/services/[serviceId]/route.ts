import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { ServiceService } from '@/packages/services/services/services.service';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const serviceService = ServiceService.instance(); 

export const GET = ApiErrorHandler(async (req: NextRequest, context) => {
  try {
    const { serviceId } = await context.params;

    const service = await serviceService.getServiceById(serviceId);

    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
