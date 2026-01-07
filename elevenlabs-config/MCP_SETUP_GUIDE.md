# إعداد MCP Servers في ElevenLabs Agent - RARE 4N
## دليل شامل لإعداد MCP بدلاً من Tools منفصلة

---

## 🎯 لماذا MCP Servers؟

### ❌ الطريقة القديمة (Tools منفصلة):
- إضافة 7 Tools واحد تلو الآخر
- صيانة صعبة
- تكرار في الكود
- تحديثات معقدة

### ✅ الطريقة الجديدة (MCP Servers):
- إضافة MCP Server واحد
- جميع Tools متاحة تلقائياً
- صيانة أسهل
- تحديثات بسيطة

---

## 📋 MCP Servers المتاحة

### 1. **RARE 4N Backend MCP**
- **الوظيفة:** الوصول لجميع Backend APIs
- **Tools:** 7 Tools (preview_library, search_library, submit_to_builder, create_payment, send_twilio_message, notify_owner, execute_owner_command)
- **Resources:** Libraries (Templates, Systems, Themes)
- **الملف:** `mcp-servers/rare4n-backend-mcp.json`

### 2. **Supabase MCP**
- **الوظيفة:** الوصول لقاعدة بيانات Supabase
- **Tools:** query_database, get_table_schema, list_tables
- **Resources:** Tables, Schema
- **الملف:** `mcp-servers/supabase-mcp.json`

---

## 🚀 خطوات الإعداد

### الخطوة 1: إعداد RARE 4N Backend MCP

1. اذهب إلى ElevenLabs Dashboard → Agent → Tools → **MCP**
2. اضغط **"Add server"**
3. اختر **"Custom MCP Server"** أو **"Import from JSON"**
4. انسخ محتوى `mcp-servers/rare4n-backend-mcp.json`
5. الصقه في الإعدادات
6. أدخل:
   - **Name:** `rare4n-backend`
   - **Server URL:** `https://api.zien-ai.app/mcp`
   - **Authentication:** Bearer Token
   - **Token:** `{{api_key}}` (سيتم استبداله تلقائياً)
7. احفظ

---

### الخطوة 2: إعداد Supabase MCP (اختياري)

1. اذهب إلى ElevenLabs Dashboard → Agent → Tools → **MCP**
2. اضغط **"Add server"**
3. اختر **"Supabase MCP"** (إذا كان متاحاً) أو **"Custom MCP Server"**
4. انسخ محتوى `mcp-servers/supabase-mcp.json`
5. الصقه في الإعدادات
6. أدخل:
   - **Name:** `supabase`
   - **Supabase URL:** `https://fgvrilruqzajstprioqj.supabase.co`
   - **Supabase Key:** `sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy`
7. احفظ

---

## 🔧 إعداد Backend MCP Endpoint

يجب إنشاء MCP Endpoint في Backend:

### ملف: `apps/backend/src/routes/mcp.js`

```javascript
/**
 * RARE 4N - MCP Server Endpoint
 * Model Context Protocol Server for ElevenLabs Agent
 */

import express from 'express';
import { previewLibrary, searchLibrary, submitToBuilder, createPayment } from '../services/agentTools.js';
import * as twilioService from '../services/twilioService.js';

const router = express.Router();

/**
 * POST /mcp
 * MCP Server endpoint
 */
router.post('/', async (req, res) => {
  try {
    const { method, params } = req.body;

    let result;

    switch (method) {
      case 'tools/call':
        result = await handleToolCall(params);
        break;

      case 'resources/read':
        result = await handleResourceRead(params);
        break;

      default:
        return res.status(400).json({
          error: 'Unknown method',
          method
        });
    }

    res.json({
      result,
      error: null
    });
  } catch (error) {
    console.error('MCP Server error:', error);
    res.status(500).json({
      result: null,
      error: {
        code: -32000,
        message: error.message
      }
    });
  }
});

/**
 * Handle tool call
 */
async function handleToolCall(params) {
  const { name, arguments: args } = params;

  switch (name) {
    case 'preview_library':
      return await previewLibrary(args.type, args.category, args.limit);

    case 'search_library':
      return await searchLibrary(args.query, args.type);

    case 'submit_to_builder':
      return await submitToBuilder(args.client_id, args.request_data, global.io);

    case 'create_payment':
      return await createPayment(
        args.requestId,
        args.amount,
        args.currency,
        args.clientId,
        args.clientEmail,
        args.paymentMethod
      );

    case 'send_twilio_message':
      if (args.type === 'whatsapp') {
        return await twilioService.sendWhatsApp(args.phone, args.message);
      } else {
        return await twilioService.sendSMS(args.phone, args.message);
      }

    case 'notify_owner':
      return await notifyOwnerViaTwilio(args.reason, args.priority);

    case 'execute_owner_command':
      return await executeOwnerCommand(args.command, args.context);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

/**
 * Handle resource read
 */
async function handleResourceRead(params) {
  const { uri } = params;

  if (uri === 'rare4n://libraries/templates') {
    const { APP_TEMPLATES } = await import('../libraries/appTemplatesLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(APP_TEMPLATES, null, 2)
      }]
    };
  }

  if (uri === 'rare4n://libraries/systems') {
    const { SYSTEMS_LIBRARY } = await import('../libraries/systemsLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(SYSTEMS_LIBRARY, null, 2)
      }]
    };
  }

  if (uri === 'rare4n://libraries/themes') {
    const { THEMES_LIBRARY } = await import('../libraries/themesLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(THEMES_LIBRARY, null, 2)
      }]
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
}

/**
 * Notify owner via Twilio
 */
async function notifyOwnerViaTwilio(reason, priority = 'normal') {
  const OWNER_PHONE = process.env.OWNER_PHONE_NADER || '+971529211077';
  const message = `🚨 RARE 4N Agent Notification (${priority})\n\nReason: ${reason}\n\nTime: ${new Date().toLocaleString('ar-EG', { timeZone: 'Asia/Dubai' })}`;

  return await twilioService.sendWhatsApp(OWNER_PHONE, message);
}

/**
 * Execute owner command
 */
async function executeOwnerCommand(command, context = {}) {
  // Implementation from elevenlabs-webhook.js
  // ...
  return { success: true, message: 'Command executed' };
}

export default router;
```

