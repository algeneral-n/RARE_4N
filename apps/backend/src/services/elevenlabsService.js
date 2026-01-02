/**
 * RARE 4N - ElevenLabs Service
 * Text-to-Speech with ElevenLabs
 */

import axios from 'axios';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

const VOICES = {
  'ar-male': 'IES4nrmZdUBHByLBde0P',
  'ar-female': '21m00Tcm4TlvDq8ikWAM',
  'en-male': 'pNInz6obpgDQGcFmaJgB',
  'en-female': 'EXAVITQu4vr4xnSDxMaL',
  'default': 'IES4nrmZdUBHByLBde0P',
};

export async function textToSpeech(text, voiceId, language = 'ar') {
  try {
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not configured');
    }

    const selectedVoice = voiceId || VOICES[`${language}-male`] || VOICES.default;

    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${selectedVoice}`,
      {
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        responseType: 'arraybuffer',
      }
    );

    const audioBase64 = Buffer.from(response.data).toString('base64');
    return `data:audio/mpeg;base64,${audioBase64}`;
  } catch (error) {
    console.error('ElevenLabs TTS error:', error.response?.data || error.message);
    throw error;
  }
}

export async function getVoices() {
  try {
    if (!ELEVENLABS_API_KEY) {
      return Object.entries(VOICES).map(([key, id]) => ({
        voice_id: id,
        name: key,
      }));
    }

    const response = await axios.get(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    });

    return response.data.voices || [];
  } catch (error) {
    console.error('Get voices error:', error);
    return Object.entries(VOICES).map(([key, id]) => ({
      voice_id: id,
      name: key,
    }));
  }
}

export async function streamTextToSpeech(text, voiceId, onChunk) {
  try {
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not configured');
    }

    const selectedVoice = voiceId || VOICES.default;

    const response = await axios.post(
      `${ELEVENLABS_API_URL}/text-to-speech/${selectedVoice}/stream`,
      {
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        responseType: 'stream',
      }
    );

    return new Promise((resolve, reject) => {
      const chunks = [];

      response.data.on('data', (chunk) => {
        chunks.push(chunk);
        if (onChunk) onChunk(chunk);
      });

      response.data.on('end', () => {
        const audioBuffer = Buffer.concat(chunks);
        const audioBase64 = audioBuffer.toString('base64');
        resolve(`data:audio/mpeg;base64,${audioBase64}`);
      });

      response.data.on('error', reject);
    });
  } catch (error) {
    console.error('Stream TTS error:', error);
    throw error;
  }
}

export default {
  textToSpeech,
  getVoices,
  streamTextToSpeech,
  VOICES,
};
