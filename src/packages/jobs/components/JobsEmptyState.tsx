import { Jobs } from '@prisma/client';
import { useTranslation } from 'react-i18next';

interface JobsEmptyStateProps {
  jobs: Jobs[];
}

export default function JobsEmptyState({ jobs }: JobsEmptyStateProps) {
  const { t } = useTranslation();

  if (jobs.length > 0) return null;

  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-4 h-24 w-24 text-gray-400">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-medium text-gray-900">{t('jobs.noJobs', 'لا توجد وظائف متاحة حالياً')}</h3>
      <p className="text-gray-500">{t('jobs.noJobsDescription', 'تحقق مرة أخرى لاحقاً للاطلاع على الفرص الجديدة')}</p>
    </div>
  );
}
