# 📚 Base44 API Reference - Complete Documentation

## 🔗 Base URL
```
https://api.zien-ai.app
```

## 🔐 Authentication

### Portal-to-Backend
**Header:** `X-Portal-Key: HEADRAREBACK1END0097100201141009563`

### User Authentication
**Header:** `Authorization: Bearer {JWT_TOKEN}`

---

## 📡 Endpoints

### Translation

#### `POST /api/translation/translate`
Translate single text.

**Headers:**
```
X-Portal-Key: {BACKEND_API_KEY}
Content-Type: application/json
```

**Body:**
```json
{
  "text": "Hello World",
  "targetLanguage": "ar",
  "sourceLanguage": "auto"
}
```

**Response:**
```json
{
  "success": true,
  "translatedText": "مرحبا بالعالم",
  "sourceLanguage": "auto-detected",
  "targetLanguage": "ar"
}
```

#### `POST /api/translation/translate-batch`
Translate multiple texts.

**Body:**
```json
{
  "texts": ["Hello", "World", "Welcome"],
  "targetLanguage": "ar"
}
```

#### `POST /api/translation/detect`
Detect language.

**Body:**
```json
{
  "text": "مرحبا"
}
```

---

### AI Services

#### `POST /api/ai/chat`
Chat with AI.

**Headers:**
```
X-Portal-Key: {BACKEND_API_KEY}
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Body:**
```json
{
  "message": "Create a React app",
  "aiModel": "gpt",
  "openaiModel": "gpt-4o-mini"
}
```

**Response:**
```json
{
  "success": true,
  "reply": "Here's how to create a React app...",
  "model": "gpt-4o-mini",
  "usage": { "tokens": 150 }
}
```

#### `POST /api/ai/generate-project` ✅ NEW
Generate project structure from description.

**Body:**
```json
{
  "description": "E-commerce app with cart and checkout",
  "projectType": "web",
  "framework": "react"
}
```

**Response:**
```json
{
  "success": true,
  "project": {
    "name": "Generated Project",
    "description": "...",
    "type": "web",
    "framework": "react",
    "structure": "Detailed project structure..."
  }
}
```

#### `POST /api/ai/analyze-image` ✅ NEW
Analyze image.

**Body:**
```json
{
  "imageUrl": "https://example.com/image.jpg",
  "features": ["all"]
}
```

#### `POST /api/ai/voice-to-text` ✅ NEW
Transcribe audio.

**Body:**
```json
{
  "audioUrl": "https://example.com/audio.mp3",
  "language": "auto"
}
```

---

### Build System

#### `POST /api/auto-builder/expo/build`
Trigger build.

**Body:**
```json
{
  "projectName": "my-app",
  "platform": "ios",
  "clientId": "user_123",
  "selections": {
    "systems": ["auth", "payment"],
    "theme": "dark"
  }
}
```

#### `GET /api/auto-builder/expo/status/:buildId`
Get build status.

#### `POST /api/auto-builder/builds/:id/deliver` ✅ NEW
Mark build as delivered.

**Body:**
```json
{
  "deliveryDate": "2025-01-15",
  "deliveryTime": "14:00",
  "projectName": "My App",
  "clientId": "user_123",
  "clientPhone": "+971501234567"
}
```

#### `POST /api/auto-builder/builds/:id/rollback` ✅ NEW
Rollback build.

**Body:**
```json
{
  "reason": "Client requested rollback",
  "rollbackToBuildId": "build_123"
}
```

---

### Payments

#### `POST /api/payments/create`
Create payment intent.

**Headers:**
```
X-Portal-Key: {BACKEND_API_KEY}
Authorization: Bearer {JWT_TOKEN}
```

**Body:**
```json
{
  "amount": 1000,
  "currency": "aed",
  "description": "Portal Payment",
  "selections": {
    "systems": ["auth"],
    "theme": "dark"
  }
}
```

**Response:**
```json
{
  "success": true,
  "paymentId": "payment_123",
  "paymentIntentId": "pi_123",
  "clientSecret": "pi_123_secret_xxx",
  "publishableKey": "pk_test_xxx"
}
```

---

### Twilio

#### `POST /api/twilio/send-sms`
Send SMS.

**Body:**
```json
{
  "to": "+971501234567",
  "message": "Hello from Portal"
}
```

#### `POST /api/twilio/send-whatsapp`
Send WhatsApp.

**Body:**
```json
{
  "to": "+971501234567",
  "message": "Hello from Portal"
}
```

---

## 🔌 Socket.IO Events

### Connection
```javascript
const socket = io('https://api.zien-ai.app/client-portal', {
  query: { portalKey: BACKEND_API_KEY }
});
```

### Events
- `build:status` - Build progress updates
- `build:completed` - Build finished
- `build:delivered` - Build marked as delivered
- `owner:notification` - Owner notifications

---

**تاريخ الإنشاء:** 2025-01-XX

