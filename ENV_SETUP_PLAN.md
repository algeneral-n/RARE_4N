# خطة تنفيذ إعداد ملفات البيئة والمفاتيح
## Environment Variables & Credentials Setup Plan

---

## 📋 نظرة عامة (Overview)

هذه الخطة الشاملة لتنظيم وإعداد ملفات البيئة (.env) والمفاتيح الحساسة للمشروع RARE 4N.

**الهدف:** 
- إنشاء ملف `.env` واحد في الباك اند بالقيم الحقيقية
- إنشاء ملفات `.env.example` بدون قيم حقيقية
- إنشاء ملفات التكوين للتطبيق المحمول (app.json, eas.json, app.config.js)
- ضمان عدم تسريب المفاتيح الحساسة في Git

**⚠️ ملاحظة مهمة عن Google API Key:**
- المفتاح `AIzaSyCuS7FajWuQLpNJtyTFrwWjDMdi6wp7wmg` يعمل مع **جميع الخدمات الـ14** التالية:
  1. Places API (New)
  2. Maps JavaScript API
  3. Geocoding API
  4. Directions API
  5. Cloud Translation API
  6. Cloud Vision API
  7. Dialogflow API
  8. Generative Language API (Gemini)
  9. Google Cloud Storage JSON API
  10. Organization Policy API
  11. Web Security Scanner API
  12. Gemini Cloud Assist API
  13. Cloud Natural Language API
  14. Tenor API
- **يجب استخدام نفس المفتاح لجميع هذه الخدمات** في ملف `.env`
- سيتم استخدام `GOOGLE_API_KEY` كمتغير رئيسي ويمكن استخدامه في جميع الخدمات

---

## 🔐 الملفات الحساسة المصدر (Source Credential Files)

### 1. Apple Info (`apple info.ini`)
**المفاتيح المستخرجة:**
- `APPLE_BUNDLE_ID=com.rare4n.app`
- `APPLE_APP_ID=6756657662`
- `APPLE_SKU=rare4n-app-001`
- `APPLE_TEAM_ID=BN4DXG557F`
- `APPLE_KEY_ID=6AR5VSRINSC3`
- `APPLE_PRIVATE_KEY` (P8 Key - كامل)
- `APPLE_DEVELOPER_ID=d790aa1b-f46a-46dc-8187-b94b5e372c16`
- `APPLE_WEATHERKIT_KEY_ID=L3KM677Z7Y`
- `APPLE_MAPKIT_TOKEN` (JWT tokens)
- `APPLE_PAY_LATER_TOKEN` (JWT token)
- `APPLE_ACCOUNT_EMAIL=nader200812@gmail.com`
- `APPLE_PHONE=971-529211077`

### 2. Cloudflare Info (`cloudflare all info.ts`)
**المفاتيح المستخرجة:**
- `CLOUDFLARE_ACCOUNT_ID=ccc1ed9ab170eaf1e72e9a10e46ef320`
- `CLOUDFLARE_ZONE_ID=cb61498c69c654043b54b30550151b8f`
- `CLOUDFLARE_API_KEY=b1a6484ff2a4d441092133debec6b99ff512c`
- `CLOUDFLARE_ORIGIN_CA_KEY` (v1.0-...)
- `CLOUDFLARE_TUNNEL_ID=8280d872-79cc-4b82-9de8-a86ab4bf9540`
- `CLOUDFLARE_ACCOUNT_TAG=ccc1ed9ab170eaf1e72e9a10e46ef320`
- `CLOUDFLARE_R2_ACCESS_KEY_ID` (S3 API)
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY` (S3 API)
- `CLOUDFLARE_R2_BUCKET_NAME=rare`
- `CLOUDFLARE_R2_ENDPOINT=https://ccc1ed9ab170eaf1e72e9a10e46ef320.r2.cloudflarestorage.com`
- `CLOUDFLARE_TURN_TOKEN_ID=dd3ae93e7342ed950f3e008165931d86`
- `CLOUDFLARE_TURN_API_TOKEN=29177584e99d8f3a485d141c1a153ce3af879e1785ab84b89cf9d4e4ab979057`
- `CLOUDFLARE_REALTIME_APP_ID=36640e04a83766c8b7fcc90271296bfe`
- `CLOUDFLARE_REALTIME_APP_SECRET=da37e71594a405e7787c8c9edefe23b6513c5b51800edb6b4053a6aad9d4c70f`
- `CLOUDFLARE_ORIGIN_CERTIFICATE` (PEM certificate)
- `CLOUDFLARE_ORIGIN_PRIVATE_KEY` (PEM private key)
- `CLOUDFLARE_CLIENT_CERTIFICATE` (PEM certificate)
- `CLOUDFLARE_CLIENT_PRIVATE_KEY` (PEM private key)

