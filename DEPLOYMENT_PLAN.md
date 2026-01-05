# 🚀 RARE 4N - خطة النشر الكاملة
## Deployment Plan for Client Portal on Base44

---

## 📋 **الخطة الشاملة - من البداية للنهاية**

### **المرحلة 1: إعداد Base44 (Client Portal)**
### **المرحلة 2: إعداد GitHub Actions (CI/CD)**
### **المرحلة 3: إعداد Expo (Mobile App)**
### **المرحلة 4: إنشاء Repo جديد للمشروع**

---

## 🎯 **المرحلة 1: Base44 - Client Portal**

### **1.1 هيكل المشروع على Base44:**

```
client-portal/
├── index.html          (Entry point)
├── app-new.js          (Main app)
├── styles.css          (Styling)
├── components/        (RARE Character, etc.)
├── pages/             (Dashboard, Libraries, Payments, etc.)
├── services/          (API services, Agents)
├── themes/            (Theme manager)
└── i18n/              (Languages)
```

### **1.2 المتطلبات:**

**Base44 يحتاج:**
- ✅ Static files hosting (HTML, CSS, JS)
- ✅ Environment Variables support
- ✅ Custom domain support (portal.zien-ai.app)
- ✅ Build/deploy automation (اختياري)

### **1.3 الخطوات:**

1. **إنشاء Project جديد على Base44**
   - اسم: `rare4n-client-portal`
   - Framework: Static Site / Vanilla JS

2. **رفع الملفات:**
   - رفع مجلد `apps/client-portal/` كاملاً
   - أو استخدام Git integration

3. **إعداد Environment Variables:**
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `API_URL` / `API_DOMAIN`
   - `ELEVENLABS_AGENT_ID`
   - `FRONTEND_URL`

4. **إعداد Custom Domain:**
   - `portal.zien-ai.app`

5. **Build Configuration (إذا لزم):**
   - No build needed (Vanilla JS)
   - أو استخدام Vite/Webpack للـ bundling (اختياري)

---

## 🔄 **المرحلة 2: GitHub Actions - CI/CD**

### **2.1 الهدف:**
- أتمتة بناء ونشر Client Portal على Base44
- أتمتة بناء Mobile App على Expo
- أتمتة رفع iOS/Android إلى Stores

### **2.2 Workflows المطلوبة:**

#### **Workflow 1: Deploy Client Portal to Base44**

```yaml
name: Deploy Client Portal to Base44

on:
  push:
    branches: [main, clean-main]
    paths:
      - 'apps/client-portal/**'
  workflow_dispatch:

jobs:
  deploy-portal:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies (if needed)
        run: |
          cd apps/client-portal
          npm install || true
      
      - name: Build (if using bundler)
        run: |
          cd apps/client-portal
          npm run build || echo "No build step"
      
      - name: Deploy to Base44
        uses: base44/deploy-action@v1
        with:
          api-key: ${{ secrets.BASE44_API_KEY }}
          project-id: ${{ secrets.BASE44_PROJECT_ID }}
          directory: apps/client-portal
```

#### **Workflow 2: Build & Deploy Mobile App**

```yaml
name: Build & Deploy Mobile App

on:
  push:
    branches: [main, clean-main]
    paths:
      - 'mobile/**'
  workflow_dispatch:

jobs:
  build-expo:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: |
          cd mobile
          npm install
      
      - name: Build iOS
        run: |
          cd mobile
          eas build --platform ios --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          ASC_API_KEY_ID: ${{ secrets.ASC_API_KEY_ID }}
          ASC_API_KEY_ISSUER_ID: ${{ secrets.ASC_API_KEY_ISSUER_ID }}
          ASC_API_KEY_P8: ${{ secrets.ASC_API_KEY_P8 }}
      
      - name: Build Android
        run: |
          cd mobile
          eas build --platform android --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          GOOGLE_PLAY_SERVICE_ACCOUNT_JSON: ${{ secrets.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON }}
```

#### **Workflow 3: Auto-create Repo for New Client**

```yaml
name: Create Client Project Repo

on:
  workflow_dispatch:
    inputs:
      client_name:
        description: 'Client Name'
        required: true
      client_email:
        description: 'Client Email'
        required: true

jobs:
  create-repo:
    runs-on: ubuntu-latest
    steps:
      - name: Create GitHub Repo
        uses: actions/github-script@v6
        with:
          script: |
            const repo = await github.rest.repos.createForAuthenticatedUser({
              name: `rare4n-${context.payload.inputs.client_name.toLowerCase().replace(/\s+/g, '-')}`,
              description: `RARE 4N Project for ${context.payload.inputs.client_name}`,
              private: false,
              auto_init: true
            });
            console.log(`Created repo: ${repo.data.html_url}`);
```

### **2.3 GitHub Secrets المطلوبة:**

```bash
# Base44
BASE44_API_KEY=
BASE44_PROJECT_ID=

# Expo
EXPO_TOKEN=
EAS_PROJECT_ID=

# App Store Connect
ASC_API_KEY_ID=
ASC_API_KEY_ISSUER_ID=
ASC_API_KEY_P8=

# Google Play
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON=
```

---

## 📱 **المرحلة 3: Expo - Mobile App**

### **3.1 إعداد Expo:**

1. **تسجيل الدخول:**
   ```bash
   cd mobile
   npx expo login
   ```

