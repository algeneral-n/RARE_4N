# رابط مباشر لـ WAF Custom Rules - Cloudflare
## روابط سريعة لإضافة Rule للـ MCP Endpoint

---

## 🔗 الروابط المباشرة

### 1. رابط مباشر لـ WAF Custom Rules:
```
https://dash.cloudflare.com/?to=/:account/:zone/security/waf/custom-rules
```

### 2. رابط مباشر لإنشاء Rule جديد:
```
https://dash.cloudflare.com/?to=/:account/:zone/security/waf/custom-rules/new
```

---

## 📋 الخطوات مع الروابط

### الطريقة 1: استخدام الرابط المباشر

1. **افتح الرابط:**
   ```
   https://dash.cloudflare.com
   ```

2. **اختر Domain:** `zien-ai.app`

3. **اذهب مباشرة إلى:**
   - **Security** → **WAF** → **Custom Rules**
   - أو استخدم الرابط المباشر بعد اختيار Domain

---

## 🎯 إعدادات Rule المطلوبة

### بعد فتح صفحة Custom Rules:

1. **اضغط:** `Create rule` أو `Add rule`

2. **املأ:**
   - **Rule name:** `Allow MCP Endpoint`
   - **Expression:** `(http.request.uri.path eq "/api/mcp")`
   - **Action:** `Skip` (تخطي جميع WAF rules)

3. **Deploy**

---

## 🔍 مسار القوائم في Dashboard

```
Cloudflare Dashboard
└── Domain: zien-ai.app
    └── Security
        └── WAF
            └── Custom Rules ← هنا
                └── Create rule ← اضغط هنا
```

---

## 📝 Expression الصحيحة

```
(http.request.uri.path eq "/api/mcp")
```

أو إذا أردت مطابقة جميع المسارات الفرعية:

```
(http.request.uri.path starts_with "/api/mcp")
```

---

## ✅ Checklist

- [ ] فتح Cloudflare Dashboard
- [ ] اختيار Domain: `zien-ai.app`
- [ ] Security → WAF → Custom Rules
- [ ] Create rule
- [ ] Rule name: `Allow MCP Endpoint`
- [ ] Expression: `(http.request.uri.path eq "/api/mcp")`
- [ ] Action: `Skip`
- [ ] Deploy
- [ ] انتظار 1-2 دقيقة
- [ ] اختبار الـ endpoint

---

## 🧪 اختبار بعد الإضافة

```bash
curl -I https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
HTTP/2 200
Content-Type: text/event-stream
```

بدلاً من:
```
HTTP/2 403
```

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ روابط مباشرة

## روابط سريعة لإضافة Rule للـ MCP Endpoint

---

## 🔗 الروابط المباشرة

### 1. رابط مباشر لـ WAF Custom Rules:
```
https://dash.cloudflare.com/?to=/:account/:zone/security/waf/custom-rules
```

### 2. رابط مباشر لإنشاء Rule جديد:
```
https://dash.cloudflare.com/?to=/:account/:zone/security/waf/custom-rules/new
```

---

## 📋 الخطوات مع الروابط

### الطريقة 1: استخدام الرابط المباشر

1. **افتح الرابط:**
   ```
   https://dash.cloudflare.com
   ```

2. **اختر Domain:** `zien-ai.app`

3. **اذهب مباشرة إلى:**
   - **Security** → **WAF** → **Custom Rules**
   - أو استخدم الرابط المباشر بعد اختيار Domain

---

## 🎯 إعدادات Rule المطلوبة

### بعد فتح صفحة Custom Rules:

1. **اضغط:** `Create rule` أو `Add rule`

2. **املأ:**
   - **Rule name:** `Allow MCP Endpoint`
   - **Expression:** `(http.request.uri.path eq "/api/mcp")`
   - **Action:** `Skip` (تخطي جميع WAF rules)

3. **Deploy**

---

## 🔍 مسار القوائم في Dashboard

```
Cloudflare Dashboard
└── Domain: zien-ai.app
    └── Security
        └── WAF
            └── Custom Rules ← هنا
                └── Create rule ← اضغط هنا
```

---

## 📝 Expression الصحيحة

```
(http.request.uri.path eq "/api/mcp")
```

أو إذا أردت مطابقة جميع المسارات الفرعية:

```
(http.request.uri.path starts_with "/api/mcp")
```

---

## ✅ Checklist

- [ ] فتح Cloudflare Dashboard
- [ ] اختيار Domain: `zien-ai.app`
- [ ] Security → WAF → Custom Rules
- [ ] Create rule
- [ ] Rule name: `Allow MCP Endpoint`
- [ ] Expression: `(http.request.uri.path eq "/api/mcp")`
- [ ] Action: `Skip`
- [ ] Deploy
- [ ] انتظار 1-2 دقيقة
- [ ] اختبار الـ endpoint

---

## 🧪 اختبار بعد الإضافة

```bash
curl -I https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
HTTP/2 200
Content-Type: text/event-stream
```

