/**
 * RARE 4N - Neural Translation Service
 * Neural Machine Translation and UI Localization System
 * Integrated with Google Translation API via Backend
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { RAREKernel } from '../core/RAREKernel';
import { API_URL } from './config';

export interface Translation {
  key: string;
  [language: string]: string;
}

class TranslationService {
  private translations: Map<string, Translation> = new Map();
  private currentLanguage: string = 'ar';
  private kernel: RAREKernel;
  private translationCache: Map<string, string> = new Map();

  constructor() {
    this.kernel = RAREKernel.getInstance();
    this.initService();
  }

  private async initService() {
    await this.loadLanguage();
    await this.loadInitialTranslations();
  }

  async loadLanguage(): Promise<void> {
    try {
      const lang = await AsyncStorage.getItem('language') || 'ar';
      this.currentLanguage = lang;
      
      this.kernel.emit({
        type: 'language:changed',
        data: { language: lang },
        source: 'translation-service',
      });
    } catch (error) {
      console.error('Error loading language:', error);
    }
  }

  async changeLanguage(language: string): Promise<void> {
    try {
      this.currentLanguage = language;
      await AsyncStorage.setItem('language', language);
      
      // Clear cache when language changes
      this.translationCache.clear();
      
      this.kernel.emit({
        type: 'user:input',
        data: {
          text: `change language to ${language}`,
          type: 'settings',
          language,
          action: 'update_translation_system',
        },
        source: 'ui',
      });
      
      this.kernel.emit({
        type: 'language:changed',
        data: { language },
        source: 'translation-service',
      });
    } catch (error) {
      console.error('Error changing language:', error);
    }
  }

  /**
   * Translate text using Google Translation API via Backend
   */
  async translateText(text: string, targetLanguage?: string, sourceLanguage?: string): Promise<string> {
    if (!text || text.trim().length === 0) {
      return text;
    }

    const target = targetLanguage || this.currentLanguage;
    
    // Check cache first
    const cacheKey = `${text}:${target}`;
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey)!;
    }

    // If already in target language, return as is
    if (target === 'ar' && /[\u0600-\u06FF]/.test(text)) {
      return text;
    }
    if (target === 'en' && /^[a-zA-Z\s]+$/.test(text)) {
      return text;
    }

    try {
      const response = await fetch(`${API_URL}/api/translation/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage: target,
          sourceLanguage: sourceLanguage || 'auto',
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.translatedText || text;

      // Cache the translation
      this.translationCache.set(cacheKey, translatedText);

      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback to local translation or original text
      return this.t(text) || text;
    }
  }

  /**
   * Translate multiple texts in batch
   */
  async translateBatch(texts: string[], targetLanguage?: string, sourceLanguage?: string): Promise<string[]> {
    const target = targetLanguage || this.currentLanguage;

    try {
      const response = await fetch(`${API_URL}/api/translation/translate-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts,
          targetLanguage: target,
          sourceLanguage: sourceLanguage || 'auto',
        }),
      });

      if (!response.ok) {
        throw new Error(`Batch translation API error: ${response.status}`);
      }

      const data = await response.json();
      return data.translatedTexts || texts;
    } catch (error) {
      console.error('Batch translation error:', error);
      // Fallback to individual translations
      return Promise.all(texts.map(text => this.translateText(text, target, sourceLanguage)));
    }
  }

  t(key: string, params?: Record<string, string>): string {
    const translation = this.translations.get(key);
    if (!translation) return key;

    let text = translation[this.currentLanguage] || translation['ar'] || key;
    
    if (params) {
      Object.keys(params).forEach(param => {
        text = text.replace(`{{${param}}}`, params[param]);
      });
    }
    return text;
  }

  /**
   * Translate using Google API (async version of t)
   */
  async translate(key: string, params?: Record<string, string>): Promise<string> {
    const localText = this.t(key, params);
    
    // If already in target language, return as is
    if (this.currentLanguage === 'ar' && /[\u0600-\u06FF]/.test(localText)) {
      return localText;
    }
    if (this.currentLanguage === 'en' && /^[a-zA-Z\s]+$/.test(localText)) {
      return localText;
    }

    // Use Google Translation API
    return await this.translateText(localText, this.currentLanguage);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  addTranslation(key: string, translations: Record<string, string>): void {
    this.translations.set(key, { key, ...translations });
  }

  private async loadInitialTranslations() {
    // تم وضع النصوص هنا باللغة العربية والانجليزية بشكل مباشر
    this.addTranslation('welcome', { ar: 'مرحباً بك في RARE 4N', en: 'Welcome to RARE 4N' });
    this.addTranslation('loading', { ar: 'جاري التحميل...', en: 'Loading...' });
    this.addTranslation('error', { ar: 'حدث خطأ غير متوقع', en: 'An unexpected error occurred' });
    this.addTranslation('menu', { ar: 'القائمة', en: 'Menu' });
    this.addTranslation('settings', { ar: 'الإعدادات', en: 'Settings' });
    this.addTranslation('builder', { ar: 'البناء', en: 'Builder' });
    this.addTranslation('generator', { ar: 'المولد', en: 'Generator' });
    this.addTranslation('voiceActive', { ar: 'الصوت نشط', en: 'Voice Active' });
    this.addTranslation('voiceInactive', { ar: 'الصوت غير نشط', en: 'Voice Inactive' });
  }
}

