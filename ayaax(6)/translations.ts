
import { useState, useEffect } from 'react';

const translationCache: Record<string, Record<string, string>> = {};

const langMap: Record<string, string> = {
  'English': 'en',
  'Chinese': 'zh',
  'Arabic': 'ar',
  'French': 'fr',
  'Spanish': 'es',
  'German': 'de',
  'Russian': 'ru',
  'Japanese': 'ja',
  'Korean': 'ko',
  'Italian': 'it',
  'Czech': 'cs',
  'Portuguese': 'pt'
};

export const fetchTranslations = async (lang: string): Promise<Record<string, string>> => {
  if (translationCache[lang]) return translationCache[lang];
  const code = langMap[lang] || 'en';
  try {
    // Note: On Netlify, ensure the i18n folder is inside 'public'
    const response = await fetch(`/i18n/${code}.json`);
    if (!response.ok) throw new Error("File not found");
    const data = await response.json();
    translationCache[lang] = data;
    return data;
  } catch (error) {
    console.warn(`AYAAX: Falling back for ${lang}. Ensure i18n is in public/ folder.`);
    return {};
  }
};

export const getTranslationSync = (lang: string, key: string, params: Record<string, string> = {}) => {
  const dict = translationCache[lang] || {};
  let text = dict[key];
  
  if (!text) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).trim();
  }
  
  Object.entries(params).forEach(([k, v]) => {
    text = text.replace(`{${k}}`, v);
  });
  
  return text;
};

export const getTranslation = getTranslationSync;

export const isRTL = (lang: string) => ['Arabic', 'Hebrew', 'Urdu', 'Persian'].includes(lang);

export const useI18n = (lang: string) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    fetchTranslations(lang).finally(() => {
      document.documentElement.lang = langMap[lang] || 'en';
      document.body.dir = isRTL(lang) ? "rtl" : "ltr";
      setLoaded(true);
    });
  }, [lang]);

  return { t: (k: string, p?: any) => getTranslationSync(lang, k, p), isLoaded: loaded };
};
