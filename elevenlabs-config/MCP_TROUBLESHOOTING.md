# حل مشاكل MCP Server - RARE 4N
## Troubleshooting Guide

---

## ❌ المشكلة: "Failed to connect to integration"

### الخطأ:
```
Internal error: Unexpected ExceptionGroup occurred while connecting to MCP server 
at https://api.zien-ai.app/api/mcp using TransportType.SSE transport.
```

---

## ✅ الحلول

### 1. التحقق من Backend Endpoint

#### أ. تحقق من أن الـ Route موجود:
```bash
# في server.js يجب أن يكون:
app.use('/api/mcp', mcpRouter);
```

#### ب. تحقق من أن الـ Server يعمل:
```bash
# اختبر الـ endpoint:
curl https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
: connected
data: {"jsonrpc":"2.0","method":"initialize",...}
```

---

### 2. إعدادات SSE (Server-Sent Events)

#### أ. Headers المطلوبة:
```javascript
res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');
res.setHeader('Access-Control-Allow-Origin', '*');
```

#### ب. Format الرسائل:
```
data: {"jsonrpc":"2.0","method":"initialize",...}\n\n
```

---

### 3. إعدادات ElevenLabs Dashboard

#### أ. Server URL:
```
https://api.zien-ai.app/api/mcp
```

#### ب. Server type:
- اختر: **SSE** (Server-Sent Events)
- أو: **Streamable HTTP**

#### ج. HTTP Headers:
```
Content-Type: text/event-stream
```

---

### 4. التحقق من CORS

#### أ. في server.js:
```javascript
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

---

### 5. التحقق من SSL/HTTPS

#### أ. تأكد من أن الـ URL يستخدم HTTPS:
```
✅ https://api.zien-ai.app/api/mcp
❌ http://api.zien-ai.app/api/mcp
```

#### ب. تأكد من أن SSL Certificate صالح

---

### 6. اختبار الـ Endpoint

#### أ. اختبار GET (SSE):
```bash
curl -N https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
: connected

data: {"jsonrpc":"2.0","method":"initialize",...}

data: {"jsonrpc":"2.0","method":"tools/list",...}

data: {"jsonrpc":"2.0","method":"resources/list",...}
```

#### ب. اختبار POST (JSON-RPC):
```bash
curl -X POST https://api.zien-ai.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

يجب أن ترى:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [...]
  }
}
```

---

### 7. Logs للتحقق

#### أ. Backend Logs:
```javascript
console.log('📡 MCP SSE Connection request');
console.log('📥 MCP Request:', { jsonrpc, method, params, id });
```

#### ب. تحقق من Logs في:
- Backend console
- Server logs
- Error logs

---

### 8. بديل: استخدام Streamable HTTP

إذا لم يعمل SSE، جرب:

#### أ. في ElevenLabs Dashboard:
- **Server type:** Streamable HTTP
- **Server URL:** `https://api.zien-ai.app/api/mcp`

#### ب. في Backend:
```javascript
// دعم Streamable HTTP
router.post('/', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked');
  // ... rest of code
});
```

---

### 9. التحقق من Network

#### أ. تحقق من Firewall:
- تأكد من أن Port 443 (HTTPS) مفتوح
- تأكد من أن Cloudflare لا يحجب الطلبات

#### ب. تحقق من DNS:
```bash
nslookup api.zien-ai.app
```

---

### 10. Contact Support

إذا استمرت المشكلة:

1. **جمع المعلومات:**
   - Backend logs
   - Network logs
   - Error messages

2. **تواصل مع:**
   - ElevenLabs Support
   - Backend Team

---

## ✅ Checklist

- [ ] Backend route موجود (`/api/mcp`)
- [ ] SSE headers صحيحة
- [ ] CORS مفعل
- [ ] SSL Certificate صالح
- [ ] GET endpoint يعمل (SSE)
- [ ] POST endpoint يعمل (JSON-RPC)
- [ ] Server URL صحيح في Dashboard
- [ ] Server type: SSE أو Streamable HTTP
- [ ] HTTP Headers صحيحة
- [ ] Network/Firewall لا يحجب الطلبات

---

## 🔗 روابط مفيدة

- **MCP Protocol:** https://modelcontextprotocol.io
- **SSE Documentation:** https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- **JSON-RPC 2.0:** https://www.jsonrpc.org/specification

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ دليل شامل

