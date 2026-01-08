# إعداد GitHub Actions للرفع على TestFlight
## RARE 4N Mobile App

**تاريخ:** 2026-01-08  
**الحالة:** ✅ **جاهز للاستخدام**

---

## 📋 الخطوات

### 1. إضافة GitHub Secrets

اذهب إلى: `Settings` → `Secrets and variables` → `Actions` في GitHub repository

#### Secrets المطلوبة:

```
EXPO_TOKEN
ASC_API_KEY_ID
ASC_API_KEY_ISSUER_ID
ASC_API_KEY_P8
APPLE_TEAM_ID
APPLE_SERVICE_ID
API_URL (اختياري - للإشعارات)
API_TOKEN (اختياري - للإشعارات)
```

#### كيفية الحصول على Apple App Store Connect API Key:

1. اذهب إلى [App Store Connect](https://appstoreconnect.apple.com)
2. `Users and Access` → `Keys` → `App Store Connect API`
3. أنشئ Key جديد
4. احفظ:
   - `Key ID` → `ASC_API_KEY_ID`
   - `Issuer ID` → `ASC_API_KEY_ISSUER_ID`
   - `Download .p8 file` → `ASC_API_KEY_P8` (انسخ محتوى الملف)

#### كيفية الحصول على Expo Token:

1. اذهب إلى [Expo Dashboard](https://expo.dev)
2. `Account Settings` → `Access Tokens`
3. أنشئ Token جديد
4. انسخه → `EXPO_TOKEN`

---

### 2. استخدام GitHub Actions Extension في Cursor

#### الطريقة 1: من Cursor مباشرة

1. افتح Command Palette: `Ctrl+Shift+P` (Windows) أو `Cmd+Shift+P` (Mac)
2. ابحث عن: `GitHub Actions: Run Workflow`
3. اختر: `Build iOS & Submit to TestFlight`
4. اختر Profile: `production` أو `preview`
5. اختر Auto Submit: `true` (للرفع التلقائي على TestFlight)

#### الطريقة 2: من GitHub مباشرة

1. اذهب إلى: `Actions` tab في GitHub repository
2. اختر: `Build iOS & Submit to TestFlight`
3. اضغط: `Run workflow`
4. اختر Branch: `main` أو `master`
5. اختر Profile: `production`
6. اختر Auto Submit: `true`
7. اضغط: `Run workflow`

---

### 3. مراقبة البناء

#### في GitHub Actions:
- اذهب إلى: `Actions` tab
- اضغط على Workflow run
- راقب الخطوات

#### في Expo Dashboard:
- اذهب إلى: [Expo Dashboard](https://expo.dev)
- `Builds` → `iOS`
- راقب حالة البناء

#### في App Store Connect:
- اذهب إلى: [App Store Connect](https://appstoreconnect.apple.com)
- `TestFlight` → `iOS Builds`
- راقب حالة الرفع

---

## 🔧 إعدادات إضافية

### تحديث `eas.json` للـ TestFlight:

```json
{
  "build": {
    "production": {
      "ios": {
        "simulator": false,
        "distribution": "store",
        "buildConfiguration": "Release"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "nader200812@gmail.com",
        "ascAppId": "6756657662",
        "appleTeamId": "BN4DXG557F"
      }
    }
  }
}
```

### تحديث `app.json`:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.rare4n.app",
      "buildNumber": "1"
    }
  }
}
```

---

## 📝 ملاحظات مهمة

1. **Build Number**: يجب زيادته في كل build جديد
   - في `app.json`: `"buildNumber": "2"`, `"buildNumber": "3"`, إلخ

2. **Version**: يجب تحديثها عند إصدار جديد
   - في `app.json`: `"version": "1.0.1"`, `"version": "1.0.2"`, إلخ

3. **TestFlight Review**: قد يستغرق 24-48 ساعة للمراجعة الأولى

4. **Build Time**: قد يستغرق 15-30 دقيقة للبناء

---

## 🚀 استخدام سريع

### من Terminal (بدون GitHub Actions):

```bash
cd mobile
eas build --platform ios --profile production --non-interactive
eas submit --platform ios --profile production --latest
```

### من GitHub Actions:

1. اذهب إلى `Actions` tab
2. اختر `Build iOS & Submit to TestFlight`
3. اضغط `Run workflow`
4. اختر `production` و `auto_submit: true`
5. اضغط `Run workflow`

---

## ✅ التحقق من النجاح

1. ✅ Build completed في GitHub Actions
2. ✅ Build appears في Expo Dashboard
3. ✅ Build appears في App Store Connect TestFlight
4. ✅ Build processing في TestFlight (قد يستغرق وقت)
5. ✅ Build ready for testing في TestFlight

---

**التاريخ:** 2026-01-08  
**الحالة:** ✅ **جاهز للاستخدام**

