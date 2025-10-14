'use client';

import { Jobs } from '@prisma/client';
import JobCardHeader from '@/packages/jobs/components/JobCardHeader';
import JobCardDetails from '@/packages/jobs/components/JobCardDetails';
import JobCardFooter from '@/packages/jobs/components/JobCardFooter';

export interface JobCardProps {
  job: Jobs;
  onViewDetails?: (jobId: string) => void;
}

export default function JobCard({ job, onViewDetails }: JobCardProps) {
  return (
    <div className="flex h-100 flex-col divide-y divide-gray-200 rounded-lg bg-white shadow-sm">
      {/* Header */}
      <JobCardHeader job={job} />

      {/* Content */}
      <div className="flex-1 px-4 py-5 sm:p-6">
        {job.description && <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-700">{job.description}</p>}

        {/* Job Details */}
        <JobCardDetails job={job} />
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <JobCardFooter job={job} onViewDetails={onViewDetails} />
      </div>
    </div>
  );
}
