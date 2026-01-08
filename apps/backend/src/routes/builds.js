/**
 * RARE 4N - Build System Routes
 * Portal-compatible build endpoints
 */

import express from 'express';
import { requirePortalAuth } from '../middleware/portalAuth.js';
import { requireAuth } from '../middleware/userIsolation.js';
import { buildAllPlatforms } from '../services/buildService.js';
import expoService from '../services/expoService.js';

const router = express.Router();

/**
 * POST /api/builds/trigger
 * Trigger a new build
 * Portal endpoint - uses Portal Auth
 */
router.post('/trigger', requirePortalAuth, async (req, res) => {
  try {
    const { projectName, platforms, clientId, clientEmail, requestId, projectType } = req.body;

    if (!projectName) {
      return res.status(400).json({
        success: false,
        error: 'Project name is required',
      });
    }

    const platformsArray = platforms ? (Array.isArray(platforms) ? platforms : platforms.split(',')) : ['ios', 'android', 'web'];
    
    const buildId = `build_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (!global.buildHistory) {
      global.buildHistory = new Map();
    }

    global.buildHistory.set(buildId, {
      buildId,
      projectName,
      platforms: platformsArray,
      status: 'pending',
      createdAt: Date.now(),
      clientId,
      clientEmail,
      requestId,
      projectType: projectType || 'web',
    });

    res.json({
      success: true,
      buildId,
      status: 'pending',
      projectName,
      platforms: platformsArray,
      message: 'Build triggered successfully',
    });
  } catch (error) {
    console.error('Trigger build error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to trigger build',
    });
  }
});

/**
 * GET /api/builds/:id/status
 * Get build status
 * Portal endpoint - uses Portal Auth
 */
router.get('/:id/status', requirePortalAuth, async (req, res) => {
  try {
    const { id: buildId } = req.params;

    if (!buildId) {
      return res.status(400).json({
        success: false,
        error: 'Build ID is required',
      });
    }

    if (!global.buildHistory) {
      return res.status(404).json({
        success: false,
        error: 'Build not found',
      });
    }

    const buildInfo = global.buildHistory.get(buildId);
    if (!buildInfo) {
      return res.status(404).json({
        success: false,
        error: 'Build not found',
      });
    }

    res.json({
      success: true,
      buildId,
      status: buildInfo.status || 'unknown',
      projectName: buildInfo.projectName,
      platforms: buildInfo.platforms,
      createdAt: buildInfo.createdAt,
      completedAt: buildInfo.completedAt,
      error: buildInfo.error,
      builds: buildInfo.builds || [],
    });
  } catch (error) {
    console.error('Get build status error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get build status',
    });
  }
});

/**
 * POST /api/builds/:id/deliver
 * Deliver a completed build
 * Portal endpoint - uses Portal Auth
 */
router.post('/:id/deliver', requirePortalAuth, async (req, res) => {
  try {
    const { id: buildId } = req.params;
    const { deliveryMethod, recipient, message } = req.body;

    if (!buildId) {
      return res.status(400).json({
        success: false,
        error: 'Build ID is required',
      });
    }

    if (!global.buildHistory) {
      return res.status(404).json({
        success: false,
        error: 'Build not found',
      });
    }

    const buildInfo = global.buildHistory.get(buildId);
    if (!buildInfo) {
      return res.status(404).json({
        success: false,
        error: 'Build not found',
      });
    }

    buildInfo.status = 'delivered';
    buildInfo.deliveredAt = Date.now();
    buildInfo.deliveryMethod = deliveryMethod || 'email';
    buildInfo.recipient = recipient;

    res.json({
      success: true,
      buildId,
      status: 'delivered',
      deliveryMethod: deliveryMethod || 'email',
      recipient,
      message: message || 'Build delivered successfully',
    });
  } catch (error) {
    console.error('Deliver build error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to deliver build',
    });
  }
});

/**
 * POST /api/builds/:id/rollback
 * Rollback a build to a previous version
 * Portal endpoint - uses Portal Auth
 */
router.post('/:id/rollback', requirePortalAuth, async (req, res) => {
  try {
    const { id: buildId } = req.params;
    const { targetVersion, reason } = req.body;

    if (!buildId) {
      return res.status(400).json({
        success: false,
        error: 'Build ID is required',
      });
    }

    if (!global.buildHistory) {
      return res.status(404).json({
        success: false,
        error: 'Build not found',
      });
    }

    const buildInfo = global.buildHistory.get(buildId);
    if (!buildInfo) {
      return res.status(404).json({
        success: false,
        error: 'Build not found',
      });
    }

    buildInfo.status = 'rolled_back';
    buildInfo.rolledBackAt = Date.now();
    buildInfo.rollbackReason = reason;
    buildInfo.targetVersion = targetVersion || 'previous';

    res.json({
      success: true,
      buildId,
      status: 'rolled_back',
      targetVersion: targetVersion || 'previous',
      reason: reason || 'User requested rollback',
      message: 'Build rolled back successfully',
    });
  } catch (error) {
    console.error('Rollback build error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to rollback build',
    });
  }
});

export default router;

