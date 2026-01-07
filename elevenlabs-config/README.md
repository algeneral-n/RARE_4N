# ElevenLabs Configuration Files - RARE 4N
## ملفات JSON جاهزة للإعداد في ElevenLabs Dashboard

---

## 📁 هيكل الملفات

```
elevenlabs-config/
├── README.md                    # هذا الملف
├── webhook-config.json          # إعداد Webhook
├── agent-context.json           # Agent Context
└── tools/
    ├── preview_library.json
    ├── search_library.json
    ├── submit_to_builder.json
    ├── create_payment.json
    ├── send_twilio_message.json
    ├── notify_owner.json
    └── execute_owner_command.json
```

---

## 🚀 كيفية الاستخدام

### 1. إعداد Webhook:

1. اذهب إلى ElevenLabs Dashboard → Agent Settings → Webhooks
2. اضغط **"Add Webhook"**
3. انسخ محتوى `webhook-config.json` والصقه في الإعدادات
4. أو أدخل القيم يدوياً:
   - **URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
   - **Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`
   - **Events:** فعّل جميع الأحداث

---

### 2. إضافة Tools:

1. اذهب إلى **Configure** → **Tools**
2. لكل Tool:
   - اضغط **"Add Tool"** أو **"Create Tool"**
   - انسخ محتوى ملف JSON المقابل
   - الصقه في الإعدادات
   - احفظ

**الترتيب الموصى به:**
1. `preview_library.json`
2. `search_library.json`
3. `submit_to_builder.json`
4. `create_payment.json`
5. `send_twilio_message.json`
6. `notify_owner.json`
7. `execute_owner_command.json`

---

### 3. إعداد Agent Context:

1. اذهب إلى **Configure** → **Agent Settings** → **Context**
2. انسخ محتوى `agent-context.json`
3. الصقه في حقل Context
4. احفظ

---

## 📋 قائمة التحقق

- [ ] Webhook URL و Secret مضافين
- [ ] جميع Events مفعلة
- [ ] Tool 1: `preview_library` مضاف
- [ ] Tool 2: `search_library` مضاف
- [ ] Tool 3: `submit_to_builder` مضاف
- [ ] Tool 4: `create_payment` مضاف
- [ ] Tool 5: `send_twilio_message` مضاف
- [ ] Tool 6: `notify_owner` مضاف
- [ ] Tool 7: `execute_owner_command` مضاف
- [ ] Agent Context مضاف
- [ ] Voice ID للمالك: `6ZVgc4q9LWAloWbuwjuu` موجود
- [ ] اللغات واللهجات مفعلة
- [ ] اختبار المحادثة

---

## 🔧 ملاحظات مهمة

### Webhook:
- ✅ URL يجب أن يكون متاحاً من الإنترنت
- ✅ Secret يجب أن يطابق الموجود في `.env`
- ✅ جميع Events يجب أن تكون مفعلة

### Tools:
- ✅ Endpoints يجب أن تكون متاحة من الإنترنت
- ✅ Method يجب أن يكون `POST`
- ✅ Headers يجب أن تحتوي على `Content-Type: application/json`
- ✅ Parameters يجب أن تطابق الموجود في Backend

### Agent Context:
- ✅ جميع القيم صحيحة ومحدثة
- ✅ Owner Voice ID: `6ZVgc4q9LWAloWbuwjuu`
- ✅ API URLs صحيحة

---

## 🧪 الاختبار

بعد إتمام الإعداد:

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
   🔧 Tool call: preview_library
   ```

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تحقق من Backend logs
2. تحقق من Webhook URL و Secret
3. تحقق من Tools Endpoints
4. تواصل مع الدعم

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## ملفات JSON جاهزة للإعداد في ElevenLabs Dashboard

---

## 📁 هيكل الملفات

```
elevenlabs-config/
├── README.md                    # هذا الملف
├── webhook-config.json          # إعداد Webhook
├── agent-context.json           # Agent Context
└── tools/
    ├── preview_library.json
    ├── search_library.json
    ├── submit_to_builder.json
    ├── create_payment.json
    ├── send_twilio_message.json
    ├── notify_owner.json
    └── execute_owner_command.json
```

---

## 🚀 كيفية الاستخدام

### 1. إعداد Webhook:

1. اذهب إلى ElevenLabs Dashboard → Agent Settings → Webhooks
2. اضغط **"Add Webhook"**
3. انسخ محتوى `webhook-config.json` والصقه في الإعدادات
4. أو أدخل القيم يدوياً:
   - **URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
   - **Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`
   - **Events:** فعّل جميع الأحداث

---

### 2. إضافة Tools:

1. اذهب إلى **Configure** → **Tools**
2. لكل Tool:
   - اضغط **"Add Tool"** أو **"Create Tool"**
   - انسخ محتوى ملف JSON المقابل
   - الصقه في الإعدادات
   - احفظ

**الترتيب الموصى به:**
1. `preview_library.json`
2. `search_library.json`
3. `submit_to_builder.json`
4. `create_payment.json`
5. `send_twilio_message.json`
6. `notify_owner.json`
7. `execute_owner_command.json`

---

### 3. إعداد Agent Context:

1. اذهب إلى **Configure** → **Agent Settings** → **Context**
2. انسخ محتوى `agent-context.json`
3. الصقه في حقل Context
4. احفظ

---

## 📋 قائمة التحقق

- [ ] Webhook URL و Secret مضافين
- [ ] جميع Events مفعلة
- [ ] Tool 1: `preview_library` مضاف
- [ ] Tool 2: `search_library` مضاف
- [ ] Tool 3: `submit_to_builder` مضاف
- [ ] Tool 4: `create_payment` مضاف
- [ ] Tool 5: `send_twilio_message` مضاف
- [ ] Tool 6: `notify_owner` مضاف
- [ ] Tool 7: `execute_owner_command` مضاف
- [ ] Agent Context مضاف
- [ ] Voice ID للمالك: `6ZVgc4q9LWAloWbuwjuu` موجود
- [ ] اللغات واللهجات مفعلة
- [ ] اختبار المحادثة

---

## 🔧 ملاحظات مهمة

### Webhook:
- ✅ URL يجب أن يكون متاحاً من الإنترنت
- ✅ Secret يجب أن يطابق الموجود في `.env`
- ✅ جميع Events يجب أن تكون مفعلة

### Tools:
- ✅ Endpoints يجب أن تكون متاحة من الإنترنت
- ✅ Method يجب أن يكون `POST`
- ✅ Headers يجب أن تحتوي على `Content-Type: application/json`
- ✅ Parameters يجب أن تطابق الموجود في Backend

### Agent Context:
- ✅ جميع القيم صحيحة ومحدثة
- ✅ Owner Voice ID: `6ZVgc4q9LWAloWbuwjuu`
- ✅ API URLs صحيحة

---

## 🧪 الاختبار

بعد إتمام الإعداد:

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
   🔧 Tool call: preview_library
   ```

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تحقق من Backend logs
2. تحقق من Webhook URL و Secret
3. تحقق من Tools Endpoints
4. تواصل مع الدعم

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## ملفات JSON جاهزة للإعداد في ElevenLabs Dashboard

---

## 📁 هيكل الملفات

```
elevenlabs-config/
├── README.md                    # هذا الملف
├── webhook-config.json          # إعداد Webhook
├── agent-context.json           # Agent Context
└── tools/
    ├── preview_library.json
    ├── search_library.json
    ├── submit_to_builder.json
    ├── create_payment.json
    ├── send_twilio_message.json
    ├── notify_owner.json
    └── execute_owner_command.json
```

---

## 🚀 كيفية الاستخدام

### 1. إعداد Webhook:

1. اذهب إلى ElevenLabs Dashboard → Agent Settings → Webhooks
2. اضغط **"Add Webhook"**
3. انسخ محتوى `webhook-config.json` والصقه في الإعدادات
4. أو أدخل القيم يدوياً:
   - **URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
   - **Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`
   - **Events:** فعّل جميع الأحداث

---

### 2. إضافة Tools:

1. اذهب إلى **Configure** → **Tools**
2. لكل Tool:
   - اضغط **"Add Tool"** أو **"Create Tool"**
   - انسخ محتوى ملف JSON المقابل
   - الصقه في الإعدادات
   - احفظ

**الترتيب الموصى به:**
1. `preview_library.json`
2. `search_library.json`
3. `submit_to_builder.json`
4. `create_payment.json`
5. `send_twilio_message.json`
6. `notify_owner.json`
7. `execute_owner_command.json`

---

### 3. إعداد Agent Context:

1. اذهب إلى **Configure** → **Agent Settings** → **Context**
2. انسخ محتوى `agent-context.json`
3. الصقه في حقل Context
4. احفظ

---

## 📋 قائمة التحقق

- [ ] Webhook URL و Secret مضافين
- [ ] جميع Events مفعلة
- [ ] Tool 1: `preview_library` مضاف
- [ ] Tool 2: `search_library` مضاف
- [ ] Tool 3: `submit_to_builder` مضاف
- [ ] Tool 4: `create_payment` مضاف
- [ ] Tool 5: `send_twilio_message` مضاف
- [ ] Tool 6: `notify_owner` مضاف
- [ ] Tool 7: `execute_owner_command` مضاف
- [ ] Agent Context مضاف
- [ ] Voice ID للمالك: `6ZVgc4q9LWAloWbuwjuu` موجود
- [ ] اللغات واللهجات مفعلة
- [ ] اختبار المحادثة

---

## 🔧 ملاحظات مهمة

### Webhook:
- ✅ URL يجب أن يكون متاحاً من الإنترنت
- ✅ Secret يجب أن يطابق الموجود في `.env`
- ✅ جميع Events يجب أن تكون مفعلة

### Tools:
- ✅ Endpoints يجب أن تكون متاحة من الإنترنت
- ✅ Method يجب أن يكون `POST`
- ✅ Headers يجب أن تحتوي على `Content-Type: application/json`
- ✅ Parameters يجب أن تطابق الموجود في Backend

### Agent Context:
- ✅ جميع القيم صحيحة ومحدثة
- ✅ Owner Voice ID: `6ZVgc4q9LWAloWbuwjuu`
- ✅ API URLs صحيحة

---

## 🧪 الاختبار

بعد إتمام الإعداد:

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
   🔧 Tool call: preview_library
   ```

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تحقق من Backend logs
2. تحقق من Webhook URL و Secret
3. تحقق من Tools Endpoints
4. تواصل مع الدعم

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## ملفات JSON جاهزة للإعداد في ElevenLabs Dashboard

---

## 📁 هيكل الملفات

```
elevenlabs-config/
├── README.md                    # هذا الملف
├── webhook-config.json          # إعداد Webhook
├── agent-context.json           # Agent Context
└── tools/
    ├── preview_library.json
    ├── search_library.json
    ├── submit_to_builder.json
    ├── create_payment.json
    ├── send_twilio_message.json
    ├── notify_owner.json
    └── execute_owner_command.json
```

---

## 🚀 كيفية الاستخدام

### 1. إعداد Webhook:

1. اذهب إلى ElevenLabs Dashboard → Agent Settings → Webhooks
2. اضغط **"Add Webhook"**
3. انسخ محتوى `webhook-config.json` والصقه في الإعدادات
4. أو أدخل القيم يدوياً:
   - **URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
   - **Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`
   - **Events:** فعّل جميع الأحداث

---

### 2. إضافة Tools:

1. اذهب إلى **Configure** → **Tools**
2. لكل Tool:
   - اضغط **"Add Tool"** أو **"Create Tool"**
   - انسخ محتوى ملف JSON المقابل
   - الصقه في الإعدادات
   - احفظ

**الترتيب الموصى به:**
1. `preview_library.json`
2. `search_library.json`
3. `submit_to_builder.json`
4. `create_payment.json`
5. `send_twilio_message.json`
6. `notify_owner.json`
7. `execute_owner_command.json`

---

### 3. إعداد Agent Context:

1. اذهب إلى **Configure** → **Agent Settings** → **Context**
2. انسخ محتوى `agent-context.json`
3. الصقه في حقل Context
4. احفظ

---

## 📋 قائمة التحقق

- [ ] Webhook URL و Secret مضافين
- [ ] جميع Events مفعلة
- [ ] Tool 1: `preview_library` مضاف
- [ ] Tool 2: `search_library` مضاف
- [ ] Tool 3: `submit_to_builder` مضاف
- [ ] Tool 4: `create_payment` مضاف
- [ ] Tool 5: `send_twilio_message` مضاف
- [ ] Tool 6: `notify_owner` مضاف
- [ ] Tool 7: `execute_owner_command` مضاف
- [ ] Agent Context مضاف
- [ ] Voice ID للمالك: `6ZVgc4q9LWAloWbuwjuu` موجود
- [ ] اللغات واللهجات مفعلة
- [ ] اختبار المحادثة

---

## 🔧 ملاحظات مهمة

### Webhook:
- ✅ URL يجب أن يكون متاحاً من الإنترنت
- ✅ Secret يجب أن يطابق الموجود في `.env`
- ✅ جميع Events يجب أن تكون مفعلة

### Tools:
- ✅ Endpoints يجب أن تكون متاحة من الإنترنت
- ✅ Method يجب أن يكون `POST`
- ✅ Headers يجب أن تحتوي على `Content-Type: application/json`
- ✅ Parameters يجب أن تطابق الموجود في Backend

### Agent Context:
- ✅ جميع القيم صحيحة ومحدثة
- ✅ Owner Voice ID: `6ZVgc4q9LWAloWbuwjuu`
- ✅ API URLs صحيحة

---

## 🧪 الاختبار

بعد إتمام الإعداد:

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
   🔧 Tool call: preview_library
   ```

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تحقق من Backend logs
2. تحقق من Webhook URL و Secret
3. تحقق من Tools Endpoints
4. تواصل مع الدعم

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## ملفات JSON جاهزة للإعداد في ElevenLabs Dashboard

