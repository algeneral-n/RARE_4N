# إعداد MCP Server في ElevenLabs Dashboard - خطوة بخطوة
## دليل تفصيلي لكل حقل في النموذج

---

## 📋 Basic Information (المعلومات الأساسية)

### Name (الاسم):
```
rare4n-backend
```
أو:
```
RARE 4N Backend MCP
```

### Description (الوصف):
```
MCP Server for RARE 4N Backend - Provides access to all backend APIs, libraries, payments, Twilio, and builder services. Includes 7 tools: preview_library, search_library, submit_to_builder, create_payment, send_twilio_message, notify_owner, execute_owner_command.
```

---

## 🔧 Server Configuration (إعدادات الخادم)

### Server type (نوع الخادم):
اختر: **SSE** (Server-Sent Events)

> **ملاحظة:** إذا لم يكن SSE متاحاً، اختر **Streamable HTTP**

### Server URL (رابط الخادم):
```
https://api.zien-ai.app/api/mcp
```

### Type (النوع):
اختر: **URL**

### Value (القيمة):
```
https://api.zien-ai.app/api/mcp
```

---

## 🔐 Secret Token (رمز الوصول السري)

### Secret (الرمز السري):
```
rare4n_mcp_secret_2026_secure_key_agn@algeneralnrsafa01018811220
```

أو يمكنك استخدام:
```
RARE4N-MCP-SECRET-2026
```

> **ملاحظة:** هذا الرمز يجب أن يطابق الموجود في Backend `.env` (إذا أردت إضافة authentication)

---

## 📝 HTTP Headers (رؤوس HTTP)

### Add header (إضافة رأس):

#### Header 1:
- **Name:** `Content-Type`
- **Value:** `application/json`

#### Header 2 (اختياري - للـ Authentication):
- **Name:** `Authorization`
- **Value:** `Bearer {{api_key}}`

> **ملاحظة:** `{{api_key}}` سيتم استبداله تلقائياً من ElevenLabs

---

## ✅ Tool Approval Mode (وضع موافقة الأدوات)

### الخيارات:

#### 1. Always Ask (دائماً اسأل) - **موصى به**
- ✅ **Maximum security**
- الـ Agent سيطلب موافقتك قبل كل استخدام للأداة
- **اختر هذا الخيار** للأمان الأقصى

#### 2. Fine-Grained Tool Approval (موافقة دقيقة)
- يمكنك اختيار الأدوات التي تعمل تلقائياً
- والأدوات التي تحتاج موافقة
- **اختر هذا** إذا أردت التحكم في كل أداة

#### 3. No Approval (لا موافقة)
- الـ Agent يمكنه استخدام أي أداة بدون موافقة
- ⚠️ **غير موصى به** إلا إذا كنت تثق تماماً

**الموصى به:** **Always Ask** أو **Fine-Grained Tool Approval**

---

## ⚙️ Tool Settings (إعدادات الأدوات)

### Force Pre-tool Speech (إجبار الكلام قبل الأداة):
- **الافتراضي:** الـ Agent يتكلم إذا كانت الأوقات طويلة
- **Force:** الـ Agent يتكلم قبل كل تنفيذ أداة
- **الموصى به:** اتركه **غير مفعل** (Default)

### Disable Interruptions (تعطيل المقاطعات):
- **الافتراضي:** المستخدم يمكنه مقاطعة الـ Agent أثناء تنفيذ الأداة
- **Disable:** تعطيل المقاطعات أثناء تنفيذ الأداة
- **الموصى به:** اتركه **غير مفعل** (Default)

### Execution mode (وضع التنفيذ):
اختر: **Immediate** (فوري)
- الأداة تعمل فوراً عند الطلب
- لا انتظار

### Tool call sound (صوت تنفيذ الأداة):
اختر: **None** (لا صوت)
- أو اختر صوت إذا أردت

---

## 🔒 I trust this server (أثق بهذا الخادم)

### ✅ فعّل هذا الخيار:
- **I trust this server** ✅ (ضع علامة)
- هذا يسمح للـ Agent باستخدام الخادم بدون تحذيرات

> **ملاحظة:** "Custom MCP servers are not verified by ElevenLabs" - هذا طبيعي، لأن الخادم مخصص

---

## 📋 ملخص القيم المطلوبة

```
Name: rare4n-backend
Description: MCP Server for RARE 4N Backend - Provides access to all backend APIs, libraries, payments, Twilio, and builder services.

Server type: SSE (أو Streamable HTTP)
Server URL: https://api.zien-ai.app/api/mcp
Type: URL
Value: https://api.zien-ai.app/api/mcp

Secret Token: rare4n_mcp_secret_2026_secure_key_agn@algeneralnrsafa01018811220

HTTP Headers:
  - Content-Type: application/json
  - Authorization: Bearer {{api_key}} (اختياري)

Tool Approval Mode: Always Ask (موصى به)
  أو Fine-Grained Tool Approval

Tool Settings:
  - Force Pre-tool Speech: غير مفعل
  - Disable Interruptions: غير مفعل
  - Execution mode: Immediate
  - Tool call sound: None

I trust this server: ✅ مفعل
```

