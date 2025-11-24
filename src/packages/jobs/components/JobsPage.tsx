'use client';

import { Jobs } from '@prisma/client';
import JobCard from '@/packages/jobs/components/JobCard';
import JobsEmptyState from '@/packages/jobs/components/JobsEmptyState';
import JobsHeader from '@/packages/jobs/components/JobsHeader';
import useGetJobs from '../hooks/useGetJobs';
import { useEffect, useState } from 'react';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import Button from '@/packages/common/components/Button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/packages/common/hooks/useAuth';

export default function JobsPage() {
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const router = useRouter();
  const { role } = useAuth();

  const { data: jobsData, isLoading, error } = useGetJobs();

  useEffect(() => {
    if (jobsData) {
      setJobs(jobsData);
    }
  }, [jobsData]);

  if (isLoading) {
    return <Spinner className="min-h-screen" />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 py-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <JobsHeader />

          {/* Create Button for Admins */}
          {role === 'ADMIN' && (
            <div className="mb-8 flex justify-center">
              <Button variant="primary" size="lg" onClick={() => router.push('/jobs/create')}>
                إنشاء وظيفة جديدة
              </Button>
            </div>
          )}

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {/* Empty State */}
          <JobsEmptyState jobs={jobs} />
        </div>
      </div>
    </div>
  );
}
