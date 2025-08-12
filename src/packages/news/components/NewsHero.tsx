'use client';

import React from 'react';
import { News } from '../types/news.types';
import NewsCard from './NewsCard';

interface NewsHeroProps {
  featuredNews: News;
  className?: string;
}

export default function NewsHero({ featuredNews, className = '' }: NewsHeroProps) {
  return (
    <section className={`mb-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">آخر الأخبار والتحديثات</h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            تابع آخر الأخبار والتطورات في بلدية عيدمون شيخلار، ومشاريعنا التنموية، والفعاليات المجتمعية
          </p>
        </div>

        {/* Featured News */}
        <div className="mb-8">
          <h2 className="mb-6 text-right text-2xl font-bold text-gray-800">الخبر المميز</h2>
          <NewsCard news={featuredNews} variant="featured" />
        </div>
      </div>
    </section>
  );
}
