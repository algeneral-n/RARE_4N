# RARE 4N - Architecture Guide for Base44 AI
## دليل البنية المعمارية - الربط بين Portal, Backend, Mobile

---

## 📋 جدول المحتويات

1. [البنية العامة](#البنية-العامة)
2. [Client Portal](#client-portal)
3. [Backend API](#backend-api)
4. [Mobile App](#mobile-app)
5. [الربط بين المكونات](#الربط-بين-المكونات)
6. [API Endpoints](#api-endpoints)
7. [Socket.IO Namespaces](#socketio-namespaces)
8. [Environment Variables](#environment-variables)
9. [Services Integration](#services-integration)

---

## 🏗️ البنية العامة

```
RARE_4N/
├── apps/
│   ├── client-portal/          # Client Portal (Web)
│   │   ├── index.html
│   │   ├── app-new.js
│   │   ├── config.js
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── backend/                # Backend API Server
│   │   ├── src/
│   │   │   ├── server.js       # ⭐ Main Server Entry
│   │   │   ├── routes/         # API Routes
│   │   │   ├── services/       # Business Logic
│   │   │   ├── database/       # DB Connections
│   │   │   └── core/           # Core Systems
│   │   └── .env                # Environment Variables
│   │
│   └── mobile/                 # Mobile App (React Native + Expo)
│       ├── app/                # Expo Router Pages
│       ├── components/          # React Components
│       ├── services/           # API Services
│       ├── core/               # Core Systems (Kernel, Cognitive Loop)
│       └── hooks/              # Custom Hooks
│
└── ecosystem.config.cjs        # PM2 Configuration
```

---

## 🌐 Client Portal

### الملفات الأساسية

#### 1. `apps/client-portal/index.html`
- **الدور**: نقطة الدخول الرئيسية للبورتال
- **المحتوى**: HTML structure + script tags
- **الربط**: يستدعي `app-new.js` و `config.js`

#### 2. `apps/client-portal/app-new.js`
- **الدور**: Application Logic الرئيسي
- **المحتوى**:
  - Router (صفحات البورتال)
  - State Management
  - API Calls إلى Backend
  - Socket.IO Client للـ Real-time
- **الربط**: 
  - `API_URL` من `config.js`
  - Socket.IO: `wss://api.zien-ai.app/client-portal`

#### 3. `apps/client-portal/config.js`
- **الدور**: Configuration & Environment Variables
- **المحتوى**:
  ```javascript
  const API_URL = 'https://api.zien-ai.app';
  const WS_BASE = 'wss://api.zien-ai.app';
  const STRIPE_PUBLISHABLE_KEY = 'pk_...';
  const SUPABASE_URL = 'https://...';
  const ELEVENLABS_AGENT_ID = 'agent_...';
  ```

#### 4. `apps/client-portal/services/`
- `ClientPortalAgent.js` - ElevenLabs Agent Integration
- `TranslationService.js` - Google Translation API
- `PaymentService.js` - Stripe Integration

---

## 🔧 Backend API

### الملفات الأساسية

#### 1. `apps/backend/src/server.js` ⭐ **الأهم**
- **الدور**: Main Server Entry Point
- **المحتوى**:
  - Express App Setup
  - CORS Configuration
  - Socket.IO Server
  - Route Registration
  - Database Initialization
  - Middleware (Rate Limiting, Security, Sanitization)
- **الربط**:
  - Routes: `/api/*`
  - Socket.IO Namespaces: `/client-portal`, `/auto-builder`, `/voice/realtime`
  - Static Files: `/client-portal/*` → serves `apps/client-portal/`

#### 2. `apps/backend/src/routes/` - API Routes

##### `mcp.js` - Model Context Protocol (ElevenLabs)
- **Endpoint**: `GET/POST /api/mcp`
- **الدور**: MCP Server للـ ElevenLabs Agent
- **الربط**: ElevenLabs Dashboard → Backend Tools

##### `elevenlabs-webhook.js` - ElevenLabs Webhooks
- **Endpoint**: `POST /api/elevenlabs-webhook/webhook`
- **الدور**: استقبال Events من ElevenLabs
- **Events**: `conversation.started`, `conversation.message`, `agent.tool_call`, `agent.action`
- **الربط**: ElevenLabs → Backend → Twilio/Socket.IO

##### `translation.js` - Google Translation API
- **Endpoints**:
  - `POST /api/translation/translate` - ترجمة نص واحد
  - `POST /api/translation/translate-batch` - ترجمة متعددة
  - `POST /api/translation/detect` - كشف اللغة
- **الربط**: Portal/Mobile → Backend → Google Translation API

##### `payment.js` - Stripe Payments
- **Endpoints**:
  - `POST /api/payments/create-intent` - إنشاء Payment Intent
  - `POST /api/payments/webhook` - Stripe Webhook
  - `POST /api/payments/apple-pay` - Apple Pay
- **الربط**: Portal → Backend → Stripe → Auto-Builder

##### `auto-builder.js` - Auto Builder System
- **Endpoints**:
  - `POST /api/auto-builder/expo/build` - Build iOS/Android/Web
  - `POST /api/auto-builder/github/create` - إنشاء GitHub Repo
  - `GET /api/auto-builder/status` - Build Status
- **الربط**: Portal/Mobile → Backend → Expo EAS → GitHub

##### `voice-realtime.js` - Voice Realtime Processing
- **Socket.IO Namespace**: `/voice/realtime`
- **الدور**: Real-time Voice Processing (Whisper + ElevenLabs + GPT)
- **الربط**: Mobile → Socket.IO → Backend → AI Services

##### `client-portal.js` - Client Portal API
- **Endpoints**: `/api/client-portal/*`
- **Socket.IO Namespace**: `/client-portal`
- **الدور**: Portal-specific API & Real-time Updates

#### 3. `apps/backend/src/services/` - Business Logic

##### `twilioService.js`
- **الدور**: Twilio Integration (SMS, WhatsApp, Voice)
- **Functions**:
  - `sendSMS(to, message)`
  - `sendWhatsApp(to, message)`
  - `makePhoneCall(to, message)`
  - `sendOTP(phoneNumber)`
  - `verifyOTP(phoneNumber, code)`

##### `translationService.js`
- **الدور**: Google Translation API Wrapper
- **Functions**:
  - `translateText(text, targetLanguage, sourceLanguage)`
  - `translateBatch(texts, targetLanguage, sourceLanguage)`
  - `detectLanguage(text)`

##### `elevenLabsAgentService.js`
- **الدور**: ElevenLabs Agent API
- **Functions**:
  - `createConversation(agentId, context)`
  - `sendMessage(conversationId, message)`

##### `agentTools.js`
- **الدور**: Agent Tools (Payment, Builder, Twilio, Owner Commands)
- **Functions**:
  - `createPayment(requestId, amount, currency, clientId, clientEmail)`
  - `submitToBuilder(clientId, requestData, io)`
  - `notifyOwnerViaTwilio(reason, priority)`
  - `executeOwnerCommand(command, context)`

#### 4. `apps/backend/src/database/` - Database Connections

##### `mongodb.js`
- **الدور**: MongoDB Connection
- **Collections**: `conversations`, `user_commands`, `user_profiles`
- **الربط**: Backend → MongoDB Atlas

##### `supabase.js`
- **الدور**: Supabase Client
- **Tables**: `user_profiles`, `user_commands`, `conversations`
- **الربط**: Backend → Supabase

##### `localDB.js`
- **الدور**: SQLite Local Database
- **الربط**: Backend → Local SQLite File

---

## 📱 Mobile App

### الملفات الأساسية

#### 1. `mobile/app/_layout.tsx` ⭐ **الأهم**
- **الدور**: Root Layout (Expo Router)
- **المحتوى**:
  - `LanguageProvider` - Language Context
  - `VoiceProvider` - Voice Context
  - `ErrorBoundary` - Error Handling
  - `RAREKernel` Initialization
  - `CognitiveLoop` Initialization
  - `VoiceGlobalService` Initialization

#### 2. `mobile/app/home.tsx`
- **الدور**: Home Screen
- **المحتوى**:
  - Menu Button → `MenuDrawer`
  - Voice Activation Button
  - App Sections (Builder, Generator, Vault, etc.)
  - `listLayoutManager` - Dynamic List Layouts
- **الربط**: 
  - `useMenu()` - Menu State
  - `useVoice()` - Voice State
  - `useTheme()` - Theme
  - `useTranslation()` - Translation

#### 3. `mobile/app/app-builder.tsx`
- **الدور**: App Builder Screen
- **المحتوى**:
  - Terminal Interface
  - Build Commands (iOS, Android, Web)
  - Client Requests Management
  - Build History
- **الربط**:
  - Socket.IO: `wss://api.zien-ai.app/auto-builder`
  - API: `/api/auto-builder/*`
  - `BuilderStatusCenter` Component

#### 4. `mobile/app/ultimate assisstant.tsx`
- **الدور**: Ultimate Assistant Screen
- **المحتوى**:
  - Ambient Sensing Toggle
  - Neural Voice Link
  - WhatsApp/Email/Voice Call Integration
- **الربط**:
  - `UltimateAssistantService` - Twilio Integration
  - `CommunicationAnalyzer` - Message Analysis
  - `PortalStreamAccess` - Portal Real-time Stream

#### 5. `mobile/app/sos.tsx`
- **الدور**: SOS Emergency Screen
- **المحتوى**:
  - SOS Activation Button
  - Threat Level Detection
  - Emergency Contacts
- **الربط**:
  - `SOSService` - Emergency Twilio Integration
  - `RiskDetectionService` - Risk Analysis
  - `EmergencyContactsService` - Contacts Management

#### 6. `mobile/services/` - API Services

##### `config.ts`
- **الدور**: API Configuration
- **المحتوى**:
  ```typescript
  export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.zien-ai.app';
  export const WS_BASE = API_URL;
  ```

##### `translationService.ts`
- **الدور**: Translation Service (Mobile)
- **الربط**: Mobile → Backend `/api/translation/*` → Google Translation API

##### `UltimateAssistantService.ts`
- **الدور**: Ultimate Assistant Twilio Integration
- **Endpoints**: `/api/ultimate-assistant/twilio/*`

##### `SOSService.ts`
- **الدور**: SOS Emergency Service
- **Endpoints**: `/api/sos/twilio/*`

##### `MultiAIGenerator.ts`
- **الدور**: Multi-AI Generation (GPT + Gemini + Claude)
- **Endpoints**: `/api/generator/multi-ai`

##### `MultiAICodex.ts`
- **الدور**: Multi-AI Code Generation
- **Endpoints**: `/api/codex/generate`

##### `GoogleOAuthService.ts`
- **الدور**: Google OAuth Sign-in
- **Endpoints**: `/api/auth/google/*`

##### `GoogleServices.ts`
- **الدور**: Google Services (Dialogflow, Natural Language, Cloud Storage, Security Scanner, Tenor)
- **Endpoints**: `/api/google/*`

#### 7. `mobile/core/` - Core Systems

##### `RAREKernel.ts`
- **الدور**: Core Event System
- **المحتوى**: Event Emitter, State Management
- **الربط**: جميع الصفحات → Kernel → Cognitive Loop

##### `CognitiveLoop.ts`
- **الدور**: Cognitive Processing Loop
- **الربط**: Kernel → Cognitive Loop → AI Services

##### `services/VoiceConsciousness.ts`
- **الدور**: Real-time Voice Consciousness
- **الربط**: Mobile → Socket.IO `/voice/realtime` → Backend → AI Services

#### 8. `mobile/components/` - Components

##### `MenuDrawer.tsx`
- **الدور**: Side Menu Drawer
- **الربط**: `useMenu()` Hook

##### `BuilderStatusCenter.tsx`
- **الدور**: Build Status Display
- **الربط**: Backend `/api/auto-builder/status`

##### `PaymentModal.tsx`
- **الدور**: Payment Modal (Stripe & Apple Pay)
- **الربط**: Backend `/api/payments/*`

---

## 🔗 الربط بين المكونات

### 1. Portal ↔ Backend

#### HTTP API
```
Portal (app-new.js)
  ↓ fetch()
Backend (server.js)
  ↓ routes/
  → /api/translation/*
  → /api/payments/*
  → /api/auto-builder/*
  → /api/client-portal/*
```

#### Socket.IO
```
Portal (app-new.js)
  ↓ io('/client-portal')
Backend (server.js)
  ↓ io.of('/client-portal')
  → Real-time Updates
  → Owner Notifications
  → Build Status
```

### 2. Mobile ↔ Backend

#### HTTP API
```
Mobile (services/*.ts)
  ↓ fetch(API_URL + '/api/*')
Backend (server.js)
  ↓ routes/
  → /api/translation/*
  → /api/ultimate-assistant/*
  → /api/sos/*
  → /api/generator/*
  → /api/codex/*
  → /api/google/*
```

#### Socket.IO
```
Mobile (core/services/VoiceConsciousness.ts)
  ↓ io('/voice/realtime')
Backend (server.js)
  ↓ io.of('/voice/realtime')
  → Real-time Voice Processing
  → Whisper Transcription
  → ElevenLabs TTS
  → GPT Responses
```

### 3. Portal ↔ Mobile (via Backend)

```
Portal (ClientPortalAgent.js)
  ↓ ElevenLabs Agent
Backend (elevenlabs-webhook.js)
  ↓ Tool Calls
  → create_payment
  → submit_to_builder
  → send_twilio_message
Mobile (app-builder.tsx)
  ↓ Socket.IO
Backend (auto-builder namespace)
  → Build Status Updates
  → Client Requests
```

---

## 📡 API Endpoints

### Translation
- `POST /api/translation/translate` - ترجمة نص واحد
- `POST /api/translation/translate-batch` - ترجمة متعددة
- `POST /api/translation/detect` - كشف اللغة

### Payments
- `POST /api/payments/create-intent` - إنشاء Payment Intent
- `POST /api/payments/webhook` - Stripe Webhook
- `POST /api/payments/apple-pay` - Apple Pay

### Auto Builder
- `POST /api/auto-builder/expo/build` - Build iOS/Android/Web
- `POST /api/auto-builder/github/create` - إنشاء GitHub Repo
- `GET /api/auto-builder/status` - Build Status
- `GET /api/auto-builder/repo-status` - Repo Status
- `GET /api/auto-builder/portal-status` - Portal Status

### Ultimate Assistant
- `POST /api/ultimate-assistant/twilio/whatsapp` - Send WhatsApp
- `POST /api/ultimate-assistant/twilio/sms` - Send SMS
- `POST /api/ultimate-assistant/twilio/call` - Make Call
- `POST /api/ultimate-assistant/analyze-email` - Analyze Email
- `POST /api/ultimate-assistant/analyze-whatsapp` - Analyze WhatsApp
- `POST /api/ultimate-assistant/analyze-sms` - Analyze SMS
- `POST /api/ultimate-assistant/summarize` - Summarize Messages

### SOS
- `POST /api/sos/twilio/whatsapp` - Emergency WhatsApp
- `POST /api/sos/twilio/sms` - Emergency SMS
- `POST /api/sos/twilio/call` - Emergency Call
- `POST /api/sos/risk-detection` - Risk Detection
- `POST /api/sos/threat-analysis` - Threat Analysis

### Generator & Codex
- `POST /api/generator/multi-ai` - Multi-AI Generation
- `POST /api/generator/compare` - Compare AI Results
- `POST /api/codex/generate` - Generate Code
- `POST /api/codex/compare` - Compare Code

### Google Services
- `POST /api/google/dialogflow/intent` - Dialogflow Intent
- `POST /api/google/natural-language/sentiment` - Sentiment Analysis
- `POST /api/google/natural-language/entities` - Entity Extraction
- `POST /api/google/cloud-storage/upload` - Upload File
- `GET /api/google/cloud-storage/download` - Download File
- `POST /api/google/security-scanner/scan` - Security Scan
- `GET /api/google/tenor/search` - Search GIFs

### Auth
- `POST /api/auth/google/signin` - Google Sign-in
- `POST /api/auth/google/signout` - Google Sign-out

### MCP (ElevenLabs)
- `GET /api/mcp` - SSE Connection
- `POST /api/mcp` - JSON-RPC 2.0 Tool Calls

### ElevenLabs Webhook
- `POST /api/elevenlabs-webhook/webhook` - ElevenLabs Events

---

## 🔌 Socket.IO Namespaces

### `/client-portal`
- **الاستخدام**: Portal Real-time Updates
- **Events**:
  - `client:register` - Register Client
  - `client:registered` - Registration Confirmation
  - `owner:notification` - Owner Notifications
  - `build:status` - Build Status Updates

### `/auto-builder`
- **الاستخدام**: Auto Builder Real-time
- **Events**:
  - `client:request` - New Build Request
  - `build:started` - Build Started
  - `build:progress` - Build Progress
  - `build:completed` - Build Completed
  - `build:files` - Build Files Available
  - `payment:completed` - Payment Completed

### `/voice/realtime`
- **الاستخدام**: Real-time Voice Processing
- **Events**:
  - `audio-input` - Audio Input
  - `transcription` - Transcription Result
  - `assistant-response-text` - Assistant Text Response
  - `assistant-audio` - Assistant Audio Response
  - `consciousness:update` - Consciousness Update

---

## 🔐 Environment Variables

### Backend (`apps/backend/.env`)

#### Database
```env
MONGODB_URI=mongodb+srv://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
```

#### AI Services
```env
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
ELEVENLABS_API_KEY=...
ELEVENLABS_CONVAI_AGENT_ID=agent_...
ELEVENLABS_OWNER_VOICE_ID=6ZVgc4q9LWAloWbuwjuu
ELEVENLABS_WEBHOOK_SECRET=...
ELEVENLABS_INTEGRATION_ID=...
```

#### Payment
```env
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Twilio
```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+14155238886
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_VERIFY_SERVICE_SID=VA...
```

#### Server
```env
PORT=5000
NODE_ENV=production
API_DOMAIN=https://api.zien-ai.app
CLIENT_PORTAL_URL=https://portal.zien-ai.app
BACKEND_API_KEY=your-secure-random-key-here-min-32-chars
```

### Mobile (`mobile/.env` or EAS Secrets)

```env
EXPO_PUBLIC_API_URL=https://api.zien-ai.app
EXPO_PUBLIC_SUPABASE_URL=https://...
EXPO_PUBLIC_SUPABASE_KEY=...
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
EXPO_PUBLIC_ELEVENLABS_AGENT_ID=agent_...
```

---

## 🔄 Services Integration

### Flow Examples

#### 1. Payment Flow
```
Portal (ClientPortalAgent.js)
  → User selects systems/themes
  → Agent calls create_payment tool
Backend (elevenlabs-webhook.js)
  → agentTools.createPayment()
  → Stripe Payment Intent created
  → Socket.IO emit to /auto-builder
Mobile (app-builder.tsx)
  → Socket.IO receives client:request
  → Shows in terminal
  → Build starts automatically
```

#### 2. Voice Flow
```
Mobile (VoiceConsciousness.ts)
  → User speaks
  → Socket.IO emit audio-input
Backend (voice-realtime.js)
  → Whisper transcription
  → GPT conscious response
  → ElevenLabs TTS
  → Socket.IO emit assistant-audio
Mobile (VoiceConsciousness.ts)
  → Receives audio response
  → Plays audio
```

#### 3. Translation Flow
```
Portal/Mobile (translationService.ts)
  → translateText('Hello', 'ar')
  → fetch('/api/translation/translate')
Backend (translation.js)
  → translationService.translateText()
  → Google Translation API
  → Returns translated text
Portal/Mobile
  → Updates UI with translation
```

#### 4. Build Flow
```
Portal/Mobile (app-builder.tsx)
  → User runs 'eas build --platform ios'
  → fetch('/api/auto-builder/expo/build')
Backend (auto-builder.js)
  → Expo EAS Build API
  → GitHub Integration
  → Cloudflare Pages Deployment
  → Socket.IO emit build:status
Portal/Mobile
  → Shows build progress
  → Receives build files
```

---

## 📝 ملاحظات مهمة

1. **جميع المفاتيح الحساسة في Backend فقط** - لا توجد في Portal أو Mobile
2. **Socket.IO للـ Real-time** - Portal و Mobile يستخدمان Socket.IO للـ Real-time Updates
3. **ElevenLabs Agent** - يتصل بالـ Backend عبر MCP Protocol
4. **Translation** - جميع النصوص تترجم تلقائياً عبر Google Translation API
5. **Payment** - Stripe Integration مع Webhooks للـ Auto-Builder
6. **Voice** - Real-time Voice Processing عبر Socket.IO Namespace `/voice/realtime`
7. **Build System** - Expo EAS Build مع GitHub Integration و Cloudflare Pages

---

## 🎯 نقاط الربط الرئيسية

### 1. Portal → Backend
- **HTTP**: `fetch(API_URL + '/api/*')`
- **Socket.IO**: `io(API_URL + '/client-portal')`
- **Config**: `apps/client-portal/config.js`

### 2. Mobile → Backend
- **HTTP**: `fetch(API_URL + '/api/*')` (from `mobile/services/config.ts`)
- **Socket.IO**: `io(API_URL + '/voice/realtime')` (from `VoiceConsciousness.ts`)
- **Config**: `mobile/services/config.ts`

### 3. ElevenLabs → Backend
- **MCP**: `GET/POST https://api.zien-ai.app/api/mcp`
- **Webhook**: `POST https://api.zien-ai.app/api/elevenlabs-webhook/webhook`

### 4. Stripe → Backend
- **Webhook**: `POST https://api.zien-ai.app/api/payments/webhook`

---

## ✅ Checklist للربط الصحيح

- [ ] Backend `.env` يحتوي على جميع المفاتيح
- [ ] Portal `config.js` يحتوي على `API_URL` و `STRIPE_PUBLISHABLE_KEY`
- [ ] Mobile `config.ts` يحتوي على `EXPO_PUBLIC_API_URL`
- [ ] Socket.IO Namespaces مسجلة في `server.js`
- [ ] Routes مسجلة في `registerRoutes()` في `server.js`
- [ ] CORS configured للسماح بـ Portal و Mobile origins
- [ ] ElevenLabs MCP Server configured في Dashboard
- [ ] Stripe Webhook configured في Stripe Dashboard
- [ ] Cloudflare Tunnel running للـ Backend
- [ ] PM2 running Backend process

---

**آخر تحديث**: 2025-01-01
**الإصدار**: 1.0.0

## دليل البنية المعمارية - الربط بين Portal, Backend, Mobile

---

## 📋 جدول المحتويات

1. [البنية العامة](#البنية-العامة)
2. [Client Portal](#client-portal)
3. [Backend API](#backend-api)
4. [Mobile App](#mobile-app)
5. [الربط بين المكونات](#الربط-بين-المكونات)
6. [API Endpoints](#api-endpoints)
7. [Socket.IO Namespaces](#socketio-namespaces)
8. [Environment Variables](#environment-variables)
9. [Services Integration](#services-integration)

---

## 🏗️ البنية العامة

```
RARE_4N/
├── apps/
│   ├── client-portal/          # Client Portal (Web)
│   │   ├── index.html
│   │   ├── app-new.js
│   │   ├── config.js
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   │
│   ├── backend/                # Backend API Server
│   │   ├── src/
│   │   │   ├── server.js       # ⭐ Main Server Entry
│   │   │   ├── routes/         # API Routes
│   │   │   ├── services/       # Business Logic
│   │   │   ├── database/       # DB Connections
│   │   │   └── core/           # Core Systems
│   │   └── .env                # Environment Variables
│   │
│   └── mobile/                 # Mobile App (React Native + Expo)
│       ├── app/                # Expo Router Pages
│       ├── components/          # React Components
│       ├── services/           # API Services
│       ├── core/               # Core Systems (Kernel, Cognitive Loop)
│       └── hooks/              # Custom Hooks
│
└── ecosystem.config.cjs        # PM2 Configuration
```

---

## 🌐 Client Portal

### الملفات الأساسية

#### 1. `apps/client-portal/index.html`
- **الدور**: نقطة الدخول الرئيسية للبورتال
- **المحتوى**: HTML structure + script tags
- **الربط**: يستدعي `app-new.js` و `config.js`

#### 2. `apps/client-portal/app-new.js`
- **الدور**: Application Logic الرئيسي
- **المحتوى**:
  - Router (صفحات البورتال)
  - State Management
  - API Calls إلى Backend
  - Socket.IO Client للـ Real-time
- **الربط**: 
  - `API_URL` من `config.js`
  - Socket.IO: `wss://api.zien-ai.app/client-portal`

#### 3. `apps/client-portal/config.js`
- **الدور**: Configuration & Environment Variables
- **المحتوى**:
  ```javascript
  const API_URL = 'https://api.zien-ai.app';
  const WS_BASE = 'wss://api.zien-ai.app';
  const STRIPE_PUBLISHABLE_KEY = 'pk_...';
  const SUPABASE_URL = 'https://...';
  const ELEVENLABS_AGENT_ID = 'agent_...';
  ```

#### 4. `apps/client-portal/services/`
- `ClientPortalAgent.js` - ElevenLabs Agent Integration
- `TranslationService.js` - Google Translation API
- `PaymentService.js` - Stripe Integration

---

## 🔧 Backend API

### الملفات الأساسية

#### 1. `apps/backend/src/server.js` ⭐ **الأهم**
- **الدور**: Main Server Entry Point
- **المحتوى**:
  - Express App Setup
  - CORS Configuration
  - Socket.IO Server
  - Route Registration
  - Database Initialization
  - Middleware (Rate Limiting, Security, Sanitization)
- **الربط**:
  - Routes: `/api/*`
  - Socket.IO Namespaces: `/client-portal`, `/auto-builder`, `/voice/realtime`
  - Static Files: `/client-portal/*` → serves `apps/client-portal/`

#### 2. `apps/backend/src/routes/` - API Routes

##### `mcp.js` - Model Context Protocol (ElevenLabs)
- **Endpoint**: `GET/POST /api/mcp`
- **الدور**: MCP Server للـ ElevenLabs Agent
- **الربط**: ElevenLabs Dashboard → Backend Tools

##### `elevenlabs-webhook.js` - ElevenLabs Webhooks
- **Endpoint**: `POST /api/elevenlabs-webhook/webhook`
- **الدور**: استقبال Events من ElevenLabs
- **Events**: `conversation.started`, `conversation.message`, `agent.tool_call`, `agent.action`
- **الربط**: ElevenLabs → Backend → Twilio/Socket.IO

##### `translation.js` - Google Translation API
- **Endpoints**:
  - `POST /api/translation/translate` - ترجمة نص واحد
  - `POST /api/translation/translate-batch` - ترجمة متعددة
  - `POST /api/translation/detect` - كشف اللغة
- **الربط**: Portal/Mobile → Backend → Google Translation API

##### `payment.js` - Stripe Payments
- **Endpoints**:
  - `POST /api/payments/create-intent` - إنشاء Payment Intent
  - `POST /api/payments/webhook` - Stripe Webhook
  - `POST /api/payments/apple-pay` - Apple Pay
- **الربط**: Portal → Backend → Stripe → Auto-Builder

##### `auto-builder.js` - Auto Builder System
- **Endpoints**:
  - `POST /api/auto-builder/expo/build` - Build iOS/Android/Web
  - `POST /api/auto-builder/github/create` - إنشاء GitHub Repo
  - `GET /api/auto-builder/status` - Build Status
- **الربط**: Portal/Mobile → Backend → Expo EAS → GitHub

##### `voice-realtime.js` - Voice Realtime Processing
- **Socket.IO Namespace**: `/voice/realtime`
- **الدور**: Real-time Voice Processing (Whisper + ElevenLabs + GPT)
- **الربط**: Mobile → Socket.IO → Backend → AI Services

##### `client-portal.js` - Client Portal API
- **Endpoints**: `/api/client-portal/*`
- **Socket.IO Namespace**: `/client-portal`
- **الدور**: Portal-specific API & Real-time Updates

#### 3. `apps/backend/src/services/` - Business Logic

##### `twilioService.js`
- **الدور**: Twilio Integration (SMS, WhatsApp, Voice)
- **Functions**:
  - `sendSMS(to, message)`
  - `sendWhatsApp(to, message)`
  - `makePhoneCall(to, message)`
  - `sendOTP(phoneNumber)`
  - `verifyOTP(phoneNumber, code)`

##### `translationService.js`
- **الدور**: Google Translation API Wrapper
- **Functions**:
  - `translateText(text, targetLanguage, sourceLanguage)`
  - `translateBatch(texts, targetLanguage, sourceLanguage)`
  - `detectLanguage(text)`

##### `elevenLabsAgentService.js`
- **الدور**: ElevenLabs Agent API
- **Functions**:
  - `createConversation(agentId, context)`
  - `sendMessage(conversationId, message)`

##### `agentTools.js`
- **الدور**: Agent Tools (Payment, Builder, Twilio, Owner Commands)
- **Functions**:
  - `createPayment(requestId, amount, currency, clientId, clientEmail)`
  - `submitToBuilder(clientId, requestData, io)`
  - `notifyOwnerViaTwilio(reason, priority)`
  - `executeOwnerCommand(command, context)`

#### 4. `apps/backend/src/database/` - Database Connections

##### `mongodb.js`
- **الدور**: MongoDB Connection
- **Collections**: `conversations`, `user_commands`, `user_profiles`
- **الربط**: Backend → MongoDB Atlas

##### `supabase.js`
- **الدور**: Supabase Client
- **Tables**: `user_profiles`, `user_commands`, `conversations`
- **الربط**: Backend → Supabase

##### `localDB.js`
- **الدور**: SQLite Local Database
- **الربط**: Backend → Local SQLite File

---

## 📱 Mobile App

### الملفات الأساسية

#### 1. `mobile/app/_layout.tsx` ⭐ **الأهم**
- **الدور**: Root Layout (Expo Router)
- **المحتوى**:
  - `LanguageProvider` - Language Context
  - `VoiceProvider` - Voice Context
  - `ErrorBoundary` - Error Handling
  - `RAREKernel` Initialization
  - `CognitiveLoop` Initialization
  - `VoiceGlobalService` Initialization

#### 2. `mobile/app/home.tsx`
- **الدور**: Home Screen
- **المحتوى**:
  - Menu Button → `MenuDrawer`
  - Voice Activation Button
  - App Sections (Builder, Generator, Vault, etc.)
  - `listLayoutManager` - Dynamic List Layouts
- **الربط**: 
  - `useMenu()` - Menu State
  - `useVoice()` - Voice State
  - `useTheme()` - Theme
  - `useTranslation()` - Translation

#### 3. `mobile/app/app-builder.tsx`
- **الدور**: App Builder Screen
- **المحتوى**:
  - Terminal Interface
  - Build Commands (iOS, Android, Web)
  - Client Requests Management
  - Build History
- **الربط**:
  - Socket.IO: `wss://api.zien-ai.app/auto-builder`
  - API: `/api/auto-builder/*`
  - `BuilderStatusCenter` Component

#### 4. `mobile/app/ultimate assisstant.tsx`
- **الدور**: Ultimate Assistant Screen
- **المحتوى**:
  - Ambient Sensing Toggle
  - Neural Voice Link
  - WhatsApp/Email/Voice Call Integration
- **الربط**:
  - `UltimateAssistantService` - Twilio Integration
  - `CommunicationAnalyzer` - Message Analysis
  - `PortalStreamAccess` - Portal Real-time Stream

#### 5. `mobile/app/sos.tsx`
- **الدور**: SOS Emergency Screen
- **المحتوى**:
  - SOS Activation Button
  - Threat Level Detection
  - Emergency Contacts
- **الربط**:
  - `SOSService` - Emergency Twilio Integration
  - `RiskDetectionService` - Risk Analysis
  - `EmergencyContactsService` - Contacts Management

#### 6. `mobile/services/` - API Services

##### `config.ts`
- **الدور**: API Configuration
- **المحتوى**:
  ```typescript
  export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.zien-ai.app';
  export const WS_BASE = API_URL;
  ```

##### `translationService.ts`
- **الدور**: Translation Service (Mobile)
- **الربط**: Mobile → Backend `/api/translation/*` → Google Translation API

##### `UltimateAssistantService.ts`
- **الدور**: Ultimate Assistant Twilio Integration
- **Endpoints**: `/api/ultimate-assistant/twilio/*`

##### `SOSService.ts`
- **الدور**: SOS Emergency Service
- **Endpoints**: `/api/sos/twilio/*`

##### `MultiAIGenerator.ts`
- **الدور**: Multi-AI Generation (GPT + Gemini + Claude)
- **Endpoints**: `/api/generator/multi-ai`

##### `MultiAICodex.ts`
- **الدور**: Multi-AI Code Generation
- **Endpoints**: `/api/codex/generate`

##### `GoogleOAuthService.ts`
- **الدور**: Google OAuth Sign-in
- **Endpoints**: `/api/auth/google/*`

##### `GoogleServices.ts`
- **الدور**: Google Services (Dialogflow, Natural Language, Cloud Storage, Security Scanner, Tenor)
- **Endpoints**: `/api/google/*`

#### 7. `mobile/core/` - Core Systems

##### `RAREKernel.ts`
- **الدور**: Core Event System
- **المحتوى**: Event Emitter, State Management
- **الربط**: جميع الصفحات → Kernel → Cognitive Loop

##### `CognitiveLoop.ts`
- **الدور**: Cognitive Processing Loop
- **الربط**: Kernel → Cognitive Loop → AI Services

##### `services/VoiceConsciousness.ts`
- **الدور**: Real-time Voice Consciousness
- **الربط**: Mobile → Socket.IO `/voice/realtime` → Backend → AI Services

#### 8. `mobile/components/` - Components

##### `MenuDrawer.tsx`
- **الدور**: Side Menu Drawer
- **الربط**: `useMenu()` Hook

##### `BuilderStatusCenter.tsx`
- **الدور**: Build Status Display
- **الربط**: Backend `/api/auto-builder/status`

##### `PaymentModal.tsx`
- **الدور**: Payment Modal (Stripe & Apple Pay)
- **الربط**: Backend `/api/payments/*`

---

## 🔗 الربط بين المكونات

### 1. Portal ↔ Backend

#### HTTP API
```
Portal (app-new.js)
  ↓ fetch()
Backend (server.js)
  ↓ routes/
  → /api/translation/*
  → /api/payments/*
  → /api/auto-builder/*
  → /api/client-portal/*
```

#### Socket.IO
```
Portal (app-new.js)
  ↓ io('/client-portal')
Backend (server.js)
  ↓ io.of('/client-portal')
  → Real-time Updates
  → Owner Notifications
  → Build Status
```

### 2. Mobile ↔ Backend

#### HTTP API
```
Mobile (services/*.ts)
  ↓ fetch(API_URL + '/api/*')
Backend (server.js)
  ↓ routes/
  → /api/translation/*
  → /api/ultimate-assistant/*
  → /api/sos/*
  → /api/generator/*
  → /api/codex/*
  → /api/google/*
```

#### Socket.IO
```
Mobile (core/services/VoiceConsciousness.ts)
  ↓ io('/voice/realtime')
Backend (server.js)
  ↓ io.of('/voice/realtime')
  → Real-time Voice Processing
  → Whisper Transcription
  → ElevenLabs TTS
  → GPT Responses
```

### 3. Portal ↔ Mobile (via Backend)

```
Portal (ClientPortalAgent.js)
  ↓ ElevenLabs Agent
Backend (elevenlabs-webhook.js)
  ↓ Tool Calls
  → create_payment
  → submit_to_builder
  → send_twilio_message
Mobile (app-builder.tsx)
  ↓ Socket.IO
Backend (auto-builder namespace)
  → Build Status Updates
  → Client Requests
```

---

## 📡 API Endpoints

### Translation
- `POST /api/translation/translate` - ترجمة نص واحد
- `POST /api/translation/translate-batch` - ترجمة متعددة
- `POST /api/translation/detect` - كشف اللغة

### Payments
- `POST /api/payments/create-intent` - إنشاء Payment Intent
- `POST /api/payments/webhook` - Stripe Webhook
- `POST /api/payments/apple-pay` - Apple Pay

### Auto Builder
- `POST /api/auto-builder/expo/build` - Build iOS/Android/Web
- `POST /api/auto-builder/github/create` - إنشاء GitHub Repo
- `GET /api/auto-builder/status` - Build Status
- `GET /api/auto-builder/repo-status` - Repo Status
- `GET /api/auto-builder/portal-status` - Portal Status

### Ultimate Assistant
- `POST /api/ultimate-assistant/twilio/whatsapp` - Send WhatsApp
- `POST /api/ultimate-assistant/twilio/sms` - Send SMS
- `POST /api/ultimate-assistant/twilio/call` - Make Call
- `POST /api/ultimate-assistant/analyze-email` - Analyze Email
- `POST /api/ultimate-assistant/analyze-whatsapp` - Analyze WhatsApp
- `POST /api/ultimate-assistant/analyze-sms` - Analyze SMS
- `POST /api/ultimate-assistant/summarize` - Summarize Messages

### SOS
- `POST /api/sos/twilio/whatsapp` - Emergency WhatsApp
- `POST /api/sos/twilio/sms` - Emergency SMS
- `POST /api/sos/twilio/call` - Emergency Call
- `POST /api/sos/risk-detection` - Risk Detection
- `POST /api/sos/threat-analysis` - Threat Analysis

### Generator & Codex
- `POST /api/generator/multi-ai` - Multi-AI Generation
- `POST /api/generator/compare` - Compare AI Results
- `POST /api/codex/generate` - Generate Code
- `POST /api/codex/compare` - Compare Code

### Google Services
- `POST /api/google/dialogflow/intent` - Dialogflow Intent
- `POST /api/google/natural-language/sentiment` - Sentiment Analysis
- `POST /api/google/natural-language/entities` - Entity Extraction
- `POST /api/google/cloud-storage/upload` - Upload File
- `GET /api/google/cloud-storage/download` - Download File
- `POST /api/google/security-scanner/scan` - Security Scan
- `GET /api/google/tenor/search` - Search GIFs

### Auth
- `POST /api/auth/google/signin` - Google Sign-in
- `POST /api/auth/google/signout` - Google Sign-out

### MCP (ElevenLabs)
- `GET /api/mcp` - SSE Connection
- `POST /api/mcp` - JSON-RPC 2.0 Tool Calls

### ElevenLabs Webhook
- `POST /api/elevenlabs-webhook/webhook` - ElevenLabs Events

---

## 🔌 Socket.IO Namespaces

### `/client-portal`
- **الاستخدام**: Portal Real-time Updates
- **Events**:
  - `client:register` - Register Client
  - `client:registered` - Registration Confirmation
  - `owner:notification` - Owner Notifications
  - `build:status` - Build Status Updates

### `/auto-builder`
- **الاستخدام**: Auto Builder Real-time
- **Events**:
  - `client:request` - New Build Request
  - `build:started` - Build Started
  - `build:progress` - Build Progress
  - `build:completed` - Build Completed
  - `build:files` - Build Files Available
  - `payment:completed` - Payment Completed

### `/voice/realtime`
- **الاستخدام**: Real-time Voice Processing
- **Events**:
  - `audio-input` - Audio Input
  - `transcription` - Transcription Result
  - `assistant-response-text` - Assistant Text Response
  - `assistant-audio` - Assistant Audio Response
  - `consciousness:update` - Consciousness Update

---

## 🔐 Environment Variables

### Backend (`apps/backend/.env`)

#### Database
```env
MONGODB_URI=mongodb+srv://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
```

#### AI Services
```env
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=...
ELEVENLABS_API_KEY=...
ELEVENLABS_CONVAI_AGENT_ID=agent_...
ELEVENLABS_OWNER_VOICE_ID=6ZVgc4q9LWAloWbuwjuu
ELEVENLABS_WEBHOOK_SECRET=...
ELEVENLABS_INTEGRATION_ID=...
```

#### Payment
```env
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Twilio
```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+14155238886
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_VERIFY_SERVICE_SID=VA...
```

#### Server
```env
PORT=5000
NODE_ENV=production
API_DOMAIN=https://api.zien-ai.app
CLIENT_PORTAL_URL=https://portal.zien-ai.app
BACKEND_API_KEY=your-secure-random-key-here-min-32-chars
```

### Mobile (`mobile/.env` or EAS Secrets)

```env
EXPO_PUBLIC_API_URL=https://api.zien-ai.app
EXPO_PUBLIC_SUPABASE_URL=https://...
EXPO_PUBLIC_SUPABASE_KEY=...
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
EXPO_PUBLIC_ELEVENLABS_AGENT_ID=agent_...
```

---

## 🔄 Services Integration

### Flow Examples

#### 1. Payment Flow
```
Portal (ClientPortalAgent.js)
  → User selects systems/themes
  → Agent calls create_payment tool
Backend (elevenlabs-webhook.js)
  → agentTools.createPayment()
  → Stripe Payment Intent created
  → Socket.IO emit to /auto-builder
Mobile (app-builder.tsx)
  → Socket.IO receives client:request
  → Shows in terminal
  → Build starts automatically
```

#### 2. Voice Flow
```
Mobile (VoiceConsciousness.ts)
  → User speaks
  → Socket.IO emit audio-input
Backend (voice-realtime.js)
  → Whisper transcription
  → GPT conscious response
  → ElevenLabs TTS
  → Socket.IO emit assistant-audio
Mobile (VoiceConsciousness.ts)
  → Receives audio response
  → Plays audio
```

#### 3. Translation Flow
```
Portal/Mobile (translationService.ts)
  → translateText('Hello', 'ar')
  → fetch('/api/translation/translate')
Backend (translation.js)
  → translationService.translateText()
  → Google Translation API
  → Returns translated text
Portal/Mobile
  → Updates UI with translation
```

#### 4. Build Flow
```
Portal/Mobile (app-builder.tsx)
  → User runs 'eas build --platform ios'
  → fetch('/api/auto-builder/expo/build')
Backend (auto-builder.js)
  → Expo EAS Build API
  → GitHub Integration
  → Cloudflare Pages Deployment
  → Socket.IO emit build:status
Portal/Mobile
  → Shows build progress
  → Receives build files
```

---

## 📝 ملاحظات مهمة

1. **جميع المفاتيح الحساسة في Backend فقط** - لا توجد في Portal أو Mobile
2. **Socket.IO للـ Real-time** - Portal و Mobile يستخدمان Socket.IO للـ Real-time Updates
3. **ElevenLabs Agent** - يتصل بالـ Backend عبر MCP Protocol
4. **Translation** - جميع النصوص تترجم تلقائياً عبر Google Translation API
5. **Payment** - Stripe Integration مع Webhooks للـ Auto-Builder
6. **Voice** - Real-time Voice Processing عبر Socket.IO Namespace `/voice/realtime`
7. **Build System** - Expo EAS Build مع GitHub Integration و Cloudflare Pages

---

## 🎯 نقاط الربط الرئيسية

### 1. Portal → Backend
- **HTTP**: `fetch(API_URL + '/api/*')`
- **Socket.IO**: `io(API_URL + '/client-portal')`
- **Config**: `apps/client-portal/config.js`

### 2. Mobile → Backend
- **HTTP**: `fetch(API_URL + '/api/*')` (from `mobile/services/config.ts`)
- **Socket.IO**: `io(API_URL + '/voice/realtime')` (from `VoiceConsciousness.ts`)
- **Config**: `mobile/services/config.ts`

### 3. ElevenLabs → Backend
- **MCP**: `GET/POST https://api.zien-ai.app/api/mcp`
- **Webhook**: `POST https://api.zien-ai.app/api/elevenlabs-webhook/webhook`

### 4. Stripe → Backend
- **Webhook**: `POST https://api.zien-ai.app/api/payments/webhook`

---

## ✅ Checklist للربط الصحيح

- [ ] Backend `.env` يحتوي على جميع المفاتيح
- [ ] Portal `config.js` يحتوي على `API_URL` و `STRIPE_PUBLISHABLE_KEY`
- [ ] Mobile `config.ts` يحتوي على `EXPO_PUBLIC_API_URL`
- [ ] Socket.IO Namespaces مسجلة في `server.js`
- [ ] Routes مسجلة في `registerRoutes()` في `server.js`
- [ ] CORS configured للسماح بـ Portal و Mobile origins
- [ ] ElevenLabs MCP Server configured في Dashboard
- [ ] Stripe Webhook configured في Stripe Dashboard
- [ ] Cloudflare Tunnel running للـ Backend
- [ ] PM2 running Backend process

---

**آخر تحديث**: 2025-01-01
**الإصدار**: 1.0.0


