'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import Button from '@/packages/common/components/Button';
import { DeleteButton } from '@/packages/common/components/DeleteButton';
import { BackButton } from '@/packages/common/components/BackButton';
import { useAuth } from '@/packages/common/hooks/useAuth';
import { getAdditionalFields } from '@/packages/services/utils/form.utils';
import { mapServiceTypeToCategory } from '@/packages/services/utils/category.utils';
import { useAdminServiceSubmission } from '../hooks/useAdminSubmission';
import { useAdminDeleteServiceSubmission } from '../hooks/useAdminDeleteServiceSubmission';

export default function AdminViewSubmissionPage() {
  const params = useParams();
  const submissionId = params?.submissionId as string;
  const router = useRouter();
  const { t } = useTranslation();
  const { role, isLoading: authLoading } = useAuth();

  const { data: submission, isLoading, error } = useAdminServiceSubmission(submissionId);
  const { mutate: deleteSubmission, isPending: isDeleting } = useAdminDeleteServiceSubmission();

  const statusText = useMemo(() => {
    switch (submission?.status) {
      case 'PENDING':
        return t('profile.submissions.status.pending');
      case 'IN_PROGRESS':
        return t('profile.submissions.status.inProgress');
      case 'COMPLETED':
        return t('profile.submissions.status.completed');
      case 'REJECTED':
        return t('profile.submissions.status.rejected');
      default:
        return submission?.status || '-';
    }
  }, [submission?.status, t]);

  const statusStyles = useMemo(() => {
    switch (submission?.status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  }, [submission?.status]);

  const handleDelete = () => {
    if (!submissionId) return;
    if (!confirm(t('profile.submissions.deleteConfirmation'))) return;

    deleteSubmission(submissionId, {
      onSuccess: () => router.push('/admin/service-submissions'),
    });
  };

  if (authLoading || isLoading) {
    return <Spinner className="min-h-screen" />;
  }

  if (role !== 'ADMIN') {
    return <ErrorMessage message={t('admin.serviceSubmissions.unauthorized')} />;
  }

  if (error || !submission) {
    return <ErrorMessage />;
  }

  const additionalFields = getAdditionalFields(mapServiceTypeToCategory(submission.service?.type || ''), submission.serviceId);
  const additionalInfoEntries = buildAdditionalInfoEntries(submission.additionalInfo, additionalFields);

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="mb-6 rounded-2xl bg-white p-8 shadow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('admin.serviceSubmissions.viewTitle')}</h1>
              <p className="mt-2 text-gray-600">
                {t('admin.serviceSubmissions.serviceName')}: <span className="font-semibold text-gray-800">{submission.service?.name || '-'}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusStyles}`}>{statusText}</span>
              <Button variant="secondary" size="sm" onClick={() => router.push(`/admin/service-submissions/${submissionId}`)}>
                {t('admin.serviceSubmissions.edit')}
              </Button>
              <DeleteButton onClick={handleDelete} isDeleting={isDeleting} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-8 shadow">
            <h2 className="mb-4 text-xl font-bold text-gray-900">{t('admin.serviceSubmissions.applicantInfo')}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow label={t('services.form.fields.fullName')} value={submission.fullName} />
              <InfoRow label={t('services.form.fields.phone')} value={submission.phone} />
              <InfoRow label={t('services.form.fields.email')} value={submission.email || submission.user?.email || '-'} />
              <InfoRow label={t('services.form.fields.address')} value={submission.address} />
              <InfoRow
                label={t('profile.submissions.submissionDate')}
                value={new Date(submission.createdAt).toLocaleDateString('ar-SA')}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow">
            <h2 className="mb-4 text-xl font-bold text-gray-900">{t('services.form.requestDetails')}</h2>
            <div className="text-gray-800">
              <p className="whitespace-pre-wrap">{submission.description || '-'}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow">
            <h2 className="mb-4 text-xl font-bold text-gray-900">{t('services.form.additionalInfo')}</h2>
            {additionalInfoEntries.length === 0 ? (
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-gray-700">{t('admin.serviceSubmissions.noAdditionalInfo')}</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {additionalInfoEntries.map(entry => (
                  <InfoRow key={entry.key} label={entry.label} value={entry.value} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <div className="text-sm font-semibold text-gray-700">{label}</div>
      <div className="mt-1 text-gray-900">{value}</div>
    </div>
  );
}

type AdditionalFieldDef = { name: string; label: string };

function buildAdditionalInfoEntries(additionalInfo: unknown, additionalFields: AdditionalFieldDef[]) {
  if (!additionalInfo || typeof additionalInfo !== 'object' || Array.isArray(additionalInfo)) {
    const value = formatAdditionalInfoValue(additionalInfo);
    return value ? [{ key: 'value', label: 'القيمة', value }] : [];
  }

  const additionalInfoObj = additionalInfo as Record<string, any>;
  const fieldLabelByName = new Map<string, string>(additionalFields.map(f => [f.name, f.label]));
  const usedKeys = new Set<string>();

  const fromDefs = additionalFields
    .filter(f => Object.prototype.hasOwnProperty.call(additionalInfoObj, f.name))
    .map(f => {
      usedKeys.add(f.name);
      return {
        key: f.name,
        label: f.label,
        value: formatAdditionalInfoValue(additionalInfoObj[f.name]),
      };
    });

  const remaining = Object.keys(additionalInfoObj)
    .filter(key => !usedKeys.has(key))
    .sort()
    .map(key => ({
      key,
      label: fieldLabelByName.get(key) || prettifyKey(key),
      value: formatAdditionalInfoValue(additionalInfoObj[key]),
    }));

  return [...fromDefs, ...remaining].filter(e => e.value !== '');
}

function formatAdditionalInfoValue(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'نعم' : 'لا';
  if (Array.isArray(value)) {
    const parts = value.map(v => formatAdditionalInfoValue(v)).filter(Boolean);
    return parts.join('، ');
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function prettifyKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();
}