---

## ✅ بعد الحفظ

بعد إضافة MCP Server بنجاح:

1. ✅ ستظهر جميع Tools (7 Tools) تلقائياً
2. ✅ ستظهر Resources (Libraries)
3. ✅ يمكنك اختبار Tool من خلال بدء محادثة

---

## 🧪 اختبار MCP Server

### 1. ابدأ محادثة مع Agent
### 2. جرب:
```
"أعرض لي القوالب المتاحة"
```
### 3. يجب أن يطلب الـ Agent موافقتك (إذا اخترت "Always Ask")
### 4. بعد الموافقة، يجب أن يستدعي `preview_library` tool
### 5. تحقق من Backend logs:
```
📥 MCP Request: tools/call
🔧 MCP Tool Call: preview_library
```

---

## ⚠️ ملاحظات مهمة

1. **Server URL** يجب أن يكون متاحاً من الإنترنت
2. **Secret Token** اختياري (إذا لم تضيف authentication في Backend)
3. **HTTP Headers** اختياري (لكن `Content-Type` مفيد)
4. **Tool Approval Mode** - اختر حسب مستوى الأمان المطلوب
5. **I trust this server** - فعّله لتجنب التحذيرات

---

## 🔗 الروابط

- **MCP Endpoint:** `https://api.zien-ai.app/api/mcp`
- **Backend Route:** `apps/backend/src/routes/mcp.js`
- **MCP Config:** `elevenlabs-config/mcp-servers/rare4n-backend-mcp.json`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل تفصيلي لكل حقل في النموذج

---

## 📋 Basic Information (المعلومات الأساسية)

### Name (الاسم):
```
rare4n-backend
```
أو:
```
RARE 4N Backend MCP
```

### Description (الوصف):
```
MCP Server for RARE 4N Backend - Provides access to all backend APIs, libraries, payments, Twilio, and builder services. Includes 7 tools: preview_library, search_library, submit_to_builder, create_payment, send_twilio_message, notify_owner, execute_owner_command.
```

---

## 🔧 Server Configuration (إعدادات الخادم)

### Server type (نوع الخادم):
اختر: **SSE** (Server-Sent Events)

> **ملاحظة:** إذا لم يكن SSE متاحاً، اختر **Streamable HTTP**

### Server URL (رابط الخادم):
```
https://api.zien-ai.app/api/mcp
```

### Type (النوع):
اختر: **URL**

### Value (القيمة):
```
https://api.zien-ai.app/api/mcp
```

---

## 🔐 Secret Token (رمز الوصول السري)

### Secret (الرمز السري):
```
rare4n_mcp_secret_2026_secure_key_agn@algeneralnrsafa01018811220
```

أو يمكنك استخدام:
```
RARE4N-MCP-SECRET-2026
```

> **ملاحظة:** هذا الرمز يجب أن يطابق الموجود في Backend `.env` (إذا أردت إضافة authentication)

---

## 📝 HTTP Headers (رؤوس HTTP)

### Add header (إضافة رأس):

#### Header 1:
- **Name:** `Content-Type`
- **Value:** `application/json`

#### Header 2 (اختياري - للـ Authentication):
- **Name:** `Authorization`
- **Value:** `Bearer {{api_key}}`

> **ملاحظة:** `{{api_key}}` سيتم استبداله تلقائياً من ElevenLabs

---

## ✅ Tool Approval Mode (وضع موافقة الأدوات)

### الخيارات:

#### 1. Always Ask (دائماً اسأل) - **موصى به**
- ✅ **Maximum security**
- الـ Agent سيطلب موافقتك قبل كل استخدام للأداة
- **اختر هذا الخيار** للأمان الأقصى

#### 2. Fine-Grained Tool Approval (موافقة دقيقة)
- يمكنك اختيار الأدوات التي تعمل تلقائياً
- والأدوات التي تحتاج موافقة
- **اختر هذا** إذا أردت التحكم في كل أداة

#### 3. No Approval (لا موافقة)
- الـ Agent يمكنه استخدام أي أداة بدون موافقة
- ⚠️ **غير موصى به** إلا إذا كنت تثق تماماً

**الموصى به:** **Always Ask** أو **Fine-Grained Tool Approval**

---

## ⚙️ Tool Settings (إعدادات الأدوات)

### Force Pre-tool Speech (إجبار الكلام قبل الأداة):
- **الافتراضي:** الـ Agent يتكلم إذا كانت الأوقات طويلة
- **Force:** الـ Agent يتكلم قبل كل تنفيذ أداة
- **الموصى به:** اتركه **غير مفعل** (Default)

