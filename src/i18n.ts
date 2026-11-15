import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

export const SUPPORTED_LANGUAGES = ['ar', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'ar';
/** localStorage key the LanguageDetector caches the chosen language in (also read by the inline script in app/layout.tsx). */
export const LANGUAGE_STORAGE_KEY = 'i18nextLng';

export function languageDirection(language: string | undefined): 'rtl' | 'ltr' {
  return language?.startsWith('en') ? 'ltr' : 'rtl';
}

/** Keeps <html lang dir> in sync with the active language (the server always renders ar/rtl). */
function applyDocumentLanguage(language: string | undefined) {
  if (typeof document === 'undefined') return;
  const lang = language?.startsWith('en') ? 'en' : 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = languageDirection(lang);
}

i18n.on('languageChanged', applyDocumentLanguage);

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // No `lng`: the detector picks the visitor's saved choice; Arabic otherwise.
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: [...SUPPORTED_LANGUAGES],
    nonExplicitSupportedLngs: true,
    preload: [DEFAULT_LANGUAGE],
    ns: ['translation'],
    defaultNS: 'translation',
    load: 'languageOnly',
    partialBundledLanguages: true,
    initImmediate: false,

    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: '/language/{{lng}}.json',
      requestOptions: {
        cache: 'no-store',
      },
    },

    detection: {
      // Only an explicit choice switches to English; the browser language is ignored so Arabic stays the default.
      order: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    },

    // Prevent i18next from loading resources on the server
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
    },
  });

applyDocumentLanguage(i18n.language);

export default i18n;
