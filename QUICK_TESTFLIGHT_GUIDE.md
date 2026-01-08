# دليل سريع للرفع على TestFlight
## RARE 4N Mobile App

---

## 🚀 طريقة سريعة (3 خطوات)

### 1. تأكد من GitHub Secrets

اذهب إلى: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`

تأكد من وجود:
- ✅ `EXPO_TOKEN`
- ✅ `ASC_API_KEY_ID`
- ✅ `ASC_API_KEY_ISSUER_ID`
- ✅ `ASC_API_KEY_P8`
- ✅ `APPLE_TEAM_ID`
- ✅ `APPLE_SERVICE_ID`

### 2. شغّل Workflow

**من Cursor:**
1. `Ctrl+Shift+P` → `GitHub Actions: Run Workflow`
2. اختر: `Build iOS & Submit to TestFlight`
3. Profile: `production`
4. Auto Submit: `true`

**من GitHub:**
1. اذهب إلى: `Actions` tab
2. اختر: `Build iOS & Submit to TestFlight`
3. اضغط: `Run workflow`
4. Profile: `production`
5. Auto Submit: `true`

### 3. راقب البناء

- GitHub Actions: `Actions` tab
- Expo Dashboard: `https://expo.dev/accounts/YOUR_ACCOUNT/builds`
- TestFlight: `https://appstoreconnect.apple.com/apps/6756657662/testflight/ios`

---

## 📝 تحديث Build Number

قبل كل build جديد، حدث `mobile/app.json`:

```json
{
  "expo": {
    "ios": {
      "buildNumber": "2"  // زود الرقم
    }
  }
}
```

---

## ✅ النتيجة المتوقعة

1. Build يبدأ في GitHub Actions (5 دقائق)
2. Build يكتمل في Expo (15-30 دقيقة)
3. Build يرفع على TestFlight (5-10 دقائق)
4. Build جاهز للاختبار (24-48 ساعة للمراجعة الأولى)

---

**جاهز! 🎉**

