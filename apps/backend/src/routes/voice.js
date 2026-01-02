/**
 * RARE 4N - Voice Routes
 * HTTP API endpoints for voice transcription and synthesis
 */

import express from 'express';
import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const OUTPUT_DIR = path.join(process.cwd(), 'server/generated/audio');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * POST /api/voice/transcribe
 * Transcribe audio using Whisper
 */
router.post('/transcribe', async (req, res) => {
  try {
    const { audio, language = 'ar' } = req.body;

    if (!audio) {
      return res.status(400).json({
        success: false,
        error: 'Audio data is required'
      });
    }

    const audioBuffer = Buffer.from(audio, 'base64');
    const tempFile = path.join(OUTPUT_DIR, `temp_${Date.now()}.m4a`);
    fs.writeFileSync(tempFile, audioBuffer);

    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFile),
        model: 'whisper-1',
        language: language === 'ar' ? 'ar' : language,
        response_format: 'text'
      });

      fs.unlinkSync(tempFile);

      res.json({
        success: true,
        text: transcription,
        language
      });
    } catch (whisperError) {
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      throw whisperError;
    }
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/voice/synthesize
 * Text-to-speech using ElevenLabs
 */
router.post('/synthesize', async (req, res) => {
  try {
    const { text, voiceId = 'IES4nrmZdUBHByLBde0P' } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required'
      });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'ElevenLabs API key not configured'
      });
    }

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        responseType: 'arraybuffer'
      }
    );

    const filename = `speech_${Date.now()}.mp3`;
    const filePath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filePath, response.data);

    const base64Audio = Buffer.from(response.data).toString('base64');

    res.json({
      success: true,
      audio: base64Audio,
      audioUrl: `/api/voice/audio/${filename}`,
      filename,
      voiceId
    });
  } catch (error) {
    console.error('Synthesis error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/voice/audio/:filename
 * Download synthesized audio file
 */
router.get('/audio/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(OUTPUT_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Audio file not found'
      });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/voice/voices
 * List available ElevenLabs voices
 */
router.get('/voices', async (req, res) => {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return res.json({
        success: true,
        voices: [
          { id: '9401kb2n0gf5e2wtp4sfs8chdmk1', name: 'RARE Voice', language: 'ar' },
          { id: '6ZVgc4q9LWAloWbuwjuu', name: 'Voice 2', language: 'ar' },
        ]
      });
    }

    const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': apiKey }
    });

    res.json({
      success: true,
      voices: response.data.voices.map(v => ({
        id: v.voice_id,
        name: v.name,
        language: v.labels?.language || 'multilingual'
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
