/**
 * RARE 4N - Voice Realtime Routes
 * WebSocket endpoint للصوت الريل تايم
 */

import express from 'express';
import { transcribeWithWhisper } from '../services/whisperService.js';
import { textToSpeech } from '../services/elevenlabsService.js';

const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'ready',
    features: ['whisper', 'elevenlabs', 'realtime'],
  });
});

router.post('/transcribe', async (req, res) => {
  try {
    const { audio, language = 'ar' } = req.body;
    if (!audio) {
      return res.status(400).json({ error: 'Audio is required' });
    }
    const text = await transcribeWithWhisper(audio, language);
    res.json({ success: true, text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/speak', async (req, res) => {
  try {
    const { text, voiceId, language = 'ar' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    const audio = await textToSpeech(text, voiceId, language);
    res.json({ success: true, audio });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Initialize Voice Realtime WebSocket
 */
export function initializeVoiceRealtime(io) {
  const voiceNamespace = io.of('/voice/realtime');

  voiceNamespace.on('connection', (socket) => {
    console.log('✅ Voice Realtime client connected:', socket.id);

    socket.on('audio-input', async (data) => {
      try {
        const { audio, language = 'ar' } = data || {};

        if (!audio) {
          socket.emit('error', { error: 'Missing audio data' });
          return;
        }

        // 1. Transcribe with Whisper
        const transcription = await transcribeWithWhisper(audio, language);

        // Emit transcription
        socket.emit('transcription', { text: transcription });

        // 2. Process with Cognitive Loop (conceptual)
        // In production, this would go through RAREKernel
        const response = await generateResponse(transcription);

        // Emit text response
        socket.emit('assistant-response-text', { text: response });

        // 3. Generate speech with ElevenLabs
        const audioResponse = await textToSpeech(response, undefined, language);

        // Emit audio response
        socket.emit('assistant-audio', { audio: audioResponse });
      } catch (error) {
        console.error('Voice Realtime error:', error);
        socket.emit('error', { error: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Voice Realtime client disconnected:', socket.id);
    });
  });
}


/**
 * Generate response using AI (GPT-4/Claude)
 * ✅ Uses AI service for intelligent responses
 */
async function generateResponse(text) {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
    
    // Use OpenAI GPT-4 by default, fallback to Claude
    const apiKey = OPENAI_API_KEY || ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('No AI API key configured');
    }

    // Use OpenAI if available
    if (OPENAI_API_KEY) {
      const axios = (await import('axios')).default;
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are RARE, an intelligent AI assistant. Respond naturally and helpfully in Arabic or the user\'s language.',
            },
            {
              role: 'user',
              content: text,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.choices[0].message.content;
    }

    // Fallback to Claude
    if (ANTHROPIC_API_KEY) {
      const axios = (await import('axios')).default;
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-opus-20240229',
          max_tokens: 500,
          messages: [
            {
              role: 'user',
              content: text,
            },
          ],
        },
        {
          headers: {
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.content[0].text;
    }

    throw new Error('No AI service available');
  } catch (error) {
    console.error('Response generation error:', error);
    return `تم استقبال: ${text}. كيف يمكنني مساعدتك؟`;
  }
}

export default router;
