import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      home: 'Home',
      jobs: 'Jobs',
      messages: 'Messages',
      profile: 'Profile',
      login: 'Login',
      register: 'Register',
      comingSoon: 'Coming Soon',
    }
  },
  ar: {
    translation: {
      home: 'الرئيسية',
      jobs: 'الوظائف',
      messages: 'الرسائل',
      profile: 'الملف الشخصي',
      login: 'تسجيل الدخول',
      register: 'التسجيل',
      comingSoon: 'قريباً',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
