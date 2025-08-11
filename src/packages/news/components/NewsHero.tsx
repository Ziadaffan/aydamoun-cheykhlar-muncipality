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
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            آخر الأخبار والتحديثات
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            تابع آخر الأخبار والتطورات في بلدية عيدمون شيخلار، ومشاريعنا التنموية، والفعاليات المجتمعية
          </p>
        </div>
        
        {/* Featured News */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right">
            الخبر المميز
          </h2>
          <NewsCard news={featuredNews} variant="featured" />
        </div>
      </div>
    </section>
  );
}
