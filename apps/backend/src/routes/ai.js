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

/**
 * Generate Project from Description
 * POST /api/ai/generate-project
 * ✅ Wrapper endpoint for Portal - generates project structure from description
 */
router.post('/generate-project',
  requireAuth,
  aiLimiter,
  async (req, res) => {
    try {
      const userId = req.userId;
      const { description, projectType = 'web', framework = 'react' } = req.body;

      if (!description) {
        return res.status(400).json({
          success: false,
          error: 'Description is required',
        });
      }

      // Use AI chat to generate project structure
      const prompt = `Create a ${projectType} project using ${framework} based on this description: ${description}. 
      Provide a detailed project structure with:
      1. Project name
      2. Main features
      3. File structure
      4. Dependencies
      5. Implementation steps`;

      const response = await AI.chat(prompt, 'gpt', 'gpt-4o-mini', userId);

      res.json({
        success: true,
        project: {
          name: extractProjectName(response.reply),
          description,
          type: projectType,
          framework,
          structure: response.reply,
        },
        model: response.model,
        usage: response.usage,
      });
    } catch (error) {
      console.error('Generate project error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate project',
        message: error.message,
      });
    }
  }
);

/**
 * Analyze Image (Wrapper for Vision AI)
 * POST /api/ai/analyze-image
 * ✅ Wrapper endpoint for Portal - redirects to vision-ai service
 */
router.post('/analyze-image',
  requireAuth,
  async (req, res) => {
    try {
      // Import vision service dynamically
      const visionService = await import('../services/visionService.js').then(m => m.default);
      
      const { imageUrl, imageBase64, features } = req.body;

      if (!imageUrl && !imageBase64) {
        return res.status(400).json({
          success: false,
          error: 'Image URL or base64 image is required',
        });
      }

      const imageSource = imageUrl || imageBase64;
      const analysisFeatures = features || ['all'];

      const result = await visionService.analyzeImage(imageSource, analysisFeatures);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error('Image analysis error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to analyze image',
        message: error.message,
      });
    }
  }
);

/**
 * Voice to Text (Wrapper for Voice Service)
 * POST /api/ai/voice-to-text
 * ✅ Wrapper endpoint for Portal - uses /api/voice/transcribe internally
 */
router.post('/voice-to-text',
  requireAuth,
  async (req, res) => {
    try {
      const { audioUrl, audioBase64, language = 'auto' } = req.body;

      if (!audioUrl && !audioBase64) {
        return res.status(400).json({
          success: false,
          error: 'Audio URL or base64 audio is required',
        });
      }

      // Use OpenAI Whisper directly (same as /api/voice/transcribe)
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      let audioBuffer;
      if (audioBase64) {
        // Remove data URL prefix if present
        const base64Data = audioBase64.includes(',') 
          ? audioBase64.split(',')[1] 
          : audioBase64;
        audioBuffer = Buffer.from(base64Data, 'base64');
      } else if (audioUrl) {
        // Download audio from URL
        const axios = (await import('axios')).default;
        const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
        audioBuffer = Buffer.from(response.data);
      }

      // Create temporary file
      const fs = (await import('fs')).default;
      const path = (await import('path')).default;
      const tempDir = path.join(process.cwd(), 'server/generated/audio');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      const tempFile = path.join(tempDir, `temp_${Date.now()}.m4a`);
      fs.writeFileSync(tempFile, audioBuffer);

      try {
        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(tempFile),
          model: 'whisper-1',
          language: language === 'auto' ? undefined : language,
          response_format: 'text'
        });

        fs.unlinkSync(tempFile);

        res.json({
          success: true,
          transcription: transcription,
          text: transcription, // Alias for compatibility
          language: language,
        });
      } catch (whisperError) {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        throw whisperError;
      }
    } catch (error) {
      console.error('Voice to text error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to transcribe audio',
        message: error.message,
      });
    }
  }
);

// Helper function to extract project name from AI response
function extractProjectName(aiResponse) {
  const nameMatch = aiResponse.match(/Project Name[:\s]+([^\n]+)/i) ||
                    aiResponse.match(/Name[:\s]+([^\n]+)/i);
  return nameMatch ? nameMatch[1].trim() : 'Generated Project';
}

export default router;









