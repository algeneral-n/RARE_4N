/**
 * RARE 4N - Google Translation Service (Client Portal)
 * Uses Google Translation API for dynamic translation
 * ✅ Replaces i18n for better multilingual support
 */

import { CONFIG } from '../config.js';
import { apiGet, apiPost, parseJsonResponse } from '../utils/apiClient.js';

class TranslationService {
  constructor() {
    this.apiUrl = CONFIG.api.baseUrl;
    this.currentLanguage = localStorage.getItem('language') || 'ar';
    this.translationCache = new Map();
  }

  /**
   * Translate text using Google Translation API
   * @param {string} text - Text to translate
   * @param {string} targetLanguage - Target language code (e.g., 'ar', 'en', 'fr')
   * @param {string} sourceLanguage - Source language code (optional, auto-detect if not provided)
   * @returns {Promise<string>} Translated text
   */
  async translateText(text, targetLanguage = null, sourceLanguage = null) {
    try {
      // Use current language if target not specified
      const target = targetLanguage || this.currentLanguage;

      // Check cache first
      const cacheKey = `${text}_${target}`;
      if (this.translationCache.has(cacheKey)) {
        return this.translationCache.get(cacheKey);
      }

      // ✅ Use apiClient to automatically add X-Portal-Key header
      const response = await apiPost('/api/translation/translate', {
        text,
        targetLanguage: target,
        sourceLanguage: sourceLanguage || null,
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await parseJsonResponse(response);

      if (data.success && data.translatedText) {
        // Cache the translation
        this.translationCache.set(cacheKey, data.translatedText);
        return data.translatedText;
      }

      throw new Error('Translation API returned invalid response');
    } catch (error) {
      console.error('[TranslationService] Translation error:', error);
      // Return original text on error
      return text;
    }
  }

  /**
   * Translate multiple texts in batch
   * @param {string[]} texts - Array of texts to translate
   * @param {string} targetLanguage - Target language code
   * @param {string} sourceLanguage - Source language code (optional)
   * @returns {Promise<string[]>} Array of translated texts
   */
  async translateBatch(texts, targetLanguage = null, sourceLanguage = null) {
    try {
      const target = targetLanguage || this.currentLanguage;

      // ✅ Use apiClient to automatically add X-Portal-Key header
      const response = await apiPost('/api/translation/translate-batch', {
        texts,
        targetLanguage: target,
        sourceLanguage: sourceLanguage || null,
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await parseJsonResponse(response);

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
      console.error('[TranslationService] Batch translation error:', error);
      // Return original texts on error
      return texts;
    }
  }

  /**
   * Detect language of text
   * @param {string} text - Text to detect language for
   * @returns {Promise<string>} Detected language code
   */
  async detectLanguage(text) {
    try {
      // ✅ Use apiClient to automatically add X-Portal-Key header
      const response = await apiPost('/api/translation/detect', { text });

      if (!response.ok) {
        throw new Error(`Language detection API error: ${response.status}`);
      }

      const data = await parseJsonResponse(response);

      if (data.success && data.detectedLanguage) {
        return data.detectedLanguage;
      }

      throw new Error('Language detection API returned invalid response');
    } catch (error) {
      console.error('[TranslationService] Language detection error:', error);
      return 'en'; // Default to English
    }
  }

  /**
   * Get supported languages
   * @param {string} targetLanguage - Language code for language names
   * @returns {Promise<Array>} Array of supported languages
   */
  async getSupportedLanguages(targetLanguage = 'en') {
    try {
      // ✅ Use apiClient to automatically add X-Portal-Key header
      const response = await apiGet(`/api/translation/languages?targetLanguage=${targetLanguage}`);

      if (!response.ok) {
        throw new Error(`Languages API error: ${response.status}`);
      }

      const data = await parseJsonResponse(response);

      if (data.success && data.languages) {
        return data.languages;
      }

      throw new Error('Languages API returned invalid response');
    } catch (error) {
      console.error('[TranslationService] Get languages error:', error);
      return [];
    }
  }

  /**
   * Change current language
   * @param {string} language - Language code
   */
  setLanguage(language) {
    this.currentLanguage = language;
    localStorage.setItem('language', language);
    // Clear cache when language changes
    this.translationCache.clear();
  }

  /**
   * Get current language
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  /**
   * Clear translation cache
   */
  clearCache() {
    this.translationCache.clear();
  }
}

// Export singleton instance
export const translationService = new TranslationService();
export default translationService;

