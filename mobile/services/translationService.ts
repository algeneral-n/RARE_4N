/**
 * RARE 4N - Neural Translation Service
 * Neural Machine Translation and UI Localization System
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { RAREKernel } from '../core/RAREKernel';

export interface Translation {
  key: string;
  [language: string]: string;
}

class TranslationService {
  private translations: Map<string, Translation> = new Map();
  private currentLanguage: string = 'ar';
  private kernel: RAREKernel;

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
  }
}

export const translationService = new TranslationService();
export default translationService;