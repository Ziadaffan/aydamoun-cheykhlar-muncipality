'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Banner from '@/packages/common/components/Banner';
import { DeleteButton } from '@/packages/common/components/DeleteButton';
import { formatDate } from '@/packages/common/utils/date.utils';
import AdminPage from '../../common/AdminPage';
import { announcementsResource } from '../announcementsResource';
import EmptyState from '@/packages/common/components/EmptyState';
import { Inbox } from 'lucide-react';

const PRIORITY_STYLES = {
  NORMAL: 'bg-gray-100 text-gray-700',
  IMPORTANT: 'bg-amber-100 text-amber-800',
  URGENT: 'bg-red-100 text-red-800',
} as const;

export default function AdminAnnouncementsPage() {
  const { t } = useTranslation();
  const { data: announcements, isLoading, error } = announcementsResource.useList();
  const { mutate: deleteAnnouncement, isPending: isDeleting, variables: deletingId } = announcementsResource.useDelete();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const onDelete = (id: string) => {
    if (!confirm(t('admin.common.deleteConfirmation'))) return;
    deleteAnnouncement(id, {
      onSuccess: () => setMessage({ type: 'success', text: t('admin.common.messages.deleted') }),
      onError: () => setMessage({ type: 'error', text: t('admin.common.messages.deleteError') }),
    });
  };

  const now = Date.now();

  return (
    <AdminPage
      title={t('admin.announcements.title')}
      description={t('admin.announcements.description')}
      action={{ label: t('admin.announcements.create'), href: '/admin/announcements/create' }}
      isLoading={isLoading}
      error={error}
    >
      {message && <Banner type={message.type} message={message.text} onClose={() => setMessage(null)} />}

      {announcements?.length === 0 ? (
        <EmptyState icon={Inbox} title={t('admin.announcements.empty')} />
      ) : (
        <div className="space-y-4">
          {announcements?.map(announcement => {
            const expired = !!announcement.expiresAt && new Date(announcement.expiresAt).getTime() <= now;
            return (
              <div
                key={announcement.id}
                className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${PRIORITY_STYLES[announcement.priority]}`}>
                      {t(`admin.announcements.priority.${announcement.priority}`)}
                    </span>
                    {announcement.pinned && (
                      <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-800">
                        {t('admin.announcements.pinned')}
                      </span>
                    )}
                    {expired && (
                      <span className="rounded-full bg-gray-200 px-3 py-0.5 text-xs font-semibold text-gray-600">
                        {t('admin.announcements.expired')}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{announcement.title}</h2>
                  <p className="mt-1 line-clamp-2 text-gray-600">{announcement.body}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {formatDate(announcement.createdAt)}
                    {announcement.expiresAt && ` · ${t('admin.announcements.expiresAt')}: ${formatDate(announcement.expiresAt)}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/announcements/${announcement.id}/edit`}
                    className="rounded-md bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-200"
                  >
                    {t('admin.common.edit')}
                  </Link>
                  <DeleteButton onClick={() => onDelete(announcement.id)} isDeleting={isDeleting && deletingId === announcement.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminPage>
  );
}