بدلاً من:
```
HTTP/2 403
```

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ روابط مباشرة

## روابط سريعة لإضافة Rule للـ MCP Endpoint

---

## 🔗 الروابط المباشرة

### 1. رابط مباشر لـ WAF Custom Rules:
```
https://dash.cloudflare.com/?to=/:account/:zone/security/waf/custom-rules
```

### 2. رابط مباشر لإنشاء Rule جديد:
```
https://dash.cloudflare.com/?to=/:account/:zone/security/waf/custom-rules/new
```

---

## 📋 الخطوات مع الروابط

### الطريقة 1: استخدام الرابط المباشر

1. **افتح الرابط:**
   ```
   https://dash.cloudflare.com
   ```

2. **اختر Domain:** `zien-ai.app`

3. **اذهب مباشرة إلى:**
   - **Security** → **WAF** → **Custom Rules**
   - أو استخدم الرابط المباشر بعد اختيار Domain

---

## 🎯 إعدادات Rule المطلوبة

### بعد فتح صفحة Custom Rules:

1. **اضغط:** `Create rule` أو `Add rule`

2. **املأ:**
   - **Rule name:** `Allow MCP Endpoint`
   - **Expression:** `(http.request.uri.path eq "/api/mcp")`
   - **Action:** `Skip` (تخطي جميع WAF rules)

3. **Deploy**

---

## 🔍 مسار القوائم في Dashboard

```
Cloudflare Dashboard
└── Domain: zien-ai.app
    └── Security
        └── WAF
            └── Custom Rules ← هنا
                └── Create rule ← اضغط هنا
```

---

## 📝 Expression الصحيحة

```
(http.request.uri.path eq "/api/mcp")
```

أو إذا أردت مطابقة جميع المسارات الفرعية:

```
(http.request.uri.path starts_with "/api/mcp")
```

---

## ✅ Checklist

- [ ] فتح Cloudflare Dashboard
- [ ] اختيار Domain: `zien-ai.app`
- [ ] Security → WAF → Custom Rules
- [ ] Create rule
- [ ] Rule name: `Allow MCP Endpoint`
- [ ] Expression: `(http.request.uri.path eq "/api/mcp")`
- [ ] Action: `Skip`
- [ ] Deploy
- [ ] انتظار 1-2 دقيقة
- [ ] اختبار الـ endpoint

---

## 🧪 اختبار بعد الإضافة

```bash
curl -I https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
HTTP/2 200
Content-Type: text/event-stream
```

بدلاً من:
```
HTTP/2 403
```

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ روابط مباشرة

## روابط سريعة لإضافة Rule للـ MCP Endpoint

---

## 🔗 الروابط المباشرة

### 1. رابط مباشر لـ WAF Custom Rules:
```
https://dash.cloudflare.com/?to=/:account/:zone/security/waf/custom-rules
```

### 2. رابط مباشر لإنشاء Rule جديد:
```
https://dash.cloudflare.com/?to=/:account/:zone/security/waf/custom-rules/new
```

---

## 📋 الخطوات مع الروابط

### الطريقة 1: استخدام الرابط المباشر

1. **افتح الرابط:**
   ```
   https://dash.cloudflare.com
   ```

2. **اختر Domain:** `zien-ai.app`

3. **اذهب مباشرة إلى:**
   - **Security** → **WAF** → **Custom Rules**
   - أو استخدم الرابط المباشر بعد اختيار Domain

---

## 🎯 إعدادات Rule المطلوبة

### بعد فتح صفحة Custom Rules:

1. **اضغط:** `Create rule` أو `Add rule`

2. **املأ:**
   - **Rule name:** `Allow MCP Endpoint`
   - **Expression:** `(http.request.uri.path eq "/api/mcp")`
   - **Action:** `Skip` (تخطي جميع WAF rules)

3. **Deploy**

---

## 🔍 مسار القوائم في Dashboard

```
Cloudflare Dashboard
└── Domain: zien-ai.app
    └── Security
        └── WAF
            └── Custom Rules ← هنا
                └── Create rule ← اضغط هنا
```

---

## 📝 Expression الصحيحة

```
(http.request.uri.path eq "/api/mcp")
```

أو إذا أردت مطابقة جميع المسارات الفرعية:

```
(http.request.uri.path starts_with "/api/mcp")
```

---

## ✅ Checklist

- [ ] فتح Cloudflare Dashboard
- [ ] اختيار Domain: `zien-ai.app`
- [ ] Security → WAF → Custom Rules
- [ ] Create rule
- [ ] Rule name: `Allow MCP Endpoint`
- [ ] Expression: `(http.request.uri.path eq "/api/mcp")`
- [ ] Action: `Skip`
- [ ] Deploy
- [ ] انتظار 1-2 دقيقة
- [ ] اختبار الـ endpoint

---

## 🧪 اختبار بعد الإضافة

```bash
curl -I https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
HTTP/2 200
Content-Type: text/event-stream
```

بدلاً من:
```
HTTP/2 403
```

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ روابط مباشرة

