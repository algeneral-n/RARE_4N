/**
 * RARE 4N - Firebase Admin Service
 * Firebase Admin SDK للـ Backend
 */

import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// قراءة Service Account
const serviceAccountPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH 
  ? path.resolve(process.env.GOOGLE_SERVICE_ACCOUNT_PATH)
  : path.join(__dirname, '../../config/google-service-account.json');

let firebaseApp = null;
let firestore = null;
let storage = null;
let auth = null;

/**
 * Initialize Firebase Admin
 */
export function initFirebase() {
  try {
    // التحقق من وجود Service Account
    if (!fs.existsSync(serviceAccountPath)) {
      console.warn('⚠️ Firebase Service Account not found:', serviceAccountPath);
      console.warn('⚠️ Firebase features will be disabled');
      return null;
    }

    // إذا كان Firebase معطل بالفعل، لا تعيد التهيئة
    if (firebaseApp) {
      return firebaseApp;
    }

    // قراءة Service Account
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    // تهيئة Firebase Admin
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.GOOGLE_PROJECT_ID || serviceAccount.project_id || 'valiant-bonbon-479503-p3',
      storageBucket: `${process.env.GOOGLE_PROJECT_ID || serviceAccount.project_id}.appspot.com`
    });

    // تهيئة الخدمات
    firestore = admin.firestore();
    storage = admin.storage();
    auth = admin.auth();

    console.log('✅ Firebase Admin initialized successfully');
    console.log('   Project ID:', firebaseApp.options.projectId);

    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error.message);
    console.warn('⚠️ Firebase features will be disabled');
    return null;
  }
}

/**
 * Get Firestore instance
 */
export function getFirestore() {
  if (!firebaseApp) {
    initFirebase();
  }
  return firestore;
}

/**
 * Get Storage instance
 */
export function getStorage() {
  if (!firebaseApp) {
    initFirebase();
  }
  return storage;
}

/**
 * Get Auth instance
 */
export function getAuth() {
  if (!firebaseApp) {
    initFirebase();
  }
  return auth;
}

/**
 * Get Firebase App instance
 */
export function getFirebaseApp() {
  if (!firebaseApp) {
    initFirebase();
  }
  return firebaseApp;
}

/**
 * Verify Firebase ID Token
 */
export async function verifyIdToken(idToken) {
  try {
    if (!auth) {
      initFirebase();
    }
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Firebase token verification error:', error.message);
    throw error;
  }
}

/**
 * Create custom token for user
 */
export async function createCustomToken(uid, additionalClaims = {}) {
  try {
    if (!auth) {
      initFirebase();
    }
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }
    const customToken = await auth.createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    console.error('Firebase custom token creation error:', error.message);
    throw error;
  }
}

/**
 * Upload file to Firebase Storage
 */
export async function uploadFile(filePath, destinationPath, metadata = {}) {
  try {
    if (!storage) {
      initFirebase();
    }
    if (!storage) {
      throw new Error('Firebase Storage not initialized');
    }

    const bucket = storage.bucket();
    await bucket.upload(filePath, {
      destination: destinationPath,
      metadata: {
        metadata: metadata
      }
    });

    const file = bucket.file(destinationPath);
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;

    return {
      success: true,
      url: publicUrl,
      path: destinationPath
    };
  } catch (error) {
    console.error('Firebase Storage upload error:', error.message);
    throw error;
  }
}

/**
 * Get file download URL
 */
export async function getFileUrl(filePath) {
  try {
    if (!storage) {
      initFirebase();
    }
    if (!storage) {
      throw new Error('Firebase Storage not initialized');
    }

    const bucket = storage.bucket();
    const file = bucket.file(filePath);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491' // Long expiration
    });

    return url;
  } catch (error) {
    console.error('Firebase Storage URL error:', error.message);
    throw error;
  }
}

// تهيئة تلقائية عند الاستيراد
initFirebase();

export default {
  initFirebase,
  getFirestore,
  getStorage,
  getAuth,
  getFirebaseApp,
  verifyIdToken,
  createCustomToken,
  uploadFile,
  getFileUrl
};
