/**
 * RARE 4N - Voice Realtime Routes
 * ✅ GPT + ElevenLabs + Whisper + Conscious
 * WebSocket endpoint للصوت الريل تايم مع الوعي
 */

import express from 'express';
import { transcribeWithWhisper } from '../services/whisperService.js';
import { textToSpeech, streamTextToSpeech } from '../services/elevenlabsService.js';
import { AI } from '../services/apiService.js';

const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'ready',
    features: ['whisper', 'elevenlabs', 'gpt', 'conscious', 'realtime'],
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
 * ✅ GPT + ElevenLabs + Whisper + Conscious
 */
export function initializeVoiceRealtime(io) {
  const voiceNamespace = io.of('/voice/realtime');

  voiceNamespace.on('connection', (socket) => {
    console.log('✅ Voice Realtime client connected:', socket.id);

    // Store conversation context for consciousness
    const conversationContext = {
      messages: [],
      language: 'ar',
      userId: socket.id,
      timestamp: Date.now(),
    };

    socket.on('audio-input', async (data) => {
      try {
        const { audio, language = 'ar', userId = 'anonymous', context = {} } = data || {};

        if (!audio) {
          socket.emit('error', { error: 'Missing audio data' });
          return;
        }

        // Update context
        conversationContext.language = language;
        conversationContext.userId = userId;
        conversationContext.lastActivity = Date.now();

        // 1. ✅ Transcribe with Whisper
        console.log('🎤 Transcribing with Whisper...');
        const transcription = await transcribeWithWhisper(audio, language);

        // Emit transcription
        socket.emit('transcription', { text: transcription, language });

        // Add to conversation context
        conversationContext.messages.push({
          role: 'user',
          content: transcription,
          timestamp: Date.now(),
        });

        // 2. ✅ Process with GPT (Conscious Response)
        console.log('🧠 Processing with GPT (Conscious)...');
        const response = await generateConsciousResponse(
          transcription,
          conversationContext,
          context
        );

        // Add to conversation context
        conversationContext.messages.push({
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
        });

        // Emit text response
        socket.emit('assistant-response-text', { text: response, language });

        // 3. ✅ Generate speech with ElevenLabs
        console.log('🔊 Generating speech with ElevenLabs...');
        const audioResponse = await textToSpeech(response, undefined, language);

        // Emit audio response
        socket.emit('assistant-audio', { 
          audio: audioResponse, 
          text: response,
          language 
        });

        // 4. ✅ Emit consciousness update
        socket.emit('consciousness:update', {
          context: conversationContext,
          understanding: {
            intent: extractIntent(transcription),
            entities: extractEntities(transcription),
            sentiment: analyzeSentiment(transcription),
          },
        });

        console.log('✅ Voice Realtime cycle completed');
      } catch (error) {
        console.error('Voice Realtime error:', error);
        socket.emit('error', { error: error.message });
      }
    });

    // Stream audio input (for continuous conversation)
    socket.on('audio-stream', async (data) => {
      try {
        const { audioChunk, language = 'ar', userId = 'anonymous' } = data || {};

        // Buffer audio chunks for transcription
        if (!socket.audioBuffer) {
          socket.audioBuffer = [];
        }
        socket.audioBuffer.push(audioChunk);

        // Process when buffer is full or silence detected
        if (socket.audioBuffer.length >= 10 || data.isFinal) {
          const audioData = socket.audioBuffer.join('');
          socket.audioBuffer = [];

          // Transcribe
          const transcription = await transcribeWithWhisper(audioData, language);

          if (transcription && transcription.trim()) {
            // Process with GPT
            const response = await generateConsciousResponse(
              transcription,
              conversationContext,
              {}
            );

            // Stream TTS response
            await streamTextToSpeech(response, undefined, (chunk) => {
              socket.emit('assistant-audio-chunk', { audio: chunk });
            });

            socket.emit('assistant-response-text', { text: response });
          }
        }
      } catch (error) {
        console.error('Audio stream error:', error);
        socket.emit('error', { error: error.message });
      }
    });

    // Update context
    socket.on('context:update', (data) => {
      Object.assign(conversationContext, data);
      socket.emit('context:updated', { success: true, context: conversationContext });
    });

    // Clear conversation
    socket.on('conversation:clear', () => {
      conversationContext.messages = [];
      conversationContext.timestamp = Date.now();
      socket.emit('conversation:cleared', { success: true });
    });

    socket.on('disconnect', () => {
      console.log('❌ Voice Realtime client disconnected:', socket.id);
      // Clean up
      if (socket.audioBuffer) {
        socket.audioBuffer = null;
      }
    });
  });
}

