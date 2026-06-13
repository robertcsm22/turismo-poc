import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import esCommon from '../locales/es/common.json'
import esNavbar from '../locales/es/navbar.json'
import esPlaces from '../locales/es/places.json'
import esAdmin from '../locales/es/admin.json'
import esLogin from '../locales/es/login.json'
import esDestinations from '../locales/es/destinations.json'
import esQr from '../locales/es/qr.json'
import esChatbot from '../locales/es/chatbot.json'
import esError from '../locales/es/error.json'
import esTransition from '../locales/es/transition.json'

import enCommon from '../locales/en/common.json'
import enNavbar from '../locales/en/navbar.json'
import enPlaces from '../locales/en/places.json'
import enAdmin from '../locales/en/admin.json'
import enLogin from '../locales/en/login.json'
import enDestinations from '../locales/en/destinations.json'
import enQr from '../locales/en/qr.json'
import enChatbot from '../locales/en/chatbot.json'
import enError from '../locales/en/error.json'
import enTransition from '../locales/en/transition.json'

export const NAMESPACES = [
  'common', 'navbar', 'places', 'admin', 'login',
  'destinations', 'qr', 'chatbot', 'error', 'transition',
]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    supportedLngs: ['es', 'en'],
    defaultNS: 'common',
    ns: NAMESPACES,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
    resources: {
      es: {
        common: esCommon,
        navbar: esNavbar,
        places: esPlaces,
        admin: esAdmin,
        login: esLogin,
        destinations: esDestinations,
        qr: esQr,
        chatbot: esChatbot,
        error: esError,
        transition: esTransition,
      },
      en: {
        common: enCommon,
        navbar: enNavbar,
        places: enPlaces,
        admin: enAdmin,
        login: enLogin,
        destinations: enDestinations,
        qr: enQr,
        chatbot: enChatbot,
        error: enError,
        transition: enTransition,
      },
    },
  })

export default i18n
