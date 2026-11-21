import { Jobs } from '@prisma/client';
import { Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EmptyState from '@/packages/common/components/EmptyState';

interface JobsEmptyStateProps {
  jobs: Jobs[];
}

export default function JobsEmptyState({ jobs }: JobsEmptyStateProps) {
  const { t } = useTranslation();
  if (jobs.length > 0) return null;
  return <EmptyState icon={Briefcase} title={t('jobs.noJobs')} description={t('jobs.noJobsDescription')} />;
}