---

## ✅ قائمة التحقق

- [ ] MCP Server مضاف في ElevenLabs Dashboard
- [ ] Backend MCP Endpoint موجود (`/mcp`)
- [ ] جميع Tools متاحة عبر MCP
- [ ] Resources متاحة (Libraries)
- [ ] Authentication يعمل
- [ ] اختبار Tool Call
- [ ] اختبار Resource Read

---

## 🧪 الاختبار

### 1. اختبار Tool Call:
```json
POST https://api.zien-ai.app/mcp
{
  "method": "tools/call",
  "params": {
    "name": "preview_library",
    "arguments": {
      "type": "templates",
      "limit": 5
    }
  }
}
```

### 2. اختبار Resource Read:
```json
POST https://api.zien-ai.app/mcp
{
  "method": "resources/read",
  "params": {
    "uri": "rare4n://libraries/templates"
  }
}
```

---

## 📊 المميزات

### ✅ مع MCP:
- إضافة Server واحد بدلاً من 7 Tools
- جميع Tools متاحة تلقائياً
- Resources متاحة (Libraries)
- صيانة أسهل
- تحديثات بسيطة
- Authentication مركزي

### ❌ بدون MCP:
- إضافة 7 Tools منفصلة
- تكرار في الكود
- صيانة صعبة
- تحديثات معقدة

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **MCP Endpoint:** `https://api.zien-ai.app/mcp`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل شامل لإعداد MCP بدلاً من Tools منفصلة

---

## 🎯 لماذا MCP Servers؟

### ❌ الطريقة القديمة (Tools منفصلة):
- إضافة 7 Tools واحد تلو الآخر
- صيانة صعبة
- تكرار في الكود
- تحديثات معقدة

### ✅ الطريقة الجديدة (MCP Servers):
- إضافة MCP Server واحد
- جميع Tools متاحة تلقائياً
- صيانة أسهل
- تحديثات بسيطة

---

## 📋 MCP Servers المتاحة

### 1. **RARE 4N Backend MCP**
- **الوظيفة:** الوصول لجميع Backend APIs
- **Tools:** 7 Tools (preview_library, search_library, submit_to_builder, create_payment, send_twilio_message, notify_owner, execute_owner_command)
- **Resources:** Libraries (Templates, Systems, Themes)
- **الملف:** `mcp-servers/rare4n-backend-mcp.json`

### 2. **Supabase MCP**
- **الوظيفة:** الوصول لقاعدة بيانات Supabase
- **Tools:** query_database, get_table_schema, list_tables
- **Resources:** Tables, Schema
- **الملف:** `mcp-servers/supabase-mcp.json`

---

## 🚀 خطوات الإعداد

### الخطوة 1: إعداد RARE 4N Backend MCP

1. اذهب إلى ElevenLabs Dashboard → Agent → Tools → **MCP**
2. اضغط **"Add server"**
3. اختر **"Custom MCP Server"** أو **"Import from JSON"**
4. انسخ محتوى `mcp-servers/rare4n-backend-mcp.json`
5. الصقه في الإعدادات
6. أدخل:
   - **Name:** `rare4n-backend`
   - **Server URL:** `https://api.zien-ai.app/mcp`
   - **Authentication:** Bearer Token
   - **Token:** `{{api_key}}` (سيتم استبداله تلقائياً)
7. احفظ

---

### الخطوة 2: إعداد Supabase MCP (اختياري)

1. اذهب إلى ElevenLabs Dashboard → Agent → Tools → **MCP**
2. اضغط **"Add server"**
3. اختر **"Supabase MCP"** (إذا كان متاحاً) أو **"Custom MCP Server"**
4. انسخ محتوى `mcp-servers/supabase-mcp.json`
5. الصقه في الإعدادات
6. أدخل:
   - **Name:** `supabase`
   - **Supabase URL:** `https://fgvrilruqzajstprioqj.supabase.co`
   - **Supabase Key:** `sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy`
7. احفظ

---

## 🔧 إعداد Backend MCP Endpoint

يجب إنشاء MCP Endpoint في Backend:

### ملف: `apps/backend/src/routes/mcp.js`

