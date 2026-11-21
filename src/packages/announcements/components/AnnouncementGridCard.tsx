'use client';

import { TFunction } from 'i18next';
import { Megaphone, Pin } from 'lucide-react';
import Button from '@/packages/common/components/Button';
import Modal from '@/packages/common/components/Modal';
import StoredImage from '@/packages/common/components/StoredImage';
import { formatDate } from '@/packages/common/utils/date.utils';
import { useRelativeDate } from '@/packages/news/utils/news.utils';
import { useLocalized } from '@/lib/localized';
import type { AnnouncementDto } from '../types';

// Same shape as the news page's card; the badge carries the priority instead of the category.
const PRIORITY_STYLES = {
  NORMAL: { badge: 'bg-blue-100 text-blue-800 border-blue-200', tile: 'bg-blue-100 text-blue-700' },
  IMPORTANT: { badge: 'bg-amber-100 text-amber-800 border-amber-300', tile: 'bg-amber-100 text-amber-700' },
  URGENT: { badge: 'bg-red-100 text-red-800 border-red-300', tile: 'bg-red-100 text-red-700' },
} as const;

type AnnouncementGridCardProps = {
  t: TFunction;
  announcement: AnnouncementDto;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export default function AnnouncementGridCard({ t, announcement, open, onOpen, onClose }: AnnouncementGridCardProps) {
  const loc = useLocalized();
  const relativeDate = useRelativeDate();
  const styles = PRIORITY_STYLES[announcement.priority] ?? PRIORITY_STYLES.NORMAL;
  const title = loc(announcement.title, announcement.titleEn);
  const body = loc(announcement.body, announcement.bodyEn);
  const priorityLabel = t(`announcements.priority.${announcement.priority}`);

  const badges = (
    <>
      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${styles.badge}`}>{priorityLabel}</span>
      {announcement.pinned && (
        <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700">
          <Pin className="h-3 w-3" aria-hidden />
          {t('announcements.pinned')}
        </span>
      )}
    </>
  );

  return (
    <article
      id={announcement.id}
      className="group relative flex h-full scroll-mt-24 flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden">
        {announcement.imageUrl ? (
          <StoredImage
            src={announcement.imageUrl}
            alt={title}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center ${styles.tile}`} aria-hidden="true">
            <Megaphone className="h-16 w-16 opacity-80" />
          </div>
        )}
        <div className="absolute top-4 start-4 flex flex-wrap gap-2">{badges}</div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 text-sm text-gray-500">{relativeDate(new Date(announcement.createdAt))}</div>
        <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">{title}</h3>
        <p className="mb-4 line-clamp-3 leading-relaxed whitespace-pre-line text-gray-600">{body}</p>
        <div className="flex-1" />
        <div className="flex justify-center">
          <Button variant="primary" size="md" onClick={onOpen}>
            {t('news.page.readMore')}
          </Button>
        </div>
      </div>

      <Modal open={open} onClose={onClose} title={t('announcements.title')} size="lg">
        <div className="space-y-4">
          {announcement.imageUrl && (
            <div className="relative h-64 w-full overflow-hidden rounded-xl md:h-96">
              <StoredImage src={announcement.imageUrl} alt={title} sizes="(max-width: 768px) 100vw, 768px" className="object-contain" />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {badges}
            <span className="text-sm text-gray-500">{formatDate(announcement.createdAt)}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="leading-relaxed whitespace-pre-line text-gray-700">{body}</p>
        </div>
      </Modal>
    </article>
  );
}
