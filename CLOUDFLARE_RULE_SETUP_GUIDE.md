# دليل إضافة Cloudflare Rule للسماح بـ MCP Endpoint
## خطوة بخطوة مع الصور التوضيحية

---

## 🎯 الهدف
إضافة Rule في Cloudflare للسماح بالوصول إلى `/api/mcp` بدون حجب (403 Forbidden)

---

## 📋 الطريقة 1: WAF Custom Rules (موصى به)

### الخطوة 1: الدخول إلى Cloudflare Dashboard
1. اذهب إلى: https://dash.cloudflare.com
2. اختر **Domain:** `zien-ai.app`
3. من القائمة الجانبية، اختر: **Security** → **WAF**

### الخطوة 2: إنشاء Custom Rule
1. في صفحة **WAF**، ابحث عن **Custom Rules**
2. اضغط على **Create rule** أو **Add rule**

### الخطوة 3: إعداد Rule
#### أ. Rule Name (اسم القاعدة):
```
Allow MCP Endpoint
```

#### ب. Expression (التعبير):
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Action (الإجراء):
- اختر: **Skip** (تخطي)
- أو: **Allow** (السماح)

#### د. Save (حفظ):
- اضغط **Deploy** أو **Save**

---

## 📋 الطريقة 2: Page Rules (أسهل)

### الخطوة 1: الدخول إلى Page Rules
1. في Cloudflare Dashboard
2. اختر: **Rules** → **Page Rules**
3. اضغط **Create Page Rule**

### الخطوة 2: إعداد Page Rule
#### أ. URL Pattern:
```
api.zien-ai.app/api/mcp*
```

#### ب. Settings (الإعدادات):
1. **Security Level:** `Off` (إيقاف)
2. **Cache Level:** `Bypass` (تخطي)
3. **Disable Security:** `On` (تفعيل)

#### ج. Save and Deploy:
- اضغط **Save and Deploy**

---

## 📋 الطريقة 3: Transform Rules (لإضافة Headers)

### الخطوة 1: الدخول إلى Transform Rules
1. في Cloudflare Dashboard
2. اختر: **Rules** → **Transform Rules** → **Modify Request Header**
3. اضغط **Create rule**

### الخطوة 2: إعداد Transform Rule
#### أ. Rule Name:
```
MCP Endpoint CORS Headers
```

#### ب. When incoming requests match:
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Then:
- **Set static:** `Access-Control-Allow-Origin` = `*`
- **Set static:** `Access-Control-Allow-Methods` = `GET, POST, OPTIONS`
- **Set static:** `Access-Control-Allow-Headers` = `Content-Type, Authorization, Cache-Control`

#### د. Deploy:
- اضغط **Deploy**

---

## 📋 الطريقة 4: Firewall Rules (للتأكد من عدم الحجب)

### الخطوة 1: الدخول إلى Firewall Rules
1. في Cloudflare Dashboard
2. اختر: **Security** → **WAF** → **Custom Rules**
3. أو: **Security** → **Firewall Rules**

### الخطوة 2: إنشاء Exception Rule
#### أ. Rule Name:
```
Allow MCP Endpoint Exception
```

#### ب. Expression:
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Action:
- **Allow** (السماح)
- أو **Skip** (تخطي جميع Rules)

---

## ✅ الطريقة الموصى بها (الأسهل)

### استخدم **Page Rules**:

1. **Rules** → **Page Rules** → **Create Page Rule**
2. **URL:** `api.zien-ai.app/api/mcp*`
3. **Settings:**
   - ✅ Security Level: **Off**
   - ✅ Cache Level: **Bypass**
   - ✅ Disable Security: **On**
4. **Save and Deploy**

---

## 🔍 التحقق من Rule

### بعد إضافة Rule:
1. انتظر 1-2 دقيقة (لنشر التغييرات)
2. اختبر الـ endpoint:
   ```bash
   curl -I https://api.zien-ai.app/api/mcp
   ```
3. يجب أن ترى:
   ```
   HTTP/2 200
   Content-Type: text/event-stream
   ```

---

## 📸 مسار القوائم في Cloudflare Dashboard

```
Cloudflare Dashboard
├── Domain: zien-ai.app
│   ├── Security
│   │   ├── WAF
│   │   │   └── Custom Rules ← هنا (الطريقة 1)
│   │   └── Firewall Rules ← هنا (الطريقة 4)
│   └── Rules
│       ├── Page Rules ← هنا (الطريقة 2 - الأسهل)
│       └── Transform Rules ← هنا (الطريقة 3)
```

---

## ⚠️ ملاحظات مهمة

