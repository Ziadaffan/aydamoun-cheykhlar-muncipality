'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import { BackButton } from '@/packages/common/components/BackBotton';
import { useAuth } from '@/packages/common/hooks/useAuth';
import EditSubmissionHeader from '@/packages/profile/edit-submission/components/EditSubmissionHeader';
import EditSubmissionForm from '@/packages/profile/edit-submission/components/EditSubmissionForm';
import { useAdminEditSubmission } from '../hooks/useAdminEditSubmission';

export default function AdminEditSubmissionPage() {
  const params = useParams();
  const submissionId = params?.submissionId as string;
  const { t } = useTranslation();
  const { role, isLoading: authLoading } = useAuth();

  const {
    form,
    submission,
    isLoading,
    isSubmitting,
    message,
    onSubmit,
    closeMessage,
    errorSubmission,
    mappedCategory,
    mappedServiceId,
  } = useAdminEditSubmission(submissionId);

  if (authLoading || isLoading) {
    return <Spinner className="min-h-screen" />;
  }

  if (role !== 'ADMIN') {
    return <ErrorMessage message={t('admin.serviceSubmissions.unauthorized')} />;
  }

  if (errorSubmission) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ErrorMessage />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <EditSubmissionHeader submission={submission} />

        {submission && (
          <EditSubmissionForm
            form={form}
            isSubmitting={isSubmitting}
            message={message}
            onSubmit={onSubmit}
            closeMessage={closeMessage}
            category={mappedCategory}
            serviceId={mappedServiceId}
            showStatusField
          />
        )}
      </div>
    </div>
  );
}
