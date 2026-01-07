# 🔧 إعداد GitHub Actions Workflows - RARE 4N

## ✅ الملفات التي تم إنشاؤها

### 1. Workflows الرئيسية (للريبو الرئيسي)
- ✅ `.github/workflows/build-ios.yml` - بناء iOS
- ✅ `.github/workflows/build-android.yml` - بناء Android
- ✅ `.github/workflows/deploy-web.yml` - نشر Web (Client Portal)

### 2. Templates (للاستخدام المستقبلي مع العملاء)
- ✅ `.github/workflows/templates/build-ios-template.yml`
- ✅ `.github/workflows/templates/build-android-template.yml`
- ✅ `.github/workflows/templates/deploy-web-template.yml`

## 📋 GitHub Secrets المطلوبة

### ✅ يجب إضافة هذه الـ Secrets في GitHub:

#### Expo & EAS
```
EXPO_TOKEN=s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn
```

#### Apple (App Store Connect)
```
ASC_API_KEY_ID=your_asc_api_key_id
ASC_API_KEY_ISSUER_ID=your_asc_issuer_id
ASC_API_KEY_P8=your_asc_api_key_p8_content
APPLE_TEAM_ID=your_apple_team_id
APPLE_SERVICE_ID=your_apple_service_id
```

#### Google Play
```
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
GOOGLE_SERVICE_ACCOUNT_KEY=your_google_service_account_key
```

#### Cloudflare
```
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_PAGES_PROJECT_NAME=rare4n-client-portal
```

#### API & Backend
```
API_URL=https://api.zien-ai.app
API_TOKEN=your_backend_api_token
```

## 🔗 كيفية إضافة GitHub Secrets

### الطريقة 1: عبر GitHub UI
1. اذهب إلى: `https://github.com/[username]/[repo]/settings/secrets/actions`
2. اضغط على "New repository secret"
3. أدخل الاسم والقيمة
4. اضغط "Add secret"

### الطريقة 2: عبر GitHub CLI
```bash
gh secret set EXPO_TOKEN --body "s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn"
gh secret set ASC_API_KEY_ID --body "your_key"
# ... إلخ
```

## 🎯 استخدام Templates للعملاء المستقبلية

### الخطوات:
1. انسخ template من `.github/workflows/templates/`
2. استبدل `{{CLIENT_NAME}}` و `{{PROJECT_ID}}` و `{{PROJECT_NAME}}`
3. ضع الملف في `.github/workflows/` في repo العميل
4. أضف الـ secrets المطلوبة في repo العميل

### مثال:
```bash
# في repo العميل
cp .github/workflows/templates/build-ios-template.yml \
   .github/workflows/build-ios.yml

# استبدل القيم
sed -i 's/{{CLIENT_NAME}}/ClientName/g' .github/workflows/build-ios.yml
sed -i 's/{{PROJECT_ID}}/project_123/g' .github/workflows/build-ios.yml
```

## 📝 ملاحظات

1. **Templates** موجودة في `.github/workflows/templates/` ولا يتم تشغيلها تلقائياً
2. **Workflows الرئيسية** في `.github/workflows/` تعمل على الريبو الرئيسي
3. **GitHub Secrets** يجب إضافتها يدوياً (لا يمكن إضافتها برمجياً لأسباب أمنية)

## ✅ التحقق من الإعداد

```bash
# تحقق من وجود الملفات
ls -la .github/workflows/
ls -la .github/workflows/templates/

# تحقق من GitHub Secrets (يتطلب gh CLI)
gh secret list
```

## 🔄 التحديثات المستقبلية

عند إنشاء repo جديد لعملاء:
1. استخدم templates من `.github/workflows/templates/`
2. استبدل القيم المطلوبة
3. أضف الـ secrets في repo العميل
4. Workflows ستعمل تلقائياً عند push

---

**التاريخ:** 2026-01-06  
**الحالة:** ✅ تم إنشاء جميع الملفات المطلوبة