1. **ترتيب Rules:** Rules تعمل بالترتيب (من الأعلى للأسفل)
2. **Deploy:** تأكد من الضغط على **Deploy** أو **Save**
3. **الانتظار:** قد يستغرق نشر التغييرات 1-2 دقيقة
4. **الاختبار:** اختبر بعد إضافة Rule مباشرة

---

## 🆘 إذا استمرت المشكلة

### 1. تحقق من Analytics:
- **Analytics** → **Security Events**
- ابحث عن events للـ `/api/mcp`
- تحقق من سبب الحجب

### 2. تحقق من Rate Limiting:
- **Security** → **WAF** → **Rate Limiting Rules**
- تأكد من عدم وجود Rule يحجب `/api/mcp`

### 3. تحقق من IP Access Rules:
- **Security** → **WAF** → **Tools** → **IP Access Rules**
- تأكد من عدم حجب IP الخاص بك

---

## 📝 مثال كامل لـ Custom Rule

```json
{
  "name": "Allow MCP Endpoint",
  "expression": "(http.request.uri.path eq \"/api/mcp\")",
  "action": "skip",
  "enabled": true
}
```

---

## ✅ Checklist

- [ ] دخول Cloudflare Dashboard
- [ ] اختيار Domain: `zien-ai.app`
- [ ] إنشاء Rule (Page Rule أو Custom Rule)
- [ ] إدخال URL/Expression: `/api/mcp`
- [ ] تعيين Action: `Skip` أو `Allow`
- [ ] حفظ Rule (Deploy)
- [ ] انتظار 1-2 دقيقة
- [ ] اختبار الـ endpoint
- [ ] التحقق من نجاح الاتصال

---

**تاريخ الإنشاء:** 2026-01-06  
**آخر تحديث:** 2026-01-06  
**الحالة:** ✅ جاهز للاستخدام

## خطوة بخطوة مع الصور التوضيحية

---

## 🎯 الهدف
إضافة Rule في Cloudflare للسماح بالوصول إلى `/api/mcp` بدون حجب (403 Forbidden)

---

## 📋 الطريقة 1: WAF Custom Rules (موصى به)

### الخطوة 1: الدخول إلى Cloudflare Dashboard
1. اذهب إلى: https://dash.cloudflare.com
2. اختر **Domain:** `zien-ai.app`
3. من القائمة الجانبية، اختر: **Security** → **WAF**

### الخطوة 2: إنشاء Custom Rule
1. في صفحة **WAF**، ابحث عن **Custom Rules**
2. اضغط على **Create rule** أو **Add rule**

### الخطوة 3: إعداد Rule
#### أ. Rule Name (اسم القاعدة):
```
Allow MCP Endpoint
```

#### ب. Expression (التعبير):
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Action (الإجراء):
- اختر: **Skip** (تخطي)
- أو: **Allow** (السماح)

#### د. Save (حفظ):
- اضغط **Deploy** أو **Save**

---

## 📋 الطريقة 2: Page Rules (أسهل)

### الخطوة 1: الدخول إلى Page Rules
1. في Cloudflare Dashboard
2. اختر: **Rules** → **Page Rules**
3. اضغط **Create Page Rule**

### الخطوة 2: إعداد Page Rule
#### أ. URL Pattern:
```
api.zien-ai.app/api/mcp*
```

#### ب. Settings (الإعدادات):
1. **Security Level:** `Off` (إيقاف)
2. **Cache Level:** `Bypass` (تخطي)
3. **Disable Security:** `On` (تفعيل)

#### ج. Save and Deploy:
- اضغط **Save and Deploy**

---

## 📋 الطريقة 3: Transform Rules (لإضافة Headers)

### الخطوة 1: الدخول إلى Transform Rules
1. في Cloudflare Dashboard
2. اختر: **Rules** → **Transform Rules** → **Modify Request Header**
3. اضغط **Create rule**

### الخطوة 2: إعداد Transform Rule
#### أ. Rule Name:
```
MCP Endpoint CORS Headers
```

#### ب. When incoming requests match:
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Then:
- **Set static:** `Access-Control-Allow-Origin` = `*`
- **Set static:** `Access-Control-Allow-Methods` = `GET, POST, OPTIONS`
- **Set static:** `Access-Control-Allow-Headers` = `Content-Type, Authorization, Cache-Control`

#### د. Deploy:
- اضغط **Deploy**

---

## 📋 الطريقة 4: Firewall Rules (للتأكد من عدم الحجب)

### الخطوة 1: الدخول إلى Firewall Rules
1. في Cloudflare Dashboard
2. اختر: **Security** → **WAF** → **Custom Rules**
3. أو: **Security** → **Firewall Rules**

### الخطوة 2: إنشاء Exception Rule
#### أ. Rule Name:
```
Allow MCP Endpoint Exception
```

#### ب. Expression:
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Action:
- **Allow** (السماح)
- أو **Skip** (تخطي جميع Rules)

