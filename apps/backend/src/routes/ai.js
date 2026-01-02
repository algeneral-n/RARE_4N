/**
 * ABO ZIEN - AI Routes
 * Local AI service with GPT, Gemini, Claude
 */

import express from 'express';
import { AI } from '../services/apiService.js';
import { requireAuth } from '../middleware/userIsolation.js';
import { validate, schemas } from '../middleware/validation.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * Chat with AI
 * POST /api/ai/chat
 * ✅ SECURITY: Protected with requireAuth, validation, and rate limiting
 */
router.post('/chat', 
  requireAuth,
  aiLimiter,
  validate(schemas.chat),
  async (req, res) => {
  try {
    const userId = req.userId; // From requireAuth middleware
    const { message, aiModel = 'gpt', openaiModel = null } = req.body;

    // ✅ Use free daily usage models
    // openaiModel can be: 'gpt-4o-mini' (2.5M tokens/day free) or 'gpt-4o' (250K tokens/day free)
    // ✅ SECURITY: Pass userId for cost tracking
    const response = await AI.chat(message, aiModel, openaiModel, userId);

    res.json({
      success: true,
      reply: response.reply,
      model: response.model,
      usage: response.usage,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      error: 'AI service error',
      message: error.message,
    });
  }
});

export default router;









