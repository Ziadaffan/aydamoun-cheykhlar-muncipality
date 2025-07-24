'use client';

import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import ServicesHeroSection from '../../packages/services/components/ServicesHeroSection';
import ServicesCategorySection from '../../packages/services/components/ServicesCategorySection';
import { useGetServices } from '@/packages/services/hooks/useGetServices';
import { ServiceType, Service } from '@prisma/client';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import { getServiceCategoryMeta } from '@/packages/services/utils/service.utils';

export default function ServicesPage() {
  const { t } = useTranslation();
  const { data: services = [], isLoading, error } = useGetServices();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage />;

  const servicesByType = services.reduce(
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50">
      {/* Hero Section */}
      <ServicesHeroSection t={t} />

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
