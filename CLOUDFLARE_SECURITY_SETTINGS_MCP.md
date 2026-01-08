# 🔧 إعدادات Cloudflare Security التي قد تحجب MCP Endpoint

## ⚠️ الإعدادات التي قد تسبب المشكلة

### 1. **Browser Integrity Check** ⚠️ **مشكوك فيه**
- **المشكلة:** قد يحجب طلبات SSE من ElevenLabs
- **الحل:** إضافة exception للـ `/api/mcp`
- **الموقع:** Security → WAF → Browser Integrity Check → Create configuration rule

### 2. **Bot Fight Mode** ⚠️ **مشكوك فيه**
- **المشكلة:** قد يحجب طلبات من ElevenLabs كـ bot
- **الحل:** إضافة exception للـ `/api/mcp`
- **الموقع:** Security → Bot Fight Mode → Create configuration rule

### 3. **Block AI Bots** ⚠️ **مشكوك فيه**
- **المشكلة:** قد يحجب ElevenLabs (AI service)
- **الحل:** إضافة exception للـ `/api/mcp` أو تعطيله مؤقتاً
- **الموقع:** Security → Block AI Bots → Create configuration rule

### 4. **Rate Limiting** ⚠️ **مشكوك فيه**
- **المشكلة:** قد يحجب الطلبات المتكررة من SSE
- **الحل:** إضافة exception للـ `/api/mcp`
- **الموقع:** Security → Rate Limiting → Create rule

### 5. **Security Level** ✅ **آمن**
- **الحالة:** "Always protected" - لا يحتاج تغيير
- **ملاحظة:** Security Level غير متاح في Page Rules (تم إضافته من WAF Custom Rules)

---

## ✅ الحلول السريعة

### 1. إضافة Exception لـ Browser Integrity Check

في Cloudflare Dashboard:
1. **Security** → **WAF** → **Browser Integrity Check**
2. **Create configuration rule**
3. **Rule name:** `Allow MCP SSE`
4. **Expression:** `(http.request.uri.path eq "/api/mcp")`
5. **Action:** `Skip` أو `Allow`

### 2. إضافة Exception لـ Bot Fight Mode

في Cloudflare Dashboard:
1. **Security** → **Bot Fight Mode**
2. **Create configuration rule**
3. **Rule name:** `Allow MCP SSE`
4. **Expression:** `(http.request.uri.path eq "/api/mcp")`
5. **Action:** `Skip` أو `Allow`

### 3. إضافة Exception لـ Block AI Bots

في Cloudflare Dashboard:
1. **Security** → **Block AI Bots**
2. **Create configuration rule**
3. **Rule name:** `Allow MCP SSE`
4. **Expression:** `(http.request.uri.path eq "/api/mcp")`
5. **Action:** `Skip` أو `Allow`

### 4. إضافة Exception لـ Rate Limiting

في Cloudflare Dashboard:
1. **Security** → **Rate Limiting**
2. **Create rule**
3. **Rule name:** `Allow MCP SSE`
4. **Expression:** `(http.request.uri.path eq "/api/mcp")`
5. **Action:** `Skip rate limiting`

---

## 🎯 الإعدادات الموصى بها

### الإعدادات التي يجب إضافة Exceptions لها:

1. ✅ **Browser Integrity Check** - إضافة exception
2. ✅ **Bot Fight Mode** - إضافة exception
3. ✅ **Block AI Bots** - إضافة exception (أو تعطيل مؤقتاً)
4. ✅ **Rate Limiting** - إضافة exception

### الإعدادات الآمنة (لا تحتاج تغيير):

- ✅ Security Level - "Always protected" (آمن)
- ✅ DDoS Protection - Always active (آمن)
- ✅ SSL/TLS DDoS Protection - Always active (آمن)

---

## 📋 Checklist

- [ ] إضافة Exception لـ Browser Integrity Check
- [ ] إضافة Exception لـ Bot Fight Mode
- [ ] إضافة Exception لـ Block AI Bots
- [ ] إضافة Exception لـ Rate Limiting
- [ ] التحقق من Security Events بعد التعديلات

---

## 🔍 التحقق

بعد إضافة جميع Exceptions:

```bash
curl -N -H "Accept: text/event-stream" https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
: connected

data: {"jsonrpc":"2.0","id":null,"result":{...}}
```

---

**تاريخ الإنشاء:** 2025-01-XX  
**الحالة:** 🔧 قيد الإصلاح

