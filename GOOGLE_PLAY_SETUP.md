# 📱 Google Play Service Account JSON - دليل الحصول

## 🔗 **الروابط المهمة:**

### **1. Google Play Console:**
```
https://play.google.com/console
```

### **2. Google Cloud Console (لإنشاء Service Account):**
```
https://console.cloud.google.com/
```

---

## 📋 **خطوات الحصول على Service Account JSON:**

### **الخطوة 1: إنشاء Service Account في Google Cloud Console**

1. **اذهب إلى Google Cloud Console:**
   ```
   https://console.cloud.google.com/
   ```

2. **اختر أو أنشئ Project:**
   - إذا لم يكن لديك Project، أنشئ واحد جديد
   - أو اختر Project موجود

3. **افتح Service Accounts:**
   - من القائمة الجانبية: **IAM & Admin** → **Service Accounts**
   - أو اذهب مباشرة:
   ```
   https://console.cloud.google.com/iam-admin/serviceaccounts
   ```

4. **أنشئ Service Account جديد:**
   - اضغط **Create Service Account**
   - **Service account name:** `rare4n-play-store`
   - **Service account ID:** `rare4n-play-store` (يتم إنشاؤه تلقائياً)
   - **Description:** `Service account for RARE 4N Play Store uploads`
   - اضغط **Create and Continue**

5. **إضافة Roles (اختياري):**
   - يمكنك تخطي هذه الخطوة الآن
   - اضغط **Continue**

6. **Grant access (اختياري):**
   - يمكنك تخطي هذه الخطوة
   - اضغط **Done**

---

### **الخطوة 2: إنشاء JSON Key**

1. **في صفحة Service Accounts:**
   - ابحث عن Service Account الذي أنشأته
   - اضغط على **Email** الخاص به

2. **افتح Keys tab:**
   - اضغط على **Keys** من القائمة العلوية
   - أو اذهب مباشرة:
   ```
   https://console.cloud.google.com/iam-admin/serviceaccounts?project=YOUR_PROJECT_ID
   ```
   - ثم اضغط على Service Account → **Keys** tab

3. **أنشئ Key جديد:**
   - اضغط **Add Key** → **Create new key**
   - اختر **JSON**
   - اضغط **Create**

4. **تحميل JSON:**
   - سيتم تحميل ملف JSON تلقائياً
   - احفظه في مكان آمن
   - **⚠️ مهم:** هذا الملف حساس جداً، لا ترفعه على GitHub!

---

### **الخطوة 3: ربط Service Account مع Google Play Console**

1. **اذهب إلى Google Play Console:**
   ```
   https://play.google.com/console
   ```

2. **افتح Settings:**
   - من القائمة الجانبية: **Settings** → **API access**
   - أو اذهب مباشرة:
   ```
   https://play.google.com/console/developers/api-access
   ```

3. **Link Service Account:**
   - في قسم **Service accounts**
   - اضغط **Link service account**
   - اختر Service Account الذي أنشأته
   - اضغط **Grant access**

4. **إضافة Permissions:**
   - **App information and pricing:** ✅
   - **Manage production releases:** ✅
   - **Manage testing track releases:** ✅
   - **View app information and download bulk reports:** ✅
   - اضغط **Invite user**

---

## 📄 **مثال على JSON File:**

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "rare4n-play-store@your-project-id.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/rare4n-play-store%40your-project-id.iam.gserviceaccount.com"
}
```

---

## 🔐 **أين تضع هذا الملف:**

### **❌ لا ترفعه على GitHub:**
- لا ترفع ملف JSON على GitHub
- أضفه في `.gitignore`

### **✅ ضعه في:**

1. **GitHub Secrets:**
   - اذهب إلى: `Settings` → `Secrets and variables` → `Actions`
   - أنشئ Secret جديد: `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`
   - **انسخ محتوى JSON كاملاً** (كـ string واحد)
   - أو استخدم Base64 encoding (اختياري)

2. **Backend .env (على السيرفر فقط):**
   ```bash
   GOOGLE_PLAY_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
   ```
   - أو احفظه كملف على السيرفر:
   ```bash
   GOOGLE_PLAY_SERVICE_ACCOUNT_JSON_PATH=/path/to/service-account.json
   ```

3. **EAS Credentials (Expo):**
   ```bash
   eas credentials
   # اختر Android
   # اختر Google Play Service Account
   # الصق محتوى JSON
   ```

---

## 🔗 **الروابط السريعة:**

### **Google Cloud Console:**
- **Service Accounts:** https://console.cloud.google.com/iam-admin/serviceaccounts
- **Create Service Account:** https://console.cloud.google.com/iam-admin/serviceaccounts/create

### **Google Play Console:**
- **API Access:** https://play.google.com/console/developers/api-access
- **Main Console:** https://play.google.com/console

### **Documentation:**
- **Official Guide:** https://developers.google.com/android-publisher/getting_started
- **Service Accounts:** https://cloud.google.com/iam/docs/service-accounts

---

## ⚠️ **ملاحظات مهمة:**

1. **الأمان:**
   - ⚠️ ملف JSON حساس جداً
   - ⚠️ لا ترفعه على GitHub
   - ⚠️ لا تشاركه مع أحد
   - ✅ ضعه في GitHub Secrets فقط

2. **Permissions:**
   - تأكد من إعطاء الصلاحيات الصحيحة في Play Console
   - قد تحتاج إلى **Owner** أو **Admin** في Google Play Console

3. **Project ID:**
   - تأكد من أن Project ID في JSON صحيح
   - تأكد من ربط Service Account مع Play Console

4. **Testing:**
   - اختبر الـ upload أولاً على **Internal Testing**
   - ثم **Closed Testing**
   - ثم **Production**

---

## 📝 **خطوات سريعة (Quick Steps):**

1. ✅ اذهب إلى: https://console.cloud.google.com/iam-admin/serviceaccounts
2. ✅ أنشئ Service Account جديد
3. ✅ أنشئ JSON Key
4. ✅ حمّل JSON file
5. ✅ اذهب إلى: https://play.google.com/console/developers/api-access
6. ✅ Link Service Account
7. ✅ أضف Permissions
8. ✅ ضع JSON في GitHub Secrets

---

## 🚀 **بعد الحصول على JSON:**

### **في GitHub Secrets:**
```
Name: GOOGLE_PLAY_SERVICE_ACCOUNT_JSON
Value: (انسخ محتوى JSON كاملاً)
```

### **في EAS (Expo):**
```bash
eas credentials
# Android → Google Play → Service Account
# الصق JSON
```

---

**تم الإنشاء:** 2025-01-XX  
**الحالة:** ✅ جاهز للاستخدام