## Troubleshooting Guide

---

## ❌ المشكلة: "Failed to connect to integration"

### الخطأ:
```
Internal error: Unexpected ExceptionGroup occurred while connecting to MCP server 
at https://api.zien-ai.app/api/mcp using TransportType.SSE transport.
```

---

## ✅ الحلول

### 1. التحقق من Backend Endpoint

#### أ. تحقق من أن الـ Route موجود:
```bash
# في server.js يجب أن يكون:
app.use('/api/mcp', mcpRouter);
```

#### ب. تحقق من أن الـ Server يعمل:
```bash
# اختبر الـ endpoint:
curl https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
: connected
data: {"jsonrpc":"2.0","method":"initialize",...}
```

---

### 2. إعدادات SSE (Server-Sent Events)

#### أ. Headers المطلوبة:
```javascript
res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');
res.setHeader('Access-Control-Allow-Origin', '*');
```

#### ب. Format الرسائل:
```
data: {"jsonrpc":"2.0","method":"initialize",...}\n\n
```

---

### 3. إعدادات ElevenLabs Dashboard

#### أ. Server URL:
```
https://api.zien-ai.app/api/mcp
```

#### ب. Server type:
- اختر: **SSE** (Server-Sent Events)
- أو: **Streamable HTTP**

#### ج. HTTP Headers:
```
Content-Type: text/event-stream
```

---

### 4. التحقق من CORS

#### أ. في server.js:
```javascript
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

---

### 5. التحقق من SSL/HTTPS

#### أ. تأكد من أن الـ URL يستخدم HTTPS:
```
✅ https://api.zien-ai.app/api/mcp
❌ http://api.zien-ai.app/api/mcp
```

#### ب. تأكد من أن SSL Certificate صالح

---

### 6. اختبار الـ Endpoint

#### أ. اختبار GET (SSE):
```bash
curl -N https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
: connected

data: {"jsonrpc":"2.0","method":"initialize",...}

data: {"jsonrpc":"2.0","method":"tools/list",...}

data: {"jsonrpc":"2.0","method":"resources/list",...}
```

#### ب. اختبار POST (JSON-RPC):
```bash
curl -X POST https://api.zien-ai.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

يجب أن ترى:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [...]
  }
}
```

---

### 7. Logs للتحقق

#### أ. Backend Logs:
```javascript
console.log('📡 MCP SSE Connection request');
console.log('📥 MCP Request:', { jsonrpc, method, params, id });
```

#### ب. تحقق من Logs في:
- Backend console
- Server logs
- Error logs

---

### 8. بديل: استخدام Streamable HTTP

إذا لم يعمل SSE، جرب:

#### أ. في ElevenLabs Dashboard:
- **Server type:** Streamable HTTP
- **Server URL:** `https://api.zien-ai.app/api/mcp`

#### ب. في Backend:
```javascript
// دعم Streamable HTTP
router.post('/', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked');
  // ... rest of code
});
```

---

### 9. التحقق من Network

#### أ. تحقق من Firewall:
- تأكد من أن Port 443 (HTTPS) مفتوح
- تأكد من أن Cloudflare لا يحجب الطلبات

#### ب. تحقق من DNS:
```bash
nslookup api.zien-ai.app
```

---

### 10. Contact Support

إذا استمرت المشكلة:

1. **جمع المعلومات:**
   - Backend logs
   - Network logs
   - Error messages

2. **تواصل مع:**
   - ElevenLabs Support
   - Backend Team

---

## ✅ Checklist

- [ ] Backend route موجود (`/api/mcp`)
- [ ] SSE headers صحيحة
- [ ] CORS مفعل
- [ ] SSL Certificate صالح
- [ ] GET endpoint يعمل (SSE)
- [ ] POST endpoint يعمل (JSON-RPC)
- [ ] Server URL صحيح في Dashboard
- [ ] Server type: SSE أو Streamable HTTP
- [ ] HTTP Headers صحيحة
- [ ] Network/Firewall لا يحجب الطلبات

---

## 🔗 روابط مفيدة

- **MCP Protocol:** https://modelcontextprotocol.io
- **SSE Documentation:** https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- **JSON-RPC 2.0:** https://www.jsonrpc.org/specification

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ دليل شامل

