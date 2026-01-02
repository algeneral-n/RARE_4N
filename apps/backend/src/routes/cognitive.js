/**
 * ABO ZIEN - Cognitive Routes
 * Cognitive Loop interactions and learning
 */

import express from 'express';
import { getDatabase, DB } from '../database/localDB.js';
import { requireAuth } from '../middleware/userIsolation.js';

const router = express.Router();

/**
 * Get user ID from request (now uses requireAuth middleware)
 * ✅ SECURITY: User ID comes from authenticated session
 */
function getUserId(req) {
  // req.userId is set by requireAuth middleware
  if (!req.userId) {
    throw new Error('User ID not found - authentication required');
  }
  return req.userId;
}

/**
 * Save cognitive interaction (for learning)
 * POST /api/cognitive/interaction
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/interaction', requireAuth, (req, res) => {
  try {
    const userId = getUserId(req);
    const { input, decision, response, confidence } = req.body;

    if (!input || !decision) {
      return res.status(400).json({ error: 'Input and decision are required' });
    }

    const interactionId = `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    DB.cognitive.create({
      id: interactionId,
      userId,
      input,
      decision,
      response: response || '',
      confidence: confidence || 0.7,
    });

    res.json({
      success: true,
      interactionId,
    });
  } catch (error) {
    console.error('Save interaction error:', error);
    res.status(500).json({ error: 'Failed to save interaction' });
  }
});

/**
 * Get cognitive history
 * GET /api/cognitive/history
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.get('/history', requireAuth, (req, res) => {
  try {
    const userId = getUserId(req);
    const { limit = 100 } = req.query;

    const interactions = DB.cognitive.findByUser(userId, parseInt(limit));

    res.json({
      success: true,
      interactions: interactions.map(interaction => ({
        ...interaction,
        decision: JSON.parse(interaction.decision),
      })),
      count: interactions.length,
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get history' });
  }
});

/**
 * Update context
 * POST /api/cognitive/context
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/context', requireAuth, (req, res) => {
  try {
    const userId = getUserId(req);
    const { contextData } = req.body;

    if (!contextData) {
      return res.status(400).json({ error: 'Context data is required' });
    }

    DB.context.upsert(userId, contextData);

    res.json({
      success: true,
    });
  } catch (error) {
    console.error('Update context error:', error);
    res.status(500).json({ error: 'Failed to update context' });
  }
});

/**
 * Get context
 * GET /api/cognitive/context
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.get('/context', requireAuth, (req, res) => {
  try {
    const userId = getUserId(req);
    const context = DB.context.findByUser(userId);

    res.json({
      success: true,
      context: context ? context.context_data : null,
    });
  } catch (error) {
    console.error('Get context error:', error);
    res.status(500).json({ error: 'Failed to get context' });
  }
});

export default router;









