'use client';

import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import ServicesHeroSection from '../../packages/services/components/ServicesHeroSection';
import ServicesCategorySection from '../../packages/services/components/ServicesCategorySection';
import { useGetServices } from '@/packages/services/hooks/useGetServices';
import { ServiceType, Service } from '@prisma/client';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import { getServiceCategoryMeta, serviceMatchesSearch } from '@/packages/services/utils/service.utils';
import { useAuth } from '@/packages/common/hooks/useAuth';
import AuthBanner from '@/packages/common/components/AuthBanner';

export default function ServicesPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { data: services = [], isLoading, error } = useGetServices();
  const [search, setSearch] = useState('');

  // Name/description in Arabic or English, or the category's name.
  const visibleServices = (services as Service[]).filter(service => serviceMatchesSearch(service, search));

  const servicesByType = visibleServices.reduce(
    (acc: Record<ServiceType, Service[]>, service: Service) => {
      if (!acc[service.type]) acc[service.type] = [];
      acc[service.type].push(service);
      return acc;
    },
    {} as Record<ServiceType, Service[]>
  );

  const serviceTypes: ServiceType[] = [
    'LICENSEES_AND_CONSTRUCTION_SERVICES',
    'ENVIRONMENTAL_SERVICES',
    'ADMINISTRATIVE_SERVICES',
    'DOWNLOAD_OFFICIAL_FORMS_SERVICES',
    'COMPLAINTS_AND_SUGGESTIONS_SERVICES',
    'OTHER',
  ];

  if (isLoading) return <Spinner className="min-h-screen" />;
  if (error) return <ErrorMessage />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50">
      {!isAuthenticated && (
        <AuthBanner />
      )}

      {/* Hero Section */}
      <ServicesHeroSection t={t} />

      <div className="container mx-auto px-6 pt-8">
        <div className="mx-auto max-w-xl">
          <label htmlFor="servicesSearch" className="sr-only">
            {t('services.search.label')}
          </label>
          <input
            id="servicesSearch"
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder={t('services.search.placeholder')}
            className="w-full rounded-full border border-gray-300 bg-white px-5 py-3 text-base shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {search.trim() && visibleServices.length === 0 && (
        <p className="container mx-auto px-6 py-12 text-center text-lg text-gray-600">{t('services.search.empty')}</p>
      )}

      {/* Render each category section dynamically */}
      {serviceTypes.map(type => {
        const meta = getServiceCategoryMeta(type);
        const sectionServices = servicesByType[type] || [];
        if (sectionServices.length === 0) return null;
        return (
          <ServicesCategorySection
            key={type}
            t={t}
            categoryKey={meta.categoryKey}
            icon={meta.icon}
            bgColor={meta.bgColor}
            services={sectionServices}
          />
        );
      })}
    </div>
  );
}
