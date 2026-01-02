/**
 * RARE 4N - Guardian Protocol Routes
 * Backend API for Guardian Protocol (SOS System)
 */

import express from 'express';
import { requireAuth } from '../middleware/userIsolation.js';

const router = express.Router();

/**
 * POST /api/guardian/sos
 * Activate SOS emergency protocol
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/sos', requireAuth, async (req, res) => {
  try {
    const userId = req.userId; // From requireAuth middleware
    const { reason, location } = req.body;
    
    console.log('🚨🚨🚨 SOS ACTIVATED 🚨🚨🚨');
    console.log(`Reason: ${reason || 'Manual activation'}`);
    console.log(`User: ${userId || 'unknown'}`);
    console.log(`Location:`, location);
    
    // في الإنتاج: إرسال رسائل طوارئ، تسجيل الحدث، إلخ
    
    res.json({
      success: true,
      message: 'SOS protocol activated',
      timestamp: Date.now(),
      location,
      reason: reason || 'Manual activation'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/guardian/detect-distress
 * Detect distress keywords in text
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/detect-distress', requireAuth, (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Text is required'
      });
    }
    
    const distressKeywords = [
      'help', 'emergency', 'police', '911', 
      'مساعدة', 'نجدة', 'الشرطة', 'خطر', 'طوارئ',
      'save me', 'danger', 'threat',
      'أنقذني', 'تهديد', 'اتصل بالشرطة'
    ];
    
    const lowerText = text.toLowerCase();
    let detected = false;
    let keyword = '';
    
    for (const kw of distressKeywords) {
      if (lowerText.includes(kw.toLowerCase())) {
        detected = true;
        keyword = kw;
        break;
      }
    }
    
    res.json({
      success: true,
      detected,
      keyword: detected ? keyword : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/guardian/analyze-duress
 * Analyze duress indicators
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/analyze-duress', requireAuth, (req, res) => {
  try {
    const { voiceData, faceData, behaviorData } = req.body;
    
    // تحليل بسيط
    const voiceStress = voiceData ? (voiceData.pitch > 1.2 ? 0.8 : 0.3) : 0;
    const facialFear = faceData ? (faceData.fear || 0) : 0;
    const behaviorScore = behaviorData ? (behaviorData.anomaly ? 0.7 : 0.2) : 0;
    
    const overallScore = 
      (voiceStress * 0.4) +
      (facialFear * 0.3) +
      (behaviorScore * 0.2) +
      0.1; // environmental factors
    
    const indicators = {
      voiceStress,
      facialExpression: {
        fear: facialFear,
        anxiety: 0,
        normal: 1 - facialFear
      },
      behaviorScore,
      environmentalFactors: {
        unusualLocation: false,
        unusualTime: false,
        rapidActions: false
      },
      overallScore
    };
    
    res.json({
      success: true,
      indicators,
      duressDetected: overallScore >= 0.65
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/guardian/events
 * Get emergency events
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.get('/events', requireAuth, (req, res) => {
  try {
    // في الإنتاج: جلب من قاعدة البيانات
    res.json({
      success: true,
      events: [],
      count: 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;


