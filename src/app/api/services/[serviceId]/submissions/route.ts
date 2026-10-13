import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { ServiceSubmissionService } from '@/packages/serviceSubmissions/services/serviceSubmission.service';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/mobile-auth';

const serviceSubmissionService = ServiceSubmissionService.instance();

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
    const data = await req.json();

    const session = await requireAuth(req);

    const submission = await serviceSubmissionService.createServiceSubmissions(serviceId, {
      ...data,
      userId: session.user.id,
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
