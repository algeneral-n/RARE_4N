/**
 * Kill Switch Routes
 * Emergency shutdown and feature control
 * 
 * ✅ SECURITY: Critical system control endpoints
 * ✅ AUTHENTICATION: Requires admin authentication
 */

import express from 'express';
import { getCostManager } from '../services/costManager.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

/**
 * GET /api/kill-switch/status
 * Get current kill switch status
 * ✅ SECURITY: Public endpoint (status only, no sensitive data)
 */
router.get('/status', (req, res) => {
  try {
    const costManager = getCostManager();
    const status = costManager.getKillSwitchStatus();
    
    res.json({
      success: true,
      killSwitch: status,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[KillSwitch] Error getting status:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/kill-switch/activate
 * Activate kill switch (emergency shutdown)
 * 
 * ✅ SECURITY: Requires admin authentication (JWT or admin key)
 * 
 * Authentication methods:
 * 1. JWT token with admin user (Authorization: Bearer <token>)
 * 2. Admin key in body (adminKey: <key>)
 * 3. Admin key in header (X-Admin-Key: <key>)
 */
router.post('/activate', requireAdmin, (req, res) => {
  try {
    const { reason } = req.body;

    const costManager = getCostManager();
    costManager.activateKillSwitch(reason || 'Emergency shutdown activated');

    // ✅ SECURITY: Log admin action
    console.error(`[KillSwitch] 🔴 ACTIVATED by admin`, {
      userId: req.adminUserId || 'admin_key',
      authMethod: req.authMethod,
      reason: reason || 'No reason provided',
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Kill switch activated',
      reason: reason || 'Emergency shutdown',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[KillSwitch] Error activating kill switch:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/kill-switch/deactivate
 * Deactivate kill switch
 * 
 * ✅ SECURITY: Requires admin authentication (JWT or admin key)
 */
router.post('/deactivate', requireAdmin, (req, res) => {
  try {

    const costManager = getCostManager();
    costManager.deactivateKillSwitch();

    // ✅ SECURITY: Log admin action
    console.log('[KillSwitch] ✅ Deactivated by admin', {
      userId: req.adminUserId || 'admin_key',
      authMethod: req.authMethod,
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Kill switch deactivated',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[KillSwitch] Error deactivating kill switch:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/kill-switch/usage-stats/:userId
 * Get AI usage statistics (for monitoring)
 * 
 * ✅ SECURITY: Requires admin authentication OR user can view own stats
 */
router.get('/usage-stats/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // ✅ SECURITY: Allow users to view their own stats, or admin to view any
    const requestingUserId = req.adminUserId || req.userId;
    if (requestingUserId !== userId && !req.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: You can only view your own usage stats',
      });
    }
    
    const costManager = getCostManager();
    const stats = await costManager.getUsageStats(userId);

    res.json({
      success: true,
      stats,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[KillSwitch] Error getting usage stats:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

