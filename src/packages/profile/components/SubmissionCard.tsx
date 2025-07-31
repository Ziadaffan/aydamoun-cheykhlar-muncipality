'use client';

import { useTranslation } from 'react-i18next';
import { ServiceSubmission } from '@prisma/client';
import { EditButton } from '@/packages/common/components/EditButton';
import { DeleteButton } from '@/packages/common/components/DeleteButton';

type SubmissionCardProps = {
  submission: ServiceSubmission & {
    service?: {
      name: string;
    };
  };
  deletingId: string | null;
  onEdit: (submissionId: string) => void;
  onDelete: (submissionId: string) => void;
};

export default function SubmissionCard({ submission, deletingId, onEdit, onDelete }: SubmissionCardProps) {
  const { t } = useTranslation();

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return t('profile.submissions.status.pending');
      case 'IN_PROGRESS':
        return t('profile.submissions.status.inProgress');
      case 'COMPLETED':
        return t('profile.submissions.status.completed');
      default:
        return t('profile.submissions.status.rejected');
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{submission.service?.name || t('profile.submissions.unknownService')}</h3>
          <p className="text-sm text-gray-600">
            {submission.description && submission.description.length > 30 ? `${submission.description.substring(0, 30)}...` : submission.description}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {t('profile.submissions.submissionDate')}: {new Date(submission.createdAt).toLocaleDateString('ar-SA')}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <div>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyles(submission.status)}`}>
              {getStatusText(submission.status)}
            </span>
          </div>

          <div className="flex space-x-2 space-x-reverse">
            <EditButton onClick={() => onEdit(submission.id)} />
            <DeleteButton onClick={() => onDelete(submission.id)} isDeleting={deletingId === submission.id} className="mr-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
