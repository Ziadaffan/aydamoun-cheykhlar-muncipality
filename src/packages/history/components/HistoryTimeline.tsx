'use client';

import { TFunction } from 'i18next';
import { useLocalized } from '@/lib/localized';
import StoredImage from '@/packages/common/components/StoredImage';
import { useGetHistory } from '../hooks/useGetHistory';

type HistoryTimelineProps = {
  t: TFunction;
};

/** The village history (admin-managed), as a vertical timeline. Hidden while empty. */
export default function HistoryTimeline({ t }: HistoryTimelineProps) {
  const { data: entries, isError } = useGetHistory();
  const loc = useLocalized();

  if (isError || !entries || entries.length === 0) return null;

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-4xl">
        <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-400 to-green-400 opacity-10 blur-sm"></div>
        <div className="relative rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm md:p-10">
          <h3 className="mb-8 text-3xl font-bold text-blue-600">{t('aboutUs.history.title')}</h3>

          <ol className="relative border-s-2 border-blue-200">
            {entries.map(entry => (
              <li key={entry.id} className="ms-6 mb-10 last:mb-0">
                <span className="absolute -start-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-white bg-gradient-to-r from-blue-500 to-green-500 shadow"></span>
                <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-0.5 text-sm font-bold text-blue-800">{loc(entry.period, entry.periodEn)}</span>
                <h4 className="mb-2 text-xl font-bold text-gray-800">{loc(entry.title, entry.titleEn)}</h4>
                {entry.imageUrl && (
                  <div className="relative mb-3 h-48 w-full overflow-hidden rounded-xl md:h-64">
                    <StoredImage src={entry.imageUrl} alt={loc(entry.title, entry.titleEn)} sizes="(max-width: 768px) 100vw, 800px" />
                  </div>
                )}
                <p className="leading-relaxed whitespace-pre-line text-gray-700">{loc(entry.description, entry.descriptionEn)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