2. **إنشاء Project:**
   ```bash
   npx expo init
   # أو استخدام المشروع الموجود
   ```

3. **إعداد EAS:**
   ```bash
   npm install -g eas-cli
   eas login
   eas build:configure
   ```

4. **إعداد app.json/app.config.js:**
   ```json
   {
     "expo": {
       "name": "RARE 4N",
       "slug": "rare4n",
       "version": "1.0.0",
       "extra": {
         "eas": {
           "projectId": "your-project-id"
         }
       }
     }
   }
   ```

### **3.2 Environment Variables:**

في `mobile/.env`:
```bash
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_KEY=
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_ELEVENLABS_AGENT_ID=
```

### **3.3 Build Commands:**

```bash
# Development build
eas build --profile development --platform ios

# Production build
eas build --profile production --platform ios
eas build --profile production --platform android

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## 🆕 **المرحلة 4: إنشاء Repo جديد لكل عميل**

### **4.1 الهدف:**
- إنشاء Repo منفصل لكل عميل
- نسخ Client Portal كـ template
- تخصيص المشروع للعميل

### **4.2 الخطوات:**

#### **الطريقة 1: Manual (GitHub UI)**
1. اذهب إلى GitHub
2. New Repository
3. Use template: `rare4n-client-portal-template`
4. Customize للعميل

#### **الطريقة 2: Automated (GitHub Actions)**
- استخدام Workflow 3 أعلاه
- أو استخدام GitHub API مباشرة

#### **الطريقة 3: CLI Script**
```bash
# create-client-repo.sh
#!/bin/bash
CLIENT_NAME=$1
REPO_NAME="rare4n-${CLIENT_NAME,,}"

gh repo create $REPO_NAME \
  --public \
  --description "RARE 4N Project for $CLIENT_NAME" \
  --template algeneral-n/rare4n-client-portal-template

# Clone and customize
git clone https://github.com/algeneral-n/$REPO_NAME.git
cd $REPO_NAME
# Customize files...
git push
```

### **4.3 Template Structure:**

```
rare4n-client-portal-template/
├── .github/
│   └── workflows/
│       ├── deploy-base44.yml
│       └── build-mobile.yml
├── client-portal/      (Base44 files)
├── mobile/            (Expo files)
├── .env.example
├── README.md
└── package.json
```

---

## 📊 **الترتيب الموصى به للتنفيذ:**

### **✅ المرحلة 1: Base44 (الأولوية)**
1. إنشاء Project على Base44
2. رفع Client Portal files
3. إعداد Environment Variables
4. إعداد Custom Domain
5. اختبار النشر

### **✅ المرحلة 2: GitHub Actions**
1. إنشاء `.github/workflows/` directory
2. إنشاء `deploy-base44.yml`
3. إنشاء `build-mobile.yml`
4. إضافة GitHub Secrets
5. اختبار Workflows

### **✅ المرحلة 3: Expo**
1. إعداد Expo account
2. إعداد EAS
3. إعداد app.json
4. اختبار Build محلياً
5. ربط مع GitHub Actions

### **✅ المرحلة 4: Template Repo**
1. إنشاء Template Repository
2. إعداد Template structure
3. إنشاء Automation script
4. اختبار إنشاء Repo جديد

---

## 🔧 **التفاصيل التقنية:**

### **Base44 Requirements:**
- ✅ Static file hosting
- ✅ Environment variables
- ✅ Custom domain
- ✅ HTTPS support
- ✅ CDN (اختياري)

### **GitHub Actions Requirements:**
- ✅ Base44 API access
- ✅ Expo/EAS access
- ✅ App Store Connect API
- ✅ Google Play API (Android)

### **Expo Requirements:**
- ✅ Expo account
- ✅ EAS account
- ✅ Apple Developer account (iOS)
- ✅ Google Play account (Android)

---

## ⚠️ **ملاحظات مهمة:**

1. **Base44:**
   - تأكد من أن Base44 يدعم Static hosting
   - تأكد من Environment Variables support
   - تأكد من Custom domain support

2. **GitHub Actions:**
   - قد تحتاج Base44 API key (إذا كان متوفر)
   - أو استخدام Git integration مع Base44

3. **Expo:**
   - EAS Build يحتاج دفع (أو free tier محدود)
   - App Store Connect يحتاج Apple Developer account ($99/year)

4. **Template Repo:**
   - يمكن استخدام GitHub Template feature
   - أو إنشاء script للنسخ والتخصيص

---

## 🚀 **الخطوة التالية:**

**قبل البدء، أحتاج منك:**

1. **Base44:**
   - ✅ هل لديك حساب Base44؟
   - ✅ هل Base44 يدعم Static hosting؟
   - ✅ هل Base44 لديه API للـ deployment؟

2. **GitHub:**
   - ✅ هل تريد استخدام GitHub Actions؟
   - ✅ هل لديك GitHub account؟

3. **Expo:**
   - ✅ هل لديك Expo account؟
   - ✅ هل تريد بناء Mobile App الآن أم لاحقاً؟

4. **Template:**
   - ✅ هل تريد إنشاء Template Repo الآن؟
   - ✅ أم تريد التركيز على Base44 أولاً؟

---

**بعد إجابتك على هذه الأسئلة، سأبدأ في التنفيذ الفعلي! 🚀**

