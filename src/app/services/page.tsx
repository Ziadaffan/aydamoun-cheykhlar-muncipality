'use client';

import { useTranslation } from 'react-i18next';
import React from 'react';
import ServicesHeroSection from '../../packages/services/components/ServicesHeroSection';
import ServicesCategorySection from '../../packages/services/components/ServicesCategorySection';
import OfficialFormsSection from '../../packages/services/components/OfficialFormsSection';

export default function ServicesPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50">
      {/* Hero Section */}
      <ServicesHeroSection t={t} />

      {/* Building Licenses Section */}
      <ServicesCategorySection t={t} categoryKey="buildingLicenses" icon="🏗️" bgColor="from-blue-400 to-blue-600" />

      {/* Environmental Services Section */}
      <ServicesCategorySection t={t} categoryKey="environmentalServices" icon="🌱" bgColor="from-green-400 to-green-600" />

      {/* Administrative Transactions Section */}
      <ServicesCategorySection t={t} categoryKey="administrativeTransactions" icon="📋" bgColor="from-purple-400 to-purple-600" />

      {/* Official Forms Section */}
      <OfficialFormsSection t={t} />

      {/* Complaints and Suggestions Section */}
      <ServicesCategorySection t={t} categoryKey="complaintsAndSuggestions" icon="📢" bgColor="from-orange-400 to-orange-600" />

      {/* Additional Services Section */}
      <ServicesCategorySection t={t} categoryKey="additionalServices" icon="⭐" bgColor="from-indigo-400 to-indigo-600" />
    </div>
  );
}
