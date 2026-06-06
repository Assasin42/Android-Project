import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import tr from '../locales/tr.json';
import en from '../locales/en.json';

const LANGUAGE_KEY = 'APP_LANGUAGE';

// Kaydedilmiş dili yükle, yoksa 'tr' kullan
const getStoredLanguage = async () => {
  try {
    const lang = await AsyncStorage.getItem(LANGUAGE_KEY);
    return lang || 'tr';
  } catch {
    return 'tr';
  }
};

export const saveLanguage = async (lang) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (e) {
    console.log('Dil kaydedilemedi:', e);
  }
};

export const changeAppLanguage = async (lang) => {
  await i18n.changeLanguage(lang);
  await saveLanguage(lang);
};

const initI18n = async () => {
  const storedLang = await getStoredLanguage();

  await i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      resources: {
        tr: { translation: tr },
        en: { translation: en },
      },
      lng: storedLang,
      fallbackLng: 'tr',
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18n();

export default i18n;