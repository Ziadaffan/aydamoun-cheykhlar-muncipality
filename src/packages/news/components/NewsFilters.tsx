'use client';

import React from 'react';
import { NewsFiltersProps } from '@/packages/news/types/news.types';
import { categoryLabels } from '@/packages/news/utils/news.utils';

export default function NewsFilters({ categories, selectedCategory, onCategoryChange, className = '' }: NewsFiltersProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => onCategoryChange('ALL')}
          className={`rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
            selectedCategory === 'ALL' ? 'scale-105 bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:scale-105 hover:bg-gray-200'
          }`}
        >
          {categoryLabels.ALL}
        </button>

        {categories.map(category => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'scale-105 bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:scale-105 hover:bg-gray-200'
            }`}
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>
    </div>
  );
}
