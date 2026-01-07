# إعداد ElevenLabs Agent Integration - RARE 4N
## دليل شامل لإعداد Integration في ElevenLabs Agents Platform

---

## 📋 نظرة عامة

هذا الدليل يوضح كيفية إعداد **Integration** في ElevenLabs Agents Platform لربط الـ Agent مع Backend، مما يتيح:
- ✅ **جميع اللغات واللهجات** (العربية بجميع لهجاتها، الإنجليزية، الفرنسية، إلخ)
- ✅ **عملية دفع** (Stripe, Apple Pay)
- ✅ **إنشاء وإرسال الطلبات** (Builder)
- ✅ **Twilio** (SMS, WhatsApp, Voice)
- ✅ **تنفيذ أوامر المالك** (Nader/Eamon)

---

## 🚀 الخطوة 1: إعداد Webhook في ElevenLabs Dashboard

### 1.1. اذهب إلى ElevenLabs Agents Platform:
https://elevenlabs.io/app/convai/agents

### 1.2. اختر Agent:
`agent_0701kc4axybpf6fvak70xwfzpyka`

### 1.3. اذهب إلى Integrations:
- **Configure** → **Integrations**
- اضغط **"Add Integration"** أو **"Connect Integration"**

### 1.4. إعداد Webhook:
- **Integration Type:** `Webhook` أو `Custom API`
- **Name:** `RARE 4N Backend`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Webhook Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`

### 1.5. Events (فعّل جميعها):
- ✅ `conversation.started`
- ✅ `conversation.message`
- ✅ `conversation.ended`
- ✅ `agent.tool_call`
- ✅ `agent.action`

---

## 🔧 الخطوة 2: إعداد Tools في ElevenLabs Agent

### 2.1. اذهب إلى Tools:
- **Configure** → **Tools**
- اضغط **"Add Tool"** أو **"Create Tool"**

### 2.2. Tools المطلوبة:

#### Tool 1: `preview_library`
```json
{
  "name": "preview_library",
  "description": "معاينة المكتبات (Templates, Systems, Themes) للعميل. Supports Arabic and English.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "type": {
        "type": "string",
        "enum": ["templates", "systems", "themes"],
        "description": "نوع المكتبة"
      },
      "category": {
        "type": "string",
        "description": "الفئة (اختياري)"
      },
      "limit": {
        "type": "number",
        "default": 10,
        "description": "عدد العناصر"
      }
    },
    "required": ["type"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/preview-library",
  "method": "POST"
}
```

#### Tool 2: `search_library`
```json
{
  "name": "search_library",
  "description": "البحث في المكتبات. Supports all languages and dialects.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "كلمة البحث"
      },
      "type": {
        "type": "string",
        "enum": ["all", "templates", "systems", "themes"],
        "default": "all"
      }
    },
    "required": ["query"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/search-library",
  "method": "POST"
}
```

#### Tool 3: `submit_to_builder`
```json
{
  "name": "submit_to_builder",
  "description": "إرسال الطلب للبيلدر بعد تسجيله. Creates build request and sends to Auto Builder.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "client_id": {
        "type": "string",
        "description": "معرف العميل"
      },
      "request_data": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": ["template", "system", "theme"]
          },
          "selectedItem": {
            "type": "object",
            "description": "العنصر المختار"
          },
          "clientName": {
            "type": "string",
            "description": "اسم العميل"
          },
          "clientEmail": {
            "type": "string",
            "description": "بريد العميل"
          },
          "clientPhone": {
            "type": "string",
            "description": "هاتف العميل (اختياري)"
          },
          "description": {
            "type": "string",
            "description": "وصف المشروع (اختياري)"
          }
        },
        "required": ["type", "selectedItem", "clientName", "clientEmail"]
      }
    },
    "required": ["client_id", "request_data"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/submit-to-builder",
  "method": "POST"
}
```

#### Tool 4: `create_payment`
```json
{
  "name": "create_payment",
  "description": "إنشاء عملية دفع للعميل. Supports Stripe and Apple Pay.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "requestId": {
        "type": "string",
        "description": "معرف الطلب"
      },
      "amount": {
        "type": "number",
        "description": "المبلغ"
      },
      "currency": {
        "type": "string",
        "default": "AED",
        "description": "العملة"
      },
      "clientId": {
        "type": "string",
        "description": "معرف العميل"
      },
      "clientEmail": {
        "type": "string",
        "description": "بريد العميل"
      }
    },
    "required": ["requestId", "amount", "clientId", "clientEmail"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/create-payment",
  "method": "POST"
}
```

#### Tool 5: `send_twilio_message`
```json
{
  "name": "send_twilio_message",
  "description": "إرسال رسالة عبر Twilio WhatsApp أو SMS. Supports all languages.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "phone": {
        "type": "string",
        "description": "رقم الهاتف (مع رمز الدولة)"
      },
      "message": {
        "type": "string",
        "description": "نص الرسالة"
      },
      "type": {
        "type": "string",
        "enum": ["whatsapp", "sms"],
        "default": "whatsapp"
      }
    },
    "required": ["phone", "message"]
  },
  "endpoint": "https://api.zien-ai.app/api/twilio/send",
  "method": "POST"
}
```

#### Tool 6: `notify_owner`
```json
{
  "name": "notify_owner",
  "description": "إرسال إشعار للمالك (Nader/Eamon) عبر Twilio. Use for important events or owner commands.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "reason": {
        "type": "string",
        "description": "سبب الإشعار"
      },
      "priority": {
        "type": "string",
        "enum": ["low", "normal", "high", "emergency"],
        "default": "normal"
      }
    },
    "required": ["reason"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/notify-owner",
  "method": "POST"
}
```

#### Tool 7: `execute_owner_command`
```json
{
  "name": "execute_owner_command",
  "description": "تنفيذ أمر من المالك (Nader/Eamon). Executes commands like payment, build, send message, etc.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "command": {
        "type": "string",
        "description": "الأمر المراد تنفيذه"
      },
      "context": {
        "type": "object",
        "description": "سياق الأمر (اختياري)"
      }
    },
    "required": ["command"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/execute-owner-command",
  "method": "POST"
}
```

---

## 🌍 الخطوة 3: إعداد اللغات واللهجات

### 3.1. في Agent Settings:
- **Languages:** فعّل جميع اللغات المطلوبة:
  - Arabic (ar) - جميع اللهجات
  - English (en)
  - French (fr)
  - Spanish (es)
  - German (de)
  - Italian (it)
  - Portuguese (pt)
  - Russian (ru)
  - Chinese (zh)
  - Japanese (ja)
  - Korean (ko)
  - وغيرها...

### 3.2. Dialects (اللهجات):
- **Arabic Dialects:**
  - Egyptian (eg)
  - Saudi (sa)
  - UAE (ae)
  - Jordanian (jo)
  - Lebanese (lb)
  - Moroccan (ma)
  - Tunisian (tn)
  - Algerian (dz)
  - Iraqi (iq)
  - Syrian (sy)
  - Yemeni (ye)
  - Omani (om)
  - Kuwaiti (kw)
  - Qatari (qa)
  - Bahraini (bh)

### 3.3. Voice Model:
- استخدم **Multilingual v2** model
- فعّل **Speaker Boost**
- فعّل **Dialect Detection**

---

## 📝 الخطوة 4: إعداد Agent Context

في Agent Settings → Context، أضف:

```json
{
  "webhook_url": "https://api.zien-ai.app/api/elevenlabs/webhook",
  "api_url": "https://api.zien-ai.app",
  "supported_languages": ["ar", "en", "fr", "es", "de", "it", "pt", "ru", "zh", "ja", "ko"],
  "supported_dialects": {
    "ar": ["eg", "sa", "ae", "jo", "lb", "ma", "tn", "dz", "iq", "sy", "ye", "om", "kw", "qa", "bh"],
    "en": ["us", "uk", "au", "ca", "nz", "ie"],
    "es": ["es", "mx", "ar", "co", "cl", "pe", "ve"]
  },
  "owner_phone_nader": "+971529211077",
  "owner_phone_eamon": null,
  "owner_email": "gm@zien-ai.app",
  "twilio_enabled": true,
  "payment_enabled": true,
  "builder_enabled": true,
  "command_saving_enabled": true,
  "personality_awareness": true,
  "owner_commands_enabled": true
}
```

---

## ✅ الخطوة 5: اختبار Integration

### 5.1. اختبار Webhook:
1. ابدأ محادثة في ElevenLabs Agent
2. تحقق من Backend logs:
   ```
   📥 ElevenLabs Webhook received: conversation.started
   ✅ Conversation started: conv_123
   ```

### 5.2. اختبار Tools:
1. قل للـ Agent: "أعرض لي المكتبات"
   - يجب أن يستدعي `preview_library`
2. قل: "أريد بناء تطبيق"
   - يجب أن يستدعي `submit_to_builder`
3. قل: "أنشئ عملية دفع"
   - يجب أن يستدعي `create_payment`
4. قل: "أرسل رسالة للعميل"
   - يجب أن يستدعي `send_twilio_message`
5. قل: "أخبر المالك"
   - يجب أن يستدعي `notify_owner`

### 5.3. اختبار اللغات:
1. تحدث بالعربية (لهجة مصرية)
2. تحدث بالإنجليزية
3. تحدث بلهجة خليجية
4. تحقق من أن الـ Agent يرد بنفس اللغة/اللهجة

---

## 📊 الخلاصة

بعد إتمام الخطوات:
- ✅ Webhook يعمل مع Backend
- ✅ جميع Tools متاحة للـ Agent
- ✅ دعم جميع اللغات واللهجات
- ✅ عملية دفع تعمل
- ✅ إنشاء وإرسال الطلبات يعمل
- ✅ Twilio يعمل
- ✅ تنفيذ أوامر المالك يعمل

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Webhook Endpoint:** https://api.zien-ai.app/api/elevenlabs/webhook
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل شامل لإعداد Integration في ElevenLabs Agents Platform

---

## 📋 نظرة عامة

هذا الدليل يوضح كيفية إعداد **Integration** في ElevenLabs Agents Platform لربط الـ Agent مع Backend، مما يتيح:
- ✅ **جميع اللغات واللهجات** (العربية بجميع لهجاتها، الإنجليزية، الفرنسية، إلخ)
- ✅ **عملية دفع** (Stripe, Apple Pay)
- ✅ **إنشاء وإرسال الطلبات** (Builder)
- ✅ **Twilio** (SMS, WhatsApp, Voice)
- ✅ **تنفيذ أوامر المالك** (Nader/Eamon)

---

## 🚀 الخطوة 1: إعداد Webhook في ElevenLabs Dashboard

### 1.1. اذهب إلى ElevenLabs Agents Platform:
https://elevenlabs.io/app/convai/agents

### 1.2. اختر Agent:
`agent_0701kc4axybpf6fvak70xwfzpyka`

### 1.3. اذهب إلى Integrations:
- **Configure** → **Integrations**
- اضغط **"Add Integration"** أو **"Connect Integration"**

### 1.4. إعداد Webhook:
- **Integration Type:** `Webhook` أو `Custom API`
- **Name:** `RARE 4N Backend`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Webhook Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`

