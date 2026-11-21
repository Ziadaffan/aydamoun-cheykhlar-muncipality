'use client';

import { Jobs } from '@prisma/client';
import Button from '@/packages/common/components/Button';
import { useRouter } from 'next/navigation';
import { useDeleteJob } from '@/packages/jobs/hooks/useDeleteJob';
import { useTranslation } from 'react-i18next';

interface JobCardFooterProps {
  job: Jobs;
}

/** Admin actions on a job card. */
export default function JobCardFooter({ job }: JobCardFooterProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { mutate: deleteJob, isPending } = useDeleteJob();

  const handleDelete = () => {
    if (confirm(t('jobs.actions.confirmDelete'))) {
      deleteJob(job.id);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="warning" size="md" onClick={() => router.push(`/jobs/${job.id}/edit`)} className="flex-1">
        {t('jobs.actions.edit')}
      </Button>
      <Button variant="danger" size="md" onClick={handleDelete} loading={isPending} className="flex-1">
        {t('jobs.actions.delete')}
      </Button>
    </div>
  );
}