## روابط سريعة لإضافة Rule للـ MCP Endpoint

---

## 🔗 الروابط المباشرة

### 1. رابط مباشر لـ WAF Custom Rules:
```
https://dash.cloudflare.com/?to=/:account/:zone/security/waf/custom-rules
```

### 2. رابط مباشر لإنشاء Rule جديد:
```
https://dash.cloudflare.com/?to=/:account/:zone/security/waf/custom-rules/new
```

---

## 📋 الخطوات مع الروابط

### الطريقة 1: استخدام الرابط المباشر

1. **افتح الرابط:**
   ```
   https://dash.cloudflare.com
   ```

2. **اختر Domain:** `zien-ai.app`

3. **اذهب مباشرة إلى:**
   - **Security** → **WAF** → **Custom Rules**
   - أو استخدم الرابط المباشر بعد اختيار Domain

---

## 🎯 إعدادات Rule المطلوبة

### بعد فتح صفحة Custom Rules:

1. **اضغط:** `Create rule` أو `Add rule`

2. **املأ:**
   - **Rule name:** `Allow MCP Endpoint`
   - **Expression:** `(http.request.uri.path eq "/api/mcp")`
   - **Action:** `Skip` (تخطي جميع WAF rules)

3. **Deploy**

---

## 🔍 مسار القوائم في Dashboard

```
Cloudflare Dashboard
└── Domain: zien-ai.app
    └── Security
        └── WAF
            └── Custom Rules ← هنا
                └── Create rule ← اضغط هنا
```

---

## 📝 Expression الصحيحة

```
(http.request.uri.path eq "/api/mcp")
```

أو إذا أردت مطابقة جميع المسارات الفرعية:

```
(http.request.uri.path starts_with "/api/mcp")
```

---

## ✅ Checklist

- [ ] فتح Cloudflare Dashboard
- [ ] اختيار Domain: `zien-ai.app`
- [ ] Security → WAF → Custom Rules
- [ ] Create rule
- [ ] Rule name: `Allow MCP Endpoint`
- [ ] Expression: `(http.request.uri.path eq "/api/mcp")`
- [ ] Action: `Skip`
- [ ] Deploy
- [ ] انتظار 1-2 دقيقة
- [ ] اختبار الـ endpoint

---

## 🧪 اختبار بعد الإضافة

```bash
curl -I https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
HTTP/2 200
Content-Type: text/event-stream
```

بدلاً من:
```
HTTP/2 403
```

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ روابط مباشرة

## روابط سريعة لإضافة Rule للـ MCP Endpoint

---

## 🔗 الروابط المباشرة

### 1. رابط مباشر لـ WAF Custom Rules:
```
https://dash.cloudflare.com/?to=/:account/:zone/security/waf/custom-rules
```

### 2. رابط مباشر لإنشاء Rule جديد:
```
https://dash.cloudflare.com/?to=/:account/:zone/security/waf/custom-rules/new
```

---

## 📋 الخطوات مع الروابط

### الطريقة 1: استخدام الرابط المباشر

1. **افتح الرابط:**
   ```
   https://dash.cloudflare.com
   ```

2. **اختر Domain:** `zien-ai.app`

3. **اذهب مباشرة إلى:**
   - **Security** → **WAF** → **Custom Rules**
   - أو استخدم الرابط المباشر بعد اختيار Domain

---

## 🎯 إعدادات Rule المطلوبة

### بعد فتح صفحة Custom Rules:

1. **اضغط:** `Create rule` أو `Add rule`

2. **املأ:**
   - **Rule name:** `Allow MCP Endpoint`
   - **Expression:** `(http.request.uri.path eq "/api/mcp")`
   - **Action:** `Skip` (تخطي جميع WAF rules)

3. **Deploy**

---

## 🔍 مسار القوائم في Dashboard

```
Cloudflare Dashboard
└── Domain: zien-ai.app
    └── Security
        └── WAF
            └── Custom Rules ← هنا
                └── Create rule ← اضغط هنا
```

---

## 📝 Expression الصحيحة

```
(http.request.uri.path eq "/api/mcp")
```

أو إذا أردت مطابقة جميع المسارات الفرعية:

```
(http.request.uri.path starts_with "/api/mcp")
```

---

## ✅ Checklist

- [ ] فتح Cloudflare Dashboard
- [ ] اختيار Domain: `zien-ai.app`
- [ ] Security → WAF → Custom Rules
- [ ] Create rule
- [ ] Rule name: `Allow MCP Endpoint`
- [ ] Expression: `(http.request.uri.path eq "/api/mcp")`
- [ ] Action: `Skip`
- [ ] Deploy
- [ ] انتظار 1-2 دقيقة
- [ ] اختبار الـ endpoint

---

## 🧪 اختبار بعد الإضافة

```bash
curl -I https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
HTTP/2 200
Content-Type: text/event-stream
```

بدلاً من:
```
HTTP/2 403
```

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ روابط مباشرة

