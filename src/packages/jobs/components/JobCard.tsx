'use client';

import { Jobs } from '@prisma/client';
import JobCardHeader from '@/packages/jobs/components/JobCardHeader';
import JobCardDetails from '@/packages/jobs/components/JobCardDetails';
import JobCardFooter from '@/packages/jobs/components/JobCardFooter';
import { useAuth } from '@/packages/common/hooks/useAuth';

export interface JobCardProps {
  job: Jobs;
}

export default function JobCard({ job }: JobCardProps) {
  const { role } = useAuth();
  return (
    <div className={`flex ${role === 'ADMIN' ? 'h-110' : 'h-90'} flex-col divide-y divide-gray-200 rounded-lg bg-white shadow-sm`}>
      {/* Header */}
      <JobCardHeader job={job} />

      {/* Content */}
      <div className="flex-1 px-4 py-5 sm:p-6">
        {/* Job Details */}
        <JobCardDetails job={job} />
      </div>

      {/* Footer */}
      {role === 'ADMIN' && (
        <div className="mt-auto">
          <JobCardFooter job={job} />
        </div>
      )}
    </div>
  );
}
