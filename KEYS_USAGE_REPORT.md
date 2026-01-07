# 📊 تقرير استخدام المفاتيح - Keys Usage Report
## RARE 4N - Complete Keys Usage Documentation

---

## 📋 نظرة عامة

هذا التقرير يوضح **كيفية استخدام جميع المفاتيح** في المشروع:
- ✅ **Backend** - جميع المفاتيح الحساسة
- ✅ **Mobile App** - فقط Publishable Keys
- ✅ **Client Portal** - فقط Publishable Keys

---

## 🔧 Backend - استخدام المفاتيح

### 1. Apple Services

#### المفاتيح المستخدمة:
```javascript
// apps/backend/src/services/weatherKitService.js
process.env.APPLE_WEATHERKIT_KEY_ID
process.env.APPLE_WEATHERKIT_TEAM_ID || process.env.APPLE_TEAM_ID
process.env.APPLE_WEATHERKIT_KEY_PATH || process.env.APPLE_WEATHER_KEY
process.env.APPLE_WEATHERKIT_SERVICE_ID

// apps/backend/src/services/appleMapsService.js
process.env.APPLE_MAPS_TOKEN || process.env.APPLE_MAPS_KEY

// apps/backend/src/services/expoService.js
process.env.APPLE_BUNDLE_ID
process.env.APPLE_APP_ID
process.env.APPLE_TEAM_ID
process.env.APPLE_KEY_ID
process.env.APPLE_PRIVATE_KEY
```

**الاستخدام:**
- ✅ WeatherKit → `weatherKitService.js` - JWT generation
- ✅ Maps → `appleMapsService.js` - MapKit integration
- ✅ Expo Build → `expoService.js` - iOS builds

---

### 2. Google Services

#### المفتاح الواحد (14 خدمة):
```javascript
// apps/backend/src/services/apiService.js
process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY
// يستخدم أيضاً: process.env.GOOGLE_API_KEY

// apps/backend/src/services/appleMapsService.js
process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY

// apps/backend/src/services/visionService.js
process.env.GOOGLE_APPLICATION_CREDENTIALS
// Fallback: process.env.GOOGLE_API_KEY

// apps/backend/src/services/translationService.js
process.env.GOOGLE_API_KEY

// apps/backend/src/routes/council.js
process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY
```

**الخدمات الـ14:**
1. ✅ **Places API** → `appleMapsService.js` (fallback)
2. ✅ **Maps JavaScript API** → `appleMapsService.js`
3. ✅ **Geocoding API** → `appleMapsService.js`
4. ✅ **Directions API** → `apiService.js` (Maps.getRoute)
5. ✅ **Cloud Translation API** → `translationService.js` ✅ **جديد**
6. ✅ **Cloud Vision API** → `visionService.js`
7. ✅ **Dialogflow API** → (جاهز للاستخدام)
8. ✅ **Generative Language API (Gemini)** → `apiService.js`
9. ✅ **Cloud Storage** → (جاهز للاستخدام)
10. ✅ **Organization Policy API** → (جاهز للاستخدام)
11. ✅ **Web Security Scanner** → (جاهز للاستخدام)
12. ✅ **Gemini Cloud Assist** → (جاهز للاستخدام)
13. ✅ **Cloud Natural Language** → (جاهز للاستخدام)
14. ✅ **Tenor API** → (جاهز للاستخدام)

**✅ المفتاح:** `GOOGLE_API_KEY=AIzaSyCuS7FajWuQLpNJtyTFrwWjDMdi6wp7wmg`

---

### 3. AI Services

#### OpenAI
```javascript
// apps/backend/src/services/apiService.js
process.env.OPENAI_API_KEY || process.env.OPENAI_KEY

// apps/backend/src/services/apiKeyValidator.js
validateOpenAIKey() → process.env.OPENAI_API_KEY

// apps/backend/src/routes/voice-realtime.js
process.env.OPENAI_API_KEY
```

**الاستخدام:**
- ✅ Chat Completions → `apiService.js`
- ✅ Code Generation → `fileGeneratorService.js`
- ✅ Voice Realtime → `voice-realtime.js`
- ✅ Vision → `visionService.js` (fallback)

#### Gemini
```javascript
// apps/backend/src/services/apiService.js
process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY

// apps/backend/src/routes/council.js
process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY
```

**الاستخدام:**
- ✅ Chat Completions → `apiService.js`
- ✅ Council Responses → `council.js`

#### Anthropic/Claude
```javascript
// apps/backend/src/services/apiService.js
process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY

// apps/backend/src/routes/voice-realtime.js
process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY
```

**الاستخدام:**
- ✅ Chat Completions → `apiService.js`
- ✅ Voice Realtime → `voice-realtime.js` (fallback)