### 3. Google Services (`google services api and de.py`)
**المفاتيح المستخرجة:**
- `GOOGLE_API_KEY=AIzaSyCuS7FajWuQLpNJtyTFrwWjDMdi6wp7wmg` ⚠️ **مفتاح واحد لجميع الخدمات الـ14**
  - ✅ Places API (New)
  - ✅ Maps JavaScript API
  - ✅ Geocoding API
  - ✅ Directions API
  - ✅ Cloud Translation API
  - ✅ Cloud Vision API
  - ✅ Dialogflow API
  - ✅ Generative Language API (Gemini)
  - ✅ Google Cloud Storage JSON API
  - ✅ Organization Policy API
  - ✅ Web Security Scanner API
  - ✅ Gemini Cloud Assist API
  - ✅ Cloud Natural Language API
  - ✅ Tenor API
- `GEMINI_API_KEY=AIzaSyAL_vCrbXHc9dZ1YCi1vR1dyVyL3NoiS7Y` (مفتاح Gemini منفصل - يمكن استخدام GOOGLE_API_KEY بدلاً منه)
- `GOOGLE_PROJECT_ID=valiant-bonbon-479503-p3`
- `GOOGLE_PROJECT_NUMBER=879957335508`
- `GOOGLE_OAUTH_CLIENT_ID=908797961106-sh9q3pki39sh8blu13ga67e26kq6243d.apps.googleusercontent.com`
- `GOOGLE_OAUTH_CLIENT_SECRET=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`
- `GOOGLE_APP_PASSWORD=kxghcdjakajuqiex`
- `GOOGLE_EMAIL=gm@zien-ai.app`
- `GOOGLE_DEVELOPER_ACCOUNT_ID=6352143689654149654`

**⚠️ ملاحظة مهمة:** 
- المفتاح `GOOGLE_API_KEY` يعمل مع جميع الخدمات الـ14 المذكورة أعلاه
- يمكن استخدام نفس المفتاح لـ Maps, Gemini, Vision, Translation, Geocoding, Directions, Places, وغيرها
- في ملف `.env` سنستخدم `GOOGLE_API_KEY` كمتغير رئيسي ويمكن استخدامه في جميع الخدمات

