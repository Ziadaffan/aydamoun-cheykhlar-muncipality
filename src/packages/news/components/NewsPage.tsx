'use client';

import React, { useEffect, useState } from 'react';
import NewsHero from '@/packages/news/components/NewsHero';
import NewsFilters from '@/packages/news/components/NewsFilters';
import NewsGrid from '@/packages/news/components/NewsGrid';
import { News, NewsCategory } from '@/packages/news/types/news.types';
import Button from '@/packages/common/components/Button';
import { useGetFeaturedNews } from '@/packages/news/hooks/useGetFeaturedNews';
import { useGetNewsCategories } from '@/packages/news/hooks/useGetNewsCategories';
import { useGetNewsByCategory } from '@/packages/news/hooks/useGerNewsByCategory';
import Spinner from '@/packages/common/components/Spinner';
import NoNews from '@/packages/news/components/NoNews';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/packages/common/hooks/useAuth';

export default function NewsPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { role } = useAuth();

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
      <NewsHero featuredNews={featuredNews} t={t} role={role} />

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        {/* View Mode Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedCategory === 'ALL' ? t('news.page.allNews') : t('news.page.newsInCategory', { category: selectedCategory })}
          </h2>

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
            {selectedCategory === 'ALL'
              ? t('news.page.newsCount', { count: filteredNews.length })
              : t('news.page.newsCountInCategory', { count: filteredNews.length, category: selectedCategory })}
          </p>
        </div>

        {/* News Grid */}
        {filteredNews.length > 0 ? <NewsGrid news={filteredNews} variant={viewMode} t={t} /> : <NoNews t={t} />}
      </div>
    </div>
  );
}
