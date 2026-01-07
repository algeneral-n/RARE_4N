# خطوات الإعداد في ElevenLabs Dashboard - RARE 4N
## ما تحتاج أن تفعله في ElevenLabs Dashboard

---

## ✅ ما تم إنجازه في Backend (جاهز):

1. ✅ **Webhook Handler** - جاهز في `apps/backend/src/routes/elevenlabs-webhook.js`
2. ✅ **Agent Service** - جاهز في `apps/backend/src/services/elevenLabsAgentService.js`
3. ✅ **Libraries** - جاهزة في `apps/backend/src/libraries/`
4. ✅ **Voice ID للمالك** - `6ZVgc4q9LWAloWbuwjuu` مضاف في الكود
5. ✅ **Tools Handlers** - جميع Tools جاهزة في Backend

---

## 🔧 ما تحتاج أن تفعله في ElevenLabs Dashboard:

### الخطوة 1: إعداد Webhook

1. اذهب إلى: https://elevenlabs.io/app/convai/agents
2. اختر Agent: `agent_0701kc4axybpf6fvak70xwfzpyka`
3. اذهب إلى **Settings** → **Webhooks** (أو **Integrations**)
4. اضغط **"Add Webhook"** أو **"Configure Webhook"**
5. أدخل:
   - **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
   - **Webhook Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`
   - **Events:** فعّل جميع الأحداث:
     - ✅ `conversation.started`
     - ✅ `conversation.message`
     - ✅ `conversation.ended`
     - ✅ `agent.tool_call`
     - ✅ `agent.action`

---

### الخطوة 2: إعداد Tools

1. اذهب إلى **Configure** → **Tools**
2. اضغط **"Add Tool"** أو **"Create Tool"**
3. أضف كل Tool من القائمة التالية:

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

### الخطوة 3: إعداد Voice ID للمالك

1. اذهب إلى **Configure** → **Voices**
2. تأكد من أن Voice ID `6ZVgc4q9LWAloWbuwjuu` موجود
3. إذا لم يكن موجوداً، أضفه كـ **Custom Voice** أو **Cloned Voice**

---

### الخطوة 4: إعداد اللغات واللهجات

1. اذهب إلى **Configure** → **Languages**
2. فعّل جميع اللغات المطلوبة:
   - ✅ Arabic (ar) - جميع اللهجات
   - ✅ English (en)
   - ✅ French (fr)
   - ✅ Spanish (es)
   - ✅ German (de)
   - ✅ Italian (it)
   - ✅ Portuguese (pt)
   - ✅ Russian (ru)
   - ✅ Chinese (zh)
   - ✅ Japanese (ja)
   - ✅ Korean (ko)

3. فعّل **Dialect Detection** للعربية

---

### الخطوة 5: إعداد Knowledge Base (اختياري)

1. اذهب إلى **Configure** → **Knowledge Base**
2. أضف معلومات عن:
   - Libraries Structure (Templates, Systems, Themes)
   - API Endpoints
   - Owner Information (Nader)

أو يمكنك استخدام Context في Agent Settings (انظر الخطوة 6)

---

### الخطوة 6: إعداد Agent Context

1. اذهب إلى **Configure** → **Agent Settings** → **Context**
2. أضف:

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
  "owner_voice_id": "6ZVgc4q9LWAloWbuwjuu",
  "owner_name": "Nader",
  "owner_phone": "+971529211077",
  "owner_email": "gm@zien-ai.app",
  "twilio_enabled": true,
  "payment_enabled": true,
  "builder_enabled": true,
  "command_saving_enabled": true,
  "personality_awareness": true,
  "owner_commands_enabled": true,
  "libraries_api": "https://api.zien-ai.app/api/libraries",
  "templates_api": "https://api.zien-ai.app/api/libraries/templates",
  "systems_api": "https://api.zien-ai.app/api/libraries/systems",
  "themes_api": "https://api.zien-ai.app/api/libraries/themes"
}
```

