'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalized } from '@/lib/localized';
import Modal from '@/packages/common/components/Modal';
import StoredImage from '@/packages/common/components/StoredImage';
import type { HistoryEntryDto } from '../types';

const paragraphs = (text: string) =>
  text
    .split(/\n+/)
    .map(p => p.trim())
    .filter(Boolean);

/** One milestone: a preview card (image, title, ~4 lines) that opens the full story in a dialog. */
export default function HistoryMomentCard({ entry }: { entry: HistoryEntryDto }) {
  const { t } = useTranslation();
  const loc = useLocalized();
  const [open, setOpen] = useState(false);
  const title = loc(entry.title, entry.titleEn);
  const description = loc(entry.description, entry.descriptionEn);
  const preview = paragraphs(description).join(' ');

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={t('history.timeline.openLabel', { title })}
        className="group block w-full cursor-pointer overflow-hidden rounded-2xl border border-white/20 bg-white/90 text-start shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
      >
        {entry.imageUrl && (
          <div className="relative h-44 w-full bg-gray-100 md:h-56">
            <StoredImage src={entry.imageUrl} alt="" sizes="(max-width: 768px) 100vw, 800px" />
          </div>
        )}
        <div className="p-5">
          <h3 className="mb-2 line-clamp-2 text-xl font-bold text-gray-800">{title}</h3>
          {preview && <p className="line-clamp-4 leading-relaxed text-gray-700">{preview}</p>}
          <span className="mt-3 inline-block text-sm font-bold text-blue-600 group-hover:text-blue-800" aria-hidden="true">
            {t('history.timeline.readMore')}
          </span>
        </div>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={t('history.timeline.sheetTitle')} size="lg">
        {entry.imageUrl && (
          <div className="relative mb-5 h-56 w-full overflow-hidden rounded-xl md:h-80">
            <StoredImage src={entry.imageUrl} alt={title} sizes="(max-width: 768px) 100vw, 768px" />
          </div>
        )}
        <h3 className="mb-4 text-2xl font-bold text-gray-800">{title}</h3>
        <div className="space-y-3">
          {paragraphs(description).map((p, i) => (
            <p key={i} className="leading-relaxed text-gray-700">
              {p}
            </p>
          ))}
        </div>
      </Modal>
    </>
  );
}