### 1.5. Events (فعّل جميعها):
- ✅ `conversation.started`
- ✅ `conversation.message`
- ✅ `conversation.ended`
- ✅ `agent.tool_call`
- ✅ `agent.action`

---

## 🔧 الخطوة 2: إعداد Tools في ElevenLabs Agent

### 2.1. اذهب إلى Tools:
- **Configure** → **Tools**
- اضغط **"Add Tool"** أو **"Create Tool"**

### 2.2. Tools المطلوبة:

#### Tool 1: `preview_library`
```json
{
  "name": "preview_library",
  "description": "معاينة المكتبات (Templates, Systems, Themes) للعميل. Supports Arabic and English.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "type": {
        "type": "string",
        "enum": ["templates", "systems", "themes"],
        "description": "نوع المكتبة"
      },
      "category": {
        "type": "string",
        "description": "الفئة (اختياري)"
      },
      "limit": {
        "type": "number",
        "default": 10,
        "description": "عدد العناصر"
      }
    },
    "required": ["type"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/preview-library",
  "method": "POST"
}
```

#### Tool 2: `search_library`
```json
{
  "name": "search_library",
  "description": "البحث في المكتبات. Supports all languages and dialects.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "كلمة البحث"
      },
      "type": {
        "type": "string",
        "enum": ["all", "templates", "systems", "themes"],
        "default": "all"
      }
    },
    "required": ["query"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/search-library",
  "method": "POST"
}
```

#### Tool 3: `submit_to_builder`
```json
{
  "name": "submit_to_builder",
  "description": "إرسال الطلب للبيلدر بعد تسجيله. Creates build request and sends to Auto Builder.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "client_id": {
        "type": "string",
        "description": "معرف العميل"
      },
      "request_data": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": ["template", "system", "theme"]
          },
          "selectedItem": {
            "type": "object",
            "description": "العنصر المختار"
          },
          "clientName": {
            "type": "string",
            "description": "اسم العميل"
          },
          "clientEmail": {
            "type": "string",
            "description": "بريد العميل"
          },
          "clientPhone": {
            "type": "string",
            "description": "هاتف العميل (اختياري)"
          },
          "description": {
            "type": "string",
            "description": "وصف المشروع (اختياري)"
          }
        },
        "required": ["type", "selectedItem", "clientName", "clientEmail"]
      }
    },
    "required": ["client_id", "request_data"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/submit-to-builder",
  "method": "POST"
}
```

#### Tool 4: `create_payment`
```json
{
  "name": "create_payment",
  "description": "إنشاء عملية دفع للعميل. Supports Stripe and Apple Pay.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "requestId": {
        "type": "string",
        "description": "معرف الطلب"
      },
      "amount": {
        "type": "number",
        "description": "المبلغ"
      },
      "currency": {
        "type": "string",
        "default": "AED",
        "description": "العملة"
      },
      "clientId": {
        "type": "string",
        "description": "معرف العميل"
      },
      "clientEmail": {
        "type": "string",
        "description": "بريد العميل"
      }
    },
    "required": ["requestId", "amount", "clientId", "clientEmail"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/create-payment",
  "method": "POST"
}
```

#### Tool 5: `send_twilio_message`
```json
{
  "name": "send_twilio_message",
  "description": "إرسال رسالة عبر Twilio WhatsApp أو SMS. Supports all languages.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "phone": {
        "type": "string",
        "description": "رقم الهاتف (مع رمز الدولة)"
      },
      "message": {
        "type": "string",
        "description": "نص الرسالة"
      },
      "type": {
        "type": "string",
        "enum": ["whatsapp", "sms"],
        "default": "whatsapp"
      }
    },
    "required": ["phone", "message"]
  },
  "endpoint": "https://api.zien-ai.app/api/twilio/send",
  "method": "POST"
}
```

