'use client';

import { useTranslation } from 'react-i18next';
import LegalPage from './LegalPage';

const SECTION_KEYS = ['collect', 'use', 'share', 'retention', 'rights', 'security', 'cookies', 'children', 'changes', 'contact'] as const;

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <LegalPage
      title={t('legal.privacy.title')}
      lastUpdated={t('legal.privacy.lastUpdated')}
      intro={t('legal.privacy.intro')}
      sections={SECTION_KEYS.map(key => ({
        heading: t(`legal.privacy.sections.${key}.heading`),
        body: t(`legal.privacy.sections.${key}.body`, { returnObjects: true }) as unknown as string[],
      }))}
    />
  );
}
