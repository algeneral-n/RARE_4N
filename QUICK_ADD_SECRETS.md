# 🚀 إضافة GitHub Secrets بسرعة

## ✅ الخطوات السريعة

### 1. تسجيل الدخول إلى GitHub CLI

```powershell
gh auth login
```

اتبع التعليمات على الشاشة:
- اختر `GitHub.com`
- اختر `HTTPS`
- اختر `Login with a web browser`
- انسخ الكود وافتح الرابط في المتصفح
- أكمل تسجيل الدخول

### 2. إضافة جميع Secrets

بعد تسجيل الدخول، شغل:

```powershell
.\add-github-secrets-direct.ps1
```

---

## 📋 Secrets التي سيتم إضافتها

### ✅ Expo & EAS
- `EXPO_TOKEN`
- `EXPO_PROJECT_ID`

### ✅ Apple (لـ iOS)
- `ASC_API_KEY_ID`
- `ASC_API_KEY_ISSUER_ID`
- `ASC_API_KEY_P8`
- `APPLE_TEAM_ID`
- `APPLE_APP_ID`
- `APPLE_SERVICE_ID`

### ✅ Cloudflare (لـ Web)
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PAGES_PROJECT_NAME`
- `CLOUDFLARE_ZONE_ID`

### ✅ API
- `API_URL`

---

## 🔍 التحقق من الإضافة

```powershell
gh secret list
```

---

## ⚠️ ملاحظات

1. **Google Play Secrets** غير مضمنة (تحتاج قيماً إضافية)
2. **API_TOKEN** غير مضمن (اختياري)
3. بعض Secrets قد تحتاج تحديث القيم
4. **استبدل القيم في Script بالقيم الحقيقية من `.env`**

---

**التاريخ:** 2026-01-06
