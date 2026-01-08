# ⚡ Base44 Quick Start Guide

## 🎯 الخطوات السريعة

### 1. Environment Variables في Base44

**في Base44 Dashboard → Environment Variables:**

```
✅ VITE_BACKEND_API_KEY=HEADRAREBACK1END0097100201141009563
✅ VITE_BACKEND_URL=https://api.zien-ai.app
✅ VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx (اسأل Backend owner)
✅ VITE_GOOGLE_MAPS_API_KEY=AIza... (للـ Maps في Portal)
```

### 2. API Client Setup

**أنشئ ملف `utils/apiClient.js`:**

```javascript
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.zien-ai.app';
const BACKEND_API_KEY = import.meta.env.VITE_BACKEND_API_KEY || 'HEADRAREBACK1END0097100201141009563';

export async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body, token } = options;
  
  const headers = {
    'Content-Type': 'application/json',
    'X-Portal-Key': BACKEND_API_KEY, // ✅ دائماً
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
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
  
  createPayment: (amount, selections, token) =>
    apiRequest('/api/payments/create', {
      method: 'POST',
      body: { amount, currency: 'aed', selections },
      token
    }),
};
```

### 3. Socket.IO Setup

**أنشئ ملف `utils/socket.js`:**

```javascript
import io from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.zien-ai.app';
const BACKEND_API_KEY = import.meta.env.VITE_BACKEND_API_KEY || 'HEADRAREBACK1END0097100201141009563';

export const socket = io(`${BACKEND_URL}/client-portal`, {
  transports: ['websocket', 'polling'],
  query: {
    portalKey: BACKEND_API_KEY
  }
});

socket.on('connect', () => {
  console.log('✅ Connected to Backend');
});

socket.on('build:status', (data) => {
  console.log('Build status:', data);
  // Update UI
});

socket.on('build:completed', (data) => {
  console.log('Build completed:', data);
  // Show download link
});
```

### 4. Usage Examples

```javascript
// Translation
const result = await api.translate('Hello', 'ar');
console.log(result.translatedText); // مرحبا

// AI Chat (requires login)
const token = localStorage.getItem('auth_token');
const chat = await api.aiChat('Create a React app', token);
console.log(chat.reply);

// Generate Project
const project = await api.generateProject('E-commerce app', token);
console.log(project.project.structure);

// Payment
const payment = await api.createPayment(1000, { systems: ['auth'] }, token);
// Use Stripe.js with payment.clientSecret
```

---

## 📚 Documentation Files

1. **`BASE44_PORTAL_INTEGRATION_GUIDE.md`** - دليل شامل كامل
2. **`BASE44_API_REFERENCE.md`** - مرجع API كامل
3. **`BACKEND_PORTAL_READINESS_REPORT.md`** - تقرير جاهزية Backend

---

## ✅ Checklist

- [ ] إضافة Environment Variables في Base44
- [ ] إنشاء `apiClient.js`
- [ ] إنشاء `socket.js`
- [ ] Test API connection
- [ ] Test Socket.IO connection

---

**جاهز للبدء! 🚀**

