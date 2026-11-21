'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TFunction } from 'i18next';
import { ChevronLeft, Megaphone } from 'lucide-react';
import { useGetAnnouncements } from '@/packages/announcements/hooks/useGetAnnouncements';
import AnnouncementCard from '@/packages/announcements/components/AnnouncementCard';
import { AnnouncementDetails } from '@/packages/announcements/components/AnnouncementGridCard';
import Modal from '@/packages/common/components/Modal';
import type { AnnouncementDto } from '@/packages/announcements/types';
import HomeSectionHeader from './HomeSectionHeader';

type HomeAnnouncementsProps = {
  t: TFunction<'translation', undefined>;
};

/**
 * The latest municipality announcements, pinned first, like the app's home screen.
 * Always shown: with none (or the API failing) a calm card still leads to the page.
 */
export default function HomeAnnouncements({ t }: HomeAnnouncementsProps) {
  const { data: announcements, isPending, isError } = useGetAnnouncements(3);
  // Opens right here on home, like the app.
  const [selected, setSelected] = useState<AnnouncementDto | null>(null);

  let body: React.ReactNode;
  if (isPending) {
    body = (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3" role="status" aria-label={t('common.loading')}>
        {[0, 1, 2].map(i => (
          <div key={i} className={`animate-pulse space-y-3 rounded-2xl bg-white p-5 shadow-md ${i > 0 ? 'hidden lg:block' : ''}`}>
            <div className="h-5 w-1/3 rounded-full bg-gray-200" />
            <div className="h-4 w-4/5 rounded bg-gray-200" />
            <div className="h-3 w-11/12 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    );
  } else if (isError || !announcements || announcements.length === 0) {
    body = (
      <Link
        href="/announcements"
        className="group flex items-center gap-4 rounded-2xl border border-white/20 bg-white/80 p-5 shadow-md backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
      >
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700" aria-hidden="true">
          <Megaphone className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-gray-800">{t('home.announcements.emptyTitle')}</span>
          <span className="block text-sm text-gray-600">{t('home.announcements.emptyBody')}</span>
        </span>
        <ChevronLeft className="h-5 w-5 flex-shrink-0 text-gray-400 ltr:rotate-180" aria-hidden />
      </Link>
    );
  } else {
    body = (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {announcements.map(announcement => (
          <button
            key={announcement.id}
            type="button"
            onClick={() => setSelected(announcement)}
            aria-haspopup="dialog"
            className="block w-full cursor-pointer rounded-2xl text-start transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            <AnnouncementCard t={t} announcement={announcement} compact />
          </button>
        ))}
      </div>
    );
  }

  return (
    <section className="px-4 pt-16">
      <div className="mx-auto max-w-7xl">
        <HomeSectionHeader
          title={t('home.announcements.title')}
          action={{ label: t('home.viewAll'), href: '/announcements', ariaLabel: t('home.announcements.viewAllLabel') }}
        />
        {body}
      </div>
      <Modal open={!!selected} onClose={() => setSelected(null)} title={t('announcements.title')} size="lg">
        {selected && <AnnouncementDetails t={t} announcement={selected} />}
      </Modal>
    </section>
  );
}
