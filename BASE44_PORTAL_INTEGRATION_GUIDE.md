# 🚀 دليل التكامل الكامل - Base44 Portal Integration

## 📋 نظرة عامة

هذا الدليل الشامل لـ **Base44 Developer** لبناء Portal على `zien-ai.app` والاتصال بالـ Backend على `api.zien-ai.app`.

---

## 🏗️ البنية التحتية

### Domains
```
Portal (Base44):     https://zien-ai.app
Backend API:         https://api.zien-ai.app
Backend (Local):     http://localhost:5000
```

---

## 🔐 Authentication & Security

### 1. Portal-to-Backend Authentication

**الطريقة:** `X-Portal-Key` Header

```javascript
// في Base44 Portal
const BACKEND_API_KEY = 'HEADRAREBACK1END0097100201141009563'; // من Base44 Secrets

// في كل API request
fetch('https://api.zien-ai.app/api/translation/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Portal-Key': BACKEND_API_KEY, // ✅ مطلوب
  },
  body: JSON.stringify({ text: 'Hello', targetLanguage: 'ar' })
});
```

### 2. User Authentication (JWT)

**للمستخدمين المسجلين في Portal:**

```javascript
// 1. Register/Login
const response = await fetch('https://api.zien-ai.app/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Portal-Key': BACKEND_API_KEY,
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});

const { token } = await response.json();

// 2. Use token in subsequent requests
fetch('https://api.zien-ai.app/api/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Portal-Key': BACKEND_API_KEY,
    'Authorization': `Bearer ${token}`, // ✅ للمستخدمين المسجلين
  },
  body: JSON.stringify({ message: 'Hello AI' })
});
```

---

## 📡 API Endpoints - Complete List

### ✅ Translation API

```javascript
// 1. Translate single text
POST https://api.zien-ai.app/api/translation/translate
Headers: {
  'Content-Type': 'application/json',
  'X-Portal-Key': BACKEND_API_KEY
}
Body: {
  text: 'Hello World',
  targetLanguage: 'ar', // ar, en, fr, es, de, zh, tr
  sourceLanguage: 'auto' // optional
}
Response: {
  success: true,
  translatedText: 'مرحبا بالعالم',
  sourceLanguage: 'auto-detected',
  targetLanguage: 'ar'
}

// 2. Translate batch
POST https://api.zien-ai.app/api/translation/translate-batch
Body: {
  texts: ['Hello', 'World', 'Welcome'],
  targetLanguage: 'ar'
}

// 3. Detect language
POST https://api.zien-ai.app/api/translation/detect
Body: {
  text: 'مرحبا'
}
```

### ✅ AI Services

```javascript
// 1. AI Chat
POST https://api.zien-ai.app/api/ai/chat
Headers: {
  'Authorization': 'Bearer {JWT_TOKEN}', // ✅ مطلوب
  'X-Portal-Key': BACKEND_API_KEY
}
Body: {
  message: 'Create a React app',
  aiModel: 'gpt', // gpt, gemini, claude
  openaiModel: 'gpt-4o-mini' // optional
}

// 2. Generate Project (NEW ✅)
POST https://api.zien-ai.app/api/ai/generate-project
Headers: {
  'Authorization': 'Bearer {JWT_TOKEN}',
  'X-Portal-Key': BACKEND_API_KEY
}
Body: {
  description: 'E-commerce app with cart and checkout',
  projectType: 'web', // web, mobile, desktop
  framework: 'react' // react, vue, angular, next
}
Response: {
  success: true,
  project: {
    name: 'Generated Project',
    description: '...',
    type: 'web',
    framework: 'react',
    structure: '...' // Detailed project structure
  }
}

// 3. Analyze Image (NEW ✅)
POST https://api.zien-ai.app/api/ai/analyze-image
Headers: {
  'Authorization': 'Bearer {JWT_TOKEN}',
  'X-Portal-Key': BACKEND_API_KEY
}
Body: {
  imageUrl: 'https://example.com/image.jpg',
  // OR
  imageBase64: 'data:image/jpeg;base64,...',
  features: ['all'] // or ['labels', 'text', 'faces', 'objects']
}

// 4. Voice to Text (NEW ✅)
POST https://api.zien-ai.app/api/ai/voice-to-text
Headers: {
  'Authorization': 'Bearer {JWT_TOKEN}',
  'X-Portal-Key': BACKEND_API_KEY
}
Body: {
  audioUrl: 'https://example.com/audio.mp3',
  // OR
  audioBase64: 'data:audio/mp3;base64,...',
  language: 'auto' // auto, ar, en, etc.
}
```

