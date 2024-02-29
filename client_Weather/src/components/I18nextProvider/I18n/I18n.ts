import i18n from "i18next";
import XHR from 'i18next-xhr-backend'
import { initReactI18next } from "react-i18next";


i18n
    .use(XHR)
    .use(initReactI18next)
    .init({
        ns: ['trans'],
        defaultNS: 'trans',
        lng: "th",
        fallbackLng: "en",

        interpolation: {
            escapeValue: false
        }
    });

export default i18n