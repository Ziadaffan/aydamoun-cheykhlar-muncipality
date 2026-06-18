'use client';

import { useTranslation } from 'react-i18next';

export default function ChangePasswordHeader() {
  const { t } = useTranslation();

  return (
    <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('profile.changePassword.title')}</h1>
        <p className="mt-2 text-sm text-gray-600">{t('profile.changePassword.description')}</p>
      </div>
    </div>
  );
}
