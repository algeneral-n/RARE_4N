# خطوات إكمال Cloudflare Custom Rule - MCP Endpoint
## دليل تفصيلي خطوة بخطوة

---

## 📋 الإعدادات الحالية (من الصورة)

- ✅ **Rule name:** `Allow MCP Endpoint` (صحيح)
- ✅ **Field:** `URI` (صحيح)
- ✅ **Operator:** `wildcard` (صحيح)
- ❌ **Value:** فارغ (يحتاج إدخال)
- ❌ **Action:** `Select...` (يحتاج اختيار)
- ✅ **Place at:** `Last` (صحيح)

---

## ✅ الخطوات لإكمال Rule

### 1. إدخال Value (القيمة)

في حقل **Value**:
```
/api/mcp*
```

**ملاحظة:** استخدم `*` في النهاية لمطابقة جميع المسارات الفرعية

---

### 2. اختيار Action (الإجراء)

في قائمة **"Choose action"**:
- اختر: **Skip** (تخطي)
- أو: **Allow** (السماح)

**موصى به:** `Skip` (تخطي جميع WAF rules)

---

### 3. التحقق من Expression Preview

بعد إدخال Value، يجب أن يظهر في **Expression Preview**:
```
(http.request.uri.path wildcard "/api/mcp*")
```

أو يمكنك الضغط على **"Edit expression"** وإدخال:
```
(http.request.uri.path eq "/api/mcp")
```

---

### 4. Place at (الترتيب)

- **Place at:** `Last` ✅ (صحيح)
- هذا يعني أن Rule سيتم تطبيقه في النهاية

---

### 5. الحفظ

- اضغط **"Deploy"** (الأزرق الداكن)
- أو **"Save as Draft"** إذا أردت الحفظ بدون نشر

---

## 📝 الإعدادات النهائية الصحيحة

```
Rule name: Allow MCP Endpoint

When incoming requests match:
├── Field: URI
├── Operator: wildcard (أو equals)
└── Value: /api/mcp*

Then take action:
└── Action: Skip

Place at:
└── Order: Last
```

---

## 🎯 بديل: استخدام Expression مباشرة

### إذا أردت استخدام Expression بدلاً من Field/Operator/Value:

1. اضغط **"Edit expression"** في Expression Preview
2. أدخل:
   ```
   (http.request.uri.path eq "/api/mcp")
   ```
3. أو:
   ```
   (http.request.uri.path starts_with "/api/mcp")
   ```

---

## ✅ Checklist

- [ ] Rule name: `Allow MCP Endpoint` ✅
- [ ] Field: `URI` ✅
- [ ] Operator: `wildcard` أو `equals` ✅
- [ ] Value: `/api/mcp*` ❌ (يحتاج إدخال)
- [ ] Action: `Skip` ❌ (يحتاج اختيار)
- [ ] Place at: `Last` ✅
- [ ] Deploy ✅

---

## 🔍 بعد Deploy

1. انتظر 1-2 دقيقة
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

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ إرشادات فورية

## دليل تفصيلي خطوة بخطوة

---

## 📋 الإعدادات الحالية (من الصورة)

- ✅ **Rule name:** `Allow MCP Endpoint` (صحيح)
- ✅ **Field:** `URI` (صحيح)
- ✅ **Operator:** `wildcard` (صحيح)
- ❌ **Value:** فارغ (يحتاج إدخال)
- ❌ **Action:** `Select...` (يحتاج اختيار)
- ✅ **Place at:** `Last` (صحيح)

---

## ✅ الخطوات لإكمال Rule

### 1. إدخال Value (القيمة)

في حقل **Value**:
```
/api/mcp*
```

**ملاحظة:** استخدم `*` في النهاية لمطابقة جميع المسارات الفرعية

---

### 2. اختيار Action (الإجراء)

في قائمة **"Choose action"**:
- اختر: **Skip** (تخطي)
- أو: **Allow** (السماح)

**موصى به:** `Skip` (تخطي جميع WAF rules)

---

### 3. التحقق من Expression Preview

بعد إدخال Value، يجب أن يظهر في **Expression Preview**:
```
(http.request.uri.path wildcard "/api/mcp*")
```

أو يمكنك الضغط على **"Edit expression"** وإدخال:
```
(http.request.uri.path eq "/api/mcp")
```

---

### 4. Place at (الترتيب)

