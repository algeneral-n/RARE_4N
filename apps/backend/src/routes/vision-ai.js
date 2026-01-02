/**
 * RARE 4N - Vision AI Routes
 * Google Vision API integration for image analysis
 */

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import visionService from '../services/visionService.js';

const router = express.Router();

const upload = multer({ 
  dest: 'server/uploads/',
  limits: { fileSize: 20 * 1024 * 1024 }
});

/**
 * POST /api/vision-ai/analyze
 * Full image analysis with all features
 */
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    let imageSource;

    if (req.file) {
      imageSource = req.file.path;
    } else if (req.body.imageUrl) {
      imageSource = req.body.imageUrl;
    } else if (req.body.imageBase64) {
      imageSource = req.body.imageBase64;
    } else {
      return res.status(400).json({
        success: false,
        error: 'يجب توفير صورة للتحليل'
      });
    }

    const features = req.body.features ? 
      (Array.isArray(req.body.features) ? req.body.features : req.body.features.split(',')) : 
      ['all'];

    console.log('🔍 Analyzing image with features:', features);
    
    const result = await visionService.analyzeImage(imageSource, features);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/vision-ai/ocr
 * Text detection (OCR)
 */
router.post('/ocr', upload.single('image'), async (req, res) => {
  try {
    let imageSource;

    if (req.file) {
      imageSource = req.file.path;
    } else if (req.body.imageUrl) {
      imageSource = req.body.imageUrl;
    } else {
      return res.status(400).json({
        success: false,
        error: 'يجب توفير صورة'
      });
    }

    console.log('📝 Detecting text in image...');
    
    const result = await visionService.detectText(imageSource);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/vision-ai/objects
 * Object detection
 */
router.post('/objects', upload.single('image'), async (req, res) => {
  try {
    let imageSource;

    if (req.file) {
      imageSource = req.file.path;
    } else if (req.body.imageUrl) {
      imageSource = req.body.imageUrl;
    } else {
      return res.status(400).json({
        success: false,
        error: 'يجب توفير صورة'
      });
    }

    console.log('🎯 Detecting objects...');
    
    const result = await visionService.detectObjects(imageSource);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/vision-ai/faces
 * Face detection
 */
router.post('/faces', upload.single('image'), async (req, res) => {
  try {
    let imageSource;

    if (req.file) {
      imageSource = req.file.path;
    } else if (req.body.imageUrl) {
      imageSource = req.body.imageUrl;
    } else {
      return res.status(400).json({
        success: false,
        error: 'يجب توفير صورة'
      });
    }

    console.log('😊 Detecting faces...');
    
    const result = await visionService.detectFaces(imageSource);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/vision-ai/safety
 * Safety check
 */
router.post('/safety', upload.single('image'), async (req, res) => {
  try {
    let imageSource;

    if (req.file) {
      imageSource = req.file.path;
    } else if (req.body.imageUrl) {
      imageSource = req.body.imageUrl;
    } else {
      return res.status(400).json({
        success: false,
        error: 'يجب توفير صورة'
      });
    }

    console.log('🛡️ Checking image safety...');
    
    const result = await visionService.checkSafety(imageSource);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/vision-ai/colors
 * Extract dominant colors
 */
router.post('/colors', upload.single('image'), async (req, res) => {
  try {
    let imageSource;

    if (req.file) {
      imageSource = req.file.path;
    } else if (req.body.imageUrl) {
      imageSource = req.body.imageUrl;
    } else {
      return res.status(400).json({
        success: false,
        error: 'يجب توفير صورة'
      });
    }

    console.log('🎨 Extracting colors...');
    
    const result = await visionService.getColors(imageSource);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/vision-ai/features
 * List available analysis features
 */
router.get('/features', (req, res) => {
  res.json({
    success: true,
    features: [
      { id: 'all', name: 'تحليل شامل', nameEn: 'Full Analysis', icon: '🔍' },
      { id: 'labels', name: 'التصنيفات', nameEn: 'Labels', icon: '🏷️' },
      { id: 'text', name: 'النصوص (OCR)', nameEn: 'Text (OCR)', icon: '📝' },
      { id: 'faces', name: 'الوجوه', nameEn: 'Faces', icon: '😊' },
      { id: 'objects', name: 'الكائنات', nameEn: 'Objects', icon: '🎯' },
      { id: 'landmarks', name: 'المعالم', nameEn: 'Landmarks', icon: '🏛️' },
      { id: 'logos', name: 'الشعارات', nameEn: 'Logos', icon: '🏢' },
      { id: 'safe', name: 'فحص الأمان', nameEn: 'Safety', icon: '🛡️' },
      { id: 'colors', name: 'الألوان', nameEn: 'Colors', icon: '🎨' },
      { id: 'web', name: 'بحث الويب', nameEn: 'Web Detection', icon: '🌐' }
    ]
  });
});

/**
 * GET /api/vision-ai/status
 * Check Vision API status
 */
router.get('/status', (req, res) => {
  const configured = !!process.env.GOOGLE_VISION_API_KEY;
  res.json({
    success: true,
    configured,
    status: configured ? 'ready' : 'not_configured',
    message: configured ? 'Google Vision API جاهز' : 'يرجى تكوين GOOGLE_VISION_API_KEY'
  });
});

export default router;
