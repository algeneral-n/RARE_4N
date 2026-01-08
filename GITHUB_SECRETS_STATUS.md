# 🔐 حالة GitHub Secrets - RARE 4N

## ⚠️ الحالة الحالية

**❌ لم يتم إضافة GitHub Secrets بعد**

---

## 📋 ما تم إنجازه

✅ **تم إنشاء:**
- ملفات Workflows (`.github/workflows/*.yml`)
- ملفات Templates (`.github/workflows/templates/*.yml`)
- ملفات التوثيق
- Script لإضافة Secrets (`add-github-secrets.ps1`)

❌ **لم يتم:**
- إضافة Secrets فعلياً في GitHub
- تثبيت GitHub CLI
- تسجيل الدخول إلى GitHub CLI

---

## 🛠️ طرق إضافة Secrets

### الطريقة 1: GitHub UI (الأسهل والأسرع) ⭐

1. **اذهب إلى:**
   ```
   https://github.com/[username]/[repo]/settings/secrets/actions
   ```
   استبدل `[username]` و `[repo]` بالقيم الفعلية

2. **اضغط "New repository secret"**

3. **أضف كل Secret:**
   - **Name:** اسم الـ Secret
   - **Secret:** القيمة من `GITHUB_EXPO_SECRETS_COMPLETE.md` (استبدل `YOUR_*_HERE`)

4. **كرر لكل Secret**

---

### الطريقة 2: GitHub CLI (أسرع للعديد من Secrets)

#### 1. تثبيت GitHub CLI:
```powershell
# Windows
winget install --id GitHub.cli
# أو
choco install gh
```

#### 2. تسجيل الدخول:
```bash
gh auth login
```

#### 3. إضافة Secrets:
```bash
# Expo
gh secret set EXPO_TOKEN --body "YOUR_EXPO_TOKEN_HERE"

# Apple
gh secret set ASC_API_KEY_ID --body "YOUR_ASC_API_KEY_ID_HERE"
gh secret set ASC_API_KEY_ISSUER_ID --body "YOUR_ASC_API_KEY_ISSUER_ID_HERE"
gh secret set ASC_API_KEY_P8 --body "YOUR_APPLE_PRIVATE_KEY_HERE"
gh secret set APPLE_TEAM_ID --body "YOUR_APPLE_TEAM_ID_HERE"

# Cloudflare
gh secret set CLOUDFLARE_ACCOUNT_ID --body "YOUR_CLOUDFLARE_ACCOUNT_ID_HERE"
gh secret set CLOUDFLARE_PAGES_PROJECT_NAME --body "rare4n-client-portal"

# API
gh secret set API_URL --body "https://api.zien-ai.app"
```

---

### الطريقة 3: استخدام Script (تلقائي)

**ملاحظة:** يحتاج GitHub CLI مثبت ومسجل دخول

```powershell
# تشغيل Script
.\add-github-secrets.ps1
```

---

## 📋 قائمة Secrets المطلوبة

### ✅ للـ Workflows الموجودة:

#### build-ios.yml:
- ✅ `EXPO_TOKEN`
- ✅ `ASC_API_KEY_ID`
- ✅ `ASC_API_KEY_ISSUER_ID`
- ✅ `ASC_API_KEY_P8`
- ✅ `APPLE_TEAM_ID`
- ✅ `APPLE_SERVICE_ID`
- ⚠️ `API_URL` (اختياري)
- ⚠️ `API_TOKEN` (اختياري)

#### build-android.yml:
- ✅ `EXPO_TOKEN`
- ⚠️ `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` (يحتاج قيمة)
- ⚠️ `GOOGLE_SERVICE_ACCOUNT_KEY` (يحتاج قيمة)
- ⚠️ `API_URL` (اختياري)
- ⚠️ `API_TOKEN` (اختياري)

#### deploy-web.yml:
- ⚠️ `CLOUDFLARE_API_TOKEN` (يحتاج قيمة)
- ✅ `CLOUDFLARE_ACCOUNT_ID`
- ✅ `CLOUDFLARE_PAGES_PROJECT_NAME`
- ✅ `GITHUB_TOKEN` (تلقائي)

---

## 🔍 التحقق من الإضافة

### عبر GitHub UI:
1. اذهب إلى: `https://github.com/[username]/[repo]/settings/secrets/actions`
2. يجب أن ترى قائمة بجميع الـ Secrets المضافة

### عبر GitHub CLI:
```bash
gh secret list
```

---

## ⚠️ ملاحظات مهمة

1. **Secrets محمية:** لا يمكن رؤية قيمها بعد الإضافة
2. **يجب إضافة جميع Secrets المطلوبة** قبل تشغيل Workflows
3. **بعض Secrets تحتاج قيماً من `.env`** - استبدل `YOUR_*_HERE` بالقيم الحقيقية
4. **GitHub CLI غير مثبت حالياً** - يجب تثبيته أولاً

---

## 🎯 الخطوات التالية

1. ✅ **اختر طريقة الإضافة** (UI أو CLI)
2. ✅ **أضف جميع Secrets المطلوبة** (من `.env` أو `GITHUB_EXPO_SECRETS_COMPLETE.md`)
3. ✅ **تحقق من الإضافة** (`gh secret list` أو GitHub UI)
4. ✅ **اختبر Workflow** (workflow_dispatch)

---

**التاريخ:** 2026-01-06  
**الحالة:** ⚠️ يحتاج إضافة يدوية
