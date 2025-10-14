import { Jobs } from '@prisma/client';
import { useTranslation } from 'react-i18next';

interface JobCardHeaderProps {
  job: Jobs;
}

export default function JobCardHeader({ job }: JobCardHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="line-clamp-1 text-lg leading-6 font-medium text-gray-900">{job.title}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-gray-500">{job.provider}</p>
        </div>
        {!job.active && (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
            {t('jobs.inactive')}
          </span>
        )}
      </div>
    </div>
  );
}