### 4. Other Services (`OTHER SERVICES.ini`)
**المفاتيح المستخرجة:**
- `OPENAI_API_KEY=sk-proj-...`
- `ANTHROPIC_API_KEY=sk-ant-api03-...`
- `CLAUDE_API_KEY=sk-ant-api03-...`
- `ELEVENLABS_API_KEY=eeda5ba6afa0e502217e46b76ad3a1fe6388d63dc55a43f812ded9a15094af26`
- `ELEVENLABS_WEBHOOK_SECRET=wsec_de8cca726b180b1e176ad3054b8e0252dd9f72bf89047058c350afe811885bb0`
- `ELEVENLABS_CONVAI_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka`
- `ELEVENLABS_SYSTEM_AGENT_ID=9401kb2n0gf5e2wtp4sfs8chdmk1`
- `ELEVENLABS_VOICE_ID_1=9401kb2n0gf5e2wtp4sfs8chdmk1`
- `ELEVENLABS_VOICE_ID_2=6ZVgc4q9LWAloWbuwjuu`
- `ELEVENLABS_VOICE_ID_3=4wf10lgibMnboGJGCLrP`
- `ELEVENLABS_VOICE_ID_4=IES4nrmZdUBHByLBde0P`
- `ELEVENLABS_VOICE_ID_5=LjKPkQHpXCsWoy7Pjq4U`
- `ELEVENLABS_VOICE_ID_6=WkVhWA2EqSfUAWAZG7La`
- `STRIPE_SECRET_KEY=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`
- `STRIPE_PUBLISHABLE_KEY=pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg`
- `STRIPE_TEST_SECRET_KEY=sk_test_51SQHZBRxUp84KGVtArjvFLuyEo2hDyCXUuAbBZrWspIrKxm88JMH2ROko12jtAPfwsF59ntbwaEvPpPTOULZgFMp00r3JSB6pM`
- `STRIPE_TEST_PUBLISHABLE_KEY=pk_test_51SQHZBRxUp84KGVtnUKnLDm6G7XGnQS4IqZ4tY7XHsTIQPqdbPfan9PlulP37Ou2JDfY4n7KChGHi4mSixm0GQ7G0074lOErHz`
- `MONGODB_URI=mongodb+srv://algeneralns_db_user:XWeCOl0X8fd9IVjc@cluster0.u5c1uim.mongodb.net/?appName=Cluster0`
- `MONGODB_USERNAME=algeneralns_db_user`
- `MONGODB_PASSWORD=XWeCOl0X8fd9IVjc`
- `MONGODB_DB_NAME=rare4n`
- `SUPABASE_URL=https://fgvrilruqzajstprioqj.supabase.co`
- `SUPABASE_ANON_KEY=sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy`
- `RARE_JWT_SECRET=91d517e555899ffc9ffc11ad11ad70743`
- `RARE_MASTER_KEY=ea1f1612-11ad-4a05-a7a3-d96254db6df1`
- `RARE_ENCRYPTION_SALT=d96254db6df1a4f3e4c71066dbdf`
- `ADMIN_KILL_SWITCH_KEY=f0c64a0d16d5a7d3035d91a2c67e917821eacd81163454b26d75b7a82a8441918fb48f366d556d91209f5a1dcae9bdbadf97a53793245d15d53b65903d9157ac289af076d5354f87d72175ac1a93932e0959a9fdb7a5b941bdb79f645776c7d124e89485eea0d3e60aa968d954d00056035410adb65126ae31c9249d00e1a6c0`
- `EXPO_TOKEN_RARE_BUILDER_TOKEN=s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn`
- `EXPO_REPOT_USER=yShWhw-crHY67K_hLihVT4VnWaS-7fwSe8i1e0eR`
- `EXPO_GET_REPO_TOKEN=3BmqeIIHZgGwX4qhLXmLn3OVwzXnfeXzKWPlQEKo`
- `EXPO_GITHUB_ACTIONS_TOKEN=BQyGjnKhyfOP8f7AUnj9F1iH4slIE93kvLhGZOkT`
- `EXPO_PROJECT_ID=c2f7ad03-bef4-4e74-b426-4170a9d788b3`
- `EXPO_SLUG=rare-4n`
- `EXPO_OWNER=zien`
- `BUILDER_ENGINE_KEY=RARE4N-BUILDER-a4f3e4c7-58e5-4119-9e4d-e6cb11170743`
- `BUILDER_SIGNING_PASSWORD=System.generate-nader.1993`
- `DOMAIN=zien-ai.app`
- `GOOGLE_WORKSPACE_EMAIL=gm@zien-ai.app`
- `PHONE_NUMBER=+971529211077`

### 5. Twilio (`TWILO.csv`)
**المفاتيح المستخرجة:**
- `TWILIO_ACCOUNT_SID=ACc42acaf23e9bd1ac77db85146592a1c5`
- `TWILIO_AUTH_TOKEN=af89352f2a772b059d091d5f8a6f0cfc`
- `TWILIO_PHONE_NUMBER=+12764441919`
- `TWILIO_VERIFY_SERVICE_SID=VAc3c8ccaac82acf3f416961d2338f45f9`
- `TWILIO_TEST_ACCOUNT_SID=AC9f9e1a4fb27367804becafc17d97294a`
- `TWILIO_TEST_AUTH_TOKEN=ee0f646e0ec681d09b5feac2ab74ec90`
- `TWILIO_WHATSAPP_TEMPLATE_AUTH=HXec1f2993a72776d74fe403bfe615f233`
- `TWILIO_WHATSAPP_TEMPLATE_WELCOME=HX817e5ecfdbde4c9d0bf40133c766d706`
- `TWILIO_WHATSAPP_TEMPLATE_APPOINTMENT=HX2e380a55e71bb53e2160953c712014b3`
- `TWILIO_WHATSAPP_TEMPLATE_ORDER_TRACKING=HX5e2c4d886681900ce6a070066c589047`
- `TWILIO_WHATSAPP_TEMPLATE_ORDER_UPDATE_1=HXb5566aca56dbce01e3999059e4ad82bd`
- `TWILIO_WHATSAPP_TEMPLATE_ORDER_UPDATE_2=HX254f831d1ad90c042c90cd5992cd0b7b`
- `TWILIO_WHATSAPP_TEMPLATE_OPT_IN=HXa6b3897c24586d8bf41c822b7dd8e9d2`
- `TWILIO_SENDGRID_ADDON_SID=XBde96a04f11b85b21891f21c916bcf577`
- `TWILIO_SENDGRID_INSTALLED_SID=XE74569eb148c04f83f7d6138beda1d1cc`

