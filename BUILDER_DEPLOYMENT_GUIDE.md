# 🚀 دليل النشر - Builder Deployment Guide
## RARE 4N - Mobile Builder & Client Portal Builder

---

## 📋 نظرة عامة

**Builder** = نظام البناء الذي ينشئ تطبيقات للعملاء:
- ✅ **Mobile Builder** → يبني iOS + Android Apps
- ✅ **Client Portal Builder** → ينشر Client Portal على Cloudflare

**التطبيق الرئيسي** = التطبيق الحالي (iOS فقط) - لا يتغير

---

## 🎯 1. Mobile Builder

### 1.1 المنصات المدعومة

**من Builder:**
- ✅ **iOS** - App Store
- ✅ **Android** - APK / Google Play
- ✅ **Web** - Cloudflare Pages

**التطبيق الرئيسي:**
- ✅ **iOS فقط** - كما هو

### 1.2 كيفية البناء

**من Mobile App Builder:**
1. المستخدم يختار الميزات
2. يدفع عبر Stripe
3. Builder يبدأ البناء:
   - iOS → Expo EAS Build
   - Android → Expo EAS Build
   - Web → Cloudflare Pages

**النتيجة:**
- iOS App → App Store
- Android APK → للتحميل
- Web App → Cloudflare Pages

---

## 🌐 2. Client Portal Builder

### 2.1 النشر على Cloudflare

**من Client Portal Builder:**
1. المستخدم يختار الميزات
2. يدفع عبر Stripe
3. Builder ينشر على Cloudflare:
   - Cloudflare Pages (Static Site)
   - Cloudflare Workers (إذا لزم)

**النتيجة:**
- Client Portal → `client-portal.zien-ai.app` (أو دومين مخصص)

### 2.2 Cloudflare Configuration

**المفاتيح المطلوبة (في Backend .env):**
```bash
CLOUDFLARE_ACCOUNT_ID=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_ZONE_ID=cb61498c69c654043b54b30550151b8f
CLOUDFLARE_API_KEY=b1a6484ff2a4d441092133debec6b99ff512c
CLOUDFLARE_TUNNEL_ID=8280d872-79cc-4b82-9de8-a86ab4bf9540
CLOUDFLARE_R2_ACCESS_KEY_ID=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_R2_SECRET_ACCESS_KEY=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_R2_BUCKET_NAME=rare
```

---

## 📱 3. التطبيق الرئيسي (iOS Only)

### 3.1 التكوين الحالي

**الملفات:**
- ✅ `mobile/app.json` - iOS Only
- ✅ `mobile/eas.json` - iOS Only
- ✅ `mobile/app.config.js` - iOS Only

**لا يتغير** - هذا التطبيق الرئيسي

---

## 🔄 4. معرفة التحديثات

### 4.1 على GitHub

**الموقع:** https://github.com/algeneral-n/abo-zien

**كيفية معرفة التحديثات:**
1. اذهب إلى Repository
2. اضغط على **"Commits"**
3. ستجد جميع التحديثات مع:
   - التاريخ والوقت
   - Commit Message
   - الملفات المحدثة

### 4.2 على App Store

**الموقع:** App Store Connect

**كيفية معرفة التحديثات:**
1. اذهب إلى: https://appstoreconnect.apple.com
2. اختر التطبيق: **RARE 4N**
3. اضغط على **"App Store"** → **"Versions"**
4. ستجد جميع الإصدارات مع:
   - رقم الإصدار
   - تاريخ النشر
   - الحالة (Pending/Ready/Released)

### 4.3 على Base44

**الموقع:** Base44 Dashboard

**كيفية معرفة التحديثات:**
1. اذهب إلى: Base44 Dashboard
2. اختر Project: **rare4n-client-portal**
3. اضغط على **"Deployments"**
4. ستجد جميع التحديثات مع:
   - التاريخ والوقت
   - Commit Message
   - Status (Success/Failed)

---

## 🌐 5. Google Translation API

### 5.1 في Client Portal

**✅ تم إضافة:**
- `apps/client-portal/services/TranslationService.js`
- يستخدم `/api/translation/translate`
- يحل محل i18n

**الاستخدام:**
```javascript
import translationService from './services/TranslationService.js';

// ترجمة نص
const translated = await translationService.translateText('Welcome', 'ar');

// تغيير اللغة
translationService.setLanguage('ar');
```

### 5.2 في Mobile App

**✅ تم إضافة:**
- `mobile/services/googleTranslationService.ts`
- يستخدم `/api/translation/translate`
- يحل محل i18n

**الاستخدام:**
```typescript
import googleTranslationService from './services/googleTranslationService';

// ترجمة نص
const translated = await googleTranslationService.translateText('Welcome', 'ar');

// تغيير اللغة
await googleTranslationService.setLanguage('ar');
```

---

## 📊 6. ملخص الاستيرادات

### 6.1 Client Portal

**الملفات المحدثة:**
- ✅ `apps/client-portal/app-new.js` - إضافة TranslationService
- ✅ `apps/client-portal/services/TranslationService.js` - جديد
- ✅ `apps/client-portal/config.js` - يقرأ من Environment Variables

**الاستيرادات:**
```javascript
import { CONFIG } from './config.js';
import translationService from './services/TranslationService.js';
```

### 6.2 Mobile App

**الملفات المحدثة:**
- ✅ `mobile/services/googleTranslationService.ts` - جديد

**الاستيرادات:**
```typescript
import { API_URL } from './services/config';
import googleTranslationService from './services/googleTranslationService';
```

---

## ✅ 7. قائمة التحقق

### Mobile Builder
- [ ] iOS Build يعمل
- [ ] Android Build يعمل
- [ ] Web Build (Cloudflare) يعمل
- [ ] المفاتيح موجودة في Backend .env

### Client Portal Builder
- [ ] Cloudflare Deployment يعمل
- [ ] المفاتيح موجودة في Backend .env
- [ ] Environment Variables موجودة في Base44

### Google Translation API
- [ ] Client Portal يستخدم TranslationService
- [ ] Mobile App يستخدم googleTranslationService
- [ ] API Routes تعمل في Backend

---

**تاريخ الإنشاء:** 2026-01-05  
**آخر تحديث:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