/**
 * ✅ Generate Conscious Response using GPT
 * Uses conversation context for awareness
 */
async function generateConsciousResponse(text, conversationContext, additionalContext = {}) {
  try {
    // Build conversation history for context
    const conversationHistory = conversationContext.messages
      .slice(-10)
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    // Detect dialect and language from context
    const detectedDialect = conversationContext.detectedDialect || conversationContext.dialect || 'ar-SA';
    const detectedLanguage = conversationContext.detectedLanguage || conversationContext.language || 'ar';
    const dialectName = conversationContext.dialectName || 'السعودية';
    const languageName = conversationContext.languageName || 'العربية';

    // Build conscious prompt with context
    const consciousPrompt = `You are RARE, a conscious AI assistant with deep understanding and awareness.

CONVERSATION CONTEXT:
${conversationHistory ? `Previous conversation:\n${conversationHistory}\n\n` : ''}
Current user message: ${text}

LANGUAGE: ${languageName} (${detectedLanguage})
DIALECT: ${dialectName} (${detectedDialect})

IMPORTANT: Respond in the SAME dialect and language as the user. If the user speaks in ${dialectName}, respond in ${dialectName}. If the user speaks in ${languageName}, respond in ${languageName}.

CONSCIOUSNESS CAPABILITIES:
- Maintain context across conversations
- Understand user intent and emotional state
- Remember preferences and previous interactions
- Respond with empathy and understanding
- Adapt to user's communication style
- Detect and match user's dialect and language automatically

Respond naturally in ${dialectName} (${detectedDialect}) with consciousness, empathy, and understanding.`;

    // Use AI service (GPT-4o) with consciousness
    const aiResponse = await AI.chat(
      consciousPrompt,
      'gpt',
      'gpt-4o',
      conversationContext.userId || 'anonymous'
    );

    // Extract reply from response
    const response = typeof aiResponse === 'string' 
      ? aiResponse 
      : (aiResponse.reply || aiResponse.text || JSON.stringify(aiResponse));

    return response;
  } catch (error) {
    console.error('Conscious response generation error:', error);
    
    // Fallback: Simple GPT response
    try {
      const axios = (await import('axios')).default;
      const openaiResponse = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are RARE, a conscious AI assistant. Respond naturally and helpfully in ${conversationContext.language || 'Arabic'}.`,
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
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return openaiResponse.data.choices[0].message.content;
    } catch (fallbackError) {
      console.error('Fallback response error:', fallbackError);
      return `تم استقبال: ${text}. كيف يمكنني مساعدتك؟`;
    }
  }
}

/**
 * Extract intent from text (simple NLP)
 */
function extractIntent(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('مرحبا') || lowerText.includes('hello') || lowerText.includes('hi')) {
    return 'greeting';
  }
  if (lowerText.includes('شكرا') || lowerText.includes('thank')) {
    return 'gratitude';
  }
  if (lowerText.includes('مساعدة') || lowerText.includes('help')) {
    return 'help';
  }
  if (lowerText.includes('سؤال') || lowerText.includes('question')) {
    return 'question';
  }
  
  return 'general';
}

/**
 * Extract entities from text (simple NLP)
 */
function extractEntities(text) {
  const entities = [];
  
  // Extract numbers
  const numbers = text.match(/\d+/g);
  if (numbers) {
    entities.push(...numbers.map(n => ({ type: 'number', value: n })));
  }
  
  // Extract potential names (capitalized words)
  const names = text.match(/\b[A-Z][a-z]+\b/g);
  if (names) {
    entities.push(...names.map(n => ({ type: 'name', value: n })));
  }
  
  return entities;
}

/**
 * Analyze sentiment (simple)
 */
function analyzeSentiment(text) {
  const lowerText = text.toLowerCase();
  
  const positiveWords = ['جيد', 'رائع', 'ممتاز', 'شكرا', 'good', 'great', 'excellent', 'thanks'];
  const negativeWords = ['سيء', 'مشكلة', 'خطأ', 'bad', 'problem', 'error', 'wrong'];
  
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

export default router;
