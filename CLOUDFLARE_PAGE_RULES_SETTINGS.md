# إعدادات Cloudflare Page Rules المتاحة
## قائمة كاملة بالإعدادات

---

## ⚠️ ملاحظة مهمة

**Security Level** غير متاح في **Page Rules** القديمة!

في Cloudflare، هناك نوعان من Rules:
1. **Page Rules** (القديمة) - لا تحتوي على Security Level
2. **WAF Custom Rules** (الجديدة) - تحتوي على Security Level

---

## ✅ الحل: استخدم WAF Custom Rules بدلاً من Page Rules

### الطريقة الصحيحة:

#### 1. اذهب إلى WAF Custom Rules:
- **Security** → **WAF** → **Custom Rules**
- اضغط **Create rule**

#### 2. إعداد Rule:
- **Rule name:** `Allow MCP Endpoint`
- **Expression:** `(http.request.uri.path eq "/api/mcp")`
- **Action:** `Skip` (تخطي جميع WAF rules)

#### 3. Deploy

---

## 📋 إعدادات Page Rules المتاحة

إذا أردت استخدام Page Rules، الإعدادات المتاحة هي:

1. ✅ **Cache Level:** Bypass (موجود)
2. ✅ **SSL:** Full/Flexible (موجود)
3. ❌ **Security Level:** غير متاح في Page Rules
4. ✅ **Disable Security:** غير متاح في Page Rules القديمة

---

## 🎯 الحل الموصى به

### استخدم **WAF Custom Rules**:

1. **Security** → **WAF** → **Custom Rules**
2. **Create rule:**
   ```
   Rule name: Allow MCP Endpoint
   Expression: (http.request.uri.path eq "/api/mcp")
   Action: Skip
   ```
3. **Deploy**

---

## 📝 إجابة السؤال الثاني: هل يجب عمل إنشاء صفحات؟

### نعم، يجب إنشاء Cloudflare Pages للـ Builder

#### لماذا؟
- Builder يحتاج إلى نشر Web Apps
- Cloudflare Pages مناسب للنشر السريع
- يدعم GitHub integration

#### الخطوات:

### 1. إنشاء Cloudflare Pages Project

#### أ. في Cloudflare Dashboard:
1. **Workers & Pages** → **Pages**
2. **Create a project**
3. **Connect to Git** (GitHub/GitLab)
4. اختر Repository الخاص بالـ Builder

#### ب. إعدادات Build:
- **Framework preset:** Vite / React / Next.js (حسب نوع Builder)
- **Build command:** `npm run build`
- **Build output directory:** `dist` أو `build`

#### ج. Environment Variables:
- أضف جميع المتغيرات المطلوبة:
  - `EXPO_PUBLIC_API_URL`
  - `EXPO_PUBLIC_SUPABASE_URL`
  - وغيرها...

---

### 2. إعداد Custom Domain

#### أ. في Cloudflare Pages:
1. **Settings** → **Custom domains**
2. أضف Domain: `builder.zien-ai.app` (مثال)
3. Cloudflare سيقوم بإعداد DNS تلقائياً

---

### 3. إعدادات Builder للنشر

#### في Builder Service:
```javascript
// apps/backend/src/services/autoBuilderService.js

const CLOUDFLARE_PAGES_API_TOKEN = process.env.CLOUDFLARE_PAGES_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

// نشر إلى Cloudflare Pages
async function deployToCloudflarePages(projectName, buildOutput) {
  // Use Cloudflare Pages API
}
```

---

## ✅ Checklist للنشر من Builder

### 1. Cloudflare Pages Setup:
- [ ] إنشاء Cloudflare Pages Project
- [ ] ربط مع GitHub Repository
- [ ] إضافة Environment Variables
- [ ] إعداد Custom Domain
- [ ] اختبار النشر اليدوي

### 2. Builder Integration:
- [ ] إضافة Cloudflare Pages API Token
- [ ] إضافة Cloudflare Account ID
- [ ] إنشاء deploy function في Builder
- [ ] ربط مع Auto Builder Service

