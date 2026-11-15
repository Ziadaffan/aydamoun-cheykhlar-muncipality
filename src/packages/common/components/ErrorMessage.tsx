'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

type ErrorMessageProps = {
  message?: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center p-4">
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center shadow-lg">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="mb-4 text-2xl font-bold text-red-900">{t('common.error.title')}</h2>
        <p className="text-lg text-red-800">
          {message || t('common.error.message')}
        </p>
      </div>
    </div>
  );
}