---

### الخطوة 7: اختبار

1. ابدأ محادثة مع Agent
2. استخدم Voice ID: `6ZVgc4q9LWAloWbuwjuu`
3. جرب الأوامر:
   - "أعرض لي القوالب المتاحة"
   - "ابحث عن تطبيق تجارة إلكترونية"
   - "أنشئ طلب بناء"
4. تحقق من Backend logs:
   ```
   📥 ElevenLabs Webhook received: conversation.started
   👤 Owner (Nader) detected - Voice ID: 6ZVgc4q9LWAloWbuwjuu
   ```

---

## 📋 ملخص الخطوات:

- [ ] إعداد Webhook URL و Secret
- [ ] إضافة 7 Tools
- [ ] التحقق من Voice ID للمالك
- [ ] تفعيل اللغات واللهجات
- [ ] إضافة Agent Context
- [ ] اختبار المحادثة

---

## ⚠️ ملاحظات مهمة:

1. **Webhook URL** يجب أن يكون متاحاً من الإنترنت (لا localhost)
2. **Webhook Secret** يجب أن يطابق الموجود في `.env`
3. **Tools Endpoints** يجب أن تكون متاحة من الإنترنت
4. **Voice ID** يجب أن يكون موجوداً في ElevenLabs

---

## 🔗 الروابط:

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ⚠️ يحتاج إعداد في Dashboard

## ما تحتاج أن تفعله في ElevenLabs Dashboard

---

## ✅ ما تم إنجازه في Backend (جاهز):

1. ✅ **Webhook Handler** - جاهز في `apps/backend/src/routes/elevenlabs-webhook.js`
2. ✅ **Agent Service** - جاهز في `apps/backend/src/services/elevenLabsAgentService.js`
3. ✅ **Libraries** - جاهزة في `apps/backend/src/libraries/`
4. ✅ **Voice ID للمالك** - `6ZVgc4q9LWAloWbuwjuu` مضاف في الكود
5. ✅ **Tools Handlers** - جميع Tools جاهزة في Backend

---

## 🔧 ما تحتاج أن تفعله في ElevenLabs Dashboard:

### الخطوة 1: إعداد Webhook

1. اذهب إلى: https://elevenlabs.io/app/convai/agents
2. اختر Agent: `agent_0701kc4axybpf6fvak70xwfzpyka`
3. اذهب إلى **Settings** → **Webhooks** (أو **Integrations**)
4. اضغط **"Add Webhook"** أو **"Configure Webhook"**
5. أدخل:
   - **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
   - **Webhook Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`
   - **Events:** فعّل جميع الأحداث:
     - ✅ `conversation.started`
     - ✅ `conversation.message`
     - ✅ `conversation.ended`
     - ✅ `agent.tool_call`
     - ✅ `agent.action`

---

### الخطوة 2: إعداد Tools

1. اذهب إلى **Configure** → **Tools**
2. اضغط **"Add Tool"** أو **"Create Tool"**
3. أضف كل Tool من القائمة التالية:

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

### الخطوة 3: إعداد Voice ID للمالك

1. اذهب إلى **Configure** → **Voices**
2. تأكد من أن Voice ID `6ZVgc4q9LWAloWbuwjuu` موجود
3. إذا لم يكن موجوداً، أضفه كـ **Custom Voice** أو **Cloned Voice**

---

### الخطوة 4: إعداد اللغات واللهجات

1. اذهب إلى **Configure** → **Languages**
2. فعّل جميع اللغات المطلوبة:
   - ✅ Arabic (ar) - جميع اللهجات
   - ✅ English (en)
   - ✅ French (fr)
   - ✅ Spanish (es)
   - ✅ German (de)
   - ✅ Italian (it)
   - ✅ Portuguese (pt)
   - ✅ Russian (ru)
   - ✅ Chinese (zh)
   - ✅ Japanese (ja)
   - ✅ Korean (ko)

3. فعّل **Dialect Detection** للعربية

---

### الخطوة 5: إعداد Knowledge Base (اختياري)

1. اذهب إلى **Configure** → **Knowledge Base**
2. أضف معلومات عن:
   - Libraries Structure (Templates, Systems, Themes)
   - API Endpoints
   - Owner Information (Nader)

أو يمكنك استخدام Context في Agent Settings (انظر الخطوة 6)

---

### الخطوة 6: إعداد Agent Context

1. اذهب إلى **Configure** → **Agent Settings** → **Context**
2. أضف:

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
  "owner_voice_id": "6ZVgc4q9LWAloWbuwjuu",
  "owner_name": "Nader",
  "owner_phone": "+971529211077",
  "owner_email": "gm@zien-ai.app",
  "twilio_enabled": true,
  "payment_enabled": true,
  "builder_enabled": true,
  "command_saving_enabled": true,
  "personality_awareness": true,
  "owner_commands_enabled": true,
  "libraries_api": "https://api.zien-ai.app/api/libraries",
  "templates_api": "https://api.zien-ai.app/api/libraries/templates",
  "systems_api": "https://api.zien-ai.app/api/libraries/systems",
  "themes_api": "https://api.zien-ai.app/api/libraries/themes"
}
```

