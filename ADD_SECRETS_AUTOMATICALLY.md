# إضافة Secrets تلقائياً - GitHub & Expo
## أوامر مباشرة لإضافة جميع المفاتيح

---

## 🚀 الطريقة 1: استخدام الأوامر مباشرة

### أ. إضافة Secrets في Expo (EAS CLI)

#### تثبيت EAS CLI (إذا لم يكن مثبت):
```bash
npm install -g eas-cli
```

#### تسجيل الدخول:
```bash
eas login
```

#### إضافة Secrets:

```bash
# Expo Token
eas secret:create --scope project --name EXPO_TOKEN --value "s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn"

# Apple
eas secret:create --scope project --name ASC_API_KEY_ID --value "6AR5VSRINSC3"
eas secret:create --scope project --name ASC_API_KEY_ISSUER_ID --value "BN4DXG557F"
eas secret:create --scope project --name ASC_API_KEY_P8 --value "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvo+3ieNujr8usWIx\n5173ukKtHO8svfese75jWplP+JihRANCAARY+gjvpXDrtXWTGtJhfGeXPSELfrH2\nn6aZcfLkaBWOCtH3ZzfWuBB2a5f9gKnqzVJ/h/bC0z3gSjzjhqHI6jp6\n-----END PRIVATE KEY-----"
eas secret:create --scope project --name APPLE_APP_ID --value "6756657662"

# Publishable Keys
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://api.zien-ai.app"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://fgvrilruqzajstprioqj.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_KEY --value "sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy"
eas secret:create --scope project --name EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY --value "pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg"
eas secret:create --scope project --name EXPO_PUBLIC_ELEVENLABS_AGENT_ID --value "agent_0701kc4axybpf6fvak70xwfzpyka"
```

---

### ب. إضافة Secrets في GitHub (GitHub CLI)

#### تثبيت GitHub CLI (إذا لم يكن مثبت):
```bash
# Windows (PowerShell)
winget install --id GitHub.cli

# أو
choco install gh
```

#### تسجيل الدخول:
```bash
gh auth login
```

#### إضافة Secrets:

```bash
# Expo
gh secret set EXPO_TOKEN --body "s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn"
gh secret set EAS_PROJECT_ID --body "c2f7ad03-bef4-4e74-b426-4170a9d788b3"

# Apple
gh secret set ASC_API_KEY_ID --body "6AR5VSRINSC3"
gh secret set ASC_API_KEY_ISSUER_ID --body "BN4DXG557F"
gh secret set ASC_API_KEY_P8 --body "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvo+3ieNujr8usWIx\n5173ukKtHO8svfese75jWplP+JihRANCAARY+gjvpXDrtXWTGtJhfGeXPSELfrH2\nn6aZcfLkaBWOCtH3ZzfWuBB2a5f9gKnqzVJ/h/bC0z3gSjzjhqHI6jp6\n-----END PRIVATE KEY-----"
gh secret set APPLE_APP_ID --body "6756657662"
gh secret set ASC_APP_ID --body "6756657662"

# Cloudflare
gh secret set CLOUDFLARE_ACCOUNT_ID --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_ZONE_ID --body "cb61498c69c654043b54b30550151b8f"
gh secret set CLOUDFLARE_API_KEY --body "b1a6484ff2a4d441092133debec6b99ff512c"
gh secret set CLOUDFLARE_R2_ACCESS_KEY_ID --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_R2_SECRET_ACCESS_KEY --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_R2_BUCKET_NAME --body "rare"

# Webhook
gh secret set WEBHOOK_URL --body "https://api.zien-ai.app"
```

---

## 🚀 الطريقة 2: استخدام Script تلقائي

### إنشاء Script لإضافة جميع Secrets:

```bash
# add-secrets.sh (Linux/Mac)
# أو add-secrets.ps1 (Windows PowerShell)
```

---

## 📋 الطريقة 3: يدوياً (الأسهل)

