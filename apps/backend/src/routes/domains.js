/**
 * RARE 4N - Domain Management Routes
 * Portal-compatible domain endpoints
 */

import express from 'express';
import { requirePortalAuth } from '../middleware/portalAuth.js';

const router = express.Router();

/**
 * POST /api/domains/setup
 * Setup domain for a project
 * Portal endpoint - uses Portal Auth
 */
router.post('/setup', requirePortalAuth, async (req, res) => {
  try {
    const { domain, projectId, clientId, dnsRecords } = req.body;

    if (!domain) {
      return res.status(400).json({
        success: false,
        error: 'Domain is required',
      });
    }

    const domainId = `domain_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (!global.domainRegistry) {
      global.domainRegistry = new Map();
    }

    global.domainRegistry.set(domainId, {
      domainId,
      domain,
      projectId,
      clientId,
      status: 'pending',
      dnsRecords: dnsRecords || [],
      createdAt: Date.now(),
    });

    res.json({
      success: true,
      domainId,
      domain,
      status: 'pending',
      message: 'Domain setup initiated',
    });
  } catch (error) {
    console.error('Setup domain error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to setup domain',
    });
  }
});

/**
 * GET /api/domains/:id/status
 * Get domain status
 * Portal endpoint - uses Portal Auth
 */
router.get('/:id/status', requirePortalAuth, async (req, res) => {
  try {
    const { id: domainId } = req.params;

    if (!domainId) {
      return res.status(400).json({
        success: false,
        error: 'Domain ID is required',
      });
    }

    if (!global.domainRegistry) {
      return res.status(404).json({
        success: false,
        error: 'Domain not found',
      });
    }

    const domainInfo = global.domainRegistry.get(domainId);
    if (!domainInfo) {
      return res.status(404).json({
        success: false,
        error: 'Domain not found',
      });
    }

    res.json({
      success: true,
      domainId,
      domain: domainInfo.domain,
      status: domainInfo.status || 'unknown',
      projectId: domainInfo.projectId,
      clientId: domainInfo.clientId,
      dnsRecords: domainInfo.dnsRecords || [],
      createdAt: domainInfo.createdAt,
      verifiedAt: domainInfo.verifiedAt,
    });
  } catch (error) {
    console.error('Get domain status error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get domain status',
    });
  }
});

export default router;

