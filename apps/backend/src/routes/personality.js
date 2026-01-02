/**
 * RARE 4N - Personality Routes
 * AI personality and behavior customization
 */

import express from 'express';
import { requireAuth } from '../middleware/userIsolation.js';
import { getDatabase, DB } from '../database/localDB.js';

const router = express.Router();

/**
 * GET /api/personality
 * Get current AI personality settings
 */
router.get('/', requireAuth, (req, res) => {
  try {
    const userId = req.userId;
    
    // Get personality settings from database
    const personality = DB.settings?.findByUserId?.(userId) || {
      tone: 'friendly',
      style: 'professional',
      language: 'ar',
      traits: ['helpful', 'intelligent', 'empathetic']
    };

    res.json({
      success: true,
      personality
    });
  } catch (error) {
    console.error('Personality get error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/personality
 * Update AI personality settings
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { tone, style, language, traits } = req.body;

    // Validate input
    const validTones = ['friendly', 'professional', 'casual', 'formal', 'humorous'];
    const validStyles = ['professional', 'conversational', 'technical', 'creative'];
    
    if (tone && !validTones.includes(tone)) {
      return res.status(400).json({
        success: false,
        error: `Invalid tone. Must be one of: ${validTones.join(', ')}`
      });
    }

    if (style && !validStyles.includes(style)) {
      return res.status(400).json({
        success: false,
        error: `Invalid style. Must be one of: ${validStyles.join(', ')}`
      });
    }

    // Update personality settings
    const personality = {
      tone: tone || 'friendly',
      style: style || 'professional',
      language: language || 'ar',
      traits: traits || ['helpful', 'intelligent', 'empathetic'],
      updatedAt: new Date().toISOString()
    };

    // Save to database (if settings table exists)
    if (DB.settings?.update) {
      DB.settings.update(userId, { personality });
    }

    res.json({
      success: true,
      personality,
      message: 'Personality settings updated successfully'
    });
  } catch (error) {
    console.error('Personality update error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/personality/presets
 * Get available personality presets
 */
router.get('/presets', (req, res) => {
  res.json({
    success: true,
    presets: [
      {
        id: 'professional',
        name: 'Professional',
        nameAr: 'احترافي',
        tone: 'professional',
        style: 'professional',
        traits: ['helpful', 'intelligent', 'precise']
      },
      {
        id: 'friendly',
        name: 'Friendly',
        nameAr: 'ودود',
        tone: 'friendly',
        style: 'conversational',
        traits: ['helpful', 'friendly', 'empathetic']
      },
      {
        id: 'creative',
        name: 'Creative',
        nameAr: 'إبداعي',
        tone: 'casual',
        style: 'creative',
        traits: ['creative', 'imaginative', 'inspiring']
      },
      {
        id: 'technical',
        name: 'Technical',
        nameAr: 'تقني',
        tone: 'formal',
        style: 'technical',
        traits: ['precise', 'detailed', 'analytical']
      }
    ]
  });
});

export default router;





