# GitHub Secrets - إضافة يدوية
# يجب إضافة هذه المفاتيح يدوياً في GitHub

## الروابط:
https://github.com/[username]/[repo]/settings/secrets/actions

## المفاتيح:

EXPO_TOKEN=YOUR_EXPO_TOKEN_HERE
EXPO_PROJECT_ID=YOUR_EXPO_PROJECT_ID_HERE
APPLE_TEAM_ID=YOUR_APPLE_TEAM_ID_HERE
APPLE_KEY_ID=YOUR_APPLE_KEY_ID_HERE
APPLE_PRIVATE_KEY=YOUR_APPLE_PRIVATE_KEY_HERE
APPLE_APP_ID=YOUR_APPLE_APP_ID_HERE
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY_HERE
BUILDER_ENGINE_KEY=YOUR_BUILDER_ENGINE_KEY_HERE
BUILDER_SIGNING_PASSWORD=YOUR_BUILDER_SIGNING_PASSWORD_HERE
WEBHOOK_URL=https://api.zien-ai.app

## كيفية الإضافة:
1. اذهب إلى الرابط أعلاه
2. اضغط "New repository secret"
3. انسخ كل اسم وقيمة من القائمة أعلاه
4. احفظ

## ملاحظات:
- APPLE_PRIVATE_KEY يجب نسخه كاملاً مع -----BEGIN PRIVATE KEY----- و -----END PRIVATE KEY-----
- استبدل `YOUR_*_HERE` بالقيم الحقيقية من `.env` أو `GITHUB_EXPO_SECRETS_COMPLETE.md`

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ Template آمن (بدون قيم حقيقية)