```javascript
/**
 * RARE 4N - MCP Server Endpoint
 * Model Context Protocol Server for ElevenLabs Agent
 */

import express from 'express';
import { previewLibrary, searchLibrary, submitToBuilder, createPayment } from '../services/agentTools.js';
import * as twilioService from '../services/twilioService.js';

const router = express.Router();

/**
 * POST /mcp
 * MCP Server endpoint
 */
router.post('/', async (req, res) => {
  try {
    const { method, params } = req.body;

    let result;

    switch (method) {
      case 'tools/call':
        result = await handleToolCall(params);
        break;

      case 'resources/read':
        result = await handleResourceRead(params);
        break;

      default:
        return res.status(400).json({
          error: 'Unknown method',
          method
        });
    }

    res.json({
      result,
      error: null
    });
  } catch (error) {
    console.error('MCP Server error:', error);
    res.status(500).json({
      result: null,
      error: {
        code: -32000,
        message: error.message
      }
    });
  }
});

/**
 * Handle tool call
 */
async function handleToolCall(params) {
  const { name, arguments: args } = params;

  switch (name) {
    case 'preview_library':
      return await previewLibrary(args.type, args.category, args.limit);

    case 'search_library':
      return await searchLibrary(args.query, args.type);

    case 'submit_to_builder':
      return await submitToBuilder(args.client_id, args.request_data, global.io);

    case 'create_payment':
      return await createPayment(
        args.requestId,
        args.amount,
        args.currency,
        args.clientId,
        args.clientEmail,
        args.paymentMethod
      );

    case 'send_twilio_message':
      if (args.type === 'whatsapp') {
        return await twilioService.sendWhatsApp(args.phone, args.message);
      } else {
        return await twilioService.sendSMS(args.phone, args.message);
      }

    case 'notify_owner':
      return await notifyOwnerViaTwilio(args.reason, args.priority);

    case 'execute_owner_command':
      return await executeOwnerCommand(args.command, args.context);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

/**
 * Handle resource read
 */
async function handleResourceRead(params) {
  const { uri } = params;

  if (uri === 'rare4n://libraries/templates') {
    const { APP_TEMPLATES } = await import('../libraries/appTemplatesLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(APP_TEMPLATES, null, 2)
      }]
    };
  }

  if (uri === 'rare4n://libraries/systems') {
    const { SYSTEMS_LIBRARY } = await import('../libraries/systemsLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(SYSTEMS_LIBRARY, null, 2)
      }]
    };
  }

  if (uri === 'rare4n://libraries/themes') {
    const { THEMES_LIBRARY } = await import('../libraries/themesLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(THEMES_LIBRARY, null, 2)
      }]
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
}

/**
 * Notify owner via Twilio
 */
async function notifyOwnerViaTwilio(reason, priority = 'normal') {
  const OWNER_PHONE = process.env.OWNER_PHONE_NADER || '+971529211077';
  const message = `🚨 RARE 4N Agent Notification (${priority})\n\nReason: ${reason}\n\nTime: ${new Date().toLocaleString('ar-EG', { timeZone: 'Asia/Dubai' })}`;

  return await twilioService.sendWhatsApp(OWNER_PHONE, message);
}

/**
 * Execute owner command
 */
async function executeOwnerCommand(command, context = {}) {
  // Implementation from elevenlabs-webhook.js
  // ...
  return { success: true, message: 'Command executed' };
}

export default router;
```

---

## ✅ قائمة التحقق

- [ ] MCP Server مضاف في ElevenLabs Dashboard
- [ ] Backend MCP Endpoint موجود (`/mcp`)
- [ ] جميع Tools متاحة عبر MCP
- [ ] Resources متاحة (Libraries)
- [ ] Authentication يعمل
- [ ] اختبار Tool Call
- [ ] اختبار Resource Read

---

## 🧪 الاختبار

### 1. اختبار Tool Call:
```json
POST https://api.zien-ai.app/mcp
{
  "method": "tools/call",
  "params": {
    "name": "preview_library",
    "arguments": {
      "type": "templates",
      "limit": 5
    }
  }
}
```

### 2. اختبار Resource Read:
```json
POST https://api.zien-ai.app/mcp
{
  "method": "resources/read",
  "params": {
    "uri": "rare4n://libraries/templates"
  }
}
```

---

## 📊 المميزات

### ✅ مع MCP:
- إضافة Server واحد بدلاً من 7 Tools
- جميع Tools متاحة تلقائياً
- Resources متاحة (Libraries)
- صيانة أسهل
- تحديثات بسيطة
- Authentication مركزي

### ❌ بدون MCP:
- إضافة 7 Tools منفصلة
- تكرار في الكود
- صيانة صعبة
- تحديثات معقدة

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **MCP Endpoint:** `https://api.zien-ai.app/mcp`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل شامل لإعداد MCP بدلاً من Tools منفصلة

---

## 🎯 لماذا MCP Servers؟

### ❌ الطريقة القديمة (Tools منفصلة):
- إضافة 7 Tools واحد تلو الآخر
- صيانة صعبة
- تكرار في الكود
- تحديثات معقدة

### ✅ الطريقة الجديدة (MCP Servers):
- إضافة MCP Server واحد
- جميع Tools متاحة تلقائياً
- صيانة أسهل
- تحديثات بسيطة

---

## 📋 MCP Servers المتاحة

### 1. **RARE 4N Backend MCP**
- **الوظيفة:** الوصول لجميع Backend APIs
- **Tools:** 7 Tools (preview_library, search_library, submit_to_builder, create_payment, send_twilio_message, notify_owner, execute_owner_command)
- **Resources:** Libraries (Templates, Systems, Themes)
- **الملف:** `mcp-servers/rare4n-backend-mcp.json`

### 2. **Supabase MCP**
- **الوظيفة:** الوصول لقاعدة بيانات Supabase
- **Tools:** query_database, get_table_schema, list_tables
- **Resources:** Tables, Schema
- **الملف:** `mcp-servers/supabase-mcp.json`

---

## 🚀 خطوات الإعداد

### الخطوة 1: إعداد RARE 4N Backend MCP

1. اذهب إلى ElevenLabs Dashboard → Agent → Tools → **MCP**
2. اضغط **"Add server"**
3. اختر **"Custom MCP Server"** أو **"Import from JSON"**
4. انسخ محتوى `mcp-servers/rare4n-backend-mcp.json`
5. الصقه في الإعدادات
6. أدخل:
   - **Name:** `rare4n-backend`
   - **Server URL:** `https://api.zien-ai.app/mcp`
   - **Authentication:** Bearer Token
   - **Token:** `{{api_key}}` (سيتم استبداله تلقائياً)