---

### الخطوة 7: اختبار

1. ابدأ محادثة مع Agent
2. استخدم Voice ID: `6ZVgc4q9LWAloWbuwjuu`
3. جرب الأوامر:
   - "أعرض لي القوالب المتاحة"
   - "ابحث عن تطبيق تجارة إلكترونية"
   - "أنشئ طلب بناء"
4. تحقق من Backend logs:
   ```
   📥 ElevenLabs Webhook received: conversation.started
   👤 Owner (Nader) detected - Voice ID: 6ZVgc4q9LWAloWbuwjuu
   ```

---

## 📋 ملخص الخطوات:

- [ ] إعداد Webhook URL و Secret
- [ ] إضافة 7 Tools
- [ ] التحقق من Voice ID للمالك
- [ ] تفعيل اللغات واللهجات
- [ ] إضافة Agent Context
- [ ] اختبار المحادثة

---

## ⚠️ ملاحظات مهمة:

1. **Webhook URL** يجب أن يكون متاحاً من الإنترنت (لا localhost)
2. **Webhook Secret** يجب أن يطابق الموجود في `.env`
3. **Tools Endpoints** يجب أن تكون متاحة من الإنترنت
4. **Voice ID** يجب أن يكون موجوداً في ElevenLabs

---

## 🔗 الروابط:

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ⚠️ يحتاج إعداد في Dashboard

## ما تحتاج أن تفعله في ElevenLabs Dashboard

---

## ✅ ما تم إنجازه في Backend (جاهز):

1. ✅ **Webhook Handler** - جاهز في `apps/backend/src/routes/elevenlabs-webhook.js`
2. ✅ **Agent Service** - جاهز في `apps/backend/src/services/elevenLabsAgentService.js`
3. ✅ **Libraries** - جاهزة في `apps/backend/src/libraries/`
4. ✅ **Voice ID للمالك** - `6ZVgc4q9LWAloWbuwjuu` مضاف في الكود
5. ✅ **Tools Handlers** - جميع Tools جاهزة في Backend

---

## 🔧 ما تحتاج أن تفعله في ElevenLabs Dashboard:

### الخطوة 1: إعداد Webhook