---

## ✅ الطريقة الموصى بها (الأسهل)

### استخدم **Page Rules**:

1. **Rules** → **Page Rules** → **Create Page Rule**
2. **URL:** `api.zien-ai.app/api/mcp*`
3. **Settings:**
   - ✅ Security Level: **Off**
   - ✅ Cache Level: **Bypass**
   - ✅ Disable Security: **On**
4. **Save and Deploy**

---

## 🔍 التحقق من Rule

### بعد إضافة Rule:
1. انتظر 1-2 دقيقة (لنشر التغييرات)
2. اختبر الـ endpoint:
   ```bash
   curl -I https://api.zien-ai.app/api/mcp
   ```
3. يجب أن ترى:
   ```
   HTTP/2 200
   Content-Type: text/event-stream
   ```

---

## 📸 مسار القوائم في Cloudflare Dashboard

```
Cloudflare Dashboard
├── Domain: zien-ai.app
│   ├── Security
│   │   ├── WAF
│   │   │   └── Custom Rules ← هنا (الطريقة 1)
│   │   └── Firewall Rules ← هنا (الطريقة 4)
│   └── Rules
│       ├── Page Rules ← هنا (الطريقة 2 - الأسهل)
│       └── Transform Rules ← هنا (الطريقة 3)
```

---

## ⚠️ ملاحظات مهمة

1. **ترتيب Rules:** Rules تعمل بالترتيب (من الأعلى للأسفل)
2. **Deploy:** تأكد من الضغط على **Deploy** أو **Save**
3. **الانتظار:** قد يستغرق نشر التغييرات 1-2 دقيقة
4. **الاختبار:** اختبر بعد إضافة Rule مباشرة

---

## 🆘 إذا استمرت المشكلة

### 1. تحقق من Analytics:
- **Analytics** → **Security Events**
- ابحث عن events للـ `/api/mcp`
- تحقق من سبب الحجب

### 2. تحقق من Rate Limiting:
- **Security** → **WAF** → **Rate Limiting Rules**
- تأكد من عدم وجود Rule يحجب `/api/mcp`

### 3. تحقق من IP Access Rules:
- **Security** → **WAF** → **Tools** → **IP Access Rules**
- تأكد من عدم حجب IP الخاص بك

---

## 📝 مثال كامل لـ Custom Rule

```json
{
  "name": "Allow MCP Endpoint",
  "expression": "(http.request.uri.path eq \"/api/mcp\")",
  "action": "skip",
  "enabled": true
}
```

---

## ✅ Checklist

- [ ] دخول Cloudflare Dashboard
- [ ] اختيار Domain: `zien-ai.app`
- [ ] إنشاء Rule (Page Rule أو Custom Rule)
- [ ] إدخال URL/Expression: `/api/mcp`
- [ ] تعيين Action: `Skip` أو `Allow`
- [ ] حفظ Rule (Deploy)
- [ ] انتظار 1-2 دقيقة
- [ ] اختبار الـ endpoint
- [ ] التحقق من نجاح الاتصال

---

**تاريخ الإنشاء:** 2026-01-06  
**آخر تحديث:** 2026-01-06  
**الحالة:** ✅ جاهز للاستخدام

## خطوة بخطوة مع الصور التوضيحية

---

## 🎯 الهدف
إضافة Rule في Cloudflare للسماح بالوصول إلى `/api/mcp` بدون حجب (403 Forbidden)

---

## 📋 الطريقة 1: WAF Custom Rules (موصى به)

### الخطوة 1: الدخول إلى Cloudflare Dashboard
1. اذهب إلى: https://dash.cloudflare.com
2. اختر **Domain:** `zien-ai.app`
3. من القائمة الجانبية، اختر: **Security** → **WAF**

### الخطوة 2: إنشاء Custom Rule
1. في صفحة **WAF**، ابحث عن **Custom Rules**
2. اضغط على **Create rule** أو **Add rule**

### الخطوة 3: إعداد Rule
#### أ. Rule Name (اسم القاعدة):
```
Allow MCP Endpoint
```

#### ب. Expression (التعبير):
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Action (الإجراء):
- اختر: **Skip** (تخطي)
- أو: **Allow** (السماح)

#### د. Save (حفظ):
- اضغط **Deploy** أو **Save**

---

## 📋 الطريقة 2: Page Rules (أسهل)

### الخطوة 1: الدخول إلى Page Rules
1. في Cloudflare Dashboard
2. اختر: **Rules** → **Page Rules**
3. اضغط **Create Page Rule**

### الخطوة 2: إعداد Page Rule
#### أ. URL Pattern:
```
api.zien-ai.app/api/mcp*
```

