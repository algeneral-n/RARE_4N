# دليل توزيع المفاتيح - Keys Distribution Guide
## RARE 4N - Complete Keys Distribution Plan

---

## 📋 نظرة عامة (Overview)

هذا الدليل الشامل يوضح **أين تضع كل مفتاح** في المشروع:
- ✅ **Backend .env** - جميع المفاتيح الحساسة
- ✅ **Expo EAS Secrets** - مفاتيح البناء فقط
- ✅ **GitHub Secrets** - مفاتيح CI/CD فقط  
- ✅ **Base44/Client Portal** - مفاتيح publishable فقط
- ✅ **Mobile App** - مفاتيح publishable فقط (EXPO_PUBLIC_*)

---

## 🎯 المبدأ الأساسي (Core Principle)

**جميع المفاتيح الحساسة في Backend فقط!**

- ❌ **لا تضع مفاتيح حساسة في:**
  - Client Portal (Base44)
  - Mobile App Code
  - GitHub Code
  - أي ملفات مرفوعة على Git

- ✅ **المفاتيح الحساسة فقط في:**
  - `apps/backend/.env` (على السيرفر فقط)

---

## 📦 1. Backend .env (apps/backend/.env)

**الموقع:** `apps/backend/.env`  
**الحالة:** ✅ **جميع المفاتيح الحساسة هنا**

### Apple Services
```env
# Apple Developer
APPLE_BUNDLE_ID=com.rare4n.app
APPLE_APP_ID=6756657662
APPLE_SKU=rare4n-app-001
APPLE_TEAM_ID=BN4DXG557F
APPLE_KEY_ID=6AR5VSRINSC3
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
APPLE_DEVELOPER_ID=d790aa1b-f46a-46dc-8187-b94b5e372c16
APPLE_WEATHERKIT_KEY_ID=L3KM677Z7Y
APPLE_ACCOUNT_EMAIL=nader200812@gmail.com
APPLE_PHONE=971-529211077

# Apple Maps (MapKit)
APPLE_MAPS_TOKEN=eyJraWQiOiI1TFA5Sks3QjlKIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ...
APPLE_PAY_LATER_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9...
```

### Cloudflare Services
```env
# Cloudflare Core
CLOUDFLARE_ACCOUNT_ID=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_ZONE_ID=cb61498c69c654043b54b30550151b8f
CLOUDFLARE_API_KEY=b1a6484ff2a4d441092133debec6b99ff512c
CLOUDFLARE_ORIGIN_CA_KEY=v1.0-4afb6a6052baaa20bb0c32c6-d954a27b3896075b8910ec611fa6a74efa85b4f781f6e50043a4624c9de9e36f800ed3d522096b6a52c25987e846f84ce3093105d96565bf1fa112587e7f548e3b2311bf6899fc5145

# Cloudflare Tunnel
CLOUDFLARE_TUNNEL_ID=8280d872-79cc-4b82-9de8-a86ab4bf9540
CLOUDFLARE_ACCOUNT_TAG=ccc1ed9ab170eaf1e72e9a10e46ef320

# Cloudflare R2 Storage
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET_NAME=rare
CLOUDFLARE_R2_ENDPOINT=https://ccc1ed9ab170eaf1e72e9a10e46ef320.r2.cloudflarestorage.com

# Cloudflare TURN Server
CLOUDFLARE_TURN_TOKEN_ID=dd3ae93e7342ed950f3e008165931d86
CLOUDFLARE_TURN_API_TOKEN=29177584e99d8f3a485d141c1a153ce3af879e1785ab84b89cf9d4e4ab979057

# Cloudflare Realtime
CLOUDFLARE_REALTIME_APP_ID=36640e04a83766c8b7fcc90271296bfe
CLOUDFLARE_REALTIME_APP_SECRET=da37e71594a405e7787c8c9edefe23b6513c5b51800edb6b4053a6aad9d4c70f

# Cloudflare Certificates (PEM format)
CLOUDFLARE_ORIGIN_CERTIFICATE="-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"
CLOUDFLARE_ORIGIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
CLOUDFLARE_CLIENT_CERTIFICATE="-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"
CLOUDFLARE_CLIENT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

### Google Services
```env
# Google API Key (مفتاح واحد لجميع الخدمات الـ14)
GOOGLE_API_KEY=AIzaSyCuS7FajWuQLpNJtyTFrwWjDMdi6wp7wmg
# يمكن استخدامه لـ: Maps, Places, Geocoding, Directions, Translation, Vision, Gemini, Natural Language, Dialogflow, Storage, Tenor, etc.