### ✅ Maps & Vision

```javascript
// 1. Geocode address
POST https://api.zien-ai.app/api/maps/geocode
Body: {
  address: 'Dubai, UAE',
  provider: 'apple' // apple, google
}

// 2. Get directions
POST https://api.zien-ai.app/api/maps/route
Body: {
  from: 'Dubai',
  to: 'Abu Dhabi',
  provider: 'apple'
}

// 3. Analyze image
POST https://api.zien-ai.app/api/vision-ai/analyze
Body: {
  imageUrl: 'https://example.com/image.jpg',
  features: ['all']
}
```

### ✅ Build System

```javascript
// 1. Trigger build
POST https://api.zien-ai.app/api/auto-builder/expo/build
Body: {
  projectName: 'my-app',
  platform: 'ios', // ios, android, web, all
  clientId: 'user_123',
  selections: {
    systems: ['auth', 'payment'],
    theme: 'dark',
    font: 'inter'
  }
}

// 2. Get build status
GET https://api.zien-ai.app/api/auto-builder/expo/status/:buildId

// 3. Deliver build (NEW ✅)
POST https://api.zien-ai.app/api/auto-builder/builds/:id/deliver
Body: {
  deliveryDate: '2025-01-15',
  deliveryTime: '14:00',
  projectName: 'My App',
  clientId: 'user_123',
  clientPhone: '+971501234567' // optional
}

// 4. Rollback build (NEW ✅)
POST https://api.zien-ai.app/api/auto-builder/builds/:id/rollback
Body: {
  reason: 'Client requested rollback',
  rollbackToBuildId: 'build_123' // optional
}

// 5. Download build file
GET https://api.zien-ai.app/api/auto-builder/download/:buildId/:filename
```

### ✅ Twilio Communication

```javascript
// 1. Send SMS
POST https://api.zien-ai.app/api/twilio/send-sms
Body: {
  to: '+971501234567',
  message: 'Hello from Portal',
  from: '+1234567890' // optional
}

// 2. Send WhatsApp
POST https://api.zien-ai.app/api/twilio/send-whatsapp
Body: {
  to: '+971501234567',
  message: 'Hello from Portal'
}

// 3. Make call
POST https://api.zien-ai.app/api/twilio/make-call
Body: {
  to: '+971501234567',
  message: 'Hello, this is a call from Portal',
  from: '+1234567890' // optional
}

// 4. Send OTP
POST https://api.zien-ai.app/api/twilio/send-otp
Body: {
  phoneNumber: '+971501234567'
}

// 5. Verify OTP
POST https://api.zien-ai.app/api/twilio/verify-otp
Body: {
  phoneNumber: '+971501234567',
  code: '123456'
}
```

### ✅ Payments (Stripe)

```javascript
// 1. Create payment intent
POST https://api.zien-ai.app/api/payments/create
Headers: {
  'Authorization': 'Bearer {JWT_TOKEN}',
  'X-Portal-Key': BACKEND_API_KEY
}
Body: {
  amount: 1000, // in AED
  currency: 'aed',
  description: 'Portal Payment',
  selections: {
    systems: ['auth', 'payment'],
    theme: 'dark'
  },
  favorites: ['template_1', 'template_2']
}
Response: {
  success: true,
  paymentId: 'payment_123',
  paymentIntentId: 'pi_123',
  clientSecret: 'pi_123_secret_xxx',
  publishableKey: 'pk_test_xxx',
  amount: 1000,
  currency: 'aed'
}

// 2. Get publishable key
GET https://api.zien-ai.app/api/payments/publishable-key
Response: {
  publishableKey: 'pk_test_xxx'
}
```

