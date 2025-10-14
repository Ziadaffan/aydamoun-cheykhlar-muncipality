import { Jobs } from '@prisma/client';
import { useTranslation } from 'react-i18next';

interface JobCardDetailsProps {
  job: Jobs;
}

export default function JobCardDetails({ job }: JobCardDetailsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center text-sm text-gray-600">
        <span className="font-bold">{t('jobs.location')} : </span> <span>{job.location}</span>
      </div>

      {job.salary && (
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-bold">{t('jobs.salary')} : </span> <span>{job.salary}</span>
        </div>
      )}
    </div>
  );
}
