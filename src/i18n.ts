import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ca from './locales/ca.json';
import en from './locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ca: { translation: ca },
      en: { translation: en }
    },
    lng: 'ca', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  // Update Title and Meta Description for SEO
  document.title = i18n.t('seo.title');
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', i18n.t('seo.description'));
  }
});

export default i18n;
