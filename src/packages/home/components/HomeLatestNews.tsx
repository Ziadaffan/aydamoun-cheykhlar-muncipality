'use client';

import { TFunction } from 'i18next';
import { useQuery } from '@tanstack/react-query';
import { CompactCard } from '@/packages/news/components/CompactCard';
import { News } from '@/packages/news/types/news.types';
import HomeSectionHeader from './HomeSectionHeader';

type HomeLatestNewsProps = {
  t: TFunction<'translation', undefined>;
};

// The three newest articles, like the app's home screen. `summary=1` leaves
// out every photo but the cover.
const getLatestNews = async (): Promise<News[]> => {
  const response = await fetch('/api/news?category=ALL&summary=1');
  if (!response.ok) throw new Error('Failed to fetch news');
  return response.json();
};

export default function HomeLatestNews({ t }: HomeLatestNewsProps) {
  const { data, isPending, isError } = useQuery({ queryKey: ['news', 'home-latest'], queryFn: getLatestNews });
  const items = data?.slice(0, 3);

  // Nothing to show: leave the section out rather than show an empty box.
  if (isError || items?.length === 0) return null;

  return (
    <section className="px-4 pt-16">
      <div className="mx-auto max-w-7xl">
        <HomeSectionHeader
          title={t('home.news.title')}
          action={{ label: t('home.viewAll'), href: '/news', ariaLabel: t('home.news.viewAllLabel') }}
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3" aria-busy={isPending}>
          {items
            ? items.map(news => <CompactCard key={news.id} news={news} />)
            : [0, 1, 2].map(i => (
                <div key={i} className="flex animate-pulse items-center gap-4 rounded-lg bg-white p-4 shadow-md">
                  <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 rounded bg-gray-200" />
                    <div className="h-4 w-5/6 rounded bg-gray-200" />
                    <div className="h-3 w-2/3 rounded bg-gray-200" />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
