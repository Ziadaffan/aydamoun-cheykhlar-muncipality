import { TFunction } from 'i18next';
import HistoryTeaserCard from '@/packages/history/components/HistoryTeaserCard';

type HomeHistoryTeaserProps = {
  t: TFunction<'translation', undefined>;
};

/** "Our village's story": a photo card leading to /history, like the app's home screen. */
export default function HomeHistoryTeaser({ t }: HomeHistoryTeaserProps) {
  return (
    <section className="px-4 pt-16">
      <div className="mx-auto max-w-7xl">
        <HistoryTeaserCard title={t('home.history.title')} body={t('home.history.body')} />
      </div>
    </section>
  );
}