---

## 📁 هيكل الملفات المطلوب (Required File Structure)

```
abo-zien/
├── apps/
│   └── backend/
│       ├── .env                    # ✅ ملف البيئة الحقيقي (مع القيم الحقيقية)
│       └── .env.example            # ✅ ملف المثال (بدون قيم حقيقية)
│
├── mobile/
│   ├── app.json                    # ✅ تكوين Expo (بدون قيم حقيقية)
│   ├── eas.json                    # ✅ تكوين EAS Build (بدون قيم حقيقية)
│   └── app.config.js               # ✅ تكوين ديناميكي (بدون قيم حقيقية)
│
├── .gitignore                       # ✅ تحديث لإضافة .env
└── README_ENV_SETUP.md              # ✅ دليل الإعداد
```

---

## 📝 الخطوات التفصيلية (Detailed Steps)

### المرحلة 1: إنشاء ملف .env للباك اند (Backend .env)

**الموقع:** `apps/backend/.env`

**المحتوى:**
- جميع المفاتيح الحساسة من الملفات الخمسة
- منظمة حسب الفئات:
  1. Apple Services
  2. Cloudflare Services
  3. Google Services
  4. AI Services (OpenAI, Anthropic, ElevenLabs)
  5. Payment Services (Stripe)
  6. Database Services (MongoDB, Supabase)
  7. Communication Services (Twilio)
  8. Security Keys
  9. Expo/EAS Configuration
  10. Server Configuration

**ملاحظات:**
- استخدام `\n` للأسطر الطويلة (مثل المفاتيح الخاصة)
- حفظ المفاتيح الخاصة (P8, PEM) كأسطر متعددة
- استخدام علامات الاقتباس للمفاتيح التي تحتوي على أحرف خاصة

**⚠️ استخدام Google API Key بشكل صحيح:**
```env
# مفتاح Google الرئيسي - يعمل مع جميع الخدمات الـ14
GOOGLE_API_KEY=AIzaSyCuS7FajWuQLpNJtyTFrwWjDMdi6wp7wmg

# يمكن استخدام نفس المفتاح لجميع الخدمات:
GOOGLE_MAPS_API_KEY=${GOOGLE_API_KEY}           # Maps, Places, Geocoding, Directions
GEMINI_API_KEY=${GOOGLE_API_KEY}                # Generative Language API (Gemini)
GOOGLE_VISION_API_KEY=${GOOGLE_API_KEY}         # Cloud Vision API
GOOGLE_TRANSLATION_API_KEY=${GOOGLE_API_KEY}    # Cloud Translation API
GOOGLE_NATURAL_LANGUAGE_API_KEY=${GOOGLE_API_KEY} # Cloud Natural Language API
GOOGLE_DIALOGFLOW_API_KEY=${GOOGLE_API_KEY}      # Dialogflow API
GOOGLE_STORAGE_API_KEY=${GOOGLE_API_KEY}        # Cloud Storage JSON API
GOOGLE_TENOR_API_KEY=${GOOGLE_API_KEY}          # Tenor API

# أو يمكن استخدام GOOGLE_API_KEY مباشرة في الكود لجميع الخدمات
```

---

### المرحلة 2: إنشاء ملف .env.example للباك اند

**الموقع:** `apps/backend/.env.example`

**المحتوى:**
- نفس هيكل `.env` لكن بدون قيم حقيقية
- استخدام placeholders مثل:
  - `YOUR_APPLE_TEAM_ID`
  - `YOUR_CLOUDFLARE_API_KEY`
  - `YOUR_GEMINI_API_KEY`
  - إلخ...

