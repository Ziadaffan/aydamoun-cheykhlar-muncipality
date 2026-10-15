'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { signOut } from 'next-auth/react';
import Button from '@/packages/common/components/Button';
import Banner from '@/packages/common/components/Banner';
import { useDeleteAccount } from '../hooks/useDeleteAccount';

// useDeleteAccount's error codes → messages.
const ERROR_KEYS: Record<string, string> = {
  INVALID_PASSWORD: 'profile.deleteAccount.messages.invalidPassword',
  PASSWORD_REQUIRED: 'profile.deleteAccount.messages.passwordRequired',
  UNAUTHORIZED: 'common.sessionExpired',
};

export default function DeleteAccountSection() {
  const { t } = useTranslation();
  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const [isConfirming, setIsConfirming] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    deleteAccount(
      { password },
      {
        onSuccess: () => signOut({ callbackUrl: '/' }),
        onError: err => setError(t(ERROR_KEYS[err.message] ?? 'profile.deleteAccount.messages.error')),
      }
    );
  };

  return (
    <div className="mt-8 rounded-lg border border-red-200 bg-white shadow">
      <div className="border-b border-red-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-red-700">{t('profile.deleteAccount.title')}</h2>
        <p className="mt-1 text-sm text-gray-600">{t('profile.deleteAccount.description')}</p>
      </div>

      <div className="px-6 py-6">
        {error && <Banner type="error" message={error} onClose={() => setError(null)} />}

        {!isConfirming ? (
          <Button variant="danger" size="md" onClick={() => setIsConfirming(true)}>
            {t('profile.deleteAccount.button')}
          </Button>
        ) : (
          <div className="space-y-4">
            <Banner type="warning" message={t('profile.deleteAccount.warning')} />

            <div>
              <label htmlFor="deleteAccountPassword" className="mb-2 block text-sm font-medium text-gray-700">
                {t('profile.deleteAccount.passwordLabel')}
              </label>
              <input
                id="deleteAccountPassword"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('profile.deleteAccount.passwordPlaceholder')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
                autoComplete="current-password"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="secondary"
                size="md"
                className="w-full sm:flex-1"
                disabled={isPending}
                onClick={() => {
                  setIsConfirming(false);
                  setPassword('');
                  setError(null);
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="danger"
                size="md"
                className="w-full sm:flex-1"
                loading={isPending}
                disabled={isPending || !password}
                onClick={handleDelete}
              >
                {t('profile.deleteAccount.confirmButton')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
