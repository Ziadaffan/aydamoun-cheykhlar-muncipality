import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// Prevent i18next from loading resources on the server
const isBrowser = typeof window !== "undefined";

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
    resources: {
      ar: {
        translation: require("../public/language/ar.json")
      }
    },

    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: "/language/{{lng}}.json",
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    // Prevent i18next from loading resources on the server
    react: {
      useSuspense: false,
    },
  });

export default i18n;
