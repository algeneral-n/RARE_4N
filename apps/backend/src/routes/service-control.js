/**
 * RARE 4N - Service Control Routes
 * التحكم في الخدمات (Backend & Cloudflare) عبر PM2
 * ✅ مرتبط بـ Cognitive Loop & Kernel
 */

import express from 'express';
import { ServiceManager } from '../core/ServiceManager.js';

const router = express.Router();

/**
 * GET /api/service-control/status
 * Get services status
 */
router.get('/status', async (req, res) => {
  try {
    const serviceManager = ServiceManager.getInstance();
    const status = await serviceManager.getStatus();
    res.json({ success: true, services: status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/service-control/backend/start
 * Start Backend service
 */
router.post('/backend/start', async (req, res) => {
  try {
    const serviceManager = ServiceManager.getInstance();
    const result = await serviceManager.startBackend();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/service-control/backend/stop
 * Stop Backend service
 */
router.post('/backend/stop', async (req, res) => {
  try {
    const serviceManager = ServiceManager.getInstance();
    const result = await serviceManager.stopBackend();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/service-control/backend/restart
 * Restart Backend service
 */
router.post('/backend/restart', async (req, res) => {
  try {
    const serviceManager = ServiceManager.getInstance();
    const result = await serviceManager.restartService('backend');
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/service-control/cloudflare/start
 * Start Cloudflare Tunnel
 */
router.post('/cloudflare/start', async (req, res) => {
  try {
    const serviceManager = ServiceManager.getInstance();
    const result = await serviceManager.startCloudflare();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/service-control/cloudflare/stop
 * Stop Cloudflare Tunnel
 */
router.post('/cloudflare/stop', async (req, res) => {
  try {
    const serviceManager = ServiceManager.getInstance();
    const result = await serviceManager.stopCloudflare();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/service-control/cloudflare/restart
 * Restart Cloudflare Tunnel
 */
router.post('/cloudflare/restart', async (req, res) => {
  try {
    const serviceManager = ServiceManager.getInstance();
    const result = await serviceManager.restartService('cloudflare');
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
























