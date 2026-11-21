'use client';

import { BackButton } from '@/packages/common/components/BackButton';
import EditNewsForm from '../edit/EditNewsForm';
import { useTranslation } from 'react-i18next';

export default function EditNewsPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-r from-mist to-sand py-10">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-6">
          <BackButton fallbackHref="/news" />
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">{t('news.page.editNews.title')}</h1>
          </div>
        </div>
        <EditNewsForm />
      </div>
    </div>
  );
}