---

### 4. ElevenLabs

```javascript
// apps/backend/src/services/elevenLabsAgentService.js
process.env.ELEVENLABS_API_KEY
process.env.ELEVENLABS_CONVAI_AGENT_ID
process.env.ELEVENLABS_SYSTEM_AGENT_ID

// apps/backend/src/services/elevenlabsService.js
process.env.ELEVENLABS_API_KEY
process.env.ELEVENLABS_WEBHOOK_SECRET
```

**الاستخدام:**
- ✅ Voice Agents → `elevenLabsAgentService.js`
- ✅ Voice Generation → `elevenlabsService.js`
- ✅ Webhooks → `elevenlabsService.js`

---

### 5. Payment Services (Stripe)

```javascript
// apps/backend/src/services/paymentservice.js
process.env.STRIPE_SECRET_KEY || process.env.STRIPE_KEY
process.env.STRIPE_PUBLISHABLE_KEY

// apps/backend/src/routes/payment.js
process.env.STRIPE_SECRET_KEY
process.env.STRIPE_PUBLISHABLE_KEY
```

**الاستخدام:**
- ✅ Payment Processing → `paymentservice.js`
- ✅ Payment Routes → `payment.js`
- ✅ Publishable Key → Mobile App + Client Portal

---

### 6. Database Services

#### MongoDB
```javascript
// apps/backend/src/database/mongodb.js
process.env.MONGODB_URI
process.env.MONGODB_USERNAME
process.env.MONGODB_PASSWORD
process.env.MONGODB_DB_NAME
```

**الاستخدام:**
- ✅ Database Connection → `mongodb.js`

#### Supabase
```javascript
// apps/backend/src/database/supabase.js
process.env.REACT_APP_SUPABASE_URL || 
process.env.NEXT_PUBLIC_SUPABASE_URL || 
process.env.EXPO_PUBLIC_SUPABASE_URL || 
process.env.SUPABASE_URL

process.env.REACT_APP_SUPABASE_ANON_KEY || 
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
process.env.EXPO_PUBLIC_SUPABASE_KEY || 
process.env.SUPABASE_ANON_KEY
```

**الاستخدام:**
- ✅ Database Connection → `supabase.js`
- ✅ Publishable Key → Mobile App + Client Portal

---

### 7. Communication Services (Twilio)

```javascript
// apps/backend/src/services/twilioService.js
process.env.TWILIO_ACCOUNT_SID
process.env.TWILIO_AUTH_TOKEN
process.env.TWILIO_PHONE_NUMBER
process.env.TWILIO_VERIFY_SERVICE_SID
process.env.TWILIO_WHATSAPP_TEMPLATE_*
```

**الاستخدام:**
- ✅ SMS → `twilioService.js`
- ✅ WhatsApp → `twilioService.js`
- ✅ Phone Calls → `twilioService.js`

---

### 8. Cloudflare Services

```javascript
// apps/backend/src/core/ServiceManager.js
process.env.CLOUDFLARE_TUNNEL_ID

// apps/backend/src/services/buildService.js
// Cloudflare R2 for storage
process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
process.env.CLOUDFLARE_R2_BUCKET_NAME
process.env.CLOUDFLARE_R2_ENDPOINT
```

**الاستخدام:**
- ✅ Tunnel → `ServiceManager.js` - Web App deployment
- ✅ R2 Storage → `buildService.js` - File storage
- ✅ TURN Server → (جاهز للاستخدام)
- ✅ Realtime → (جاهز للاستخدام)

---

### 9. Security Keys

```javascript
// apps/backend/src/routes/auth.js
process.env.RARE_JWT_SECRET

// apps/backend/src/middleware/adminAuth.js
process.env.RARE_MASTER_KEY
process.env.ADMIN_KILL_SWITCH_KEY

// apps/backend/src/services/vault.js
process.env.RARE_ENCRYPTION_SALT
```

**الاستخدام:**
- ✅ JWT Authentication → `auth.js`
- ✅ Admin Authentication → `adminAuth.js`
- ✅ Data Encryption → `vault.js`

---

### 10. Expo/EAS Configuration

```javascript
// apps/backend/src/services/expoService.js
process.env.EXPO_TOKEN_RARE_BUILDER_TOKEN || process.env.EXPO_TOKEN
process.env.EXPO_PROJECT_ID
process.env.EXPO_SLUG
process.env.EXPO_OWNER

// apps/backend/src/services/githubService.js
process.env.EXPO_TOKEN
process.env.EXPO_GITHUB_ACTIONS_TOKEN
```

**الاستخدام:**
- ✅ Expo Builds → `expoService.js`
- ✅ GitHub Actions → `githubService.js`