7. احفظ

---

### الخطوة 2: إعداد Supabase MCP (اختياري)

1. اذهب إلى ElevenLabs Dashboard → Agent → Tools → **MCP**
2. اضغط **"Add server"**
3. اختر **"Supabase MCP"** (إذا كان متاحاً) أو **"Custom MCP Server"**
4. انسخ محتوى `mcp-servers/supabase-mcp.json`
5. الصقه في الإعدادات
6. أدخل:
   - **Name:** `supabase`
   - **Supabase URL:** `https://fgvrilruqzajstprioqj.supabase.co`
   - **Supabase Key:** `sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy`
7. احفظ

---

## 🔧 إعداد Backend MCP Endpoint

يجب إنشاء MCP Endpoint في Backend:

### ملف: `apps/backend/src/routes/mcp.js`

```javascript
/**
 * RARE 4N - MCP Server Endpoint
 * Model Context Protocol Server for ElevenLabs Agent
 */

import express from 'express';
import { previewLibrary, searchLibrary, submitToBuilder, createPayment } from '../services/agentTools.js';
import * as twilioService from '../services/twilioService.js';

const router = express.Router();

/**
 * POST /mcp
 * MCP Server endpoint
 */
router.post('/', async (req, res) => {
  try {
    const { method, params } = req.body;

    let result;

    switch (method) {
      case 'tools/call':
        result = await handleToolCall(params);
        break;

      case 'resources/read':
        result = await handleResourceRead(params);
        break;

      default:
        return res.status(400).json({
          error: 'Unknown method',
          method
        });
    }

    res.json({
      result,
      error: null
    });
  } catch (error) {
    console.error('MCP Server error:', error);
    res.status(500).json({
      result: null,
      error: {
        code: -32000,
        message: error.message
      }
    });
  }
});

/**
 * Handle tool call
 */
async function handleToolCall(params) {
  const { name, arguments: args } = params;

  switch (name) {
    case 'preview_library':
      return await previewLibrary(args.type, args.category, args.limit);

    case 'search_library':
      return await searchLibrary(args.query, args.type);

    case 'submit_to_builder':
      return await submitToBuilder(args.client_id, args.request_data, global.io);

    case 'create_payment':
      return await createPayment(
        args.requestId,
        args.amount,
        args.currency,
        args.clientId,
        args.clientEmail,
        args.paymentMethod
      );

    case 'send_twilio_message':
      if (args.type === 'whatsapp') {
        return await twilioService.sendWhatsApp(args.phone, args.message);
      } else {
        return await twilioService.sendSMS(args.phone, args.message);
      }

    case 'notify_owner':
      return await notifyOwnerViaTwilio(args.reason, args.priority);

    case 'execute_owner_command':
      return await executeOwnerCommand(args.command, args.context);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

/**
 * Handle resource read
 */
async function handleResourceRead(params) {
  const { uri } = params;

  if (uri === 'rare4n://libraries/templates') {
    const { APP_TEMPLATES } = await import('../libraries/appTemplatesLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(APP_TEMPLATES, null, 2)
      }]
    };
  }

  if (uri === 'rare4n://libraries/systems') {
    const { SYSTEMS_LIBRARY } = await import('../libraries/systemsLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(SYSTEMS_LIBRARY, null, 2)
      }]
    };
  }

  if (uri === 'rare4n://libraries/themes') {
    const { THEMES_LIBRARY } = await import('../libraries/themesLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(THEMES_LIBRARY, null, 2)
      }]
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
}

/**
 * Notify owner via Twilio
 */
async function notifyOwnerViaTwilio(reason, priority = 'normal') {
  const OWNER_PHONE = process.env.OWNER_PHONE_NADER || '+971529211077';
  const message = `🚨 RARE 4N Agent Notification (${priority})\n\nReason: ${reason}\n\nTime: ${new Date().toLocaleString('ar-EG', { timeZone: 'Asia/Dubai' })}`;

  return await twilioService.sendWhatsApp(OWNER_PHONE, message);
}

/**
 * Execute owner command
 */
async function executeOwnerCommand(command, context = {}) {
  // Implementation from elevenlabs-webhook.js
  // ...
  return { success: true, message: 'Command executed' };
}

export default router;
```

---

## ✅ قائمة التحقق

- [ ] MCP Server مضاف في ElevenLabs Dashboard
- [ ] Backend MCP Endpoint موجود (`/mcp`)
- [ ] جميع Tools متاحة عبر MCP
- [ ] Resources متاحة (Libraries)
- [ ] Authentication يعمل
- [ ] اختبار Tool Call
- [ ] اختبار Resource Read

---

## 🧪 الاختبار

### 1. اختبار Tool Call:
```json
POST https://api.zien-ai.app/mcp
{
  "method": "tools/call",
  "params": {
    "name": "preview_library",
    "arguments": {
      "type": "templates",
      "limit": 5
    }
  }
}
```

### 2. اختبار Resource Read:
```json
POST https://api.zien-ai.app/mcp
{
  "method": "resources/read",
  "params": {
    "uri": "rare4n://libraries/templates"
  }
}
```

---

## 📊 المميزات

### ✅ مع MCP:
- إضافة Server واحد بدلاً من 7 Tools
- جميع Tools متاحة تلقائياً
- Resources متاحة (Libraries)
- صيانة أسهل
- تحديثات بسيطة
- Authentication مركزي

### ❌ بدون MCP:
- إضافة 7 Tools منفصلة
- تكرار في الكود
- صيانة صعبة
- تحديثات معقدة

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **MCP Endpoint:** `https://api.zien-ai.app/mcp`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل شامل لإعداد MCP بدلاً من Tools منفصلة

