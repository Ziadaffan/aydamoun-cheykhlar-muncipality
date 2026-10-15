'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import { useAuth } from '@/packages/common/hooks/useAuth';
import JobCardHeader from '@/packages/jobs/components/JobCardHeader';
import JobCardDetails from '@/packages/jobs/components/JobCardDetails';
import useGetJobById, { JobRequestError } from '@/packages/jobs/hooks/useGetJobById';

// The jobs list has no history behind it when a shared link is opened, so this links to it instead of going back.
function BackToJobs() {
  const { t } = useTranslation();
  return (
    <Link
      href="/jobs"
      className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
    >
      <svg className="h-5 w-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span>{t('jobs.allJobs')}</span>
    </Link>
  );
}

export default function JobPage() {
  const { t } = useTranslation();
  const params = useParams();
  const id = params?.id as string;
  const { role } = useAuth();
  const { data: job, isLoading, error } = useGetJobById(id);

  if (isLoading) {
    return <Spinner className="min-h-screen" />;
  }

  // A failed background refresh keeps showing the job already loaded.
  const notFound = !job && error instanceof JobRequestError && error.status === 404;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <BackToJobs />
        </div>

        {notFound ? (
          <div className="mx-auto max-w-3xl rounded-2xl bg-white p-10 text-center shadow-lg">
            <h1 className="mb-2 text-2xl font-bold text-gray-900">{t('jobs.notFound')}</h1>
            <p className="text-gray-600">{t('jobs.notFoundDescription')}</p>
          </div>
        ) : !job ? (
          <ErrorMessage />
        ) : (
          <article className="mx-auto max-w-3xl divide-y divide-gray-200 overflow-hidden rounded-2xl bg-white shadow-lg">
            <JobCardHeader job={job} as="h1" />

            {job.description && (
              <div className="px-4 py-5 sm:px-6">
                <h2 className="mb-3 text-base font-semibold text-gray-900">{t('jobs.aboutRole')}</h2>
                <p className="leading-8 break-words whitespace-pre-line text-gray-700 [overflow-wrap:anywhere]">{job.description}</p>
              </div>
            )}

            <div className="px-4 py-5 sm:px-6">
              <JobCardDetails job={job} showDescription={false} />
            </div>

            {role === 'ADMIN' && (
              <div className="px-4 py-5 sm:px-6">
                <Link
                  href={`/jobs/${job.id}/edit`}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-yellow-600 px-4 py-2 font-bold text-white shadow transition hover:bg-yellow-700"
                >
                  {t('jobs.edit')}
                </Link>
              </div>
            )}
          </article>
        )}
      </div>
    </div>
  );
}