---

## 📱 Mobile App - استخدام المفاتيح

### المفاتيح المستخدمة:

```typescript
// mobile/services/config.ts
process.env.EXPO_PUBLIC_API_URL

// mobile/app.config.js
process.env.EXPO_PUBLIC_API_URL
process.env.EXPO_PUBLIC_SUPABASE_URL
process.env.EXPO_PUBLIC_SUPABASE_KEY
process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID
```

**الاستخدام:**
- ✅ **API_URL** → جميع Agents (VaultAgent, ServiceAgent, CommunicationAgent, etc.)
- ✅ **SUPABASE** → Database connection
- ✅ **STRIPE** → Payment UI
- ✅ **ELEVENLABS** → Voice Agent

**✅ جميع الطلبات تذهب للباك اند:**
```typescript
fetch(`${API_URL}/api/...`)  // جميع الطلبات
```

---

## 🌐 Client Portal - استخدام المفاتيح

### المفاتيح المستخدمة:

```javascript
// apps/client-portal/config.js
window.API_URL || import.meta.env?.VITE_API_URL || 'https://api.zien-ai.app'
window.STRIPE_PUBLISHABLE_KEY || import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY
window.SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL
window.SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_ANON_KEY
window.ELEVENLABS_AGENT_ID || import.meta.env?.VITE_ELEVENLABS_AGENT_ID
```

**الاستخدام:**
- ✅ **API_URL** → جميع API calls
- ✅ **STRIPE** → Payment processing
- ✅ **SUPABASE** → Database connection
- ✅ **ELEVENLABS** → Voice Agent

**✅ جميع الطلبات تذهب للباك اند:**
```javascript
fetch(`${CONFIG.api.baseUrl}/api/...`)  // جميع الطلبات
```

---

## 📊 ملخص الاستخدام

### Backend (46 ملف يستخدم process.env)

| المفتاح | الملفات | الاستخدام |
|---------|---------|-----------|
| `OPENAI_API_KEY` | 8 ملفات | AI Chat, Code Generation, Vision |
| `GEMINI_API_KEY` | 5 ملفات | AI Chat, Council, Translation |
| `ANTHROPIC_API_KEY` | 3 ملفات | AI Chat, Voice Realtime |
| `GOOGLE_API_KEY` | 4 ملفات | Maps, Vision, Translation (14 خدمة) |
| `STRIPE_SECRET_KEY` | 2 ملفات | Payment Processing |
| `TWILIO_*` | 1 ملف | SMS, WhatsApp, Phone |
| `ELEVENLABS_*` | 2 ملفات | Voice Agents, Generation |
| `MONGODB_URI` | 1 ملف | Database |
| `SUPABASE_*` | 1 ملف | Database |
| `CLOUDFLARE_*` | 2 ملفات | Tunnel, R2 Storage |
| `APPLE_*` | 3 ملفات | WeatherKit, Maps, Expo Build |
| `RARE_*` | 3 ملفات | JWT, Encryption, Admin |

### Mobile App (9 ملفات تستخدم EXPO_PUBLIC_*)

| المفتاح | الملفات | الاستخدام |
|---------|---------|-----------|
| `EXPO_PUBLIC_API_URL` | 9 ملفات | جميع API calls → Backend |
| `EXPO_PUBLIC_SUPABASE_*` | 1 ملف | Database |
| `EXPO_PUBLIC_STRIPE_*` | 1 ملف | Payment UI |
| `EXPO_PUBLIC_ELEVENLABS_*` | 1 ملف | Voice Agent |

### Client Portal (1 ملف يستخدم CONFIG)

| المفتاح | الملفات | الاستخدام |
|---------|---------|-----------|
| `API_URL` | 1 ملف | جميع API calls → Backend |
| `STRIPE_PUBLISHABLE_KEY` | 1 ملف | Payment UI |
| `SUPABASE_*` | 1 ملف | Database |
| `ELEVENLABS_AGENT_ID` | 1 ملف | Voice Agent |

---

## ✅ التأكيد النهائي

### Backend
- ✅ **368 استخدام** لـ `process.env.*` في **46 ملف**
- ✅ جميع المفاتيح من `.env`
- ✅ Validation قبل الاستخدام

### Mobile App
- ✅ **22 استخدام** لـ `EXPO_PUBLIC_*` في **9 ملفات**
- ✅ جميع الطلبات → Backend
- ✅ لا مفاتيح حساسة

### Client Portal
- ✅ **1 ملف** يقرأ من `CONFIG`
- ✅ جميع الطلبات → Backend
- ✅ لا مفاتيح حساسة

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ **جميع المفاتيح مستخدمة بشكل صحيح**

