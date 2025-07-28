import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { NextRequest, NextResponse } from 'next/server';
import { ServiceSubmissionService } from '@/packages/serviceSubmissions/services/serviceSubmission.service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const serviceSubmissionService = ServiceSubmissionService.instance();

export const DELETE = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    const { submissionId } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await serviceSubmissionService.deleteServiceSubmission(submissionId, session.user.id);

    return NextResponse.json({ message: 'Submission deleted successfully' }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
