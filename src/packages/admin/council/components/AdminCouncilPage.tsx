'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Banner from '@/packages/common/components/Banner';
import { DeleteButton } from '@/packages/common/components/DeleteButton';
import StoredImage from '@/packages/common/components/StoredImage';
import { getPositionLabel } from '@/packages/common/utils/position.utils';
import AdminPage from '../../common/AdminPage';
import { councilResource } from '../councilResource';
import EmptyState from '@/packages/common/components/EmptyState';
import { Inbox } from 'lucide-react';

export default function AdminCouncilPage() {
  const { t } = useTranslation();
  const { data: members, isLoading, error } = councilResource.useList();
  const { mutate: deleteMember, isPending: isDeleting, variables: deletingId } = councilResource.useDelete();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const onDelete = (id: string) => {
    if (!confirm(t('admin.common.deleteConfirmation'))) return;
    deleteMember(id, {
      onSuccess: () => setMessage({ type: 'success', text: t('admin.common.messages.deleted') }),
      onError: () => setMessage({ type: 'error', text: t('admin.common.messages.deleteError') }),
    });
  };

  return (
    <AdminPage
      title={t('admin.council.title')}
      description={t('admin.council.description')}
      action={{ label: t('admin.council.create'), href: '/admin/council/create' }}
      isLoading={isLoading}
      error={error}
    >
      {message && <Banner type={message.type} message={message.text} onClose={() => setMessage(null)} />}

      {members?.length === 0 ? (
        <EmptyState icon={Inbox} title={t('admin.council.empty')} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members?.map(member => (
            <div key={member.id} className="flex gap-4 rounded-2xl bg-white p-5 shadow">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-gray-100">
                {member.image && <StoredImage src={member.image} alt={member.name} sizes="80px" />}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-gray-900">{member.name}</h2>
                <p className="text-sm font-semibold text-blue-700">{getPositionLabel(member.position)}</p>
                {member.role && <p className="text-sm text-gray-700">{member.role}</p>}
                {member.major && <p className="text-sm text-gray-500">{member.major}</p>}
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/admin/council/${member.id}/edit`}
                    className="rounded-md bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-200"
                  >
                    {t('admin.common.edit')}
                  </Link>
                  <DeleteButton onClick={() => onDelete(member.id)} isDeleting={isDeleting && deletingId === member.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