### Disable Interruptions (تعطيل المقاطعات):
- **الافتراضي:** المستخدم يمكنه مقاطعة الـ Agent أثناء تنفيذ الأداة
- **Disable:** تعطيل المقاطعات أثناء تنفيذ الأداة
- **الموصى به:** اتركه **غير مفعل** (Default)

### Execution mode (وضع التنفيذ):
اختر: **Immediate** (فوري)
- الأداة تعمل فوراً عند الطلب
- لا انتظار

### Tool call sound (صوت تنفيذ الأداة):
اختر: **None** (لا صوت)
- أو اختر صوت إذا أردت

---

## 🔒 I trust this server (أثق بهذا الخادم)

### ✅ فعّل هذا الخيار:
- **I trust this server** ✅ (ضع علامة)
- هذا يسمح للـ Agent باستخدام الخادم بدون تحذيرات

> **ملاحظة:** "Custom MCP servers are not verified by ElevenLabs" - هذا طبيعي، لأن الخادم مخصص

---

## 📋 ملخص القيم المطلوبة

```
Name: rare4n-backend
Description: MCP Server for RARE 4N Backend - Provides access to all backend APIs, libraries, payments, Twilio, and builder services.

Server type: SSE (أو Streamable HTTP)
Server URL: https://api.zien-ai.app/api/mcp
Type: URL
Value: https://api.zien-ai.app/api/mcp

Secret Token: rare4n_mcp_secret_2026_secure_key_agn@algeneralnrsafa01018811220

HTTP Headers:
  - Content-Type: application/json
  - Authorization: Bearer {{api_key}} (اختياري)

Tool Approval Mode: Always Ask (موصى به)
  أو Fine-Grained Tool Approval

Tool Settings:
  - Force Pre-tool Speech: غير مفعل
  - Disable Interruptions: غير مفعل
  - Execution mode: Immediate
  - Tool call sound: None

I trust this server: ✅ مفعل
```

---

## ✅ بعد الحفظ

بعد إضافة MCP Server بنجاح:

1. ✅ ستظهر جميع Tools (7 Tools) تلقائياً
2. ✅ ستظهر Resources (Libraries)
3. ✅ يمكنك اختبار Tool من خلال بدء محادثة

---

## 🧪 اختبار MCP Server

### 1. ابدأ محادثة مع Agent
### 2. جرب:
```
"أعرض لي القوالب المتاحة"
```
### 3. يجب أن يطلب الـ Agent موافقتك (إذا اخترت "Always Ask")
### 4. بعد الموافقة، يجب أن يستدعي `preview_library` tool
### 5. تحقق من Backend logs:
```
📥 MCP Request: tools/call
🔧 MCP Tool Call: preview_library
```

---

## ⚠️ ملاحظات مهمة

1. **Server URL** يجب أن يكون متاحاً من الإنترنت
2. **Secret Token** اختياري (إذا لم تضيف authentication في Backend)
3. **HTTP Headers** اختياري (لكن `Content-Type` مفيد)
4. **Tool Approval Mode** - اختر حسب مستوى الأمان المطلوب
5. **I trust this server** - فعّله لتجنب التحذيرات

---

## 🔗 الروابط

- **MCP Endpoint:** `https://api.zien-ai.app/api/mcp`
- **Backend Route:** `apps/backend/src/routes/mcp.js`
- **MCP Config:** `elevenlabs-config/mcp-servers/rare4n-backend-mcp.json`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل تفصيلي لكل حقل في النموذج

---

## 📋 Basic Information (المعلومات الأساسية)

### Name (الاسم):
```
rare4n-backend
```
أو:
```
RARE 4N Backend MCP
```

### Description (الوصف):
```
MCP Server for RARE 4N Backend - Provides access to all backend APIs, libraries, payments, Twilio, and builder services. Includes 7 tools: preview_library, search_library, submit_to_builder, create_payment, send_twilio_message, notify_owner, execute_owner_command.
```

---

## 🔧 Server Configuration (إعدادات الخادم)

### Server type (نوع الخادم):
اختر: **SSE** (Server-Sent Events)

> **ملاحظة:** إذا لم يكن SSE متاحاً، اختر **Streamable HTTP**

### Server URL (رابط الخادم):
```
https://api.zien-ai.app/api/mcp
```

### Type (النوع):
اختر: **URL**

### Value (القيمة):
```
https://api.zien-ai.app/api/mcp
```

---

## 🔐 Secret Token (رمز الوصول السري)

### Secret (الرمز السري):
```
rare4n_mcp_secret_2026_secure_key_agn@algeneralnrsafa01018811220
```

أو يمكنك استخدام:
```
RARE4N-MCP-SECRET-2026
```

> **ملاحظة:** هذا الرمز يجب أن يطابق الموجود في Backend `.env` (إذا أردت إضافة authentication)

---

## 📝 HTTP Headers (رؤوس HTTP)

### Add header (إضافة رأس):

#### Header 1:
- **Name:** `Content-Type`
- **Value:** `application/json`