### 3. Testing:
- [ ] اختبار النشر من Builder
- [ ] التحقق من Custom Domain
- [ ] اختبار الوظائف بعد النشر

---

## 🔑 Environment Variables المطلوبة

### في Backend `.env`:
```bash
CLOUDFLARE_PAGES_API_TOKEN=your_pages_api_token
CLOUDFLARE_ACCOUNT_ID=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_PAGES_PROJECT_NAME=builder-app
```

---

## 📚 روابط مفيدة

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages
- **Cloudflare Pages API:** https://developers.cloudflare.com/api/operations/pages-project-create-project
- **WAF Custom Rules:** https://developers.cloudflare.com/waf/custom-rules

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ دليل شامل

## قائمة كاملة بالإعدادات

---

## ⚠️ ملاحظة مهمة

**Security Level** غير متاح في **Page Rules** القديمة!

في Cloudflare، هناك نوعان من Rules:
1. **Page Rules** (القديمة) - لا تحتوي على Security Level
2. **WAF Custom Rules** (الجديدة) - تحتوي على Security Level

---

## ✅ الحل: استخدم WAF Custom Rules بدلاً من Page Rules

### الطريقة الصحيحة:

#### 1. اذهب إلى WAF Custom Rules:
- **Security** → **WAF** → **Custom Rules**
- اضغط **Create rule**

#### 2. إعداد Rule:
- **Rule name:** `Allow MCP Endpoint`
- **Expression:** `(http.request.uri.path eq "/api/mcp")`
- **Action:** `Skip` (تخطي جميع WAF rules)

#### 3. Deploy

---

## 📋 إعدادات Page Rules المتاحة

إذا أردت استخدام Page Rules، الإعدادات المتاحة هي:

1. ✅ **Cache Level:** Bypass (موجود)
2. ✅ **SSL:** Full/Flexible (موجود)
3. ❌ **Security Level:** غير متاح في Page Rules
4. ✅ **Disable Security:** غير متاح في Page Rules القديمة

---

## 🎯 الحل الموصى به

### استخدم **WAF Custom Rules**:

1. **Security** → **WAF** → **Custom Rules**
2. **Create rule:**
   ```
   Rule name: Allow MCP Endpoint
   Expression: (http.request.uri.path eq "/api/mcp")
   Action: Skip
   ```
3. **Deploy**

---

## 📝 إجابة السؤال الثاني: هل يجب عمل إنشاء صفحات؟

### نعم، يجب إنشاء Cloudflare Pages للـ Builder

#### لماذا؟
- Builder يحتاج إلى نشر Web Apps
- Cloudflare Pages مناسب للنشر السريع
- يدعم GitHub integration

#### الخطوات:

### 1. إنشاء Cloudflare Pages Project

#### أ. في Cloudflare Dashboard:
1. **Workers & Pages** → **Pages**
2. **Create a project**
3. **Connect to Git** (GitHub/GitLab)
4. اختر Repository الخاص بالـ Builder

#### ب. إعدادات Build:
- **Framework preset:** Vite / React / Next.js (حسب نوع Builder)
- **Build command:** `npm run build`
- **Build output directory:** `dist` أو `build`

#### ج. Environment Variables:
- أضف جميع المتغيرات المطلوبة:
  - `EXPO_PUBLIC_API_URL`
  - `EXPO_PUBLIC_SUPABASE_URL`
  - وغيرها...

---

### 2. إعداد Custom Domain

#### أ. في Cloudflare Pages:
1. **Settings** → **Custom domains**
2. أضف Domain: `builder.zien-ai.app` (مثال)
3. Cloudflare سيقوم بإعداد DNS تلقائياً

---

### 3. إعدادات Builder للنشر

#### في Builder Service:
```javascript
// apps/backend/src/services/autoBuilderService.js

const CLOUDFLARE_PAGES_API_TOKEN = process.env.CLOUDFLARE_PAGES_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

// نشر إلى Cloudflare Pages
async function deployToCloudflarePages(projectName, buildOutput) {
  // Use Cloudflare Pages API
}
```

