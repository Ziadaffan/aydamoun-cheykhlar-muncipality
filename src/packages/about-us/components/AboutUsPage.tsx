'use client';

import { useTranslation } from 'react-i18next';
import React from 'react';
import AboutUsMunicipalityInfoSection from './AboutUsMunicipalityInfoSection';
import AboutUsPresidentSection from './AboutUsPresidentSection';
import AboutUsConcilMembersSection from './AboutUsConcilMembersSection';
import { useGetCouncilMembers } from '../hooks/useGetCouncilMembers';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';

export default function AboutUsPage() {
  const { data: councilMembers, isLoading, error } = useGetCouncilMembers();

  const { t } = useTranslation();

  if (isLoading) return <Spinner />;

  if (error) return <ErrorMessage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Municipality Info Section */}
      <AboutUsMunicipalityInfoSection t={t} />

      {/* President Section */}
      <AboutUsPresidentSection t={t} />

      {/* Council Members Section */}
      {councilMembers && <AboutUsConcilMembersSection t={t} councilMembers={councilMembers} />}
    </div>
  );
}
