import { ApiErrorHandler } from '@/packages/common/errors';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { NextResponse } from 'next/server';
import { JobsService } from '@/packages/jobs/services/jobs.service';

export const dynamic = 'force-dynamic';
const jobsService = JobsService.instance();

export const GET = ApiErrorHandler(async (): Promise<NextResponse> => {
  try {
    const jobs = await jobsService.getJobs();

    const response = NextResponse.json(jobs, { status: 200 });

    return response;
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});