---

## ✅ Checklist للنشر من Builder

### 1. Cloudflare Pages Setup:
- [ ] إنشاء Cloudflare Pages Project
- [ ] ربط مع GitHub Repository
- [ ] إضافة Environment Variables
- [ ] إعداد Custom Domain
- [ ] اختبار النشر اليدوي

### 2. Builder Integration:
- [ ] إضافة Cloudflare Pages API Token
- [ ] إضافة Cloudflare Account ID
- [ ] إنشاء deploy function في Builder
- [ ] ربط مع Auto Builder Service

### 3. Testing:
- [ ] اختبار النشر من Builder
- [ ] التحقق من Custom Domain
- [ ] اختبار الوظائف بعد النشر

---

## 🔑 Environment Variables المطلوبة

### في Backend `.env`:
```bash
CLOUDFLARE_PAGES_API_TOKEN=your_pages_api_token
CLOUDFLARE_ACCOUNT_ID=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_PAGES_PROJECT_NAME=builder-app
```

---

## 📚 روابط مفيدة

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages
- **Cloudflare Pages API:** https://developers.cloudflare.com/api/operations/pages-project-create-project
- **WAF Custom Rules:** https://developers.cloudflare.com/waf/custom-rules

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ دليل شامل

## قائمة كاملة بالإعدادات

---

## ⚠️ ملاحظة مهمة

**Security Level** غير متاح في **Page Rules** القديمة!

في Cloudflare، هناك نوعان من Rules:
1. **Page Rules** (القديمة) - لا تحتوي على Security Level
2. **WAF Custom Rules** (الجديدة) - تحتوي على Security Level

---

## ✅ الحل: استخدم WAF Custom Rules بدلاً من Page Rules

### الطريقة الصحيحة:

#### 1. اذهب إلى WAF Custom Rules:
- **Security** → **WAF** → **Custom Rules**
- اضغط **Create rule**

#### 2. إعداد Rule:
- **Rule name:** `Allow MCP Endpoint`
- **Expression:** `(http.request.uri.path eq "/api/mcp")`
- **Action:** `Skip` (تخطي جميع WAF rules)

#### 3. Deploy

---

## 📋 إعدادات Page Rules المتاحة

إذا أردت استخدام Page Rules، الإعدادات المتاحة هي:

1. ✅ **Cache Level:** Bypass (موجود)
2. ✅ **SSL:** Full/Flexible (موجود)
3. ❌ **Security Level:** غير متاح في Page Rules
4. ✅ **Disable Security:** غير متاح في Page Rules القديمة

---

## 🎯 الحل الموصى به

### استخدم **WAF Custom Rules**:

1. **Security** → **WAF** → **Custom Rules**
2. **Create rule:**
   ```
   Rule name: Allow MCP Endpoint
   Expression: (http.request.uri.path eq "/api/mcp")
   Action: Skip
   ```
3. **Deploy**

---

## 📝 إجابة السؤال الثاني: هل يجب عمل إنشاء صفحات؟

### نعم، يجب إنشاء Cloudflare Pages للـ Builder

#### لماذا؟
- Builder يحتاج إلى نشر Web Apps
- Cloudflare Pages مناسب للنشر السريع
- يدعم GitHub integration

#### الخطوات:

### 1. إنشاء Cloudflare Pages Project

#### أ. في Cloudflare Dashboard:
1. **Workers & Pages** → **Pages**
2. **Create a project**
3. **Connect to Git** (GitHub/GitLab)
4. اختر Repository الخاص بالـ Builder

#### ب. إعدادات Build:
- **Framework preset:** Vite / React / Next.js (حسب نوع Builder)
- **Build command:** `npm run build`
- **Build output directory:** `dist` أو `build`

#### ج. Environment Variables:
- أضف جميع المتغيرات المطلوبة:
  - `EXPO_PUBLIC_API_URL`
  - `EXPO_PUBLIC_SUPABASE_URL`
  - وغيرها...

