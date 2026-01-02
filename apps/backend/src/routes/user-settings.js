/**
 * User Settings Routes
 * Multi-user settings management
 */

import express from 'express';
import { DB } from '../database/localDB.js';
import { requireAuth } from '../middleware/userIsolation.js';

const router = express.Router();

// Get user settings
router.get('/', requireAuth, (req, res) => {
  try {
    const userId = req.userId;
    const settings = DB.settings.findByUser(userId);

    if (!settings) {
      // Return defaults
      return res.json({
        success: true,
        settings: {
          theme: 'dark',
          language: 'ar',
          preferences: {},
        },
      });
    }

    res.json({
      success: true,
      settings: {
        theme: settings.theme || 'dark',
        language: settings.language || 'ar',
        preferences: settings.preferences || {},
      },
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch settings',
    });
  }
});

// Update user settings
router.put('/', requireAuth, (req, res) => {
  try {
    const userId = req.userId;
    const { theme, language, preferences } = req.body;

    DB.settings.upsert(userId, {
      theme,
      language,
      preferences,
    });

    res.json({
      success: true,
      message: 'Settings updated',
      settings: {
        theme: theme || 'dark',
        language: language || 'ar',
        preferences: preferences || {},
      },
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update settings',
    });
  }
});

export default router;




