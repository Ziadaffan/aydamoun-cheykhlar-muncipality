import { NextRequest, NextResponse, after } from 'next/server';
import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { ServiceSubmissionService } from '@/packages/serviceSubmissions/services/serviceSubmission.service';
import { getAuthSession } from '@/lib/mobile-auth';
import { parseSubmissionUpdate, readJsonObject } from '@/packages/serviceSubmissions/validation/submission.validation';
import { PushNotificationsService } from '@/packages/notifications/services/pushNotifications.service';
import { requestStatusPush } from '@/packages/notifications/services/pushMessages';

const serviceSubmissionService = ServiceSubmissionService.instance();
const pushNotificationsService = PushNotificationsService.instance();

export const dynamic = 'force-dynamic';

const requireAdminSession = async (request: NextRequest) => {
  const session = await getAuthSession(request);

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    return null;
  }

  return session;
};

export const GET = ApiErrorHandler(async (req: NextRequest, context): Promise<NextResponse> => {
  try {
    const session = await requireAdminSession(req);

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
    const session = await requireAdminSession(req);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await readJsonObject(req);
    const { submissionId } = await context.params;

    const { submission, previousStatus } = await serviceSubmissionService.updateServiceSubmissionAsAdmin(submissionId, {
      ...parseSubmissionUpdate(body),
      status: body.status,
    });

    // Tell the resident (installs subscribed to "requests"), after the response.
    if (submission.status !== previousStatus) {
      after(() => pushNotificationsService.sendToUser(submission.userId, 'requests', requestStatusPush(submission, submission.service)));
    }

    return NextResponse.json(submission, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export const DELETE = ApiErrorHandler(async (req: NextRequest, context): Promise<NextResponse> => {
  try {
    const session = await requireAdminSession(req);

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