---

## 📁 هيكل الملفات

```
elevenlabs-config/
├── README.md                    # هذا الملف
├── webhook-config.json          # إعداد Webhook
├── agent-context.json           # Agent Context
└── tools/
    ├── preview_library.json
    ├── search_library.json
    ├── submit_to_builder.json
    ├── create_payment.json
    ├── send_twilio_message.json
    ├── notify_owner.json
    └── execute_owner_command.json
```

---

## 🚀 كيفية الاستخدام

### 1. إعداد Webhook:

1. اذهب إلى ElevenLabs Dashboard → Agent Settings → Webhooks
2. اضغط **"Add Webhook"**
3. انسخ محتوى `webhook-config.json` والصقه في الإعدادات
4. أو أدخل القيم يدوياً:
   - **URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
   - **Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`
   - **Events:** فعّل جميع الأحداث

---

### 2. إضافة Tools:

1. اذهب إلى **Configure** → **Tools**
2. لكل Tool:
   - اضغط **"Add Tool"** أو **"Create Tool"**
   - انسخ محتوى ملف JSON المقابل
   - الصقه في الإعدادات
   - احفظ

**الترتيب الموصى به:**
1. `preview_library.json`
2. `search_library.json`
3. `submit_to_builder.json`
4. `create_payment.json`
5. `send_twilio_message.json`
6. `notify_owner.json`
7. `execute_owner_command.json`

---

### 3. إعداد Agent Context:

1. اذهب إلى **Configure** → **Agent Settings** → **Context**
2. انسخ محتوى `agent-context.json`
3. الصقه في حقل Context
4. احفظ

---

## 📋 قائمة التحقق

- [ ] Webhook URL و Secret مضافين
- [ ] جميع Events مفعلة
- [ ] Tool 1: `preview_library` مضاف
- [ ] Tool 2: `search_library` مضاف
- [ ] Tool 3: `submit_to_builder` مضاف
- [ ] Tool 4: `create_payment` مضاف
- [ ] Tool 5: `send_twilio_message` مضاف
- [ ] Tool 6: `notify_owner` مضاف
- [ ] Tool 7: `execute_owner_command` مضاف
- [ ] Agent Context مضاف
- [ ] Voice ID للمالك: `6ZVgc4q9LWAloWbuwjuu` موجود
- [ ] اللغات واللهجات مفعلة
- [ ] اختبار المحادثة

---

## 🔧 ملاحظات مهمة

### Webhook:
- ✅ URL يجب أن يكون متاحاً من الإنترنت
- ✅ Secret يجب أن يطابق الموجود في `.env`
- ✅ جميع Events يجب أن تكون مفعلة

### Tools:
- ✅ Endpoints يجب أن تكون متاحة من الإنترنت
- ✅ Method يجب أن يكون `POST`
- ✅ Headers يجب أن تحتوي على `Content-Type: application/json`
- ✅ Parameters يجب أن تطابق الموجود في Backend

### Agent Context:
- ✅ جميع القيم صحيحة ومحدثة
- ✅ Owner Voice ID: `6ZVgc4q9LWAloWbuwjuu`
- ✅ API URLs صحيحة

---

## 🧪 الاختبار

بعد إتمام الإعداد:

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
   🔧 Tool call: preview_library
   ```

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تحقق من Backend logs
2. تحقق من Webhook URL و Secret
3. تحقق من Tools Endpoints
4. تواصل مع الدعم

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## ملفات JSON جاهزة للإعداد في ElevenLabs Dashboard

