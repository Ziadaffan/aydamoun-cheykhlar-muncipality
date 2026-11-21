'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Banner from '@/packages/common/components/Banner';
import { DeleteButton } from '@/packages/common/components/DeleteButton';
import AdminPage from '../../common/AdminPage';
import { historyResource } from '../historyResource';
import EmptyState from '@/packages/common/components/EmptyState';
import { Inbox } from 'lucide-react';

export default function AdminHistoryPage() {
  const { t } = useTranslation();
  const { data: entries, isLoading, error } = historyResource.useList();
  const { mutate: deleteEntry, isPending: isDeleting, variables: deletingId } = historyResource.useDelete();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const onDelete = (id: string) => {
    if (!confirm(t('admin.common.deleteConfirmation'))) return;
    deleteEntry(id, {
      onSuccess: () => setMessage({ type: 'success', text: t('admin.common.messages.deleted') }),
      onError: () => setMessage({ type: 'error', text: t('admin.common.messages.deleteError') }),
    });
  };

  return (
    <AdminPage
      title={t('admin.history.title')}
      description={t('admin.history.description')}
      action={{ label: t('admin.history.create'), href: '/admin/history/create' }}
      isLoading={isLoading}
      error={error}
    >
      {message && <Banner type={message.type} message={message.text} onClose={() => setMessage(null)} />}

      {entries?.length === 0 ? (
        <EmptyState icon={Inbox} title={t('admin.history.empty')} />
      ) : (
        <ol className="space-y-4">
          {entries?.map(entry => (
            <li key={entry.id} className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-gray-500">
                    {t('admin.common.order')}: {entry.order}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">{entry.title}</h2>
                <p className="mt-1 line-clamp-2 text-gray-600">{entry.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/history/${entry.id}/edit`}
                  className="rounded-md bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-200"
                >
                  {t('admin.common.edit')}
                </Link>
                <DeleteButton onClick={() => onDelete(entry.id)} isDeleting={isDeleting && deletingId === entry.id} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </AdminPage>
  );
}
