'use client';

import { useTranslation } from 'react-i18next';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import { useGetAnnouncements } from '../hooks/useGetAnnouncements';
import AnnouncementGridCard from './AnnouncementGridCard';
import EmptyState from '@/packages/common/components/EmptyState';
import { Megaphone } from 'lucide-react';
import { useHashModal } from '@/packages/common/hooks/useHashModal';
import PageHeader from '@/packages/common/components/PageHeader';

export default function AnnouncementsPage() {
  const { t } = useTranslation();
  const { data: announcements, isLoading, error } = useGetAnnouncements();
  // Home links to /announcements#<id>: open that one once the list is here.
  const { openId, open, close } = useHashModal(announcements);

  if (isLoading) return <Spinner className="min-h-screen" />;
  if (error) return <ErrorMessage />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-mist to-sand py-12">
      <div className="mx-auto max-w-7xl px-4">
        <PageHeader title={t('announcements.title')} subtitle={t('announcements.subtitle')} />
        {announcements?.length === 0 ? (
          <EmptyState icon={Megaphone} title={t('announcements.empty')} description={t('home.announcements.emptyBody')} />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {announcements?.map(announcement => (
              <AnnouncementGridCard
                key={announcement.id}
                t={t}
                announcement={announcement}
                open={openId === announcement.id}
                onOpen={() => open(announcement.id)}
                onClose={close}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