- **Place at:** `Last` ✅ (صحيح)
- هذا يعني أن Rule سيتم تطبيقه في النهاية

---

### 5. الحفظ

- اضغط **"Deploy"** (الأزرق الداكن)
- أو **"Save as Draft"** إذا أردت الحفظ بدون نشر

---

## 📝 الإعدادات النهائية الصحيحة

```
Rule name: Allow MCP Endpoint

When incoming requests match:
├── Field: URI
├── Operator: wildcard (أو equals)
└── Value: /api/mcp*

Then take action:
└── Action: Skip

Place at:
└── Order: Last
```

---

## 🎯 بديل: استخدام Expression مباشرة

### إذا أردت استخدام Expression بدلاً من Field/Operator/Value:

1. اضغط **"Edit expression"** في Expression Preview
2. أدخل:
   ```
   (http.request.uri.path eq "/api/mcp")
   ```
3. أو:
   ```
   (http.request.uri.path starts_with "/api/mcp")
   ```

---

## ✅ Checklist

- [ ] Rule name: `Allow MCP Endpoint` ✅
- [ ] Field: `URI` ✅
- [ ] Operator: `wildcard` أو `equals` ✅
- [ ] Value: `/api/mcp*` ❌ (يحتاج إدخال)
- [ ] Action: `Skip` ❌ (يحتاج اختيار)
- [ ] Place at: `Last` ✅
- [ ] Deploy ✅

---

## 🔍 بعد Deploy

1. انتظر 1-2 دقيقة
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

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ إرشادات فورية

## دليل تفصيلي خطوة بخطوة

---

## 📋 الإعدادات الحالية (من الصورة)

- ✅ **Rule name:** `Allow MCP Endpoint` (صحيح)
- ✅ **Field:** `URI` (صحيح)
- ✅ **Operator:** `wildcard` (صحيح)
- ❌ **Value:** فارغ (يحتاج إدخال)
- ❌ **Action:** `Select...` (يحتاج اختيار)
- ✅ **Place at:** `Last` (صحيح)

---

## ✅ الخطوات لإكمال Rule

### 1. إدخال Value (القيمة)

في حقل **Value**:
```
/api/mcp*
```

**ملاحظة:** استخدم `*` في النهاية لمطابقة جميع المسارات الفرعية

---

### 2. اختيار Action (الإجراء)

في قائمة **"Choose action"**:
- اختر: **Skip** (تخطي)
- أو: **Allow** (السماح)

**موصى به:** `Skip` (تخطي جميع WAF rules)

---

### 3. التحقق من Expression Preview

بعد إدخال Value، يجب أن يظهر في **Expression Preview**:
```
(http.request.uri.path wildcard "/api/mcp*")
```

أو يمكنك الضغط على **"Edit expression"** وإدخال:
```
(http.request.uri.path eq "/api/mcp")
```

---

### 4. Place at (الترتيب)

- **Place at:** `Last` ✅ (صحيح)
- هذا يعني أن Rule سيتم تطبيقه في النهاية

---

### 5. الحفظ

- اضغط **"Deploy"** (الأزرق الداكن)
- أو **"Save as Draft"** إذا أردت الحفظ بدون نشر

---

## 📝 الإعدادات النهائية الصحيحة

```
Rule name: Allow MCP Endpoint

When incoming requests match:
├── Field: URI
├── Operator: wildcard (أو equals)
└── Value: /api/mcp*

Then take action:
└── Action: Skip

Place at:
└── Order: Last
```

---

## 🎯 بديل: استخدام Expression مباشرة

### إذا أردت استخدام Expression بدلاً من Field/Operator/Value:

1. اضغط **"Edit expression"** في Expression Preview
2. أدخل:
   ```
   (http.request.uri.path eq "/api/mcp")
   ```
3. أو:
   ```
   (http.request.uri.path starts_with "/api/mcp")
   ```

---

## ✅ Checklist

- [ ] Rule name: `Allow MCP Endpoint` ✅
- [ ] Field: `URI` ✅
- [ ] Operator: `wildcard` أو `equals` ✅
- [ ] Value: `/api/mcp*` ❌ (يحتاج إدخال)
- [ ] Action: `Skip` ❌ (يحتاج اختيار)
- [ ] Place at: `Last` ✅
- [ ] Deploy ✅

---

## 🔍 بعد Deploy

1. انتظر 1-2 دقيقة
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

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ إرشادات فورية

