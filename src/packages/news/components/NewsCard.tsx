'use client';

import { TFunction } from 'i18next';
import { News } from '@/packages/news/types/news.types';
import { CompactCard } from '@/packages/news/components/CompactCard';
import { DefaultCard } from '@/packages/news/components/DefaultCard';
import { FeaturedCard } from '@/packages/news/components/FeaturedCard';

export interface NewsCardProps {
  news: News;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
  t: TFunction;
}

export default function NewsCard({ news, variant = 'default', className = '', t }: NewsCardProps) {
  switch (variant) {
    case 'featured':
      return <FeaturedCard news={news} t={t} />;
    case 'compact':
      return <CompactCard news={news} />;
    default:
      return <DefaultCard news={news} t={t} />;
  }
}
