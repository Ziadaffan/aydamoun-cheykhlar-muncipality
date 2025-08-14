'use client';

import React from 'react';
import { News } from '../types/news.types';
import NewsCard from './NewsCard';
import { TFunction } from 'i18next';

interface NewsHeroProps {
  featuredNews: News;
  className?: string;
  t: TFunction;
}

export default function NewsHero({ featuredNews, className = '', t }: NewsHeroProps) {
  return (
    <section className={`mb-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">{t('news.page.latestNews')}</h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">{t('news.page.latestNewsDescription')}</p>
        </div>

        {/* Featured News */}
        <div className="mb-8">
          <h2 className="mb-6 text-right text-2xl font-bold text-gray-800">{t('news.page.featuredNews')}</h2>
          <NewsCard news={featuredNews} variant="featured" t={t} />
        </div>
      </div>
    </section>
  );
}
