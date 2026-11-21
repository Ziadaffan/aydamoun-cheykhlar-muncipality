'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ServiceStatus } from '@prisma/client';
import { DeleteButton } from '@/packages/common/components/DeleteButton';
import { submissionReference } from '@/packages/serviceSubmissions/utils/reference';
import { getServiceCategoryMeta } from '@/packages/services/utils/service.utils';
import { useLocalized } from '@/lib/localized';
import { dateLocale } from '@/packages/common/utils/date.utils';
import { MySubmission, submissionCategory } from '../utils/filterSubmissions';

const STATUS_STYLES: Record<ServiceStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export const STATUS_LABEL_KEYS: Record<ServiceStatus, string> = {
  PENDING: 'profile.submissions.status.pending',
  IN_PROGRESS: 'profile.submissions.status.inProgress',
  COMPLETED: 'profile.submissions.status.completed',
  REJECTED: 'profile.submissions.status.rejected',
};

type MySubmissionCardProps = {
  submission: MySubmission;
  isDeleting: boolean;
  onDelete: (submissionId: string) => void;
};

/** One request: service, category, status, dates, number and description. Pending ones open the edit page. */
export default function MySubmissionCard({ submission, isDeleting, onDelete }: MySubmissionCardProps) {
  const { t, i18n } = useTranslation();
  const loc = useLocalized();
  const locale = dateLocale(i18n.language);
  const formatDay = (value: Date | string) => new Date(value).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });

  const serviceName = submission.service ? loc(submission.service.name, submission.service.nameEn) : t('profile.submissions.unknownService');
  const categoryKey = getServiceCategoryMeta(submissionCategory(submission)).categoryKey;
  const editable = submission.status === 'PENDING';
  const editHref = `/profile/edit-submission/${submission.id}`;
  const wasUpdated = new Date(submission.updatedAt).getTime() - new Date(submission.createdAt).getTime() > 60_000;

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-gray-500">{t(`services.${categoryKey}.title`)}</p>
          <h2 className="mt-0.5 text-base font-semibold text-gray-900">
            {editable ? (
              <Link href={editHref} className="hover:text-blue-700 hover:underline focus:outline-none focus-visible:underline">
                {serviceName}
              </Link>
            ) : (
              serviceName
            )}
          </h2>
        </div>
        <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[submission.status]}`}>
          {t(STATUS_LABEL_KEYS[submission.status])}
        </span>
      </div>

      {submission.description && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{submission.description}</p>}

      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
        <div className="flex gap-1">
          <dt>{t('profile.submissions.reference')}:</dt>
          <dd dir="ltr" className="font-mono font-semibold text-gray-700">
            {submissionReference(submission.id)}
          </dd>
        </div>
        <div className="flex gap-1">
          <dt>{t('profile.submissions.submissionDate')}:</dt>
          <dd>{formatDay(submission.createdAt)}</dd>
        </div>
        {wasUpdated && (
          <div className="flex gap-1">
            <dt>{t('profile.submissions.lastUpdate')}:</dt>
            <dd>{formatDay(submission.updatedAt)}</dd>
          </div>
        )}
      </dl>

      {/* Like the app: residents change or withdraw a request only while it is pending. */}
      {editable && (
        <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
          <Link
            href={editHref}
            className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200"
          >
            {t('common.edit')}
          </Link>
          <DeleteButton onClick={() => onDelete(submission.id)} isDeleting={isDeleting} />
        </div>
      )}
    </article>
  );
}
