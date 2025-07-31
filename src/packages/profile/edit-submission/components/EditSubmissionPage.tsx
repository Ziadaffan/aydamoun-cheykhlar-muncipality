'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/packages/common/hooks/useAuth';
import { useEditSubmission } from '../hooks/useEditSubmission';
import EditSubmissionForm from './EditSubmissionForm';
import EditSubmissionHeader from './EditSubmissionHeader';
import Spinner from '@/packages/common/components/Spinner';
import { BackButton } from '@/packages/common/components/BackBotton';
import ErrorMessage from '@/packages/common/components/ErrorMessage';

export default function EditSubmissionPage() {
  const params = useParams();
  const submissionId = params?.submissionId as string;
  const { isLoading: authLoading } = useAuth();

  const { form, submission, isLoading, isSubmitting, message, onSubmit, closeMessage, errorSubmission, mappedCategory, mappedServiceId } =
    useEditSubmission({
      submissionId,
      serviceId: '',
      category: '',
    });

  if (authLoading || isLoading) {
    return <Spinner className="min-h-screen" />;
  }

  if (errorSubmission) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <ErrorMessage />
          </div>
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
          />
        )}
      </div>
    </div>
  );
}
