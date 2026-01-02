/**
 * RARE 4N - File Generator Routes
 * GPT-powered file generation for all types
 */

import express from 'express';
import fileGeneratorService from '../services/fileGeneratorService.js';
import { requireAuth } from '../middleware/userIsolation.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { DB } from '../database/localDB.js';

const router = express.Router();

// Import encryption functions (same as vault)
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const MASTER_KEY = process.env.RARE_MASTER_KEY || crypto.randomBytes(32).toString('hex');
const SALT = process.env.RARE_ENCRYPTION_SALT || crypto.randomBytes(16).toString('hex');

function deriveKey(masterKey, salt) {
  return crypto.pbkdf2Sync(masterKey, salt, 100000, 32, 'sha256');
}

function encryptData(data, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return { encrypted, iv: iv.toString('hex'), authTag: authTag.toString('hex') };
}

function getFileCategory(fileType) {
  if (!fileType) return 'other';
  const type = fileType.toLowerCase();
  if (type.includes('image')) return 'images';
  if (type.includes('video')) return 'videos';
  if (type.includes('audio')) return 'audio';
  if (type.includes('pdf')) return 'documents';
  if (type.includes('word') || type.includes('docx')) return 'documents';
  if (type.includes('powerpoint') || type.includes('pptx')) return 'presentations';
  if (type.includes('excel') || type.includes('xlsx')) return 'spreadsheets';
  if (type.includes('html') || type.includes('css') || type.includes('js')) return 'web';
  if (type.includes('code') || type.includes('js') || type.includes('ts')) return 'code';
  return 'other';
}

const VAULT_DIR = path.join(process.cwd(), 'apps/backend/data/vault');

