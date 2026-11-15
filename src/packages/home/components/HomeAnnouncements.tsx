'use client';

import Link from 'next/link';
import { TFunction } from 'i18next';
import { useGetAnnouncements } from '@/packages/announcements/hooks/useGetAnnouncements';
import AnnouncementCard from '@/packages/announcements/components/AnnouncementCard';
import HomeSectionHeader from './HomeSectionHeader';

type HomeAnnouncementsProps = {
  t: TFunction<'translation', undefined>;
};

// The latest municipality announcements, pinned first, like the app's home screen.
export default function HomeAnnouncements({ t }: HomeAnnouncementsProps) {
  const { data: announcements, isError } = useGetAnnouncements(3);

  // Nothing to show (or still loading): leave the section out rather than show an empty box.
  if (isError || !announcements || announcements.length === 0) return null;

  return (
    <section className="px-4 pt-16">
      <div className="mx-auto max-w-7xl">
        <HomeSectionHeader
          title={t('home.announcements.title')}
          action={{ label: t('home.viewAll'), href: '/announcements', ariaLabel: t('home.announcements.viewAllLabel') }}
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {announcements.map(announcement => (
            <Link key={announcement.id} href={`/announcements#${announcement.id}`} className="block transition-transform hover:-translate-y-0.5">
              <AnnouncementCard t={t} announcement={announcement} compact />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