# Gemini API (يمكن استخدام GOOGLE_API_KEY بدلاً منه)
GEMINI_API_KEY=AIzaSyAL_vCrbXHc9dZ1YCi1vR1dyVyL3NoiS7Y

# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=908797961106-sh9q3pki39sh8blu13ga67e26kq6243d.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=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

# Google Project
GOOGLE_PROJECT_ID=valiant-bonbon-479503-p3
GOOGLE_PROJECT_NUMBER=879957335508

# Google Email
GOOGLE_APP_PASSWORD=kxghcdjakajuqiex
GOOGLE_EMAIL=gm@zien-ai.app
GOOGLE_DEVELOPER_ACCOUNT_ID=6352143689654149654
```

### AI Services
```env
# OpenAI
OPENAI_API_KEY=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

# Anthropic/Claude
ANTHROPIC_API_KEY=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
CLAUDE_API_KEY=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

# ElevenLabs
ELEVENLABS_API_KEY=eeda5ba6afa0e502217e46b76ad3a1fe6388d63dc55a43f812ded9a15094af26
ELEVENLABS_WEBHOOK_SECRET=wsec_de8cca726b180b1e176ad3054b8e0252dd9f72bf89047058c350afe811885bb0
ELEVENLABS_CONVAI_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka
ELEVENLABS_SYSTEM_AGENT_ID=9401kb2n0gf5e2wtp4sfs8chdmk1
ELEVENLABS_VOICE_ID_1=9401kb2n0gf5e2wtp4sfs8chdmk1
ELEVENLABS_VOICE_ID_2=6ZVgc4q9LWAloWbuwjuu
ELEVENLABS_VOICE_ID_3=4wf10lgibMnboGJGCLrP
ELEVENLABS_VOICE_ID_4=IES4nrmZdUBHByLBde0P
ELEVENLABS_VOICE_ID_5=LjKPkQHpXCsWoy7Pjq4U
ELEVENLABS_VOICE_ID_6=WkVhWA2EqSfUAWAZG7La
```

### Payment Services (Stripe)
```env
# Stripe Live
STRIPE_SECRET_KEY=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
STRIPE_PUBLISHABLE_KEY=pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg

# Stripe Test
STRIPE_TEST_SECRET_KEY=sk_test_51SQHZBRxUp84KGVtArjvFLuyEo2hDyCXUuAbBZrWspIrKxm88JMH2ROko12jtAPfwsF59ntbwaEvPpPTOULZgFMp00r3JSB6pM
STRIPE_TEST_PUBLISHABLE_KEY=pk_test_51SQHZBRxUp84KGVtnUKnLDm6G7XGnQS4IqZ4tY7XHsTIQPqdbPfan9PlulP37Ou2JDfY4n7KChGHi4mSixm0GQ7G0074lOErHz
```

### Database Services
```env
# MongoDB
MONGODB_URI=mongodb+srv://algeneralns_db_user:XWeCOl0X8fd9IVjc@cluster0.u5c1uim.mongodb.net/?appName=Cluster0
MONGODB_USERNAME=algeneralns_db_user
MONGODB_PASSWORD=XWeCOl0X8fd9IVjc
MONGODB_DB_NAME=rare4n

# Supabase
SUPABASE_URL=https://fgvrilruqzajstprioqj.supabase.co
SUPABASE_ANON_KEY=sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy
SUPABASE_SERVICE_ROLE_KEY=... # إذا كان موجود
```

### Communication Services (Twilio)
```env
# Twilio Live
TWILIO_ACCOUNT_SID=ACc42acaf23e9bd1ac77db85146592a1c5
TWILIO_AUTH_TOKEN=af89352f2a772b059d091d5f8a6f0cfc
TWILIO_PHONE_NUMBER=+12764441919
TWILIO_VERIFY_SERVICE_SID=VAc3c8ccaac82acf3f416961d2338f45f9