#### ب. Settings (الإعدادات):
1. **Security Level:** `Off` (إيقاف)
2. **Cache Level:** `Bypass` (تخطي)
3. **Disable Security:** `On` (تفعيل)

#### ج. Save and Deploy:
- اضغط **Save and Deploy**

---

## 📋 الطريقة 3: Transform Rules (لإضافة Headers)

### الخطوة 1: الدخول إلى Transform Rules
1. في Cloudflare Dashboard
2. اختر: **Rules** → **Transform Rules** → **Modify Request Header**
3. اضغط **Create rule**

### الخطوة 2: إعداد Transform Rule
#### أ. Rule Name:
```
MCP Endpoint CORS Headers
```

#### ب. When incoming requests match:
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Then:
- **Set static:** `Access-Control-Allow-Origin` = `*`
- **Set static:** `Access-Control-Allow-Methods` = `GET, POST, OPTIONS`
- **Set static:** `Access-Control-Allow-Headers` = `Content-Type, Authorization, Cache-Control`

#### د. Deploy:
- اضغط **Deploy**

---

## 📋 الطريقة 4: Firewall Rules (للتأكد من عدم الحجب)

### الخطوة 1: الدخول إلى Firewall Rules
1. في Cloudflare Dashboard
2. اختر: **Security** → **WAF** → **Custom Rules**
3. أو: **Security** → **Firewall Rules**

### الخطوة 2: إنشاء Exception Rule
#### أ. Rule Name:
```
Allow MCP Endpoint Exception
```

#### ب. Expression:
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Action:
- **Allow** (السماح)
- أو **Skip** (تخطي جميع Rules)

---

## ✅ الطريقة الموصى بها (الأسهل)

### استخدم **Page Rules**:

1. **Rules** → **Page Rules** → **Create Page Rule**
2. **URL:** `api.zien-ai.app/api/mcp*`
3. **Settings:**
   - ✅ Security Level: **Off**
   - ✅ Cache Level: **Bypass**
   - ✅ Disable Security: **On**
4. **Save and Deploy**

---

## 🔍 التحقق من Rule

### بعد إضافة Rule:
1. انتظر 1-2 دقيقة (لنشر التغييرات)
2. اختبر الـ endpoint:
   ```bash
   curl -I https://api.zien-ai.app/api/mcp
   ```
3. يجب أن ترى:
   ```
   HTTP/2 200
   Content-Type: text/event-stream
   ```

---

## 📸 مسار القوائم في Cloudflare Dashboard

```
Cloudflare Dashboard
├── Domain: zien-ai.app
│   ├── Security
│   │   ├── WAF
│   │   │   └── Custom Rules ← هنا (الطريقة 1)
│   │   └── Firewall Rules ← هنا (الطريقة 4)
│   └── Rules
│       ├── Page Rules ← هنا (الطريقة 2 - الأسهل)
│       └── Transform Rules ← هنا (الطريقة 3)
```

---

## ⚠️ ملاحظات مهمة

1. **ترتيب Rules:** Rules تعمل بالترتيب (من الأعلى للأسفل)
2. **Deploy:** تأكد من الضغط على **Deploy** أو **Save**
3. **الانتظار:** قد يستغرق نشر التغييرات 1-2 دقيقة
4. **الاختبار:** اختبر بعد إضافة Rule مباشرة

---

## 🆘 إذا استمرت المشكلة

### 1. تحقق من Analytics:
- **Analytics** → **Security Events**
- ابحث عن events للـ `/api/mcp`
- تحقق من سبب الحجب

### 2. تحقق من Rate Limiting:
- **Security** → **WAF** → **Rate Limiting Rules**
- تأكد من عدم وجود Rule يحجب `/api/mcp`

### 3. تحقق من IP Access Rules:
- **Security** → **WAF** → **Tools** → **IP Access Rules**
- تأكد من عدم حجب IP الخاص بك

---

## 📝 مثال كامل لـ Custom Rule

```json
{
  "name": "Allow MCP Endpoint",
  "expression": "(http.request.uri.path eq \"/api/mcp\")",
  "action": "skip",
  "enabled": true
}
```

---

## ✅ Checklist

- [ ] دخول Cloudflare Dashboard
- [ ] اختيار Domain: `zien-ai.app`
- [ ] إنشاء Rule (Page Rule أو Custom Rule)
- [ ] إدخال URL/Expression: `/api/mcp`
- [ ] تعيين Action: `Skip` أو `Allow`
- [ ] حفظ Rule (Deploy)
- [ ] انتظار 1-2 دقيقة
- [ ] اختبار الـ endpoint
- [ ] التحقق من نجاح الاتصال

---

**تاريخ الإنشاء:** 2026-01-06  
**آخر تحديث:** 2026-01-06  
**الحالة:** ✅ جاهز للاستخدام

