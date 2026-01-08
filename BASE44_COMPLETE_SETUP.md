# 🎯 Base44 Complete Setup - دليل التكامل الكامل

## ✅ ما تم إنجازه

### 1. Backend Endpoints ✅
- ✅ إضافة `/api/ai/generate-project` - توليد مشروع من وصف
- ✅ إضافة `/api/ai/analyze-image` - تحليل الصور
- ✅ إضافة `/api/ai/voice-to-text` - تحويل الصوت لنص
- ✅ إضافة `/api/auto-builder/builds/:id/deliver` - تسليم البناء
- ✅ إضافة `/api/auto-builder/builds/:id/rollback` - إرجاع البناء

### 2. CORS Configuration ✅
- ✅ إضافة `https://zien-ai.app` للـ allowed origins
- ✅ إضافة `https://www.zien-ai.app` للـ allowed origins

### 3. Documentation ✅
- ✅ `BASE44_PORTAL_INTEGRATION_GUIDE.md` - دليل شامل كامل
- ✅ `BASE44_API_REFERENCE.md` - مرجع API
- ✅ `BASE44_QUICK_START.md` - دليل سريع
- ✅ `BACKEND_PORTAL_READINESS_REPORT.md` - تقرير الجاهزية

---

## 🚀 الخطوات للـ Base44 Developer

### Step 1: Environment Variables

**في Base44 Dashboard → Environment Variables:**

```
VITE_BACKEND_API_KEY=HEADRAREBACK1END0097100201141009563
VITE_BACKEND_URL=https://api.zien-ai.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx (اسأل Backend owner)
VITE_GOOGLE_MAPS_API_KEY=AIza... (للـ Maps في Portal)
```

### Step 2: API Client

**أنشئ `utils/apiClient.js`:**

```javascript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.zien-ai.app';
const BACKEND_API_KEY = import.meta.env.VITE_BACKEND_API_KEY || 'HEADRAREBACK1END0097100201141009563';

export async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body, token } = options;
  
  const headers = {
    'Content-Type': 'application/json',
    'X-Portal-Key': BACKEND_API_KEY, // ✅ دائماً مطلوب
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`; // ✅ للمستخدمين المسجلين
  }
  
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || 'API Error');
  }
  
  return response.json();
}

// Helper functions
export const api = {
  // Translation
  translate: (text, targetLang) => 
    apiRequest('/api/translation/translate', {
      method: 'POST',
      body: { text, targetLanguage: targetLang }
    }),
  
  // AI
  aiChat: (message, token) =>
    apiRequest('/api/ai/chat', {
      method: 'POST',
      body: { message },
      token
    }),
  
  generateProject: (description, token) =>
    apiRequest('/api/ai/generate-project', {
      method: 'POST',
      body: { description, projectType: 'web', framework: 'react' },
      token
    }),
  
  analyzeImage: (imageUrl, token) =>
    apiRequest('/api/ai/analyze-image', {
      method: 'POST',
      body: { imageUrl, features: ['all'] },
      token
    }),
  
  voiceToText: (audioBase64, token) =>
    apiRequest('/api/ai/voice-to-text', {
      method: 'POST',
      body: { audioBase64, language: 'auto' },
      token
    }),
  
  // Payments
  createPayment: (amount, selections, token) =>
    apiRequest('/api/payments/create', {
      method: 'POST',
      body: { amount, currency: 'aed', selections },
      token
    }),
  
  // Build System
  triggerBuild: (projectName, platform, selections, token) =>
    apiRequest('/api/auto-builder/expo/build', {
      method: 'POST',
      body: { projectName, platform, selections },
      token
    }),
  
  deliverBuild: (buildId, deliveryData, token) =>
    apiRequest(`/api/auto-builder/builds/${buildId}/deliver`, {
      method: 'POST',
      body: deliveryData,
      token
    }),
  
  rollbackBuild: (buildId, reason, token) =>
    apiRequest(`/api/auto-builder/builds/${buildId}/rollback`, {
      method: 'POST',
      body: { reason },
      token
    }),
  
  // Twilio
  sendSMS: (to, message) =>
    apiRequest('/api/twilio/send-sms', {
      method: 'POST',
      body: { to, message }
    }),
  
  sendWhatsApp: (to, message) =>
    apiRequest('/api/twilio/send-whatsapp', {
      method: 'POST',
      body: { to, message }
    }),
};
```

### Step 3: Socket.IO

**أنشئ `utils/socket.js`:**

```javascript
import io from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.zien-ai.app';
const BACKEND_API_KEY = import.meta.env.VITE_BACKEND_API_KEY || 'HEADRAREBACK1END0097100201141009563';

