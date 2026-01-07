# 📋 إعداد Base44 - Client Portal
## Base44 Setup Instructions - RARE 4N Client Portal

---

## ⚠️ **مهم جداً - لا تمس أي شيء قبل قراءة هذا الملف**

هذا الملف يحتوي على **جميع التعليمات** لإعداد Client Portal على Base44 بشكل صحيح.

**❌ لا تقم بتعديل أي ملفات قبل قراءة هذا الملف بالكامل**

---

## 📋 1. نظرة عامة

**Base44** هو منصة الاستضافة للـ Client Portal (البورتال).

**الموقع:** `portal.zien-ai.app` (أو الدومين المخصص)

---

## 🔧 2. إعداد Project على Base44

### 2.1 إنشاء Project جديد

1. اذهب إلى Base44 Dashboard
2. اضغط على **"New Project"**
3. اختر **"Static Site"** أو **"Vanilla JS"**
4. اسم المشروع: `rare4n-client-portal`

### 2.2 رفع الملفات

**الطريقة 1: Git Integration (موصى بها)**
1. اربط Repository مع Base44
2. Branch: `main` أو `clean-main`
3. Build Command: (لا حاجة - Vanilla JS)
4. Output Directory: `apps/client-portal` أو `/`

**الطريقة 2: Manual Upload**
1. ارفع مجلد `apps/client-portal/` كاملاً
2. تأكد من وجود `index.html` في الجذر

---

## 🔐 3. Environment Variables (مهم جداً)

### 3.1 المفاتيح المطلوبة

**الموقع:** Base44 Dashboard → Project Settings → Environment Variables

**⚠️ فقط Publishable Keys - لا مفاتيح حساسة**

```bash
# ============================================
# API Configuration
# ============================================
API_URL=https://api.zien-ai.app

# ============================================
# Stripe (Publishable Key Only)
# ============================================
STRIPE_PUBLISHABLE_KEY=pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg

# ============================================
# Supabase (Publishable Keys Only)
# ============================================
SUPABASE_URL=https://fgvrilruqzajstprioqj.supabase.co
SUPABASE_ANON_KEY=sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy

# ============================================
# ElevenLabs (Non-secret Agent ID)
# ============================================
ELEVENLABS_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka
```

### 3.2 كيفية الإضافة

1. اذهب إلى: Base44 Dashboard → Your Project → Settings → Environment Variables
2. اضغط على **"Add Variable"**
3. أدخل اسم المفتاح والقيمة
4. احفظ

**⚠️ مهم:**
- ❌ **لا تضع مفاتيح حساسة:**
  - `STRIPE_SECRET_KEY`
  - `OPENAI_API_KEY`
  - `TWILIO_AUTH_TOKEN`
  - أي مفتاح سري

- ✅ **فقط Publishable Keys:**
  - `STRIPE_PUBLISHABLE_KEY`
  - `SUPABASE_ANON_KEY`
  - `ELEVENLABS_AGENT_ID`

---

## 🌐 4. إعداد Custom Domain

### 4.1 إضافة Domain

1. اذهب إلى: Base44 Dashboard → Your Project → Settings → Domains
2. اضغط على **"Add Domain"**
3. أدخل: `portal.zien-ai.app`
4. اتبع التعليمات لإعداد DNS

### 4.2 DNS Configuration

**Cloudflare DNS Settings:**
- Type: `CNAME`
- Name: `portal`
- Target: `base44-provided-domain.com`
- Proxy: ✅ Enabled

---

## 🔄 5. Build & Deploy Configuration

### 5.1 Build Settings

**Base44 Build Configuration:**
- Build Command: (لا حاجة - Vanilla JS)
- Output Directory: `/` أو `apps/client-portal`
- Node Version: `18` (إذا لزم)

### 5.2 Auto Deploy

**Git Integration:**
- ✅ Auto Deploy: Enabled
- Branch: `main`
- Trigger: Push to `main` branch

---

## 📁 6. هيكل الملفات

**يجب أن يكون هيكل الملفات كالتالي:**

```
apps/client-portal/
├── index.html          (Entry point - مهم جداً)
├── app-new.js          (Main app)
├── config.js           (Configuration - يقرأ من Environment Variables)
├── styles.css          (Styling)
├── components/         (RARE Character, etc.)
├── pages/              (Dashboard, Libraries, Payments, etc.)
├── services/           (API services, Agents)
├── themes/             (Theme manager)
└── i18n/               (Languages - سيتم استبدالها بـ Google Translation API)
```

---

## ⚠️ 7. قواعد مهمة (لا تمس)

### 7.1 لا تمس هذه الملفات

- ❌ `config.js` - يقرأ من Environment Variables
- ❌ `app-new.js` - يحتوي على منطق التطبيق
- ❌ أي ملف في `services/` - يحتوي على منطق API

### 7.2 يمكنك تعديل

- ✅ `styles.css` - التصميم
- ✅ `themes/` - الثيمات
- ✅ `components/` - المكونات (بحذر)

---

## 🔄 8. التحديثات

### 8.1 كيفية التحديث

**الطريقة 1: Git Push (موصى بها)**
```bash
git add .
git commit -m "Update client portal"
git push origin main
# Base44 سيقوم بالبناء والنشر تلقائياً
```

**الطريقة 2: Manual Upload**
1. ارفع الملفات المحدثة
2. Base44 سيقوم بالبناء تلقائياً

### 8.2 معرفة التحديثات

**في Base44 Dashboard:**
- اذهب إلى: Deployments
- ستجد جميع التحديثات مع:
  - التاريخ والوقت
  - Commit Message
  - Status (Success/Failed)

**في GitHub:**
- اذهب إلى: Repository → Commits
- ستجد جميع التحديثات

---

## 🚨 9. المشاكل الشائعة وحلولها

### 9.1 الموقع لا يعمل

**التحقق:**
1. تأكد من وجود `index.html` في الجذر
2. تأكد من صحة Environment Variables
3. تحقق من Console في المتصفح (F12)

### 9.2 API لا يعمل

**التحقق:**
1. تأكد من `API_URL` في Environment Variables
2. تأكد من CORS في Backend
3. تحقق من Network Tab في المتصفح

### 9.3 المفاتيح لا تعمل

**التحقق:**
1. تأكد من إضافة المفاتيح في Environment Variables
2. تأكد من إعادة النشر بعد إضافة المفاتيح
3. تحقق من `config.js` يقرأ من Environment Variables

---

## ✅ 10. قائمة التحقق النهائية

- [ ] Project تم إنشاؤه على Base44
- [ ] الملفات تم رفعها
- [ ] Environment Variables تم إضافتها
- [ ] Custom Domain تم إعداده
- [ ] DNS تم إعداده
- [ ] الموقع يعمل
- [ ] API يعمل
- [ ] المفاتيح تعمل

---

## 📞 11. الدعم

**إذا واجهت أي مشكلة:**
1. راجع هذا الملف أولاً
2. تحقق من Console في المتصفح
3. تحقق من Base44 Dashboard → Logs
4. راجع `config.js` للتأكد من قراءة Environment Variables

---

## 🎯 12. ملاحظات مهمة

1. **✅ لا تضع مفاتيح حساسة في Base44**
2. **✅ جميع المفاتيح الحساسة في Backend فقط**
3. **✅ Client Portal يستخدم فقط Publishable Keys**
4. **✅ جميع الطلبات تذهب للباك اند**

---

**تاريخ الإنشاء:** 2026-01-05  
**آخر تحديث:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

