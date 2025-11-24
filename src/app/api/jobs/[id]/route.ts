import { NextRequest, NextResponse } from 'next/server';
import { returnProperErrorMessage } from '@/packages/common/utils/error.utils';
import { JobsService } from '@/packages/jobs/services/jobs.service';

const jobsService = JobsService.instance();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const job = await jobsService.getJobById(id);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const result = await jobsService.deleteJob(id);

    if (!result) {
      return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Job deleted successfully' }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string | null;
    const provider = formData.get('provider') as string;
    const location = formData.get('location') as string;
    const salary = formData.get('salary') as string | null;
    const deadlineString = formData.get('deadline') as string | null;
    const active = formData.get('active') === 'true';

    const deadline = deadlineString ? new Date(deadlineString) : null;

    const jobData = {
      title,
      description: description || null,
      provider,
      location,
      salary: salary || null,
      deadline,
      active,
    };

    const result = await jobsService.updateJob(id, jobData);

    if (!result) {
      return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Job updated successfully' }, { status: 200 });
  } catch (error) {
    return returnProperErrorMessage(error);
  }
}