1. اذهب إلى: https://elevenlabs.io/app/convai/agents
2. اختر Agent: `agent_0701kc4axybpf6fvak70xwfzpyka`
3. اذهب إلى **Settings** → **Webhooks** (أو **Integrations**)
4. اضغط **"Add Webhook"** أو **"Configure Webhook"**
5. أدخل:
   - **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
   - **Webhook Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`
   - **Events:** فعّل جميع الأحداث:
     - ✅ `conversation.started`
     - ✅ `conversation.message`
     - ✅ `conversation.ended`
     - ✅ `agent.tool_call`
     - ✅ `agent.action`

---

### الخطوة 2: إعداد Tools

1. اذهب إلى **Configure** → **Tools**
2. اضغط **"Add Tool"** أو **"Create Tool"**
3. أضف كل Tool من القائمة التالية:

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

### الخطوة 3: إعداد Voice ID للمالك

1. اذهب إلى **Configure** → **Voices**
2. تأكد من أن Voice ID `6ZVgc4q9LWAloWbuwjuu` موجود
3. إذا لم يكن موجوداً، أضفه كـ **Custom Voice** أو **Cloned Voice**

---

### الخطوة 4: إعداد اللغات واللهجات

1. اذهب إلى **Configure** → **Languages**
2. فعّل جميع اللغات المطلوبة:
   - ✅ Arabic (ar) - جميع اللهجات
   - ✅ English (en)
   - ✅ French (fr)
   - ✅ Spanish (es)
   - ✅ German (de)
   - ✅ Italian (it)
   - ✅ Portuguese (pt)
   - ✅ Russian (ru)
   - ✅ Chinese (zh)
   - ✅ Japanese (ja)
   - ✅ Korean (ko)

3. فعّل **Dialect Detection** للعربية

---

### الخطوة 5: إعداد Knowledge Base (اختياري)

1. اذهب إلى **Configure** → **Knowledge Base**
2. أضف معلومات عن:
   - Libraries Structure (Templates, Systems, Themes)
   - API Endpoints
   - Owner Information (Nader)

أو يمكنك استخدام Context في Agent Settings (انظر الخطوة 6)

---

### الخطوة 6: إعداد Agent Context

1. اذهب إلى **Configure** → **Agent Settings** → **Context**
2. أضف:

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
  "owner_voice_id": "6ZVgc4q9LWAloWbuwjuu",
  "owner_name": "Nader",
  "owner_phone": "+971529211077",
  "owner_email": "gm@zien-ai.app",
  "twilio_enabled": true,
  "payment_enabled": true,
  "builder_enabled": true,
  "command_saving_enabled": true,
  "personality_awareness": true,
  "owner_commands_enabled": true,
  "libraries_api": "https://api.zien-ai.app/api/libraries",
  "templates_api": "https://api.zien-ai.app/api/libraries/templates",
  "systems_api": "https://api.zien-ai.app/api/libraries/systems",
  "themes_api": "https://api.zien-ai.app/api/libraries/themes"
}
```

---

### الخطوة 7: اختبار

1. ابدأ محادثة مع Agent
2. استخدم Voice ID: `6ZVgc4q9LWAloWbuwjuu`
3. جرب الأوامر:
   - "أعرض لي القوالب المتاحة"
   - "ابحث عن تطبيق تجارة إلكترونية"
   - "أنشئ طلب بناء"
4. تحقق من Backend logs:
   ```
   📥 ElevenLabs Webhook received: conversation.started
   👤 Owner (Nader) detected - Voice ID: 6ZVgc4q9LWAloWbuwjuu
   ```

---

## 📋 ملخص الخطوات:

- [ ] إعداد Webhook URL و Secret
- [ ] إضافة 7 Tools
- [ ] التحقق من Voice ID للمالك
- [ ] تفعيل اللغات واللهجات
- [ ] إضافة Agent Context
- [ ] اختبار المحادثة

---

## ⚠️ ملاحظات مهمة:

1. **Webhook URL** يجب أن يكون متاحاً من الإنترنت (لا localhost)
2. **Webhook Secret** يجب أن يطابق الموجود في `.env`
3. **Tools Endpoints** يجب أن تكون متاحة من الإنترنت
4. **Voice ID** يجب أن يكون موجوداً في ElevenLabs

---

