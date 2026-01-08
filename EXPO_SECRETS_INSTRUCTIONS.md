# Expo Secrets - إضافة يدوية
# يجب إضافة هذه المفاتيح يدوياً في Expo Dashboard

## الروابط:
https://expo.dev/accounts/[account]/projects/[project]/secrets

أو عبر CLI:
```bash
eas secret:create --scope project --name SECRET_NAME --value SECRET_VALUE
```

---

## المفاتيح المطلوبة:

### 1. EXPO_TOKEN

**القيمة:**
```
YOUR_EXPO_TOKEN_HERE
```

**طريقة الإضافة:**
1. اذهب إلى الرابط أعلاه
2. اضغط "Add Secret"
3. الاسم: `EXPO_TOKEN`
4. القيمة: من `.env` أو `GITHUB_EXPO_SECRETS_COMPLETE.md`
5. احفظ

---

### 2. EXPO_PROJECT_ID

**القيمة:**
```
YOUR_EXPO_PROJECT_ID_HERE
```

**طريقة الإضافة:**
1. اذهب إلى الرابط أعلاه
2. اضغط "Add Secret"
3. الاسم: `EXPO_PROJECT_ID`
4. القيمة: من `.env` أو `GITHUB_EXPO_SECRETS_COMPLETE.md`
5. احفظ

---

### 3. EXPO_APPLE_TEAM_ID

**القيمة:**
```
YOUR_EXPO_APPLE_TEAM_ID_HERE
```

**طريقة الإضافة:**
1. اذهب إلى الرابط أعلاه
2. اضغط "Add Secret"
3. الاسم: `EXPO_APPLE_TEAM_ID`
4. القيمة: من `.env` أو `GITHUB_EXPO_SECRETS_COMPLETE.md`
5. احفظ

---

### 4. EXPO_APPLE_KEY_ID

**القيمة:**
```
YOUR_EXPO_APPLE_KEY_ID_HERE
```

**طريقة الإضافة:**
1. اذهب إلى الرابط أعلاه
2. اضغط "Add Secret"
3. الاسم: `EXPO_APPLE_KEY_ID`
4. القيمة: من `.env` أو `GITHUB_EXPO_SECRETS_COMPLETE.md`
5. احفظ

---

### 5. EXPO_APPLE_PRIVATE_KEY

**القيمة:**
```
YOUR_EXPO_APPLE_PRIVATE_KEY_HERE
```

**طريقة الإضافة:**
1. اذهب إلى الرابط أعلاه
2. اضغط "Add Secret"
3. الاسم: `EXPO_APPLE_PRIVATE_KEY`
4. القيمة: من `.env` أو `GITHUB_EXPO_SECRETS_COMPLETE.md` (نسخ كامل مع BEGIN/END)
5. احفظ

---

### 6. EXPO_APPLE_APP_ID

**القيمة:**
```
YOUR_EXPO_APPLE_APP_ID_HERE
```

**طريقة الإضافة:**
1. اذهب إلى الرابط أعلاه
2. اضغط "Add Secret"
3. الاسم: `EXPO_APPLE_APP_ID`
4. القيمة: من `.env` أو `GITHUB_EXPO_SECRETS_COMPLETE.md`
5. احفظ

---

### 7. EXPO_GOOGLE_API_KEY

**القيمة:**
```
YOUR_EXPO_GOOGLE_API_KEY_HERE
```

**طريقة الإضافة:**
1. اذهب إلى الرابط أعلاه
2. اضغط "Add Secret"
3. الاسم: `EXPO_GOOGLE_API_KEY`
4. القيمة: من `.env` أو `GITHUB_EXPO_SECRETS_COMPLETE.md`
5. احفظ

---

### 8. EXPO_PUBLIC_API_URL

**القيمة:**
```
https://api.zien-ai.app
```

**طريقة الإضافة:**
1. اذهب إلى الرابط أعلاه
2. اضغط "Add Secret"
3. الاسم: `EXPO_PUBLIC_API_URL`
4. القيمة: `https://api.zien-ai.app`
5. احفظ

---

### 9. EXPO_PUBLIC_SUPABASE_URL

**القيمة:**
```
YOUR_EXPO_PUBLIC_SUPABASE_URL_HERE
```

**طريقة الإضافة:**
1. اذهب إلى الرابط أعلاه
2. اضغط "Add Secret"
3. الاسم: `EXPO_PUBLIC_SUPABASE_URL`
4. القيمة: من `.env` أو `GITHUB_EXPO_SECRETS_COMPLETE.md`
5. احفظ

---

### 10. EXPO_PUBLIC_SUPABASE_KEY

**القيمة:**
```
YOUR_EXPO_PUBLIC_SUPABASE_KEY_HERE
```

**طريقة الإضافة:**
1. اذهب إلى الرابط أعلاه
2. اضغط "Add Secret"
3. الاسم: `EXPO_PUBLIC_SUPABASE_KEY`
4. القيمة: من `.env` أو `GITHUB_EXPO_SECRETS_COMPLETE.md`
5. احفظ

---

### 11. EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY

**القيمة:**
```
YOUR_EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY_HERE
```

**طريقة الإضافة:**
1. اذهب إلى الرابط أعلاه
2. اضغط "Add Secret"
3. الاسم: `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. القيمة: من `.env` أو `GITHUB_EXPO_SECRETS_COMPLETE.md`
5. احفظ

---

### 12. EXPO_PUBLIC_ELEVENLABS_AGENT_ID

**القيمة:**
```
YOUR_EXPO_PUBLIC_ELEVENLABS_AGENT_ID_HERE
```

**طريقة الإضافة:**
1. اذهب إلى الرابط أعلاه
2. اضغط "Add Secret"
3. الاسم: `EXPO_PUBLIC_ELEVENLABS_AGENT_ID`
4. القيمة: من `.env` أو `GITHUB_EXPO_SECRETS_COMPLETE.md`
5. احفظ

---

## ملاحظات مهمة:

- **EXPO_APPLE_PRIVATE_KEY**: يجب نسخ المفتاح كاملاً مع `-----BEGIN PRIVATE KEY-----` و `-----END PRIVATE KEY-----`
- **EXPO_PUBLIC_***: هذه مفاتيح آمنة للاستخدام في الموبايل (publishable keys)
- **EXPO_TOKEN**: نفس المفتاح المستخدم في GitHub
- **استبدل `YOUR_*_HERE` بالقيم الحقيقية من `.env`**

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ Template آمن (بدون قيم حقيقية)
