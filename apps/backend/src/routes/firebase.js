/**
 * RARE 4N - Firebase Routes
 * API Routes للـ Firebase Services
 */

import express from 'express';
import { 
  getFirestore, 
  getStorage, 
  getAuth,
  verifyIdToken,
  createCustomToken,
  uploadFile,
  getFileUrl
} from '../services/firebase.js';
import { requireAuth } from '../middleware/userIsolation.js';

const router = express.Router();

/**
 * GET /api/firebase/status
 * التحقق من حالة Firebase
 */
router.get('/status', (req, res) => {
  try {
    const firestore = getFirestore();
    const storage = getStorage();
    const auth = getAuth();

    res.json({
      success: true,
      firebase: {
        initialized: !!(firestore && storage && auth),
        services: {
          firestore: !!firestore,
          storage: !!storage,
          auth: !!auth
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/firebase/auth/verify-token
 * التحقق من Firebase ID Token
 */
router.post('/auth/verify-token', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: 'ID token is required'
      });
    }

    const decodedToken = await verifyIdToken(idToken);

    res.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/firebase/auth/create-custom-token
 * إنشاء Custom Token للمستخدم
 */
router.post('/auth/create-custom-token', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { additionalClaims } = req.body;

    const customToken = await createCustomToken(userId, additionalClaims || {});

    res.json({
      success: true,
      customToken
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/firebase/storage/upload
 * رفع ملف إلى Firebase Storage
 */
router.post('/storage/upload', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { filePath, destinationPath, metadata } = req.body;

    if (!filePath || !destinationPath) {
      return res.status(400).json({
        success: false,
        error: 'filePath and destinationPath are required'
      });
    }

    // إضافة userId للـ destination path
    const fullDestinationPath = `users/${userId}/${destinationPath}`;

    const result = await uploadFile(filePath, fullDestinationPath, {
      ...metadata,
      userId,
      uploadedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/firebase/storage/url/:filePath
 * الحصول على URL لملف في Firebase Storage
 */
router.get('/storage/url/:filePath(*)', requireAuth, async (req, res) => {
  try {
    const { filePath } = req.params;
    const userId = req.userId;

    // التأكد من أن المستخدم يطلب ملفه فقط
    if (!filePath.startsWith(`users/${userId}/`)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const url = await getFileUrl(filePath);

    res.json({
      success: true,
      url
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/firebase/firestore/:collection
 * إضافة مستند إلى Firestore
 */
router.post('/firestore/:collection', requireAuth, async (req, res) => {
  try {
    const { collection } = req.params;
    const data = req.body;
    const userId = req.userId;

    const firestore = getFirestore();
    if (!firestore) {
      return res.status(503).json({
        success: false,
        error: 'Firestore not initialized'
      });
    }

    // إضافة userId و timestamp
    const docData = {
      ...data,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await firestore.collection(collection).add(docData);

    res.json({
      success: true,
      id: docRef.id,
      data: docData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/firebase/firestore/:collection
 * قراءة مستندات من Firestore
 */
router.get('/firestore/:collection', requireAuth, async (req, res) => {
  try {
    const { collection } = req.params;
    const userId = req.userId;

    const firestore = getFirestore();
    if (!firestore) {
      return res.status(503).json({
        success: false,
        error: 'Firestore not initialized'
      });
    }

    // قراءة المستندات الخاصة بالمستخدم فقط
    const snapshot = await firestore
      .collection(collection)
      .where('userId', '==', userId)
      .get();

    const docs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: docs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