#### Header 2 (اختياري - للـ Authentication):
- **Name:** `Authorization`
- **Value:** `Bearer {{api_key}}`

> **ملاحظة:** `{{api_key}}` سيتم استبداله تلقائياً من ElevenLabs

---

## ✅ Tool Approval Mode (وضع موافقة الأدوات)

### الخيارات:

#### 1. Always Ask (دائماً اسأل) - **موصى به**
- ✅ **Maximum security**
- الـ Agent سيطلب موافقتك قبل كل استخدام للأداة
- **اختر هذا الخيار** للأمان الأقصى

#### 2. Fine-Grained Tool Approval (موافقة دقيقة)
- يمكنك اختيار الأدوات التي تعمل تلقائياً
- والأدوات التي تحتاج موافقة
- **اختر هذا** إذا أردت التحكم في كل أداة

#### 3. No Approval (لا موافقة)
- الـ Agent يمكنه استخدام أي أداة بدون موافقة
- ⚠️ **غير موصى به** إلا إذا كنت تثق تماماً

**الموصى به:** **Always Ask** أو **Fine-Grained Tool Approval**

---

## ⚙️ Tool Settings (إعدادات الأدوات)

### Force Pre-tool Speech (إجبار الكلام قبل الأداة):
- **الافتراضي:** الـ Agent يتكلم إذا كانت الأوقات طويلة
- **Force:** الـ Agent يتكلم قبل كل تنفيذ أداة
- **الموصى به:** اتركه **غير مفعل** (Default)

### Disable Interruptions (تعطيل المقاطعات):
- **الافتراضي:** المستخدم يمكنه مقاطعة الـ Agent أثناء تنفيذ الأداة
- **Disable:** تعطيل المقاطعات أثناء تنفيذ الأداة
- **الموصى به:** اتركه **غير مفعل** (Default)

### Execution mode (وضع التنفيذ):
اختر: **Immediate** (فوري)
- الأداة تعمل فوراً عند الطلب
- لا انتظار

### Tool call sound (صوت تنفيذ الأداة):
اختر: **None** (لا صوت)
- أو اختر صوت إذا أردت

---

## 🔒 I trust this server (أثق بهذا الخادم)

### ✅ فعّل هذا الخيار:
- **I trust this server** ✅ (ضع علامة)
- هذا يسمح للـ Agent باستخدام الخادم بدون تحذيرات

> **ملاحظة:** "Custom MCP servers are not verified by ElevenLabs" - هذا طبيعي، لأن الخادم مخصص

---

## 📋 ملخص القيم المطلوبة

```
Name: rare4n-backend
Description: MCP Server for RARE 4N Backend - Provides access to all backend APIs, libraries, payments, Twilio, and builder services.

Server type: SSE (أو Streamable HTTP)
Server URL: https://api.zien-ai.app/api/mcp
Type: URL
Value: https://api.zien-ai.app/api/mcp

Secret Token: rare4n_mcp_secret_2026_secure_key_agn@algeneralnrsafa01018811220

HTTP Headers:
  - Content-Type: application/json
  - Authorization: Bearer {{api_key}} (اختياري)

Tool Approval Mode: Always Ask (موصى به)
  أو Fine-Grained Tool Approval

Tool Settings:
  - Force Pre-tool Speech: غير مفعل
  - Disable Interruptions: غير مفعل
  - Execution mode: Immediate
  - Tool call sound: None

I trust this server: ✅ مفعل
```

---

## ✅ بعد الحفظ

بعد إضافة MCP Server بنجاح:

1. ✅ ستظهر جميع Tools (7 Tools) تلقائياً
2. ✅ ستظهر Resources (Libraries)
3. ✅ يمكنك اختبار Tool من خلال بدء محادثة

---

## 🧪 اختبار MCP Server

### 1. ابدأ محادثة مع Agent
### 2. جرب:
```
"أعرض لي القوالب المتاحة"
```
### 3. يجب أن يطلب الـ Agent موافقتك (إذا اخترت "Always Ask")
### 4. بعد الموافقة، يجب أن يستدعي `preview_library` tool
### 5. تحقق من Backend logs:
```
📥 MCP Request: tools/call
🔧 MCP Tool Call: preview_library
```

---

## ⚠️ ملاحظات مهمة

1. **Server URL** يجب أن يكون متاحاً من الإنترنت
2. **Secret Token** اختياري (إذا لم تضيف authentication في Backend)
3. **HTTP Headers** اختياري (لكن `Content-Type` مفيد)
4. **Tool Approval Mode** - اختر حسب مستوى الأمان المطلوب
5. **I trust this server** - فعّله لتجنب التحذيرات

---

## 🔗 الروابط

- **MCP Endpoint:** `https://api.zien-ai.app/api/mcp`
- **Backend Route:** `apps/backend/src/routes/mcp.js`
- **MCP Config:** `elevenlabs-config/mcp-servers/rare4n-backend-mcp.json`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل تفصيلي لكل حقل في النموذج

