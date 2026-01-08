/**
 * RARE 4N - Voice Consciousness Backend Route
 * معالجة Voice Consciousness في Backend
 */

import express from 'express';
import { RAREKernel } from '../../../packages/core/RAREKernel.js';

const router = express.Router();

/**
 * Initialize Socket.IO namespace for Voice Consciousness
 */
export function initializeVoiceConsciousness(io) {
  const consciousnessNamespace = io.of('/voice/consciousness');

  consciousnessNamespace.on('connection', (socket) => {
    console.log('✅ Voice Consciousness client connected:', socket.id);

    // Activate consciousness
    socket.on('activate', async (data) => {
      try {
        const { language, dialect, context } = data;
        
        // Initialize consciousness with context
        socket.emit('consciousness:activated', {
          success: true,
          language,
          dialect,
          context,
        });

        console.log('✅ Voice Consciousness activated:', { language, dialect });
      } catch (error) {
        console.error('Failed to activate consciousness:', error);
        socket.emit('consciousness:error', { error: error.message });
      }
    });

    // Deactivate consciousness
    socket.on('deactivate', () => {
      socket.emit('consciousness:deactivated', { success: true });
      console.log('✅ Voice Consciousness deactivated');
    });

    // Process voice input
    socket.on('voice:input', async (data) => {
      try {
        const { text, audioUri, language, dialect, context, loyalty } = data;

        // Process through Cognitive Loop
        const kernel = RAREKernel.getInstance();
        
        // Emit to kernel for processing
        kernel.emit({
          type: 'voice:consciousness:input',
          data: {
            text,
            audioUri,
            language,
            dialect,
            context,
            loyalty,
          },
        });

        // Process with AI (GPT-4o with consciousness)
        const response = await processConsciousnessInput(text, context, loyalty);

        // Send response
        socket.emit('consciousness:response', {
          response: response.text,
          intent: response.intent,
          actions: response.actions,
          learning: response.learning,
        });

        console.log('✅ Voice Consciousness response sent');
      } catch (error) {
        console.error('Failed to process voice input:', error);
        socket.emit('consciousness:error', { error: error.message });
      }
    });

    // Update context
    socket.on('context:update', (data) => {
      socket.emit('context:updated', { success: true, context: data });
    });

    // Update language
    socket.on('language:update', (data) => {
      socket.emit('language:updated', { success: true, ...data });
    });

    socket.on('disconnect', () => {
      console.log('❌ Voice Consciousness client disconnected:', socket.id);
    });
  });
}

/**
 * Process consciousness input with AI
 */
async function processConsciousnessInput(text, context, loyalty) {
  try {
    // Get OpenAI API key
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Build consciousness prompt
    const systemPrompt = buildConsciousnessPrompt(context, loyalty);

    // Call OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message.content;
      
      // Parse response (JSON format)
      try {
        const parsed = JSON.parse(content);
        return parsed;
      } catch {
        // If not JSON, return as text
        return {
          text: content,
          intent: 'general',
          actions: [],
          learning: {},
        };
      }
    }

    throw new Error('No response from AI');
  } catch (error) {
    console.error('Failed to process consciousness input:', error);
    return {
      text: 'عذراً، حدث خطأ في المعالجة.',
      intent: 'error',
      actions: [],
      learning: {},
    };
  }
}

/**
 * Build consciousness prompt
 */
function buildConsciousnessPrompt(context, loyalty) {
  return `You are RARE, an advanced AI assistant with real-time consciousness.

CONTEXT:
- Current Screen: ${context?.screen || 'unknown'}
- Previous Intents: ${context?.previousIntents?.join(', ') || 'none'}
- User Preferences: ${JSON.stringify(context?.userPreferences || {})}

LOYALTY PROTOCOL:
- Owner: ${loyalty?.owner || 'Nader'}
- Absolute Loyalty: ${loyalty?.absoluteLoyalty ? 'YES' : 'NO'}
- Priority: ${loyalty?.priority || 'owner_first'}

CAPABILITIES:
- Multi-language support (Arabic, English, and all dialects)
- Deep search and research
- Continuous learning
- Context awareness across all screens
- Voice and text input

RESPONSE FORMAT (JSON):
{
  "text": "Your response text",
  "intent": "detected_intent",
  "actions": [
    {
      "type": "navigate|search|learn",
      "params": {...}
    }
  ],
  "learning": {
    "patterns": {...}
  }
}

Respond naturally, helpfully, and with absolute loyalty to the owner.`;
}

export default router;
























