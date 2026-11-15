import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/mobile-auth';
import { ServiceService } from '@/packages/services/services/services.service';
import { parseServiceInput } from '@/packages/services/validation/serviceAdmin.validation';
import { readAdminBody } from '@/packages/common/utils/request-body.utils';

export const dynamic = 'force-dynamic';

const serviceService = ServiceService.instance();

/**
 * Active services, `order` then name, each with its resolved `fields`. `?all=1` (admin) adds inactive ones.
 * `?search=` matches name/description in Arabic or English and the type's name.
 */
export const GET = ApiErrorHandler(async (request: NextRequest): Promise<NextResponse> => {
  try {
    const all = request.nextUrl.searchParams.get('all') === '1';
    if (all) await requireAdmin(request);

    const search = request.nextUrl.searchParams.get('search')?.slice(0, 200) ?? undefined;
    const services = await serviceService.getServices({ includeInactive: all, search });

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

/** Admin: { name, description, nameEn?, descriptionEn?, type, fields (ServiceField[] | null), active, order }. */
export const POST = ApiErrorHandler(async (request: NextRequest): Promise<NextResponse> => {
  try {
    await requireAdmin(request);

    const input = parseServiceInput((await readAdminBody(request, 'INVALID_SERVICE')).data);
    const service = await serviceService.createService(input);

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