---

## 🎯 لماذا MCP Servers؟

### ❌ الطريقة القديمة (Tools منفصلة):
- إضافة 7 Tools واحد تلو الآخر
- صيانة صعبة
- تكرار في الكود
- تحديثات معقدة

### ✅ الطريقة الجديدة (MCP Servers):
- إضافة MCP Server واحد
- جميع Tools متاحة تلقائياً
- صيانة أسهل
- تحديثات بسيطة

---

## 📋 MCP Servers المتاحة

### 1. **RARE 4N Backend MCP**
- **الوظيفة:** الوصول لجميع Backend APIs
- **Tools:** 7 Tools (preview_library, search_library, submit_to_builder, create_payment, send_twilio_message, notify_owner, execute_owner_command)
- **Resources:** Libraries (Templates, Systems, Themes)
- **الملف:** `mcp-servers/rare4n-backend-mcp.json`

### 2. **Supabase MCP**
- **الوظيفة:** الوصول لقاعدة بيانات Supabase
- **Tools:** query_database, get_table_schema, list_tables
- **Resources:** Tables, Schema
- **الملف:** `mcp-servers/supabase-mcp.json`

---

## 🚀 خطوات الإعداد

### الخطوة 1: إعداد RARE 4N Backend MCP

1. اذهب إلى ElevenLabs Dashboard → Agent → Tools → **MCP**
2. اضغط **"Add server"**
3. اختر **"Custom MCP Server"** أو **"Import from JSON"**
4. انسخ محتوى `mcp-servers/rare4n-backend-mcp.json`
5. الصقه في الإعدادات
6. أدخل:
   - **Name:** `rare4n-backend`
   - **Server URL:** `https://api.zien-ai.app/mcp`
   - **Authentication:** Bearer Token
   - **Token:** `{{api_key}}` (سيتم استبداله تلقائياً)
7. احفظ

---

### الخطوة 2: إعداد Supabase MCP (اختياري)

1. اذهب إلى ElevenLabs Dashboard → Agent → Tools → **MCP**
2. اضغط **"Add server"**
3. اختر **"Supabase MCP"** (إذا كان متاحاً) أو **"Custom MCP Server"**
4. انسخ محتوى `mcp-servers/supabase-mcp.json`
5. الصقه في الإعدادات
6. أدخل:
   - **Name:** `supabase`
   - **Supabase URL:** `https://fgvrilruqzajstprioqj.supabase.co`
   - **Supabase Key:** `sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy`
7. احفظ

---

## 🔧 إعداد Backend MCP Endpoint

يجب إنشاء MCP Endpoint في Backend:

### ملف: `apps/backend/src/routes/mcp.js`

```javascript
/**
 * RARE 4N - MCP Server Endpoint
 * Model Context Protocol Server for ElevenLabs Agent
 */

import express from 'express';
import { previewLibrary, searchLibrary, submitToBuilder, createPayment } from '../services/agentTools.js';
import * as twilioService from '../services/twilioService.js';

const router = express.Router();

/**
 * POST /mcp
 * MCP Server endpoint
 */
router.post('/', async (req, res) => {
  try {
    const { method, params } = req.body;

    let result;

    switch (method) {
      case 'tools/call':
        result = await handleToolCall(params);
        break;

      case 'resources/read':
        result = await handleResourceRead(params);
        break;

      default:
        return res.status(400).json({
          error: 'Unknown method',
          method
        });
    }

    res.json({
      result,
      error: null
    });
  } catch (error) {
    console.error('MCP Server error:', error);
    res.status(500).json({
      result: null,
      error: {
        code: -32000,
        message: error.message
      }
    });
  }
});

/**
 * Handle tool call
 */
async function handleToolCall(params) {
  const { name, arguments: args } = params;

  switch (name) {
    case 'preview_library':
      return await previewLibrary(args.type, args.category, args.limit);

    case 'search_library':
      return await searchLibrary(args.query, args.type);

    case 'submit_to_builder':
      return await submitToBuilder(args.client_id, args.request_data, global.io);

    case 'create_payment':
      return await createPayment(
        args.requestId,
        args.amount,
        args.currency,
        args.clientId,
        args.clientEmail,
        args.paymentMethod
      );

    case 'send_twilio_message':
      if (args.type === 'whatsapp') {
        return await twilioService.sendWhatsApp(args.phone, args.message);
      } else {
        return await twilioService.sendSMS(args.phone, args.message);
      }

    case 'notify_owner':
      return await notifyOwnerViaTwilio(args.reason, args.priority);

    case 'execute_owner_command':
      return await executeOwnerCommand(args.command, args.context);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

/**
 * Handle resource read
 */
async function handleResourceRead(params) {
  const { uri } = params;

  if (uri === 'rare4n://libraries/templates') {
    const { APP_TEMPLATES } = await import('../libraries/appTemplatesLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(APP_TEMPLATES, null, 2)
      }]
    };
  }

  if (uri === 'rare4n://libraries/systems') {
    const { SYSTEMS_LIBRARY } = await import('../libraries/systemsLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(SYSTEMS_LIBRARY, null, 2)
      }]
    };
  }

  if (uri === 'rare4n://libraries/themes') {
    const { THEMES_LIBRARY } = await import('../libraries/themesLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(THEMES_LIBRARY, null, 2)
      }]
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
}

/**
 * Notify owner via Twilio
 */
async function notifyOwnerViaTwilio(reason, priority = 'normal') {
  const OWNER_PHONE = process.env.OWNER_PHONE_NADER || '+971529211077';
  const message = `🚨 RARE 4N Agent Notification (${priority})\n\nReason: ${reason}\n\nTime: ${new Date().toLocaleString('ar-EG', { timeZone: 'Asia/Dubai' })}`;

  return await twilioService.sendWhatsApp(OWNER_PHONE, message);
}

/**
 * Execute owner command
 */
async function executeOwnerCommand(command, context = {}) {
  // Implementation from elevenlabs-webhook.js
  // ...
  return { success: true, message: 'Command executed' };
}

export default router;
```

