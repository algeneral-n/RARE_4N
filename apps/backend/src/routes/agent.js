/**
 * RARE 4N - ElevenLabs Agent Routes
 * AI Voice Agent for client communication
 */

import express from 'express';
import elevenLabsAgentService from '../services/elevenLabsAgentService.js';

const router = express.Router();

/**
 * GET /api/agent/status
 * Get agent status
 */
router.get('/status', async (req, res) => {
  try {
    const status = await elevenLabsAgentService.getAgentStatus();
    res.json({
      success: true,
      ...status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agent/conversation
 * Create new conversation session
 */
router.post('/conversation', async (req, res) => {
  try {
    const { agentId, context = {} } = req.body;

    const result = await elevenLabsAgentService.createConversation(agentId, context);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agent/message
 * Send message to agent
 */
router.post('/message', async (req, res) => {
  try {
    const { conversationId, message, voiceResponse = true } = req.body;

    if (!conversationId || !message) {
      return res.status(400).json({
        success: false,
        error: 'معرف المحادثة والرسالة مطلوبان'
      });
    }

    const result = await elevenLabsAgentService.sendMessage(conversationId, message, voiceResponse);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agent/inquiry
 * Handle client inquiry with fallback
 */
router.post('/inquiry', async (req, res) => {
  try {
    const { inquiry, context = {} } = req.body;

    if (!inquiry) {
      return res.status(400).json({
        success: false,
        error: 'الاستفسار مطلوب'
      });
    }

    console.log('💬 Processing inquiry:', inquiry.substring(0, 50));

    const result = await elevenLabsAgentService.handleInquiry(inquiry, context);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agent/greet
 * Greet client with voice
 */
router.post('/greet', async (req, res) => {
  try {
    const { clientName, language = 'ar' } = req.body;

    if (!clientName) {
      return res.status(400).json({
        success: false,
        error: 'اسم العميل مطلوب'
      });
    }

    const result = await elevenLabsAgentService.greetClient(clientName, language);

    if (result.success && result.audio) {
      res.set('Content-Type', 'audio/mpeg');
      res.send(Buffer.from(result.audio));
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agent/announce
 * Announce project update
 */
router.post('/announce', async (req, res) => {
  try {
    const { clientName, projectName, status, language = 'ar' } = req.body;

    if (!clientName || !projectName || !status) {
      return res.status(400).json({
        success: false,
        error: 'بيانات الإعلان غير مكتملة'
      });
    }

    const result = await elevenLabsAgentService.announceUpdate(clientName, projectName, status, language);

    if (result.success && result.audio) {
      res.set('Content-Type', 'audio/mpeg');
      res.send(Buffer.from(result.audio));
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agent/tts
 * Text to Speech
 */
router.post('/tts', async (req, res) => {
  try {
    const { text, voiceId } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'النص مطلوب'
      });
    }

    const result = await elevenLabsAgentService.textToSpeech(text, voiceId);

    if (result.success && result.audio) {
      res.set('Content-Type', 'audio/mpeg');
      res.send(Buffer.from(result.audio));
    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/agent/voices
 * Get available voices
 */
router.get('/voices', async (req, res) => {
  try {
    const result = await elevenLabsAgentService.getVoices();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/agent/config/:agentId
 * Get agent configuration
 */
router.get('/config/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const result = await elevenLabsAgentService.getAgentConfig(agentId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agent/tool-call
 * Handle tool calls from ElevenLabs Agent
 */
router.post('/tool-call', async (req, res) => {
  try {
    const { toolName, parameters, context = {} } = req.body;
    
    if (!toolName) {
      return res.status(400).json({
        success: false,
        error: 'اسم الـ tool مطلوب'
      });
    }
    
    const { default: agentToolsWebhook } = await import('../services/agentToolsWebhook.js');
    const io = req.app.get('io');
    
    const result = await agentToolsWebhook.handleAgentToolCall(toolName, parameters, {
      ...context,
      io
    });
    
    res.json(result);
  } catch (error) {
    console.error('Tool call error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/agent/command
 * إرسال أمر من المالك للـ Agent
 */
router.post('/command', async (req, res) => {
  try {
    const { command, type = 'owner_instruction', timestamp } = req.body;

    if (!command || typeof command !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Command is required and must be a string'
      });
    }

    // إرسال الأمر للـ Agent عبر Client Portal Socket.IO
    const io = req.app.get('io') || global.io;
    if (io) {
      io.of('/client-portal').emit('owner:command', {
        command,
        type,
        timestamp: timestamp || new Date().toISOString(),
        source: 'control-room',
      });
    }

    res.json({
      success: true,
      message: 'Command sent to agent successfully',
      command,
    });
  } catch (error) {
    console.error('Agent command error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send command to agent'
    });
  }
});

export default router;
