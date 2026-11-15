import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { ServiceService } from '@/packages/services/services/services.service';
import { parseServiceInput } from '@/packages/services/validation/serviceAdmin.validation';
import { readAdminBody } from '@/packages/common/utils/request-body.utils';
import { requireAdmin } from '@/lib/mobile-auth';
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

/** Admin: any of { name, description, nameEn, descriptionEn, type, fields, active, order }; `fields: null` = category defaults. */
export const PUT = ApiErrorHandler(async (req: NextRequest, context) => {
  try {
    await requireAdmin(req);
    const { serviceId } = await context.params;

    const input = parseServiceInput((await readAdminBody(req, 'INVALID_SERVICE')).data, true);
    const service = await serviceService.updateService(serviceId, input);

    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

/** Admin. 409 SERVICE_HAS_SUBMISSIONS when requests were made for it (deactivate it instead). */
export const DELETE = ApiErrorHandler(async (req: NextRequest, context) => {
  try {
    await requireAdmin(req);
    const { serviceId } = await context.params;

    await serviceService.deleteService(serviceId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