### Expo:
1. اذهب إلى: https://expo.dev/accounts/zien/projects/c2f7ad03-bef4-4e74-b426-4170a9d788b3/settings/secrets
2. اضغط **Add Secret**
3. انسخ من ملف `GITHUB_EXPO_SECRETS_COMPLETE.md`

### GitHub:
1. اذهب إلى: https://github.com/algeneral-n/abo-zien/settings/secrets/actions
2. اضغط **New repository secret**
3. انسخ من ملف `GITHUB_EXPO_SECRETS_COMPLETE.md`

---

## ✅ هل تريد أن أنفذ الأوامر الآن؟

يمكنني:
1. ✅ تثبيت EAS CLI و GitHub CLI
2. ✅ تسجيل الدخول
3. ✅ إضافة جميع Secrets تلقائياً

**أخبرني إذا كنت تريد أن أبدأ!**

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ جاهز للتنفيذ

## أوامر مباشرة لإضافة جميع المفاتيح

---

## 🚀 الطريقة 1: استخدام الأوامر مباشرة

### أ. إضافة Secrets في Expo (EAS CLI)

#### تثبيت EAS CLI (إذا لم يكن مثبت):
```bash
npm install -g eas-cli
```

#### تسجيل الدخول:
```bash
eas login
```

#### إضافة Secrets:

```bash
# Expo Token
eas secret:create --scope project --name EXPO_TOKEN --value "s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn"

# Apple
eas secret:create --scope project --name ASC_API_KEY_ID --value "6AR5VSRINSC3"
eas secret:create --scope project --name ASC_API_KEY_ISSUER_ID --value "BN4DXG557F"
eas secret:create --scope project --name ASC_API_KEY_P8 --value "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvo+3ieNujr8usWIx\n5173ukKtHO8svfese75jWplP+JihRANCAARY+gjvpXDrtXWTGtJhfGeXPSELfrH2\nn6aZcfLkaBWOCtH3ZzfWuBB2a5f9gKnqzVJ/h/bC0z3gSjzjhqHI6jp6\n-----END PRIVATE KEY-----"
eas secret:create --scope project --name APPLE_APP_ID --value "6756657662"

# Publishable Keys
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://api.zien-ai.app"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://fgvrilruqzajstprioqj.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_KEY --value "sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy"
eas secret:create --scope project --name EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY --value "pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg"
eas secret:create --scope project --name EXPO_PUBLIC_ELEVENLABS_AGENT_ID --value "agent_0701kc4axybpf6fvak70xwfzpyka"
```

---

### ب. إضافة Secrets في GitHub (GitHub CLI)

#### تثبيت GitHub CLI (إذا لم يكن مثبت):
```bash
# Windows (PowerShell)
winget install --id GitHub.cli

# أو
choco install gh
```

#### تسجيل الدخول:
```bash
gh auth login
```

#### إضافة Secrets:

```bash
# Expo
gh secret set EXPO_TOKEN --body "s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn"
gh secret set EAS_PROJECT_ID --body "c2f7ad03-bef4-4e74-b426-4170a9d788b3"

# Apple
gh secret set ASC_API_KEY_ID --body "6AR5VSRINSC3"
gh secret set ASC_API_KEY_ISSUER_ID --body "BN4DXG557F"
gh secret set ASC_API_KEY_P8 --body "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvo+3ieNujr8usWIx\n5173ukKtHO8svfese75jWplP+JihRANCAARY+gjvpXDrtXWTGtJhfGeXPSELfrH2\nn6aZcfLkaBWOCtH3ZzfWuBB2a5f9gKnqzVJ/h/bC0z3gSjzjhqHI6jp6\n-----END PRIVATE KEY-----"
gh secret set APPLE_APP_ID --body "6756657662"
gh secret set ASC_APP_ID --body "6756657662"

# Cloudflare
gh secret set CLOUDFLARE_ACCOUNT_ID --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_ZONE_ID --body "cb61498c69c654043b54b30550151b8f"
gh secret set CLOUDFLARE_API_KEY --body "b1a6484ff2a4d441092133debec6b99ff512c"
gh secret set CLOUDFLARE_R2_ACCESS_KEY_ID --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_R2_SECRET_ACCESS_KEY --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_R2_BUCKET_NAME --body "rare"

# Webhook
gh secret set WEBHOOK_URL --body "https://api.zien-ai.app"
```

