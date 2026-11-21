'use client';

import { BackButton } from '@/packages/common/components/BackButton';
import EditJobForm from './EditJobForm';
import { useTranslation } from 'react-i18next';

export default function EditJobPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-r from-mist to-sand py-10">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-6">
          <BackButton fallbackHref="/jobs" />
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">{t('jobs.form.editTitle')}</h1>
          </div>
        </div>
        <EditJobForm />
      </div>
    </div>
  );
}

