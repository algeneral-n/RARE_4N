# حل مشكلة 403 Forbidden في MCP Endpoint - Cloudflare

## المشكلة
```
403 Forbidden عند الوصول إلى https://api.zien-ai.app/api/mcp
```

## الحلول

### 1. إضافة Cloudflare Rule للسماح بـ MCP Endpoint

#### في Cloudflare Dashboard:
1. اذهب إلى **Rules** → **WAF** → **Custom Rules**
2. أنشئ Rule جديد:
   - **Rule name:** `Allow MCP Endpoint`
   - **Expression:** `(http.request.uri.path eq "/api/mcp")`
   - **Action:** `Skip` (تخطي جميع WAF rules)

#### أو في Cloudflare Dashboard → Rules → Page Rules:
1. أنشئ Page Rule:
   - **URL:** `api.zien-ai.app/api/mcp*`
   - **Settings:**
     - Security Level: Off
     - Cache Level: Bypass
     - Disable Security

---

### 2. إضافة Cloudflare Transform Rule

#### في Cloudflare Dashboard → Rules → Transform Rules:
1. أنشئ Transform Rule:
   - **Rule name:** `MCP Endpoint Headers`
   - **When:** `(http.request.uri.path eq "/api/mcp")`
   - **Then:**
     - Set static: `Access-Control-Allow-Origin` = `*`
     - Set static: `Access-Control-Allow-Methods` = `GET, POST, OPTIONS`
     - Set static: `Access-Control-Allow-Headers` = `Content-Type, Authorization, Cache-Control`

---

### 3. إضافة إلى Cloudflare Workers (إذا كان متاح)

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Allow MCP endpoint
  if (url.pathname === '/api/mcp') {
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control');
    return newResponse;
  }
  
  return fetch(request);
}
```

---

### 4. التحقق من Cloudflare Firewall Rules

#### في Cloudflare Dashboard → Security → WAF:
1. تحقق من **Custom Rules**
2. تأكد من عدم وجود Rule يحجب `/api/mcp`
3. إذا كان موجود، أضف exception:
   - **Expression:** `(http.request.uri.path ne "/api/mcp")`

---

### 5. اختبار من Cloudflare Dashboard

#### في Cloudflare Dashboard → Analytics → Security Events:
1. ابحث عن events للـ `/api/mcp`
2. تحقق من سبب الحجب (WAF, Firewall, Rate Limiting)
3. أضف exception حسب النوع

---

## ✅ الحل السريع (موصى به)

### في Cloudflare Dashboard:
1. **Security** → **WAF** → **Custom Rules**
2. **Create rule:**
   ```
   Rule name: Allow MCP Endpoint
   Expression: (http.request.uri.path eq "/api/mcp")
   Action: Skip (all WAF rules)
   ```
3. **Save**

---

## 🔍 التحقق

بعد إضافة Rule:
```bash
curl -I https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
HTTP/2 200
Content-Type: text/event-stream
Access-Control-Allow-Origin: *
```

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ جاهز للاستخدام


## المشكلة
```
403 Forbidden عند الوصول إلى https://api.zien-ai.app/api/mcp
```

## الحلول

### 1. إضافة Cloudflare Rule للسماح بـ MCP Endpoint

#### في Cloudflare Dashboard:
1. اذهب إلى **Rules** → **WAF** → **Custom Rules**
2. أنشئ Rule جديد:
   - **Rule name:** `Allow MCP Endpoint`
   - **Expression:** `(http.request.uri.path eq "/api/mcp")`
   - **Action:** `Skip` (تخطي جميع WAF rules)

#### أو في Cloudflare Dashboard → Rules → Page Rules:
1. أنشئ Page Rule:
   - **URL:** `api.zien-ai.app/api/mcp*`
   - **Settings:**
     - Security Level: Off
     - Cache Level: Bypass
     - Disable Security

---

### 2. إضافة Cloudflare Transform Rule

#### في Cloudflare Dashboard → Rules → Transform Rules:
1. أنشئ Transform Rule:
   - **Rule name:** `MCP Endpoint Headers`
   - **When:** `(http.request.uri.path eq "/api/mcp")`
   - **Then:**
     - Set static: `Access-Control-Allow-Origin` = `*`
     - Set static: `Access-Control-Allow-Methods` = `GET, POST, OPTIONS`
     - Set static: `Access-Control-Allow-Headers` = `Content-Type, Authorization, Cache-Control`

---

### 3. إضافة إلى Cloudflare Workers (إذا كان متاح)

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Allow MCP endpoint
  if (url.pathname === '/api/mcp') {
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control');
    return newResponse;
  }
  
  return fetch(request);
}
```

