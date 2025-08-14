'use client';

import { useParams } from 'next/navigation';
import { useGetNewsById } from '@/packages/news/hooks/useGetNewsById';
import { BackButton } from '@/packages/common/components/BackBotton';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import { formatDate } from '@/packages/common/utils/date.utils';
import { News } from '@/packages/news/types/news.types';
import { CldImage } from 'next-cloudinary';
import { useEffect, useState } from 'react';
import { NewHeader } from './NewHeader';
import { useTranslation } from 'react-i18next';
import { categoryColors, categoryLabels } from '../..';

export default function NewsPage() {
  const params = useParams();
  const id = params?.id as string;
  const [news, setNews] = useState<News | null>(null);
  const { data: newsData, isLoading, error } = useGetNewsById(id);
  const { t } = useTranslation();
  useEffect(() => {
    if (newsData) {
      setNews(newsData);
    }
  }, [newsData]);

  if (isLoading || !news) {
    return <Spinner className="min-h-screen" />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>
        <NewHeader t={t} />

        {/* News Content */}
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          {/* News Images */}
          {news.imageUrl && news.imageUrl.length > 0 && (
            <div className="relative h-96 overflow-hidden">
              <CldImage src={news.imageUrl[0]} alt={news.title} className="h-full w-full object-cover" fill />
            </div>
          )}

          {/* News Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="mb-4">
              <div className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${categoryColors[news.category]}`}>
                {categoryLabels[news.category]}
              </div>
            </div>
            {news.tags && news.tags.length > 0 && (
              <div className="mb-4 flex gap-2">
                {news.tags.map((tag: string, index: number) => (
                  <span key={index} className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="mb-4 text-3xl leading-tight font-bold text-gray-900">{news.title}</h1>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{news.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{formatDate(news.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* News Content */}
          <div className="p-6">
            {/* Excerpt */}
            {news.excerpt && (
              <div className="mb-6">
                <p className="border-r-4 border-blue-500 pr-4 text-lg leading-relaxed text-gray-700 italic">{news.excerpt}</p>
              </div>
            )}

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              <div className="leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: news.content }} />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>آخر تحديث: {formatDate(news.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