## Troubleshooting Guide

---

## ❌ المشكلة: "Failed to connect to integration"

### الخطأ:
```
Internal error: Unexpected ExceptionGroup occurred while connecting to MCP server 
at https://api.zien-ai.app/api/mcp using TransportType.SSE transport.
```

---

## ✅ الحلول

### 1. التحقق من Backend Endpoint

#### أ. تحقق من أن الـ Route موجود:
```bash
# في server.js يجب أن يكون:
app.use('/api/mcp', mcpRouter);
```

#### ب. تحقق من أن الـ Server يعمل:
```bash
# اختبر الـ endpoint:
curl https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
: connected
data: {"jsonrpc":"2.0","method":"initialize",...}
```

---

### 2. إعدادات SSE (Server-Sent Events)

#### أ. Headers المطلوبة:
```javascript
res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');
res.setHeader('Access-Control-Allow-Origin', '*');
```

#### ب. Format الرسائل:
```
data: {"jsonrpc":"2.0","method":"initialize",...}\n\n
```

---

### 3. إعدادات ElevenLabs Dashboard

#### أ. Server URL:
```
https://api.zien-ai.app/api/mcp
```

#### ب. Server type:
- اختر: **SSE** (Server-Sent Events)
- أو: **Streamable HTTP**

#### ج. HTTP Headers:
```
Content-Type: text/event-stream
```

---

### 4. التحقق من CORS

#### أ. في server.js:
```javascript
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

---

### 5. التحقق من SSL/HTTPS

#### أ. تأكد من أن الـ URL يستخدم HTTPS:
```
✅ https://api.zien-ai.app/api/mcp
❌ http://api.zien-ai.app/api/mcp
```

#### ب. تأكد من أن SSL Certificate صالح

---

### 6. اختبار الـ Endpoint

#### أ. اختبار GET (SSE):
```bash
curl -N https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
: connected

data: {"jsonrpc":"2.0","method":"initialize",...}

data: {"jsonrpc":"2.0","method":"tools/list",...}

data: {"jsonrpc":"2.0","method":"resources/list",...}
```

#### ب. اختبار POST (JSON-RPC):
```bash
curl -X POST https://api.zien-ai.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

يجب أن ترى:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [...]
  }
}
```

---

### 7. Logs للتحقق

#### أ. Backend Logs:
```javascript
console.log('📡 MCP SSE Connection request');
console.log('📥 MCP Request:', { jsonrpc, method, params, id });
```

#### ب. تحقق من Logs في:
- Backend console
- Server logs
- Error logs

---

### 8. بديل: استخدام Streamable HTTP

إذا لم يعمل SSE، جرب:

#### أ. في ElevenLabs Dashboard:
- **Server type:** Streamable HTTP
- **Server URL:** `https://api.zien-ai.app/api/mcp`

#### ب. في Backend:
```javascript
// دعم Streamable HTTP
router.post('/', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked');
  // ... rest of code
});
```

---

### 9. التحقق من Network

#### أ. تحقق من Firewall:
- تأكد من أن Port 443 (HTTPS) مفتوح
- تأكد من أن Cloudflare لا يحجب الطلبات

#### ب. تحقق من DNS:
```bash
nslookup api.zien-ai.app
```

---

### 10. Contact Support

إذا استمرت المشكلة:

1. **جمع المعلومات:**
   - Backend logs
   - Network logs
   - Error messages

2. **تواصل مع:**
   - ElevenLabs Support
   - Backend Team

---

## ✅ Checklist

- [ ] Backend route موجود (`/api/mcp`)
- [ ] SSE headers صحيحة
- [ ] CORS مفعل
- [ ] SSL Certificate صالح
- [ ] GET endpoint يعمل (SSE)
- [ ] POST endpoint يعمل (JSON-RPC)
- [ ] Server URL صحيح في Dashboard
- [ ] Server type: SSE أو Streamable HTTP
- [ ] HTTP Headers صحيحة
- [ ] Network/Firewall لا يحجب الطلبات

---

## 🔗 روابط مفيدة

- **MCP Protocol:** https://modelcontextprotocol.io
- **SSE Documentation:** https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- **JSON-RPC 2.0:** https://www.jsonrpc.org/specification

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ دليل شامل

