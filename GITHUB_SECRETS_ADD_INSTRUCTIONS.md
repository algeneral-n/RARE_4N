# 🔐 إضافة GitHub Secrets - تعليمات سريعة

## ⚠️ ملاحظة مهمة
**GitHub Secrets لا يمكن إضافتها برمجياً لأسباب أمنية.**  
يجب إضافتها يدوياً عبر GitHub UI أو GitHub CLI.

---

## 🔗 رابط إضافة Secrets

```
https://github.com/[username]/[repo]/settings/secrets/actions
```

استبدل `[username]` و `[repo]` باسم المستخدم والريبو الفعلي.

---

## 📋 قائمة Secrets المطلوبة للـ Workflows

### ✅ Expo & EAS (مطلوب)
```
EXPO_TOKEN=s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn
```

### ✅ Apple - App Store Connect (لـ iOS)
```
ASC_API_KEY_ID=your_asc_api_key_id
ASC_API_KEY_ISSUER_ID=your_asc_issuer_id
ASC_API_KEY_P8=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
APPLE_TEAM_ID=BN4DXG557F
APPLE_SERVICE_ID=your_apple_service_id
```

### ✅ Google Play (لـ Android)
```
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...","private_key":"..."}
GOOGLE_SERVICE_ACCOUNT_KEY=your_google_service_account_key
```

### ✅ Cloudflare (لـ Web Deployment)
```
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_PAGES_PROJECT_NAME=rare4n-client-portal
```

### ✅ API & Backend (للإشعارات)
```
API_URL=https://api.zien-ai.app
API_TOKEN=your_backend_api_token
```

---

## 🛠️ طريقة الإضافة

### الطريقة 1: GitHub UI (الأسهل)

1. اذهب إلى: `https://github.com/[username]/[repo]/settings/secrets/actions`
2. اضغط على **"New repository secret"**
3. أدخل:
   - **Name:** اسم الـ Secret (مثلاً `EXPO_TOKEN`)
   - **Secret:** القيمة (مثلاً `s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn`)
4. اضغط **"Add secret"**
5. كرر العملية لكل Secret

### الطريقة 2: GitHub CLI

```bash
# تثبيت GitHub CLI (إذا لم يكن مثبتاً)
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: apt install gh

# تسجيل الدخول
gh auth login

# إضافة Secrets
gh secret set EXPO_TOKEN --body "s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn"
gh secret set ASC_API_KEY_ID --body "your_key"
gh secret set ASC_API_KEY_ISSUER_ID --body "your_issuer_id"
# ... إلخ
```

---

## ✅ التحقق من الإضافة

### عبر GitHub UI:
1. اذهب إلى: `https://github.com/[username]/[repo]/settings/secrets/actions`
2. يجب أن ترى قائمة بجميع الـ Secrets المضافة

### عبر GitHub CLI:
```bash
gh secret list
```

---

## 📝 ملاحظات

1. **Secrets محمية:** لا يمكن رؤية قيمها بعد الإضافة
2. **يمكن التعديل:** يمكن تحديث قيمة Secret من نفس الصفحة
3. **يمكن الحذف:** يمكن حذف Secret إذا لم يعد مطلوباً
4. **Environment-specific:** يمكن إضافة Secrets لـ environments محددة (production, staging)

---

## 🎯 Secrets المطلوبة لكل Workflow

### build-ios.yml
- ✅ EXPO_TOKEN
- ✅ ASC_API_KEY_ID
- ✅ ASC_API_KEY_ISSUER_ID
- ✅ ASC_API_KEY_P8
- ✅ APPLE_TEAM_ID
- ✅ APPLE_SERVICE_ID
- ✅ API_URL (اختياري)
- ✅ API_TOKEN (اختياري)

### build-android.yml
- ✅ EXPO_TOKEN
- ✅ GOOGLE_PLAY_SERVICE_ACCOUNT_JSON
- ✅ GOOGLE_SERVICE_ACCOUNT_KEY
- ✅ API_URL (اختياري)
- ✅ API_TOKEN (اختياري)

### deploy-web.yml
- ✅ CLOUDFLARE_API_TOKEN
- ✅ CLOUDFLARE_ACCOUNT_ID
- ✅ CLOUDFLARE_PAGES_PROJECT_NAME
- ✅ GITHUB_TOKEN (تلقائي)
- ✅ API_URL (اختياري)
- ✅ API_TOKEN (اختياري)

---

**التاريخ:** 2026-01-06  
**الحالة:** ✅ جاهز للإضافة

