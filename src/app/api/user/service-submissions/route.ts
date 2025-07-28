import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { NextRequest, NextResponse } from 'next/server';
import { ServiceSubmissionService } from '@/packages/serviceSubmissions/services/serviceSubmission.service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const serviceSubmissionService = ServiceSubmissionService.instance();

export const GET = ApiErrorHandler(async (request: NextRequest, context): Promise<NextResponse> => {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submissions = await serviceSubmissionService.getServiceSubmissionsByUserId(session.user.id);

    const response = NextResponse.json(submissions, { status: 200 });

    return response;
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