#### Tool 6: `notify_owner`
```json
{
  "name": "notify_owner",
  "description": "إرسال إشعار للمالك (Nader/Eamon) عبر Twilio. Use for important events or owner commands.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "reason": {
        "type": "string",
        "description": "سبب الإشعار"
      },
      "priority": {
        "type": "string",
        "enum": ["low", "normal", "high", "emergency"],
        "default": "normal"
      }
    },
    "required": ["reason"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/notify-owner",
  "method": "POST"
}
```

#### Tool 7: `execute_owner_command`
```json
{
  "name": "execute_owner_command",
  "description": "تنفيذ أمر من المالك (Nader/Eamon). Executes commands like payment, build, send message, etc.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "command": {
        "type": "string",
        "description": "الأمر المراد تنفيذه"
      },
      "context": {
        "type": "object",
        "description": "سياق الأمر (اختياري)"
      }
    },
    "required": ["command"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/execute-owner-command",
  "method": "POST"
}
```

---

## 🌍 الخطوة 3: إعداد اللغات واللهجات

### 3.1. في Agent Settings:
- **Languages:** فعّل جميع اللغات المطلوبة:
  - Arabic (ar) - جميع اللهجات
  - English (en)
  - French (fr)
  - Spanish (es)
  - German (de)
  - Italian (it)
  - Portuguese (pt)
  - Russian (ru)
  - Chinese (zh)
  - Japanese (ja)
  - Korean (ko)
  - وغيرها...

### 3.2. Dialects (اللهجات):
- **Arabic Dialects:**
  - Egyptian (eg)
  - Saudi (sa)
  - UAE (ae)
  - Jordanian (jo)
  - Lebanese (lb)
  - Moroccan (ma)
  - Tunisian (tn)
  - Algerian (dz)
  - Iraqi (iq)
  - Syrian (sy)
  - Yemeni (ye)
  - Omani (om)
  - Kuwaiti (kw)
  - Qatari (qa)
  - Bahraini (bh)

### 3.3. Voice Model:
- استخدم **Multilingual v2** model
- فعّل **Speaker Boost**
- فعّل **Dialect Detection**

---

## 📝 الخطوة 4: إعداد Agent Context

في Agent Settings → Context، أضف:

```json
{
  "webhook_url": "https://api.zien-ai.app/api/elevenlabs/webhook",
  "api_url": "https://api.zien-ai.app",
  "supported_languages": ["ar", "en", "fr", "es", "de", "it", "pt", "ru", "zh", "ja", "ko"],
  "supported_dialects": {
    "ar": ["eg", "sa", "ae", "jo", "lb", "ma", "tn", "dz", "iq", "sy", "ye", "om", "kw", "qa", "bh"],
    "en": ["us", "uk", "au", "ca", "nz", "ie"],
    "es": ["es", "mx", "ar", "co", "cl", "pe", "ve"]
  },
  "owner_phone_nader": "+971529211077",
  "owner_phone_eamon": null,
  "owner_email": "gm@zien-ai.app",
  "twilio_enabled": true,
  "payment_enabled": true,
  "builder_enabled": true,
  "command_saving_enabled": true,
  "personality_awareness": true,
  "owner_commands_enabled": true
}
```

---

## ✅ الخطوة 5: اختبار Integration

### 5.1. اختبار Webhook:
1. ابدأ محادثة في ElevenLabs Agent
2. تحقق من Backend logs:
   ```
   📥 ElevenLabs Webhook received: conversation.started
   ✅ Conversation started: conv_123
   ```

### 5.2. اختبار Tools:
1. قل للـ Agent: "أعرض لي المكتبات"
   - يجب أن يستدعي `preview_library`
2. قل: "أريد بناء تطبيق"
   - يجب أن يستدعي `submit_to_builder`
3. قل: "أنشئ عملية دفع"
   - يجب أن يستدعي `create_payment`
4. قل: "أرسل رسالة للعميل"
   - يجب أن يستدعي `send_twilio_message`
5. قل: "أخبر المالك"
   - يجب أن يستدعي `notify_owner`

### 5.3. اختبار اللغات:
1. تحدث بالعربية (لهجة مصرية)
2. تحدث بالإنجليزية
3. تحدث بلهجة خليجية
4. تحقق من أن الـ Agent يرد بنفس اللغة/اللهجة

---

## 📊 الخلاصة

بعد إتمام الخطوات:
- ✅ Webhook يعمل مع Backend
- ✅ جميع Tools متاحة للـ Agent
- ✅ دعم جميع اللغات واللهجات
- ✅ عملية دفع تعمل
- ✅ إنشاء وإرسال الطلبات يعمل
- ✅ Twilio يعمل
- ✅ تنفيذ أوامر المالك يعمل

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Webhook Endpoint:** https://api.zien-ai.app/api/elevenlabs/webhook
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل شامل لإعداد Integration في ElevenLabs Agents Platform

---

## 📋 نظرة عامة

هذا الدليل يوضح كيفية إعداد **Integration** في ElevenLabs Agents Platform لربط الـ Agent مع Backend، مما يتيح:
- ✅ **جميع اللغات واللهجات** (العربية بجميع لهجاتها، الإنجليزية، الفرنسية، إلخ)
- ✅ **عملية دفع** (Stripe, Apple Pay)
- ✅ **إنشاء وإرسال الطلبات** (Builder)
- ✅ **Twilio** (SMS, WhatsApp, Voice)
- ✅ **تنفيذ أوامر المالك** (Nader/Eamon)

---

## 🚀 الخطوة 1: إعداد Webhook في ElevenLabs Dashboard

### 1.1. اذهب إلى ElevenLabs Agents Platform:
https://elevenlabs.io/app/convai/agents

### 1.2. اختر Agent:
`agent_0701kc4axybpf6fvak70xwfzpyka`

### 1.3. اذهب إلى Integrations:
- **Configure** → **Integrations**
- اضغط **"Add Integration"** أو **"Connect Integration"**