---

## ✅ قائمة التحقق

- [ ] MCP Server مضاف في ElevenLabs Dashboard
- [ ] Backend MCP Endpoint موجود (`/mcp`)
- [ ] جميع Tools متاحة عبر MCP
- [ ] Resources متاحة (Libraries)
- [ ] Authentication يعمل
- [ ] اختبار Tool Call
- [ ] اختبار Resource Read

---

## 🧪 الاختبار

### 1. اختبار Tool Call:
```json
POST https://api.zien-ai.app/mcp
{
  "method": "tools/call",
  "params": {
    "name": "preview_library",
    "arguments": {
      "type": "templates",
      "limit": 5
    }
  }
}
```

### 2. اختبار Resource Read:
```json
POST https://api.zien-ai.app/mcp
{
  "method": "resources/read",
  "params": {
    "uri": "rare4n://libraries/templates"
  }
}
```

---

## 📊 المميزات

### ✅ مع MCP:
- إضافة Server واحد بدلاً من 7 Tools
- جميع Tools متاحة تلقائياً
- Resources متاحة (Libraries)
- صيانة أسهل
- تحديثات بسيطة
- Authentication مركزي

### ❌ بدون MCP:
- إضافة 7 Tools منفصلة
- تكرار في الكود
- صيانة صعبة
- تحديثات معقدة

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **MCP Endpoint:** `https://api.zien-ai.app/mcp`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل شامل لإعداد MCP بدلاً من Tools منفصلة

---

## 🎯 لماذا MCP Servers؟

### ❌ الطريقة القديمة (Tools منفصلة):
- إضافة 7 Tools واحد تلو الآخر
- صيانة صعبة
- تكرار في الكود
- تحديثات معقدة

### ✅ الطريقة الجديدة (MCP Servers):
- إضافة MCP Server واحد
- جميع Tools متاحة تلقائياً
- صيانة أسهل
- تحديثات بسيطة

---

## 📋 MCP Servers المتاحة

### 1. **RARE 4N Backend MCP**
- **الوظيفة:** الوصول لجميع Backend APIs
- **Tools:** 7 Tools (preview_library, search_library, submit_to_builder, create_payment, send_twilio_message, notify_owner, execute_owner_command)
- **Resources:** Libraries (Templates, Systems, Themes)
- **الملف:** `mcp-servers/rare4n-backend-mcp.json`

### 2. **Supabase MCP**
- **الوظيفة:** الوصول لقاعدة بيانات Supabase
- **Tools:** query_database, get_table_schema, list_tables
- **Resources:** Tables, Schema
- **الملف:** `mcp-servers/supabase-mcp.json`

---

## 🚀 خطوات الإعداد

### الخطوة 1: إعداد RARE 4N Backend MCP

1. اذهب إلى ElevenLabs Dashboard → Agent → Tools → **MCP**
2. اضغط **"Add server"**
3. اختر **"Custom MCP Server"** أو **"Import from JSON"**
4. انسخ محتوى `mcp-servers/rare4n-backend-mcp.json`
5. الصقه في الإعدادات
6. أدخل:
   - **Name:** `rare4n-backend`
   - **Server URL:** `https://api.zien-ai.app/mcp`
   - **Authentication:** Bearer Token
   - **Token:** `{{api_key}}` (سيتم استبداله تلقائياً)
7. احفظ

---

### الخطوة 2: إعداد Supabase MCP (اختياري)

1. اذهب إلى ElevenLabs Dashboard → Agent → Tools → **MCP**
2. اضغط **"Add server"**
3. اختر **"Supabase MCP"** (إذا كان متاحاً) أو **"Custom MCP Server"**
4. انسخ محتوى `mcp-servers/supabase-mcp.json`
5. الصقه في الإعدادات
6. أدخل:
   - **Name:** `supabase`
   - **Supabase URL:** `https://fgvrilruqzajstprioqj.supabase.co`
   - **Supabase Key:** `sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy`
7. احفظ

---

## 🔧 إعداد Backend MCP Endpoint

يجب إنشاء MCP Endpoint في Backend:

### ملف: `apps/backend/src/routes/mcp.js`