## دليل تفصيلي خطوة بخطوة

---

## 📋 الإعدادات الحالية (من الصورة)

- ✅ **Rule name:** `Allow MCP Endpoint` (صحيح)
- ✅ **Field:** `URI` (صحيح)
- ✅ **Operator:** `wildcard` (صحيح)
- ❌ **Value:** فارغ (يحتاج إدخال)
- ❌ **Action:** `Select...` (يحتاج اختيار)
- ✅ **Place at:** `Last` (صحيح)

---

## ✅ الخطوات لإكمال Rule

### 1. إدخال Value (القيمة)

في حقل **Value**:
```
/api/mcp*
```

**ملاحظة:** استخدم `*` في النهاية لمطابقة جميع المسارات الفرعية

---

### 2. اختيار Action (الإجراء)

في قائمة **"Choose action"**:
- اختر: **Skip** (تخطي)
- أو: **Allow** (السماح)

**موصى به:** `Skip` (تخطي جميع WAF rules)

---

### 3. التحقق من Expression Preview

بعد إدخال Value، يجب أن يظهر في **Expression Preview**:
```
(http.request.uri.path wildcard "/api/mcp*")
```

أو يمكنك الضغط على **"Edit expression"** وإدخال:
```
(http.request.uri.path eq "/api/mcp")
```

---

### 4. Place at (الترتيب)

- **Place at:** `Last` ✅ (صحيح)
- هذا يعني أن Rule سيتم تطبيقه في النهاية

---

### 5. الحفظ

- اضغط **"Deploy"** (الأزرق الداكن)
- أو **"Save as Draft"** إذا أردت الحفظ بدون نشر

---

## 📝 الإعدادات النهائية الصحيحة

```
Rule name: Allow MCP Endpoint

When incoming requests match:
├── Field: URI
├── Operator: wildcard (أو equals)
└── Value: /api/mcp*

Then take action:
└── Action: Skip

Place at:
└── Order: Last
```

---

## 🎯 بديل: استخدام Expression مباشرة

### إذا أردت استخدام Expression بدلاً من Field/Operator/Value:

1. اضغط **"Edit expression"** في Expression Preview
2. أدخل:
   ```
   (http.request.uri.path eq "/api/mcp")
   ```
3. أو:
   ```
   (http.request.uri.path starts_with "/api/mcp")
   ```

---

## ✅ Checklist

- [ ] Rule name: `Allow MCP Endpoint` ✅
- [ ] Field: `URI` ✅
- [ ] Operator: `wildcard` أو `equals` ✅
- [ ] Value: `/api/mcp*` ❌ (يحتاج إدخال)
- [ ] Action: `Skip` ❌ (يحتاج اختيار)
- [ ] Place at: `Last` ✅
- [ ] Deploy ✅

---

## 🔍 بعد Deploy

1. انتظر 1-2 دقيقة
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

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ إرشادات فورية

## دليل تفصيلي خطوة بخطوة

---

## 📋 الإعدادات الحالية (من الصورة)

- ✅ **Rule name:** `Allow MCP Endpoint` (صحيح)
- ✅ **Field:** `URI` (صحيح)
- ✅ **Operator:** `wildcard` (صحيح)
- ❌ **Value:** فارغ (يحتاج إدخال)
- ❌ **Action:** `Select...` (يحتاج اختيار)
- ✅ **Place at:** `Last` (صحيح)

---

## ✅ الخطوات لإكمال Rule

### 1. إدخال Value (القيمة)

في حقل **Value**:
```
/api/mcp*
```

**ملاحظة:** استخدم `*` في النهاية لمطابقة جميع المسارات الفرعية

---

### 2. اختيار Action (الإجراء)

في قائمة **"Choose action"**:
- اختر: **Skip** (تخطي)
- أو: **Allow** (السماح)

**موصى به:** `Skip` (تخطي جميع WAF rules)

---

### 3. التحقق من Expression Preview

بعد إدخال Value، يجب أن يظهر في **Expression Preview**:
```
(http.request.uri.path wildcard "/api/mcp*")
```

أو يمكنك الضغط على **"Edit expression"** وإدخال:
```
(http.request.uri.path eq "/api/mcp")
```

---

### 4. Place at (الترتيب)

- **Place at:** `Last` ✅ (صحيح)
- هذا يعني أن Rule سيتم تطبيقه في النهاية