### 1.4. إعداد Webhook:
- **Integration Type:** `Webhook` أو `Custom API`
- **Name:** `RARE 4N Backend`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Webhook Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`

### 1.5. Events (فعّل جميعها):
- ✅ `conversation.started`
- ✅ `conversation.message`
- ✅ `conversation.ended`
- ✅ `agent.tool_call`
- ✅ `agent.action`

---

## 🔧 الخطوة 2: إعداد Tools في ElevenLabs Agent

### 2.1. اذهب إلى Tools:
- **Configure** → **Tools**
- اضغط **"Add Tool"** أو **"Create Tool"**

### 2.2. Tools المطلوبة:

#### Tool 1: `preview_library`
```json
{
  "name": "preview_library",
  "description": "معاينة المكتبات (Templates, Systems, Themes) للعميل. Supports Arabic and English.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "type": {
        "type": "string",
        "enum": ["templates", "systems", "themes"],
        "description": "نوع المكتبة"
      },
      "category": {
        "type": "string",
        "description": "الفئة (اختياري)"
      },
      "limit": {
        "type": "number",
        "default": 10,
        "description": "عدد العناصر"
      }
    },
    "required": ["type"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/preview-library",
  "method": "POST"
}
```

#### Tool 2: `search_library`
```json
{
  "name": "search_library",
  "description": "البحث في المكتبات. Supports all languages and dialects.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "كلمة البحث"
      },
      "type": {
        "type": "string",
        "enum": ["all", "templates", "systems", "themes"],
        "default": "all"
      }
    },
    "required": ["query"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/search-library",
  "method": "POST"
}
```

#### Tool 3: `submit_to_builder`
```json
{
  "name": "submit_to_builder",
  "description": "إرسال الطلب للبيلدر بعد تسجيله. Creates build request and sends to Auto Builder.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "client_id": {
        "type": "string",
        "description": "معرف العميل"
      },
      "request_data": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": ["template", "system", "theme"]
          },
          "selectedItem": {
            "type": "object",
            "description": "العنصر المختار"
          },
          "clientName": {
            "type": "string",
            "description": "اسم العميل"
          },
          "clientEmail": {
            "type": "string",
            "description": "بريد العميل"
          },
          "clientPhone": {
            "type": "string",
            "description": "هاتف العميل (اختياري)"
          },
          "description": {
            "type": "string",
            "description": "وصف المشروع (اختياري)"
          }
        },
        "required": ["type", "selectedItem", "clientName", "clientEmail"]
      }
    },
    "required": ["client_id", "request_data"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/submit-to-builder",
  "method": "POST"
}
```

#### Tool 4: `create_payment`
```json
{
  "name": "create_payment",
  "description": "إنشاء عملية دفع للعميل. Supports Stripe and Apple Pay.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "requestId": {
        "type": "string",
        "description": "معرف الطلب"
      },
      "amount": {
        "type": "number",
        "description": "المبلغ"
      },
      "currency": {
        "type": "string",
        "default": "AED",
        "description": "العملة"
      },
      "clientId": {
        "type": "string",
        "description": "معرف العميل"
      },
      "clientEmail": {
        "type": "string",
        "description": "بريد العميل"
      }
    },
    "required": ["requestId", "amount", "clientId", "clientEmail"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/create-payment",
  "method": "POST"
}
```

#### Tool 5: `send_twilio_message`
```json
{
  "name": "send_twilio_message",
  "description": "إرسال رسالة عبر Twilio WhatsApp أو SMS. Supports all languages.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "phone": {
        "type": "string",
        "description": "رقم الهاتف (مع رمز الدولة)"
      },
      "message": {
        "type": "string",
        "description": "نص الرسالة"
      },
      "type": {
        "type": "string",
        "enum": ["whatsapp", "sms"],
        "default": "whatsapp"
      }
    },
    "required": ["phone", "message"]
  },
  "endpoint": "https://api.zien-ai.app/api/twilio/send",
  "method": "POST"
}
```

#### Tool 6: `notify_owner`
```json
{
  "name": "notify_owner",
  "description": "إرسال إشعار للمالك (Nader/Eamon) عبر Twilio. Use for important events or owner commands.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "reason": {
        "type": "string",
        "description": "سبب الإشعار"
      },
      "priority": {
        "type": "string",
        "enum": ["low", "normal", "high", "emergency"],
        "default": "normal"
      }
    },
    "required": ["reason"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/notify-owner",
  "method": "POST"
}
```

#### Tool 7: `execute_owner_command`
```json
{
  "name": "execute_owner_command",
  "description": "تنفيذ أمر من المالك (Nader/Eamon). Executes commands like payment, build, send message, etc.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "command": {
        "type": "string",
        "description": "الأمر المراد تنفيذه"
      },
      "context": {
        "type": "object",
        "description": "سياق الأمر (اختياري)"
      }
    },
    "required": ["command"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/execute-owner-command",
  "method": "POST"
}
```

---

## 🌍 الخطوة 3: إعداد اللغات واللهجات

### 3.1. في Agent Settings:
- **Languages:** فعّل جميع اللغات المطلوبة:
  - Arabic (ar) - جميع اللهجات
  - English (en)
  - French (fr)
  - Spanish (es)
  - German (de)
  - Italian (it)
  - Portuguese (pt)
  - Russian (ru)
  - Chinese (zh)
  - Japanese (ja)
  - Korean (ko)
  - وغيرها...

### 3.2. Dialects (اللهجات):
- **Arabic Dialects:**
  - Egyptian (eg)
  - Saudi (sa)
  - UAE (ae)
  - Jordanian (jo)
  - Lebanese (lb)
  - Moroccan (ma)
  - Tunisian (tn)
  - Algerian (dz)
  - Iraqi (iq)
  - Syrian (sy)
  - Yemeni (ye)
  - Omani (om)
  - Kuwaiti (kw)
  - Qatari (qa)
  - Bahraini (bh)

### 3.3. Voice Model:
- استخدم **Multilingual v2** model
- فعّل **Speaker Boost**
- فعّل **Dialect Detection**

---

## 📝 الخطوة 4: إعداد Agent Context

في Agent Settings → Context، أضف:

```json
{
  "webhook_url": "https://api.zien-ai.app/api/elevenlabs/webhook",
  "api_url": "https://api.zien-ai.app",
  "supported_languages": ["ar", "en", "fr", "es", "de", "it", "pt", "ru", "zh", "ja", "ko"],
  "supported_dialects": {
    "ar": ["eg", "sa", "ae", "jo", "lb", "ma", "tn", "dz", "iq", "sy", "ye", "om", "kw", "qa", "bh"],
    "en": ["us", "uk", "au", "ca", "nz", "ie"],
    "es": ["es", "mx", "ar", "co", "cl", "pe", "ve"]
  },
  "owner_phone_nader": "+971529211077",
  "owner_phone_eamon": null,
  "owner_email": "gm@zien-ai.app",
  "twilio_enabled": true,
  "payment_enabled": true,
  "builder_enabled": true,
  "command_saving_enabled": true,
  "personality_awareness": true,
  "owner_commands_enabled": true
}
```

---

## ✅ الخطوة 5: اختبار Integration

### 5.1. اختبار Webhook:
1. ابدأ محادثة في ElevenLabs Agent
2. تحقق من Backend logs:
   ```
   📥 ElevenLabs Webhook received: conversation.started
   ✅ Conversation started: conv_123
   ```

### 5.2. اختبار Tools:
1. قل للـ Agent: "أعرض لي المكتبات"
   - يجب أن يستدعي `preview_library`
2. قل: "أريد بناء تطبيق"
   - يجب أن يستدعي `submit_to_builder`
3. قل: "أنشئ عملية دفع"
   - يجب أن يستدعي `create_payment`
4. قل: "أرسل رسالة للعميل"
   - يجب أن يستدعي `send_twilio_message`
5. قل: "أخبر المالك"
   - يجب أن يستدعي `notify_owner`

### 5.3. اختبار اللغات:
1. تحدث بالعربية (لهجة مصرية)
2. تحدث بالإنجليزية
3. تحدث بلهجة خليجية
4. تحقق من أن الـ Agent يرد بنفس اللغة/اللهجة

---

## 📊 الخلاصة

بعد إتمام الخطوات:
- ✅ Webhook يعمل مع Backend
- ✅ جميع Tools متاحة للـ Agent
- ✅ دعم جميع اللغات واللهجات
- ✅ عملية دفع تعمل
- ✅ إنشاء وإرسال الطلبات يعمل
- ✅ Twilio يعمل
- ✅ تنفيذ أوامر المالك يعمل

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Webhook Endpoint:** https://api.zien-ai.app/api/elevenlabs/webhook
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل شامل لإعداد Integration في ElevenLabs Agents Platform

---

## 📋 نظرة عامة

هذا الدليل يوضح كيفية إعداد **Integration** في ElevenLabs Agents Platform لربط الـ Agent مع Backend، مما يتيح:
- ✅ **جميع اللغات واللهجات** (العربية بجميع لهجاتها، الإنجليزية، الفرنسية، إلخ)
- ✅ **عملية دفع** (Stripe, Apple Pay)
- ✅ **إنشاء وإرسال الطلبات** (Builder)
- ✅ **Twilio** (SMS, WhatsApp, Voice)
- ✅ **تنفيذ أوامر المالك** (Nader/Eamon)

---

## 🚀 الخطوة 1: إعداد Webhook في ElevenLabs Dashboard

### 1.1. اذهب إلى ElevenLabs Agents Platform:
https://elevenlabs.io/app/convai/agents

### 1.2. اختر Agent:
`agent_0701kc4axybpf6fvak70xwfzpyka`

### 1.3. اذهب إلى Integrations:
- **Configure** → **Integrations**
- اضغط **"Add Integration"** أو **"Connect Integration"**

### 1.4. إعداد Webhook:
- **Integration Type:** `Webhook` أو `Custom API`
- **Name:** `RARE 4N Backend`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Webhook Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`

