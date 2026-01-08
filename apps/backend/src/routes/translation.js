/**
 * RARE 4N - Translation Routes
 * Google Translation API Integration
 */

import express from 'express';
import { translateText, translateBatch, detectLanguage } from '../services/translationService.js';

const router = express.Router();

/**
 * POST /api/translation/translate
 * Translate single text
 */
router.post('/translate', async (req, res) => {
  try {
    const { text, targetLanguage = 'ar', sourceLanguage = 'auto' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const translatedText = await translateText(text, targetLanguage, sourceLanguage === 'auto' ? null : sourceLanguage);

    res.json({
      success: true,
      translatedText,
      sourceLanguage: sourceLanguage === 'auto' ? 'auto-detected' : sourceLanguage,
      targetLanguage,
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Translation failed',
    });
  }
});

/**
 * POST /api/translation/translate-batch
 * Translate multiple texts in batch
 */
router.post('/translate-batch', async (req, res) => {
  try {
    const { texts, targetLanguage = 'ar', sourceLanguage = 'auto' } = req.body;

    if (!texts || !Array.isArray(texts)) {
      return res.status(400).json({ error: 'Texts array is required' });
    }

    const translatedTexts = await translateBatch(texts, targetLanguage, sourceLanguage === 'auto' ? null : sourceLanguage);

    res.json({
      success: true,
      translatedTexts,
      sourceLanguage: sourceLanguage === 'auto' ? 'auto-detected' : sourceLanguage,
      targetLanguage,
    });
  } catch (error) {
    console.error('Batch translation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Batch translation failed',
    });
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

    const detectedLanguage = await detectLanguage(text);

    res.json({
      success: true,
      language: detectedLanguage,
    });
  } catch (error) {
    console.error('Language detection error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Language detection failed',
    });
  }
});

export default router;
