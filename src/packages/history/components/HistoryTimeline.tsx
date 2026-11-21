'use client';

import { useTranslation } from 'react-i18next';
import { Hourglass } from 'lucide-react';
import { useGetHistory } from '../hooks/useGetHistory';
import HistoryMomentCard from './HistoryMomentCard';
import EmptyState from '@/packages/common/components/EmptyState';

const Rail = ({ children }: { children: React.ReactNode }) => <ol className="relative border-s-2 border-blue-200">{children}</ol>;
const Dot = () => (
  <span
    className="absolute -start-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-white bg-gradient-to-r from-blue-500 to-sky-500 shadow"
    aria-hidden="true"
  />
);

/** "Moments from our history": the admin-managed milestones (GET /api/history), oldest first. */
export default function HistoryTimeline() {
  const { t } = useTranslation();
  const { data: entries, isPending, isError } = useGetHistory();

  let body: React.ReactNode;
  if (isPending) {
    body = (
      <div role="status" aria-label={t('common.loading')}>
        <Rail>
          {[0, 1].map(i => (
            <li key={i} className="ms-6 mb-10 animate-pulse last:mb-0">
              <span className="absolute -start-[9px] mt-1.5 h-4 w-4 rounded-full bg-gray-200" aria-hidden="true" />
              <div className="space-y-3 rounded-2xl bg-white/90 p-5 shadow-lg">
                <div className="h-5 w-3/5 rounded bg-gray-200" />
                <div className="h-3 w-11/12 rounded bg-gray-200" />
                <div className="h-3 w-4/5 rounded bg-gray-200" />
              </div>
            </li>
          ))}
        </Rail>
      </div>
    );
  } else if (isError || !entries || entries.length === 0) {
    // A failed load reads the same as "not written yet": nothing here is actionable for a visitor.
    body = (
      <EmptyState icon={Hourglass} title={t('history.timeline.empty.title')} description={t('history.timeline.empty.body')} />
    );
  } else {
    body = (
      <Rail>
        {entries.map(entry => (
          <li key={entry.id} className="ms-6 mb-10 last:mb-0">
            <Dot />
            <HistoryMomentCard entry={entry} />
          </li>
        ))}
      </Rail>
    );
  }

  return (
    <section aria-labelledby="history-timeline-title">
      <h2 id="history-timeline-title" className="mb-2 text-3xl font-bold text-gray-800">
        {t('history.timeline.title')}
      </h2>
      <p className="mb-8 text-gray-600">{t('history.timeline.lead')}</p>
      {body}
    </section>
  );
}