---

## 📋 Basic Information (المعلومات الأساسية)

### Name (الاسم):
```
rare4n-backend
```
أو:
```
RARE 4N Backend MCP
```

### Description (الوصف):
```
MCP Server for RARE 4N Backend - Provides access to all backend APIs, libraries, payments, Twilio, and builder services. Includes 7 tools: preview_library, search_library, submit_to_builder, create_payment, send_twilio_message, notify_owner, execute_owner_command.
```

---

## 🔧 Server Configuration (إعدادات الخادم)

### Server type (نوع الخادم):
اختر: **SSE** (Server-Sent Events)

> **ملاحظة:** إذا لم يكن SSE متاحاً، اختر **Streamable HTTP**

### Server URL (رابط الخادم):
```
https://api.zien-ai.app/api/mcp
```

### Type (النوع):
اختر: **URL**

### Value (القيمة):
```
https://api.zien-ai.app/api/mcp
```

---

## 🔐 Secret Token (رمز الوصول السري)

### Secret (الرمز السري):
```
rare4n_mcp_secret_2026_secure_key_agn@algeneralnrsafa01018811220
```

أو يمكنك استخدام:
```
RARE4N-MCP-SECRET-2026
```

> **ملاحظة:** هذا الرمز يجب أن يطابق الموجود في Backend `.env` (إذا أردت إضافة authentication)

---

## 📝 HTTP Headers (رؤوس HTTP)

### Add header (إضافة رأس):

#### Header 1:
- **Name:** `Content-Type`
- **Value:** `application/json`

#### Header 2 (اختياري - للـ Authentication):
- **Name:** `Authorization`
- **Value:** `Bearer {{api_key}}`

> **ملاحظة:** `{{api_key}}` سيتم استبداله تلقائياً من ElevenLabs

---

## ✅ Tool Approval Mode (وضع موافقة الأدوات)

### الخيارات:

#### 1. Always Ask (دائماً اسأل) - **موصى به**
- ✅ **Maximum security**
- الـ Agent سيطلب موافقتك قبل كل استخدام للأداة
- **اختر هذا الخيار** للأمان الأقصى

#### 2. Fine-Grained Tool Approval (موافقة دقيقة)
- يمكنك اختيار الأدوات التي تعمل تلقائياً
- والأدوات التي تحتاج موافقة
- **اختر هذا** إذا أردت التحكم في كل أداة

#### 3. No Approval (لا موافقة)
- الـ Agent يمكنه استخدام أي أداة بدون موافقة
- ⚠️ **غير موصى به** إلا إذا كنت تثق تماماً

**الموصى به:** **Always Ask** أو **Fine-Grained Tool Approval**

---

## ⚙️ Tool Settings (إعدادات الأدوات)

### Force Pre-tool Speech (إجبار الكلام قبل الأداة):
- **الافتراضي:** الـ Agent يتكلم إذا كانت الأوقات طويلة
- **Force:** الـ Agent يتكلم قبل كل تنفيذ أداة
- **الموصى به:** اتركه **غير مفعل** (Default)

### Disable Interruptions (تعطيل المقاطعات):
- **الافتراضي:** المستخدم يمكنه مقاطعة الـ Agent أثناء تنفيذ الأداة
- **Disable:** تعطيل المقاطعات أثناء تنفيذ الأداة
- **الموصى به:** اتركه **غير مفعل** (Default)

### Execution mode (وضع التنفيذ):
اختر: **Immediate** (فوري)
- الأداة تعمل فوراً عند الطلب
- لا انتظار

### Tool call sound (صوت تنفيذ الأداة):
اختر: **None** (لا صوت)
- أو اختر صوت إذا أردت

---

## 🔒 I trust this server (أثق بهذا الخادم)

### ✅ فعّل هذا الخيار:
- **I trust this server** ✅ (ضع علامة)
- هذا يسمح للـ Agent باستخدام الخادم بدون تحذيرات

> **ملاحظة:** "Custom MCP servers are not verified by ElevenLabs" - هذا طبيعي، لأن الخادم مخصص

---

## 📋 ملخص القيم المطلوبة

```
Name: rare4n-backend
Description: MCP Server for RARE 4N Backend - Provides access to all backend APIs, libraries, payments, Twilio, and builder services.

Server type: SSE (أو Streamable HTTP)
Server URL: https://api.zien-ai.app/api/mcp
Type: URL
Value: https://api.zien-ai.app/api/mcp

Secret Token: rare4n_mcp_secret_2026_secure_key_agn@algeneralnrsafa01018811220

HTTP Headers:
  - Content-Type: application/json
  - Authorization: Bearer {{api_key}} (اختياري)

Tool Approval Mode: Always Ask (موصى به)
  أو Fine-Grained Tool Approval

Tool Settings:
  - Force Pre-tool Speech: غير مفعل
  - Disable Interruptions: غير مفعل
  - Execution mode: Immediate
  - Tool call sound: None

I trust this server: ✅ مفعل
```