**مثال:**
```env
# Apple Services
APPLE_BUNDLE_ID=com.your.app
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_KEY_ID=YOUR_KEY_ID
APPLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_CONTENT\n-----END PRIVATE KEY-----

# Google Services
# ⚠️ مفتاح واحد لجميع الخدمات الـ14: Maps, Places, Geocoding, Directions, Gemini, Vision, Translation, Natural Language, Dialogflow, Cloud Storage, وغيرها
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
# يمكن استخدام GOOGLE_API_KEY لجميع الخدمات أو استخدام مفاتيح منفصلة:
GOOGLE_MAPS_API_KEY=${GOOGLE_API_KEY}  # نفس المفتاح
GEMINI_API_KEY=${GOOGLE_API_KEY}        # نفس المفتاح (أو مفتاح منفصل)
GOOGLE_VISION_API_KEY=${GOOGLE_API_KEY} # نفس المفتاح
GOOGLE_TRANSLATION_API_KEY=${GOOGLE_API_KEY} # نفس المفتاح
```

---

### المرحلة 3: إنشاء ملف app.json للتطبيق المحمول

**الموقع:** `mobile/app.json`

**المحتوى:**
- Bundle ID: `com.rare4n.app`
- App Name: `RARE 4N`
- Version: `1.0.0`
- iOS Configuration:
  - Team ID
  - Bundle Identifier
  - Info.plist settings
- Android Configuration (إن وجد)
- Expo Configuration:
  - Project ID
  - Slug
  - Owner

**ملاحظات:**
- لا يحتوي على قيم حساسة
- يمكن استخدام متغيرات البيئة من EAS Secrets

---

### المرحلة 4: إنشاء ملف eas.json

**الموقع:** `mobile/eas.json`

**المحتوى:**
- Build Profiles:
  - `development`
  - `preview`
  - `production`
- iOS Configuration:
  - Distribution method
  - Provisioning profile
  - Certificates
- Android Configuration (إن وجد)
- Environment Variables (مراجع إلى EAS Secrets)

**ملاحظات:**
- لا يحتوي على قيم حقيقية
- يستخدم EAS Secrets للمفاتيح الحساسة

---

### المرحلة 5: إنشاء ملف app.config.js

**الموقع:** `mobile/app.config.js`

**المحتوى:**
- تكوين ديناميكي يعتمد على البيئة
- قراءة المتغيرات من `process.env`
- إعدادات iOS و Android
- إعدادات Expo

**ملاحظات:**
- لا يحتوي على قيم حساسة مباشرة
- يستخدم `process.env` للمفاتيح

---

### المرحلة 6: تحديث .gitignore

**الموقع:** `.gitignore`

**الإضافات المطلوبة:**
```
# Environment Variables
.env
.env.local
.env.*.local
apps/backend/.env
apps/backend/.env.local
mobile/.env
mobile/.env.local

# Credentials
*.p8
*.pem
*.key
*.cert
AuthKey_*.p8
**/credentials/**
**/credintials/**

# Apple Certificates
*.cer
*.mobileprovision
*.certSigningRequest
```

---

### المرحلة 7: إنشاء دليل الإعداد

**الموقع:** `README_ENV_SETUP.md`

**المحتوى:**
- تعليمات إعداد ملفات البيئة
- كيفية نسخ `.env.example` إلى `.env`
- كيفية ملء القيم الحقيقية
- كيفية استخدام EAS Secrets
- تحذيرات أمنية

---

## 🔒 الأمان (Security Considerations)

### 1. حماية الملفات الحساسة
- ✅ `.env` في `.gitignore`
- ✅ عدم رفع المفاتيح الخاصة إلى Git
- ✅ استخدام EAS Secrets للمفاتيح في التطبيق المحمول
- ✅ تشفير المفاتيح الحساسة في قاعدة البيانات (إن لزم)

### 2. أفضل الممارسات
- ✅ استخدام متغيرات البيئة فقط في الباك اند
- ✅ عدم تضمين المفاتيح في الكود
- ✅ استخدام `.env.example` كقالب
- ✅ تحديث `.env.example` عند إضافة مفاتيح جديدة