### 1.5. Events (فعّل جميعها):
- ✅ `conversation.started`
- ✅ `conversation.message`
- ✅ `conversation.ended`
- ✅ `agent.tool_call`
- ✅ `agent.action`

---

## 🔧 الخطوة 2: إعداد Tools في ElevenLabs Agent

### 2.1. اذهب إلى Tools:
- **Configure** → **Tools**
- اضغط **"Add Tool"** أو **"Create Tool"**

### 2.2. Tools المطلوبة:

#### Tool 1: `preview_library`
```json
{
  "name": "preview_library",
  "description": "معاينة المكتبات (Templates, Systems, Themes) للعميل. Supports Arabic and English.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "type": {
        "type": "string",
        "enum": ["templates", "systems", "themes"],
        "description": "نوع المكتبة"
      },
      "category": {
        "type": "string",
        "description": "الفئة (اختياري)"
      },
      "limit": {
        "type": "number",
        "default": 10,
        "description": "عدد العناصر"
      }
    },
    "required": ["type"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/preview-library",
  "method": "POST"
}
```

#### Tool 2: `search_library`
```json
{
  "name": "search_library",
  "description": "البحث في المكتبات. Supports all languages and dialects.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "كلمة البحث"
      },
      "type": {
        "type": "string",
        "enum": ["all", "templates", "systems", "themes"],
        "default": "all"
      }
    },
    "required": ["query"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/search-library",
  "method": "POST"
}
```

#### Tool 3: `submit_to_builder`
```json
{
  "name": "submit_to_builder",
  "description": "إرسال الطلب للبيلدر بعد تسجيله. Creates build request and sends to Auto Builder.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "client_id": {
        "type": "string",
        "description": "معرف العميل"
      },
      "request_data": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": ["template", "system", "theme"]
          },
          "selectedItem": {
            "type": "object",
            "description": "العنصر المختار"
          },
          "clientName": {
            "type": "string",
            "description": "اسم العميل"
          },
          "clientEmail": {
            "type": "string",
            "description": "بريد العميل"
          },
          "clientPhone": {
            "type": "string",
            "description": "هاتف العميل (اختياري)"
          },
          "description": {
            "type": "string",
            "description": "وصف المشروع (اختياري)"
          }
        },
        "required": ["type", "selectedItem", "clientName", "clientEmail"]
      }
    },
    "required": ["client_id", "request_data"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/submit-to-builder",
  "method": "POST"
}
```

#### Tool 4: `create_payment`
```json
{
  "name": "create_payment",
  "description": "إنشاء عملية دفع للعميل. Supports Stripe and Apple Pay.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "requestId": {
        "type": "string",
        "description": "معرف الطلب"
      },
      "amount": {
        "type": "number",
        "description": "المبلغ"
      },
      "currency": {
        "type": "string",
        "default": "AED",
        "description": "العملة"
      },
      "clientId": {
        "type": "string",
        "description": "معرف العميل"
      },
      "clientEmail": {
        "type": "string",
        "description": "بريد العميل"
      }
    },
    "required": ["requestId", "amount", "clientId", "clientEmail"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/create-payment",
  "method": "POST"
}
```

#### Tool 5: `send_twilio_message`
```json
{
  "name": "send_twilio_message",
  "description": "إرسال رسالة عبر Twilio WhatsApp أو SMS. Supports all languages.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "phone": {
        "type": "string",
        "description": "رقم الهاتف (مع رمز الدولة)"
      },
      "message": {
        "type": "string",
        "description": "نص الرسالة"
      },
      "type": {
        "type": "string",
        "enum": ["whatsapp", "sms"],
        "default": "whatsapp"
      }
    },
    "required": ["phone", "message"]
  },
  "endpoint": "https://api.zien-ai.app/api/twilio/send",
  "method": "POST"
}
```

#### Tool 6: `notify_owner`
```json
{
  "name": "notify_owner",
  "description": "إرسال إشعار للمالك (Nader/Eamon) عبر Twilio. Use for important events or owner commands.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "reason": {
        "type": "string",
        "description": "سبب الإشعار"
      },
      "priority": {
        "type": "string",
        "enum": ["low", "normal", "high", "emergency"],
        "default": "normal"
      }
    },
    "required": ["reason"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/notify-owner",
  "method": "POST"
}
```

#### Tool 7: `execute_owner_command`
```json
{
  "name": "execute_owner_command",
  "description": "تنفيذ أمر من المالك (Nader/Eamon). Executes commands like payment, build, send message, etc.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "command": {
        "type": "string",
        "description": "الأمر المراد تنفيذه"
      },
      "context": {
        "type": "object",
        "description": "سياق الأمر (اختياري)"
      }
    },
    "required": ["command"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/execute-owner-command",
  "method": "POST"
}
```

---

## 🌍 الخطوة 3: إعداد اللغات واللهجات

### 3.1. في Agent Settings:
- **Languages:** فعّل جميع اللغات المطلوبة:
  - Arabic (ar) - جميع اللهجات
  - English (en)
  - French (fr)
  - Spanish (es)
  - German (de)
  - Italian (it)
  - Portuguese (pt)
  - Russian (ru)
  - Chinese (zh)
  - Japanese (ja)
  - Korean (ko)
  - وغيرها...

### 3.2. Dialects (اللهجات):
- **Arabic Dialects:**
  - Egyptian (eg)
  - Saudi (sa)
  - UAE (ae)
  - Jordanian (jo)
  - Lebanese (lb)
  - Moroccan (ma)
  - Tunisian (tn)
  - Algerian (dz)
  - Iraqi (iq)
  - Syrian (sy)
  - Yemeni (ye)
  - Omani (om)
  - Kuwaiti (kw)
  - Qatari (qa)
  - Bahraini (bh)

### 3.3. Voice Model:
- استخدم **Multilingual v2** model
- فعّل **Speaker Boost**
- فعّل **Dialect Detection**

---

## 📝 الخطوة 4: إعداد Agent Context

في Agent Settings → Context، أضف:

```json
{
  "webhook_url": "https://api.zien-ai.app/api/elevenlabs/webhook",
  "api_url": "https://api.zien-ai.app",
  "supported_languages": ["ar", "en", "fr", "es", "de", "it", "pt", "ru", "zh", "ja", "ko"],
  "supported_dialects": {
    "ar": ["eg", "sa", "ae", "jo", "lb", "ma", "tn", "dz", "iq", "sy", "ye", "om", "kw", "qa", "bh"],
    "en": ["us", "uk", "au", "ca", "nz", "ie"],
    "es": ["es", "mx", "ar", "co", "cl", "pe", "ve"]
  },
  "owner_phone_nader": "+971529211077",
  "owner_phone_eamon": null,
  "owner_email": "gm@zien-ai.app",
  "twilio_enabled": true,
  "payment_enabled": true,
  "builder_enabled": true,
  "command_saving_enabled": true,
  "personality_awareness": true,
  "owner_commands_enabled": true
}
```

---

## ✅ الخطوة 5: اختبار Integration

### 5.1. اختبار Webhook:
1. ابدأ محادثة في ElevenLabs Agent
2. تحقق من Backend logs:
   ```
   📥 ElevenLabs Webhook received: conversation.started
   ✅ Conversation started: conv_123
   ```

### 5.2. اختبار Tools:
1. قل للـ Agent: "أعرض لي المكتبات"
   - يجب أن يستدعي `preview_library`
2. قل: "أريد بناء تطبيق"
   - يجب أن يستدعي `submit_to_builder`
3. قل: "أنشئ عملية دفع"
   - يجب أن يستدعي `create_payment`
4. قل: "أرسل رسالة للعميل"
   - يجب أن يستدعي `send_twilio_message`
5. قل: "أخبر المالك"
   - يجب أن يستدعي `notify_owner`

### 5.3. اختبار اللغات:
1. تحدث بالعربية (لهجة مصرية)
2. تحدث بالإنجليزية
3. تحدث بلهجة خليجية
4. تحقق من أن الـ Agent يرد بنفس اللغة/اللهجة

---

## 📊 الخلاصة

بعد إتمام الخطوات:
- ✅ Webhook يعمل مع Backend
- ✅ جميع Tools متاحة للـ Agent
- ✅ دعم جميع اللغات واللهجات
- ✅ عملية دفع تعمل
- ✅ إنشاء وإرسال الطلبات يعمل
- ✅ Twilio يعمل
- ✅ تنفيذ أوامر المالك يعمل

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Webhook Endpoint:** https://api.zien-ai.app/api/elevenlabs/webhook
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل شامل لإعداد Integration في ElevenLabs Agents Platform

---

## 📋 نظرة عامة

هذا الدليل يوضح كيفية إعداد **Integration** في ElevenLabs Agents Platform لربط الـ Agent مع Backend، مما يتيح:
- ✅ **جميع اللغات واللهجات** (العربية بجميع لهجاتها، الإنجليزية، الفرنسية، إلخ)
- ✅ **عملية دفع** (Stripe, Apple Pay)
- ✅ **إنشاء وإرسال الطلبات** (Builder)
- ✅ **Twilio** (SMS, WhatsApp, Voice)
- ✅ **تنفيذ أوامر المالك** (Nader/Eamon)

---

## 🚀 الخطوة 1: إعداد Webhook في ElevenLabs Dashboard

### 1.1. اذهب إلى ElevenLabs Agents Platform:
https://elevenlabs.io/app/convai/agents

### 1.2. اختر Agent:
`agent_0701kc4axybpf6fvak70xwfzpyka`

### 1.3. اذهب إلى Integrations:
- **Configure** → **Integrations**
- اضغط **"Add Integration"** أو **"Connect Integration"**

