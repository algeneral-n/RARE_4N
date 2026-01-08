# 🔧 إعداد Cloudflare Page Rule لـ MCP Endpoint

## 📋 الإعدادات المطلوبة (بناءً على الإعدادات المتاحة)

### ✅ الإعدادات التي يجب تفعيلها:

#### 1. **Cache Level** ⭐ **مهم جداً**
- **القيمة:** `Bypass` (تخطي الكاش)
- **السبب:** SSE يحتاج connection مستمر، لا يمكن cache

#### 2. **Disable Apps** (إذا كان متاح)
- **القيمة:** `On` (تفعيل)
- **السبب:** تعطيل Cloudflare Apps التي قد تتداخل

**ملاحظة:** Security Level غير متاح في Page Rules - يجب إضافته من **WAF Custom Rules** بدلاً من ذلك

---

### ❌ الإعدادات التي يجب إيقافها أو عدم تفعيلها:

#### 1. **Always Use HTTPS**
- **القيمة:** `Off` (إيقاف) أو `Default`
- **السبب:** قد يسبب redirect issues مع SSE

#### 2. **Automatic HTTPS Rewrites**
- **القيمة:** `Off` (إيقاف)
- **السبب:** قد يغير headers المطلوبة

#### 3. **Browser Cache TTL**
- **القيمة:** `Respect Existing Headers` أو `Bypass`
- **السبب:** SSE لا يحتاج browser cache

#### 4. **Browser Integrity Check**
- **القيمة:** `Off` (إيقاف)
- **السبب:** قد يحجب بعض clients

#### 5. **Cache Deception Armor**
- **القيمة:** `Off` (إيقاف)
- **السبب:** غير ضروري للـ SSE

#### 6. **Disable Zaraz**
- **القيمة:** `On` (تفعيل) - إذا كان متاح
- **السبب:** تقليل التداخل

#### 7. **Edge Cache TTL**
- **القيمة:** `Bypass` أو `0`
- **السبب:** SSE لا يحتاج edge cache

#### 8. **Email Obfuscation**
- **القيمة:** `Off` (إيقاف)
- **السبب:** غير ضروري

#### 9. **Forwarding URL**
- **القيمة:** لا تستخدم
- **السبب:** سيقطع الاتصال

#### 10. **IP Geolocation Header**
- **القيمة:** `Off` (إيقاف) أو `Default`
- **السبب:** غير ضروري

#### 11. **Opportunistic Encryption**
- **القيمة:** `Off` (إيقاف) أو `Default`
- **السبب:** قد يسبب مشاكل

#### 12. **Origin Cache Control**
- **القيمة:** `Off` (إيقاف)
- **السبب:** SSE لا يحتاج origin cache

#### 13. **Rocket Loader**
- **القيمة:** `Off` (إيقاف)
- **السبب:** غير ضروري للـ API endpoint

#### 14. **SSL**
- **القيمة:** `Full` أو `Full (strict)`
- **السبب:** HTTPS مطلوب

---

## 📝 إعداد Page Rule الكامل

### الخطوة 1: إنشاء Page Rule

1. اذهب إلى **Cloudflare Dashboard**
2. اختر **Domain:** `zien-ai.app`
3. **Rules** → **Page Rules** → **Create Page Rule**

### الخطوة 2: URL Pattern

```
api.zien-ai.app/api/mcp*
```

### الخطوة 3: Settings (الإعدادات)

#### ✅ الإعدادات المطلوبة:

1. **Cache Level:** `Bypass` ⭐ **مهم جداً**
2. **SSL:** `Full` أو `Full (strict)`

**ملاحظة:** Security Level غير متاح في Page Rules - يجب إضافته من **WAF Custom Rules** (انظر أدناه)

#### ❌ الإعدادات التي يجب إيقافها (إذا كانت متاحة):

- **Always Use HTTPS:** `Off` أو `Default`
- **Automatic HTTPS Rewrites:** `Off`
- **Browser Cache TTL:** `Respect Existing Headers` أو `Bypass`
- **Browser Integrity Check:** `Off` (إذا كان متاح)
- **Cache Deception Armor:** `Off` (إذا كان متاح)
- **Edge Cache TTL:** `Bypass` أو `0`
- **Email Obfuscation:** `Off`
- **IP Geolocation Header:** `Off` أو `Default`
- **Opportunistic Encryption:** `Off` أو `Default`
- **Origin Cache Control:** `Off`
- **Rocket Loader:** `Off`

#### ⚠️ إعدادات اختيارية:

- **Disable Zaraz:** `On` (إذا كان متاح)
- **Disable Apps:** `On` (إذا كان متاح)

---

## 🎯 الإعداد الموصى به (الحد الأدنى)

### الإعدادات الأساسية في Page Rule:

```
URL: api.zien-ai.app/api/mcp*

Settings:
1. Cache Level: Bypass ⭐ (مهم جداً)
2. SSL: Full أو Full (strict)
```

### ⚠️ مهم: Security Level غير متاح في Page Rules

يجب إضافة **WAF Custom Rule** بدلاً من ذلك:

```
Security → WAF → Custom Rules → Create rule
Rule name: Allow MCP SSE Endpoint
Expression: (http.request.uri.path eq "/api/mcp")
Action: Skip (all WAF rules)
```

هذه الإعدادات كافية في معظم الحالات.

---

## ✅ التحقق

بعد حفظ Page Rule:

```bash
# اختبار SSE endpoint
curl -N -H "Accept: text/event-stream" https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
: connected

data: {"jsonrpc":"2.0","id":null,"result":{...}}
```

---

## ⚠️ ملاحظات مهمة

1. **Cache Level: Bypass** - **مهم جداً** للـ SSE ⭐
2. **Security Level** - غير متاح في Page Rules، يجب إضافته من **WAF Custom Rules**
3. **SSL: Full** - مطلوب للـ HTTPS
4. باقي الإعدادات يمكن تركها على Default

### 🔐 إضافة Security Level (من WAF):

بما أن Security Level غير متاح في Page Rules، يجب إضافته من:
- **Security** → **WAF** → **Custom Rules**
- أنشئ Rule جديد:
  - Expression: `(http.request.uri.path eq "/api/mcp")`
  - Action: `Skip` (all WAF rules)

---

## 🔗 روابط مفيدة

- [Cloudflare Page Rules Docs](https://developers.cloudflare.com/fundamentals/get-started/concepts/how-cloudflare-works/#page-rules)
- [SSE Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)

---

**تاريخ الإنشاء:** 2025-01-XX  
**الحالة:** ✅ جاهز للاستخدام