---

### 4. التحقق من Cloudflare Firewall Rules

#### في Cloudflare Dashboard → Security → WAF:
1. تحقق من **Custom Rules**
2. تأكد من عدم وجود Rule يحجب `/api/mcp`
3. إذا كان موجود، أضف exception:
   - **Expression:** `(http.request.uri.path ne "/api/mcp")`

---

### 5. اختبار من Cloudflare Dashboard

#### في Cloudflare Dashboard → Analytics → Security Events:
1. ابحث عن events للـ `/api/mcp`
2. تحقق من سبب الحجب (WAF, Firewall, Rate Limiting)
3. أضف exception حسب النوع

---

## ✅ الحل السريع (موصى به)

### في Cloudflare Dashboard:
1. **Security** → **WAF** → **Custom Rules**
2. **Create rule:**
   ```
   Rule name: Allow MCP Endpoint
   Expression: (http.request.uri.path eq "/api/mcp")
   Action: Skip (all WAF rules)
   ```
3. **Save**

---

## 🔍 التحقق

بعد إضافة Rule:
```bash
curl -I https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
HTTP/2 200
Content-Type: text/event-stream
Access-Control-Allow-Origin: *
```

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ جاهز للاستخدام


## المشكلة
```
403 Forbidden عند الوصول إلى https://api.zien-ai.app/api/mcp
```

## الحلول

### 1. إضافة Cloudflare Rule للسماح بـ MCP Endpoint

#### في Cloudflare Dashboard:
1. اذهب إلى **Rules** → **WAF** → **Custom Rules**
2. أنشئ Rule جديد:
   - **Rule name:** `Allow MCP Endpoint`
   - **Expression:** `(http.request.uri.path eq "/api/mcp")`
   - **Action:** `Skip` (تخطي جميع WAF rules)

#### أو في Cloudflare Dashboard → Rules → Page Rules:
1. أنشئ Page Rule:
   - **URL:** `api.zien-ai.app/api/mcp*`
   - **Settings:**
     - Security Level: Off
     - Cache Level: Bypass
     - Disable Security

---

### 2. إضافة Cloudflare Transform Rule

#### في Cloudflare Dashboard → Rules → Transform Rules:
1. أنشئ Transform Rule:
   - **Rule name:** `MCP Endpoint Headers`
   - **When:** `(http.request.uri.path eq "/api/mcp")`
   - **Then:**
     - Set static: `Access-Control-Allow-Origin` = `*`
     - Set static: `Access-Control-Allow-Methods` = `GET, POST, OPTIONS`
     - Set static: `Access-Control-Allow-Headers` = `Content-Type, Authorization, Cache-Control`

---