## خطوة بخطوة مع الصور التوضيحية

---

## 🎯 الهدف
إضافة Rule في Cloudflare للسماح بالوصول إلى `/api/mcp` بدون حجب (403 Forbidden)

---

## 📋 الطريقة 1: WAF Custom Rules (موصى به)

### الخطوة 1: الدخول إلى Cloudflare Dashboard
1. اذهب إلى: https://dash.cloudflare.com
2. اختر **Domain:** `zien-ai.app`
3. من القائمة الجانبية، اختر: **Security** → **WAF**

### الخطوة 2: إنشاء Custom Rule
1. في صفحة **WAF**، ابحث عن **Custom Rules**
2. اضغط على **Create rule** أو **Add rule**

### الخطوة 3: إعداد Rule
#### أ. Rule Name (اسم القاعدة):
```
Allow MCP Endpoint
```

#### ب. Expression (التعبير):
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Action (الإجراء):
- اختر: **Skip** (تخطي)
- أو: **Allow** (السماح)

#### د. Save (حفظ):
- اضغط **Deploy** أو **Save**

---

## 📋 الطريقة 2: Page Rules (أسهل)

### الخطوة 1: الدخول إلى Page Rules
1. في Cloudflare Dashboard
2. اختر: **Rules** → **Page Rules**
3. اضغط **Create Page Rule**

### الخطوة 2: إعداد Page Rule
#### أ. URL Pattern:
```
api.zien-ai.app/api/mcp*
```

#### ب. Settings (الإعدادات):
1. **Security Level:** `Off` (إيقاف)
2. **Cache Level:** `Bypass` (تخطي)
3. **Disable Security:** `On` (تفعيل)

#### ج. Save and Deploy:
- اضغط **Save and Deploy**

---

## 📋 الطريقة 3: Transform Rules (لإضافة Headers)

### الخطوة 1: الدخول إلى Transform Rules
1. في Cloudflare Dashboard
2. اختر: **Rules** → **Transform Rules** → **Modify Request Header**
3. اضغط **Create rule**

### الخطوة 2: إعداد Transform Rule
#### أ. Rule Name:
```
MCP Endpoint CORS Headers
```

#### ب. When incoming requests match:
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Then:
- **Set static:** `Access-Control-Allow-Origin` = `*`
- **Set static:** `Access-Control-Allow-Methods` = `GET, POST, OPTIONS`
- **Set static:** `Access-Control-Allow-Headers` = `Content-Type, Authorization, Cache-Control`

#### د. Deploy:
- اضغط **Deploy**

---

## 📋 الطريقة 4: Firewall Rules (للتأكد من عدم الحجب)

### الخطوة 1: الدخول إلى Firewall Rules
1. في Cloudflare Dashboard
2. اختر: **Security** → **WAF** → **Custom Rules**
3. أو: **Security** → **Firewall Rules**

### الخطوة 2: إنشاء Exception Rule
#### أ. Rule Name:
```
Allow MCP Endpoint Exception
```

#### ب. Expression:
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Action:
- **Allow** (السماح)
- أو **Skip** (تخطي جميع Rules)

---

## ✅ الطريقة الموصى بها (الأسهل)

### استخدم **Page Rules**:

1. **Rules** → **Page Rules** → **Create Page Rule**
2. **URL:** `api.zien-ai.app/api/mcp*`
3. **Settings:**
   - ✅ Security Level: **Off**
   - ✅ Cache Level: **Bypass**
   - ✅ Disable Security: **On**
4. **Save and Deploy**

---

## 🔍 التحقق من Rule

### بعد إضافة Rule:
1. انتظر 1-2 دقيقة (لنشر التغييرات)
2. اختبر الـ endpoint:
   ```bash
   curl -I https://api.zien-ai.app/api/mcp
   ```
3. يجب أن ترى:
   ```
   HTTP/2 200
   Content-Type: text/event-stream
   ```

---

## 📸 مسار القوائم في Cloudflare Dashboard

```
Cloudflare Dashboard
├── Domain: zien-ai.app
│   ├── Security
│   │   ├── WAF
│   │   │   └── Custom Rules ← هنا (الطريقة 1)
│   │   └── Firewall Rules ← هنا (الطريقة 4)
│   └── Rules
│       ├── Page Rules ← هنا (الطريقة 2 - الأسهل)
│       └── Transform Rules ← هنا (الطريقة 3)
```

---

## ⚠️ ملاحظات مهمة

1. **ترتيب Rules:** Rules تعمل بالترتيب (من الأعلى للأسفل)
2. **Deploy:** تأكد من الضغط على **Deploy** أو **Save**
3. **الانتظار:** قد يستغرق نشر التغييرات 1-2 دقيقة
4. **الاختبار:** اختبر بعد إضافة Rule مباشرة

