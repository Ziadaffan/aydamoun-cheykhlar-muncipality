'use client';

import { useTranslation } from 'react-i18next';

export type SiteLanguage = 'ar' | 'en';

/** The site's active language: Arabic unless the visitor chose English. */
export function siteLanguage(language: string | undefined): SiteLanguage {
  return language?.startsWith('en') ? 'en' : 'ar';
}

/**
 * Admin-written content has an Arabic value and an optional English one.
 * English is shown on the English site when it exists; Arabic otherwise.
 */
export function pickLocalized(language: string | undefined, ar: string, en?: string | null): string {
  return siteLanguage(language) === 'en' && en?.trim() ? en : ar;
}

/**
 *   const loc = useLocalized();
 *   loc(news.title, news.titleEn)
 */
export function useLocalized() {
  const { i18n } = useTranslation();
  const language = i18n.language;
  return (ar: string, en?: string | null) => pickLocalized(language, ar, en);
}