## 🔗 الروابط:

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ⚠️ يحتاج إعداد في Dashboard

## ما تحتاج أن تفعله في ElevenLabs Dashboard

---

## ✅ ما تم إنجازه في Backend (جاهز):

1. ✅ **Webhook Handler** - جاهز في `apps/backend/src/routes/elevenlabs-webhook.js`
2. ✅ **Agent Service** - جاهز في `apps/backend/src/services/elevenLabsAgentService.js`
3. ✅ **Libraries** - جاهزة في `apps/backend/src/libraries/`
4. ✅ **Voice ID للمالك** - `6ZVgc4q9LWAloWbuwjuu` مضاف في الكود
5. ✅ **Tools Handlers** - جميع Tools جاهزة في Backend

---

## 🔧 ما تحتاج أن تفعله في ElevenLabs Dashboard:

### الخطوة 1: إعداد Webhook

1. اذهب إلى: https://elevenlabs.io/app/convai/agents
2. اختر Agent: `agent_0701kc4axybpf6fvak70xwfzpyka`
3. اذهب إلى **Settings** → **Webhooks** (أو **Integrations**)
4. اضغط **"Add Webhook"** أو **"Configure Webhook"**
5. أدخل:
   - **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
   - **Webhook Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`
   - **Events:** فعّل جميع الأحداث:
     - ✅ `conversation.started`
     - ✅ `conversation.message`
     - ✅ `conversation.ended`
     - ✅ `agent.tool_call`
     - ✅ `agent.action`

---

### الخطوة 2: إعداد Tools

1. اذهب إلى **Configure** → **Tools**
2. اضغط **"Add Tool"** أو **"Create Tool"**
3. أضف كل Tool من القائمة التالية:

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

### الخطوة 3: إعداد Voice ID للمالك

1. اذهب إلى **Configure** → **Voices**
2. تأكد من أن Voice ID `6ZVgc4q9LWAloWbuwjuu` موجود
3. إذا لم يكن موجوداً، أضفه كـ **Custom Voice** أو **Cloned Voice**

---

### الخطوة 4: إعداد اللغات واللهجات

1. اذهب إلى **Configure** → **Languages**
2. فعّل جميع اللغات المطلوبة:
   - ✅ Arabic (ar) - جميع اللهجات
   - ✅ English (en)
   - ✅ French (fr)
   - ✅ Spanish (es)
   - ✅ German (de)
   - ✅ Italian (it)
   - ✅ Portuguese (pt)
   - ✅ Russian (ru)
   - ✅ Chinese (zh)
   - ✅ Japanese (ja)
   - ✅ Korean (ko)

3. فعّل **Dialect Detection** للعربية

---

### الخطوة 5: إعداد Knowledge Base (اختياري)

1. اذهب إلى **Configure** → **Knowledge Base**
2. أضف معلومات عن:
   - Libraries Structure (Templates, Systems, Themes)
   - API Endpoints
   - Owner Information (Nader)

أو يمكنك استخدام Context في Agent Settings (انظر الخطوة 6)

---

### الخطوة 6: إعداد Agent Context

1. اذهب إلى **Configure** → **Agent Settings** → **Context**
2. أضف:

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
  "owner_voice_id": "6ZVgc4q9LWAloWbuwjuu",
  "owner_name": "Nader",
  "owner_phone": "+971529211077",
  "owner_email": "gm@zien-ai.app",
  "twilio_enabled": true,
  "payment_enabled": true,
  "builder_enabled": true,
  "command_saving_enabled": true,
  "personality_awareness": true,
  "owner_commands_enabled": true,
  "libraries_api": "https://api.zien-ai.app/api/libraries",
  "templates_api": "https://api.zien-ai.app/api/libraries/templates",
  "systems_api": "https://api.zien-ai.app/api/libraries/systems",
  "themes_api": "https://api.zien-ai.app/api/libraries/themes"
}
```

---

