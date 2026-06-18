'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceStatus } from '@prisma/client';
import { useTranslation } from 'react-i18next';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import Button from '@/packages/common/components/Button';
import { DeleteButton } from '@/packages/common/components/DeleteButton';
import { EditButton } from '@/packages/common/components/EditButton';
import { useAuth } from '@/packages/common/hooks/useAuth';
import { useAdminServiceSubmissions } from '../hooks/useAdminServiceSubmissions';
import { useAdminDeleteServiceSubmission } from '../hooks/useAdminDeleteServiceSubmission';
import { useAdminUpdateServiceSubmission } from '../hooks/useAdminUpdateServiceSubmission';
import { AdminServiceSubmission } from '../types';

export default function AdminServiceSubmissionsPage() {
  const { role, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const { data: submissions, isLoading, error } = useAdminServiceSubmissions();
  const { mutate: deleteSubmission, isPending: isDeleting } = useAdminDeleteServiceSubmission();
  const { mutate: updateSubmission, isPending: isUpdating } = useAdminUpdateServiceSubmission();

  const [statusDrafts, setStatusDrafts] = useState<Record<string, ServiceStatus>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (submissions) {
      const defaults = submissions.reduce<Record<string, ServiceStatus>>((acc, submission) => {
        acc[submission.id] = submission.status;
        return acc;
      }, {});
      setStatusDrafts(defaults);
    }
  }, [submissions]);

  const statusOptions = useMemo(
    () => [
      { value: 'PENDING', label: t('profile.submissions.status.pending') },
      { value: 'IN_PROGRESS', label: t('profile.submissions.status.inProgress') },
      { value: 'COMPLETED', label: t('profile.submissions.status.completed') },
      { value: 'REJECTED', label: t('profile.submissions.status.rejected') },
    ],
    [t]
  );

  const handleDelete = (submissionId: string) => {
    if (!confirm(t('profile.submissions.deleteConfirmation'))) return;
    setDeletingId(submissionId);
    deleteSubmission(submissionId, {
      onSettled: () => setDeletingId(null),
    });
  };

  const handleStatusChange = (submissionId: string, nextStatus: ServiceStatus) => {
    setStatusDrafts(prev => ({ ...prev, [submissionId]: nextStatus }));
  };

  const handleStatusUpdate = (submissionId: string) => {
    const nextStatus = statusDrafts[submissionId];

    setUpdatingId(submissionId);
    updateSubmission(
      {
        submissionId,
        data: { status: nextStatus },
      },
      {
        onSettled: () => setUpdatingId(null),
      }
    );
  };

  if (authLoading || isLoading) {
    return <Spinner className="min-h-screen" />;
  }

  if (role !== 'ADMIN') {
    return <ErrorMessage message={t('admin.serviceSubmissions.unauthorized')} />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.serviceSubmissions.title')}</h1>
          <p className="mt-2 text-gray-600">{t('admin.serviceSubmissions.description')}</p>
        </div>

        {!submissions || submissions.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <p className="text-gray-600">{t('admin.serviceSubmissions.empty')}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">{t('services.form.fields.fullName')}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">{t('profile.submissions.submissionDate')}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">{t('admin.serviceSubmissions.status')}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">{t('admin.serviceSubmissions.serviceName')}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">{t('admin.serviceSubmissions.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {submissions.map((submission: AdminServiceSubmission) => (
                    <tr key={submission.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <div className="font-semibold">{submission.fullName}</div>
                        <div className="text-gray-500">{submission.address}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {new Date(submission.createdAt).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <div className="flex flex-col gap-2 md:min-w-[240px] md:flex-row md:items-center">
                          <select
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm md:flex-1"
                            value={statusDrafts[submission.id] || submission.status}
                            onChange={e => handleStatusChange(submission.id, e.target.value as ServiceStatus)}
                          >
                            {statusOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <Button
                            className="whitespace-nowrap md:w-auto"
                            size="sm"
                            variant="primary"
                            loading={isUpdating && updatingId === submission.id}
                            disabled={(isUpdating && updatingId === submission.id) || (statusDrafts[submission.id] || submission.status) === submission.status}
                            onClick={() => handleStatusUpdate(submission.id)}
                          >
                            {t('admin.serviceSubmissions.updateStatus')}
                          </Button>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{submission.service?.name || t('profile.submissions.unknownService')}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Button size="sm" variant="secondary" onClick={() => router.push(`/admin/service-submissions/${submission.id}/view`)}>
                            {t('admin.serviceSubmissions.view')}
                          </Button>
                          <EditButton onClick={() => router.push(`/admin/service-submissions/${submission.id}`)} />
                          <DeleteButton
                            onClick={() => handleDelete(submission.id)}
                            isDeleting={isDeleting && deletingId === submission.id}
                            className="mr-2"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