---

## 📁 هيكل الملفات

```
elevenlabs-config/
├── README.md                    # هذا الملف
├── webhook-config.json          # إعداد Webhook
├── agent-context.json           # Agent Context
└── tools/
    ├── preview_library.json
    ├── search_library.json
    ├── submit_to_builder.json
    ├── create_payment.json
    ├── send_twilio_message.json
    ├── notify_owner.json
    └── execute_owner_command.json
```

---

## 🚀 كيفية الاستخدام

### 1. إعداد Webhook:

1. اذهب إلى ElevenLabs Dashboard → Agent Settings → Webhooks
2. اضغط **"Add Webhook"**
3. انسخ محتوى `webhook-config.json` والصقه في الإعدادات
4. أو أدخل القيم يدوياً:
   - **URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
   - **Secret:** `rare4n_webhook_secret_2026_secure_key_agn@algeneralnrsafa01018811220`
   - **Events:** فعّل جميع الأحداث

---

### 2. إضافة Tools:

1. اذهب إلى **Configure** → **Tools**
2. لكل Tool:
   - اضغط **"Add Tool"** أو **"Create Tool"**
   - انسخ محتوى ملف JSON المقابل
   - الصقه في الإعدادات
   - احفظ

**الترتيب الموصى به:**
1. `preview_library.json`
2. `search_library.json`
3. `submit_to_builder.json`
4. `create_payment.json`
5. `send_twilio_message.json`
6. `notify_owner.json`
7. `execute_owner_command.json`

---

### 3. إعداد Agent Context:

1. اذهب إلى **Configure** → **Agent Settings** → **Context**
2. انسخ محتوى `agent-context.json`
3. الصقه في حقل Context
4. احفظ

---

## 📋 قائمة التحقق

- [ ] Webhook URL و Secret مضافين
- [ ] جميع Events مفعلة
- [ ] Tool 1: `preview_library` مضاف
- [ ] Tool 2: `search_library` مضاف
- [ ] Tool 3: `submit_to_builder` مضاف
- [ ] Tool 4: `create_payment` مضاف
- [ ] Tool 5: `send_twilio_message` مضاف
- [ ] Tool 6: `notify_owner` مضاف
- [ ] Tool 7: `execute_owner_command` مضاف
- [ ] Agent Context مضاف
- [ ] Voice ID للمالك: `6ZVgc4q9LWAloWbuwjuu` موجود
- [ ] اللغات واللهجات مفعلة
- [ ] اختبار المحادثة

---

## 🔧 ملاحظات مهمة

### Webhook:
- ✅ URL يجب أن يكون متاحاً من الإنترنت
- ✅ Secret يجب أن يطابق الموجود في `.env`
- ✅ جميع Events يجب أن تكون مفعلة

### Tools:
- ✅ Endpoints يجب أن تكون متاحة من الإنترنت
- ✅ Method يجب أن يكون `POST`
- ✅ Headers يجب أن تحتوي على `Content-Type: application/json`
- ✅ Parameters يجب أن تطابق الموجود في Backend

### Agent Context:
- ✅ جميع القيم صحيحة ومحدثة
- ✅ Owner Voice ID: `6ZVgc4q9LWAloWbuwjuu`
- ✅ API URLs صحيحة

---

## 🧪 الاختبار

بعد إتمام الإعداد:

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
   🔧 Tool call: preview_library
   ```

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تحقق من Backend logs
2. تحقق من Webhook URL و Secret
3. تحقق من Tools Endpoints
4. تواصل مع الدعم

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

