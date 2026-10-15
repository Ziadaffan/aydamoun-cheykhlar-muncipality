import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { ServiceSubmissionService } from '@/packages/serviceSubmissions/services/serviceSubmission.service';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/mobile-auth';
import { ServiceService } from '@/packages/services/services/services.service';
import { parseSubmissionInput, readJsonObject } from '@/packages/serviceSubmissions/validation/submission.validation';

const serviceSubmissionService = ServiceSubmissionService.instance();
const serviceService = ServiceService.instance();

export const dynamic = 'force-dynamic';

export const GET = ApiErrorHandler(async (req: NextRequest, context) => {
  try {
    const { serviceId } = await context.params;

    const session = await requireAuth(req);

    // Admins see every submission for the service; users only see their own.
    const submissions =
      session.user.role === 'ADMIN'
        ? await serviceSubmissionService.getServiceSubmissionsByServiceId(serviceId)
        : await serviceSubmissionService.getServiceSubmissionsByServiceIdForUser(serviceId, session.user.id);

    return NextResponse.json(submissions, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export const POST = ApiErrorHandler(async (req: NextRequest, context) => {
  try {
    const { serviceId } = await context.params;
    const session = await requireAuth(req);

    const data = parseSubmissionInput(await readJsonObject(req));
    // 404 for a removed service instead of a foreign-key error (500).
    await serviceService.getServiceById(serviceId);

    const submission = await serviceSubmissionService.createServiceSubmissions(serviceId, session.user.id, data);

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
