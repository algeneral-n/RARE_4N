# 🔑 RARE 4N - Keys Setup Guide
## دليل إعداد المفاتيح للمنصات المختلفة

---

## 📱 **BASE44 - Client Portal Only**

### ⚠️ مهم جداً: Client Portal فقط على Base44

Base44 يحتاج فقط إلى **Publishable/Public Keys** - لا تضع أي **Secret Keys** هنا!

### Environment Variables المطلوبة في Base44:

```bash
# ============================================
# Supabase (Publishable Keys Only)
# ============================================
SUPABASE_URL=https://fgvrilruqzajstprioqj.supabase.co
SUPABASE_ANON_KEY=sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy

# ============================================
# Stripe (Publishable Key Only)
# ============================================
STRIPE_PUBLISHABLE_KEY=pk_test_... أو pk_live_...

# ============================================
# API Endpoint
# ============================================
API_URL=https://api.zien-ai.app
API_DOMAIN=https://api.zien-ai.app

# ============================================
# Frontend URLs
# ============================================
FRONTEND_URL=https://portal.zien-ai.app
CLIENT_PORTAL_URL=https://portal.zien-ai.app

# ============================================
# ElevenLabs (Agent ID - Non-secret)
# ============================================
ELEVENLABS_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka
ELEVENLABS_CONVAI_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka

# ============================================
# Monitoring (Optional)
# ============================================
SENTRY_DSN=https://...@sentry.io/... (Optional)
```

### ❌ **لا تضع في Base44:**
- `STRIPE_SECRET_KEY` ❌
- `SUPABASE_SERVICE_ROLE_KEY` ❌
- `OPENAI_API_KEY` ❌
- `ELEVENLABS_API_KEY` ❌
- أي `SECRET` أو `PRIVATE KEY` ❌

---

## 🚀 **GitHub - CI/CD & Build Automation**

### GitHub Secrets (Settings → Secrets and variables → Actions → Secrets)

```bash
# ============================================
# Expo / EAS Build
# ============================================
EXPO_TOKEN=exp_... (من Expo Dashboard → Account Settings → Access Tokens)

# ============================================
# App Store Connect (iOS)
# ============================================
ASC_API_KEY_ID=... (من App Store Connect → Users and Access → Keys)
ASC_API_KEY_ISSUER_ID=... (من App Store Connect)
ASC_API_KEY_P8=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY----- (Base64 encoded)

# ============================================
# Google Play (Android - Optional)
# ============================================
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON={"type":"service_account",...} (JSON كامل)

# ============================================
# GitHub (Optional - للصلاحيات الإضافية)
# ============================================
GH_PAT=ghp_... (Personal Access Token - تجنب قدر الإمكان، استخدم GitHub App بدلاً منه)

# ============================================
# GitHub App (Recommended)
# ============================================
GITHUB_APP_ID=...
GITHUB_APP_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----
```

### GitHub Variables (Settings → Secrets and variables → Actions → Variables)

```bash
# ============================================
# Expo Project ID (Non-secret)
# ============================================
EAS_PROJECT_ID=... (من app.json أو EAS Dashboard)
```

### ملاحظات GitHub:
- `GITHUB_TOKEN` متوفر تلقائياً في GitHub Actions (لا حاجة لإضافته)
- استخدم **GitHub App** بدلاً من **PAT** للأمان الأعلى
- جميع الـ Secrets يجب أن تكون في **Secrets** وليس **Variables**

---

## 📱 **Expo - Mobile App**

### Expo Environment Variables (في `mobile/.env` أو `app.config.js`)

```bash
# ============================================
# Supabase (Publishable Keys Only)
# ============================================
EXPO_PUBLIC_SUPABASE_URL=https://fgvrilruqzajstprioqj.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy

# ============================================
# Stripe (Publishable Key Only)
# ============================================
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... أو pk_live_...

# ============================================
# API Endpoint
# ============================================
EXPO_PUBLIC_API_URL=https://api.zien-ai.app

# ============================================
# ElevenLabs (Agent ID - Non-secret)
# ============================================
EXPO_PUBLIC_ELEVENLABS_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka

# ============================================
# Monitoring (Optional)
# ============================================
EXPO_PUBLIC_SENTRY_DSN=https://...@sentry.io/... (Optional)
```

### ملاحظات Expo:
- جميع المتغيرات يجب أن تبدأ بـ `EXPO_PUBLIC_` لتكون متاحة في الكود
- لا تضع أي **Secret Keys** في Expo
- استخدم `eas secret:create` للأمان الأعلى (اختياري)

---

## 🖥️ **Backend Server - Local/Production**

### Backend Environment Variables (في `apps/backend/.env`)