---

## 🆘 إذا استمرت المشكلة

### 1. تحقق من Analytics:
- **Analytics** → **Security Events**
- ابحث عن events للـ `/api/mcp`
- تحقق من سبب الحجب

### 2. تحقق من Rate Limiting:
- **Security** → **WAF** → **Rate Limiting Rules**
- تأكد من عدم وجود Rule يحجب `/api/mcp`

### 3. تحقق من IP Access Rules:
- **Security** → **WAF** → **Tools** → **IP Access Rules**
- تأكد من عدم حجب IP الخاص بك

---

## 📝 مثال كامل لـ Custom Rule

```json
{
  "name": "Allow MCP Endpoint",
  "expression": "(http.request.uri.path eq \"/api/mcp\")",
  "action": "skip",
  "enabled": true
}
```

---

## ✅ Checklist

- [ ] دخول Cloudflare Dashboard
- [ ] اختيار Domain: `zien-ai.app`
- [ ] إنشاء Rule (Page Rule أو Custom Rule)
- [ ] إدخال URL/Expression: `/api/mcp`
- [ ] تعيين Action: `Skip` أو `Allow`
- [ ] حفظ Rule (Deploy)
- [ ] انتظار 1-2 دقيقة
- [ ] اختبار الـ endpoint
- [ ] التحقق من نجاح الاتصال

---

**تاريخ الإنشاء:** 2026-01-06  
**آخر تحديث:** 2026-01-06  
**الحالة:** ✅ جاهز للاستخدام

## خطوة بخطوة مع الصور التوضيحية

---

## 🎯 الهدف
إضافة Rule في Cloudflare للسماح بالوصول إلى `/api/mcp` بدون حجب (403 Forbidden)

---

## 📋 الطريقة 1: WAF Custom Rules (موصى به)

### الخطوة 1: الدخول إلى Cloudflare Dashboard
1. اذهب إلى: https://dash.cloudflare.com
2. اختر **Domain:** `zien-ai.app`
3. من القائمة الجانبية، اختر: **Security** → **WAF**

### الخطوة 2: إنشاء Custom Rule
1. في صفحة **WAF**، ابحث عن **Custom Rules**
2. اضغط على **Create rule** أو **Add rule**

### الخطوة 3: إعداد Rule
#### أ. Rule Name (اسم القاعدة):
```
Allow MCP Endpoint
```

#### ب. Expression (التعبير):
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Action (الإجراء):
- اختر: **Skip** (تخطي)
- أو: **Allow** (السماح)

#### د. Save (حفظ):
- اضغط **Deploy** أو **Save**

---

## 📋 الطريقة 2: Page Rules (أسهل)

### الخطوة 1: الدخول إلى Page Rules
1. في Cloudflare Dashboard
2. اختر: **Rules** → **Page Rules**
3. اضغط **Create Page Rule**

### الخطوة 2: إعداد Page Rule
#### أ. URL Pattern:
```
api.zien-ai.app/api/mcp*
```

#### ب. Settings (الإعدادات):
1. **Security Level:** `Off` (إيقاف)
2. **Cache Level:** `Bypass` (تخطي)
3. **Disable Security:** `On` (تفعيل)

#### ج. Save and Deploy:
- اضغط **Save and Deploy**

---

## 📋 الطريقة 3: Transform Rules (لإضافة Headers)

### الخطوة 1: الدخول إلى Transform Rules
1. في Cloudflare Dashboard
2. اختر: **Rules** → **Transform Rules** → **Modify Request Header**
3. اضغط **Create rule**

### الخطوة 2: إعداد Transform Rule
#### أ. Rule Name:
```
MCP Endpoint CORS Headers
```

#### ب. When incoming requests match:
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Then:
- **Set static:** `Access-Control-Allow-Origin` = `*`
- **Set static:** `Access-Control-Allow-Methods` = `GET, POST, OPTIONS`
- **Set static:** `Access-Control-Allow-Headers` = `Content-Type, Authorization, Cache-Control`

#### د. Deploy:
- اضغط **Deploy**

---

## 📋 الطريقة 4: Firewall Rules (للتأكد من عدم الحجب)

### الخطوة 1: الدخول إلى Firewall Rules
1. في Cloudflare Dashboard
2. اختر: **Security** → **WAF** → **Custom Rules**
3. أو: **Security** → **Firewall Rules**

### الخطوة 2: إنشاء Exception Rule
#### أ. Rule Name:
```
Allow MCP Endpoint Exception
```

#### ب. Expression:
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Action:
- **Allow** (السماح)
- أو **Skip** (تخطي جميع Rules)

---

## ✅ الطريقة الموصى بها (الأسهل)

