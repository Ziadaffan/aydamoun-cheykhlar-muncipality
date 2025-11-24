import { Jobs } from '@prisma/client';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/packages/common/utils/date.utils';
import { isDeadlinePassed } from '@/packages/jobs/utils/jobs.utils';

interface JobCardDetailsProps {
  job: Jobs;
}

export default function JobCardDetails({ job }: JobCardDetailsProps) {
  const { t } = useTranslation();
  const deadlinePassed = isDeadlinePassed(job.deadline);

  return (
    <div className="flex flex-col gap-4">
      {/* Description */}
      {job.description && (
        <div className="text-sm leading-relaxed text-gray-700">
          <p>{job.description}</p>
        </div>
      )}

      {/* Provider */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <span className="font-medium">{t('jobs.provider')}:</span>
        <span>{job.provider}</span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="font-medium">{t('jobs.location')}:</span>
        <span>{job.location}</span>
      </div>

      {/* Salary */}
      {job.salary && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">{t('jobs.salary')}:</span>
          <span>{job.salary}</span>
        </div>
      )}

      {/* Created Date */}
      <div className="flex items-center gap-2 font-medium text-gray-600">
        <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="font-medium">
          {t('jobs.createdAt')}: {formatDate(job.createdAt)}
        </span>
      </div>

      {/* Deadline */}
      {job.deadline && (
        <div className="flex items-center gap-2 text-sm">
          <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="font-medium text-gray-600">{t('jobs.deadline')}:</span>
          <span className={deadlinePassed ? 'font-medium text-red-600' : 'text-gray-600'}>{formatDate(job.deadline)}</span>
          {deadlinePassed && <span className="text-xs font-medium text-red-600">({t('jobs.expired')})</span>}
        </div>
      )}
    </div>
  );
}