## Troubleshooting Guide

---

## ❌ المشكلة: "Failed to connect to integration"

### الخطأ:
```
Internal error: Unexpected ExceptionGroup occurred while connecting to MCP server 
at https://api.zien-ai.app/api/mcp using TransportType.SSE transport.
```

---

## ✅ الحلول

### 1. التحقق من Backend Endpoint

#### أ. تحقق من أن الـ Route موجود:
```bash
# في server.js يجب أن يكون:
app.use('/api/mcp', mcpRouter);
```

#### ب. تحقق من أن الـ Server يعمل:
```bash
# اختبر الـ endpoint:
curl https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
: connected
data: {"jsonrpc":"2.0","method":"initialize",...}
```

---

### 2. إعدادات SSE (Server-Sent Events)

#### أ. Headers المطلوبة:
```javascript
res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');
res.setHeader('Access-Control-Allow-Origin', '*');
```

#### ب. Format الرسائل:
```
data: {"jsonrpc":"2.0","method":"initialize",...}\n\n
```

---

### 3. إعدادات ElevenLabs Dashboard

#### أ. Server URL:
```
https://api.zien-ai.app/api/mcp
```

#### ب. Server type:
- اختر: **SSE** (Server-Sent Events)
- أو: **Streamable HTTP**

#### ج. HTTP Headers:
```
Content-Type: text/event-stream
```

---

### 4. التحقق من CORS

#### أ. في server.js:
```javascript
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

---

### 5. التحقق من SSL/HTTPS

#### أ. تأكد من أن الـ URL يستخدم HTTPS:
```
✅ https://api.zien-ai.app/api/mcp
❌ http://api.zien-ai.app/api/mcp
```

#### ب. تأكد من أن SSL Certificate صالح

---

### 6. اختبار الـ Endpoint

#### أ. اختبار GET (SSE):
```bash
curl -N https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
: connected

data: {"jsonrpc":"2.0","method":"initialize",...}

data: {"jsonrpc":"2.0","method":"tools/list",...}

data: {"jsonrpc":"2.0","method":"resources/list",...}
```

#### ب. اختبار POST (JSON-RPC):
```bash
curl -X POST https://api.zien-ai.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

يجب أن ترى:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [...]
  }
}
```

---

### 7. Logs للتحقق

#### أ. Backend Logs:
```javascript
console.log('📡 MCP SSE Connection request');
console.log('📥 MCP Request:', { jsonrpc, method, params, id });
```

#### ب. تحقق من Logs في:
- Backend console
- Server logs
- Error logs

---

### 8. بديل: استخدام Streamable HTTP

إذا لم يعمل SSE، جرب:

#### أ. في ElevenLabs Dashboard:
- **Server type:** Streamable HTTP
- **Server URL:** `https://api.zien-ai.app/api/mcp`

#### ب. في Backend:
```javascript
// دعم Streamable HTTP
router.post('/', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked');
  // ... rest of code
});
```

---

### 9. التحقق من Network

#### أ. تحقق من Firewall:
- تأكد من أن Port 443 (HTTPS) مفتوح
- تأكد من أن Cloudflare لا يحجب الطلبات

#### ب. تحقق من DNS:
```bash
nslookup api.zien-ai.app
```

---

### 10. Contact Support

إذا استمرت المشكلة:

1. **جمع المعلومات:**
   - Backend logs
   - Network logs
   - Error messages

2. **تواصل مع:**
   - ElevenLabs Support
   - Backend Team

---

## ✅ Checklist

- [ ] Backend route موجود (`/api/mcp`)
- [ ] SSE headers صحيحة
- [ ] CORS مفعل
- [ ] SSL Certificate صالح
- [ ] GET endpoint يعمل (SSE)
- [ ] POST endpoint يعمل (JSON-RPC)
- [ ] Server URL صحيح في Dashboard
- [ ] Server type: SSE أو Streamable HTTP
- [ ] HTTP Headers صحيحة
- [ ] Network/Firewall لا يحجب الطلبات

---

## 🔗 روابط مفيدة

- **MCP Protocol:** https://modelcontextprotocol.io
- **SSE Documentation:** https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- **JSON-RPC 2.0:** https://www.jsonrpc.org/specification

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ دليل شامل