### استخدم **Page Rules**:

1. **Rules** → **Page Rules** → **Create Page Rule**
2. **URL:** `api.zien-ai.app/api/mcp*`
3. **Settings:**
   - ✅ Security Level: **Off**
   - ✅ Cache Level: **Bypass**
   - ✅ Disable Security: **On**
4. **Save and Deploy**

---

## 🔍 التحقق من Rule

### بعد إضافة Rule:
1. انتظر 1-2 دقيقة (لنشر التغييرات)
2. اختبر الـ endpoint:
   ```bash
   curl -I https://api.zien-ai.app/api/mcp
   ```
3. يجب أن ترى:
   ```
   HTTP/2 200
   Content-Type: text/event-stream
   ```

---

## 📸 مسار القوائم في Cloudflare Dashboard

```
Cloudflare Dashboard
├── Domain: zien-ai.app
│   ├── Security
│   │   ├── WAF
│   │   │   └── Custom Rules ← هنا (الطريقة 1)
│   │   └── Firewall Rules ← هنا (الطريقة 4)
│   └── Rules
│       ├── Page Rules ← هنا (الطريقة 2 - الأسهل)
│       └── Transform Rules ← هنا (الطريقة 3)
```

---

## ⚠️ ملاحظات مهمة

1. **ترتيب Rules:** Rules تعمل بالترتيب (من الأعلى للأسفل)
2. **Deploy:** تأكد من الضغط على **Deploy** أو **Save**
3. **الانتظار:** قد يستغرق نشر التغييرات 1-2 دقيقة
4. **الاختبار:** اختبر بعد إضافة Rule مباشرة

---

## 🆘 إذا استمرت المشكلة

### 1. تحقق من Analytics:
- **Analytics** → **Security Events**
- ابحث عن events للـ `/api/mcp`
- تحقق من سبب الحجب

### 2. تحقق من Rate Limiting:
- **Security** → **WAF** → **Rate Limiting Rules**
- تأكد من عدم وجود Rule يحجب `/api/mcp`

### 3. تحقق من IP Access Rules:
- **Security** → **WAF** → **Tools** → **IP Access Rules**
- تأكد من عدم حجب IP الخاص بك

---

## 📝 مثال كامل لـ Custom Rule

```json
{
  "name": "Allow MCP Endpoint",
  "expression": "(http.request.uri.path eq \"/api/mcp\")",
  "action": "skip",
  "enabled": true
}
```

---

## ✅ Checklist

- [ ] دخول Cloudflare Dashboard
- [ ] اختيار Domain: `zien-ai.app`
- [ ] إنشاء Rule (Page Rule أو Custom Rule)
- [ ] إدخال URL/Expression: `/api/mcp`
- [ ] تعيين Action: `Skip` أو `Allow`
- [ ] حفظ Rule (Deploy)
- [ ] انتظار 1-2 دقيقة
- [ ] اختبار الـ endpoint
- [ ] التحقق من نجاح الاتصال

---

**تاريخ الإنشاء:** 2026-01-06  
**آخر تحديث:** 2026-01-06  
**الحالة:** ✅ جاهز للاستخدام

## خطوة بخطوة مع الصور التوضيحية

---

## 🎯 الهدف
إضافة Rule في Cloudflare للسماح بالوصول إلى `/api/mcp` بدون حجب (403 Forbidden)

---

## 📋 الطريقة 1: WAF Custom Rules (موصى به)

### الخطوة 1: الدخول إلى Cloudflare Dashboard
1. اذهب إلى: https://dash.cloudflare.com
2. اختر **Domain:** `zien-ai.app`
3. من القائمة الجانبية، اختر: **Security** → **WAF**

### الخطوة 2: إنشاء Custom Rule
1. في صفحة **WAF**، ابحث عن **Custom Rules**
2. اضغط على **Create rule** أو **Add rule**

### الخطوة 3: إعداد Rule
#### أ. Rule Name (اسم القاعدة):
```
Allow MCP Endpoint
```

#### ب. Expression (التعبير):
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Action (الإجراء):
- اختر: **Skip** (تخطي)
- أو: **Allow** (السماح)

#### د. Save (حفظ):
- اضغط **Deploy** أو **Save**

---

## 📋 الطريقة 2: Page Rules (أسهل)

### الخطوة 1: الدخول إلى Page Rules
1. في Cloudflare Dashboard
2. اختر: **Rules** → **Page Rules**
3. اضغط **Create Page Rule**

### الخطوة 2: إعداد Page Rule
#### أ. URL Pattern:
```
api.zien-ai.app/api/mcp*
```

#### ب. Settings (الإعدادات):
1. **Security Level:** `Off` (إيقاف)
2. **Cache Level:** `Bypass` (تخطي)
3. **Disable Security:** `On` (تفعيل)

