/**
 * RARE 4N - Google Translation Service
 * Uses Google Cloud Translation API for dynamic translation
 * ✅ Can replace i18n for app and portal content
 */

import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const TRANSLATION_API_URL = 'https://translation.googleapis.com/language/translate/v2';

/**
 * Translate text using Google Translation API
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'ar', 'en', 'fr')
 * @param {string} sourceLanguage - Source language code (optional, auto-detect if not provided)
 * @returns {Promise<string>} Translated text
 */
export async function translateText(text, targetLanguage = 'ar', sourceLanguage = null) {
  try {
    if (!GOOGLE_API_KEY) {
      console.warn('[TranslationService] Google API Key not configured - translation disabled');
      return text; // Return original text if translation is not available
    }

    const params = {
      key: GOOGLE_API_KEY,
      q: text,
      target: targetLanguage,
    };

    if (sourceLanguage) {
      params.source = sourceLanguage;
    }

    const response = await axios.post(TRANSLATION_API_URL, null, { params });

    if (response.data?.data?.translations?.[0]?.translatedText) {
      return response.data.data.translations[0].translatedText;
    }

    throw new Error('Translation API returned invalid response');
  } catch (error) {
    console.error('[TranslationService] Translation error:', error.message);
    throw error;
  }
}

/**
 * Translate multiple texts in batch
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLanguage - Target language code
 * @param {string} sourceLanguage - Source language code (optional)
 * @returns {Promise<string[]>} Array of translated texts
 */
export async function translateBatch(texts, targetLanguage = 'ar', sourceLanguage = null) {
  try {
    if (!GOOGLE_API_KEY) {
      console.warn('[TranslationService] Google API Key not configured - returning original texts');
      return texts; // Return original texts if translation is not available
    }

    const params = {
      key: GOOGLE_API_KEY,
      q: texts,
      target: targetLanguage,
    };

    if (sourceLanguage) {
      params.source = sourceLanguage;
    }

    const response = await axios.post(TRANSLATION_API_URL, null, { params });

    if (response.data?.data?.translations) {
      return response.data.data.translations.map(t => t.translatedText);
    }

    throw new Error('Translation API returned invalid response');
  } catch (error) {
    console.error('[TranslationService] Batch translation error:', error.message);
    throw error;
  }
}

/**
 * Detect language of text
 * @param {string} text - Text to detect language for
 * @returns {Promise<string>} Detected language code
 */
export async function detectLanguage(text) {
  try {
    if (!GOOGLE_API_KEY) {
      console.warn('[TranslationService] Google API Key not configured - language detection disabled');
      return 'en'; // Return default language if detection is not available
    }

    const response = await axios.post(
      'https://translation.googleapis.com/language/translate/v2/detect',
      null,
      {
        params: {
          key: GOOGLE_API_KEY,
          q: text,
        },
      }
    );

    if (response.data?.data?.detections?.[0]?.[0]?.language) {
      return response.data.data.detections[0][0].language;
    }

    throw new Error('Language detection API returned invalid response');
  } catch (error) {
    console.error('[TranslationService] Language detection error:', error.message);
    throw error;
  }
}

/**
 * Get supported languages
 * @param {string} targetLanguage - Language code for language names (e.g., 'en', 'ar')
 * @returns {Promise<Array>} Array of supported languages
 */
export async function getSupportedLanguages(targetLanguage = 'en') {
  try {
    if (!GOOGLE_API_KEY) {
      console.warn('[TranslationService] Google API Key not configured - returning default languages');
      return [{ language: 'en', name: 'English' }, { language: 'ar', name: 'Arabic' }]; // Return default languages
    }

    const response = await axios.get(
      'https://translation.googleapis.com/language/translate/v2/languages',
      {
        params: {
          key: GOOGLE_API_KEY,
          target: targetLanguage,
        },
      }
    );

    if (response.data?.data?.languages) {
      return response.data.data.languages;
    }

    throw new Error('Languages API returned invalid response');
  } catch (error) {
    console.error('[TranslationService] Get languages error:', error.message);
    throw error;
  }
}

export default {
  translateText,
  translateBatch,
  detectLanguage,
  getSupportedLanguages,
};

