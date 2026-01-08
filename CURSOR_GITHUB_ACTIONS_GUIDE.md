# دليل استخدام GitHub Actions Extension في Cursor
## للرفع على TestFlight

---

## 🚀 طريقة سريعة (من Cursor)

### الخطوة 1: فتح Command Palette
- اضغط: `Ctrl+Shift+P` (Windows) أو `Cmd+Shift+P` (Mac)
- اكتب: `GitHub Actions`

### الخطوة 2: تشغيل Workflow
- اختر: `GitHub Actions: Run Workflow`
- اختر Repository: `YOUR_REPO`
- اختر Workflow: `Build iOS & Submit to TestFlight`
- اختر Branch: `main` أو `master`
- Profile: `production`
- Auto Submit: `true`

### الخطوة 3: مراقبة البناء
- افتح: `GitHub Actions` panel في Cursor
- أو اذهب إلى: `Actions` tab في GitHub

---

## 📋 المتطلبات

### 1. GitHub Secrets (مطلوب)

اذهب إلى: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`

أضف:
```
EXPO_TOKEN
ASC_API_KEY_ID
ASC_API_KEY_ISSUER_ID
ASC_API_KEY_P8
APPLE_TEAM_ID
APPLE_SERVICE_ID
```

### 2. تحديث Build Number

في `mobile/app.json`:
```json
{
  "expo": {
    "ios": {
      "buildNumber": "2"  // زود الرقم قبل كل build
    }
  }
}
```

---

## ✅ التحقق

1. ✅ Workflow يبدأ في GitHub Actions
2. ✅ Build يظهر في Expo Dashboard
3. ✅ Build يرفع على TestFlight
4. ✅ Build جاهز للاختبار (24-48 ساعة)

---

**جاهز! 🎉**