### الخطوة 7: اختبار

1. ابدأ محادثة مع Agent
2. استخدم Voice ID: `6ZVgc4q9LWAloWbuwjuu`
3. جرب الأوامر:
   - "أعرض لي القوالب المتاحة"
   - "ابحث عن تطبيق تجارة إلكترونية"
   - "أنشئ طلب بناء"
4. تحقق من Backend logs:
   ```
   📥 ElevenLabs Webhook received: conversation.started
   👤 Owner (Nader) detected - Voice ID: 6ZVgc4q9LWAloWbuwjuu
   ```

---

## 📋 ملخص الخطوات:

- [ ] إعداد Webhook URL و Secret
- [ ] إضافة 7 Tools
- [ ] التحقق من Voice ID للمالك
- [ ] تفعيل اللغات واللهجات
- [ ] إضافة Agent Context
- [ ] اختبار المحادثة

---

## ⚠️ ملاحظات مهمة:

1. **Webhook URL** يجب أن يكون متاحاً من الإنترنت (لا localhost)
2. **Webhook Secret** يجب أن يطابق الموجود في `.env`
3. **Tools Endpoints** يجب أن تكون متاحة من الإنترنت
4. **Voice ID** يجب أن يكون موجوداً في ElevenLabs

---

## 🔗 الروابط:

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ⚠️ يحتاج إعداد في Dashboard

## ما تحتاج أن تفعله في ElevenLabs Dashboard

---

## ✅ ما تم إنجازه في Backend (جاهز):

1. ✅ **Webhook Handler** - جاهز في `apps/backend/src/routes/elevenlabs-webhook.js`
2. ✅ **Agent Service** - جاهز في `apps/backend/src/services/elevenLabsAgentService.js`
3. ✅ **Libraries** - جاهزة في `apps/backend/src/libraries/`
4. ✅ **Voice ID للمالك** - `6ZVgc4q9LWAloWbuwjuu` مضاف في الكود
5. ✅ **Tools Handlers** - جميع Tools جاهزة في Backend

---

## 🔧 ما تحتاج أن تفعله في ElevenLabs Dashboard:

### الخطوة 1: إعداد Webhook

1. اذهب إلى: https://elevenlabs.io/app/convai/agents
2. اختر Agent: `agent_0701kc4axybpf6fvak70xwfzpyka`
3. اذهب إلى **Settings** → **Webhooks** (أو **Integrations**)
4. اضغط **"Add Webhook"** أو **"Configure Webhook"**
5. أدخل:
   - **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
   - **Webhook Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`
   - **Events:** فعّل جميع الأحداث:
     - ✅ `conversation.started`
     - ✅ `conversation.message`
     - ✅ `conversation.ended`
     - ✅ `agent.tool_call`
     - ✅ `agent.action`

---

### الخطوة 2: إعداد Tools

1. اذهب إلى **Configure** → **Tools**
2. اضغط **"Add Tool"** أو **"Create Tool"**
3. أضف كل Tool من القائمة التالية:

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

### الخطوة 3: إعداد Voice ID للمالك

1. اذهب إلى **Configure** → **Voices**
2. تأكد من أن Voice ID `6ZVgc4q9LWAloWbuwjuu` موجود
3. إذا لم يكن موجوداً، أضفه كـ **Custom Voice** أو **Cloned Voice**

---

### الخطوة 4: إعداد اللغات واللهجات

1. اذهب إلى **Configure** → **Languages**
2. فعّل جميع اللغات المطلوبة:
   - ✅ Arabic (ar) - جميع اللهجات
   - ✅ English (en)
   - ✅ French (fr)
   - ✅ Spanish (es)
   - ✅ German (de)
   - ✅ Italian (it)
   - ✅ Portuguese (pt)
   - ✅ Russian (ru)
   - ✅ Chinese (zh)
   - ✅ Japanese (ja)
   - ✅ Korean (ko)

3. فعّل **Dialect Detection** للعربية

---

### الخطوة 5: إعداد Knowledge Base (اختياري)

1. اذهب إلى **Configure** → **Knowledge Base**
2. أضف معلومات عن:
   - Libraries Structure (Templates, Systems, Themes)
   - API Endpoints
   - Owner Information (Nader)

أو يمكنك استخدام Context في Agent Settings (انظر الخطوة 6)

---

### الخطوة 6: إعداد Agent Context

1. اذهب إلى **Configure** → **Agent Settings** → **Context**
2. أضف:

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
  "owner_voice_id": "6ZVgc4q9LWAloWbuwjuu",
  "owner_name": "Nader",
  "owner_phone": "+971529211077",
  "owner_email": "gm@zien-ai.app",
  "twilio_enabled": true,
  "payment_enabled": true,
  "builder_enabled": true,
  "command_saving_enabled": true,
  "personality_awareness": true,
  "owner_commands_enabled": true,
  "libraries_api": "https://api.zien-ai.app/api/libraries",
  "templates_api": "https://api.zien-ai.app/api/libraries/templates",
  "systems_api": "https://api.zien-ai.app/api/libraries/systems",
  "themes_api": "https://api.zien-ai.app/api/libraries/themes"
}
```