---

## ✅ بعد الحفظ

بعد إضافة MCP Server بنجاح:

1. ✅ ستظهر جميع Tools (7 Tools) تلقائياً
2. ✅ ستظهر Resources (Libraries)
3. ✅ يمكنك اختبار Tool من خلال بدء محادثة

---

## 🧪 اختبار MCP Server

### 1. ابدأ محادثة مع Agent
### 2. جرب:
```
"أعرض لي القوالب المتاحة"
```
### 3. يجب أن يطلب الـ Agent موافقتك (إذا اخترت "Always Ask")
### 4. بعد الموافقة، يجب أن يستدعي `preview_library` tool
### 5. تحقق من Backend logs:
```
📥 MCP Request: tools/call
🔧 MCP Tool Call: preview_library
```

---

## ⚠️ ملاحظات مهمة

1. **Server URL** يجب أن يكون متاحاً من الإنترنت
2. **Secret Token** اختياري (إذا لم تضيف authentication في Backend)
3. **HTTP Headers** اختياري (لكن `Content-Type` مفيد)
4. **Tool Approval Mode** - اختر حسب مستوى الأمان المطلوب
5. **I trust this server** - فعّله لتجنب التحذيرات

---

## 🔗 الروابط

- **MCP Endpoint:** `https://api.zien-ai.app/api/mcp`
- **Backend Route:** `apps/backend/src/routes/mcp.js`
- **MCP Config:** `elevenlabs-config/mcp-servers/rare4n-backend-mcp.json`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل تفصيلي لكل حقل في النموذج

---

## 📋 Basic Information (المعلومات الأساسية)

### Name (الاسم):
```
rare4n-backend
```
أو:
```
RARE 4N Backend MCP
```

### Description (الوصف):
```
MCP Server for RARE 4N Backend - Provides access to all backend APIs, libraries, payments, Twilio, and builder services. Includes 7 tools: preview_library, search_library, submit_to_builder, create_payment, send_twilio_message, notify_owner, execute_owner_command.
```

---

## 🔧 Server Configuration (إعدادات الخادم)

### Server type (نوع الخادم):
اختر: **SSE** (Server-Sent Events)

> **ملاحظة:** إذا لم يكن SSE متاحاً، اختر **Streamable HTTP**

### Server URL (رابط الخادم):
```
https://api.zien-ai.app/api/mcp
```

### Type (النوع):
اختر: **URL**

### Value (القيمة):
```
https://api.zien-ai.app/api/mcp
```

---

## 🔐 Secret Token (رمز الوصول السري)

### Secret (الرمز السري):
```
rare4n_mcp_secret_2026_secure_key_agn@algeneralnrsafa01018811220
```

أو يمكنك استخدام:
```
RARE4N-MCP-SECRET-2026
```

> **ملاحظة:** هذا الرمز يجب أن يطابق الموجود في Backend `.env` (إذا أردت إضافة authentication)

---

## 📝 HTTP Headers (رؤوس HTTP)

### Add header (إضافة رأس):

#### Header 1:
- **Name:** `Content-Type`
- **Value:** `application/json`

#### Header 2 (اختياري - للـ Authentication):
- **Name:** `Authorization`
- **Value:** `Bearer {{api_key}}`

> **ملاحظة:** `{{api_key}}` سيتم استبداله تلقائياً من ElevenLabs

---

## ✅ Tool Approval Mode (وضع موافقة الأدوات)

### الخيارات:

#### 1. Always Ask (دائماً اسأل) - **موصى به**
- ✅ **Maximum security**
- الـ Agent سيطلب موافقتك قبل كل استخدام للأداة
- **اختر هذا الخيار** للأمان الأقصى

#### 2. Fine-Grained Tool Approval (موافقة دقيقة)
- يمكنك اختيار الأدوات التي تعمل تلقائياً
- والأدوات التي تحتاج موافقة
- **اختر هذا** إذا أردت التحكم في كل أداة

#### 3. No Approval (لا موافقة)
- الـ Agent يمكنه استخدام أي أداة بدون موافقة
- ⚠️ **غير موصى به** إلا إذا كنت تثق تماماً

**الموصى به:** **Always Ask** أو **Fine-Grained Tool Approval**

---

## ⚙️ Tool Settings (إعدادات الأدوات)

### Force Pre-tool Speech (إجبار الكلام قبل الأداة):
- **الافتراضي:** الـ Agent يتكلم إذا كانت الأوقات طويلة
- **Force:** الـ Agent يتكلم قبل كل تنفيذ أداة
- **الموصى به:** اتركه **غير مفعل** (Default)

