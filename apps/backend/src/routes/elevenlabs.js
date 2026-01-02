import express from 'express';
import * as agentService from '../services/elevenLabsAgentService.js';
import * as ttsService from '../services/elevenlabsService.js';

const router = express.Router();

// الحصول على إعدادات الأجنت الصوتي رير
router.get('/config', async (req, res) => {
  try {
    const config = await agentService.getAgentConfig();
    res.json(config);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// بدء محادثة جديدة مع بصمة صوت رير
router.post('/convai', async (req, res) => {
  try {
    const { clientName, projectType } = req.body;
    const session = await agentService.createConversation(null, { clientName, projectType });
    res.json(session);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// تحويل النص لصوت (TTS) لدعم الردود الآلية
router.post('/tts', async (req, res) => {
  try {
    const { text, voiceId, language = 'ar' } = req.body;
    const audioData = await ttsService.textToSpeech(text, voiceId, language);
    res.json({ success: true, audio: audioData });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

export default router;