### 3. إضافة إلى Cloudflare Workers (إذا كان متاح)

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Allow MCP endpoint
  if (url.pathname === '/api/mcp') {
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control');
    return newResponse;
  }
  
  return fetch(request);
}
```

---

### 4. التحقق من Cloudflare Firewall Rules

#### في Cloudflare Dashboard → Security → WAF:
1. تحقق من **Custom Rules**
2. تأكد من عدم وجود Rule يحجب `/api/mcp`
3. إذا كان موجود، أضف exception:
   - **Expression:** `(http.request.uri.path ne "/api/mcp")`

---

### 5. اختبار من Cloudflare Dashboard

#### في Cloudflare Dashboard → Analytics → Security Events:
1. ابحث عن events للـ `/api/mcp`
2. تحقق من سبب الحجب (WAF, Firewall, Rate Limiting)
3. أضف exception حسب النوع

---

## ✅ الحل السريع (موصى به)

### في Cloudflare Dashboard:
1. **Security** → **WAF** → **Custom Rules**
2. **Create rule:**
   ```
   Rule name: Allow MCP Endpoint
   Expression: (http.request.uri.path eq "/api/mcp")
   Action: Skip (all WAF rules)
   ```
3. **Save**

---

## 🔍 التحقق

بعد إضافة Rule:
```bash
curl -I https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
HTTP/2 200
Content-Type: text/event-stream
Access-Control-Allow-Origin: *
```

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ جاهز للاستخدام


## المشكلة
```
403 Forbidden عند الوصول إلى https://api.zien-ai.app/api/mcp
```

## الحلول

### 1. إضافة Cloudflare Rule للسماح بـ MCP Endpoint

#### في Cloudflare Dashboard:
1. اذهب إلى **Rules** → **WAF** → **Custom Rules**
2. أنشئ Rule جديد:
   - **Rule name:** `Allow MCP Endpoint`
   - **Expression:** `(http.request.uri.path eq "/api/mcp")`
   - **Action:** `Skip` (تخطي جميع WAF rules)

#### أو في Cloudflare Dashboard → Rules → Page Rules:
1. أنشئ Page Rule:
   - **URL:** `api.zien-ai.app/api/mcp*`
   - **Settings:**
     - Security Level: Off
     - Cache Level: Bypass
     - Disable Security

---

### 2. إضافة Cloudflare Transform Rule

#### في Cloudflare Dashboard → Rules → Transform Rules:
1. أنشئ Transform Rule:
   - **Rule name:** `MCP Endpoint Headers`
   - **When:** `(http.request.uri.path eq "/api/mcp")`
   - **Then:**
     - Set static: `Access-Control-Allow-Origin` = `*`
     - Set static: `Access-Control-Allow-Methods` = `GET, POST, OPTIONS`
     - Set static: `Access-Control-Allow-Headers` = `Content-Type, Authorization, Cache-Control`

---

### 3. إضافة إلى Cloudflare Workers (إذا كان متاح)

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Allow MCP endpoint
  if (url.pathname === '/api/mcp') {
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control');
    return newResponse;
  }
  
  return fetch(request);
}
```

---

### 4. التحقق من Cloudflare Firewall Rules

#### في Cloudflare Dashboard → Security → WAF:
1. تحقق من **Custom Rules**
2. تأكد من عدم وجود Rule يحجب `/api/mcp`
3. إذا كان موجود، أضف exception:
   - **Expression:** `(http.request.uri.path ne "/api/mcp")`

---

### 5. اختبار من Cloudflare Dashboard

#### في Cloudflare Dashboard → Analytics → Security Events:
1. ابحث عن events للـ `/api/mcp`
2. تحقق من سبب الحجب (WAF, Firewall, Rate Limiting)
3. أضف exception حسب النوع

---

## ✅ الحل السريع (موصى به)

### في Cloudflare Dashboard:
1. **Security** → **WAF** → **Custom Rules**
2. **Create rule:**
   ```
   Rule name: Allow MCP Endpoint
   Expression: (http.request.uri.path eq "/api/mcp")
   Action: Skip (all WAF rules)
   ```
3. **Save**

---

## 🔍 التحقق

بعد إضافة Rule:
```bash
curl -I https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
HTTP/2 200
Content-Type: text/event-stream
Access-Control-Allow-Origin: *
```

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ جاهز للاستخدام


## المشكلة
```
403 Forbidden عند الوصول إلى https://api.zien-ai.app/api/mcp
```

## الحلول

### 1. إضافة Cloudflare Rule للسماح بـ MCP Endpoint

#### في Cloudflare Dashboard:
1. اذهب إلى **Rules** → **WAF** → **Custom Rules**
2. أنشئ Rule جديد:
   - **Rule name:** `Allow MCP Endpoint`
   - **Expression:** `(http.request.uri.path eq "/api/mcp")`
   - **Action:** `Skip` (تخطي جميع WAF rules)

#### أو في Cloudflare Dashboard → Rules → Page Rules:
1. أنشئ Page Rule:
   - **URL:** `api.zien-ai.app/api/mcp*`
   - **Settings:**
     - Security Level: Off
     - Cache Level: Bypass
     - Disable Security

---

### 2. إضافة Cloudflare Transform Rule

#### في Cloudflare Dashboard → Rules → Transform Rules:
1. أنشئ Transform Rule:
   - **Rule name:** `MCP Endpoint Headers`
   - **When:** `(http.request.uri.path eq "/api/mcp")`
   - **Then:**
     - Set static: `Access-Control-Allow-Origin` = `*`
     - Set static: `Access-Control-Allow-Methods` = `GET, POST, OPTIONS`
     - Set static: `Access-Control-Allow-Headers` = `Content-Type, Authorization, Cache-Control`

