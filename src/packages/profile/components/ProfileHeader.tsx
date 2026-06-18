'use client';

import { useTranslation } from 'react-i18next';
import { User } from 'next-auth';

type ProfileHeaderProps = {
  user: User | null | undefined;
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-10 sm:px-10 sm:py-12">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-10 sm:space-x-reverse">
        {/* Avatar */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-3xl font-bold text-white shadow-lg ring-4 ring-blue-100">
          {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
        </div>

        {/* User info */}
        <div className="text-center sm:text-right">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-900">{user?.name}</h1>
          <div className="space-y-1">
            <p className="font-medium text-gray-700">{user?.email}</p>
            <p className="text-sm text-gray-500">
              {t('profile.header.memberSince')} {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
