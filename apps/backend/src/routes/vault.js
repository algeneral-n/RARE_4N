/**
 * RARE 4N - Vault Routes
 * مسارات الخزنة والتشفير
 * ✅ Debug Logging شامل
 * ✅ Error Handling شامل
 * ✅ Input Validation شامل
 * ✅ الحماية من الكراشات
 */

import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { getDatabase, DB } from '../database/localDB.js';
import { requireAuth } from '../middleware/userIsolation.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VAULT_DIR = path.join(__dirname, '../../data/vault');
const TEMP_DIR = path.join(__dirname, '../../data/temp');

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  try {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create temp directory:', error);
  }
}

// Configure multer for file uploads
const upload = multer({
  dest: TEMP_DIR,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
  fileFilter: (req, file, cb) => {
    // Accept all file types for vault
    cb(null, true);
  },
});

// Ensure vault directory exists
if (!fs.existsSync(VAULT_DIR)) {
  try {
    fs.mkdirSync(VAULT_DIR, { recursive: true });
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:init',message:'Vault directory created',data:{path:VAULT_DIR},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_INIT'})}).catch(()=>{});
    }
    // #endregion
  } catch (error) {
    console.error('Failed to create vault directory:', error);
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:init',message:'Vault directory creation failed',data:{error:error.message,path:VAULT_DIR},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_INIT_ERROR'})}).catch(()=>{});
    }
    // #endregion
  }
}

// Encryption configuration
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const MASTER_KEY = process.env.RARE_MASTER_KEY || crypto.randomBytes(32).toString('hex');
const SALT = process.env.RARE_ENCRYPTION_SALT || crypto.randomBytes(16).toString('hex');

// ✅ Vault Password Protection
const VAULT_PASSWORD = '263688';

// #region agent log
if (process.env.NODE_ENV === 'development') {
  fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:config',message:'Vault encryption config loaded',data:{algorithm:ENCRYPTION_ALGORITHM,hasMasterKey:!!process.env.RARE_MASTER_KEY,hasSalt:!!process.env.RARE_ENCRYPTION_SALT},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_CONFIG'})}).catch(()=>{});
}
// #endregion

/**
 * Derive encryption key from master key
 */
function deriveKey(masterKey, salt) {
  return crypto.pbkdf2Sync(masterKey, salt, 100000, 32, 'sha256');
}

/**
 * Encrypt data
 */
