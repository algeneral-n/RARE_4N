/**
 * RARE 4N - GPT Realtime Streaming Routes
 * WebSocket endpoint للـ GPT Realtime Streaming
 */

import express from 'express';
import axios from 'axios';
import { validateOpenAIKey } from '../services/apiKeyValidator.js';

const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    success: true,
    streaming: true,
    model: 'gpt-4o',
  });
});

/**
 * Initialize GPT Streaming WebSocket
 */
export function initializeGPTStreaming(io) {
  const gptNamespace = io.of('/gpt/stream');

  gptNamespace.on('connection', (socket) => {
    console.log('✅ GPT Stream client connected:', socket.id);

    socket.on('message', async (data) => {
      try {
        // ✅ Input validation
        if (!data || typeof data !== 'object') {
          socket.emit('error', { 
            error: 'Invalid request: data must be an object',
            code: 'INVALID_INPUT'
          });
          return;
        }

        const { message } = data;

        if (!message || typeof message !== 'string' || message.trim() === '') {
          socket.emit('error', { 
            error: 'Message is required and must be a non-empty string',
            code: 'MISSING_MESSAGE'
          });
          return;
        }

        // ✅ API key validation
        const keyValidation = validateOpenAIKey();
        if (!keyValidation.valid) {
          socket.emit('error', { 
            error: keyValidation.error,
            code: 'API_KEY_ERROR'
          });
          return;
        }

        const OPENAI_API_KEY = keyValidation.key;

        // Stream response from OpenAI
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'You are RARE, an advanced AI assistant. Respond in Arabic when the user writes in Arabic.',
              },
              {
                role: 'user',
                content: message,
              },
            ],
            stream: true,
            temperature: 0.7,
            max_tokens: 2000,
          },
          {
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            responseType: 'stream',
          }
        );

        let fullText = '';

        response.data.on('data', (chunk) => {
          const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                socket.emit('done', { fullText });
                return;
              }

              try {
                const json = JSON.parse(data);
                const token = json.choices[0]?.delta?.content || '';
                
                if (token) {
                  fullText += token;
                  socket.emit('token', { token });
                }
              } catch (error) {
                // Skip invalid JSON
              }
            }
          }
        });

        response.data.on('end', () => {
          socket.emit('done', { fullText });
        });

        response.data.on('error', (error) => {
          console.error('[GPT Stream] Response stream error:', error);
          socket.emit('error', { 
            error: error.message || 'Stream error occurred',
            code: 'STREAM_ERROR'
          });
        });

      } catch (error) {
        console.error('[GPT Stream] Request error:', error);
        
        // ✅ Comprehensive error handling
        let errorMessage = 'An error occurred while processing your request';
        let errorCode = 'UNKNOWN_ERROR';
        
        if (error.response) {
          // API error response
          errorMessage = error.response.data?.error?.message || `API Error: ${error.response.status}`;
          errorCode = `API_ERROR_${error.response.status}`;
        } else if (error.request) {
          // Request made but no response
          errorMessage = 'No response from OpenAI API. Please check your connection.';
          errorCode = 'NO_RESPONSE';
        } else if (error.message) {
          errorMessage = error.message;
          errorCode = 'REQUEST_ERROR';
        }
        
        socket.emit('error', { 
          error: errorMessage,
          code: errorCode
        });
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ GPT Stream client disconnected:', socket.id);
    });
  });
}

export default router;
