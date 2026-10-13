'use client';

import { useState } from 'react';
import { Role } from '@prisma/client';
import { useTranslation } from 'react-i18next';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import Button from '@/packages/common/components/Button';
import Banner from '@/packages/common/components/Banner';
import { useAuth } from '@/packages/common/hooks/useAuth';
import { formatDate } from '@/packages/common/utils/date.utils';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useAdminUpdateUser } from '../hooks/useAdminUpdateUser';
import { AdminUser } from '../types';

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const { role, userId: currentUserId, isLoading: authLoading } = useAuth();
  const { data: users, isLoading, error } = useAdminUsers();
  const { mutate: updateUser, isPending } = useAdminUpdateUser();

  const [resettingId, setResettingId] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const startReset = (user: AdminUser) => {
    setResettingId(user.id);
    setTempPassword('');
    setMessage(null);
  };

  const submitReset = () => {
    if (!resettingId) return;
    updateUser(
      { userId: resettingId, data: { password: tempPassword } },
      {
        onSuccess: () => {
          setMessage({ type: 'success', text: t('admin.users.messages.passwordReset') });
          setResettingId(null);
          setTempPassword('');
        },
        onError: err => setMessage({ type: 'error', text: err.message || t('admin.users.messages.error') }),
      }
    );
  };

  const changeRole = (user: AdminUser, nextRole: Role) => {
    if (nextRole === user.role) return;
    if (!confirm(t('admin.users.roleConfirmation'))) return;
    updateUser(
      { userId: user.id, data: { role: nextRole } },
      {
        onSuccess: () => setMessage({ type: 'success', text: t('admin.users.messages.roleUpdated') }),
        onError: err => setMessage({ type: 'error', text: err.message || t('admin.users.messages.error') }),
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
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.users.title')}</h1>
          <p className="mt-2 text-gray-600">{t('admin.users.description')}</p>
        </div>

        {message && <Banner type={message.type} message={message.text} onClose={() => setMessage(null)} />}

        {resettingId && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="mb-3 text-sm font-medium text-yellow-900">{t('admin.users.resetPasswordHint')}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="text"
                value={tempPassword}
                onChange={e => setTempPassword(e.target.value)}
                placeholder={t('admin.users.tempPasswordPlaceholder')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:flex-1"
                dir="ltr"
              />
              <Button size="md" variant="primary" loading={isPending} disabled={isPending || tempPassword.length < 6} onClick={submitReset}>
                {t('admin.users.confirmReset')}
              </Button>
              <Button size="md" variant="secondary" disabled={isPending} onClick={() => setResettingId(null)}>
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        )}

        {!users || users.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <p className="text-gray-600">{t('admin.users.empty')}</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                      {t('admin.users.columns.name')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                      {t('admin.users.columns.contact')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                      {t('admin.users.columns.role')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                      {t('admin.users.columns.submissions')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                      {t('admin.users.columns.createdAt')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                      {t('admin.serviceSubmissions.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map(user => (
                    <tr key={user.id} className={user.id === resettingId ? 'bg-yellow-50' : undefined}>
                      <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap text-gray-900">{user.name || '—'}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900" dir="ltr">
                        <div>{user.email || '—'}</div>
                        <div className="text-gray-500">{user.phone || '—'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        <select
                          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                          value={user.role}
                          disabled={isPending || user.id === currentUserId}
                          onChange={e => changeRole(user, e.target.value as Role)}
                        >
                          <option value="USER">{t('admin.users.roles.user')}</option>
                          <option value="ADMIN">{t('admin.users.roles.admin')}</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{user._count.submissions}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{formatDate(user.createdAt)}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        <Button size="sm" variant="warning" disabled={isPending} onClick={() => startReset(user)}>
                          {t('admin.users.resetPassword')}
                        </Button>
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