---

## 🚀 الطريقة 2: استخدام Script تلقائي

### إنشاء Script لإضافة جميع Secrets:

```bash
# add-secrets.sh (Linux/Mac)
# أو add-secrets.ps1 (Windows PowerShell)
```

---

## 📋 الطريقة 3: يدوياً (الأسهل)

### Expo:
1. اذهب إلى: https://expo.dev/accounts/zien/projects/c2f7ad03-bef4-4e74-b426-4170a9d788b3/settings/secrets
2. اضغط **Add Secret**
3. انسخ من ملف `GITHUB_EXPO_SECRETS_COMPLETE.md`

### GitHub:
1. اذهب إلى: https://github.com/algeneral-n/abo-zien/settings/secrets/actions
2. اضغط **New repository secret**
3. انسخ من ملف `GITHUB_EXPO_SECRETS_COMPLETE.md`

---

## ✅ هل تريد أن أنفذ الأوامر الآن؟

يمكنني:
1. ✅ تثبيت EAS CLI و GitHub CLI
2. ✅ تسجيل الدخول
3. ✅ إضافة جميع Secrets تلقائياً

**أخبرني إذا كنت تريد أن أبدأ!**

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ جاهز للتنفيذ

## أوامر مباشرة لإضافة جميع المفاتيح

---

## 🚀 الطريقة 1: استخدام الأوامر مباشرة

### أ. إضافة Secrets في Expo (EAS CLI)

#### تثبيت EAS CLI (إذا لم يكن مثبت):
```bash
npm install -g eas-cli
```

#### تسجيل الدخول:
```bash
eas login
```

#### إضافة Secrets:

```bash
# Expo Token
eas secret:create --scope project --name EXPO_TOKEN --value "s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn"

# Apple
eas secret:create --scope project --name ASC_API_KEY_ID --value "6AR5VSRINSC3"
eas secret:create --scope project --name ASC_API_KEY_ISSUER_ID --value "BN4DXG557F"
eas secret:create --scope project --name ASC_API_KEY_P8 --value "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvo+3ieNujr8usWIx\n5173ukKtHO8svfese75jWplP+JihRANCAARY+gjvpXDrtXWTGtJhfGeXPSELfrH2\nn6aZcfLkaBWOCtH3ZzfWuBB2a5f9gKnqzVJ/h/bC0z3gSjzjhqHI6jp6\n-----END PRIVATE KEY-----"
eas secret:create --scope project --name APPLE_APP_ID --value "6756657662"

# Publishable Keys
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://api.zien-ai.app"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://fgvrilruqzajstprioqj.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_KEY --value "sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy"
eas secret:create --scope project --name EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY --value "pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg"
eas secret:create --scope project --name EXPO_PUBLIC_ELEVENLABS_AGENT_ID --value "agent_0701kc4axybpf6fvak70xwfzpyka"
```

---

### ب. إضافة Secrets في GitHub (GitHub CLI)

#### تثبيت GitHub CLI (إذا لم يكن مثبت):
```bash
# Windows (PowerShell)
winget install --id GitHub.cli

# أو
choco install gh
```

#### تسجيل الدخول:
```bash
gh auth login
```

#### إضافة Secrets:

```bash
# Expo
gh secret set EXPO_TOKEN --body "s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn"
gh secret set EAS_PROJECT_ID --body "c2f7ad03-bef4-4e74-b426-4170a9d788b3"

# Apple
gh secret set ASC_API_KEY_ID --body "6AR5VSRINSC3"
gh secret set ASC_API_KEY_ISSUER_ID --body "BN4DXG557F"
gh secret set ASC_API_KEY_P8 --body "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvo+3ieNujr8usWIx\n5173ukKtHO8svfese75jWplP+JihRANCAARY+gjvpXDrtXWTGtJhfGeXPSELfrH2\nn6aZcfLkaBWOCtH3ZzfWuBB2a5f9gKnqzVJ/h/bC0z3gSjzjhqHI6jp6\n-----END PRIVATE KEY-----"
gh secret set APPLE_APP_ID --body "6756657662"
gh secret set ASC_APP_ID --body "6756657662"

# Cloudflare
gh secret set CLOUDFLARE_ACCOUNT_ID --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_ZONE_ID --body "cb61498c69c654043b54b30550151b8f"
gh secret set CLOUDFLARE_API_KEY --body "b1a6484ff2a4d441092133debec6b99ff512c"
gh secret set CLOUDFLARE_R2_ACCESS_KEY_ID --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_R2_SECRET_ACCESS_KEY --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_R2_BUCKET_NAME --body "rare"

# Webhook
gh secret set WEBHOOK_URL --body "https://api.zien-ai.app"
```

---

## 🚀 الطريقة 2: استخدام Script تلقائي

### إنشاء Script لإضافة جميع Secrets:

```bash
# add-secrets.sh (Linux/Mac)
# أو add-secrets.ps1 (Windows PowerShell)
```

---

## 📋 الطريقة 3: يدوياً (الأسهل)

### Expo:
1. اذهب إلى: https://expo.dev/accounts/zien/projects/c2f7ad03-bef4-4e74-b426-4170a9d788b3/settings/secrets
2. اضغط **Add Secret**
3. انسخ من ملف `GITHUB_EXPO_SECRETS_COMPLETE.md`

### GitHub:
1. اذهب إلى: https://github.com/algeneral-n/abo-zien/settings/secrets/actions
2. اضغط **New repository secret**
3. انسخ من ملف `GITHUB_EXPO_SECRETS_COMPLETE.md`

---

## ✅ هل تريد أن أنفذ الأوامر الآن؟

يمكنني:
1. ✅ تثبيت EAS CLI و GitHub CLI
2. ✅ تسجيل الدخول
3. ✅ إضافة جميع Secrets تلقائياً

**أخبرني إذا كنت تريد أن أبدأ!**

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ جاهز للتنفيذ

## أوامر مباشرة لإضافة جميع المفاتيح

---

## 🚀 الطريقة 1: استخدام الأوامر مباشرة

### أ. إضافة Secrets في Expo (EAS CLI)

#### تثبيت EAS CLI (إذا لم يكن مثبت):
```bash
npm install -g eas-cli
```

#### تسجيل الدخول:
```bash
eas login
```

#### إضافة Secrets:

```bash
# Expo Token
eas secret:create --scope project --name EXPO_TOKEN --value "s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn"

# Apple
eas secret:create --scope project --name ASC_API_KEY_ID --value "6AR5VSRINSC3"
eas secret:create --scope project --name ASC_API_KEY_ISSUER_ID --value "BN4DXG557F"
eas secret:create --scope project --name ASC_API_KEY_P8 --value "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvo+3ieNujr8usWIx\n5173ukKtHO8svfese75jWplP+JihRANCAARY+gjvpXDrtXWTGtJhfGeXPSELfrH2\nn6aZcfLkaBWOCtH3ZzfWuBB2a5f9gKnqzVJ/h/bC0z3gSjzjhqHI6jp6\n-----END PRIVATE KEY-----"
eas secret:create --scope project --name APPLE_APP_ID --value "6756657662"

# Publishable Keys
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://api.zien-ai.app"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://fgvrilruqzajstprioqj.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_KEY --value "sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy"
eas secret:create --scope project --name EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY --value "pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg"
eas secret:create --scope project --name EXPO_PUBLIC_ELEVENLABS_AGENT_ID --value "agent_0701kc4axybpf6fvak70xwfzpyka"
```

---

### ب. إضافة Secrets في GitHub (GitHub CLI)

#### تثبيت GitHub CLI (إذا لم يكن مثبت):
```bash
# Windows (PowerShell)
winget install --id GitHub.cli

# أو
choco install gh
```

#### تسجيل الدخول:
```bash
gh auth login
```

#### إضافة Secrets:

```bash
# Expo
gh secret set EXPO_TOKEN --body "s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn"
gh secret set EAS_PROJECT_ID --body "c2f7ad03-bef4-4e74-b426-4170a9d788b3"

# Apple
gh secret set ASC_API_KEY_ID --body "6AR5VSRINSC3"
gh secret set ASC_API_KEY_ISSUER_ID --body "BN4DXG557F"
gh secret set ASC_API_KEY_P8 --body "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvo+3ieNujr8usWIx\n5173ukKtHO8svfese75jWplP+JihRANCAARY+gjvpXDrtXWTGtJhfGeXPSELfrH2\nn6aZcfLkaBWOCtH3ZzfWuBB2a5f9gKnqzVJ/h/bC0z3gSjzjhqHI6jp6\n-----END PRIVATE KEY-----"
gh secret set APPLE_APP_ID --body "6756657662"
gh secret set ASC_APP_ID --body "6756657662"

# Cloudflare
gh secret set CLOUDFLARE_ACCOUNT_ID --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_ZONE_ID --body "cb61498c69c654043b54b30550151b8f"
gh secret set CLOUDFLARE_API_KEY --body "b1a6484ff2a4d441092133debec6b99ff512c"
gh secret set CLOUDFLARE_R2_ACCESS_KEY_ID --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_R2_SECRET_ACCESS_KEY --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_R2_BUCKET_NAME --body "rare"

# Webhook
gh secret set WEBHOOK_URL --body "https://api.zien-ai.app"
```

---

## 🚀 الطريقة 2: استخدام Script تلقائي

### إنشاء Script لإضافة جميع Secrets:

```bash
# add-secrets.sh (Linux/Mac)
# أو add-secrets.ps1 (Windows PowerShell)
```

---

## 📋 الطريقة 3: يدوياً (الأسهل)

### Expo:
1. اذهب إلى: https://expo.dev/accounts/zien/projects/c2f7ad03-bef4-4e74-b426-4170a9d788b3/settings/secrets
2. اضغط **Add Secret**
3. انسخ من ملف `GITHUB_EXPO_SECRETS_COMPLETE.md`

### GitHub:
1. اذهب إلى: https://github.com/algeneral-n/abo-zien/settings/secrets/actions
2. اضغط **New repository secret**
3. انسخ من ملف `GITHUB_EXPO_SECRETS_COMPLETE.md`

---

## ✅ هل تريد أن أنفذ الأوامر الآن؟

يمكنني:
1. ✅ تثبيت EAS CLI و GitHub CLI
2. ✅ تسجيل الدخول
3. ✅ إضافة جميع Secrets تلقائياً

**أخبرني إذا كنت تريد أن أبدأ!**

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ جاهز للتنفيذ

## أوامر مباشرة لإضافة جميع المفاتيح

---

## 🚀 الطريقة 1: استخدام الأوامر مباشرة

### أ. إضافة Secrets في Expo (EAS CLI)

#### تثبيت EAS CLI (إذا لم يكن مثبت):
```bash
npm install -g eas-cli
```

#### تسجيل الدخول:
```bash
eas login
```

#### إضافة Secrets:

```bash
# Expo Token
eas secret:create --scope project --name EXPO_TOKEN --value "s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn"

# Apple
eas secret:create --scope project --name ASC_API_KEY_ID --value "6AR5VSRINSC3"
eas secret:create --scope project --name ASC_API_KEY_ISSUER_ID --value "BN4DXG557F"
eas secret:create --scope project --name ASC_API_KEY_P8 --value "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvo+3ieNujr8usWIx\n5173ukKtHO8svfese75jWplP+JihRANCAARY+gjvpXDrtXWTGtJhfGeXPSELfrH2\nn6aZcfLkaBWOCtH3ZzfWuBB2a5f9gKnqzVJ/h/bC0z3gSjzjhqHI6jp6\n-----END PRIVATE KEY-----"
eas secret:create --scope project --name APPLE_APP_ID --value "6756657662"

# Publishable Keys
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://api.zien-ai.app"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://fgvrilruqzajstprioqj.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_KEY --value "sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy"
eas secret:create --scope project --name EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY --value "pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg"
eas secret:create --scope project --name EXPO_PUBLIC_ELEVENLABS_AGENT_ID --value "agent_0701kc4axybpf6fvak70xwfzpyka"
```