#### ج. Save and Deploy:
- اضغط **Save and Deploy**

---

## 📋 الطريقة 3: Transform Rules (لإضافة Headers)

### الخطوة 1: الدخول إلى Transform Rules
1. في Cloudflare Dashboard
2. اختر: **Rules** → **Transform Rules** → **Modify Request Header**
3. اضغط **Create rule**

### الخطوة 2: إعداد Transform Rule
#### أ. Rule Name:
```
MCP Endpoint CORS Headers
```

#### ب. When incoming requests match:
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Then:
- **Set static:** `Access-Control-Allow-Origin` = `*`
- **Set static:** `Access-Control-Allow-Methods` = `GET, POST, OPTIONS`
- **Set static:** `Access-Control-Allow-Headers` = `Content-Type, Authorization, Cache-Control`

#### د. Deploy:
- اضغط **Deploy**

---

## 📋 الطريقة 4: Firewall Rules (للتأكد من عدم الحجب)

### الخطوة 1: الدخول إلى Firewall Rules
1. في Cloudflare Dashboard
2. اختر: **Security** → **WAF** → **Custom Rules**
3. أو: **Security** → **Firewall Rules**

### الخطوة 2: إنشاء Exception Rule
#### أ. Rule Name:
```
Allow MCP Endpoint Exception
```

#### ب. Expression:
```
(http.request.uri.path eq "/api/mcp")
```

#### ج. Action:
- **Allow** (السماح)
- أو **Skip** (تخطي جميع Rules)

---

## ✅ الطريقة الموصى بها (الأسهل)

### استخدم **Page Rules**:

1. **Rules** → **Page Rules** → **Create Page Rule**
2. **URL:** `api.zien-ai.app/api/mcp*`
3. **Settings:**
   - ✅ Security Level: **Off**
   - ✅ Cache Level: **Bypass**
   - ✅ Disable Security: **On**
4. **Save and Deploy**

---

## 🔍 التحقق من Rule

### بعد إضافة Rule:
1. انتظر 1-2 دقيقة (لنشر التغييرات)
2. اختبر الـ endpoint:
   ```bash
   curl -I https://api.zien-ai.app/api/mcp
   ```
3. يجب أن ترى:
   ```
   HTTP/2 200
   Content-Type: text/event-stream
   ```

---

## 📸 مسار القوائم في Cloudflare Dashboard

```
Cloudflare Dashboard
├── Domain: zien-ai.app
│   ├── Security
│   │   ├── WAF
│   │   │   └── Custom Rules ← هنا (الطريقة 1)
│   │   └── Firewall Rules ← هنا (الطريقة 4)
│   └── Rules
│       ├── Page Rules ← هنا (الطريقة 2 - الأسهل)
│       └── Transform Rules ← هنا (الطريقة 3)
```

---

## ⚠️ ملاحظات مهمة

1. **ترتيب Rules:** Rules تعمل بالترتيب (من الأعلى للأسفل)
2. **Deploy:** تأكد من الضغط على **Deploy** أو **Save**
3. **الانتظار:** قد يستغرق نشر التغييرات 1-2 دقيقة
4. **الاختبار:** اختبر بعد إضافة Rule مباشرة

---

## 🆘 إذا استمرت المشكلة

### 1. تحقق من Analytics:
- **Analytics** → **Security Events**
- ابحث عن events للـ `/api/mcp`
- تحقق من سبب الحجب

### 2. تحقق من Rate Limiting:
- **Security** → **WAF** → **Rate Limiting Rules**
- تأكد من عدم وجود Rule يحجب `/api/mcp`

### 3. تحقق من IP Access Rules:
- **Security** → **WAF** → **Tools** → **IP Access Rules**
- تأكد من عدم حجب IP الخاص بك

---

## 📝 مثال كامل لـ Custom Rule

```json
{
  "name": "Allow MCP Endpoint",
  "expression": "(http.request.uri.path eq \"/api/mcp\")",
  "action": "skip",
  "enabled": true
}
```

---

## ✅ Checklist

- [ ] دخول Cloudflare Dashboard
- [ ] اختيار Domain: `zien-ai.app`
- [ ] إنشاء Rule (Page Rule أو Custom Rule)
- [ ] إدخال URL/Expression: `/api/mcp`
- [ ] تعيين Action: `Skip` أو `Allow`
- [ ] حفظ Rule (Deploy)
- [ ] انتظار 1-2 دقيقة
- [ ] اختبار الـ endpoint
- [ ] التحقق من نجاح الاتصال

---

**تاريخ الإنشاء:** 2026-01-06  
**آخر تحديث:** 2026-01-06  
**الحالة:** ✅ جاهز للاستخدام

