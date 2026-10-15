import { ApiErrorHandler } from '@/packages/common/errors';
import { requireAdmin } from '@/lib/mobile-auth';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { NextRequest, NextResponse, after } from 'next/server';
import { JobsService } from '@/packages/jobs/services/jobs.service';
import { PushNotificationsService } from '@/packages/notifications/services/pushNotifications.service';

export const dynamic = 'force-dynamic';
const jobsService = JobsService.instance();
const pushNotificationsService = PushNotificationsService.instance();

export const GET = ApiErrorHandler(async (): Promise<NextResponse> => {
  try {
    const jobs = await jobsService.getJobs();

    const response = NextResponse.json(jobs, { status: 200 });

    return response;
  } catch (error) {
    return returnProperErrorMessage(error);
  }
});

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const formData = await request.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;
    const provider = formData.get('provider') as string;
    const phone = formData.get('phone') as string | null;
    const location = formData.get('location') as string;
    const salary = formData.get('salary') as string | null;
    const deadlineString = formData.get('deadline') as string | null;
    const active = formData.get('active') === 'true';

    const deadline = deadlineString ? new Date(deadlineString) : null;

    const jobData = {
      title,
      description: description || null,
      provider,
      phone: phone || null,
      location,
      salary: salary || null,
      deadline,
      active,
    };

    const job = await jobsService.create(jobData);

    // An inactive job isn't listed in the app, so nobody is told about it.
    if (job.active) {
      after(() =>
        pushNotificationsService.broadcast({
          title: 'فرصة عمل جديدة',
          body: `${job.title} · ${job.provider}`,
          path: `/jobs/${job.id}`,
        })
      );
    }

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}
