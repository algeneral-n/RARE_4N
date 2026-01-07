/**
 * RARE 4N - Google Translation Service (Mobile App)
 * Uses Google Translation API for dynamic translation
 * ✅ Replaces i18n for better multilingual support
 */

import { API_URL } from './config';

class GoogleTranslationService {
  private currentLanguage: string = 'ar';
  private translationCache: Map<string, string> = new Map();

  constructor() {
    // Load saved language
    this.loadLanguage();
  }

  private async loadLanguage() {
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      const lang = await AsyncStorage.getItem('language') || 'ar';
      this.currentLanguage = lang;
    } catch (error) {
      console.error('[GoogleTranslationService] Error loading language:', error);
    }
  }

  /**
   * Translate text using Google Translation API
   * @param text - Text to translate
   * @param targetLanguage - Target language code (e.g., 'ar', 'en', 'fr')
   * @param sourceLanguage - Source language code (optional, auto-detect if not provided)
   * @returns Translated text
   */
  async translateText(text: string, targetLanguage?: string, sourceLanguage?: string | null): Promise<string> {
    try {
      // Use current language if target not specified
      const target = targetLanguage || this.currentLanguage;

      // Check cache first
      const cacheKey = `${text}_${target}`;
      if (this.translationCache.has(cacheKey)) {
        return this.translationCache.get(cacheKey)!;
      }

      const response = await fetch(`${API_URL}/api/translation/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetLanguage: target,
          sourceLanguage: sourceLanguage || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.translatedText) {
        // Cache the translation
        this.translationCache.set(cacheKey, data.translatedText);
        return data.translatedText;
      }

      throw new Error('Translation API returned invalid response');
    } catch (error) {
      console.error('[GoogleTranslationService] Translation error:', error);
      // Return original text on error
      return text;
    }
  }

  /**
   * Translate multiple texts in batch
   * @param texts - Array of texts to translate
   * @param targetLanguage - Target language code
   * @param sourceLanguage - Source language code (optional)
   * @returns Array of translated texts
   */
  async translateBatch(texts: string[], targetLanguage?: string, sourceLanguage?: string | null): Promise<string[]> {
    try {
      const target = targetLanguage || this.currentLanguage;

      const response = await fetch(`${API_URL}/api/translation/translate-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts,
          targetLanguage: target,
          sourceLanguage: sourceLanguage || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.translatedTexts) {
        // Cache translations
        texts.forEach((text, index) => {
          const cacheKey = `${text}_${target}`;
          this.translationCache.set(cacheKey, data.translatedTexts[index]);
        });
        return data.translatedTexts;
      }

      throw new Error('Translation API returned invalid response');
    } catch (error) {
      console.error('[GoogleTranslationService] Batch translation error:', error);
      // Return original texts on error
      return texts;
    }
  }

  /**
   * Detect language of text
   * @param text - Text to detect language for
   * @returns Detected language code
   */
  async detectLanguage(text: string): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/api/translation/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Language detection API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.detectedLanguage) {
        return data.detectedLanguage;
      }

      throw new Error('Language detection API returned invalid response');
    } catch (error) {
      console.error('[GoogleTranslationService] Language detection error:', error);
      return 'en'; // Default to English
    }
  }

  /**
   * Get supported languages
   * @param targetLanguage - Language code for language names
   * @returns Array of supported languages
   */
  async getSupportedLanguages(targetLanguage: string = 'en'): Promise<Array<{ language: string; name: string }>> {
    try {
      const response = await fetch(`${API_URL}/api/translation/languages?targetLanguage=${targetLanguage}`);

      if (!response.ok) {
        throw new Error(`Languages API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.languages) {
        return data.languages;
      }

      throw new Error('Languages API returned invalid response');
    } catch (error) {
      console.error('[GoogleTranslationService] Get languages error:', error);
      return [];
    }
  }

  /**
   * Change current language
   * @param language - Language code
   */
  async setLanguage(language: string): Promise<void> {
    this.currentLanguage = language;
    try {
      const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
      await AsyncStorage.setItem('language', language);
    } catch (error) {
      console.error('[GoogleTranslationService] Error saving language:', error);
    }
    // Clear cache when language changes
    this.translationCache.clear();
  }

  /**
   * Get current language
   * @returns Current language code
   */
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.translationCache.clear();
  }
}

// Export singleton instance
export const googleTranslationService = new GoogleTranslationService();
export default googleTranslationService;