### ✅ File Management

```javascript
// 1. Upload file
POST https://api.zien-ai.app/api/files/upload
Headers: {
  'Authorization': 'Bearer {JWT_TOKEN}',
  'X-Portal-Key': BACKEND_API_KEY
}
Body: {
  name: 'image.jpg',
  data: 'base64_encoded_data',
  type: 'image/jpeg',
  folder: 'uploads' // optional
}

// 2. Get file
GET https://api.zien-ai.app/api/files/:id

// 3. Delete file
DELETE https://api.zien-ai.app/api/files/:id

// 4. Download file
GET https://api.zien-ai.app/api/files/:id/download
```

---

## 🔌 Real-time Communication (Socket.IO)

### Connection

```javascript
// في Base44 Portal
import io from 'socket.io-client';

const socket = io('https://api.zien-ai.app/client-portal', {
  transports: ['websocket', 'polling'],
  query: {
    portalKey: BACKEND_API_KEY // ✅ مطلوب
  }
});

// Events
socket.on('connect', () => {
  console.log('✅ Connected to Backend');
});

socket.on('build:status', (data) => {
  console.log('Build status:', data);
  // { buildId, status, progress, message }
});

socket.on('build:completed', (data) => {
  console.log('Build completed:', data);
  // { buildId, status, files, downloadUrl }
});

socket.on('build:delivered', (data) => {
  console.log('Build delivered:', data);
  // { buildId, status, deliveryDate, projectName }
});

socket.on('owner:notification', (data) => {
  console.log('Owner notification:', data);
});
```

---

## 🎯 Best Practices للـ Base44

### 1. API Client Utility

**أنشئ utility function في Base44:**

```javascript
// utils/apiClient.js
const BACKEND_API_KEY = 'HEADRAREBACK1END0097100201141009563';
const BACKEND_URL = 'https://api.zien-ai.app';

export async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body, token } = options;
  
  const headers = {
    'Content-Type': 'application/json',
    'X-Portal-Key': BACKEND_API_KEY, // ✅ دائماً
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

// Usage
export const api = {
  translate: (text, targetLang) => 
    apiRequest('/api/translation/translate', {
      method: 'POST',
      body: { text, targetLanguage: targetLang }
    }),
  
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
};
```

### 2. Error Handling

```javascript
try {
  const result = await api.translate('Hello', 'ar');
  console.log(result.translatedText);
} catch (error) {
  if (error.message.includes('401') || error.message.includes('Unauthorized')) {
    // Missing or invalid X-Portal-Key
    console.error('❌ Authentication failed - check BACKEND_API_KEY');
  } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
    // Invalid token
    console.error('❌ Invalid user token - re-login required');
  } else {
    console.error('❌ API Error:', error.message);
  }
}
```

### 3. Environment Variables في Base44

**في Base44 Secrets (Environment Variables):**

```
✅ VITE_BACKEND_API_KEY=HEADRAREBACK1END0097100201141009563
✅ VITE_BACKEND_URL=https://api.zien-ai.app
✅ VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx (من Backend)
✅ VITE_GOOGLE_MAPS_API_KEY=AIza... (للـ Maps في Portal)
```

**في Base44 Code:**

```javascript
// config.js
export const CONFIG = {
  api: {
    baseUrl: import.meta.env.VITE_BACKEND_URL || 'https://api.zien-ai.app',
    apiKey: import.meta.env.VITE_BACKEND_API_KEY || 'HEADRAREBACK1END0097100201141009563',
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  },
  maps: {
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  },
};
```

---

## 🔄 Integration Flow

### 1. User Registration/Login Flow

```javascript
// 1. User registers in Portal
const registerResponse = await apiRequest('/api/auth/register', {
  method: 'POST',
  body: {
    email: 'user@example.com',
    password: 'password123',
    name: 'User Name'
  }
});

// 2. Save token
const { token } = registerResponse;
localStorage.setItem('auth_token', token);

// 3. Use token in all authenticated requests
const chatResponse = await apiRequest('/api/ai/chat', {
  method: 'POST',
  body: { message: 'Hello' },
  token: localStorage.getItem('auth_token')
});
```