---

### 2. إعداد Custom Domain

#### أ. في Cloudflare Pages:
1. **Settings** → **Custom domains**
2. أضف Domain: `builder.zien-ai.app` (مثال)
3. Cloudflare سيقوم بإعداد DNS تلقائياً

---

### 3. إعدادات Builder للنشر

#### في Builder Service:
```javascript
// apps/backend/src/services/autoBuilderService.js

const CLOUDFLARE_PAGES_API_TOKEN = process.env.CLOUDFLARE_PAGES_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

// نشر إلى Cloudflare Pages
async function deployToCloudflarePages(projectName, buildOutput) {
  // Use Cloudflare Pages API
}
```

---

## ✅ Checklist للنشر من Builder

### 1. Cloudflare Pages Setup:
- [ ] إنشاء Cloudflare Pages Project
- [ ] ربط مع GitHub Repository
- [ ] إضافة Environment Variables
- [ ] إعداد Custom Domain
- [ ] اختبار النشر اليدوي

### 2. Builder Integration:
- [ ] إضافة Cloudflare Pages API Token
- [ ] إضافة Cloudflare Account ID
- [ ] إنشاء deploy function في Builder
- [ ] ربط مع Auto Builder Service

### 3. Testing:
- [ ] اختبار النشر من Builder
- [ ] التحقق من Custom Domain
- [ ] اختبار الوظائف بعد النشر

---

## 🔑 Environment Variables المطلوبة

### في Backend `.env`:
```bash
CLOUDFLARE_PAGES_API_TOKEN=your_pages_api_token
CLOUDFLARE_ACCOUNT_ID=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_PAGES_PROJECT_NAME=builder-app
```

---

## 📚 روابط مفيدة

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages
- **Cloudflare Pages API:** https://developers.cloudflare.com/api/operations/pages-project-create-project
- **WAF Custom Rules:** https://developers.cloudflare.com/waf/custom-rules

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ دليل شامل

## قائمة كاملة بالإعدادات

---

## ⚠️ ملاحظة مهمة

**Security Level** غير متاح في **Page Rules** القديمة!

في Cloudflare، هناك نوعان من Rules:
1. **Page Rules** (القديمة) - لا تحتوي على Security Level
2. **WAF Custom Rules** (الجديدة) - تحتوي على Security Level

---

## ✅ الحل: استخدم WAF Custom Rules بدلاً من Page Rules

### الطريقة الصحيحة:

#### 1. اذهب إلى WAF Custom Rules:
- **Security** → **WAF** → **Custom Rules**
- اضغط **Create rule**

#### 2. إعداد Rule:
- **Rule name:** `Allow MCP Endpoint`
- **Expression:** `(http.request.uri.path eq "/api/mcp")`
- **Action:** `Skip` (تخطي جميع WAF rules)

#### 3. Deploy

---

## 📋 إعدادات Page Rules المتاحة

إذا أردت استخدام Page Rules، الإعدادات المتاحة هي:

1. ✅ **Cache Level:** Bypass (موجود)
2. ✅ **SSL:** Full/Flexible (موجود)
3. ❌ **Security Level:** غير متاح في Page Rules
4. ✅ **Disable Security:** غير متاح في Page Rules القديمة

---

## 🎯 الحل الموصى به

### استخدم **WAF Custom Rules**:

1. **Security** → **WAF** → **Custom Rules**
2. **Create rule:**
   ```
   Rule name: Allow MCP Endpoint
   Expression: (http.request.uri.path eq "/api/mcp")
   Action: Skip
   ```
3. **Deploy**

---

## 📝 إجابة السؤال الثاني: هل يجب عمل إنشاء صفحات؟

### نعم، يجب إنشاء Cloudflare Pages للـ Builder

#### لماذا؟
- Builder يحتاج إلى نشر Web Apps
- Cloudflare Pages مناسب للنشر السريع
- يدعم GitHub integration

