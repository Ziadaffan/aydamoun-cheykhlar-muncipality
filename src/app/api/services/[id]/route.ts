import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { ServiceService } from '@/packages/services/services/services.service';
import { NextRequest, NextResponse } from 'next/server';

export const GET = ApiErrorHandler(async (req: NextRequest, { params }) => {
  try {
    const { id } = params;
    console.log(id);
    const service = await ServiceService.instance().getServiceById(id);

    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