## Troubleshooting Guide

---

## ❌ المشكلة: "Failed to connect to integration"

### الخطأ:
```
Internal error: Unexpected ExceptionGroup occurred while connecting to MCP server 
at https://api.zien-ai.app/api/mcp using TransportType.SSE transport.
```

---

## ✅ الحلول

### 1. التحقق من Backend Endpoint

#### أ. تحقق من أن الـ Route موجود:
```bash
# في server.js يجب أن يكون:
app.use('/api/mcp', mcpRouter);
```

#### ب. تحقق من أن الـ Server يعمل:
```bash
# اختبر الـ endpoint:
curl https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
: connected
data: {"jsonrpc":"2.0","method":"initialize",...}
```

---

### 2. إعدادات SSE (Server-Sent Events)

#### أ. Headers المطلوبة:
```javascript
res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');
res.setHeader('Access-Control-Allow-Origin', '*');
```

#### ب. Format الرسائل:
```
data: {"jsonrpc":"2.0","method":"initialize",...}\n\n
```

---

### 3. إعدادات ElevenLabs Dashboard

#### أ. Server URL:
```
https://api.zien-ai.app/api/mcp
```

#### ب. Server type:
- اختر: **SSE** (Server-Sent Events)
- أو: **Streamable HTTP**

#### ج. HTTP Headers:
```
Content-Type: text/event-stream
```

---

### 4. التحقق من CORS

#### أ. في server.js:
```javascript
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

---

### 5. التحقق من SSL/HTTPS

#### أ. تأكد من أن الـ URL يستخدم HTTPS:
```
✅ https://api.zien-ai.app/api/mcp
❌ http://api.zien-ai.app/api/mcp
```

#### ب. تأكد من أن SSL Certificate صالح

---

### 6. اختبار الـ Endpoint

#### أ. اختبار GET (SSE):
```bash
curl -N https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
: connected

data: {"jsonrpc":"2.0","method":"initialize",...}

data: {"jsonrpc":"2.0","method":"tools/list",...}

data: {"jsonrpc":"2.0","method":"resources/list",...}
```

#### ب. اختبار POST (JSON-RPC):
```bash
curl -X POST https://api.zien-ai.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

يجب أن ترى:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [...]
  }
}
```

---

### 7. Logs للتحقق

#### أ. Backend Logs:
```javascript
console.log('📡 MCP SSE Connection request');
console.log('📥 MCP Request:', { jsonrpc, method, params, id });
```

#### ب. تحقق من Logs في:
- Backend console
- Server logs
- Error logs

---

### 8. بديل: استخدام Streamable HTTP

إذا لم يعمل SSE، جرب:

#### أ. في ElevenLabs Dashboard:
- **Server type:** Streamable HTTP
- **Server URL:** `https://api.zien-ai.app/api/mcp`

#### ب. في Backend:
```javascript
// دعم Streamable HTTP
router.post('/', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked');
  // ... rest of code
});
```

---

### 9. التحقق من Network

#### أ. تحقق من Firewall:
- تأكد من أن Port 443 (HTTPS) مفتوح
- تأكد من أن Cloudflare لا يحجب الطلبات

#### ب. تحقق من DNS:
```bash
nslookup api.zien-ai.app
```

---

### 10. Contact Support

إذا استمرت المشكلة:

1. **جمع المعلومات:**
   - Backend logs
   - Network logs
   - Error messages

2. **تواصل مع:**
   - ElevenLabs Support
   - Backend Team

---

## ✅ Checklist

- [ ] Backend route موجود (`/api/mcp`)
- [ ] SSE headers صحيحة
- [ ] CORS مفعل
- [ ] SSL Certificate صالح
- [ ] GET endpoint يعمل (SSE)
- [ ] POST endpoint يعمل (JSON-RPC)
- [ ] Server URL صحيح في Dashboard
- [ ] Server type: SSE أو Streamable HTTP
- [ ] HTTP Headers صحيحة
- [ ] Network/Firewall لا يحجب الطلبات

---

## 🔗 روابط مفيدة

- **MCP Protocol:** https://modelcontextprotocol.io
- **SSE Documentation:** https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- **JSON-RPC 2.0:** https://www.jsonrpc.org/specification

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ دليل شامل

## Troubleshooting Guide

---