#### الخطوات:

### 1. إنشاء Cloudflare Pages Project

#### أ. في Cloudflare Dashboard:
1. **Workers & Pages** → **Pages**
2. **Create a project**
3. **Connect to Git** (GitHub/GitLab)
4. اختر Repository الخاص بالـ Builder

#### ب. إعدادات Build:
- **Framework preset:** Vite / React / Next.js (حسب نوع Builder)
- **Build command:** `npm run build`
- **Build output directory:** `dist` أو `build`

#### ج. Environment Variables:
- أضف جميع المتغيرات المطلوبة:
  - `EXPO_PUBLIC_API_URL`
  - `EXPO_PUBLIC_SUPABASE_URL`
  - وغيرها...

---

### 2. إعداد Custom Domain

#### أ. في Cloudflare Pages:
1. **Settings** → **Custom domains**
2. أضف Domain: `builder.zien-ai.app` (مثال)
3. Cloudflare سيقوم بإعداد DNS تلقائياً

---

### 3. إعدادات Builder للنشر

#### في Builder Service:
```javascript
// apps/backend/src/services/autoBuilderService.js

const CLOUDFLARE_PAGES_API_TOKEN = process.env.CLOUDFLARE_PAGES_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

// نشر إلى Cloudflare Pages
async function deployToCloudflarePages(projectName, buildOutput) {
  // Use Cloudflare Pages API
}
```

---

## ✅ Checklist للنشر من Builder

### 1. Cloudflare Pages Setup:
- [ ] إنشاء Cloudflare Pages Project
- [ ] ربط مع GitHub Repository
- [ ] إضافة Environment Variables
- [ ] إعداد Custom Domain
- [ ] اختبار النشر اليدوي

### 2. Builder Integration:
- [ ] إضافة Cloudflare Pages API Token
- [ ] إضافة Cloudflare Account ID
- [ ] إنشاء deploy function في Builder
- [ ] ربط مع Auto Builder Service

### 3. Testing:
- [ ] اختبار النشر من Builder
- [ ] التحقق من Custom Domain
- [ ] اختبار الوظائف بعد النشر

---

## 🔑 Environment Variables المطلوبة

### في Backend `.env`:
```bash
CLOUDFLARE_PAGES_API_TOKEN=your_pages_api_token
CLOUDFLARE_ACCOUNT_ID=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_PAGES_PROJECT_NAME=builder-app
```

---

## 📚 روابط مفيدة

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages
- **Cloudflare Pages API:** https://developers.cloudflare.com/api/operations/pages-project-create-project
- **WAF Custom Rules:** https://developers.cloudflare.com/waf/custom-rules

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ دليل شامل

## قائمة كاملة بالإعدادات

---

## ⚠️ ملاحظة مهمة

**Security Level** غير متاح في **Page Rules** القديمة!

في Cloudflare، هناك نوعان من Rules:
1. **Page Rules** (القديمة) - لا تحتوي على Security Level
2. **WAF Custom Rules** (الجديدة) - تحتوي على Security Level

---

## ✅ الحل: استخدم WAF Custom Rules بدلاً من Page Rules

### الطريقة الصحيحة:

#### 1. اذهب إلى WAF Custom Rules:
- **Security** → **WAF** → **Custom Rules**
- اضغط **Create rule**

#### 2. إعداد Rule:
- **Rule name:** `Allow MCP Endpoint`
- **Expression:** `(http.request.uri.path eq "/api/mcp")`
- **Action:** `Skip` (تخطي جميع WAF rules)

#### 3. Deploy

---

## 📋 إعدادات Page Rules المتاحة

إذا أردت استخدام Page Rules، الإعدادات المتاحة هي:

1. ✅ **Cache Level:** Bypass (موجود)
2. ✅ **SSL:** Full/Flexible (موجود)
3. ❌ **Security Level:** غير متاح في Page Rules
4. ✅ **Disable Security:** غير متاح في Page Rules القديمة

---

