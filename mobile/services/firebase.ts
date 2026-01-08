/**
 * RARE 4N - Firebase Client Service
 * Firebase Client SDK للـ Mobile App
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getMessaging, Messaging } from 'firebase/messaging';

// Firebase Config (من Environment Variables)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || process.env.GOOGLE_PROJECT_ID || 'valiant-bonbon-479503-p3',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let messaging: Messaging | null = null;

/**
 * Initialize Firebase
 */
export function initFirebase() {
  try {
    // التحقق من وجود Config
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      console.warn('⚠️ Firebase config not found. Firebase features will be disabled.');
      return null;
    }

    // إذا كان Firebase معطل بالفعل، لا تعيد التهيئة
    if (app) {
      return app;
    }

    // التحقق من وجود App موجود
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      app = initializeApp(firebaseConfig);
    }

    // تهيئة الخدمات
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Messaging (فقط في Web)
    if (typeof window !== 'undefined') {
      try {
        messaging = getMessaging(app);
      } catch (error) {
        console.warn('⚠️ Firebase Messaging not available:', error);
      }
    }

    console.log('✅ Firebase Client initialized successfully');
    return app;
  } catch (error: any) {
    console.error('❌ Firebase initialization error:', error.message);
    console.warn('⚠️ Firebase features will be disabled');
    return null;
  }
}

/**
 * Get Auth instance
 */
export function getFirebaseAuth() {
  if (!app) {
    initFirebase();
  }
  return auth;
}

/**
 * Get Firestore instance
 */
export function getFirebaseFirestore() {
  if (!app) {
    initFirebase();
  }
  return db;
}

/**
 * Get Storage instance
 */
export function getFirebaseStorage() {
  if (!app) {
    initFirebase();
  }
  return storage;
}

/**
 * Get Messaging instance
 */
export function getFirebaseMessaging() {
  if (!app) {
    initFirebase();
  }
  return messaging;
}

/**
 * Get Firebase App instance
 */
export function getFirebaseApp() {
  if (!app) {
    initFirebase();
  }
  return app;
}

// تهيئة تلقائية
initFirebase();

export default {
  initFirebase,
  getFirebaseAuth,
  getFirebaseFirestore,
  getFirebaseStorage,
  getFirebaseMessaging,
  getFirebaseApp
};