---

### 3. إضافة إلى Cloudflare Workers (إذا كان متاح)

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Allow MCP endpoint
  if (url.pathname === '/api/mcp') {
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control');
    return newResponse;
  }
  
  return fetch(request);
}
```

---

### 4. التحقق من Cloudflare Firewall Rules

#### في Cloudflare Dashboard → Security → WAF:
1. تحقق من **Custom Rules**
2. تأكد من عدم وجود Rule يحجب `/api/mcp`
3. إذا كان موجود، أضف exception:
   - **Expression:** `(http.request.uri.path ne "/api/mcp")`

---

### 5. اختبار من Cloudflare Dashboard

#### في Cloudflare Dashboard → Analytics → Security Events:
1. ابحث عن events للـ `/api/mcp`
2. تحقق من سبب الحجب (WAF, Firewall, Rate Limiting)
3. أضف exception حسب النوع

---

## ✅ الحل السريع (موصى به)

### في Cloudflare Dashboard:
1. **Security** → **WAF** → **Custom Rules**
2. **Create rule:**
   ```
   Rule name: Allow MCP Endpoint
   Expression: (http.request.uri.path eq "/api/mcp")
   Action: Skip (all WAF rules)
   ```
3. **Save**

---

## 🔍 التحقق

بعد إضافة Rule:
```bash
curl -I https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
HTTP/2 200
Content-Type: text/event-stream
Access-Control-Allow-Origin: *
```

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ جاهز للاستخدام


## المشكلة
```
403 Forbidden عند الوصول إلى https://api.zien-ai.app/api/mcp
```

## الحلول

### 1. إضافة Cloudflare Rule للسماح بـ MCP Endpoint

#### في Cloudflare Dashboard:
1. اذهب إلى **Rules** → **WAF** → **Custom Rules**
2. أنشئ Rule جديد:
   - **Rule name:** `Allow MCP Endpoint`
   - **Expression:** `(http.request.uri.path eq "/api/mcp")`
   - **Action:** `Skip` (تخطي جميع WAF rules)

#### أو في Cloudflare Dashboard → Rules → Page Rules:
1. أنشئ Page Rule:
   - **URL:** `api.zien-ai.app/api/mcp*`
   - **Settings:**
     - Security Level: Off
     - Cache Level: Bypass
     - Disable Security

---

### 2. إضافة Cloudflare Transform Rule

#### في Cloudflare Dashboard → Rules → Transform Rules:
1. أنشئ Transform Rule:
   - **Rule name:** `MCP Endpoint Headers`
   - **When:** `(http.request.uri.path eq "/api/mcp")`
   - **Then:**
     - Set static: `Access-Control-Allow-Origin` = `*`
     - Set static: `Access-Control-Allow-Methods` = `GET, POST, OPTIONS`
     - Set static: `Access-Control-Allow-Headers` = `Content-Type, Authorization, Cache-Control`

---

### 3. إضافة إلى Cloudflare Workers (إذا كان متاح)

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Allow MCP endpoint
  if (url.pathname === '/api/mcp') {
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control');
    return newResponse;
  }
  
  return fetch(request);
}
```

---

### 4. التحقق من Cloudflare Firewall Rules

#### في Cloudflare Dashboard → Security → WAF:
1. تحقق من **Custom Rules**
2. تأكد من عدم وجود Rule يحجب `/api/mcp`
3. إذا كان موجود، أضف exception:
   - **Expression:** `(http.request.uri.path ne "/api/mcp")`

---

### 5. اختبار من Cloudflare Dashboard

#### في Cloudflare Dashboard → Analytics → Security Events:
1. ابحث عن events للـ `/api/mcp`
2. تحقق من سبب الحجب (WAF, Firewall, Rate Limiting)
3. أضف exception حسب النوع

---

## ✅ الحل السريع (موصى به)

### في Cloudflare Dashboard:
1. **Security** → **WAF** → **Custom Rules**
2. **Create rule:**
   ```
   Rule name: Allow MCP Endpoint
   Expression: (http.request.uri.path eq "/api/mcp")
   Action: Skip (all WAF rules)
   ```
3. **Save**

---

## 🔍 التحقق

بعد إضافة Rule:
```bash
curl -I https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
HTTP/2 200
Content-Type: text/event-stream
Access-Control-Allow-Origin: *
```

---

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ جاهز للاستخدام