---

### 5. الحفظ

- اضغط **"Deploy"** (الأزرق الداكن)
- أو **"Save as Draft"** إذا أردت الحفظ بدون نشر

---

## 📝 الإعدادات النهائية الصحيحة

```
Rule name: Allow MCP Endpoint

When incoming requests match:
├── Field: URI
├── Operator: wildcard (أو equals)
└── Value: /api/mcp*

Then take action:
└── Action: Skip

Place at:
└── Order: Last
```

---

## 🎯 بديل: استخدام Expression مباشرة

### إذا أردت استخدام Expression بدلاً من Field/Operator/Value:

1. اضغط **"Edit expression"** في Expression Preview
2. أدخل:
   ```
   (http.request.uri.path eq "/api/mcp")
   ```
3. أو:
   ```
   (http.request.uri.path starts_with "/api/mcp")
   ```

---

## ✅ Checklist

- [ ] Rule name: `Allow MCP Endpoint` ✅
- [ ] Field: `URI` ✅
- [ ] Operator: `wildcard` أو `equals` ✅
- [ ] Value: `/api/mcp*` ❌ (يحتاج إدخال)
- [ ] Action: `Skip` ❌ (يحتاج اختيار)
- [ ] Place at: `Last` ✅
- [ ] Deploy ✅

---

## 🔍 بعد Deploy

1. انتظر 1-2 دقيقة
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

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ إرشادات فورية

## دليل تفصيلي خطوة بخطوة

---

## 📋 الإعدادات الحالية (من الصورة)

- ✅ **Rule name:** `Allow MCP Endpoint` (صحيح)
- ✅ **Field:** `URI` (صحيح)
- ✅ **Operator:** `wildcard` (صحيح)
- ❌ **Value:** فارغ (يحتاج إدخال)
- ❌ **Action:** `Select...` (يحتاج اختيار)
- ✅ **Place at:** `Last` (صحيح)

---

## ✅ الخطوات لإكمال Rule

### 1. إدخال Value (القيمة)

في حقل **Value**:
```
/api/mcp*
```

**ملاحظة:** استخدم `*` في النهاية لمطابقة جميع المسارات الفرعية

---

### 2. اختيار Action (الإجراء)

في قائمة **"Choose action"**:
- اختر: **Skip** (تخطي)
- أو: **Allow** (السماح)

**موصى به:** `Skip` (تخطي جميع WAF rules)

---

### 3. التحقق من Expression Preview

بعد إدخال Value، يجب أن يظهر في **Expression Preview**:
```
(http.request.uri.path wildcard "/api/mcp*")
```

أو يمكنك الضغط على **"Edit expression"** وإدخال:
```
(http.request.uri.path eq "/api/mcp")
```

---

### 4. Place at (الترتيب)

- **Place at:** `Last` ✅ (صحيح)
- هذا يعني أن Rule سيتم تطبيقه في النهاية

---

### 5. الحفظ

- اضغط **"Deploy"** (الأزرق الداكن)
- أو **"Save as Draft"** إذا أردت الحفظ بدون نشر

---

## 📝 الإعدادات النهائية الصحيحة

```
Rule name: Allow MCP Endpoint

When incoming requests match:
├── Field: URI
├── Operator: wildcard (أو equals)
└── Value: /api/mcp*

Then take action:
└── Action: Skip

Place at:
└── Order: Last
```

---

## 🎯 بديل: استخدام Expression مباشرة

### إذا أردت استخدام Expression بدلاً من Field/Operator/Value:

1. اضغط **"Edit expression"** في Expression Preview
2. أدخل:
   ```
   (http.request.uri.path eq "/api/mcp")
   ```
3. أو:
   ```
   (http.request.uri.path starts_with "/api/mcp")
   ```

---

## ✅ Checklist

- [ ] Rule name: `Allow MCP Endpoint` ✅
- [ ] Field: `URI` ✅
- [ ] Operator: `wildcard` أو `equals` ✅
- [ ] Value: `/api/mcp*` ❌ (يحتاج إدخال)
- [ ] Action: `Skip` ❌ (يحتاج اختيار)
- [ ] Place at: `Last` ✅
- [ ] Deploy ✅

---

## 🔍 بعد Deploy

1. انتظر 1-2 دقيقة
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

**تاريخ الإنشاء:** 2026-01-06  
**الحالة:** ✅ إرشادات فورية

