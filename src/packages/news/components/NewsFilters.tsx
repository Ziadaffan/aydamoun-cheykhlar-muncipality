'use client';

import React from 'react';
import { NewsFiltersProps } from '../types/news.types';

const categoryLabels = {
  ALL: 'جميع الأخبار',
  MUNICIPAL_NEWS: 'أخبار بلدية',
  DEVELOPMENT_PROJECTS: 'مشاريع تنموية',
  ANNOUNCEMENTS: 'إعلانات',
  COMMUNITY_EVENTS: 'فعاليات مجتمعية',
  INFRASTRUCTURE: 'بنية تحتية',
  ENVIRONMENTAL: 'بيئي',
  SOCIAL_SERVICES: 'خدمات اجتماعية',
  OTHER: 'أخرى',
};

export default function NewsFilters({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  className = '' 
}: NewsFiltersProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => onCategoryChange('ALL')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            selectedCategory === 'ALL'
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
          }`}
        >
          {categoryLabels.ALL}
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>
    </div>
  );
}
