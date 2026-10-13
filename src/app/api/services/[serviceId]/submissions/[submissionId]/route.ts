import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { ServiceSubmissionService } from '@/packages/serviceSubmissions/services/serviceSubmission.service';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/mobile-auth';

const serviceSubmissionService = ServiceSubmissionService.instance();

export const dynamic = 'force-dynamic';

export const GET = ApiErrorHandler(async (req: NextRequest, context) => {
  try {
    const { submissionId, serviceId } = await context.params;

    const session = await requireAuth(req);

    const submission = await serviceSubmissionService.getServiceSubmissionById(submissionId, serviceId, {
      userId: session.user.id,
      isAdmin: session.user.role === 'ADMIN',
    });

    return NextResponse.json(submission, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
