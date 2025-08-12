'use client';

import React from 'react';
import Image from 'next/image';
import { NewsCardProps, News } from '../types/news.types';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CldImage } from 'next-cloudinary';

const categoryColors = {
  MUNICIPAL_NEWS: 'bg-blue-100 text-blue-800 border-blue-200',
  DEVELOPMENT_PROJECTS: 'bg-green-100 text-green-800 border-green-200',
  ANNOUNCEMENTS: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  COMMUNITY_EVENTS: 'bg-purple-100 text-purple-800 border-purple-200',
  INFRASTRUCTURE: 'bg-orange-100 text-orange-800 border-orange-200',
  ENVIRONMENTAL: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  SOCIAL_SERVICES: 'bg-pink-100 text-pink-800 border-pink-200',
  OTHER: 'bg-gray-100 text-gray-800 border-gray-200',
};

const categoryLabels = {
  MUNICIPAL_NEWS: 'أخبار بلدية',
  DEVELOPMENT_PROJECTS: 'مشاريع تنموية',
  ANNOUNCEMENTS: 'إعلانات',
  COMMUNITY_EVENTS: 'فعاليات مجتمعية',
  INFRASTRUCTURE: 'بنية تحتية',
  ENVIRONMENTAL: 'بيئي',
  SOCIAL_SERVICES: 'خدمات اجتماعية',
  OTHER: 'أخرى',
};

export default function NewsCard({ news, variant = 'default', className = '' }: NewsCardProps) {
  const formatDate = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: ar,
      });
    } catch {
      return 'منذ فترة';
    }
  };

  const renderDefaultCard = () => (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <CldImage
          src={news.imageUrl?.[0] || 'bg-2_n5hq3e'}
          alt={news.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${categoryColors[news.category]}`}>
            {categoryLabels[news.category]}
          </span>
        </div>

        {/* Read Time */}
        <div className="absolute bottom-4 left-4 flex items-center text-sm text-white">
          <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          {news.readTime} دقيقة
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3 flex items-center text-sm text-gray-500">
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          {news.author}
          <span className="mx-2">•</span>
          {formatDate(news.publishedAt)}
        </div>

        <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">{news.title}</h3>

        <p className="mb-4 line-clamp-3 leading-relaxed text-gray-600">{news.content}</p>

        {/* Tags */}
        {news.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {news.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Read More Button */}
        <button className="inline-flex items-center font-medium text-blue-600 transition-colors hover:text-blue-700">
          اقرأ المزيد
          <svg className="mr-1 h-4 w-4 rtl:rotate-180" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  const renderFeaturedCard = () => (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden lg:h-full">
          <CldImage
            src={news.imageUrl?.[0] || 'photo1_floiyq'}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-6 right-6">
            <span className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium ${categoryColors[news.category]}`}>
              {categoryLabels[news.category]}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-center p-8">
          <div className="mb-4 flex items-center text-sm text-gray-500">
            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            {news.author}
            <span className="mx-2">•</span>
            {formatDate(news.publishedAt)}
          </div>

          <h3 className="mb-4 line-clamp-3 text-2xl leading-tight font-bold text-gray-900 transition-colors group-hover:text-blue-600">
            {news.title}
          </h3>

          <p className="mb-6 line-clamp-4 text-lg leading-relaxed text-gray-600">{news.content}</p>

          {/* Tags */}
          {news.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {news.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Read More Button */}
          <button className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">
            اقرأ المزيد
            <svg className="mr-2 h-5 w-5 rtl:rotate-180" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const renderCompactCard = () => (
    <div className="group flex items-center space-x-4 rounded-lg bg-white p-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
        <CldImage src={news.imageUrl?.[0] || 'photo1_floiyq'} alt={news.title} fill className="object-cover" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center text-xs text-gray-500">
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${categoryColors[news.category]}`}>
            {categoryLabels[news.category]}
          </span>
          <span className="mx-2">•</span>
          {formatDate(news.publishedAt)}
        </div>

        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600">{news.title}</h3>

        <p className="mt-1 line-clamp-1 text-xs text-gray-600">{news.content}</p>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 text-gray-400 transition-colors group-hover:text-blue-600">
        <svg className="h-5 w-5 rtl:rotate-180" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );

  switch (variant) {
    case 'featured':
      return renderFeaturedCard();
    case 'compact':
      return renderCompactCard();
    default:
      return renderDefaultCard();
  }
}
