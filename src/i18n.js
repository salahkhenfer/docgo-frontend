import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import arTranslation from "./locales/ar/translation.json";
import enTranslation from "./locales/en/translation.json";
import frTranslation from "./locales/fr/translation.json";

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            ar: { translation: arTranslation, dir: "rtl" },
            en: { translation: enTranslation, dir: "ltr" },
            fr: { translation: frTranslation, dir: "ltr" },
        },
        supportedLngs: ["en", "fr", "ar"],
        fallbackLng: ["en", "fr"],
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