/**
 * POST /api/file-generator/generate
 * Generate any file type using GPT
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { type, prompt, options = {} } = req.body;

    if (!type || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'النوع والوصف مطلوبان',
        errorEn: 'Type and prompt are required'
      });
    }

    console.log(`📄 Generating ${type} file: "${prompt.substring(0, 50)}..."`);
    
    const result = await fileGeneratorService.generateFile(type, prompt, options);

    res.json({
      success: true,
      ...result,
      message: `تم إنشاء ملف ${type} بنجاح`
    });
  } catch (error) {
    console.error('File generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/file-generator/pdf
 * Generate PDF document
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/pdf', requireAuth, async (req, res) => {
  try {
    const { prompt, options = {} } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'الوصف مطلوب'
      });
    }

    const result = await fileGeneratorService.generateFile('pdf', prompt, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/file-generator/html
 * Generate HTML page
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/html', requireAuth, async (req, res) => {
  try {
    const { prompt, options = {} } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'الوصف مطلوب'
      });
    }

    const result = await fileGeneratorService.generateFile('html', prompt, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/file-generator/image
 * Generate image using DALL-E 3
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/image', requireAuth, async (req, res) => {
  try {
    const { prompt, size = '1024x1024', quality = 'hd', style = 'vivid' } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'الوصف مطلوب'
      });
    }

    const result = await fileGeneratorService.generateFile('image', prompt, { size, quality, style });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/file-generator/audio
 * Generate audio using ElevenLabs
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/audio', requireAuth, async (req, res) => {
  try {
    const { text, voiceId } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'النص مطلوب'
      });
    }

    const result = await fileGeneratorService.generateFile('audio', text, { voiceId });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/file-generator/code
 * Generate code in any language
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/code', requireAuth, async (req, res) => {
  try {
    const { prompt, language = 'javascript' } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'الوصف مطلوب'
      });
    }

    const result = await fileGeneratorService.generateFile('code', prompt, { language });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/file-generator/json
 * Generate JSON data
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/json', requireAuth, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'الوصف مطلوب'
      });
    }

    const result = await fileGeneratorService.generateFile('json', prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/file-generator/csv
 * Generate CSV data
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/csv', requireAuth, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'الوصف مطلوب'
      });
    }

    const result = await fileGeneratorService.generateFile('csv', prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/file-generator/markdown
 * Generate Markdown document
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/markdown', requireAuth, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'الوصف مطلوب'
      });
    }

    const result = await fileGeneratorService.generateFile('markdown', prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/file-generator/video
 * Generate video (RunwayML, Pika, or Sora)
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/video', requireAuth, async (req, res) => {
  try {
    const { prompt, duration = 5, resolution = '1024x1024', style } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'الوصف مطلوب'
      });
    }

    const result = await fileGeneratorService.generateFile('video', prompt, { duration, resolution, style });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/file-generator/document
 * Generate Word document
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/document', requireAuth, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'الوصف مطلوب'
      });
    }

    const result = await fileGeneratorService.generateFile('docx', prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/file-generator/word
 * Generate Word document (alias)
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/word', requireAuth, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'الوصف مطلوب'
      });
    }

    const result = await fileGeneratorService.generateFile('docx', prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/file-generator/spreadsheet
 * Generate Excel spreadsheet
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/spreadsheet', requireAuth, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'الوصف مطلوب'
      });
    }

    const result = await fileGeneratorService.generateFile('xlsx', prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/file-generator/presentation
 * Generate PowerPoint presentation
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/presentation', requireAuth, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'الوصف مطلوب'
      });
    }

    const result = await fileGeneratorService.generateFile('pptx', prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/file-generator/powerpoint
 * Generate PowerPoint presentation (alias)
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/powerpoint', requireAuth, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'الوصف مطلوب'
      });
    }

    const result = await fileGeneratorService.generateFile('pptx', prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/file-generator/sheets
 * Generate Excel/Sheets spreadsheet
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/sheets', requireAuth, async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'الوصف مطلوب'
      });
    }

    const result = await fileGeneratorService.generateFile('xlsx', prompt);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/file-generator/analyze
 * Analyze any file type and suggest improvements
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/analyze', requireAuth, async (req, res) => {
  try {
    const { fileContent, fileType, engine = 'gpt' } = req.body;

    if (!fileContent) {
      return res.status(400).json({
        success: false,
        error: 'File content is required'
      });
    }

    // Use GPT, Claude, or Gemini for analysis
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `أنت خبير في تحليل الملفات. قم بتحليل الملف واقترح تحسينات وتعديلات.`
        },
        {
          role: 'user',
          content: `حلل هذا الملف من نوع ${fileType || 'unknown'} واقترح تحسينات:\n\n${fileContent.substring(0, 8000)}`
        }
      ],
      temperature: 0.7,
    });

    const analysis = response.choices[0].message.content;

    res.json({
      success: true,
      analysis,
      suggestions: analysis.split('\n').filter(line => line.includes('اقتراح') || line.includes('تحسين')),
      engine: 'gpt-4o',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/file-generator/save-to-vault
 * Save generated file to vault
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/save-to-vault', requireAuth, async (req, res) => {
  try {
    const userId = req.userId; // From requireAuth middleware
    const { fileId, name, type } = req.body;

    if (!fileId || !name) {
      return res.status(400).json({
        success: false,
        error: 'File ID and name are required'
      });
    }

    const filePath = fileGeneratorService.getFilePath(fileId);
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'Generated file not found'
      });
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Encrypt and save to vault
    const key = deriveKey(MASTER_KEY, SALT);
    const encrypted = encryptData(fileBuffer.toString('base64'), key);

    const vaultFileId = `vault_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    const vaultFilePath = path.join(VAULT_DIR, vaultFileId);
    fs.writeFileSync(vaultFilePath, JSON.stringify(encrypted));

    // Save to database
    const now = new Date();
    DB.vault.create({
      id: vaultFileId,
      userId,
      name: name,
      path: vaultFilePath,
      type: type || 'application/octet-stream',
      encrypted: true,
      created_at: now.toISOString(),
      created_date: now.toLocaleDateString('ar-SA'),
      created_time: now.toLocaleTimeString('ar-SA'),
      file_type: type || 'application/octet-stream',
      category: getFileCategory(type || 'application/octet-stream'),
    });

    res.json({
      success: true,
      vaultFile: {
        id: vaultFileId,
        name,
        type,
        encrypted: true,
      },
    });
  } catch (error) {
    console.error('Save to vault error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/file-generator/list
 * List all generated files
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.get('/list', requireAuth, (req, res) => {
  try {
    const files = fileGeneratorService.listGeneratedFiles();
    res.json({
      success: true,
      files,
      count: files.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/file-generator/download/:filename
 * Download generated file
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.get('/download/:filename', requireAuth, (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = fileGeneratorService.getFilePath(filename);

    if (!filePath) {
      return res.status(404).json({
        success: false,
        error: 'الملف غير موجود'
      });
    }

    res.download(filePath, filename);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/file-generator/preview/:filename
 * Preview generated file
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.get('/preview/:filename', requireAuth, (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = fileGeneratorService.getFilePath(filename);

    if (!filePath) {
      return res.status(404).json({
        success: false,
        error: 'الملف غير موجود'
      });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/file-generator/types
 * Get supported file types
 */
router.get('/types', (req, res) => {
  res.json({
    success: true,
    types: [
      { id: 'pdf', name: 'PDF', nameAr: 'مستند PDF', icon: '📄', description: 'إنشاء مستندات PDF احترافية' },
      { id: 'html', name: 'HTML', nameAr: 'صفحة ويب', icon: '🌐', description: 'صفحات HTML جميلة ومتجاوبة' },
      { id: 'image', name: 'Image', nameAr: 'صورة', icon: '🖼️', description: 'صور AI بجودة عالية (DALL-E 3)' },
      { id: 'audio', name: 'Audio', nameAr: 'ملف صوتي', icon: '🎵', description: 'ملفات صوتية (ElevenLabs)' },
      { id: 'json', name: 'JSON', nameAr: 'بيانات JSON', icon: '📊', description: 'بيانات منظمة بتنسيق JSON' },
      { id: 'csv', name: 'CSV', nameAr: 'جدول بيانات', icon: '📋', description: 'جداول بيانات CSV' },
      { id: 'markdown', name: 'Markdown', nameAr: 'Markdown', icon: '📝', description: 'مستندات Markdown' },
      { id: 'code', name: 'Code', nameAr: 'كود برمجي', icon: '💻', description: 'كود بأي لغة برمجية' },
      { id: 'video', name: 'Video Script', nameAr: 'سكريبت فيديو', icon: '🎬', description: 'سكريبتات فيديو مفصلة' }
    ]
  });
});

export default router;
