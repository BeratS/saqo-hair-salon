import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import deTranslation from "@/locales/de.json";
import enTranslation from "@/locales/en.json";
import mkTranslation from "@/locales/mk.json";
import sqTranslation from "@/locales/sq.json";
import trTranslation from "@/locales/tr.json";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            de: { translation: deTranslation },
            mk: { translation: mkTranslation },
            sq: { translation: sqTranslation },
            tr: { translation: trTranslation },
        },
        lng: localStorage.getItem('language') || "en", // default language from localStorage
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