### Disable Interruptions (تعطيل المقاطعات):
- **الافتراضي:** المستخدم يمكنه مقاطعة الـ Agent أثناء تنفيذ الأداة
- **Disable:** تعطيل المقاطعات أثناء تنفيذ الأداة
- **الموصى به:** اتركه **غير مفعل** (Default)

### Execution mode (وضع التنفيذ):
اختر: **Immediate** (فوري)
- الأداة تعمل فوراً عند الطلب
- لا انتظار

### Tool call sound (صوت تنفيذ الأداة):
اختر: **None** (لا صوت)
- أو اختر صوت إذا أردت

---

## 🔒 I trust this server (أثق بهذا الخادم)

### ✅ فعّل هذا الخيار:
- **I trust this server** ✅ (ضع علامة)
- هذا يسمح للـ Agent باستخدام الخادم بدون تحذيرات

> **ملاحظة:** "Custom MCP servers are not verified by ElevenLabs" - هذا طبيعي، لأن الخادم مخصص

---

## 📋 ملخص القيم المطلوبة

```
Name: rare4n-backend
Description: MCP Server for RARE 4N Backend - Provides access to all backend APIs, libraries, payments, Twilio, and builder services.

Server type: SSE (أو Streamable HTTP)
Server URL: https://api.zien-ai.app/api/mcp
Type: URL
Value: https://api.zien-ai.app/api/mcp

Secret Token: rare4n_mcp_secret_2026_secure_key_agn@algeneralnrsafa01018811220

HTTP Headers:
  - Content-Type: application/json
  - Authorization: Bearer {{api_key}} (اختياري)

Tool Approval Mode: Always Ask (موصى به)
  أو Fine-Grained Tool Approval

Tool Settings:
  - Force Pre-tool Speech: غير مفعل
  - Disable Interruptions: غير مفعل
  - Execution mode: Immediate
  - Tool call sound: None

I trust this server: ✅ مفعل
```

---

## ✅ بعد الحفظ

بعد إضافة MCP Server بنجاح:

1. ✅ ستظهر جميع Tools (7 Tools) تلقائياً
2. ✅ ستظهر Resources (Libraries)
3. ✅ يمكنك اختبار Tool من خلال بدء محادثة

---

## 🧪 اختبار MCP Server

### 1. ابدأ محادثة مع Agent
### 2. جرب:
```
"أعرض لي القوالب المتاحة"
```
### 3. يجب أن يطلب الـ Agent موافقتك (إذا اخترت "Always Ask")
### 4. بعد الموافقة، يجب أن يستدعي `preview_library` tool
### 5. تحقق من Backend logs:
```
📥 MCP Request: tools/call
🔧 MCP Tool Call: preview_library
```

---

## ⚠️ ملاحظات مهمة

1. **Server URL** يجب أن يكون متاحاً من الإنترنت
2. **Secret Token** اختياري (إذا لم تضيف authentication في Backend)
3. **HTTP Headers** اختياري (لكن `Content-Type` مفيد)
4. **Tool Approval Mode** - اختر حسب مستوى الأمان المطلوب
5. **I trust this server** - فعّله لتجنب التحذيرات

---

## 🔗 الروابط

- **MCP Endpoint:** `https://api.zien-ai.app/api/mcp`
- **Backend Route:** `apps/backend/src/routes/mcp.js`
- **MCP Config:** `elevenlabs-config/mcp-servers/rare4n-backend-mcp.json`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل تفصيلي لكل حقل في النموذج

---

## 📋 Basic Information (المعلومات الأساسية)

### Name (الاسم):
```
rare4n-backend
```
أو:
```
RARE 4N Backend MCP
```

### Description (الوصف):
```
MCP Server for RARE 4N Backend - Provides access to all backend APIs, libraries, payments, Twilio, and builder services. Includes 7 tools: preview_library, search_library, submit_to_builder, create_payment, send_twilio_message, notify_owner, execute_owner_command.
```

---

## 🔧 Server Configuration (إعدادات الخادم)

### Server type (نوع الخادم):
اختر: **SSE** (Server-Sent Events)

> **ملاحظة:** إذا لم يكن SSE متاحاً، اختر **Streamable HTTP**

### Server URL (رابط الخادم):
```
https://api.zien-ai.app/api/mcp
```

### Type (النوع):
اختر: **URL**

### Value (القيمة):
```
https://api.zien-ai.app/api/mcp
```

---

## 🔐 Secret Token (رمز الوصول السري)

### Secret (الرمز السري):
```
rare4n_mcp_secret_2026_secure_key_agn@algeneralnrsafa01018811220
```

أو يمكنك استخدام:
```
RARE4N-MCP-SECRET-2026
```

> **ملاحظة:** هذا الرمز يجب أن يطابق الموجود في Backend `.env` (إذا أردت إضافة authentication)

---

## 📝 HTTP Headers (رؤوس HTTP)

### Add header (إضافة رأس):

#### Header 1:
- **Name:** `Content-Type`
- **Value:** `application/json`