```bash
# ============================================
# Server Configuration
# ============================================
NODE_ENV=production
PORT=5000
API_DOMAIN=https://api.zien-ai.app
FRONTEND_URL=https://portal.zien-ai.app

# ============================================
# Authentication & Security
# ============================================
JWT_SECRET=... (مفتاح قوي عشوائي)
COOKIE_SECRET=... (مفتاح قوي عشوائي)
RARE_JWT_SECRET=... (مفتاح قوي عشوائي)
ADMIN_KILL_SWITCH_KEY=... (مفتاح قوي عشوائي)
ADMIN_USER_IDS=family_user

# ============================================
# Encryption & Vault
# ============================================
RARE_MASTER_KEY=... (32 bytes hex)
RARE_ENCRYPTION_SALT=... (16 bytes hex)

# ============================================
# OAuth Providers
# ============================================
GOOGLE_CLIENT_ID=... (من Google Cloud Console)
GOOGLE_CLIENT_SECRET=... (من Google Cloud Console)

APPLE_SERVICES_ID=... (من Apple Developer)
APPLE_TEAM_ID=... (من Apple Developer)
APPLE_KEY_ID=... (من Apple Developer)
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----

# ============================================
# Payments (Stripe)
# ============================================
STRIPE_SECRET_KEY=sk_test_... أو sk_live_... (Backend only!)
STRIPE_PUBLISHABLE_KEY=pk_test_... أو pk_live_... (يمكن وضعه في Frontend)
STRIPE_WEBHOOK_SECRET=whsec_... (Backend only!)

# ============================================
# Notifications (Twilio)
# ============================================
TWILIO_ACCOUNT_SID=AC... (Backend only!)
TWILIO_AUTH_TOKEN=... (Backend only!)
TWILIO_PHONE_NUMBER=+14155238886
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_VERIFY_SERVICE_SID=... (Optional)

# ============================================
# Databases
# ============================================
MONGODB_URI=mongodb+srv://... (Backend only!)
SUPABASE_URL=https://fgvrilruqzajstprioqj.supabase.co
SUPABASE_ANON_KEY=sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy (Publishable)
SUPABASE_SERVICE_ROLE_KEY=... (Backend only!)

# ============================================
# AI Services (Backend only!)
# ============================================
OPENAI_API_KEY=sk-... (Backend only!)
ANTHROPIC_API_KEY=sk-ant-... (Backend only!)
GEMINI_API_KEY=AIza... (Backend only!)
ELEVENLABS_API_KEY=... (Backend only!)
ELEVENLABS_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka (Non-secret)
GOOGLE_MAPS_API_KEY=AIza... (Backend only!)

# ============================================
# WeatherKit (Apple)
# ============================================
APPLE_WEATHERKIT_KEY_ID=...
APPLE_WEATHERKIT_TEAM_ID=...
APPLE_WEATHERKIT_SERVICE_ID=...
APPLE_WEATHERKIT_KEY_PATH=./path/to/AuthKey_XXX.p8

# ============================================
# Cloudflare
# ============================================
CLOUDFLARE_API_TOKEN=... (Backend only!)
CLOUDFLARED_TUNNEL_TOKEN=... (على السيرفر فقط)

# ============================================
# Monitoring
# ============================================
SENTRY_DSN=https://...@sentry.io/... (Optional)
SENTRY_ENVIRONMENT=production
```

---

## 📋 **ملخص سريع - أين تضع كل مفتاح**

| المفتاح | Backend .env | Base44 | Expo | GitHub Secrets |
|---------|-------------|--------|------|----------------|
| `STRIPE_SECRET_KEY` | ✅ | ❌ | ❌ | ❌ |
| `STRIPE_PUBLISHABLE_KEY` | ✅ | ✅ | ✅ | ❌ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ❌ | ❌ | ❌ |
| `SUPABASE_ANON_KEY` | ✅ | ✅ | ✅ | ❌ |
| `OPENAI_API_KEY` | ✅ | ❌ | ❌ | ❌ |
| `ELEVENLABS_API_KEY` | ✅ | ❌ | ❌ | ❌ |
| `ELEVENLABS_AGENT_ID` | ✅ | ✅ | ✅ | ❌ |
| `MONGODB_URI` | ✅ | ❌ | ❌ | ❌ |
| `TWILIO_ACCOUNT_SID` | ✅ | ❌ | ❌ | ❌ |
| `JWT_SECRET` | ✅ | ❌ | ❌ | ❌ |
| `EXPO_TOKEN` | ❌ | ❌ | ❌ | ✅ |
| `ASC_API_KEY_P8` | ❌ | ❌ | ❌ | ✅ |

---

## 🔐 **قواعد الأمان**

### ✅ **افعل:**
- ضع **Secret Keys** في Backend `.env` فقط
- ضع **Publishable Keys** في Base44 و Expo
- استخدم **GitHub Secrets** للـ CI/CD
- استخدم **GitHub Variables** للقيم غير الحساسة

### ❌ **لا تفعل:**
- لا تضع **Secret Keys** في Base44 ❌
- لا تضع **Secret Keys** في Expo ❌
- لا ترفع `.env` على GitHub ❌
- لا تضع secrets في الكود ❌

---

## 🚀 **خطوات الإعداد**

### 1. Base44 Setup:
1. اذهب إلى Base44 Dashboard
2. افتح **Environment Variables** أو **Secrets**
3. أضف فقط **Publishable Keys** (من القائمة أعلاه)
4. لا تضع أي **Secret Keys**

### 2. GitHub Setup:
1. اذهب إلى GitHub Repo → Settings
2. **Secrets and variables** → **Actions**
3. أضف جميع الـ **Secrets** (من القائمة أعلاه)
4. أضف **Variables** للقيم غير الحساسة

### 3. Expo Setup:
1. أنشئ `mobile/.env` من `mobile/.env.example`
2. املأ فقط **Publishable Keys**
3. استخدم `EXPO_PUBLIC_` prefix

### 4. Backend Setup:
1. أنشئ `apps/backend/.env` من `apps/backend/.env.example`
2. املأ جميع القيم (Secret + Publishable)
3. على السيرفر فقط!

---

## 📞 **الدعم**

إذا واجهت أي مشكلة:
1. راجع `SECURITY_SETUP.md` للتفاصيل الكاملة
2. تأكد من أن جميع الـ Secrets في المكان الصحيح
3. تأكد من أن Base44 يحتوي فقط على **Publishable Keys**

---

**تم الإنشاء:** 2025-01-XX  
**الحالة:** ✅ جاهز للاستخدام




