import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { ServiceSubmissionService } from '@/packages/serviceSubmissions/services/serviceSubmission.service';
import { authOptions } from '@/lib/auth';

const serviceSubmissionService = ServiceSubmissionService.instance();

export const dynamic = 'force-dynamic';

const requireAdminSession = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return null;
  }

  return session;
};

export const GET = ApiErrorHandler(async (req: NextRequest, context): Promise<NextResponse> => {
  try {
    const session = await requireAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { submissionId } = await context.params;
    const submission = await serviceSubmissionService.getServiceSubmissionByIdAdmin(submissionId);

    return NextResponse.json(submission, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export const PUT = ApiErrorHandler(async (req: NextRequest, context): Promise<NextResponse> => {
  try {
    const session = await requireAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { submissionId } = await context.params;

    const updatedSubmission = await serviceSubmissionService.updateServiceSubmissionAsAdmin(submissionId, body);

    return NextResponse.json(updatedSubmission, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export const DELETE = ApiErrorHandler(async (req: NextRequest, context): Promise<NextResponse> => {
  try {
    const session = await requireAdminSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { submissionId } = await context.params;

    await serviceSubmissionService.deleteServiceSubmissionAsAdmin(submissionId);

    return NextResponse.json({ message: 'Submission deleted successfully' }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