### 1.4. إعداد Webhook:
- **Integration Type:** `Webhook` أو `Custom API`
- **Name:** `RARE 4N Backend`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Webhook Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`

### 1.5. Events (فعّل جميعها):
- ✅ `conversation.started`
- ✅ `conversation.message`
- ✅ `conversation.ended`
- ✅ `agent.tool_call`
- ✅ `agent.action`

---

## 🔧 الخطوة 2: إعداد Tools في ElevenLabs Agent

### 2.1. اذهب إلى Tools:
- **Configure** → **Tools**
- اضغط **"Add Tool"** أو **"Create Tool"**

### 2.2. Tools المطلوبة:

#### Tool 1: `preview_library`
```json
{
  "name": "preview_library",
  "description": "معاينة المكتبات (Templates, Systems, Themes) للعميل. Supports Arabic and English.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "type": {
        "type": "string",
        "enum": ["templates", "systems", "themes"],
        "description": "نوع المكتبة"
      },
      "category": {
        "type": "string",
        "description": "الفئة (اختياري)"
      },
      "limit": {
        "type": "number",
        "default": 10,
        "description": "عدد العناصر"
      }
    },
    "required": ["type"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/preview-library",
  "method": "POST"
}
```

#### Tool 2: `search_library`
```json
{
  "name": "search_library",
  "description": "البحث في المكتبات. Supports all languages and dialects.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "كلمة البحث"
      },
      "type": {
        "type": "string",
        "enum": ["all", "templates", "systems", "themes"],
        "default": "all"
      }
    },
    "required": ["query"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/search-library",
  "method": "POST"
}
```

#### Tool 3: `submit_to_builder`
```json
{
  "name": "submit_to_builder",
  "description": "إرسال الطلب للبيلدر بعد تسجيله. Creates build request and sends to Auto Builder.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "client_id": {
        "type": "string",
        "description": "معرف العميل"
      },
      "request_data": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": ["template", "system", "theme"]
          },
          "selectedItem": {
            "type": "object",
            "description": "العنصر المختار"
          },
          "clientName": {
            "type": "string",
            "description": "اسم العميل"
          },
          "clientEmail": {
            "type": "string",
            "description": "بريد العميل"
          },
          "clientPhone": {
            "type": "string",
            "description": "هاتف العميل (اختياري)"
          },
          "description": {
            "type": "string",
            "description": "وصف المشروع (اختياري)"
          }
        },
        "required": ["type", "selectedItem", "clientName", "clientEmail"]
      }
    },
    "required": ["client_id", "request_data"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/submit-to-builder",
  "method": "POST"
}
```

#### Tool 4: `create_payment`
```json
{
  "name": "create_payment",
  "description": "إنشاء عملية دفع للعميل. Supports Stripe and Apple Pay.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "requestId": {
        "type": "string",
        "description": "معرف الطلب"
      },
      "amount": {
        "type": "number",
        "description": "المبلغ"
      },
      "currency": {
        "type": "string",
        "default": "AED",
        "description": "العملة"
      },
      "clientId": {
        "type": "string",
        "description": "معرف العميل"
      },
      "clientEmail": {
        "type": "string",
        "description": "بريد العميل"
      }
    },
    "required": ["requestId", "amount", "clientId", "clientEmail"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/create-payment",
  "method": "POST"
}
```

#### Tool 5: `send_twilio_message`
```json
{
  "name": "send_twilio_message",
  "description": "إرسال رسالة عبر Twilio WhatsApp أو SMS. Supports all languages.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "phone": {
        "type": "string",
        "description": "رقم الهاتف (مع رمز الدولة)"
      },
      "message": {
        "type": "string",
        "description": "نص الرسالة"
      },
      "type": {
        "type": "string",
        "enum": ["whatsapp", "sms"],
        "default": "whatsapp"
      }
    },
    "required": ["phone", "message"]
  },
  "endpoint": "https://api.zien-ai.app/api/twilio/send",
  "method": "POST"
}
```

#### Tool 6: `notify_owner`
```json
{
  "name": "notify_owner",
  "description": "إرسال إشعار للمالك (Nader/Eamon) عبر Twilio. Use for important events or owner commands.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "reason": {
        "type": "string",
        "description": "سبب الإشعار"
      },
      "priority": {
        "type": "string",
        "enum": ["low", "normal", "high", "emergency"],
        "default": "normal"
      }
    },
    "required": ["reason"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/notify-owner",
  "method": "POST"
}
```

#### Tool 7: `execute_owner_command`
```json
{
  "name": "execute_owner_command",
  "description": "تنفيذ أمر من المالك (Nader/Eamon). Executes commands like payment, build, send message, etc.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "command": {
        "type": "string",
        "description": "الأمر المراد تنفيذه"
      },
      "context": {
        "type": "object",
        "description": "سياق الأمر (اختياري)"
      }
    },
    "required": ["command"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/execute-owner-command",
  "method": "POST"
}
```

---

## 🌍 الخطوة 3: إعداد اللغات واللهجات

### 3.1. في Agent Settings:
- **Languages:** فعّل جميع اللغات المطلوبة:
  - Arabic (ar) - جميع اللهجات
  - English (en)
  - French (fr)
  - Spanish (es)
  - German (de)
  - Italian (it)
  - Portuguese (pt)
  - Russian (ru)
  - Chinese (zh)
  - Japanese (ja)
  - Korean (ko)
  - وغيرها...

### 3.2. Dialects (اللهجات):
- **Arabic Dialects:**
  - Egyptian (eg)
  - Saudi (sa)
  - UAE (ae)
  - Jordanian (jo)
  - Lebanese (lb)
  - Moroccan (ma)
  - Tunisian (tn)
  - Algerian (dz)
  - Iraqi (iq)
  - Syrian (sy)
  - Yemeni (ye)
  - Omani (om)
  - Kuwaiti (kw)
  - Qatari (qa)
  - Bahraini (bh)

### 3.3. Voice Model:
- استخدم **Multilingual v2** model
- فعّل **Speaker Boost**
- فعّل **Dialect Detection**

---

## 📝 الخطوة 4: إعداد Agent Context

في Agent Settings → Context، أضف:

```json
{
  "webhook_url": "https://api.zien-ai.app/api/elevenlabs/webhook",
  "api_url": "https://api.zien-ai.app",
  "supported_languages": ["ar", "en", "fr", "es", "de", "it", "pt", "ru", "zh", "ja", "ko"],
  "supported_dialects": {
    "ar": ["eg", "sa", "ae", "jo", "lb", "ma", "tn", "dz", "iq", "sy", "ye", "om", "kw", "qa", "bh"],
    "en": ["us", "uk", "au", "ca", "nz", "ie"],
    "es": ["es", "mx", "ar", "co", "cl", "pe", "ve"]
  },
  "owner_phone_nader": "+971529211077",
  "owner_phone_eamon": null,
  "owner_email": "gm@zien-ai.app",
  "twilio_enabled": true,
  "payment_enabled": true,
  "builder_enabled": true,
  "command_saving_enabled": true,
  "personality_awareness": true,
  "owner_commands_enabled": true
}
```

---

## ✅ الخطوة 5: اختبار Integration

### 5.1. اختبار Webhook:
1. ابدأ محادثة في ElevenLabs Agent
2. تحقق من Backend logs:
   ```
   📥 ElevenLabs Webhook received: conversation.started
   ✅ Conversation started: conv_123
   ```

### 5.2. اختبار Tools:
1. قل للـ Agent: "أعرض لي المكتبات"
   - يجب أن يستدعي `preview_library`
2. قل: "أريد بناء تطبيق"
   - يجب أن يستدعي `submit_to_builder`
3. قل: "أنشئ عملية دفع"
   - يجب أن يستدعي `create_payment`
4. قل: "أرسل رسالة للعميل"
   - يجب أن يستدعي `send_twilio_message`
5. قل: "أخبر المالك"
   - يجب أن يستدعي `notify_owner`

### 5.3. اختبار اللغات:
1. تحدث بالعربية (لهجة مصرية)
2. تحدث بالإنجليزية
3. تحدث بلهجة خليجية
4. تحقق من أن الـ Agent يرد بنفس اللغة/اللهجة

---

## 📊 الخلاصة

بعد إتمام الخطوات:
- ✅ Webhook يعمل مع Backend
- ✅ جميع Tools متاحة للـ Agent
- ✅ دعم جميع اللغات واللهجات
- ✅ عملية دفع تعمل
- ✅ إنشاء وإرسال الطلبات يعمل
- ✅ Twilio يعمل
- ✅ تنفيذ أوامر المالك يعمل

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Webhook Endpoint:** https://api.zien-ai.app/api/elevenlabs/webhook
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل شامل لإعداد Integration في ElevenLabs Agents Platform

---

## 📋 نظرة عامة

هذا الدليل يوضح كيفية إعداد **Integration** في ElevenLabs Agents Platform لربط الـ Agent مع Backend، مما يتيح:
- ✅ **جميع اللغات واللهجات** (العربية بجميع لهجاتها، الإنجليزية، الفرنسية، إلخ)
- ✅ **عملية دفع** (Stripe, Apple Pay)
- ✅ **إنشاء وإرسال الطلبات** (Builder)
- ✅ **Twilio** (SMS, WhatsApp, Voice)
- ✅ **تنفيذ أوامر المالك** (Nader/Eamon)

---

## 🚀 الخطوة 1: إعداد Webhook في ElevenLabs Dashboard

### 1.1. اذهب إلى ElevenLabs Agents Platform:
https://elevenlabs.io/app/convai/agents

### 1.2. اختر Agent:
`agent_0701kc4axybpf6fvak70xwfzpyka`

### 1.3. اذهب إلى Integrations:
- **Configure** → **Integrations**
- اضغط **"Add Integration"** أو **"Connect Integration"**

### 1.4. إعداد Webhook:
- **Integration Type:** `Webhook` أو `Custom API`
- **Name:** `RARE 4N Backend`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Webhook Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`

### 1.5. Events (فعّل جميعها):
- ✅ `conversation.started`
- ✅ `conversation.message`
- ✅ `conversation.ended`
- ✅ `agent.tool_call`
- ✅ `agent.action`

---

## 🔧 الخطوة 2: إعداد Tools في ElevenLabs Agent

### 2.1. اذهب إلى Tools:
- **Configure** → **Tools**
- اضغط **"Add Tool"** أو **"Create Tool"**

### 2.2. Tools المطلوبة:

#### Tool 1: `preview_library`
```json
{
  "name": "preview_library",
  "description": "معاينة المكتبات (Templates, Systems, Themes) للعميل. Supports Arabic and English.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "type": {
        "type": "string",
        "enum": ["templates", "systems", "themes"],
        "description": "نوع المكتبة"
      },
      "category": {
        "type": "string",
        "description": "الفئة (اختياري)"
      },
      "limit": {
        "type": "number",
        "default": 10,
        "description": "عدد العناصر"
      }
    },
    "required": ["type"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/preview-library",
  "method": "POST"
}
```

#### Tool 2: `search_library`
```json
{
  "name": "search_library",
  "description": "البحث في المكتبات. Supports all languages and dialects.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "كلمة البحث"
      },
      "type": {
        "type": "string",
        "enum": ["all", "templates", "systems", "themes"],
        "default": "all"
      }
    },
    "required": ["query"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/search-library",
  "method": "POST"
}
```

