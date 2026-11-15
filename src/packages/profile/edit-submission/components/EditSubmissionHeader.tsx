'use client';

import { useTranslation } from 'react-i18next';
import { Service, ServiceSubmission } from '@prisma/client';
import { useLocalized } from '@/lib/localized';

type EditSubmissionHeaderProps = {
  submission: (ServiceSubmission & { service: Service }) | null;
};

export default function EditSubmissionHeader({ submission }: EditSubmissionHeaderProps) {
  const { t } = useTranslation();
  const loc = useLocalized();

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">{t('profile.editSubmission.title')}</h1>
      <p className="mt-2 text-gray-600">
        {t('profile.editSubmission.description')}
        {submission && (
          <span className="font-medium text-gray-800">
            {' '}
            {submission.fullName} - {submission.service && loc(submission.service.name, submission.service.nameEn)}
          </span>
        )}
      </p>
    </div>
  );
}
