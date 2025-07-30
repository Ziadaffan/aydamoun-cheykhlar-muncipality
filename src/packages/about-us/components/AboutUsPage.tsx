'use client';

import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import AboutUsMunicipalityInfoSection from './AboutUsMunicipalityInfoSection';
import AboutUsPresidentSection from './AboutUsPresidentSection';
import AboutUsConcilMembersSection from './AboutUsConcilMembersSection';
import { useGetCouncilMembers } from '../hooks/useGetCouncilMembers';
import Spinner from '@/packages/common/components/Spinner';
import ErrorMessage from '@/packages/common/components/ErrorMessage';
import { Council, Position } from '@prisma/client';

export default function AboutUsPage() {
  const [president, setPresident] = useState<Council>();
  const [councilMembers, setCouncilMembers] = useState<Council[]>([]);
  const { data, isLoading, error } = useGetCouncilMembers();

  useEffect(() => {
    if (data) {
      setPresident(data.find(member => member.position === Position.PRESIDENT));
      setCouncilMembers(data.filter(member => member.position !== Position.PRESIDENT));
    }
  }, [data]);

  const { t } = useTranslation();

  if (isLoading) return <Spinner className="min-h-screen" />;

  if (error) return <ErrorMessage />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50">
      {/* Municipality Info Section */}
      <AboutUsMunicipalityInfoSection t={t} />

      {/* President Section */}
      {president && <AboutUsPresidentSection t={t} president={president} />}

      {/* Council Members Section */}
      {councilMembers && <AboutUsConcilMembersSection t={t} councilMembers={councilMembers} />}
    </div>
  );
}
