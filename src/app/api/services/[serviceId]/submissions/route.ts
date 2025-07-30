import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { ServiceSubmissionService } from '@/packages/serviceSubmissions/services/serviceSubmission.service';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const serviceSubmissionService = ServiceSubmissionService.instance();

export const dynamic = 'force-dynamic';

export const GET = ApiErrorHandler(async (req: NextRequest, context) => {
  try {
    const { serviceId } = await context.params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const submissions = await serviceSubmissionService.getServiceSubmissionsByServiceId(serviceId);

    return NextResponse.json(submissions, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export const POST = ApiErrorHandler(async (req: NextRequest, context) => {
  try {
    const { serviceId } = await context.params;
    const data = await req.json();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const submission = await serviceSubmissionService.createServiceSubmissions(serviceId, {
      ...data,
      userId,
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
