import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import tr from './locales/tr.json';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
};

const LANGUAGE_KEY = 'appLanguage';

const initI18n = async () => {
  let savedLang = null;
  try {
    savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
  } catch (_) {}

  await i18n.use(initReactI18next).init({
    resources,
    lng: savedLang ?? (Localization.locale?.startsWith('tr') ? 'tr' : 'en'),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v3',
  });
};

initI18n();

// SettingsScreen ve LanguageSheet tarafından çağrılır
export const changeAppLanguage = async (languageCode) => {
  try {
    await i18n.changeLanguage(languageCode);
    await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
  } catch (error) {
    console.error('Dil değiştirilemedi:', error);
  }
};

export default i18n;