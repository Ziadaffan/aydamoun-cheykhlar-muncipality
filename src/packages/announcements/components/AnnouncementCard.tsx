'use client';

import { TFunction } from 'i18next';
import { Pin } from 'lucide-react';
import StoredImage from '@/packages/common/components/StoredImage';
import { formatDate } from '@/packages/common/utils/date.utils';
import { useLocalized } from '@/lib/localized';
import type { AnnouncementDto } from '../types';

const PRIORITY_STYLES = {
  NORMAL: { badge: 'bg-blue-100 text-blue-800', border: 'border-blue-200' },
  IMPORTANT: { badge: 'bg-amber-100 text-amber-800', border: 'border-amber-300' },
  URGENT: { badge: 'bg-red-100 text-red-800', border: 'border-red-300' },
} as const;

type AnnouncementCardProps = {
  t: TFunction;
  announcement: AnnouncementDto;
  /** Home: a few lines with a link to the full list; list page: the whole text. */
  compact?: boolean;
};

export default function AnnouncementCard({ t, announcement, compact = false }: AnnouncementCardProps) {
  const styles = PRIORITY_STYLES[announcement.priority] ?? PRIORITY_STYLES.NORMAL;
  const loc = useLocalized();
  const title = loc(announcement.title, announcement.titleEn);

  return (
    <article id={announcement.id} className={`scroll-mt-24 overflow-hidden rounded-2xl border-2 bg-white shadow-md ${styles.border}`}>
      {announcement.imageUrl && !compact && (
        <div className="relative h-56 w-full md:h-72">
          <StoredImage src={announcement.imageUrl} alt={title} />
        </div>
      )}
      <div className="p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-full px-3 py-0.5 font-semibold ${styles.badge}`}>{t(`announcements.priority.${announcement.priority}`)}</span>
          {announcement.pinned && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-0.5 font-semibold text-gray-700">
              <Pin className="h-3 w-3" aria-hidden />
              {t('announcements.pinned')}
            </span>
          )}
          <span className="text-gray-500">{formatDate(announcement.createdAt)}</span>
        </div>
        <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
        <p className={`leading-relaxed whitespace-pre-line text-gray-700 ${compact ? 'line-clamp-3' : ''}`}>{loc(announcement.body, announcement.bodyEn)}</p>
      </div>
    </article>
  );
}