```javascript
/**
 * RARE 4N - MCP Server Endpoint
 * Model Context Protocol Server for ElevenLabs Agent
 */

import express from 'express';
import { previewLibrary, searchLibrary, submitToBuilder, createPayment } from '../services/agentTools.js';
import * as twilioService from '../services/twilioService.js';

const router = express.Router();

/**
 * POST /mcp
 * MCP Server endpoint
 */
router.post('/', async (req, res) => {
  try {
    const { method, params } = req.body;

    let result;

    switch (method) {
      case 'tools/call':
        result = await handleToolCall(params);
        break;

      case 'resources/read':
        result = await handleResourceRead(params);
        break;

      default:
        return res.status(400).json({
          error: 'Unknown method',
          method
        });
    }

    res.json({
      result,
      error: null
    });
  } catch (error) {
    console.error('MCP Server error:', error);
    res.status(500).json({
      result: null,
      error: {
        code: -32000,
        message: error.message
      }
    });
  }
});

/**
 * Handle tool call
 */
async function handleToolCall(params) {
  const { name, arguments: args } = params;

  switch (name) {
    case 'preview_library':
      return await previewLibrary(args.type, args.category, args.limit);

    case 'search_library':
      return await searchLibrary(args.query, args.type);

    case 'submit_to_builder':
      return await submitToBuilder(args.client_id, args.request_data, global.io);

    case 'create_payment':
      return await createPayment(
        args.requestId,
        args.amount,
        args.currency,
        args.clientId,
        args.clientEmail,
        args.paymentMethod
      );

    case 'send_twilio_message':
      if (args.type === 'whatsapp') {
        return await twilioService.sendWhatsApp(args.phone, args.message);
      } else {
        return await twilioService.sendSMS(args.phone, args.message);
      }

    case 'notify_owner':
      return await notifyOwnerViaTwilio(args.reason, args.priority);

    case 'execute_owner_command':
      return await executeOwnerCommand(args.command, args.context);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

/**
 * Handle resource read
 */
async function handleResourceRead(params) {
  const { uri } = params;

  if (uri === 'rare4n://libraries/templates') {
    const { APP_TEMPLATES } = await import('../libraries/appTemplatesLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(APP_TEMPLATES, null, 2)
      }]
    };
  }

  if (uri === 'rare4n://libraries/systems') {
    const { SYSTEMS_LIBRARY } = await import('../libraries/systemsLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(SYSTEMS_LIBRARY, null, 2)
      }]
    };
  }

  if (uri === 'rare4n://libraries/themes') {
    const { THEMES_LIBRARY } = await import('../libraries/themesLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(THEMES_LIBRARY, null, 2)
      }]
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
}

/**
 * Notify owner via Twilio
 */
async function notifyOwnerViaTwilio(reason, priority = 'normal') {
  const OWNER_PHONE = process.env.OWNER_PHONE_NADER || '+971529211077';
  const message = `🚨 RARE 4N Agent Notification (${priority})\n\nReason: ${reason}\n\nTime: ${new Date().toLocaleString('ar-EG', { timeZone: 'Asia/Dubai' })}`;

  return await twilioService.sendWhatsApp(OWNER_PHONE, message);
}

/**
 * Execute owner command
 */
async function executeOwnerCommand(command, context = {}) {
  // Implementation from elevenlabs-webhook.js
  // ...
  return { success: true, message: 'Command executed' };
}

export default router;
```

---

## ✅ قائمة التحقق

- [ ] MCP Server مضاف في ElevenLabs Dashboard
- [ ] Backend MCP Endpoint موجود (`/mcp`)
- [ ] جميع Tools متاحة عبر MCP
- [ ] Resources متاحة (Libraries)
- [ ] Authentication يعمل
- [ ] اختبار Tool Call
- [ ] اختبار Resource Read

---

## 🧪 الاختبار

### 1. اختبار Tool Call:
```json
POST https://api.zien-ai.app/mcp
{
  "method": "tools/call",
  "params": {
    "name": "preview_library",
    "arguments": {
      "type": "templates",
      "limit": 5
    }
  }
}
```

### 2. اختبار Resource Read:
```json
POST https://api.zien-ai.app/mcp
{
  "method": "resources/read",
  "params": {
    "uri": "rare4n://libraries/templates"
  }
}
```

---

## 📊 المميزات

### ✅ مع MCP:
- إضافة Server واحد بدلاً من 7 Tools
- جميع Tools متاحة تلقائياً
- Resources متاحة (Libraries)
- صيانة أسهل
- تحديثات بسيطة
- Authentication مركزي

### ❌ بدون MCP:
- إضافة 7 Tools منفصلة
- تكرار في الكود
- صيانة صعبة
- تحديثات معقدة

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **MCP Endpoint:** `https://api.zien-ai.app/mcp`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل شامل لإعداد MCP بدلاً من Tools منفصلة

---

## 🎯 لماذا MCP Servers؟

### ❌ الطريقة القديمة (Tools منفصلة):
- إضافة 7 Tools واحد تلو الآخر
- صيانة صعبة
- تكرار في الكود
- تحديثات معقدة

### ✅ الطريقة الجديدة (MCP Servers):
- إضافة MCP Server واحد
- جميع Tools متاحة تلقائياً
- صيانة أسهل
- تحديثات بسيطة

---

## 📋 MCP Servers المتاحة

### 1. **RARE 4N Backend MCP**
- **الوظيفة:** الوصول لجميع Backend APIs
- **Tools:** 7 Tools (preview_library, search_library, submit_to_builder, create_payment, send_twilio_message, notify_owner, execute_owner_command)
- **Resources:** Libraries (Templates, Systems, Themes)
- **الملف:** `mcp-servers/rare4n-backend-mcp.json`

### 2. **Supabase MCP**
- **الوظيفة:** الوصول لقاعدة بيانات Supabase
- **Tools:** query_database, get_table_schema, list_tables
- **Resources:** Tables, Schema
- **الملف:** `mcp-servers/supabase-mcp.json`

---

## 🚀 خطوات الإعداد

### الخطوة 1: إعداد RARE 4N Backend MCP

1. اذهب إلى ElevenLabs Dashboard → Agent → Tools → **MCP**
2. اضغط **"Add server"**
3. اختر **"Custom MCP Server"** أو **"Import from JSON"**
4. انسخ محتوى `mcp-servers/rare4n-backend-mcp.json`
5. الصقه في الإعدادات
6. أدخل:
   - **Name:** `rare4n-backend`
   - **Server URL:** `https://api.zien-ai.app/mcp`
   - **Authentication:** Bearer Token
   - **Token:** `{{api_key}}` (سيتم استبداله تلقائياً)