#### Tool 3: `submit_to_builder`
```json
{
  "name": "submit_to_builder",
  "description": "إرسال الطلب للبيلدر بعد تسجيله. Creates build request and sends to Auto Builder.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "client_id": {
        "type": "string",
        "description": "معرف العميل"
      },
      "request_data": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "enum": ["template", "system", "theme"]
          },
          "selectedItem": {
            "type": "object",
            "description": "العنصر المختار"
          },
          "clientName": {
            "type": "string",
            "description": "اسم العميل"
          },
          "clientEmail": {
            "type": "string",
            "description": "بريد العميل"
          },
          "clientPhone": {
            "type": "string",
            "description": "هاتف العميل (اختياري)"
          },
          "description": {
            "type": "string",
            "description": "وصف المشروع (اختياري)"
          }
        },
        "required": ["type", "selectedItem", "clientName", "clientEmail"]
      }
    },
    "required": ["client_id", "request_data"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/submit-to-builder",
  "method": "POST"
}
```

#### Tool 4: `create_payment`
```json
{
  "name": "create_payment",
  "description": "إنشاء عملية دفع للعميل. Supports Stripe and Apple Pay.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "requestId": {
        "type": "string",
        "description": "معرف الطلب"
      },
      "amount": {
        "type": "number",
        "description": "المبلغ"
      },
      "currency": {
        "type": "string",
        "default": "AED",
        "description": "العملة"
      },
      "clientId": {
        "type": "string",
        "description": "معرف العميل"
      },
      "clientEmail": {
        "type": "string",
        "description": "بريد العميل"
      }
    },
    "required": ["requestId", "amount", "clientId", "clientEmail"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/create-payment",
  "method": "POST"
}
```

#### Tool 5: `send_twilio_message`
```json
{
  "name": "send_twilio_message",
  "description": "إرسال رسالة عبر Twilio WhatsApp أو SMS. Supports all languages.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "phone": {
        "type": "string",
        "description": "رقم الهاتف (مع رمز الدولة)"
      },
      "message": {
        "type": "string",
        "description": "نص الرسالة"
      },
      "type": {
        "type": "string",
        "enum": ["whatsapp", "sms"],
        "default": "whatsapp"
      }
    },
    "required": ["phone", "message"]
  },
  "endpoint": "https://api.zien-ai.app/api/twilio/send",
  "method": "POST"
}
```

#### Tool 6: `notify_owner`
```json
{
  "name": "notify_owner",
  "description": "إرسال إشعار للمالك (Nader/Eamon) عبر Twilio. Use for important events or owner commands.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "reason": {
        "type": "string",
        "description": "سبب الإشعار"
      },
      "priority": {
        "type": "string",
        "enum": ["low", "normal", "high", "emergency"],
        "default": "normal"
      }
    },
    "required": ["reason"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/notify-owner",
  "method": "POST"
}
```

#### Tool 7: `execute_owner_command`
```json
{
  "name": "execute_owner_command",
  "description": "تنفيذ أمر من المالك (Nader/Eamon). Executes commands like payment, build, send message, etc.",
  "type": "function",
  "parameters": {
    "type": "object",
    "properties": {
      "command": {
        "type": "string",
        "description": "الأمر المراد تنفيذه"
      },
      "context": {
        "type": "object",
        "description": "سياق الأمر (اختياري)"
      }
    },
    "required": ["command"]
  },
  "endpoint": "https://api.zien-ai.app/api/agent-tools/execute-owner-command",
  "method": "POST"
}
```

---

## 🌍 الخطوة 3: إعداد اللغات واللهجات

### 3.1. في Agent Settings:
- **Languages:** فعّل جميع اللغات المطلوبة:
  - Arabic (ar) - جميع اللهجات
  - English (en)
  - French (fr)
  - Spanish (es)
  - German (de)
  - Italian (it)
  - Portuguese (pt)
  - Russian (ru)
  - Chinese (zh)
  - Japanese (ja)
  - Korean (ko)
  - وغيرها...

### 3.2. Dialects (اللهجات):
- **Arabic Dialects:**
  - Egyptian (eg)
  - Saudi (sa)
  - UAE (ae)
  - Jordanian (jo)
  - Lebanese (lb)
  - Moroccan (ma)
  - Tunisian (tn)
  - Algerian (dz)
  - Iraqi (iq)
  - Syrian (sy)
  - Yemeni (ye)
  - Omani (om)
  - Kuwaiti (kw)
  - Qatari (qa)
  - Bahraini (bh)

### 3.3. Voice Model:
- استخدم **Multilingual v2** model
- فعّل **Speaker Boost**
- فعّل **Dialect Detection**

---

## 📝 الخطوة 4: إعداد Agent Context

في Agent Settings → Context، أضف:

```json
{
  "webhook_url": "https://api.zien-ai.app/api/elevenlabs/webhook",
  "api_url": "https://api.zien-ai.app",
  "supported_languages": ["ar", "en", "fr", "es", "de", "it", "pt", "ru", "zh", "ja", "ko"],
  "supported_dialects": {
    "ar": ["eg", "sa", "ae", "jo", "lb", "ma", "tn", "dz", "iq", "sy", "ye", "om", "kw", "qa", "bh"],
    "en": ["us", "uk", "au", "ca", "nz", "ie"],
    "es": ["es", "mx", "ar", "co", "cl", "pe", "ve"]
  },
  "owner_phone_nader": "+971529211077",
  "owner_phone_eamon": null,
  "owner_email": "gm@zien-ai.app",
  "twilio_enabled": true,
  "payment_enabled": true,
  "builder_enabled": true,
  "command_saving_enabled": true,
  "personality_awareness": true,
  "owner_commands_enabled": true
}
```

---

## ✅ الخطوة 5: اختبار Integration

### 5.1. اختبار Webhook:
1. ابدأ محادثة في ElevenLabs Agent
2. تحقق من Backend logs:
   ```
   📥 ElevenLabs Webhook received: conversation.started
   ✅ Conversation started: conv_123
   ```

### 5.2. اختبار Tools:
1. قل للـ Agent: "أعرض لي المكتبات"
   - يجب أن يستدعي `preview_library`
2. قل: "أريد بناء تطبيق"
   - يجب أن يستدعي `submit_to_builder`
3. قل: "أنشئ عملية دفع"
   - يجب أن يستدعي `create_payment`
4. قل: "أرسل رسالة للعميل"
   - يجب أن يستدعي `send_twilio_message`
5. قل: "أخبر المالك"
   - يجب أن يستدعي `notify_owner`

### 5.3. اختبار اللغات:
1. تحدث بالعربية (لهجة مصرية)
2. تحدث بالإنجليزية
3. تحدث بلهجة خليجية
4. تحقق من أن الـ Agent يرد بنفس اللغة/اللهجة

---

## 📊 الخلاصة

بعد إتمام الخطوات:
- ✅ Webhook يعمل مع Backend
- ✅ جميع Tools متاحة للـ Agent
- ✅ دعم جميع اللغات واللهجات
- ✅ عملية دفع تعمل
- ✅ إنشاء وإرسال الطلبات يعمل
- ✅ Twilio يعمل
- ✅ تنفيذ أوامر المالك يعمل

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Webhook Endpoint:** https://api.zien-ai.app/api/elevenlabs/webhook
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

