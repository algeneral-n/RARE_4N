/**
 * RARE 4N - Whisper Service
 * OpenAI Whisper for Speech-to-Text
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

export async function transcribeWithWhisper(audioData, language = 'ar') {
  try {
    let audioFile;
    let tempFilePath = null;

    if (typeof audioData === 'string' && audioData.startsWith('data:')) {
      const base64Data = audioData.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      
      tempFilePath = path.join(__dirname, `../../temp/audio_${Date.now()}.webm`);
      
      const tempDir = path.dirname(tempFilePath);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      fs.writeFileSync(tempFilePath, buffer);
      audioFile = fs.createReadStream(tempFilePath);
    } else if (audioData instanceof Buffer) {
      tempFilePath = path.join(__dirname, `../../temp/audio_${Date.now()}.webm`);
      
      const tempDir = path.dirname(tempFilePath);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      fs.writeFileSync(tempFilePath, audioData);
      audioFile = fs.createReadStream(tempFilePath);
    } else if (typeof audioData === 'string' && fs.existsSync(audioData)) {
      audioFile = fs.createReadStream(audioData);
      tempFilePath = null;
    } else {
      throw new Error('Invalid audio data format');
    }

    if (!openai || !OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: language,
      response_format: 'text',
    });

    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    return transcription;
  } catch (error) {
    console.error('Whisper transcription error:', error);
    throw error;
  }
}

export async function transcribeAudioFile(filePath, language = 'ar') {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Audio file not found: ${filePath}`);
    }

    if (!openai || !OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const audioFile = fs.createReadStream(filePath);

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: language,
      response_format: 'json',
    });

    return {
      text: transcription.text,
      language: language,
    };
  } catch (error) {
    console.error('Audio file transcription error:', error);
    throw error;
  }
}

export default {
  transcribeWithWhisper,
  transcribeAudioFile,
};
