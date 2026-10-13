'use client';

import { useTranslation } from 'react-i18next';
import LegalPage from './LegalPage';

const SECTION_KEYS = [
  'acceptance',
  'accounts',
  'acceptableUse',
  'submissions',
  'content',
  'availability',
  'liability',
  'termination',
  'law',
  'changes',
  'contact',
] as const;

export default function TermsOfUsePage() {
  const { t } = useTranslation();

  return (
    <LegalPage
      title={t('legal.terms.title')}
      lastUpdated={t('legal.terms.lastUpdated')}
      intro={t('legal.terms.intro')}
      sections={SECTION_KEYS.map(key => ({
        heading: t(`legal.terms.sections.${key}.heading`),
        body: t(`legal.terms.sections.${key}.body`, { returnObjects: true }) as unknown as string[],
      }))}
    />
  );
}
