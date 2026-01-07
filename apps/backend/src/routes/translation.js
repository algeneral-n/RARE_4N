/**
 * RARE 4N - Translation API Routes
 * Google Translation API endpoints for app and portal
 */

import express from 'express';
import translationService from '../services/translationService.js';

const router = express.Router();

/**
 * POST /api/translation/translate
 * Translate single text
 */
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage = 'ar', sourceLanguage = null } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const translatedText = await translationService.translateText(text, targetLanguage, sourceLanguage);

    res.json({
      success: true,
      originalText: text,
      translatedText,
      targetLanguage,
      sourceLanguage: sourceLanguage || 'auto-detected',
    });
  } catch (error) {
    console.error('[Translation] Translate error:', error);
    res.status(500).json({ error: error.message || 'Translation failed' });
  }
});

/**
 * POST /api/translation/translate-batch
 * Translate multiple texts
 */
router.post('/translate-batch', async (req, res) => {
  try {
    const { texts, targetLanguage = 'ar', sourceLanguage = null } = req.body;

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({ error: 'Texts array is required' });
    }

    const translatedTexts = await translationService.translateBatch(texts, targetLanguage, sourceLanguage);

    res.json({
      success: true,
      originalTexts: texts,
      translatedTexts,
      targetLanguage,
      sourceLanguage: sourceLanguage || 'auto-detected',
    });
  } catch (error) {
    console.error('[Translation] Batch translate error:', error);
    res.status(500).json({ error: error.message || 'Batch translation failed' });
  }
});

/**
 * POST /api/translation/detect
 * Detect language of text
 */
router.post('/detect', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const detectedLanguage = await translationService.detectLanguage(text);

    res.json({
      success: true,
      text,
      detectedLanguage,
    });
  } catch (error) {
    console.error('[Translation] Detect error:', error);
    res.status(500).json({ error: error.message || 'Language detection failed' });
  }
});

/**
 * GET /api/translation/languages
 * Get supported languages
 */
router.get('/languages', async (req, res) => {
  try {
    const { targetLanguage = 'en' } = req.query;

    const languages = await translationService.getSupportedLanguages(targetLanguage);

    res.json({
      success: true,
      languages,
      targetLanguage,
    });
  } catch (error) {
    console.error('[Translation] Get languages error:', error);
    res.status(500).json({ error: error.message || 'Failed to get languages' });
  }
});

export default router;