---

### ب. إضافة Secrets في GitHub (GitHub CLI)

#### تثبيت GitHub CLI (إذا لم يكن مثبت):
```bash
# Windows (PowerShell)
winget install --id GitHub.cli

# أو
choco install gh
```

#### تسجيل الدخول:
```bash
gh auth login
```

#### إضافة Secrets:

```bash
# Expo
gh secret set EXPO_TOKEN --body "s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn"
gh secret set EAS_PROJECT_ID --body "c2f7ad03-bef4-4e74-b426-4170a9d788b3"

# Apple
gh secret set ASC_API_KEY_ID --body "6AR5VSRINSC3"
gh secret set ASC_API_KEY_ISSUER_ID --body "BN4DXG557F"
gh secret set ASC_API_KEY_P8 --body "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvo+3ieNujr8usWIx\n5173ukKtHO8svfese75jWplP+JihRANCAARY+gjvpXDrtXWTGtJhfGeXPSELfrH2\nn6aZcfLkaBWOCtH3ZzfWuBB2a5f9gKnqzVJ/h/bC0z3gSjzjhqHI6jp6\n-----END PRIVATE KEY-----"
gh secret set APPLE_APP_ID --body "6756657662"
gh secret set ASC_APP_ID --body "6756657662"

# Cloudflare
gh secret set CLOUDFLARE_ACCOUNT_ID --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_ZONE_ID --body "cb61498c69c654043b54b30550151b8f"
gh secret set CLOUDFLARE_API_KEY --body "b1a6484ff2a4d441092133debec6b99ff512c"
gh secret set CLOUDFLARE_R2_ACCESS_KEY_ID --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_R2_SECRET_ACCESS_KEY --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_R2_BUCKET_NAME --body "rare"

# Webhook
gh secret set WEBHOOK_URL --body "https://api.zien-ai.app"
```

---

## 🚀 الطريقة 2: استخدام Script تلقائي

### إنشاء Script لإضافة جميع Secrets:

```bash
# add-secrets.sh (Linux/Mac)
# أو add-secrets.ps1 (Windows PowerShell)
```

---

## 📋 الطريقة 3: يدوياً (الأسهل)

### Expo:
1. اذهب إلى: https://expo.dev/accounts/zien/projects/c2f7ad03-bef4-4e74-b426-4170a9d788b3/settings/secrets
2. اضغط **Add Secret**
3. انسخ من ملف `GITHUB_EXPO_SECRETS_COMPLETE.md`

### GitHub:
1. اذهب إلى: https://github.com/algeneral-n/abo-zien/settings/secrets/actions
2. اضغط **New repository secret**
3. انسخ من ملف `GITHUB_EXPO_SECRETS_COMPLETE.md`

---

## ✅ هل تريد أن أنفذ الأوامر الآن؟

يمكنني:
1. ✅ تثبيت EAS CLI و GitHub CLI
2. ✅ تسجيل الدخول
3. ✅ إضافة جميع Secrets تلقائياً

**أخبرني إذا كنت تريد أن أبدأ!**

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ جاهز للتنفيذ

## أوامر مباشرة لإضافة جميع المفاتيح

---

## 🚀 الطريقة 1: استخدام الأوامر مباشرة

### أ. إضافة Secrets في Expo (EAS CLI)

#### تثبيت EAS CLI (إذا لم يكن مثبت):
```bash
npm install -g eas-cli
```

#### تسجيل الدخول:
```bash
eas login
```

#### إضافة Secrets:

```bash
# Expo Token
eas secret:create --scope project --name EXPO_TOKEN --value "s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn"

# Apple
eas secret:create --scope project --name ASC_API_KEY_ID --value "6AR5VSRINSC3"
eas secret:create --scope project --name ASC_API_KEY_ISSUER_ID --value "BN4DXG557F"
eas secret:create --scope project --name ASC_API_KEY_P8 --value "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvo+3ieNujr8usWIx\n5173ukKtHO8svfese75jWplP+JihRANCAARY+gjvpXDrtXWTGtJhfGeXPSELfrH2\nn6aZcfLkaBWOCtH3ZzfWuBB2a5f9gKnqzVJ/h/bC0z3gSjzjhqHI6jp6\n-----END PRIVATE KEY-----"
eas secret:create --scope project --name APPLE_APP_ID --value "6756657662"

# Publishable Keys
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://api.zien-ai.app"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://fgvrilruqzajstprioqj.supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_KEY --value "sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy"
eas secret:create --scope project --name EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY --value "pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg"
eas secret:create --scope project --name EXPO_PUBLIC_ELEVENLABS_AGENT_ID --value "agent_0701kc4axybpf6fvak70xwfzpyka"
```

---

### ب. إضافة Secrets في GitHub (GitHub CLI)

#### تثبيت GitHub CLI (إذا لم يكن مثبت):
```bash
# Windows (PowerShell)
winget install --id GitHub.cli

# أو
choco install gh
```

#### تسجيل الدخول:
```bash
gh auth login
```

#### إضافة Secrets:

```bash
# Expo
gh secret set EXPO_TOKEN --body "s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn"
gh secret set EAS_PROJECT_ID --body "c2f7ad03-bef4-4e74-b426-4170a9d788b3"

# Apple
gh secret set ASC_API_KEY_ID --body "6AR5VSRINSC3"
gh secret set ASC_API_KEY_ISSUER_ID --body "BN4DXG557F"
gh secret set ASC_API_KEY_P8 --body "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvo+3ieNujr8usWIx\n5173ukKtHO8svfese75jWplP+JihRANCAARY+gjvpXDrtXWTGtJhfGeXPSELfrH2\nn6aZcfLkaBWOCtH3ZzfWuBB2a5f9gKnqzVJ/h/bC0z3gSjzjhqHI6jp6\n-----END PRIVATE KEY-----"
gh secret set APPLE_APP_ID --body "6756657662"
gh secret set ASC_APP_ID --body "6756657662"

# Cloudflare
gh secret set CLOUDFLARE_ACCOUNT_ID --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_ZONE_ID --body "cb61498c69c654043b54b30550151b8f"
gh secret set CLOUDFLARE_API_KEY --body "b1a6484ff2a4d441092133debec6b99ff512c"
gh secret set CLOUDFLARE_R2_ACCESS_KEY_ID --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_R2_SECRET_ACCESS_KEY --body "ccc1ed9ab170eaf1e72e9a10e46ef320"
gh secret set CLOUDFLARE_R2_BUCKET_NAME --body "rare"

# Webhook
gh secret set WEBHOOK_URL --body "https://api.zien-ai.app"
```

---

## 🚀 الطريقة 2: استخدام Script تلقائي

### إنشاء Script لإضافة جميع Secrets:

```bash
# add-secrets.sh (Linux/Mac)
# أو add-secrets.ps1 (Windows PowerShell)
```

---

## 📋 الطريقة 3: يدوياً (الأسهل)

### Expo:
1. اذهب إلى: https://expo.dev/accounts/zien/projects/c2f7ad03-bef4-4e74-b426-4170a9d788b3/settings/secrets
2. اضغط **Add Secret**
3. انسخ من ملف `GITHUB_EXPO_SECRETS_COMPLETE.md`

### GitHub:
1. اذهب إلى: https://github.com/algeneral-n/abo-zien/settings/secrets/actions
2. اضغط **New repository secret**
3. انسخ من ملف `GITHUB_EXPO_SECRETS_COMPLETE.md`

---

## ✅ هل تريد أن أنفذ الأوامر الآن؟

يمكنني:
1. ✅ تثبيت EAS CLI و GitHub CLI
2. ✅ تسجيل الدخول
3. ✅ إضافة جميع Secrets تلقائياً

**أخبرني إذا كنت تريد أن أبدأ!**

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ جاهز للتنفيذ