# Twilio Test
TWILIO_TEST_ACCOUNT_SID=AC9f9e1a4fb27367804becafc17d97294a
TWILIO_TEST_AUTH_TOKEN=ee0f646e0ec681d09b5feac2ab74ec90

# Twilio WhatsApp Templates
TWILIO_WHATSAPP_TEMPLATE_AUTH=HXec1f2993a72776d74fe403bfe615f233
TWILIO_WHATSAPP_TEMPLATE_WELCOME=HX817e5ecfdbde4c9d0bf40133c766d706
TWILIO_WHATSAPP_TEMPLATE_APPOINTMENT=HX2e380a55e71bb53e2160953c712014b3
TWILIO_WHATSAPP_TEMPLATE_ORDER_TRACKING=HX5e2c4d886681900ce6a070066c589047
TWILIO_WHATSAPP_TEMPLATE_ORDER_UPDATE_1=HXb5566aca56dbce01e3999059e4ad82bd
TWILIO_WHATSAPP_TEMPLATE_ORDER_UPDATE_2=HX254f831d1ad90c042c90cd5992cd0b7b
TWILIO_WHATSAPP_TEMPLATE_OPT_IN=HXa6b3897c24586d8bf41c822b7dd8e9d2

# Twilio SendGrid
TWILIO_SENDGRID_ADDON_SID=XBde96a04f11b85b21891f21c916bcf577
TWILIO_SENDGRID_INSTALLED_SID=XE74569eb148c04f83f7d6138beda1d1cc
```

### Security Keys
```env
# JWT & Encryption
RARE_JWT_SECRET=91d517e555899ffc9ffc11ad11ad70743
RARE_MASTER_KEY=ea1f1612-11ad-4a05-a7a3-d96254db6df1
RARE_ENCRYPTION_SALT=d96254db6df1a4f3e4c71066dbdf
ADMIN_KILL_SWITCH_KEY=f0c64a0d16d5a7d3035d91a2c67e917821eacd81163454b26d75b7a82a8441918fb48f366d556d91209f5a1dcae9bdbadf97a53793245d15d53b65903d9157ac289af076d5354f87d72175ac1a93932e0959a9fdb7a5b941bdb79f645776c7d124e89485eea0d3e60aa968d954d00056035410adb65126ae31c9249d00e1a6c0
```

### Expo/EAS Configuration
```env
# Expo Tokens (للبناء من Backend)
EXPO_TOKEN_RARE_BUILDER_TOKEN=s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn
EXPO_REPOT_USER=yShWhw-crHY67K_hLihVT4VnWaS-7fwSe8i1e0eR
EXPO_GET_REPO_TOKEN=3BmqeIIHZgGwX4qhLXmLn3OVwzXnfeXzKWPlQEKo
EXPO_GITHUB_ACTIONS_TOKEN=BQyGjnKhyfOP8f7AUnj9F1iH4slIE93kvLhGZOkT
EXPO_PROJECT_ID=c2f7ad03-bef4-4e74-b426-4170a9d788b3
EXPO_SLUG=rare-4n
EXPO_OWNER=zien
```

### Server Configuration
```env
# Domain & Contact
DOMAIN=zien-ai.app
GOOGLE_WORKSPACE_EMAIL=gm@zien-ai.app
PHONE_NUMBER=+971529211077

# API Configuration
API_DOMAIN=https://api.zien-ai.app
PORT=5000
NODE_ENV=production
ALLOWED_ORIGINS=https://api.zien-ai.app,http://localhost:5000,exp://localhost:8081,exp://localhost:8082,http://localhost:8082

# Auto Builder
BUILDER_ENGINE_KEY=RARE4N-BUILDER-a4f3e4c7-58e5-4119-9e4d-e6cb11170743
BUILDER_SIGNING_PASSWORD=System.generate-nader.1993
```

---

## 📱 2. Expo EAS Secrets (للبناء)

**الموقع:** Expo Dashboard → Project Settings → Secrets  
**الحالة:** ✅ **مفاتيح البناء فقط**

### المفاتيح المطلوبة في EAS Secrets:

```bash
# Expo Token (للوصول إلى EAS API)
EXPO_TOKEN=exp_...

