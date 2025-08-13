'use client';

import React, { useEffect, useState } from 'react';
import { NewsHero, NewsFilters, NewsGrid } from './index';
import { News, NewsCategory } from '../types/news.types';
import Button from '@/packages/common/components/Button';
import { useGetFeaturedNews } from '../hooks/useGetFeaturedNews';
import { useGetNewsCategories } from '../hooks/useGetNewsCategories';
import { useGetNewsByCategory } from '../hooks/useGerNewsByCategory';
import Spinner from '@/packages/common/components/Spinner';

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [featuredNews, setFeaturedNews] = useState<News | null>(null);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);

  const { data: featuredNewsData } = useGetFeaturedNews();
  const { data: categoriesData } = useGetNewsCategories();
  const { data: filteredNewsData } = useGetNewsByCategory(selectedCategory);

  useEffect(() => {
    if (featuredNewsData) {
      setFeaturedNews(featuredNewsData);
    }
    if (categoriesData) {
      setCategories(categoriesData);
    }
    if (filteredNewsData) {
      setFilteredNews(filteredNewsData);
    }
  }, [featuredNewsData, categoriesData, filteredNewsData]);

  const handleCategoryChange = (category: NewsCategory | 'ALL') => {
    setSelectedCategory(category);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  if (!featuredNews || !categories || !filteredNews) {
    return <Spinner className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 py-20">
      {/* Hero Section */}
      <NewsHero featuredNews={featuredNews} />

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        {/* View Mode Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{selectedCategory === 'ALL' ? 'جميع الأخبار' : `أخبار ${selectedCategory}`}</h2>

          <div className="flex items-center space-x-2">
            <Button
              className={`rounded-lg p-2 transition-colors ${
                viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-400 text-gray-600 hover:bg-gray-300'
              }`}
              variant="primary"
              size="sm"
              onClick={() => handleViewModeChange('grid')}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </Button>

            <Button
              className={`rounded-lg p-2 transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-400 text-gray-600 hover:bg-gray-300'
              }`}
              variant="primary"
              size="sm"
              onClick={() => handleViewModeChange('list')}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <NewsFilters categories={categories} selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

        {/* News Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            تم العثور على <span className="font-semibold text-blue-600">{filteredNews.length}</span> خبر
            {selectedCategory !== 'ALL' && ` في فئة ${selectedCategory}`}
          </p>
        </div>

        {/* News Grid */}
        {filteredNews.length > 0 ? (
          <NewsGrid news={filteredNews} variant={viewMode} />
        ) : (
          <div className="py-12 text-center">
            <div className="mb-4 text-gray-400">
              <svg className="mx-auto h-16 w-16" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">لا توجد أخبار</h3>
            <p className="text-gray-500">لم يتم العثور على أخبار في هذه الفئة حالياً</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredNews.length > 0 && (
          <div className="mt-12 text-center">
            <button className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700">
              تحميل المزيد من الأخبار
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
