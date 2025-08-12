'use client';

import React from 'react';
import { NewsGridProps } from '../types/news.types';
import NewsCard from './NewsCard';

export default function NewsGrid({ news, variant = 'grid', className = '' }: NewsGridProps) {
  if (variant === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {news.map(item => (
          <NewsCard key={item.id} news={item} variant="compact" />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {news.map(item => (
        <NewsCard key={item.id} news={item} variant="default" />
      ))}
    </div>
  );
}
