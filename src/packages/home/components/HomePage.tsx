'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/packages/common/hooks/useAuth';
import HomeHeaderSection from './HomeHeaderSection';
import HomeLatestRequest from './HomeLatestRequest';
import HomeLatestNews from './HomeLatestNews';
import HomeServicesSection from './HomeServicesSection';
import HomeQuickLinks from './HomeQuickLinks';
import HomeContactSection from './HomeContactSection';

// Same sections, in the same order, as the app's home screen.
export default function HomePage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-green-50">
      <HomeHeaderSection t={t} />

      {isAuthenticated && <HomeLatestRequest t={t} />}

      <HomeLatestNews t={t} />

      <HomeServicesSection t={t} />

      <HomeQuickLinks t={t} />

      <HomeContactSection t={t} />
    </div>
  );
}
