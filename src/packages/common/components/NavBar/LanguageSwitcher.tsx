'use client';

import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/i18n';
import { siteLanguage } from '@/lib/localized';

// Each language is labelled in its own script so a visitor can find theirs whatever the current UI language.
const LABELS: Record<SupportedLanguage, string> = {
  ar: 'العربية',
  en: 'English',
};

type LanguageSwitcherProps = {
  isMobile?: boolean;
  onChange?: () => void;
};

/** Arabic / English toggle; i18next persists the choice in localStorage and src/i18n.ts updates <html lang dir>. */
export default function LanguageSwitcher({ isMobile = false, onChange }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation();
  const current = siteLanguage(i18n.language);

  const select = async (language: SupportedLanguage) => {
    if (language !== current) await i18n.changeLanguage(language);
    onChange?.();
  };

  return (
    <div
      role="group"
      aria-label={t('navigation.main.language')}
      className={`inline-flex shrink-0 overflow-hidden rounded-full border border-blue-800/30 bg-white/60 ${isMobile ? 'self-start' : ''}`}
    >
      {SUPPORTED_LANGUAGES.map(language => (
        <button
          key={language}
          type="button"
          lang={language}
          aria-pressed={language === current}
          onClick={() => select(language)}
          className={`cursor-pointer px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
            language === current ? 'bg-blue-800 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-800'
          }`}
        >
          {LABELS[language]}
        </button>
      ))}
    </div>
  );
}
