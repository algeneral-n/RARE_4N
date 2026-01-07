# 🔒 RARE 4N - Security Setup Guide

## ✅ تم إعداد الأمان بنجاح

### ما تم إنجازه:

1. **✅ إنشاء `.gitignore` شامل**
   - حماية جميع ملفات `.env`
   - حماية الملفات الحساسة (keys, tokens, credentials)
   - حماية قواعد البيانات المحلية
   - حماية ملفات Vault والـ logs

2. **✅ إزالة `.env` من الريبو**
   - تم إزالة `apps/backend/.env` من Git
   - تم إزالة `mobile/.env` من Git
   - الملفات موجودة محلياً فقط (لن يتم رفعها)

3. **✅ إنشاء `.env.example`**
   - `apps/backend/.env.example` - قالب كامل لجميع المتغيرات
   - `mobile/.env.example` - قالب للموبايل (publishable keys only)

4. **✅ إزالة Secrets من الكود**
   - إزالة MongoDB URI من `mongodb.js`
   - إزالة Supabase credentials من `supabase.js`
   - إزالة القيم الافتراضية من `weatherKitService.js`

---

## 📋 قائمة المتغيرات المطلوبة

### Backend (.env)

#### Authentication & Security
- `JWT_SECRET` - توقيع JWT
- `COOKIE_SECRET` - توقيع الكوكيز
- `RARE_JWT_SECRET` - JWT خاص بـ RARE
- `ADMIN_KILL_SWITCH_KEY` - مفتاح Kill Switch
- `ADMIN_USER_IDS` - قائمة Admin Users

#### OAuth Providers
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `APPLE_SERVICES_ID` / `APPLE_TEAM_ID` / `APPLE_KEY_ID` / `APPLE_PRIVATE_KEY`
- `MICROSOFT_CLIENT_ID` / `MICROSOFT_CLIENT_SECRET` (Optional)
- `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` (Optional)

#### Payments (Stripe)
- `STRIPE_SECRET_KEY` - **Backend only**
- `STRIPE_PUBLISHABLE_KEY` - يمكن وضعه في Frontend
- `STRIPE_WEBHOOK_SECRET` - **Backend only**
- `APPLE_PAY_MERCHANT_ID` / `APPLE_PAY_DOMAIN`

#### Notifications (Twilio)
- `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` - **Backend only**
- `TWILIO_PHONE_NUMBER` / `TWILIO_WHATSAPP_NUMBER`
- `TWILIO_VERIFY_SERVICE_SID`

#### Databases
- `MONGODB_URI` - **Backend only**
- `SUPABASE_URL` - يمكن وضعه في Frontend
- `SUPABASE_ANON_KEY` - Publishable (يمكن وضعه في Frontend)
- `SUPABASE_SERVICE_ROLE_KEY` - **Backend only**

#### AI Services
- `OPENAI_API_KEY` - **Backend only**
- `ANTHROPIC_API_KEY` - **Backend only**
- `GEMINI_API_KEY` - **Backend only**
- `ELEVENLABS_API_KEY` - **Backend only**
- `ELEVENLABS_AGENT_ID` - Non-secret (يمكن وضعه في Frontend)
- `GOOGLE_MAPS_API_KEY` - **Backend only**
- `APPLE_MAPS_API_KEY` - **Backend only**

#### WeatherKit (Apple)
- `APPLE_WEATHERKIT_KEY_ID`
- `APPLE_WEATHERKIT_TEAM_ID`
- `APPLE_WEATHERKIT_SERVICE_ID`
- `APPLE_WEATHERKIT_KEY_PATH`

#### Cloudflare
- `CLOUDFLARE_API_TOKEN` - **Backend only**
- `CLOUDFLARED_TUNNEL_TOKEN` - على السيرفر فقط
- `TUNNEL_CREDENTIALS_FILE` - على السيرفر فقط

#### CI / Build Automation
- `EXPO_TOKEN` - GitHub Secrets
- `EAS_PROJECT_ID` - GitHub Variables
- `ASC_API_KEY_ID` / `ASC_API_KEY_ISSUER_ID` / `ASC_API_KEY_P8` - GitHub Secrets
- `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` - GitHub Secrets (Android)
- `GITHUB_TOKEN` - متوفر تلقائياً في GitHub Actions
- `GH_PAT` - GitHub Secrets (Optional)
- `GITHUB_APP_ID` / `GITHUB_APP_PRIVATE_KEY` - Backend .env فقط

#### Monitoring
- `SENTRY_DSN` - يمكن وضعه في Frontend
- `SENTRY_ENVIRONMENT`

### Mobile (.env)

#### Publishable Keys Only
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_KEY`
- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_ELEVENLABS_AGENT_ID` (Non-secret)
- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_SENTRY_DSN` (Optional)

---

## 🚀 الخطوات التالية

### 1. على السيرفر/اللوكال:
```bash
# Backend
cp apps/backend/.env.example apps/backend/.env
# ثم املأ القيم الحقيقية

# Mobile
cp mobile/.env.example mobile/.env
# ثم املأ القيم الحقيقية (publishable keys only)
```

### 2. على GitHub:
- أضف جميع الـ Secrets في **GitHub Secrets** (Settings → Secrets and variables → Actions)
- استخدم **GitHub Variables** للقيم غير الحساسة (مثل `EAS_PROJECT_ID`)

### 3. على Base44/Portal:
- استخدم **Secrets/Env Settings** الخاصة بالمنصة
- ضع فقط **Publishable keys** (مثل `STRIPE_PUBLISHABLE_KEY`, `SUPABASE_ANON_KEY`)

---

## ⚠️ قواعد الأمان

1. **❌ لا ترفع `.env` أبداً** - محمي في `.gitignore`
2. **✅ ارفع `.env.example` فقط** - بدون قيم حقيقية
3. **✅ استخدم GitHub Secrets** للـ CI/CD
4. **✅ Backend secrets** في `.env` على السيرفر فقط
5. **✅ Frontend secrets** في Base44/Portal Env Settings (publishable only)
6. **✅ لا تضع secrets في الكود** - استخدم `process.env` فقط

---

## 📚 مراجع

- [GitHub Docs - .gitignore](https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files)
- [12-Factor App - Config](https://12factor.net/config)
- [GitHub Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**تم الإنشاء:** 2025-01-XX  
**الحالة:** ✅ جاهز للرفع