## ❌ المشكلة: "Failed to connect to integration"

### الخطأ:
```
Internal error: Unexpected ExceptionGroup occurred while connecting to MCP server 
at https://api.zien-ai.app/api/mcp using TransportType.SSE transport.
```

---

## ✅ الحلول

### 1. التحقق من Backend Endpoint

#### أ. تحقق من أن الـ Route موجود:
```bash
# في server.js يجب أن يكون:
app.use('/api/mcp', mcpRouter);
```

#### ب. تحقق من أن الـ Server يعمل:
```bash
# اختبر الـ endpoint:
curl https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
: connected
data: {"jsonrpc":"2.0","method":"initialize",...}
```

---

### 2. إعدادات SSE (Server-Sent Events)

#### أ. Headers المطلوبة:
```javascript
res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');
res.setHeader('Access-Control-Allow-Origin', '*');
```

#### ب. Format الرسائل:
```
data: {"jsonrpc":"2.0","method":"initialize",...}\n\n
```

---

### 3. إعدادات ElevenLabs Dashboard

#### أ. Server URL:
```
https://api.zien-ai.app/api/mcp
```

#### ب. Server type:
- اختر: **SSE** (Server-Sent Events)
- أو: **Streamable HTTP**

#### ج. HTTP Headers:
```
Content-Type: text/event-stream
```

---

### 4. التحقق من CORS

#### أ. في server.js:
```javascript
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

---

### 5. التحقق من SSL/HTTPS

#### أ. تأكد من أن الـ URL يستخدم HTTPS:
```
✅ https://api.zien-ai.app/api/mcp
❌ http://api.zien-ai.app/api/mcp
```

#### ب. تأكد من أن SSL Certificate صالح

---

### 6. اختبار الـ Endpoint

#### أ. اختبار GET (SSE):
```bash
curl -N https://api.zien-ai.app/api/mcp
```

يجب أن ترى:
```
: connected

data: {"jsonrpc":"2.0","method":"initialize",...}

data: {"jsonrpc":"2.0","method":"tools/list",...}

data: {"jsonrpc":"2.0","method":"resources/list",...}
```

#### ب. اختبار POST (JSON-RPC):
```bash
curl -X POST https://api.zien-ai.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

يجب أن ترى:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [...]
  }
}
```

---

### 7. Logs للتحقق

#### أ. Backend Logs:
```javascript
console.log('📡 MCP SSE Connection request');
console.log('📥 MCP Request:', { jsonrpc, method, params, id });
```

#### ب. تحقق من Logs في:
- Backend console
- Server logs
- Error logs

---

### 8. بديل: استخدام Streamable HTTP

إذا لم يعمل SSE، جرب:

#### أ. في ElevenLabs Dashboard:
- **Server type:** Streamable HTTP
- **Server URL:** `https://api.zien-ai.app/api/mcp`

#### ب. في Backend:
```javascript
// دعم Streamable HTTP
router.post('/', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked');
  // ... rest of code
});
```

---

### 9. التحقق من Network

#### أ. تحقق من Firewall:
- تأكد من أن Port 443 (HTTPS) مفتوح
- تأكد من أن Cloudflare لا يحجب الطلبات

#### ب. تحقق من DNS:
```bash
nslookup api.zien-ai.app
```

---

### 10. Contact Support

إذا استمرت المشكلة:

1. **جمع المعلومات:**
   - Backend logs
   - Network logs
   - Error messages

2. **تواصل مع:**
   - ElevenLabs Support
   - Backend Team

---

## ✅ Checklist

- [ ] Backend route موجود (`/api/mcp`)
- [ ] SSE headers صحيحة
- [ ] CORS مفعل
- [ ] SSL Certificate صالح
- [ ] GET endpoint يعمل (SSE)
- [ ] POST endpoint يعمل (JSON-RPC)
- [ ] Server URL صحيح في Dashboard
- [ ] Server type: SSE أو Streamable HTTP
- [ ] HTTP Headers صحيحة
- [ ] Network/Firewall لا يحجب الطلبات

---

## 🔗 روابط مفيدة

- **MCP Protocol:** https://modelcontextprotocol.io
- **SSE Documentation:** https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- **JSON-RPC 2.0:** https://www.jsonrpc.org/specification

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ دليل شامل

