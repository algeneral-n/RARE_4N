# 🔧 إصلاح MCP SSE على Cloudflare - دليل سريع

## ✅ المشكلة
```
Failed to connect to integration
Unexpected ExceptionGroup occurred while connecting to MCP server at https://api.zien-ai.app/api/mcp using TransportType.SSE transport
```

## ✅ الحل السريع

### 1. إضافة Cloudflare WAF Rule

في **Cloudflare Dashboard** → **Security** → **WAF** → **Custom Rules**:

```
Rule name: Allow MCP SSE Endpoint
Expression: (http.request.uri.path eq "/api/mcp")
Action: Skip (all WAF rules)
```

### 2. إضافة Page Rule

في **Cloudflare Dashboard** → **Rules** → **Page Rules**:

```
URL: api.zien-ai.app/api/mcp*

Settings (الإعدادات المطلوبة - المتاحة فعلاً):
✅ Cache Level: Bypass (مهم جداً) ⭐
✅ SSL: Full أو Full (strict)

⚠️ ملاحظة: Security Level غير متاح في Page Rules
يجب إضافته من WAF Custom Rules (انظر أدناه)

Settings (الإعدادات التي يجب إيقافها - إذا كانت متاحة):
❌ Always Use HTTPS: Off أو Default
❌ Automatic HTTPS Rewrites: Off
❌ Browser Cache TTL: Respect Existing Headers أو Bypass
❌ Browser Integrity Check: Off (إذا كان متاح)
❌ Cache Deception Armor: Off (إذا كان متاح)
❌ Edge Cache TTL: Bypass أو 0
❌ Email Obfuscation: Off
❌ IP Geolocation Header: Off أو Default
❌ Opportunistic Encryption: Off أو Default
❌ Origin Cache Control: Off
❌ Rocket Loader: Off

Settings (اختياري - إذا كان متاح):
⚠️ Disable Zaraz: On
⚠️ Disable Apps: On
```

**ملاحظة:** الحد الأدنى المطلوب في Page Rule:
- Cache Level: Bypass ⭐
- SSL: Full

**⚠️ مهم:** Security Level غير متاح في Page Rules
يجب إضافته من **WAF Custom Rules** (انظر الخطوة 1 أعلاه)

### 3. إضافة Transform Rule (لإضافة Headers)

في **Cloudflare Dashboard** → **Rules** → **Transform Rules** → **Modify Response Header**:

```
Rule name: MCP SSE Headers
When: (http.request.uri.path eq "/api/mcp")
Then:
- Set static: Access-Control-Allow-Origin = *
- Set static: Access-Control-Allow-Methods = GET, POST, OPTIONS
- Set static: Access-Control-Allow-Headers = Content-Type, Authorization, Cache-Control, Last-Event-ID
- Set static: Cache-Control = no-cache, no-transform
```

---

## 🔍 التحقق

بعد إضافة Rules:

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

## ⚠️ ملاحظات

1. **SSE** يحتاج connection مستمر - Cloudflare قد يقطع بعد timeout
2. **Keep-alive** messages مهمة
3. **No caching** - تأكد من Bypass Cache
4. **WAF** - تأكد من Skip rules للـ MCP endpoint

---

## ✅ ما تم إصلاحه في الكود

1. ✅ Error handling محسّن
2. ✅ JSON-RPC format صحيح
3. ✅ Keep-alive mechanism
4. ✅ Connection cleanup

---

**الخطوة التالية:** أضف Rules في Cloudflare Dashboard

