'use client';

import { useTranslation } from 'react-i18next';
import HomeHeaderSection from './HomeHeaderSection';
import HomeServicesSection from './HomeServicesSection';
import HomeContactSection from './HomeContactSection';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50">
      <HomeHeaderSection t={t} />

      <HomeServicesSection t={t} />

      <HomeContactSection t={t} />
    </div>
  );
}