export const translationService = new TranslationService();
export default translationService;
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage: target,
          sourceLanguage: sourceLanguage || 'auto',
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.translatedText || text;

      // Cache the translation
      this.translationCache.set(cacheKey, translatedText);

      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      // Fallback to local translation or original text
      return this.t(text) || text;
    }
  }

  /**
   * Translate multiple texts in batch
   */
  async translateBatch(texts: string[], targetLanguage?: string, sourceLanguage?: string): Promise<string[]> {
    const target = targetLanguage || this.currentLanguage;

    try {
      const response = await fetch(`${API_URL}/api/translation/translate-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts,
          targetLanguage: target,
          sourceLanguage: sourceLanguage || 'auto',
        }),
      });

      if (!response.ok) {
        throw new Error(`Batch translation API error: ${response.status}`);
      }

      const data = await response.json();
      return data.translatedTexts || texts;
    } catch (error) {
      console.error('Batch translation error:', error);
      // Fallback to individual translations
      return Promise.all(texts.map(text => this.translateText(text, target, sourceLanguage)));
    }
  }

  t(key: string, params?: Record<string, string>): string {
    const translation = this.translations.get(key);
    if (!translation) return key;

    let text = translation[this.currentLanguage] || translation['ar'] || key;
    
    if (params) {
      Object.keys(params).forEach(param => {
        text = text.replace(`{{${param}}}`, params[param]);
      });
    }
    return text;
  }

  /**
   * Translate using Google API (async version of t)
   */
  async translate(key: string, params?: Record<string, string>): Promise<string> {
    const localText = this.t(key, params);
    
    // If already in target language, return as is
    if (this.currentLanguage === 'ar' && /[\u0600-\u06FF]/.test(localText)) {
      return localText;
    }
    if (this.currentLanguage === 'en' && /^[a-zA-Z\s]+$/.test(localText)) {
      return localText;
    }

    // Use Google Translation API
    return await this.translateText(localText, this.currentLanguage);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  addTranslation(key: string, translations: Record<string, string>): void {
    this.translations.set(key, { key, ...translations });
  }

  private async loadInitialTranslations() {
    // تم وضع النصوص هنا باللغة العربية والانجليزية بشكل مباشر
    this.addTranslation('welcome', { ar: 'مرحباً بك في RARE 4N', en: 'Welcome to RARE 4N' });
    this.addTranslation('loading', { ar: 'جاري التحميل...', en: 'Loading...' });
    this.addTranslation('error', { ar: 'حدث خطأ غير متوقع', en: 'An unexpected error occurred' });
    this.addTranslation('menu', { ar: 'القائمة', en: 'Menu' });
    this.addTranslation('settings', { ar: 'الإعدادات', en: 'Settings' });
    this.addTranslation('builder', { ar: 'البناء', en: 'Builder' });
    this.addTranslation('generator', { ar: 'المولد', en: 'Generator' });
    this.addTranslation('voiceActive', { ar: 'الصوت نشط', en: 'Voice Active' });
    this.addTranslation('voiceInactive', { ar: 'الصوت غير نشط', en: 'Voice Inactive' });
  }
}

export const translationService = new TranslationService();
export default translationService;