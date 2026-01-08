/**
 * RARE 4N - Vision Routes (Portal alias)
 * Portal-compatible vision endpoints
 */

import express from 'express';
import { requirePortalAuth } from '../middleware/portalAuth.js';
import visionService from '../services/visionService.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const upload = multer({ 
  dest: path.join(__dirname, '../../uploads/vision'),
  limits: { fileSize: 20 * 1024 * 1024 }
});

/**
 * POST /api/vision/analyze
 * Analyze image (Portal alias for /api/vision-ai/analyze)
 * Portal endpoint - uses Portal Auth
 */
router.post('/analyze', requirePortalAuth, upload.single('image'), async (req, res) => {
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
        error: 'Image source is required (file, imageUrl, or imageBase64)',
      });
    }

    const features = req.body.features ? 
      (Array.isArray(req.body.features) ? req.body.features : req.body.features.split(',')) : 
      ['all'];

    const result = await visionService.analyzeImage(imageSource, features);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Vision analyze error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze image',
    });
  }
});

export default router;
