'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { ServiceSubmission } from '@prisma/client';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import SubmissionCard from './SubmissionCard';
import Button from '@/packages/common/components/Button';

type SubmissionsSectionProps = {
  submissions: ServiceSubmission[];
  isLoading: boolean;
  error: any;
  deletingId: string | null;
  onEditSubmission: (submissionId: string) => void;
  onDeleteSubmission: (submissionId: string) => void;
};

export default function SubmissionsSection({
  submissions,
  isLoading,
  error,
  deletingId,
  onEditSubmission,
  onDeleteSubmission,
}: SubmissionsSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="mt-8 rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">{t('profile.submissions.title')}</h2>
      </div>

      <div className="px-6 py-4">
        {isLoading && <Spinner className="min-h-[100px]" />}

        {error && <ErrorMessage />}

        {!isLoading && !error && submissions && submissions.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-600 mb-3">{t('profile.submissions.noSubmissions')}</p>
            <Button onClick={() => router.push('/services')} variant="primary">
              {t('profile.submissions.newRequest')}
            </Button>
          </div>
        )}

        {!isLoading && !error && submissions && submissions.length > 0 && (
          <div className="space-y-4">
            {submissions.map((submission: any) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                deletingId={deletingId}
                onEdit={onEditSubmission}
                onDelete={onDeleteSubmission}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
