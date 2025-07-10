'use client';

import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import React from 'react';
import ServiceForm from '@/packages/services/components/ServiceForm';

export default function ServiceFormPage() {
  const { t } = useTranslation();
  const params = useParams();
  const serviceId = parseInt(params?.serviceId as string);

  const categories = ['buildingLicenses', 'environmentalServices', 'administrativeTransactions', 'complaintsAndSuggestions', 'additionalServices'];

  let foundCategory = '';
  let foundService = null;

  for (const category of categories) {
    const services = t(`services.${category}.services`, { returnObjects: true }) as Array<{
      id: number;
      title: string;
      description: string;
    }>;

    const service = services.find(s => s.id === serviceId);
    if (service) {
      foundCategory = category;
      foundService = service;
      break;
    }
  }

  if (!foundService) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-green-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">الخدمة غير موجودة</h1>
          <p className="text-gray-600">عذراً، هذه الخدمة غير متوفرة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-800">{foundService.title}</h1>
            <p className="mb-4 text-lg text-gray-600">{foundService.description}</p>
            <p className="text-md text-gray-500">قم بتعبئة النموذج التالي لتقديم طلبك</p>
          </div>

          <ServiceForm category={foundCategory} serviceId={serviceId} />
        </div>
      </div>
    </div>
  );
}
