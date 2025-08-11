'use client';

import React from 'react';
import { NewsCardProps } from '../types/news.types';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

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
        locale: ar 
      });
    } catch {
      return 'منذ فترة';
    }
  };

  const renderDefaultCard = () => (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={news.imageUrl || '/assets/images/bg.jpg'}
          alt={news.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${categoryColors[news.category]}`}>
            {categoryLabels[news.category]}
          </span>
        </div>

        {/* Read Time */}
        <div className="absolute bottom-4 left-4 flex items-center text-white text-sm">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          {news.readTime} دقيقة
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3 flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          {news.author}
          <span className="mx-2">•</span>
          {formatDate(news.publishedAt)}
        </div>

        <h3 className="mb-3 text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {news.title}
        </h3>

        <p className="mb-4 text-gray-600 line-clamp-3 leading-relaxed">
          {news.excerpt}
        </p>

        {/* Tags */}
        {news.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {news.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Read More Button */}
        <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors">
          اقرأ المزيد
          <svg className="w-4 h-4 mr-1 rtl:rotate-180" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );

  const renderFeaturedCard = () => (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Image Section */}
        <div className="relative h-64 lg:h-full overflow-hidden">
          <img
            src={news.imageUrl || '/assets/images/bg.jpg'}
            alt={news.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-6 right-6">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${categoryColors[news.category]}`}>
              {categoryLabels[news.category]}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 flex flex-col justify-center">
          <div className="mb-4 flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            {news.author}
            <span className="mx-2">•</span>
            {formatDate(news.publishedAt)}
          </div>

          <h3 className="mb-4 text-2xl font-bold text-gray-900 line-clamp-3 group-hover:text-blue-600 transition-colors leading-tight">
            {news.title}
          </h3>

          <p className="mb-6 text-gray-600 line-clamp-4 leading-relaxed text-lg">
            {news.excerpt}
          </p>

          {/* Tags */}
          {news.tags.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {news.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Read More Button */}
          <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            اقرأ المزيد
            <svg className="w-5 h-5 mr-2 rtl:rotate-180" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const renderCompactCard = () => (
    <div className="group flex items-center space-x-4 p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      {/* Image */}
      <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
        <img
          src={news.imageUrl || '/assets/images/bg.jpg'}
          alt={news.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center text-xs text-gray-500 mb-1">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryColors[news.category]}`}>
            {categoryLabels[news.category]}
          </span>
          <span className="mx-2">•</span>
          {formatDate(news.publishedAt)}
        </div>
        
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {news.title}
        </h3>
        
        <p className="text-xs text-gray-600 line-clamp-1 mt-1">
          {news.excerpt}
        </p>
      </div>

      {/* Arrow */}
      <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-600 transition-colors">
        <svg className="w-5 h-5 rtl:rotate-180" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
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
