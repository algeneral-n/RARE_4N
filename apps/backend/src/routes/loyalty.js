/**
 * RARE 4N - Absolute Loyalty Protocol Routes
 * Backend API for Absolute Loyalty Protocol
 */

import express from 'express';
import { requireAuth } from '../middleware/userIsolation.js';

const router = express.Router();

/**
 * POST /api/loyalty/authenticate
 * Authenticate master (Nader)
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/authenticate', requireAuth, (req, res) => {
  try {
    const { biometricResult } = req.body;
    
    if (!biometricResult || !biometricResult.success) {
      return res.status(401).json({
        success: false,
        error: 'Biometric authentication failed',
        threatLevel: 'high'
      });
    }
    
    const session = {
      authenticated: true,
      biometricPassed: true,
      voiceVerified: false,
      behaviorMatch: 0,
      sessionStart: Date.now(),
      lastActivity: Date.now(),
      trustScore: 100
    };
    
    res.json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/loyalty/validate-command
 * Validate command for security
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/validate-command', requireAuth, (req, res) => {
  try {
    const { command, userId, context } = req.body;
    
    if (!command || typeof command !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Command is required'
      });
    }
    
    // التحقق من الهوية
    if (userId && userId !== 'nader') {
      return res.json({
        success: false,
        allowed: false,
        reason: '🚫 UNAUTHORIZED: Only Master Nader can command RARE 4N',
        threatLevel: 'critical'
      });
    }
    
    // التحقق من حساسية الأمر
    const sensitiveKeywords = [
      'transfer money', 'send payment', 'withdraw', 'حول مبلغ', 'ارسل فلوس',
      'share vault', 'export data', 'reveal password', 'شارك الخزنة', 'افتح البيانات',
      'grant access', 'delete account', 'freeze company', 'امنح صلاحية', 'احذف',
      'shutdown system', 'reset database', 'remove all', 'اغلق النظام', 'امسح الكل',
      'tell about', 'share with', 'send to', 'قل عن', 'شارك مع', 'ارسل ل',
    ];
    
    const lowerCommand = command.toLowerCase();
    let isSensitive = false;
    let threatLevel = 'none';
    
    for (const keyword of sensitiveKeywords) {
      if (lowerCommand.includes(keyword.toLowerCase())) {
        isSensitive = true;
        if (keyword.includes('money') || keyword.includes('shutdown') || keyword.includes('reset')) {
          threatLevel = 'critical';
        } else if (keyword.includes('vault') || keyword.includes('password') || keyword.includes('delete')) {
          threatLevel = 'high';
        } else {
          threatLevel = 'medium';
        }
        break;
      }
    }
    
    if (isSensitive) {
      return res.json({
        success: true,
        allowed: false,
        requiresConfirmation: true,
        reason: `🔒 SENSITIVE OPERATION detected\n\nThis command requires explicit confirmation.\n\nCommand: ${command}\nThreat Level: ${threatLevel}`,
        threatLevel
      });
    }
    
    res.json({
      success: true,
      allowed: true,
      threatLevel: 'none'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/loyalty/threats
 * Get threat log
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.get('/threats', requireAuth, (req, res) => {
  try {
    // في الإنتاج: جلب من قاعدة البيانات
    res.json({
      success: true,
      threats: [],
      count: 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/loyalty/session
 * Get current session status
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.get('/session', requireAuth, (req, res) => {
  try {
    res.json({
      success: true,
      authenticated: false,
      session: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;


