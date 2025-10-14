import { Jobs } from '@prisma/client';
import Button from '@/packages/common/components/Button';
import { formatDate } from '@/packages/common/utils/date.utils';
import { useTranslation } from 'react-i18next';
import { isDeadlinePassed } from '@/packages/jobs/utils/jobs.utils';

interface JobCardFooterProps {
  job: Jobs;
  onViewDetails?: (jobId: string) => void;
}

export default function JobCardFooter({ job, onViewDetails }: JobCardFooterProps) {
  const { t } = useTranslation();
  const deadlinePassed = isDeadlinePassed(job.deadline);

  return (
    <div className="flex flex-col space-y-3 px-4 py-4 sm:px-6">
      {/* Date line */}
      <div className="flex items-center text-sm text-gray-500">
        {job.deadline && (
          <div className="flex items-center">
            <svg className="ml-2 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className={deadlinePassed ? 'font-medium text-red-600' : ''}>
              {t('jobs.deadline')}: {formatDate(job.deadline)}
            </span>
            {deadlinePassed && <span className="mr-2 text-xs font-medium text-red-600">({t('jobs.expired')})</span>}
          </div>
        )}
      </div>

      {/* Buttons line */}
      <div className="mt-4 flex items-center justify-center space-x-2">
        {onViewDetails && (
          <Button variant="primary" size="md" onClick={() => onViewDetails(job.id)} className="w-full">
            {t('jobs.viewDetails')}
          </Button>
        )}
      </div>
    </div>
  );
}
