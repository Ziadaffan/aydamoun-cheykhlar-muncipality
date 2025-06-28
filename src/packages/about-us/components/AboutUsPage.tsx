'use client';

import { useTranslation } from 'react-i18next';
import React from 'react';
import AboutUsMunicipalityInfoSection from './AboutUsMunicipalityInfoSection';
import AboutUsPresidentSection from './AboutUsPresidentSection';
import AboutUsConcilMembersSection from './AboutUsConcilMembersSection';

export type CouncilMember = {
  id: number;
  name: string;
  position: string;
  image: string;
};

export default function AboutUsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Municipality Info Section */}
      <AboutUsMunicipalityInfoSection t={t} />

      {/* President Section */}
      <AboutUsPresidentSection t={t} />

      {/* Council Members Section */}
      <AboutUsConcilMembersSection t={t} />
    </div>
  );
}
