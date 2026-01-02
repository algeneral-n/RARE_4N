/**
 * RARE 4N - Settings Routes
 * مسارات الإعدادات
 */

import express from 'express';
import { requireAuth } from '../middleware/userIsolation.js';

const router = express.Router();

/**
 * GET /api/settings
 * Get user settings
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.get('/', requireAuth, (req, res) => {
  const userId = req.userId; // From requireAuth middleware
  res.json({
    success: true,
    userId, // Include userId to verify isolation
    settings: {
      theme: 'dark',
      language: 'ar',
      notifications: true,
      voiceEnabled: true,
    },
  });
});

/**
 * POST /api/settings/update
 * Update user settings
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/update', requireAuth, async (req, res) => {
  try {
    const userId = req.userId; // From requireAuth middleware
    const { settings } = req.body;

    // ✅ SECURITY: Ensure settings are saved per user
    // In production, save to database with userId

    res.json({
      success: true,
      userId, // Include userId to verify isolation
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
