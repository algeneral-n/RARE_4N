# 🌐 Google Translate API - إعداد Portal

## ✅ الإجابة: لا، لا تحتاج لوضع المفتاح في Base44

### 📋 كيف يعمل النظام:

```
Portal (Frontend)
  ↓ يرسل طلب
Backend API (/api/translation/translate)
  ↓ يستخدم GOOGLE_API_KEY
Google Translation API
  ↓ يعيد الترجمة
Backend
  ↓ يعيد النتيجة
Portal (Frontend)
```

---

## 🔑 المفاتيح المطلوبة

### ✅ Backend فقط (`apps/backend/.env`)

```env
GOOGLE_API_KEY=your-google-api-key-here
```

**⚠️ مهم:**
- المفتاح موجود في **Backend فقط**
- **لا** تحتاج لوضعه في Base44
- Portal لا يتواصل مباشرة مع Google

---

## ✅ ما تم تحديثه

### 1. تحديث `TranslationService.js` في Portal
- ✅ يستخدم `apiClient.js` الآن
- ✅ يضيف `X-Portal-Key` تلقائياً في جميع طلبات الترجمة
- ✅ يعمل مع جميع endpoints:
  - `/api/translation/translate`
  - `/api/translation/translate-batch`
  - `/api/translation/detect`
  - `/api/translation/languages`

---

## 📝 خطوات الإعداد

### 1. إضافة المفتاح في Backend

أضف في `apps/backend/.env`:

```env
GOOGLE_API_KEY=your-google-api-key-here
```

### 2. الحصول على Google API Key

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعّل **Cloud Translation API**
4. أنشئ **API Key** من **Credentials**
5. انسخ المفتاح وأضفه في `.env`

### 3. إعادة تشغيل Backend

```bash
pm2 restart rare4n-backend
# أو
npm start
```

---

## 🧪 الاختبار

### اختبار من Portal

افتح Console في المتصفح وجرب:

```javascript
import { translationService } from './services/TranslationService.js';

// ترجمة نص واحد
const translated = await translationService.translateText('Hello World', 'ar');
console.log(translated); // "مرحبا بالعالم"

// ترجمة متعددة
const texts = ['Hello', 'World', 'Welcome'];
const translated = await translationService.translateBatch(texts, 'ar');
console.log(translated); // ["مرحبا", "العالم", "أهلا بك"]

// كشف اللغة
const lang = await translationService.detectLanguage('مرحبا');
console.log(lang); // "ar"
```

### اختبار من Backend مباشرة

```bash
curl -X POST https://api.zien-ai.app/api/translation/translate \
  -H "Content-Type: application/json" \
  -H "X-Portal-Key: HEADRAREBACK1END0097100201141009563" \
  -d '{
    "text": "Hello World",
    "targetLanguage": "ar"
  }'
```

---

## 🔒 الأمان

### ✅ المفتاح آمن في Backend
- المفتاح موجود في `.env` (محمي في `.gitignore`)
- Portal لا يحتاج للمفتاح
- جميع الطلبات تمر عبر Backend

### ✅ Portal Key مطلوب
- جميع طلبات الترجمة من Portal تتضمن `X-Portal-Key`
- Backend يتحقق من المفتاح قبل المعالجة

---

## 📚 الملفات المحدثة

1. ✅ `apps/client-portal/services/TranslationService.js` - يستخدم `apiClient.js`
2. ✅ `apps/client-portal/utils/apiClient.js` - يضيف `X-Portal-Key` تلقائياً
3. ✅ `apps/backend/src/services/translationService.js` - يستخدم `GOOGLE_API_KEY`

---

## ⚠️ ملاحظات مهمة

1. **لا تضع `GOOGLE_API_KEY` في Base44** - المفتاح في Backend فقط
2. **تأكد من تفعيل Cloud Translation API** في Google Cloud Console
3. **راقب الاستخدام** - Google Translation API له حدود استخدام (500,000 حرف/شهر مجاناً)
4. **Cache** - Portal يستخدم cache للترجمات لتقليل الطلبات

---

**تم التحديث:** 2025-01-XX  
**الحالة:** ✅ جاهز للاستخدام

