# 🔐 إضافة GitHub Secrets الآن

## ✅ تم إعداد كل شيء!

### 📋 ما تم إنجازه:
1. ✅ تثبيت GitHub CLI
2. ✅ إنشاء Script لإضافة Secrets (`add-github-secrets-direct.ps1`)
3. ✅ تجهيز جميع القيم الحقيقية

### 🚀 الخطوات التالية:

#### 1. تسجيل الدخول (مرة واحدة فقط):

```powershell
gh auth login
```

**اتبع التعليمات:**
- اختر `GitHub.com`
- اختر `HTTPS`
- اختر `Login with a web browser`
- انسخ الكود (مثلاً: `0224-8D74`)
- افتح الرابط في المتصفح
- الصق الكود وأكمل تسجيل الدخول

#### 2. إضافة جميع Secrets:

```powershell
.\add-github-secrets-direct.ps1
```

---

## 📋 Secrets التي سيتم إضافتها:

### ✅ Expo & EAS
- `EXPO_TOKEN` = s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn
- `EXPO_PROJECT_ID` = c2f7ad03-bef4-4e74-b426-4170a9d788b3

### ✅ Apple (لـ iOS Build)
- `ASC_API_KEY_ID` = 6AR5VSRINSC3
- `ASC_API_KEY_ISSUER_ID` = BN4DXG557F
- `ASC_API_KEY_P8` = (Private Key كامل)
- `APPLE_TEAM_ID` = BN4DXG557F
- `APPLE_APP_ID` = 6756657662
- `APPLE_SERVICE_ID` = com.rare4n.app

### ✅ Cloudflare (لـ Web Deployment)
- `CLOUDFLARE_API_TOKEN` = b1a6484ff2a4d441092133debec6b99ff512c
- `CLOUDFLARE_ACCOUNT_ID` = ccc1ed9ab170eaf1e72e9a10e46ef320
- `CLOUDFLARE_PAGES_PROJECT_NAME` = rare4n-client-portal
- `CLOUDFLARE_ZONE_ID` = cb61498c69c654043b54b30550151b8f

### ✅ API
- `API_URL` = https://api.zien-ai.app

---

## 🔍 التحقق من الإضافة:

```powershell
gh secret list
```

---

## ⚠️ ملاحظات:

1. **Google Play Secrets** غير مضمنة (تحتاج إعداد إضافي)
2. **API_TOKEN** غير مضمن (اختياري)
3. بعد إضافة Secrets، Workflows ستعمل تلقائياً

---

**جاهز للتنفيذ!** 🚀

