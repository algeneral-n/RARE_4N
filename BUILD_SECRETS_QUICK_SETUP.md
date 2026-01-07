# 🔑 المفاتيح الأساسية للبناء - RARE 4N
## Quick Setup Guide للمفاتيح المهمة للبناء

---

## ✅ السيرفر
**الحالة:** ✅ يعمل على `http://localhost:5000`

---

## 🚀 GitHub Secrets (للبناء عبر CI/CD)

### الروابط:
- **GitHub Secrets:** `https://github.com/[username]/[repo]/settings/secrets/actions`
- **GitHub Variables:** `https://github.com/[username]/[repo]/settings/variables/actions`

### المفاتيح الأساسية المطلوبة للبناء:

#### 1. Expo (مطلوب)
```bash
EXPO_TOKEN=s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn
EXPO_PROJECT_ID=c2f7ad03-bef4-4e74-b426-4170a9d788b3
```

#### 2. Apple (لـ iOS Build)
```bash
APPLE_TEAM_ID=BN4DXG557F
APPLE_KEY_ID=6AR5VSRINSC3
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvo+3ieNujr8usWIx\n5173ukKtHO8svfese75jWplP+JihRANCAARY+gjvpXDrtXWTGtJhfGeXPSELfrH2\nn6aZcfLkaBWOCtH3ZzfWuBB2a5f9gKnqzVJ/h/bC0z3gSjzjhqHI6jp6\n-----END PRIVATE KEY-----"
APPLE_APP_ID=6756657662
```

#### 3. Google (لـ Android Build - اختياري)
```bash
GOOGLE_API_KEY=AIzaSyCuS7FajWuQLpNJtyTFrwWjDMdi6wp7wmg
GOOGLE_SERVICE_ACCOUNT_KEY="{\"type\":\"service_account\",...}"
```

#### 4. Builder Engine (مطلوب)
```bash
BUILDER_ENGINE_KEY=RARE4N-BUILDER-a4f3e4c7-58e5-4119-9e4d-e6cb11170743
BUILDER_SIGNING_PASSWORD=System.generate-nader.1993
```

#### 5. Webhook (للإشعارات)
```bash
WEBHOOK_URL=https://api.zien-ai.app
```

---

## 📱 Expo Secrets (EAS)

### الروابط:
- **Expo Secrets:** `https://expo.dev/accounts/[account]/projects/[project]/secrets`
- **Expo Dashboard:** `https://expo.dev/accounts/[account]/projects/[project]`

### المفاتيح الأساسية:

#### 1. Build Keys (مطلوب)
```bash
EXPO_TOKEN=s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn
EXPO_PROJECT_ID=c2f7ad03-bef4-4e74-b426-4170a9d788b3
```

#### 2. Apple (لـ iOS Build)
```bash
EXPO_APPLE_TEAM_ID=BN4DXG557F
EXPO_APPLE_KEY_ID=6AR5VSRINSC3
EXPO_APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvo+3ieNujr8usWIx\n5173ukKtHO8svfese75jWplP+JihRANCAARY+gjvpXDrtXWTGtJhfGeXPSELfrH2\nn6aZcfLkaBWOCtH3ZzfWuBB2a5f9gKnqzVJ/h/bC0z3gSjzjhqHI6jp6\n-----END PRIVATE KEY-----"
EXPO_APPLE_APP_ID=6756657662
```

#### 3. Google (لـ Android Build - اختياري)
```bash
EXPO_GOOGLE_SERVICE_ACCOUNT_KEY="{\"type\":\"service_account\",...}"
EXPO_GOOGLE_API_KEY=AIzaSyCuS7FajWuQLpNJtyTFrwWjDMdi6wp7wmg
```

#### 4. Publishable Keys (للموبايل)
```bash
EXPO_PUBLIC_API_URL=https://api.zien-ai.app
EXPO_PUBLIC_SUPABASE_URL=https://fgvrilruqzajstprioqj.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg
EXPO_PUBLIC_ELEVENLABS_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka
```

---

## 📋 Checklist سريع

### GitHub Secrets (الحد الأدنى):
- [ ] `EXPO_TOKEN`
- [ ] `EXPO_PROJECT_ID`
- [ ] `APPLE_TEAM_ID`
- [ ] `APPLE_KEY_ID`
- [ ] `APPLE_PRIVATE_KEY`
- [ ] `APPLE_APP_ID`
- [ ] `BUILDER_ENGINE_KEY`
- [ ] `BUILDER_SIGNING_PASSWORD`
- [ ] `WEBHOOK_URL`

### Expo Secrets (الحد الأدنى):
- [ ] `EXPO_TOKEN`
- [ ] `EXPO_PROJECT_ID`
- [ ] `EXPO_APPLE_TEAM_ID`
- [ ] `EXPO_APPLE_KEY_ID`
- [ ] `EXPO_APPLE_PRIVATE_KEY`
- [ ] `EXPO_APPLE_APP_ID`
- [ ] `EXPO_PUBLIC_API_URL`
- [ ] `EXPO_PUBLIC_SUPABASE_URL`
- [ ] `EXPO_PUBLIC_SUPABASE_KEY`
- [ ] `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `EXPO_PUBLIC_ELEVENLABS_AGENT_ID`

---

## 🔧 كيفية الإضافة

### GitHub Secrets:
1. اذهب إلى: `https://github.com/[username]/[repo]/settings/secrets/actions`
2. اضغط **New repository secret**
3. أدخل الاسم والقيمة
4. اضغط **Add secret**

### Expo Secrets:
#### عبر CLI:
```bash
eas secret:create --scope project --name SECRET_NAME --value SECRET_VALUE
```

#### عبر Dashboard:
1. اذهب إلى: `https://expo.dev/accounts/[account]/projects/[project]/secrets`
2. اضغط **Add Secret**
3. أدخل الاسم والقيمة
4. اضغط **Save**

---

## 📝 ملاحظات مهمة

1. **APPLE_PRIVATE_KEY**: يجب نسخ المفتاح كاملاً مع `-----BEGIN PRIVATE KEY-----` و `-----END PRIVATE KEY-----`
2. **EXPO_TOKEN**: نفس المفتاح في GitHub و Expo
3. **Publishable Keys**: آمنة للاستخدام في الموبايل (لا تحتوي على معلومات حساسة)
4. **Google Service Account**: JSON كامل كـ string

---

## 📚 الملفات المرجعية

- **قائمة كاملة:** `GITHUB_EXPO_SECRETS_COMPLETE.md`
- **توزيع المفاتيح:** `KEYS_DISTRIBUTION_GUIDE.md`
- **إعداد مفصل:** `KEYS_SETUP_GUIDE.md`

---

**تاريخ الإنشاء:** 2026-01-06  
**آخر تحديث:** 2026-01-06  
**الحالة:** ✅ جاهز للبناء