#### Header 2 (اختياري - للـ Authentication):
- **Name:** `Authorization`
- **Value:** `Bearer {{api_key}}`

> **ملاحظة:** `{{api_key}}` سيتم استبداله تلقائياً من ElevenLabs

---

## ✅ Tool Approval Mode (وضع موافقة الأدوات)

### الخيارات:

#### 1. Always Ask (دائماً اسأل) - **موصى به**
- ✅ **Maximum security**
- الـ Agent سيطلب موافقتك قبل كل استخدام للأداة
- **اختر هذا الخيار** للأمان الأقصى

#### 2. Fine-Grained Tool Approval (موافقة دقيقة)
- يمكنك اختيار الأدوات التي تعمل تلقائياً
- والأدوات التي تحتاج موافقة
- **اختر هذا** إذا أردت التحكم في كل أداة

#### 3. No Approval (لا موافقة)
- الـ Agent يمكنه استخدام أي أداة بدون موافقة
- ⚠️ **غير موصى به** إلا إذا كنت تثق تماماً

**الموصى به:** **Always Ask** أو **Fine-Grained Tool Approval**

---

## ⚙️ Tool Settings (إعدادات الأدوات)

### Force Pre-tool Speech (إجبار الكلام قبل الأداة):
- **الافتراضي:** الـ Agent يتكلم إذا كانت الأوقات طويلة
- **Force:** الـ Agent يتكلم قبل كل تنفيذ أداة
- **الموصى به:** اتركه **غير مفعل** (Default)

### Disable Interruptions (تعطيل المقاطعات):
- **الافتراضي:** المستخدم يمكنه مقاطعة الـ Agent أثناء تنفيذ الأداة
- **Disable:** تعطيل المقاطعات أثناء تنفيذ الأداة
- **الموصى به:** اتركه **غير مفعل** (Default)

### Execution mode (وضع التنفيذ):
اختر: **Immediate** (فوري)
- الأداة تعمل فوراً عند الطلب
- لا انتظار

### Tool call sound (صوت تنفيذ الأداة):
اختر: **None** (لا صوت)
- أو اختر صوت إذا أردت

---

## 🔒 I trust this server (أثق بهذا الخادم)

### ✅ فعّل هذا الخيار:
- **I trust this server** ✅ (ضع علامة)
- هذا يسمح للـ Agent باستخدام الخادم بدون تحذيرات

> **ملاحظة:** "Custom MCP servers are not verified by ElevenLabs" - هذا طبيعي، لأن الخادم مخصص

---

## 📋 ملخص القيم المطلوبة

```
Name: rare4n-backend
Description: MCP Server for RARE 4N Backend - Provides access to all backend APIs, libraries, payments, Twilio, and builder services.

Server type: SSE (أو Streamable HTTP)
Server URL: https://api.zien-ai.app/api/mcp
Type: URL
Value: https://api.zien-ai.app/api/mcp

Secret Token: rare4n_mcp_secret_2026_secure_key_agn@algeneralnrsafa01018811220

HTTP Headers:
  - Content-Type: application/json
  - Authorization: Bearer {{api_key}} (اختياري)

Tool Approval Mode: Always Ask (موصى به)
  أو Fine-Grained Tool Approval

Tool Settings:
  - Force Pre-tool Speech: غير مفعل
  - Disable Interruptions: غير مفعل
  - Execution mode: Immediate
  - Tool call sound: None

I trust this server: ✅ مفعل
```

---

## ✅ بعد الحفظ

بعد إضافة MCP Server بنجاح:

1. ✅ ستظهر جميع Tools (7 Tools) تلقائياً
2. ✅ ستظهر Resources (Libraries)
3. ✅ يمكنك اختبار Tool من خلال بدء محادثة

---

## 🧪 اختبار MCP Server

### 1. ابدأ محادثة مع Agent
### 2. جرب:
```
"أعرض لي القوالب المتاحة"
```
### 3. يجب أن يطلب الـ Agent موافقتك (إذا اخترت "Always Ask")
### 4. بعد الموافقة، يجب أن يستدعي `preview_library` tool
### 5. تحقق من Backend logs:
```
📥 MCP Request: tools/call
🔧 MCP Tool Call: preview_library
```

---

## ⚠️ ملاحظات مهمة

1. **Server URL** يجب أن يكون متاحاً من الإنترنت
2. **Secret Token** اختياري (إذا لم تضيف authentication في Backend)
3. **HTTP Headers** اختياري (لكن `Content-Type` مفيد)
4. **Tool Approval Mode** - اختر حسب مستوى الأمان المطلوب
5. **I trust this server** - فعّله لتجنب التحذيرات

---

## 🔗 الروابط

- **MCP Endpoint:** `https://api.zien-ai.app/api/mcp`
- **Backend Route:** `apps/backend/src/routes/mcp.js`
- **MCP Config:** `elevenlabs-config/mcp-servers/rare4n-backend-mcp.json`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