---

### الخطوة 7: اختبار

1. ابدأ محادثة مع Agent
2. استخدم Voice ID: `6ZVgc4q9LWAloWbuwjuu`
3. جرب الأوامر:
   - "أعرض لي القوالب المتاحة"
   - "ابحث عن تطبيق تجارة إلكترونية"
   - "أنشئ طلب بناء"
4. تحقق من Backend logs:
   ```
   📥 ElevenLabs Webhook received: conversation.started
   👤 Owner (Nader) detected - Voice ID: 6ZVgc4q9LWAloWbuwjuu
   ```

---

## 📋 ملخص الخطوات:

- [ ] إعداد Webhook URL و Secret
- [ ] إضافة 7 Tools
- [ ] التحقق من Voice ID للمالك
- [ ] تفعيل اللغات واللهجات
- [ ] إضافة Agent Context
- [ ] اختبار المحادثة

---

## ⚠️ ملاحظات مهمة:

1. **Webhook URL** يجب أن يكون متاحاً من الإنترنت (لا localhost)
2. **Webhook Secret** يجب أن يطابق الموجود في `.env`
3. **Tools Endpoints** يجب أن تكون متاحة من الإنترنت
4. **Voice ID** يجب أن يكون موجوداً في ElevenLabs

---

## 🔗 الروابط:

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ⚠️ يحتاج إعداد في Dashboard

## ما تحتاج أن تفعله في ElevenLabs Dashboard

---

## ✅ ما تم إنجازه في Backend (جاهز):

1. ✅ **Webhook Handler** - جاهز في `apps/backend/src/routes/elevenlabs-webhook.js`
2. ✅ **Agent Service** - جاهز في `apps/backend/src/services/elevenLabsAgentService.js`
3. ✅ **Libraries** - جاهزة في `apps/backend/src/libraries/`
4. ✅ **Voice ID للمالك** - `6ZVgc4q9LWAloWbuwjuu` مضاف في الكود
5. ✅ **Tools Handlers** - جميع Tools جاهزة في Backend

---

## 🔧 ما تحتاج أن تفعله في ElevenLabs Dashboard:

### الخطوة 1: إعداد Webhook

