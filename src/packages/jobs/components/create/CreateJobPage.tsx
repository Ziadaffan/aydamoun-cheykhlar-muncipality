'use client';

import { BackButton } from '@/packages/common/components/BackBotton';
import CreateJobForm from './CreateJobForm';
import { useTranslation } from 'react-i18next';

export default function CreateJobPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 py-10">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-6">
          <BackButton />
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">إنشاء وظيفة جديدة</h1>
          </div>
        </div>
        <CreateJobForm />
      </div>
    </div>
  );
}

