'use client';

import React from 'react';
import { News } from '../types/news.types';
import NewsCard from './NewsCard';
import { TFunction } from 'i18next';

export interface NewsGridProps {
  news: News[];
  variant?: 'grid' | 'list';
  className?: string;
  t: TFunction;
}

export default function NewsGrid({ news, variant = 'grid', className = '', t }: NewsGridProps) {
  if (variant === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {news.map(item => (
          <NewsCard key={item.id} news={item} variant="compact" t={t} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {news.map(item => (
        <NewsCard key={item.id} news={item} variant="default" t={t} />
      ))}
    </div>
  );
}
