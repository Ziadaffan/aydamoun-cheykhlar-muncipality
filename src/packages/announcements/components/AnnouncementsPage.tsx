'use client';

import { useTranslation } from 'react-i18next';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import { useGetAnnouncements } from '../hooks/useGetAnnouncements';
import AnnouncementCard from './AnnouncementCard';

export default function AnnouncementsPage() {
  const { t } = useTranslation();
  const { data: announcements, isLoading, error } = useGetAnnouncements();

  if (isLoading) return <Spinner className="min-h-screen" />;
  if (error) return <ErrorMessage />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-800 md:text-5xl">{t('announcements.title')}</h1>
          <p className="text-lg text-gray-600">{t('announcements.subtitle')}</p>
        </div>
        {announcements?.length === 0 ? (
          <p className="rounded-2xl bg-white p-8 text-center text-gray-600 shadow">{t('announcements.empty')}</p>
        ) : (
          <div className="space-y-6">
            {announcements?.map(announcement => (
              <AnnouncementCard key={announcement.id} t={t} announcement={announcement} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
