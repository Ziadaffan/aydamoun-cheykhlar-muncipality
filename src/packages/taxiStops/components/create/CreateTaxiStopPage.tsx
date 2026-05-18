'use client';

import { BackButton } from '@/packages/common/components/BackButton';
import CreateTaxiStopForm from './CreateTaxiStopForm';

export default function CreateTaxiStopPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50 py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mb-6">
          <BackButton />
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-5xl">إنشاء موقف تاكسي جديد</h1>
          </div>
        </div>

        <CreateTaxiStopForm />
      </div>
    </div>
  );
}
