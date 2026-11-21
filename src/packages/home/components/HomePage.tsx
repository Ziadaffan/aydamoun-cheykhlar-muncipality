'use client';

import { useTranslation } from 'react-i18next';
import HomeHeaderSection from './HomeHeaderSection';
import HomeAnnouncements from './HomeAnnouncements';
import HomeHistoryTeaser from './HomeHistoryTeaser';
import HomeLatestNews from './HomeLatestNews';
import HomeQuickLinks from './HomeQuickLinks';
import HomeContactSection from './HomeContactSection';

// Same sections, in the same order, as the app's home screen.
export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-r from-mist to-sand">
      <HomeHeaderSection t={t} />

      <HomeAnnouncements t={t} />

      <HomeHistoryTeaser t={t} />

      <HomeLatestNews t={t} />

      <HomeQuickLinks t={t} />

      <HomeContactSection t={t} />
    </div>
  );
}