function encryptData(data, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

/**
 * Decrypt data
 */
function decryptData(encryptedData, iv, authTag, key) {
  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    key,
    Buffer.from(iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Get user ID from request (now uses requireAuth middleware)
 * ✅ SECURITY: User ID comes from authenticated session
 */
function getUserId(req) {
  // req.userId is set by requireAuth middleware
  if (!req.userId) {
    throw new Error('User ID not found - authentication required');
  }
  return req.userId;
}

/**
 * Get file category based on type
 */
function getFileCategory(fileType) {
  if (!fileType) return 'other';
  
  const type = fileType.toLowerCase();
  if (type.includes('image') || type.includes('jpg') || type.includes('png') || type.includes('gif')) return 'images';
  if (type.includes('video') || type.includes('mp4') || type.includes('mov')) return 'videos';
  if (type.includes('audio') || type.includes('mp3') || type.includes('wav')) return 'audio';
  if (type.includes('pdf')) return 'documents';
  if (type.includes('word') || type.includes('docx') || type.includes('doc')) return 'documents';
  if (type.includes('powerpoint') || type.includes('pptx') || type.includes('ppt')) return 'presentations';
  if (type.includes('excel') || type.includes('xlsx') || type.includes('csv')) return 'spreadsheets';
  if (type.includes('html') || type.includes('css') || type.includes('js')) return 'web';
  if (type.includes('code') || type.includes('js') || type.includes('ts') || type.includes('py')) return 'code';
  return 'other';
}

/**
 * POST /api/vault/encrypt
 * Encrypt data
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/encrypt', requireAuth, async (req, res) => {
  try {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:encrypt',message:'Encrypt request started',data:{hasData:!!req.body.data,dataLength:req.body.data?.length || 0},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_ENCRYPT_START'})}).catch(()=>{});
    }
    // #endregion

    const { data } = req.body;

    // Input validation
    if (!data) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:encrypt',message:'Encrypt validation failed',data:{error:'Data is required'},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_ENCRYPT_VALIDATION'})}).catch(()=>{});
      }
      // #endregion
      return res.status(400).json({ error: 'Data is required' });
    }

    if (typeof data !== 'string' && typeof data !== 'object') {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:encrypt',message:'Encrypt validation failed - invalid type',data:{error:'Data must be string or object',dataType:typeof data},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_ENCRYPT_VALIDATION_TYPE'})}).catch(()=>{});
      }
      // #endregion
      return res.status(400).json({ error: 'Data must be string or object' });
    }

    try {
      const dataString = typeof data === 'string' ? data : JSON.stringify(data);
      const key = deriveKey(MASTER_KEY, SALT);
      const encrypted = encryptData(dataString, key);

      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:encrypt',message:'Encrypt success',data:{dataLength:dataString.length,encryptedLength:encrypted.encrypted.length},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_ENCRYPT_SUCCESS'})}).catch(()=>{});
      }
      // #endregion

      res.json({
        success: true,
        encrypted: JSON.stringify(encrypted),
      });
    } catch (encryptError) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:encrypt',message:'Encrypt operation failed',data:{error:encryptError.message,stack:encryptError.stack},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_ENCRYPT_ERROR'})}).catch(()=>{});
      }
      // #endregion
      console.error('Encryption operation error:', encryptError);
      res.status(500).json({ error: 'Failed to encrypt data' });
    }
  } catch (error) {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:encrypt',message:'Encrypt route error',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_ENCRYPT_ROUTE_ERROR'})}).catch(()=>{});
    }
    // #endregion
    console.error('Encryption error:', error);
    res.status(500).json({ error: 'Failed to encrypt data' });
  }
});

/**
 * POST /api/vault/decrypt
 * Decrypt data
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/decrypt', requireAuth, async (req, res) => {
  try {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:decrypt',message:'Decrypt request started',data:{hasEncryptedData:!!req.body.encryptedData},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DECRYPT_START'})}).catch(()=>{});
    }
    // #endregion

    const { encryptedData } = req.body;

    // Input validation
    if (!encryptedData) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:decrypt',message:'Decrypt validation failed',data:{error:'Encrypted data is required'},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DECRYPT_VALIDATION'})}).catch(()=>{});
      }
      // #endregion
      return res.status(400).json({ error: 'Encrypted data is required' });
    }

    if (typeof encryptedData !== 'string') {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:decrypt',message:'Decrypt validation failed - invalid type',data:{error:'Encrypted data must be string',dataType:typeof encryptedData},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DECRYPT_VALIDATION_TYPE'})}).catch(()=>{});
      }
      // #endregion
      return res.status(400).json({ error: 'Encrypted data must be string' });
    }

    try {
      const encrypted = JSON.parse(encryptedData);
      
      // Validate encrypted structure
      if (!encrypted.encrypted || !encrypted.iv || !encrypted.authTag) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:decrypt',message:'Decrypt validation failed - invalid structure',data:{error:'Invalid encrypted data structure',hasEncrypted:!!encrypted.encrypted,hasIv:!!encrypted.iv,hasAuthTag:!!encrypted.authTag},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DECRYPT_VALIDATION_STRUCTURE'})}).catch(()=>{});
        }
        // #endregion
        return res.status(400).json({ error: 'Invalid encrypted data structure' });
      }

      const key = deriveKey(MASTER_KEY, SALT);
      const decrypted = decryptData(encrypted.encrypted, encrypted.iv, encrypted.authTag, key);

      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:decrypt',message:'Decrypt success',data:{decryptedLength:decrypted.length},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DECRYPT_SUCCESS'})}).catch(()=>{});
      }
      // #endregion

      res.json({
        success: true,
        decrypted,
      });
    } catch (parseError) {
      if (parseError instanceof SyntaxError) {
        console.error('Decryption parse error:', parseError);
        res.status(400).json({ error: 'Invalid encrypted data format' });
      } else {
        console.error('Decryption operation error:', parseError);
        res.status(500).json({ error: 'Failed to decrypt data' });
      }
    }
  } catch (error) {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:decrypt',message:'Decrypt route error',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DECRYPT_ROUTE_ERROR'})}).catch(()=>{});
    }
    // #endregion
    console.error('Decryption error:', error);
    res.status(500).json({ error: 'Failed to decrypt data' });
  }
});

/**
 * POST /api/vault/store
 * Store encrypted file in vault
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/store', requireAuth, async (req, res) => {
  try {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:store',message:'Store request started',data:{hasName:!!req.body.name,hasData:!!req.body.data,hasType:!!req.body.type},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_STORE_START'})}).catch(()=>{});
    }
    // #endregion

    const userId = getUserId(req);
    const { name, data, type } = req.body;

    // Input validation
    if (!name || !data) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:store',message:'Store validation failed',data:{error:'Name and data are required',hasName:!!name,hasData:!!data},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_STORE_VALIDATION'})}).catch(()=>{});
      }
      // #endregion
      return res.status(400).json({ error: 'Name and data are required' });
    }

    if (typeof name !== 'string' || name.trim().length === 0) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:store',message:'Store validation failed - invalid name',data:{error:'Name must be non-empty string',nameType:typeof name},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_STORE_VALIDATION_NAME'})}).catch(()=>{});
      }
      // #endregion
      return res.status(400).json({ error: 'Name must be non-empty string' });
    }

    try {
      const dataString = typeof data === 'string' ? data : JSON.stringify(data);
      
      // Encrypt data
      const key = deriveKey(MASTER_KEY, SALT);
      const encrypted = encryptData(dataString, key);

      // Save encrypted file
      const fileId = `vault_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
      const filePath = path.join(VAULT_DIR, fileId);
      
      fs.writeFileSync(filePath, JSON.stringify(encrypted));

      // Save to database
      DB.vault.create({
        id: fileId,
        userId,
        name: name.trim(),
        path: filePath,
        type: type || 'text/plain',
        encrypted: true,
      });

      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:store',message:'Store success',data:{fileId,name,type:type || 'text/plain',dataLength:dataString.length},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_STORE_SUCCESS'})}).catch(()=>{});
      }
      // #endregion

      res.json({
        success: true,
        file: {
          id: fileId,
          name: name.trim(),
          type: type || 'text/plain',
          encrypted: true,
        },
      });
    } catch (storeError) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:store',message:'Store operation failed',data:{error:storeError.message,stack:storeError.stack},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_STORE_ERROR'})}).catch(()=>{});
      }
      // #endregion
      console.error('Vault store operation error:', storeError);
      res.status(500).json({ error: 'Failed to store file in vault' });
    }
  } catch (error) {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:store',message:'Store route error',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_STORE_ROUTE_ERROR'})}).catch(()=>{});
    }
    // #endregion
    console.error('Vault store error:', error);
    res.status(500).json({ error: 'Failed to store file in vault' });
  }
});

/**
 * GET /api/vault/list
 * List vault items
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.get('/list', requireAuth, async (req, res) => {
  try {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:list',message:'List request started',data:{},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_LIST_START'})}).catch(()=>{});
    }
    // #endregion

    const userId = getUserId(req);
    
    try {
      const items = DB.vault.findByUser(userId);

      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:list',message:'List success',data:{userId,itemCount:items.length},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_LIST_SUCCESS'})}).catch(()=>{});
      }
      // #endregion

      res.json({
        success: true,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type,
          encrypted: item.encrypted,
          createdAt: item.created_at,
          createdDate: item.created_date || new Date(item.created_at).toLocaleDateString('ar-SA'),
          createdTime: item.created_time || new Date(item.created_at).toLocaleTimeString('ar-SA'),
          fileType: item.file_type || item.type,
          category: item.category || getFileCategory(item.type),
        })),
        count: items.length,
      });
    } catch (dbError) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:list',message:'List database error',data:{error:dbError.message,stack:dbError.stack},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_LIST_DB_ERROR'})}).catch(()=>{});
      }
      // #endregion
      console.error('Vault list database error:', dbError);
      res.status(500).json({ error: 'Failed to list vault items' });
    }
  } catch (error) {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:list',message:'List route error',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_LIST_ROUTE_ERROR'})}).catch(()=>{});
    }
    // #endregion
    console.error('Vault list error:', error);
    res.status(500).json({ error: 'Failed to list vault items' });
  }
});

/**
 * GET /api/vault/:id
 * Retrieve and decrypt vault item
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.get('/:id', requireAuth, async (req, res) => {
  try {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:get',message:'Get request started',data:{id:req.params.id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_GET_START'})}).catch(()=>{});
    }
    // #endregion

    const { id } = req.params;
    const userId = getUserId(req);

    // Input validation
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:get',message:'Get validation failed',data:{error:'Invalid item ID',id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_GET_VALIDATION'})}).catch(()=>{});
      }
      // #endregion
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    try {
      const item = DB.vault.findById(id);
      
      if (!item) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:get',message:'Get item not found',data:{id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_GET_NOT_FOUND'})}).catch(()=>{});
        }
        // #endregion
        return res.status(404).json({ error: 'Vault item not found' });
      }

      if (item.user_id !== userId) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:get',message:'Get unauthorized access',data:{id,userId,itemUserId:item.user_id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_GET_UNAUTHORIZED'})}).catch(()=>{});
        }
        // #endregion
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      if (!fs.existsSync(item.path)) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:get',message:'Get file missing',data:{id,filePath:item.path},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_GET_FILE_MISSING'})}).catch(()=>{});
        }
        // #endregion
        return res.status(404).json({ error: 'File missing on disk' });
      }

      // Read and decrypt
      const encrypted = JSON.parse(fs.readFileSync(item.path, 'utf8'));
      
      // Validate encrypted structure
      if (!encrypted.encrypted || !encrypted.iv || !encrypted.authTag) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:get',message:'Get invalid encrypted structure',data:{id,hasEncrypted:!!encrypted.encrypted,hasIv:!!encrypted.iv,hasAuthTag:!!encrypted.authTag},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_GET_INVALID_STRUCTURE'})}).catch(()=>{});
        }
        // #endregion
        return res.status(500).json({ error: 'Invalid encrypted file structure' });
      }

      const key = deriveKey(MASTER_KEY, SALT);
      const decrypted = decryptData(encrypted.encrypted, encrypted.iv, encrypted.authTag, key);

      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:get',message:'Get success',data:{id,name:item.name,decryptedLength:decrypted.length},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_GET_SUCCESS'})}).catch(()=>{});
      }
      // #endregion

      res.json({
        success: true,
        item: {
          id: item.id,
          name: item.name,
          type: item.type,
          data: decrypted,
        },
      });
    } catch (readError) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:get',message:'Get operation failed',data:{error:readError.message,stack:readError.stack,id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_GET_ERROR'})}).catch(()=>{});
      }
      // #endregion
      console.error('Vault retrieve operation error:', readError);
      res.status(500).json({ error: 'Failed to retrieve vault item' });
    }
  } catch (error) {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:get',message:'Get route error',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_GET_ROUTE_ERROR'})}).catch(()=>{});
    }
    // #endregion
    console.error('Vault retrieve error:', error);
    res.status(500).json({ error: 'Failed to retrieve vault item' });
  }
});

/**
 * DELETE /api/vault/:id
 * Delete vault item
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:delete',message:'Delete request started',data:{id:req.params.id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DELETE_START'})}).catch(()=>{});
    }
    // #endregion

    const { id } = req.params;
    const userId = getUserId(req);

    // Input validation
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:delete',message:'Delete validation failed',data:{error:'Invalid item ID',id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DELETE_VALIDATION'})}).catch(()=>{});
      }
      // #endregion
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    try {
      const item = DB.vault.findById(id);
      
      if (!item) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:delete',message:'Delete item not found',data:{id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DELETE_NOT_FOUND'})}).catch(()=>{});
        }
        // #endregion
        return res.status(404).json({ error: 'Vault item not found' });
      }

      if (item.user_id !== userId) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:delete',message:'Delete unauthorized access',data:{id,userId,itemUserId:item.user_id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DELETE_UNAUTHORIZED'})}).catch(()=>{});
        }
        // #endregion
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      // Delete file
      if (fs.existsSync(item.path)) {
        try {
          fs.unlinkSync(item.path);
        } catch (unlinkError) {
          // #region agent log
          if (process.env.NODE_ENV === 'development') {
            fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:delete',message:'Delete file unlink error',data:{error:unlinkError.message,filePath:item.path},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DELETE_UNLINK_ERROR'})}).catch(()=>{});
          }
          // #endregion
          console.error('Failed to delete file:', unlinkError);
          // Continue with database deletion even if file deletion fails
        }
      }

      // Delete from database
      DB.vault.delete(id);

      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:delete',message:'Delete success',data:{id,name:item.name},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DELETE_SUCCESS'})}).catch(()=>{});
      }
      // #endregion

      res.json({ success: true });
    } catch (deleteError) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:delete',message:'Delete operation failed',data:{error:deleteError.message,stack:deleteError.stack,id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DELETE_ERROR'})}).catch(()=>{});
      }
      // #endregion
      console.error('Vault delete operation error:', deleteError);
      res.status(500).json({ error: 'Failed to delete vault item' });
    }
  } catch (error) {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:delete',message:'Delete route error',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DELETE_ROUTE_ERROR'})}).catch(()=>{});
    }
    // #endregion
    console.error('Vault delete error:', error);
    res.status(500).json({ error: 'Failed to delete vault item' });
  }
});

/**
 * POST /api/vault/upload
 * Upload file to vault (with encryption)
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  try {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:upload',message:'Upload request started',data:{hasFile:!!req.file,hasName:!!req.body.name},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_UPLOAD_START'})}).catch(()=>{});
    }
    // #endregion

    const userId = getUserId(req);
    const { name } = req.body;
    const file = req.file;

    // Input validation
    if (!file) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:upload',message:'Upload validation failed - no file',data:{error:'File is required'},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_UPLOAD_VALIDATION_FILE'})}).catch(()=>{});
      }
      // #endregion
      return res.status(400).json({ error: 'File is required' });
    }

    const fileName = name || file.originalname || `vault_file_${Date.now()}`;
    const fileType = file.mimetype || 'application/octet-stream';

    try {
      // Read file buffer
      const fileBuffer = fs.readFileSync(file.path);
      
      // Encrypt file data
      const key = deriveKey(MASTER_KEY, SALT);
      const encrypted = encryptData(fileBuffer.toString('base64'), key);

      // Save encrypted file
      const fileId = `vault_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
      const filePath = path.join(VAULT_DIR, fileId);
      
      fs.writeFileSync(filePath, JSON.stringify(encrypted));

      // Delete temporary file
      try {
        fs.unlinkSync(file.path);
      } catch (unlinkError) {
        // Ignore unlink errors for temp files
      }

      // ✅ Save to database with metadata
      const now = new Date();
      DB.vault.create({
        id: fileId,
        userId,
        name: fileName,
        path: filePath,
        type: fileType,
        encrypted: true,
        created_at: now.toISOString(),
        created_date: now.toLocaleDateString('ar-SA'),
        created_time: now.toLocaleTimeString('ar-SA'),
        file_type: fileType,
        category: getFileCategory(fileType),
      });

      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:upload',message:'Upload success',data:{fileId,name:fileName,type:fileType,size:fileBuffer.length},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_UPLOAD_SUCCESS'})}).catch(()=>{});
      }
      // #endregion

      res.json({
        success: true,
        file: {
          id: fileId,
          name: fileName,
          type: fileType,
          size: fileBuffer.length,
          encrypted: true,
        },
      });
    } catch (uploadError) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:upload',message:'Upload operation failed',data:{error:uploadError.message,stack:uploadError.stack},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_UPLOAD_ERROR'})}).catch(()=>{});
      }
      // #endregion
      console.error('Vault upload operation error:', uploadError);
      res.status(500).json({ error: 'Failed to upload file to vault' });
    }
  } catch (error) {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:upload',message:'Upload route error',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_UPLOAD_ROUTE_ERROR'})}).catch(()=>{});
    }
    // #endregion
    console.error('Vault upload error:', error);
    res.status(500).json({ error: 'Failed to upload file to vault' });
  }
});

/**
 * GET /api/vault/:id/download
 * Download vault item (decrypted)
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.get('/:id/download', requireAuth, async (req, res) => {
  try {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:download',message:'Download request started',data:{id:req.params.id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DOWNLOAD_START'})}).catch(()=>{});
    }
    // #endregion

    const { id } = req.params;
    const userId = getUserId(req);

    // Input validation
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:download',message:'Download validation failed',data:{error:'Invalid item ID',id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DOWNLOAD_VALIDATION'})}).catch(()=>{});
      }
      // #endregion
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    try {
      const item = DB.vault.findById(id);
      
      if (!item) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:download',message:'Download item not found',data:{id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DOWNLOAD_NOT_FOUND'})}).catch(()=>{});
        }
        // #endregion
        return res.status(404).json({ error: 'Vault item not found' });
      }

      if (item.user_id !== userId) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:download',message:'Download unauthorized access',data:{id,userId,itemUserId:item.user_id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DOWNLOAD_UNAUTHORIZED'})}).catch(()=>{});
        }
        // #endregion
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      if (!fs.existsSync(item.path)) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:download',message:'Download file missing',data:{id,filePath:item.path},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DOWNLOAD_FILE_MISSING'})}).catch(()=>{});
        }
        // #endregion
        return res.status(404).json({ error: 'File missing on disk' });
      }

      // Read and decrypt
      const encrypted = JSON.parse(fs.readFileSync(item.path, 'utf8'));
      
      if (!encrypted.encrypted || !encrypted.iv || !encrypted.authTag) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:download',message:'Download invalid encrypted structure',data:{id,hasEncrypted:!!encrypted.encrypted,hasIv:!!encrypted.iv,hasAuthTag:!!encrypted.authTag},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DOWNLOAD_INVALID_STRUCTURE'})}).catch(()=>{});
        }
        // #endregion
        return res.status(500).json({ error: 'Invalid encrypted file structure' });
      }

      const key = deriveKey(MASTER_KEY, SALT);
      const decryptedBase64 = decryptData(encrypted.encrypted, encrypted.iv, encrypted.authTag, key);
      const decryptedBuffer = Buffer.from(decryptedBase64, 'base64');

      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:download',message:'Download success',data:{id,name:item.name,size:decryptedBuffer.length},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DOWNLOAD_SUCCESS'})}).catch(()=>{});
      }
      // #endregion

      res.setHeader('Content-Type', item.type || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${item.name}"`);
      res.send(decryptedBuffer);
    } catch (downloadError) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:download',message:'Download operation failed',data:{error:downloadError.message,stack:downloadError.stack,id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DOWNLOAD_ERROR'})}).catch(()=>{});
      }
      // #endregion
      console.error('Vault download operation error:', downloadError);
      res.status(500).json({ error: 'Failed to download vault item' });
    }
  } catch (error) {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:download',message:'Download route error',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_DOWNLOAD_ROUTE_ERROR'})}).catch(()=>{});
    }
    // #endregion
    console.error('Vault download error:', error);
    res.status(500).json({ error: 'Failed to download vault item' });
  }
});

/**
 * GET /api/vault/:id/preview
 * Preview vault item (decrypted, for text/images)
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.get('/:id/preview', requireAuth, async (req, res) => {
  try {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:preview',message:'Preview request started',data:{id:req.params.id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_PREVIEW_START'})}).catch(()=>{});
    }
    // #endregion

    const { id } = req.params;
    const userId = getUserId(req);

    // Input validation
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:preview',message:'Preview validation failed',data:{error:'Invalid item ID',id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_PREVIEW_VALIDATION'})}).catch(()=>{});
      }
      // #endregion
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    try {
      const item = DB.vault.findById(id);
      
      if (!item) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:preview',message:'Preview item not found',data:{id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_PREVIEW_NOT_FOUND'})}).catch(()=>{});
        }
        // #endregion
        return res.status(404).json({ error: 'Vault item not found' });
      }

      if (item.user_id !== userId) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:preview',message:'Preview unauthorized access',data:{id,userId,itemUserId:item.user_id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_PREVIEW_UNAUTHORIZED'})}).catch(()=>{});
        }
        // #endregion
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      if (!fs.existsSync(item.path)) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:preview',message:'Preview file missing',data:{id,filePath:item.path},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_PREVIEW_FILE_MISSING'})}).catch(()=>{});
        }
        // #endregion
        return res.status(404).json({ error: 'File missing on disk' });
      }

      // Read and decrypt
      const encrypted = JSON.parse(fs.readFileSync(item.path, 'utf8'));
      
      if (!encrypted.encrypted || !encrypted.iv || !encrypted.authTag) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:preview',message:'Preview invalid encrypted structure',data:{id,hasEncrypted:!!encrypted.encrypted,hasIv:!!encrypted.iv,hasAuthTag:!!encrypted.authTag},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_PREVIEW_INVALID_STRUCTURE'})}).catch(()=>{});
        }
        // #endregion
        return res.status(500).json({ error: 'Invalid encrypted file structure' });
      }

      const key = deriveKey(MASTER_KEY, SALT);
      const decrypted = decryptData(encrypted.encrypted, encrypted.iv, encrypted.authTag, key);

      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:preview',message:'Preview success',data:{id,name:item.name,type:item.type,decryptedLength:decrypted.length},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_PREVIEW_SUCCESS'})}).catch(()=>{});
      }
      // #endregion

      res.json({
        success: true,
        preview: {
          id: item.id,
          name: item.name,
          type: item.type,
          data: decrypted,
          isText: item.type?.startsWith('text/') || item.type?.includes('json') || item.type?.includes('xml'),
          isImage: item.type?.startsWith('image/'),
        },
      });
    } catch (previewError) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:preview',message:'Preview operation failed',data:{error:previewError.message,stack:previewError.stack,id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_PREVIEW_ERROR'})}).catch(()=>{});
      }
      // #endregion
      console.error('Vault preview operation error:', previewError);
      res.status(500).json({ error: 'Failed to preview vault item' });
    }
  } catch (error) {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:preview',message:'Preview route error',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_PREVIEW_ROUTE_ERROR'})}).catch(()=>{});
    }
    // #endregion
    console.error('Vault preview error:', error);
    res.status(500).json({ error: 'Failed to preview vault item' });
  }
});

/**
 * POST /api/vault/:id/scan
 * Scan vault item (OCR for images, analysis for documents)
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/:id/scan', requireAuth, async (req, res) => {
  try {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:scan',message:'Scan request started',data:{id:req.params.id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_SCAN_START'})}).catch(()=>{});
    }
    // #endregion

    const { id } = req.params;
    const userId = getUserId(req);

    // Input validation
    if (!id || typeof id !== 'string' || id.trim().length === 0) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:scan',message:'Scan validation failed',data:{error:'Invalid item ID',id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_SCAN_VALIDATION'})}).catch(()=>{});
      }
      // #endregion
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    try {
      const item = DB.vault.findById(id);
      
      if (!item) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:scan',message:'Scan item not found',data:{id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_SCAN_NOT_FOUND'})}).catch(()=>{});
        }
        // #endregion
        return res.status(404).json({ error: 'Vault item not found' });
      }

      if (item.user_id !== userId) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:scan',message:'Scan unauthorized access',data:{id,userId,itemUserId:item.user_id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_SCAN_UNAUTHORIZED'})}).catch(()=>{});
        }
        // #endregion
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      if (!fs.existsSync(item.path)) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:scan',message:'Scan file missing',data:{id,filePath:item.path},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_SCAN_FILE_MISSING'})}).catch(()=>{});
        }
        // #endregion
        return res.status(404).json({ error: 'File missing on disk' });
      }

      // Read and decrypt
      const encrypted = JSON.parse(fs.readFileSync(item.path, 'utf8'));
      
      if (!encrypted.encrypted || !encrypted.iv || !encrypted.authTag) {
        // #region agent log
        if (process.env.NODE_ENV === 'development') {
          fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:scan',message:'Scan invalid encrypted structure',data:{id,hasEncrypted:!!encrypted.encrypted,hasIv:!!encrypted.iv,hasAuthTag:!!encrypted.authTag},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_SCAN_INVALID_STRUCTURE'})}).catch(()=>{});
        }
        // #endregion
        return res.status(500).json({ error: 'Invalid encrypted file structure' });
      }

      const key = deriveKey(MASTER_KEY, SALT);
      const decryptedBase64 = decryptData(encrypted.encrypted, encrypted.iv, encrypted.authTag, key);
      const decryptedBuffer = Buffer.from(decryptedBase64, 'base64');

      // Import OCR service
      const { extractTextFromImage } = await import('../services/ocrService.js');
      
      // Scan based on file type
      let scanResult;
      if (item.type?.startsWith('image/')) {
        // OCR for images - save to temp file first
        const tempImagePath = path.join(TEMP_DIR, `scan_${id}_${Date.now()}.tmp`);
        try {
          fs.writeFileSync(tempImagePath, decryptedBuffer);
          const ocrResult = await extractTextFromImage(tempImagePath, 'ar', true);
          scanResult = {
            text: ocrResult.text || '',
            type: 'image',
            confidence: ocrResult.confidence || 0,
            language: ocrResult.language || 'ar',
          };
          // Clean up temp file
          try {
            fs.unlinkSync(tempImagePath);
          } catch (unlinkError) {
            // Ignore cleanup errors
          }
        } catch (ocrError) {
          // #region agent log
          if (process.env.NODE_ENV === 'development') {
            fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:scan',message:'Scan OCR error',data:{error:ocrError.message,id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_SCAN_OCR_ERROR'})}).catch(()=>{});
          }
          // #endregion
          // Fallback to empty result
          scanResult = {
            text: '',
            type: 'image',
            error: 'OCR failed',
          };
        }
      } else {
        // Text analysis for documents
        const text = decryptedBuffer.toString('utf8');
        scanResult = {
          text,
          type: 'text',
          length: text.length,
        };
      }

      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:scan',message:'Scan success',data:{id,name:item.name,type:item.type,scanType:scanResult.type},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_SCAN_SUCCESS'})}).catch(()=>{});
      }
      // #endregion

      res.json({
        success: true,
        scan: scanResult,
      });
    } catch (scanError) {
      // #region agent log
      if (process.env.NODE_ENV === 'development') {
        fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:scan',message:'Scan operation failed',data:{error:scanError.message,stack:scanError.stack,id},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_SCAN_ERROR'})}).catch(()=>{});
      }
      // #endregion
      console.error('Vault scan operation error:', scanError);
      res.status(500).json({ error: 'Failed to scan vault item' });
    }
  } catch (error) {
    // #region agent log
    if (process.env.NODE_ENV === 'development') {
      fetch('http://127.0.0.1:7243/ingest/3e7bba4a-de65-453d-8490-c9342404637d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:scan',message:'Scan route error',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'vault-session',runId:'run1',hypothesisId:'VAULT_SCAN_ROUTE_ERROR'})}).catch(()=>{});
    }
    // #endregion
    console.error('Vault scan error:', error);
    res.status(500).json({ error: 'Failed to scan vault item' });
  }
});

/**
 * POST /api/vault/:id/convert
 * Convert file from one format to another
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/:id/convert', requireAuth, async (req, res) => {
  try {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:convert',message:'Convert request started',data:{id:req.params.id,toType:req.body.toType},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'CONVERT_START'})}).catch(()=>{});
    // #endregion

    const { id } = req.params;
    const { toType } = req.body;
    const userId = getUserId(req);

    if (!id || !toType) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:convert',message:'Convert validation failed',data:{error:'ID and toType required',id,toType},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'CONVERT_VALIDATION'})}).catch(()=>{});
      // #endregion
      return res.status(400).json({ success: false, error: 'ID and toType are required' });
    }

    const item = DB.vault.findById(id);
    if (!item || item.user_id !== userId) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:convert',message:'Convert file not found',data:{id,userId},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'CONVERT_NOT_FOUND'})}).catch(()=>{});
      // #endregion
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    if (!fs.existsSync(item.path)) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:convert',message:'Convert file missing',data:{id,path:item.path},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'CONVERT_FILE_MISSING'})}).catch(()=>{});
      // #endregion
      return res.status(404).json({ success: false, error: 'File missing on disk' });
    }

    // Decrypt file first
    const encrypted = JSON.parse(fs.readFileSync(item.path, 'utf8'));
    const key = deriveKey(MASTER_KEY, SALT);
    const decryptedBase64 = decryptData(encrypted.encrypted, encrypted.iv, encrypted.authTag, key);
    const decryptedBuffer = Buffer.from(decryptedBase64, 'base64');

    // Save decrypted file to temp
    const tempPath = path.join(TEMP_DIR, `convert_${id}_${Date.now()}.tmp`);
    fs.writeFileSync(tempPath, decryptedBuffer);

    // Get file extension from type
    const fromType = item.type?.split('/')[1] || path.extname(item.name).slice(1) || 'txt';
    
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:convert',message:'Convert calling service',data:{fromType,toType,tempPath},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'CONVERT_CALLING_SERVICE'})}).catch(()=>{});
    // #endregion

    // Import and call converter service
    const { convertFile } = await import('../services/fileConverterService.js');
    const convertResult = await convertFile(tempPath, fromType, toType);

    // Encrypt converted file
    const convertedBuffer = fs.readFileSync(convertResult.filePath);
    const convertedEncrypted = encryptData(convertedBuffer.toString('base64'), key);
    
    const newFileId = `vault_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    const newFilePath = path.join(VAULT_DIR, newFileId);
    fs.writeFileSync(newFilePath, JSON.stringify(convertedEncrypted));

    // Save to database
    const now = new Date();
    DB.vault.create({
      id: newFileId,
      userId,
      name: `${item.name.split('.')[0]}.${toType}`,
      path: newFilePath,
      type: `application/${toType}`,
      encrypted: true,
      created_at: now.toISOString(),
      created_date: now.toLocaleDateString('ar-SA'),
      created_time: now.toLocaleTimeString('ar-SA'),
      file_type: `application/${toType}`,
      category: getFileCategory(`application/${toType}`),
    });

    // Clean up temp files
    try {
      fs.unlinkSync(tempPath);
      if (fs.existsSync(convertResult.filePath)) {
        fs.unlinkSync(convertResult.filePath);
      }
    } catch (e) {}

    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:convert',message:'Convert success',data:{id,newFileId,toType},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'CONVERT_SUCCESS'})}).catch(()=>{});
    // #endregion

    res.json({ success: true, file: {
      id: newFileId,
      name: `${item.name.split('.')[0]}.${toType}`,
      type: `application/${toType}`,
      size: convertResult.size,
    }});
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:convert',message:'Convert error',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'CONVERT_ERROR'})}).catch(()=>{});
    // #endregion
    console.error('Convert error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/vault/:id/send-to-generator
 * Send a file from Vault to Generator for processing
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/:id/send-to-generator', requireAuth, async (req, res) => {
  try {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:send-to-generator',message:'Send to generator started',data:{id:req.params.id},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'SEND_TO_GENERATOR_START'})}).catch(()=>{});
    // #endregion

    const { id } = req.params;
    const userId = getUserId(req);
    
    const item = DB.vault.findById(id);
    if (!item || item.user_id !== userId) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:send-to-generator',message:'Send to generator not found',data:{id,userId},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'SEND_TO_GENERATOR_NOT_FOUND'})}).catch(()=>{});
      // #endregion
      return res.status(404).json({ success: false, error: 'File not found' });
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:send-to-generator',message:'Send to generator success',data:{id,fileName:item.name},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'SEND_TO_GENERATOR_SUCCESS'})}).catch(()=>{});
    // #endregion

    res.json({ success: true, file: {
      id: item.id,
      name: item.name,
      type: item.type,
      encrypted: item.encrypted,
      path: item.path
    }});
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:send-to-generator',message:'Send to generator error',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'SEND_TO_GENERATOR_ERROR'})}).catch(()=>{});
    // #endregion
    console.error('Send to generator error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/vault/save-from-generator
 * Save a generated file from Generator to Vault
 * ✅ SECURITY: Protected with requireAuth middleware
 */
router.post('/save-from-generator', requireAuth, async (req, res) => {
  try {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:save-from-generator',message:'Save from generator started',data:{hasResult:!!req.body.result,fileId:req.body.result?.fileId},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'SAVE_FROM_GENERATOR_START'})}).catch(()=>{});
    // #endregion

    const { result } = req.body;
    if (!result || !result.fileId) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:save-from-generator',message:'Save from generator validation failed',data:{error:'Invalid result data'},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'SAVE_FROM_GENERATOR_VALIDATION'})}).catch(()=>{});
      // #endregion
      return res.status(400).json({ success: false, error: 'Invalid result data' });
    }
    
    const userId = getUserId(req);
    const filename = result.filename || `${result.fileId}.${result.type || 'txt'}`;
    const filePath = path.join(VAULT_DIR, filename);
    
    // If file exists in generator output, copy it
    const generatorPath = path.join(process.cwd(), 'server/generated', filename);
    if (fs.existsSync(generatorPath)) {
      fs.copyFileSync(generatorPath, filePath);
    } else {
      // Create a placeholder file with metadata
      fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
    }
    
    const now = new Date();
    const fileId = result.fileId || `vault_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    
    // Encrypt if needed
    const key = deriveKey(MASTER_KEY, SALT);
    const fileBuffer = fs.readFileSync(filePath);
    const encrypted = encryptData(fileBuffer.toString('base64'), key);
    const encryptedPath = path.join(VAULT_DIR, fileId);
    fs.writeFileSync(encryptedPath, JSON.stringify(encrypted));
    
    // Save to database
    DB.vault.create({
      id: fileId,
      userId,
      name: filename,
      path: encryptedPath,
      type: result.type || 'application/octet-stream',
      encrypted: true,
      created_at: now.toISOString(),
      created_date: now.toLocaleDateString('ar-SA'),
      created_time: now.toLocaleTimeString('ar-SA'),
      file_type: result.type || 'application/octet-stream',
      category: getFileCategory(result.type),
    });
    
    res.json({ success: true, file: {
      id: fileId,
      name: filename,
      type: result.type || 'application/octet-stream',
      size: fs.statSync(encryptedPath).size,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      encrypted: true,
      uri: `/api/vault/${fileId}/download`
    }});

    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:save-from-generator',message:'Save from generator success',data:{fileId,filename},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'SAVE_FROM_GENERATOR_SUCCESS'})}).catch(()=>{});
    // #endregion

    res.json({ success: true, file: {
      id: fileId,
      name: filename,
      type: result.type || 'application/octet-stream',
      size: fs.statSync(encryptedPath).size,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      encrypted: true,
      uri: `/api/vault/${fileId}/download`
    }});
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'backend/src/routes/vault.js:save-from-generator',message:'Save from generator error',data:{error:error.message,stack:error.stack},timestamp:Date.now(),sessionId:'vault-test',runId:'run1',hypothesisId:'SAVE_FROM_GENERATOR_ERROR'})}).catch(()=>{});
    // #endregion
    console.error('Save from generator error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