### 3. التحقق من الأمان
- ✅ فحص `.gitignore` قبل كل commit
- ✅ فحص الملفات المرفوعة إلى Git
- ✅ استخدام `git-secrets` أو `truffleHog` للفحص

---

## 📊 قائمة المفاتيح الكاملة (Complete Keys List)

### Apple (15+ مفاتيح)
- Bundle ID, App ID, SKU
- Team ID, Key ID
- Private Key (P8)
- Developer ID
- WeatherKit Key ID
- MapKit Tokens
- Pay Later Token
- Account Info

### Cloudflare (20+ مفاتيح)
- Account ID, Zone ID
- API Keys
- Origin CA Keys
- Tunnel Configuration
- R2 Storage Credentials
- TURN Server Credentials
- Realtime App Credentials
- Certificates (Origin & Client)

### Google (10+ مفاتيح)
- **GOOGLE_API_KEY** (مفتاح واحد لجميع الخدمات الـ14):
  - Maps, Places, Geocoding, Directions
  - Gemini (Generative Language API)
  - Vision API
  - Translation API
  - Natural Language API
  - Dialogflow, Cloud Storage, وغيرها
- OAuth Credentials
- Project IDs
- Email Configuration
- Developer Account Info

### AI Services (10+ مفاتيح)
- OpenAI API Key
- Anthropic/Claude API Key
- ElevenLabs (API Key, Agent IDs, Voice IDs, Webhook Secret)

### Payment (4 مفاتيح)
- Stripe Live Keys (Secret & Publishable)
- Stripe Test Keys (Secret & Publishable)

### Database (5+ مفاتيح)
- MongoDB URI, Username, Password, DB Name
- Supabase URL, Anon Key

### Communication (15+ مفاتيح)
- Twilio Account SID, Auth Token
- Phone Number, Verify Service
- Test Credentials
- WhatsApp Template IDs
- SendGrid Addon SIDs

### Security (4+ مفاتيح)
- JWT Secret
- Master Key
- Encryption Salt
- Admin Kill Switch Key

### Expo/EAS (7+ مفاتيح)
- Project ID, Slug, Owner
- Tokens (Builder, Repo, GitHub Actions)

### Server Config (5+ مفاتيح)
- Domain, Email, Phone
- API Domain, Port
- Allowed Origins
- Builder Engine Key

---

## ✅ قائمة التحقق (Checklist)

### قبل التنفيذ:
- [ ] قراءة جميع الملفات الحساسة
- [ ] فهم هيكل المشروع
- [ ] فهم كيفية استخدام المفاتيح في الكود

### أثناء التنفيذ:
- [ ] إنشاء `apps/backend/.env` بالقيم الحقيقية
- [ ] إنشاء `apps/backend/.env.example` بدون قيم
- [ ] إنشاء `mobile/app.json`
- [ ] إنشاء `mobile/eas.json`
- [ ] إنشاء `mobile/app.config.js`
- [ ] تحديث `.gitignore`
- [ ] إنشاء `README_ENV_SETUP.md`

### بعد التنفيذ:
- [ ] التحقق من أن `.env` غير موجود في Git
- [ ] التحقق من أن جميع المفاتيح موجودة
- [ ] اختبار الباك اند مع `.env` الجديد
- [ ] اختبار التطبيق المحمول مع التكوينات الجديدة
- [ ] توثيق أي تغييرات إضافية

---

## 🚨 تحذيرات مهمة (Important Warnings)

1. **لا ترفع `.env` إلى Git أبداً**
2. **لا تشارك المفاتيح الحساسة عبر البريد الإلكتروني أو الرسائل**
3. **استخدم EAS Secrets للمفاتيح في التطبيق المحمول**
4. **احتفظ بنسخة احتياطية آمنة من المفاتيح**
5. **راجع `.gitignore` قبل كل commit**
6. **استخدم أدوات فحص الأمان قبل الرفع**

---

## 📞 الدعم (Support)

في حالة وجود أي مشاكل أو أسئلة:
1. راجع `README_ENV_SETUP.md`
2. راجع ملفات `.env.example` للتوضيح
3. تأكد من أن جميع المفاتيح مملوءة بشكل صحيح

---

**تاريخ الإنشاء:** 2026-01-05  
**آخر تحديث:** 2026-01-05  
**الحالة:** جاهز للتنفيذ بعد الموافقة