## 🎯 الحل الموصى به

### استخدم **WAF Custom Rules**:

1. **Security** → **WAF** → **Custom Rules**
2. **Create rule:**
   ```
   Rule name: Allow MCP Endpoint
   Expression: (http.request.uri.path eq "/api/mcp")
   Action: Skip
   ```
3. **Deploy**

---

## 📝 إجابة السؤال الثاني: هل يجب عمل إنشاء صفحات؟

### نعم، يجب إنشاء Cloudflare Pages للـ Builder

#### لماذا؟
- Builder يحتاج إلى نشر Web Apps
- Cloudflare Pages مناسب للنشر السريع
- يدعم GitHub integration

#### الخطوات:

### 1. إنشاء Cloudflare Pages Project

#### أ. في Cloudflare Dashboard:
1. **Workers & Pages** → **Pages**
2. **Create a project**
3. **Connect to Git** (GitHub/GitLab)
4. اختر Repository الخاص بالـ Builder

#### ب. إعدادات Build:
- **Framework preset:** Vite / React / Next.js (حسب نوع Builder)
- **Build command:** `npm run build`
- **Build output directory:** `dist` أو `build`

#### ج. Environment Variables:
- أضف جميع المتغيرات المطلوبة:
  - `EXPO_PUBLIC_API_URL`
  - `EXPO_PUBLIC_SUPABASE_URL`
  - وغيرها...

---

### 2. إعداد Custom Domain

#### أ. في Cloudflare Pages:
1. **Settings** → **Custom domains**
2. أضف Domain: `builder.zien-ai.app` (مثال)
3. Cloudflare سيقوم بإعداد DNS تلقائياً

---

### 3. إعدادات Builder للنشر

#### في Builder Service:
```javascript
// apps/backend/src/services/autoBuilderService.js

const CLOUDFLARE_PAGES_API_TOKEN = process.env.CLOUDFLARE_PAGES_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

// نشر إلى Cloudflare Pages
async function deployToCloudflarePages(projectName, buildOutput) {
  // Use Cloudflare Pages API
}
```

---

## ✅ Checklist للنشر من Builder

### 1. Cloudflare Pages Setup:
- [ ] إنشاء Cloudflare Pages Project
- [ ] ربط مع GitHub Repository
- [ ] إضافة Environment Variables
- [ ] إعداد Custom Domain
- [ ] اختبار النشر اليدوي

### 2. Builder Integration:
- [ ] إضافة Cloudflare Pages API Token
- [ ] إضافة Cloudflare Account ID
- [ ] إنشاء deploy function في Builder
- [ ] ربط مع Auto Builder Service

### 3. Testing:
- [ ] اختبار النشر من Builder
- [ ] التحقق من Custom Domain
- [ ] اختبار الوظائف بعد النشر

---

## 🔑 Environment Variables المطلوبة

### في Backend `.env`:
```bash
CLOUDFLARE_PAGES_API_TOKEN=your_pages_api_token
CLOUDFLARE_ACCOUNT_ID=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_PAGES_PROJECT_NAME=builder-app
```

---

## 📚 روابط مفيدة

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages
- **Cloudflare Pages API:** https://developers.cloudflare.com/api/operations/pages-project-create-project
- **WAF Custom Rules:** https://developers.cloudflare.com/waf/custom-rules

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ دليل شامل

## قائمة كاملة بالإعدادات

---

## ⚠️ ملاحظة مهمة

**Security Level** غير متاح في **Page Rules** القديمة!

في Cloudflare، هناك نوعان من Rules:
1. **Page Rules** (القديمة) - لا تحتوي على Security Level
2. **WAF Custom Rules** (الجديدة) - تحتوي على Security Level

---

## ✅ الحل: استخدم WAF Custom Rules بدلاً من Page Rules

### الطريقة الصحيحة:

#### 1. اذهب إلى WAF Custom Rules:
- **Security** → **WAF** → **Custom Rules**
- اضغط **Create rule**

