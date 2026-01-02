import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
// تم تبسيط الاستيراد لضمان التوافق مع ملف visionService.js الموجود عندك
import * as visionService from '../services/visionService.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const upload = multer({ dest: path.join(__dirname, '../../uploads/vision') });

router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image required' });
    // استخدام التحليل الشامل المتاح
    const result = await visionService.analyzeImage(req.file.path);
    res.json({ success: true, result });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/safe-search', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image required' });
    // التأكد من استدعاء الوظيفة الصحيحة من السيرفس
    const result = await visionService.analyzeImage(req.file.path, ['SAFE_SEARCH_DETECTION']);
    res.json({ success: true, result });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

export default router;