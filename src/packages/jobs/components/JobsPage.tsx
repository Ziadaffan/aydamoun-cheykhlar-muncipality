'use client';

import { Jobs } from '@prisma/client';
import JobCard from '@/packages/jobs/components/JobCard';
import JobsEmptyState from '@/packages/jobs/components/JobsEmptyState';
import JobsHeader from '@/packages/jobs/components/JobsHeader';
import useGetJobs from '../hooks/useGetJobs';
import { useEffect, useState } from 'react';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';

// Sample data for demonstration - replace with actual data fetching
const sampleJobs: Jobs[] = [
  {
    id: '1',
    title: 'مطور ويب',
    description:
      'نص لوريم إيبسوم هو نوع من النصوص المؤقتة المستخدمة بشكل شائع في صناعات التصميم والنشر لملء مساحة على الصفحة وإعطاء انطباع عن الشكل النهائي للمحتوىنبحث عن مطور ويب ذو خبرة في React و Node.js للانضمام إلى فريقنا المتميز.',
    provider: 'بلدية عيدمون الشيخ خضر',
    location: 'عيدمون الشيخ خضر',
    salary: '2000-3000 دولار',
    deadline: new Date('2024-12-31'),
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'محاسب',
    description: 'نحتاج إلى محاسب ذو خبرة في المحاسبة المالية وإدارة الحسابات.',
    provider: 'بلدية عيدمون الشيخ خضر',
    location: 'عيدمون الشيخ خضر',
    salary: '1500-2500 دولار',
    deadline: new Date('2026-11-30'),
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'مهندس مدني',
    description: 'نبحث عن مهندس مدني للعمل على مشاريع البنية التحتية في البلدية.',
    provider: 'بلدية عيدمون الشيخ خضر',
    location: 'عيدمون الشيخ خضر',
    salary: '2500-3500 دولار',
    deadline: new Date('2026-10-15'),
    active: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Jobs[]>([]);

  const { data: jobsData, isLoading, error } = useGetJobs();

  useEffect(() => {
    if (jobsData) {
      setJobs(jobsData);
    }
  }, [jobsData]);

  const handleViewDetails = (jobId: string) => {
    // Handle view details logic
    console.log('Viewing details for job:', jobId);
  };

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

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} onViewDetails={handleViewDetails} />
            ))}
          </div>

          {/* Empty State */}
          <JobsEmptyState jobs={jobs} />
        </div>
      </div>
    </div>
  );
}