#### 2. إعداد Rule:
- **Rule name:** `Allow MCP Endpoint`
- **Expression:** `(http.request.uri.path eq "/api/mcp")`
- **Action:** `Skip` (تخطي جميع WAF rules)

#### 3. Deploy

---

## 📋 إعدادات Page Rules المتاحة

إذا أردت استخدام Page Rules، الإعدادات المتاحة هي:

1. ✅ **Cache Level:** Bypass (موجود)
2. ✅ **SSL:** Full/Flexible (موجود)
3. ❌ **Security Level:** غير متاح في Page Rules
4. ✅ **Disable Security:** غير متاح في Page Rules القديمة

---

## 🎯 الحل الموصى به

### استخدم **WAF Custom Rules**:

1. **Security** → **WAF** → **Custom Rules**
2. **Create rule:**
   ```
   Rule name: Allow MCP Endpoint
   Expression: (http.request.uri.path eq "/api/mcp")
   Action: Skip
   ```
3. **Deploy**

---

## 📝 إجابة السؤال الثاني: هل يجب عمل إنشاء صفحات؟

### نعم، يجب إنشاء Cloudflare Pages للـ Builder

#### لماذا؟
- Builder يحتاج إلى نشر Web Apps
- Cloudflare Pages مناسب للنشر السريع
- يدعم GitHub integration

#### الخطوات:

### 1. إنشاء Cloudflare Pages Project

#### أ. في Cloudflare Dashboard:
1. **Workers & Pages** → **Pages**
2. **Create a project**
3. **Connect to Git** (GitHub/GitLab)
4. اختر Repository الخاص بالـ Builder

#### ب. إعدادات Build:
- **Framework preset:** Vite / React / Next.js (حسب نوع Builder)
- **Build command:** `npm run build`
- **Build output directory:** `dist` أو `build`

#### ج. Environment Variables:
- أضف جميع المتغيرات المطلوبة:
  - `EXPO_PUBLIC_API_URL`
  - `EXPO_PUBLIC_SUPABASE_URL`
  - وغيرها...

---

### 2. إعداد Custom Domain

#### أ. في Cloudflare Pages:
1. **Settings** → **Custom domains**
2. أضف Domain: `builder.zien-ai.app` (مثال)
3. Cloudflare سيقوم بإعداد DNS تلقائياً

---

### 3. إعدادات Builder للنشر

#### في Builder Service:
```javascript
// apps/backend/src/services/autoBuilderService.js

const CLOUDFLARE_PAGES_API_TOKEN = process.env.CLOUDFLARE_PAGES_API_TOKEN;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;

// نشر إلى Cloudflare Pages
async function deployToCloudflarePages(projectName, buildOutput) {
  // Use Cloudflare Pages API
}
```

---

## ✅ Checklist للنشر من Builder

### 1. Cloudflare Pages Setup:
- [ ] إنشاء Cloudflare Pages Project
- [ ] ربط مع GitHub Repository
- [ ] إضافة Environment Variables
- [ ] إعداد Custom Domain
- [ ] اختبار النشر اليدوي

### 2. Builder Integration:
- [ ] إضافة Cloudflare Pages API Token
- [ ] إضافة Cloudflare Account ID
- [ ] إنشاء deploy function في Builder
- [ ] ربط مع Auto Builder Service

### 3. Testing:
- [ ] اختبار النشر من Builder
- [ ] التحقق من Custom Domain
- [ ] اختبار الوظائف بعد النشر

---

## 🔑 Environment Variables المطلوبة

### في Backend `.env`:
```bash
CLOUDFLARE_PAGES_API_TOKEN=your_pages_api_token
CLOUDFLARE_ACCOUNT_ID=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_PAGES_PROJECT_NAME=builder-app
```

---

## 📚 روابط مفيدة

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages
- **Cloudflare Pages API:** https://developers.cloudflare.com/api/operations/pages-project-create-project
- **WAF Custom Rules:** https://developers.cloudflare.com/waf/custom-rules

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ دليل شامل

