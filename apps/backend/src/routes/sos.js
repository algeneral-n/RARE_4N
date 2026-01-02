/**
 * RARE 4N - SOS Emergency Routes
 * مسارات الطوارئ
 */

import express from 'express';
import { requireAuth } from '../middleware/userIsolation.js';

const router = express.Router();

/**
 * POST /api/sos/activate
 * Activate SOS emergency
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/activate', requireAuth, async (req, res) => {
  try {
    const userId = req.userId; // From requireAuth middleware
    const { location, contacts } = req.body;

    console.log('🚨 SOS Activated:', { userId, location });

    res.json({
      success: true,
      message: 'SOS activated successfully',
      timestamp: Date.now(),
      emergencyId: `sos_${Date.now()}`,
    });
  } catch (error) {
    console.error('SOS activation error:', error);
    res.status(500).json({ error: 'Failed to activate SOS' });
  }
});

/**
 * POST /api/sos/deactivate
 * Deactivate SOS emergency
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/deactivate', requireAuth, async (req, res) => {
  try {
    const userId = req.userId; // From requireAuth middleware
    const { emergencyId } = req.body;

    console.log('✅ SOS Deactivated:', { emergencyId, userId });

    res.json({
      success: true,
      message: 'SOS deactivated successfully',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('SOS deactivation error:', error);
    res.status(500).json({ error: 'Failed to deactivate SOS' });
  }
});

/**
 * GET /api/sos/status
 * Get SOS status
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.get('/status', requireAuth, (req, res) => {
  const userId = req.userId; // From requireAuth middleware
  res.json({
    success: true,
    userId, // Include userId to verify isolation
    active: false,
    lastActivation: null,
  });
});

export default router;