### 2. Payment Flow

```javascript
// 1. Create payment intent
const payment = await apiRequest('/api/payments/create', {
  method: 'POST',
  body: {
    amount: 1000,
    currency: 'aed',
    selections: { systems: ['auth'], theme: 'dark' }
  },
  token: userToken
});

// 2. Use Stripe.js in Portal
const stripe = Stripe(payment.publishableKey);
const result = await stripe.confirmCardPayment(payment.clientSecret, {
  payment_method: {
    card: cardElement,
  }
});

// 3. Payment success → Backend automatically triggers build
// Listen for build:status via Socket.IO
```

### 3. Build Request Flow

```javascript
// 1. User selects template/system/theme in Portal
const selections = {
  systems: ['auth', 'payment'],
  theme: 'dark',
  font: 'inter'
};

// 2. User pays (see Payment Flow above)

// 3. After payment, trigger build
const buildResponse = await apiRequest('/api/auto-builder/expo/build', {
  method: 'POST',
  body: {
    projectName: 'my-app',
    platform: 'all',
    clientId: userId,
    selections
  },
  token: userToken
});

// 4. Listen for build status
socket.on('build:status', (data) => {
  updateBuildProgress(data);
});

// 5. When build completes
socket.on('build:completed', (data) => {
  showDownloadLink(data.downloadUrl);
});

// 6. Mark as delivered
await apiRequest(`/api/auto-builder/builds/${buildId}/deliver`, {
  method: 'POST',
  body: {
    deliveryDate: '2025-01-15',
    deliveryTime: '14:00',
    projectName: 'My App',
    clientId: userId,
    clientPhone: '+971501234567'
  },
  token: userToken
});
```

---

## 🛠️ CORS Configuration

**الـ Backend جاهز للـ CORS من `zien-ai.app`:**

```javascript
// ✅ Allowed origins في Backend:
- https://zien-ai.app ✅
- https://www.zien-ai.app ✅
- https://api.zien-ai.app ✅
- https://portal.zien-ai.app ✅
```

**لا حاجة لتعديل CORS - جاهز!**

---

## 📝 Checklist للـ Base44 Developer

### ✅ Setup
- [ ] إضافة `VITE_BACKEND_API_KEY` في Base44 Secrets
- [ ] إضافة `VITE_BACKEND_URL` في Base44 Secrets
- [ ] إضافة `VITE_STRIPE_PUBLISHABLE_KEY` في Base44 Secrets
- [ ] إضافة `VITE_GOOGLE_MAPS_API_KEY` في Base44 Secrets (للـ Maps في Portal)

### ✅ API Integration
- [ ] إنشاء `apiClient.js` utility
- [ ] إضافة `X-Portal-Key` header في كل request
- [ ] إضافة JWT token للمستخدمين المسجلين
- [ ] Error handling شامل

### ✅ Real-time
- [ ] Socket.IO connection
- [ ] Listen for build events
- [ ] Handle connection errors

### ✅ Testing
- [ ] Test Translation API
- [ ] Test AI Chat
- [ ] Test Payment flow
- [ ] Test Build system
- [ ] Test Socket.IO events

---

## 🚨 Common Issues & Solutions

### Issue 1: CORS Error
**Solution:** تأكد من أن `X-Portal-Key` موجود في headers

### Issue 2: 401 Unauthorized
**Solution:** تحقق من `BACKEND_API_KEY` في Base44 Secrets

### Issue 3: 403 Forbidden
**Solution:** تحقق من JWT token للمستخدمين المسجلين

### Issue 4: Socket.IO Connection Failed
**Solution:** تأكد من إضافة `portalKey` في query parameters

---

## 📞 Support

**للأسئلة أو المشاكل:**
- تحقق من `BACKEND_PORTAL_READINESS_REPORT.md` للـ endpoints
- تحقق من `BASE44_ARCHITECTURE_GUIDE.md` للـ architecture
- تحقق من Backend logs في `api.zien-ai.app`

---

**تاريخ الإنشاء:** 2025-01-XX  
**الحالة:** ✅ **جاهز للاستخدام**