# Apple App Store Connect (للبناء على iOS)
ASC_API_KEY_ID=6AR5VSRINSC3
ASC_API_KEY_ISSUER_ID=BN4DXG557F
ASC_API_KEY_P8="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Google Play (للبناء على Android - Optional)
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON={"type":"service_account",...}

# Environment Variables للبناء (Publishable Keys Only)
EXPO_PUBLIC_API_URL=https://api.zien-ai.app
EXPO_PUBLIC_SUPABASE_URL=https://fgvrilruqzajstprioqj.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg
EXPO_PUBLIC_ELEVENLABS_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka
```

**ملاحظات:**
- ✅ `EXPO_TOKEN` - مطلوب للبناء
- ✅ `ASC_*` - مطلوب لبناء iOS
- ✅ `GOOGLE_PLAY_*` - مطلوب لبناء Android (اختياري)
- ✅ `EXPO_PUBLIC_*` - متغيرات البيئة للبناء (publishable keys only)

---

## 🔧 3. GitHub Secrets (للبناء عبر CI/CD)

**الموقع:** GitHub Repository → Settings → Secrets and variables → Actions  
**الحالة:** ✅ **مفاتيح CI/CD فقط**

### المفاتيح المطلوبة في GitHub Secrets:

```bash
# Expo
EXPO_TOKEN=exp_... # نفس المفتاح في EAS
EAS_PROJECT_ID=c2f7ad03-bef4-4e74-b426-4170a9d788b3

# Apple App Store Connect
ASC_API_KEY_ID=6AR5VSRINSC3
ASC_API_KEY_ISSUER_ID=BN4DXG557F
ASC_API_KEY_P8="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Google Play (Optional)
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON={"type":"service_account",...}

# Webhook URL (للإشعارات بعد البناء)
WEBHOOK_URL=https://api.zien-ai.app
```

### GitHub Variables (Non-secret):

```bash
# Project Info (Non-secret)
EAS_PROJECT_ID=c2f7ad03-bef4-4e74-b426-4170a9d788b3
EXPO_SLUG=rare-4n
EXPO_OWNER=zien
```

**ملاحظات:**
- ✅ `GITHUB_TOKEN` متوفر تلقائياً في GitHub Actions (لا حاجة لإضافته)
- ✅ استخدم **Secrets** للمفاتيح الحساسة
- ✅ استخدم **Variables** للقيم غير الحساسة

---

## 🌐 4. Base44/Client Portal (على الدومين)

**الموقع:** Base44 Dashboard → Environment Variables  
**الحالة:** ✅ **مفاتيح Publishable فقط - لا مفاتيح حساسة**

### المفاتيح المطلوبة في Base44:

```bash
# API URL (Public)
API_URL=https://api.zien-ai.app

# Publishable Keys Only
STRIPE_PUBLISHABLE_KEY=pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg
SUPABASE_URL=https://fgvrilruqzajstprioqj.supabase.co
SUPABASE_ANON_KEY=sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy

# ElevenLabs Agent ID (Non-secret)
ELEVENLABS_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka
```

**⚠️ مهم جداً:**
- ❌ **لا تضع مفاتيح حساسة هنا:**
  - `STRIPE_SECRET_KEY`
  - `OPENAI_API_KEY`
  - `TWILIO_AUTH_TOKEN`
  - أي مفتاح سري

- ✅ **فقط Publishable Keys:**
  - `STRIPE_PUBLISHABLE_KEY`
  - `SUPABASE_ANON_KEY`
  - `ELEVENLABS_AGENT_ID` (non-secret)

---

## 📲 5. Mobile App (app.config.js / EAS Secrets)

**الموقع:** `mobile/app.config.js` أو EAS Secrets  
**الحالة:** ✅ **مفاتيح Publishable فقط - EXPO_PUBLIC_***

### المفاتيح المطلوبة في Mobile App:

```javascript
// في app.config.js أو EAS Secrets
export default {
  expo: {
    extra: {
      // API URL
      EXPO_PUBLIC_API_URL: 'https://api.zien-ai.app',
      
      // Supabase (Publishable)
      EXPO_PUBLIC_SUPABASE_URL: 'https://fgvrilruqzajstprioqj.supabase.co',
      EXPO_PUBLIC_SUPABASE_KEY: 'sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy',
      
      // Stripe (Publishable)
      EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg',
      
      // ElevenLabs (Non-secret)
      EXPO_PUBLIC_ELEVENLABS_AGENT_ID: 'agent_0701kc4axybpf6fvak70xwfzpyka',
    }
  }
}
```

**⚠️ مهم جداً:**
- ❌ **لا تضع مفاتيح حساسة في Mobile App:**
  - `OPENAI_API_KEY`
  - `STRIPE_SECRET_KEY`
  - `TWILIO_AUTH_TOKEN`
  - أي مفتاح سري

- ✅ **فقط EXPO_PUBLIC_* (Publishable Keys):**
  - `EXPO_PUBLIC_API_URL`
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_KEY`
  - `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `EXPO_PUBLIC_ELEVENLABS_AGENT_ID`

---

## 📊 ملخص التوزيع (Distribution Summary)

| المفتاح | Backend .env | Expo EAS | GitHub Secrets | Base44/Portal | Mobile App |
|---------|--------------|----------|----------------|---------------|------------|
| **Apple Keys** | ✅ | ✅ (ASC) | ✅ (ASC) | ❌ | ❌ |
| **Cloudflare** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Google API** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **OpenAI** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Anthropic** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **ElevenLabs API** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **ElevenLabs Agent ID** | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Stripe Secret** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Stripe Publishable** | ✅ | ✅ | ❌ | ✅ | ✅ |
| **MongoDB** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Supabase URL** | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Supabase Anon Key** | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Twilio** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Security Keys** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Expo Token** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **API URL** | ✅ | ✅ | ❌ | ✅ | ✅ |

---

## ✅ قائمة التحقق النهائية (Final Checklist)

### Backend .env
- [ ] جميع المفاتيح الحساسة موجودة
- [ ] الملف في `.gitignore`
- [ ] لا يوجد في Git

### Expo EAS Secrets
- [ ] `EXPO_TOKEN` موجود
- [ ] `ASC_*` موجود (لـ iOS)
- [ ] `GOOGLE_PLAY_*` موجود (لـ Android - اختياري)
- [ ] `EXPO_PUBLIC_*` موجود (publishable keys only)

### GitHub Secrets
- [ ] `EXPO_TOKEN` موجود
- [ ] `ASC_*` موجود (لـ iOS)
- [ ] `GOOGLE_PLAY_*` موجود (لـ Android - اختياري)
- [ ] `WEBHOOK_URL` موجود

### Base44/Client Portal
- [ ] `API_URL` موجود
- [ ] `STRIPE_PUBLISHABLE_KEY` موجود
- [ ] `SUPABASE_URL` و `SUPABASE_ANON_KEY` موجود
- [ ] `ELEVENLABS_AGENT_ID` موجود
- [ ] **لا توجد مفاتيح حساسة**

### Mobile App
- [ ] `EXPO_PUBLIC_API_URL` موجود
- [ ] `EXPO_PUBLIC_SUPABASE_*` موجود
- [ ] `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` موجود
- [ ] `EXPO_PUBLIC_ELEVENLABS_AGENT_ID` موجود
- [ ] **لا توجد مفاتيح حساسة**

---

## 🚨 تحذيرات أمنية (Security Warnings)

1. **❌ لا ترفع `.env` إلى Git أبداً**
2. **❌ لا تضع مفاتيح حساسة في Client Portal**
3. **❌ لا تضع مفاتيح حساسة في Mobile App**
4. **✅ استخدم فقط Publishable Keys في Frontend**
5. **✅ جميع المفاتيح الحساسة في Backend فقط**
6. **✅ استخدم GitHub Secrets للـ CI/CD**
7. **✅ استخدم EAS Secrets للبناء**

---

**تاريخ الإنشاء:** 2026-01-05  
**آخر تحديث:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