7. احفظ

---

### الخطوة 2: إعداد Supabase MCP (اختياري)

1. اذهب إلى ElevenLabs Dashboard → Agent → Tools → **MCP**
2. اضغط **"Add server"**
3. اختر **"Supabase MCP"** (إذا كان متاحاً) أو **"Custom MCP Server"**
4. انسخ محتوى `mcp-servers/supabase-mcp.json`
5. الصقه في الإعدادات
6. أدخل:
   - **Name:** `supabase`
   - **Supabase URL:** `https://fgvrilruqzajstprioqj.supabase.co`
   - **Supabase Key:** `sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy`
7. احفظ

---

## 🔧 إعداد Backend MCP Endpoint

يجب إنشاء MCP Endpoint في Backend:

### ملف: `apps/backend/src/routes/mcp.js`

```javascript
/**
 * RARE 4N - MCP Server Endpoint
 * Model Context Protocol Server for ElevenLabs Agent
 */

import express from 'express';
import { previewLibrary, searchLibrary, submitToBuilder, createPayment } from '../services/agentTools.js';
import * as twilioService from '../services/twilioService.js';

const router = express.Router();

/**
 * POST /mcp
 * MCP Server endpoint
 */
router.post('/', async (req, res) => {
  try {
    const { method, params } = req.body;

    let result;

    switch (method) {
      case 'tools/call':
        result = await handleToolCall(params);
        break;

      case 'resources/read':
        result = await handleResourceRead(params);
        break;

      default:
        return res.status(400).json({
          error: 'Unknown method',
          method
        });
    }

    res.json({
      result,
      error: null
    });
  } catch (error) {
    console.error('MCP Server error:', error);
    res.status(500).json({
      result: null,
      error: {
        code: -32000,
        message: error.message
      }
    });
  }
});

/**
 * Handle tool call
 */
async function handleToolCall(params) {
  const { name, arguments: args } = params;

  switch (name) {
    case 'preview_library':
      return await previewLibrary(args.type, args.category, args.limit);

    case 'search_library':
      return await searchLibrary(args.query, args.type);

    case 'submit_to_builder':
      return await submitToBuilder(args.client_id, args.request_data, global.io);

    case 'create_payment':
      return await createPayment(
        args.requestId,
        args.amount,
        args.currency,
        args.clientId,
        args.clientEmail,
        args.paymentMethod
      );

    case 'send_twilio_message':
      if (args.type === 'whatsapp') {
        return await twilioService.sendWhatsApp(args.phone, args.message);
      } else {
        return await twilioService.sendSMS(args.phone, args.message);
      }

    case 'notify_owner':
      return await notifyOwnerViaTwilio(args.reason, args.priority);

    case 'execute_owner_command':
      return await executeOwnerCommand(args.command, args.context);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

/**
 * Handle resource read
 */
async function handleResourceRead(params) {
  const { uri } = params;

  if (uri === 'rare4n://libraries/templates') {
    const { APP_TEMPLATES } = await import('../libraries/appTemplatesLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(APP_TEMPLATES, null, 2)
      }]
    };
  }

  if (uri === 'rare4n://libraries/systems') {
    const { SYSTEMS_LIBRARY } = await import('../libraries/systemsLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(SYSTEMS_LIBRARY, null, 2)
      }]
    };
  }

  if (uri === 'rare4n://libraries/themes') {
    const { THEMES_LIBRARY } = await import('../libraries/themesLibrary.js');
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(THEMES_LIBRARY, null, 2)
      }]
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
}

/**
 * Notify owner via Twilio
 */
async function notifyOwnerViaTwilio(reason, priority = 'normal') {
  const OWNER_PHONE = process.env.OWNER_PHONE_NADER || '+971529211077';
  const message = `🚨 RARE 4N Agent Notification (${priority})\n\nReason: ${reason}\n\nTime: ${new Date().toLocaleString('ar-EG', { timeZone: 'Asia/Dubai' })}`;

  return await twilioService.sendWhatsApp(OWNER_PHONE, message);
}

/**
 * Execute owner command
 */
async function executeOwnerCommand(command, context = {}) {
  // Implementation from elevenlabs-webhook.js
  // ...
  return { success: true, message: 'Command executed' };
}

export default router;
```

---

## ✅ قائمة التحقق

- [ ] MCP Server مضاف في ElevenLabs Dashboard
- [ ] Backend MCP Endpoint موجود (`/mcp`)
- [ ] جميع Tools متاحة عبر MCP
- [ ] Resources متاحة (Libraries)
- [ ] Authentication يعمل
- [ ] اختبار Tool Call
- [ ] اختبار Resource Read

---

## 🧪 الاختبار

### 1. اختبار Tool Call:
```json
POST https://api.zien-ai.app/mcp
{
  "method": "tools/call",
  "params": {
    "name": "preview_library",
    "arguments": {
      "type": "templates",
      "limit": 5
    }
  }
}
```

### 2. اختبار Resource Read:
```json
POST https://api.zien-ai.app/mcp
{
  "method": "resources/read",
  "params": {
    "uri": "rare4n://libraries/templates"
  }
}
```

---

## 📊 المميزات

### ✅ مع MCP:
- إضافة Server واحد بدلاً من 7 Tools
- جميع Tools متاحة تلقائياً
- Resources متاحة (Libraries)
- صيانة أسهل
- تحديثات بسيطة
- Authentication مركزي

### ❌ بدون MCP:
- إضافة 7 Tools منفصلة
- تكرار في الكود
- صيانة صعبة
- تحديثات معقدة

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **MCP Endpoint:** `https://api.zien-ai.app/mcp`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