export const socket = io(`${BACKEND_URL}/client-portal`, {
  transports: ['websocket', 'polling'],
  query: { portalKey: BACKEND_API_KEY }
});

socket.on('connect', () => {
  console.log('✅ Connected to Backend');
});

socket.on('build:status', (data) => {
  console.log('Build status:', data);
  // Update UI with build progress
});

socket.on('build:completed', (data) => {
  console.log('Build completed:', data);
  // Show download link
});

socket.on('build:delivered', (data) => {
  console.log('Build delivered:', data);
  // Update UI
});

export default socket;
```

---

## 📋 API Endpoints Summary

### ✅ Available Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/translation/translate` | POST | X-Portal-Key | ترجمة نص |
| `/api/translation/translate-batch` | POST | X-Portal-Key | ترجمة متعددة |
| `/api/translation/detect` | POST | X-Portal-Key | كشف اللغة |
| `/api/ai/chat` | POST | X-Portal-Key + JWT | محادثة AI |
| `/api/ai/generate-project` | POST | X-Portal-Key + JWT | توليد مشروع |
| `/api/ai/analyze-image` | POST | X-Portal-Key + JWT | تحليل صورة |
| `/api/ai/voice-to-text` | POST | X-Portal-Key + JWT | صوت لنص |
| `/api/payments/create` | POST | X-Portal-Key + JWT | إنشاء payment |
| `/api/auto-builder/expo/build` | POST | X-Portal-Key + JWT | trigger build |
| `/api/auto-builder/builds/:id/deliver` | POST | X-Portal-Key + JWT | تسليم build |
| `/api/auto-builder/builds/:id/rollback` | POST | X-Portal-Key + JWT | إرجاع build |
| `/api/twilio/send-sms` | POST | X-Portal-Key | إرسال SMS |
| `/api/twilio/send-whatsapp` | POST | X-Portal-Key | إرسال WhatsApp |

---

## 🔐 Authentication Flow

### 1. Portal-to-Backend (Always Required)
```javascript
headers: {
  'X-Portal-Key': BACKEND_API_KEY
}
```

### 2. User Authentication (For Protected Endpoints)
```javascript
// 1. Register/Login
const { token } = await apiRequest('/api/auth/login', {
  method: 'POST',
  body: { email, password }
});

// 2. Use token
headers: {
  'X-Portal-Key': BACKEND_API_KEY,
  'Authorization': `Bearer ${token}`
}
```

---

## 🎯 Integration Examples

### Example 1: Translation
```javascript
const result = await api.translate('Hello', 'ar');
console.log(result.translatedText); // مرحبا
```

### Example 2: AI Chat
```javascript
const token = localStorage.getItem('auth_token');
const chat = await api.aiChat('Create a React app', token);
console.log(chat.reply);
```

### Example 3: Generate Project
```javascript
const project = await api.generateProject('E-commerce app', token);
console.log(project.project.structure);
```

### Example 4: Payment Flow
```javascript
// 1. Create payment
const payment = await api.createPayment(1000, { systems: ['auth'] }, token);

// 2. Use Stripe.js
const stripe = Stripe(payment.publishableKey);
const result = await stripe.confirmCardPayment(payment.clientSecret, {
  payment_method: { card: cardElement }
});

// 3. Listen for build status
socket.on('build:status', (data) => {
  updateProgress(data);
});
```

---

## ✅ Checklist

- [ ] إضافة Environment Variables في Base44
- [ ] إنشاء `apiClient.js`
- [ ] إنشاء `socket.js`
- [ ] Test API connection
- [ ] Test Socket.IO connection
- [ ] Test Translation
- [ ] Test AI Chat
- [ ] Test Payment flow
- [ ] Test Build system

---

## 📚 Documentation Files

1. **`BASE44_PORTAL_INTEGRATION_GUIDE.md`** - دليل شامل كامل (اقرأه أولاً)
2. **`BASE44_API_REFERENCE.md`** - مرجع API كامل
3. **`BASE44_QUICK_START.md`** - دليل سريع
4. **`BACKEND_PORTAL_READINESS_REPORT.md`** - تقرير جاهزية Backend

---

## 🚨 Important Notes

1. **X-Portal-Key مطلوب دائماً** في كل request
2. **JWT Token مطلوب** للـ endpoints المحمية (AI, Payments, Builds)
3. **CORS جاهز** - لا حاجة لتعديل
4. **Socket.IO** يستخدم `portalKey` في query parameters

---

**جاهز للبدء! 🚀**

**تاريخ الإنشاء:** 2025-01-XX  
**الحالة:** ✅ **جاهز 100%**

