'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { ServiceSubmission } from '@prisma/client';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import SubmissionCard from './SubmissionCard';

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
            <p className="text-gray-600">{t('profile.submissions.noSubmissions')}</p>
            <button
              onClick={() => router.push('/services')}
              className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {t('profile.submissions.newRequest')}
            </button>
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