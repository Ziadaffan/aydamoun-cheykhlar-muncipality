import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: "ar",
    fallbackLng: "ar",
    preload: ["ar"],
    ns: ["translation"],
    defaultNS: "translation",
    load: "languageOnly",
    partialBundledLanguages: true,
    initImmediate: false,

    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: "/language/{{lng}}.json",
      requestOptions: {
        cache: "no-store",
      },
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    // Prevent i18next from loading resources on the server
    react: {
      useSuspense: false,
      bindI18n: "languageChanged loaded",
      bindI18nStore: "added removed",
    },
  });

export default i18n;