1. اذهب إلى: https://elevenlabs.io/app/convai/agents
2. اختر Agent: `agent_0701kc4axybpf6fvak70xwfzpyka`
3. اذهب إلى **Settings** → **Webhooks** (أو **Integrations**)
4. اضغط **"Add Webhook"** أو **"Configure Webhook"**
5. أدخل:
   - **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
   - **Webhook Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`
   - **Events:** فعّل جميع الأحداث:
     - ✅ `conversation.started`
     - ✅ `conversation.message`
     - ✅ `conversation.ended`
     - ✅ `agent.tool_call`
     - ✅ `agent.action`

---

### الخطوة 2: إعداد Tools

1. اذهب إلى **Configure** → **Tools**
2. اضغط **"Add Tool"** أو **"Create Tool"**
3. أضف كل Tool من القائمة التالية:

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

### الخطوة 3: إعداد Voice ID للمالك

1. اذهب إلى **Configure** → **Voices**
2. تأكد من أن Voice ID `6ZVgc4q9LWAloWbuwjuu` موجود
3. إذا لم يكن موجوداً، أضفه كـ **Custom Voice** أو **Cloned Voice**

---

### الخطوة 4: إعداد اللغات واللهجات

1. اذهب إلى **Configure** → **Languages**
2. فعّل جميع اللغات المطلوبة:
   - ✅ Arabic (ar) - جميع اللهجات
   - ✅ English (en)
   - ✅ French (fr)
   - ✅ Spanish (es)
   - ✅ German (de)
   - ✅ Italian (it)
   - ✅ Portuguese (pt)
   - ✅ Russian (ru)
   - ✅ Chinese (zh)
   - ✅ Japanese (ja)
   - ✅ Korean (ko)

3. فعّل **Dialect Detection** للعربية

---

### الخطوة 5: إعداد Knowledge Base (اختياري)

1. اذهب إلى **Configure** → **Knowledge Base**
2. أضف معلومات عن:
   - Libraries Structure (Templates, Systems, Themes)
   - API Endpoints
   - Owner Information (Nader)

أو يمكنك استخدام Context في Agent Settings (انظر الخطوة 6)

---

### الخطوة 6: إعداد Agent Context

1. اذهب إلى **Configure** → **Agent Settings** → **Context**
2. أضف:

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
  "owner_voice_id": "6ZVgc4q9LWAloWbuwjuu",
  "owner_name": "Nader",
  "owner_phone": "+971529211077",
  "owner_email": "gm@zien-ai.app",
  "twilio_enabled": true,
  "payment_enabled": true,
  "builder_enabled": true,
  "command_saving_enabled": true,
  "personality_awareness": true,
  "owner_commands_enabled": true,
  "libraries_api": "https://api.zien-ai.app/api/libraries",
  "templates_api": "https://api.zien-ai.app/api/libraries/templates",
  "systems_api": "https://api.zien-ai.app/api/libraries/systems",
  "themes_api": "https://api.zien-ai.app/api/libraries/themes"
}
```

---

### الخطوة 7: اختبار

1. ابدأ محادثة مع Agent
2. استخدم Voice ID: `6ZVgc4q9LWAloWbuwjuu`
3. جرب الأوامر:
   - "أعرض لي القوالب المتاحة"
   - "ابحث عن تطبيق تجارة إلكترونية"
   - "أنشئ طلب بناء"
4. تحقق من Backend logs:
   ```
   📥 ElevenLabs Webhook received: conversation.started
   👤 Owner (Nader) detected - Voice ID: 6ZVgc4q9LWAloWbuwjuu
   ```

---

## 📋 ملخص الخطوات:

- [ ] إعداد Webhook URL و Secret
- [ ] إضافة 7 Tools
- [ ] التحقق من Voice ID للمالك
- [ ] تفعيل اللغات واللهجات
- [ ] إضافة Agent Context
- [ ] اختبار المحادثة

---

## ⚠️ ملاحظات مهمة:

1. **Webhook URL** يجب أن يكون متاحاً من الإنترنت (لا localhost)
2. **Webhook Secret** يجب أن يطابق الموجود في `.env`
3. **Tools Endpoints** يجب أن تكون متاحة من الإنترنت
4. **Voice ID** يجب أن يكون موجوداً في ElevenLabs

---

## 🔗 الروابط:

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ⚠️ يحتاج إعداد في Dashboard

