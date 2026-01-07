# إعداد ElevenLabs Agent للمالك (Nader) - RARE 4N
## دليل إعداد Agent للتعامل مع المالك وحفظ وتنفيذ أوامره

---

## ✅ Voice ID للمالك

**Voice ID:** `6ZVgc4q9LWAloWbuwjuu`

هذا هو Voice ID الخاص بك (Nader) والذي يستخدمه الـ Agent للتعرف عليك وحفظ وتنفيذ أوامرك.

---

## 🔧 الإعدادات المحدثة

### 1. Webhook Handler (`elevenlabs-webhook.js`):
- ✅ **التحقق من Voice ID:** عند بدء المحادثة، يتم التحقق من Voice ID
- ✅ **حفظ سياق المالك:** إذا كان Voice ID = `6ZVgc4q9LWAloWbuwjuu`، يتم حفظ السياق كمالك
- ✅ **تفعيل تنفيذ الأوامر:** جميع أوامر المالك يتم تنفيذها مباشرة
- ✅ **حفظ الأوامر:** جميع أوامر المالك يتم حفظها في قاعدة البيانات

### 2. Agent Service (`elevenLabsAgentService.js`):
- ✅ **Owner Context:** عند إنشاء محادثة، إذا كان Voice ID للمالك، يتم إضافة سياق خاص
- ✅ **Libraries Access:** المالك لديه وصول كامل للمكتبات (Templates, Systems, Themes)
- ✅ **Command Execution:** تفعيل تنفيذ الأوامر للمالك

### 3. Libraries:
- ✅ **appTemplatesLibrary.js:** مكتبة قوالب التطبيقات
- ✅ **systemsLibrary.js:** مكتبة الأنظمة
- ✅ **themesLibrary.js:** مكتبة الثيمات

---

## 📚 Knowledge Base للـ Agent

الـ Agent الآن يفهم:

### 1. **Libraries Structure:**
```javascript
// Templates Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  category: "string (e-commerce, social, business, etc.)",
  description: "string",
  features: ["array"],
  price: "number"
}

// Systems Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  category: "string (crm, erp, inventory, etc.)",
  description: "string",
  features: ["array"],
  price: "number"
}

// Themes Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  primary: "string (color)",
  secondary: "string (color)",
  description: "string"
}
```

### 2. **API Endpoints:**
- `GET /api/libraries/templates` - جميع القوالب
- `GET /api/libraries/systems` - جميع الأنظمة
- `GET /api/libraries/themes` - جميع الثيمات
- `GET /api/libraries/search?q=query` - البحث في جميع المكتبات

### 3. **Tools المتاحة:**
- `preview_library` - معاينة المكتبات
- `search_library` - البحث في المكتبات
- `submit_to_builder` - إرسال طلب للبيلدر
- `create_payment` - إنشاء عملية دفع
- `send_twilio_message` - إرسال رسالة عبر Twilio
- `notify_owner` - إشعار المالك
- `execute_owner_command` - تنفيذ أمر المالك

---

## 🎯 كيفية استخدام Agent كمالك

### 1. **بدء المحادثة:**
- استخدم Voice ID: `6ZVgc4q9LWAloWbuwjuu`
- الـ Agent سيتعرف عليك تلقائياً كمالك

### 2. **الأوامر المتاحة:**

#### أ. **معاينة المكتبات:**
```
"أعرض لي القوالب المتاحة"
"Show me available templates"
"ما هي الأنظمة المتاحة؟"
"What systems are available?"
```

#### ب. **البحث في المكتبات:**
```
"ابحث عن تطبيق تجارة إلكترونية"
"Search for e-commerce app"
"أريد نظام إدارة علاقات العملاء"
"I need a CRM system"
```

#### ج. **إنشاء طلب بناء:**
```
"أنشئ طلب بناء لتطبيق تجارة إلكترونية"
"Create build request for e-commerce app"
"أريد بناء نظام إدارة المخزون"
"I want to build an inventory management system"
```

#### د. **إنشاء عملية دفع:**
```
"أنشئ عملية دفع بقيمة 1000 درهم"
"Create payment for 1000 AED"
"أريد دفع 500 دولار"
"I want to pay 500 USD"
```

#### ه. **إرسال رسالة:**
```
"أرسل رسالة للعميل محمد"
"Send message to client Mohamed"
"أرسل واتساب للعميل"
"Send WhatsApp to client"
```

#### و. **في حالة مشكلة:**
```
"لدي مشكلة في البيلدر"
"I have a problem with the builder"
"البيلدر لا يعمل"
"The builder is not working"
```

الـ Agent سيتواصل معك مباشرة عبر Twilio أو سيحفظ الأمر وينفذه.

---

## 🔄 تدفق العمل

### 1. **بدء المحادثة:**
```
User (Nader) → Voice ID: 6ZVgc4q9LWAloWbuwjuu
↓
Agent → يتحقق من Voice ID
↓
Agent → يحفظ السياق كمالك
↓
Agent → يفعل تنفيذ الأوامر
```

### 2. **تنفيذ أمر:**
```
User (Nader) → "أنشئ طلب بناء"
↓
Agent → يستدعي Tool: submit_to_builder
↓
Backend → ينفذ الأمر
↓
Backend → يرسل النتيجة للـ Agent
↓
Agent → يرد للمالك
```

### 3. **في حالة مشكلة:**
```
User (Nader) → "لدي مشكلة"
↓
Agent → يحفظ الأمر
↓
Agent → يستدعي Tool: notify_owner
↓
Backend → يرسل إشعار للمالك عبر Twilio
↓
Backend → يحفظ المشكلة في قاعدة البيانات
```

---

## 📊 قاعدة البيانات

### Tables المستخدمة:

1. **conversations:**
   - `id`: معرف المحادثة
   - `user_id`: معرف المستخدم (owner_nader للمالك)
   - `voice_id`: Voice ID (`6ZVgc4q9LWAloWbuwjuu`)
   - `is_owner`: 1 للمالك، 0 للعميل
   - `context`: السياق (JSON)

2. **conversation_messages:**
   - `id`: معرف الرسالة
   - `conversation_id`: معرف المحادثة
   - `role`: user أو assistant
   - `text`: نص الرسالة
   - `language`: اللغة
   - `dialect`: اللهجة

3. **user_commands:**
   - `id`: معرف الأمر
   - `conversation_id`: معرف المحادثة
   - `command`: نص الأمر
   - `status`: saved, executed, failed
   - `executed_at`: وقت التنفيذ

4. **agent_tool_calls:**
   - `id`: معرف الاستدعاء
   - `conversation_id`: معرف المحادثة
   - `tool_name`: اسم الـ Tool
   - `parameters`: المعاملات (JSON)
   - `result`: النتيجة (JSON)

---

## ✅ قائمة التحقق

- [ ] Voice ID: `6ZVgc4q9LWAloWbuwjuu` مضاف في `.env`
- [ ] Webhook Handler محدث
- [ ] Agent Service محدث
- [ ] Libraries موجودة
- [ ] قاعدة البيانات محدثة
- [ ] اختبار بدء المحادثة
- [ ] اختبار تنفيذ أمر
- [ ] اختبار التواصل في حالة مشكلة

---

## 🔗 الروابط

- **Webhook Endpoint:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Libraries API:** `https://api.zien-ai.app/api/libraries`
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل إعداد Agent للتعامل مع المالك وحفظ وتنفيذ أوامره

---

## ✅ Voice ID للمالك

**Voice ID:** `6ZVgc4q9LWAloWbuwjuu`

هذا هو Voice ID الخاص بك (Nader) والذي يستخدمه الـ Agent للتعرف عليك وحفظ وتنفيذ أوامرك.

---

## 🔧 الإعدادات المحدثة

### 1. Webhook Handler (`elevenlabs-webhook.js`):
- ✅ **التحقق من Voice ID:** عند بدء المحادثة، يتم التحقق من Voice ID
- ✅ **حفظ سياق المالك:** إذا كان Voice ID = `6ZVgc4q9LWAloWbuwjuu`، يتم حفظ السياق كمالك
- ✅ **تفعيل تنفيذ الأوامر:** جميع أوامر المالك يتم تنفيذها مباشرة
- ✅ **حفظ الأوامر:** جميع أوامر المالك يتم حفظها في قاعدة البيانات

### 2. Agent Service (`elevenLabsAgentService.js`):
- ✅ **Owner Context:** عند إنشاء محادثة، إذا كان Voice ID للمالك، يتم إضافة سياق خاص
- ✅ **Libraries Access:** المالك لديه وصول كامل للمكتبات (Templates, Systems, Themes)
- ✅ **Command Execution:** تفعيل تنفيذ الأوامر للمالك

### 3. Libraries:
- ✅ **appTemplatesLibrary.js:** مكتبة قوالب التطبيقات
- ✅ **systemsLibrary.js:** مكتبة الأنظمة
- ✅ **themesLibrary.js:** مكتبة الثيمات

---

## 📚 Knowledge Base للـ Agent

الـ Agent الآن يفهم:

### 1. **Libraries Structure:**
```javascript
// Templates Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  category: "string (e-commerce, social, business, etc.)",
  description: "string",
  features: ["array"],
  price: "number"
}

// Systems Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  category: "string (crm, erp, inventory, etc.)",
  description: "string",
  features: ["array"],
  price: "number"
}

// Themes Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  primary: "string (color)",
  secondary: "string (color)",
  description: "string"
}
```

### 2. **API Endpoints:**
- `GET /api/libraries/templates` - جميع القوالب
- `GET /api/libraries/systems` - جميع الأنظمة
- `GET /api/libraries/themes` - جميع الثيمات
- `GET /api/libraries/search?q=query` - البحث في جميع المكتبات

### 3. **Tools المتاحة:**
- `preview_library` - معاينة المكتبات
- `search_library` - البحث في المكتبات
- `submit_to_builder` - إرسال طلب للبيلدر
- `create_payment` - إنشاء عملية دفع
- `send_twilio_message` - إرسال رسالة عبر Twilio
- `notify_owner` - إشعار المالك
- `execute_owner_command` - تنفيذ أمر المالك

---

## 🎯 كيفية استخدام Agent كمالك

### 1. **بدء المحادثة:**
- استخدم Voice ID: `6ZVgc4q9LWAloWbuwjuu`
- الـ Agent سيتعرف عليك تلقائياً كمالك

### 2. **الأوامر المتاحة:**

#### أ. **معاينة المكتبات:**
```
"أعرض لي القوالب المتاحة"
"Show me available templates"
"ما هي الأنظمة المتاحة؟"
"What systems are available?"
```

#### ب. **البحث في المكتبات:**
```
"ابحث عن تطبيق تجارة إلكترونية"
"Search for e-commerce app"
"أريد نظام إدارة علاقات العملاء"
"I need a CRM system"
```

#### ج. **إنشاء طلب بناء:**
```
"أنشئ طلب بناء لتطبيق تجارة إلكترونية"
"Create build request for e-commerce app"
"أريد بناء نظام إدارة المخزون"
"I want to build an inventory management system"
```

#### د. **إنشاء عملية دفع:**
```
"أنشئ عملية دفع بقيمة 1000 درهم"
"Create payment for 1000 AED"
"أريد دفع 500 دولار"
"I want to pay 500 USD"
```

#### ه. **إرسال رسالة:**
```
"أرسل رسالة للعميل محمد"
"Send message to client Mohamed"
"أرسل واتساب للعميل"
"Send WhatsApp to client"
```

#### و. **في حالة مشكلة:**
```
"لدي مشكلة في البيلدر"
"I have a problem with the builder"
"البيلدر لا يعمل"
"The builder is not working"
```

الـ Agent سيتواصل معك مباشرة عبر Twilio أو سيحفظ الأمر وينفذه.

---

## 🔄 تدفق العمل

### 1. **بدء المحادثة:**
```
User (Nader) → Voice ID: 6ZVgc4q9LWAloWbuwjuu
↓
Agent → يتحقق من Voice ID
↓
Agent → يحفظ السياق كمالك
↓
Agent → يفعل تنفيذ الأوامر
```

### 2. **تنفيذ أمر:**
```
User (Nader) → "أنشئ طلب بناء"
↓
Agent → يستدعي Tool: submit_to_builder
↓
Backend → ينفذ الأمر
↓
Backend → يرسل النتيجة للـ Agent
↓
Agent → يرد للمالك
```

### 3. **في حالة مشكلة:**
```
User (Nader) → "لدي مشكلة"
↓
Agent → يحفظ الأمر
↓
Agent → يستدعي Tool: notify_owner
↓
Backend → يرسل إشعار للمالك عبر Twilio
↓
Backend → يحفظ المشكلة في قاعدة البيانات
```

---

## 📊 قاعدة البيانات

### Tables المستخدمة:

1. **conversations:**
   - `id`: معرف المحادثة
   - `user_id`: معرف المستخدم (owner_nader للمالك)
   - `voice_id`: Voice ID (`6ZVgc4q9LWAloWbuwjuu`)
   - `is_owner`: 1 للمالك، 0 للعميل
   - `context`: السياق (JSON)

2. **conversation_messages:**
   - `id`: معرف الرسالة
   - `conversation_id`: معرف المحادثة
   - `role`: user أو assistant
   - `text`: نص الرسالة
   - `language`: اللغة
   - `dialect`: اللهجة

3. **user_commands:**
   - `id`: معرف الأمر
   - `conversation_id`: معرف المحادثة
   - `command`: نص الأمر
   - `status`: saved, executed, failed
   - `executed_at`: وقت التنفيذ

4. **agent_tool_calls:**
   - `id`: معرف الاستدعاء
   - `conversation_id`: معرف المحادثة
   - `tool_name`: اسم الـ Tool
   - `parameters`: المعاملات (JSON)
   - `result`: النتيجة (JSON)

---

## ✅ قائمة التحقق

- [ ] Voice ID: `6ZVgc4q9LWAloWbuwjuu` مضاف في `.env`
- [ ] Webhook Handler محدث
- [ ] Agent Service محدث
- [ ] Libraries موجودة
- [ ] قاعدة البيانات محدثة
- [ ] اختبار بدء المحادثة
- [ ] اختبار تنفيذ أمر
- [ ] اختبار التواصل في حالة مشكلة

---

## 🔗 الروابط

- **Webhook Endpoint:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Libraries API:** `https://api.zien-ai.app/api/libraries`
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل إعداد Agent للتعامل مع المالك وحفظ وتنفيذ أوامره

---

## ✅ Voice ID للمالك

**Voice ID:** `6ZVgc4q9LWAloWbuwjuu`

هذا هو Voice ID الخاص بك (Nader) والذي يستخدمه الـ Agent للتعرف عليك وحفظ وتنفيذ أوامرك.

---

## 🔧 الإعدادات المحدثة

### 1. Webhook Handler (`elevenlabs-webhook.js`):
- ✅ **التحقق من Voice ID:** عند بدء المحادثة، يتم التحقق من Voice ID
- ✅ **حفظ سياق المالك:** إذا كان Voice ID = `6ZVgc4q9LWAloWbuwjuu`، يتم حفظ السياق كمالك
- ✅ **تفعيل تنفيذ الأوامر:** جميع أوامر المالك يتم تنفيذها مباشرة
- ✅ **حفظ الأوامر:** جميع أوامر المالك يتم حفظها في قاعدة البيانات

### 2. Agent Service (`elevenLabsAgentService.js`):
- ✅ **Owner Context:** عند إنشاء محادثة، إذا كان Voice ID للمالك، يتم إضافة سياق خاص
- ✅ **Libraries Access:** المالك لديه وصول كامل للمكتبات (Templates, Systems, Themes)
- ✅ **Command Execution:** تفعيل تنفيذ الأوامر للمالك

### 3. Libraries:
- ✅ **appTemplatesLibrary.js:** مكتبة قوالب التطبيقات
- ✅ **systemsLibrary.js:** مكتبة الأنظمة
- ✅ **themesLibrary.js:** مكتبة الثيمات

---

## 📚 Knowledge Base للـ Agent

الـ Agent الآن يفهم:

### 1. **Libraries Structure:**
```javascript
// Templates Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  category: "string (e-commerce, social, business, etc.)",
  description: "string",
  features: ["array"],
  price: "number"
}

// Systems Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  category: "string (crm, erp, inventory, etc.)",
  description: "string",
  features: ["array"],
  price: "number"
}

// Themes Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  primary: "string (color)",
  secondary: "string (color)",
  description: "string"
}
```

### 2. **API Endpoints:**
- `GET /api/libraries/templates` - جميع القوالب
- `GET /api/libraries/systems` - جميع الأنظمة
- `GET /api/libraries/themes` - جميع الثيمات
- `GET /api/libraries/search?q=query` - البحث في جميع المكتبات

### 3. **Tools المتاحة:**
- `preview_library` - معاينة المكتبات
- `search_library` - البحث في المكتبات
- `submit_to_builder` - إرسال طلب للبيلدر
- `create_payment` - إنشاء عملية دفع
- `send_twilio_message` - إرسال رسالة عبر Twilio
- `notify_owner` - إشعار المالك
- `execute_owner_command` - تنفيذ أمر المالك

---

## 🎯 كيفية استخدام Agent كمالك

### 1. **بدء المحادثة:**
- استخدم Voice ID: `6ZVgc4q9LWAloWbuwjuu`
- الـ Agent سيتعرف عليك تلقائياً كمالك

### 2. **الأوامر المتاحة:**

#### أ. **معاينة المكتبات:**
```
"أعرض لي القوالب المتاحة"
"Show me available templates"
"ما هي الأنظمة المتاحة؟"
"What systems are available?"
```

#### ب. **البحث في المكتبات:**
```
"ابحث عن تطبيق تجارة إلكترونية"
"Search for e-commerce app"
"أريد نظام إدارة علاقات العملاء"
"I need a CRM system"
```

#### ج. **إنشاء طلب بناء:**
```
"أنشئ طلب بناء لتطبيق تجارة إلكترونية"
"Create build request for e-commerce app"
"أريد بناء نظام إدارة المخزون"
"I want to build an inventory management system"
```

#### د. **إنشاء عملية دفع:**
```
"أنشئ عملية دفع بقيمة 1000 درهم"
"Create payment for 1000 AED"
"أريد دفع 500 دولار"
"I want to pay 500 USD"
```

#### ه. **إرسال رسالة:**
```
"أرسل رسالة للعميل محمد"
"Send message to client Mohamed"
"أرسل واتساب للعميل"
"Send WhatsApp to client"
```

#### و. **في حالة مشكلة:**
```
"لدي مشكلة في البيلدر"
"I have a problem with the builder"
"البيلدر لا يعمل"
"The builder is not working"
```

الـ Agent سيتواصل معك مباشرة عبر Twilio أو سيحفظ الأمر وينفذه.

---

## 🔄 تدفق العمل

### 1. **بدء المحادثة:**
```
User (Nader) → Voice ID: 6ZVgc4q9LWAloWbuwjuu
↓
Agent → يتحقق من Voice ID
↓
Agent → يحفظ السياق كمالك
↓
Agent → يفعل تنفيذ الأوامر
```

### 2. **تنفيذ أمر:**
```
User (Nader) → "أنشئ طلب بناء"
↓
Agent → يستدعي Tool: submit_to_builder
↓
Backend → ينفذ الأمر
↓
Backend → يرسل النتيجة للـ Agent
↓
Agent → يرد للمالك
```

### 3. **في حالة مشكلة:**
```
User (Nader) → "لدي مشكلة"
↓
Agent → يحفظ الأمر
↓
Agent → يستدعي Tool: notify_owner
↓
Backend → يرسل إشعار للمالك عبر Twilio
↓
Backend → يحفظ المشكلة في قاعدة البيانات
```

---

## 📊 قاعدة البيانات

### Tables المستخدمة:

1. **conversations:**
   - `id`: معرف المحادثة
   - `user_id`: معرف المستخدم (owner_nader للمالك)
   - `voice_id`: Voice ID (`6ZVgc4q9LWAloWbuwjuu`)
   - `is_owner`: 1 للمالك، 0 للعميل
   - `context`: السياق (JSON)

2. **conversation_messages:**
   - `id`: معرف الرسالة
   - `conversation_id`: معرف المحادثة
   - `role`: user أو assistant
   - `text`: نص الرسالة
   - `language`: اللغة
   - `dialect`: اللهجة

3. **user_commands:**
   - `id`: معرف الأمر
   - `conversation_id`: معرف المحادثة
   - `command`: نص الأمر
   - `status`: saved, executed, failed
   - `executed_at`: وقت التنفيذ

4. **agent_tool_calls:**
   - `id`: معرف الاستدعاء
   - `conversation_id`: معرف المحادثة
   - `tool_name`: اسم الـ Tool
   - `parameters`: المعاملات (JSON)
   - `result`: النتيجة (JSON)

---

## ✅ قائمة التحقق

- [ ] Voice ID: `6ZVgc4q9LWAloWbuwjuu` مضاف في `.env`
- [ ] Webhook Handler محدث
- [ ] Agent Service محدث
- [ ] Libraries موجودة
- [ ] قاعدة البيانات محدثة
- [ ] اختبار بدء المحادثة
- [ ] اختبار تنفيذ أمر
- [ ] اختبار التواصل في حالة مشكلة

---

## 🔗 الروابط

- **Webhook Endpoint:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Libraries API:** `https://api.zien-ai.app/api/libraries`
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل إعداد Agent للتعامل مع المالك وحفظ وتنفيذ أوامره

---

## ✅ Voice ID للمالك

**Voice ID:** `6ZVgc4q9LWAloWbuwjuu`

هذا هو Voice ID الخاص بك (Nader) والذي يستخدمه الـ Agent للتعرف عليك وحفظ وتنفيذ أوامرك.

---

## 🔧 الإعدادات المحدثة

### 1. Webhook Handler (`elevenlabs-webhook.js`):
- ✅ **التحقق من Voice ID:** عند بدء المحادثة، يتم التحقق من Voice ID
- ✅ **حفظ سياق المالك:** إذا كان Voice ID = `6ZVgc4q9LWAloWbuwjuu`، يتم حفظ السياق كمالك
- ✅ **تفعيل تنفيذ الأوامر:** جميع أوامر المالك يتم تنفيذها مباشرة
- ✅ **حفظ الأوامر:** جميع أوامر المالك يتم حفظها في قاعدة البيانات

### 2. Agent Service (`elevenLabsAgentService.js`):
- ✅ **Owner Context:** عند إنشاء محادثة، إذا كان Voice ID للمالك، يتم إضافة سياق خاص
- ✅ **Libraries Access:** المالك لديه وصول كامل للمكتبات (Templates, Systems, Themes)
- ✅ **Command Execution:** تفعيل تنفيذ الأوامر للمالك

### 3. Libraries:
- ✅ **appTemplatesLibrary.js:** مكتبة قوالب التطبيقات
- ✅ **systemsLibrary.js:** مكتبة الأنظمة
- ✅ **themesLibrary.js:** مكتبة الثيمات

---

## 📚 Knowledge Base للـ Agent

الـ Agent الآن يفهم:

### 1. **Libraries Structure:**
```javascript
// Templates Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  category: "string (e-commerce, social, business, etc.)",
  description: "string",
  features: ["array"],
  price: "number"
}

// Systems Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  category: "string (crm, erp, inventory, etc.)",
  description: "string",
  features: ["array"],
  price: "number"
}

// Themes Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  primary: "string (color)",
  secondary: "string (color)",
  description: "string"
}
```

### 2. **API Endpoints:**
- `GET /api/libraries/templates` - جميع القوالب
- `GET /api/libraries/systems` - جميع الأنظمة
- `GET /api/libraries/themes` - جميع الثيمات
- `GET /api/libraries/search?q=query` - البحث في جميع المكتبات

### 3. **Tools المتاحة:**
- `preview_library` - معاينة المكتبات
- `search_library` - البحث في المكتبات
- `submit_to_builder` - إرسال طلب للبيلدر
- `create_payment` - إنشاء عملية دفع
- `send_twilio_message` - إرسال رسالة عبر Twilio
- `notify_owner` - إشعار المالك
- `execute_owner_command` - تنفيذ أمر المالك

---

## 🎯 كيفية استخدام Agent كمالك

### 1. **بدء المحادثة:**
- استخدم Voice ID: `6ZVgc4q9LWAloWbuwjuu`
- الـ Agent سيتعرف عليك تلقائياً كمالك

### 2. **الأوامر المتاحة:**

#### أ. **معاينة المكتبات:**
```
"أعرض لي القوالب المتاحة"
"Show me available templates"
"ما هي الأنظمة المتاحة؟"
"What systems are available?"
```

#### ب. **البحث في المكتبات:**
```
"ابحث عن تطبيق تجارة إلكترونية"
"Search for e-commerce app"
"أريد نظام إدارة علاقات العملاء"
"I need a CRM system"
```

#### ج. **إنشاء طلب بناء:**
```
"أنشئ طلب بناء لتطبيق تجارة إلكترونية"
"Create build request for e-commerce app"
"أريد بناء نظام إدارة المخزون"
"I want to build an inventory management system"
```

#### د. **إنشاء عملية دفع:**
```
"أنشئ عملية دفع بقيمة 1000 درهم"
"Create payment for 1000 AED"
"أريد دفع 500 دولار"
"I want to pay 500 USD"
```

#### ه. **إرسال رسالة:**
```
"أرسل رسالة للعميل محمد"
"Send message to client Mohamed"
"أرسل واتساب للعميل"
"Send WhatsApp to client"
```

#### و. **في حالة مشكلة:**
```
"لدي مشكلة في البيلدر"
"I have a problem with the builder"
"البيلدر لا يعمل"
"The builder is not working"
```

الـ Agent سيتواصل معك مباشرة عبر Twilio أو سيحفظ الأمر وينفذه.

---

## 🔄 تدفق العمل

### 1. **بدء المحادثة:**
```
User (Nader) → Voice ID: 6ZVgc4q9LWAloWbuwjuu
↓
Agent → يتحقق من Voice ID
↓
Agent → يحفظ السياق كمالك
↓
Agent → يفعل تنفيذ الأوامر
```

### 2. **تنفيذ أمر:**
```
User (Nader) → "أنشئ طلب بناء"
↓
Agent → يستدعي Tool: submit_to_builder
↓
Backend → ينفذ الأمر
↓
Backend → يرسل النتيجة للـ Agent
↓
Agent → يرد للمالك
```

### 3. **في حالة مشكلة:**
```
User (Nader) → "لدي مشكلة"
↓
Agent → يحفظ الأمر
↓
Agent → يستدعي Tool: notify_owner
↓
Backend → يرسل إشعار للمالك عبر Twilio
↓
Backend → يحفظ المشكلة في قاعدة البيانات
```

---

## 📊 قاعدة البيانات

### Tables المستخدمة:

1. **conversations:**
   - `id`: معرف المحادثة
   - `user_id`: معرف المستخدم (owner_nader للمالك)
   - `voice_id`: Voice ID (`6ZVgc4q9LWAloWbuwjuu`)
   - `is_owner`: 1 للمالك، 0 للعميل
   - `context`: السياق (JSON)

2. **conversation_messages:**
   - `id`: معرف الرسالة
   - `conversation_id`: معرف المحادثة
   - `role`: user أو assistant
   - `text`: نص الرسالة
   - `language`: اللغة
   - `dialect`: اللهجة

3. **user_commands:**
   - `id`: معرف الأمر
   - `conversation_id`: معرف المحادثة
   - `command`: نص الأمر
   - `status`: saved, executed, failed
   - `executed_at`: وقت التنفيذ

4. **agent_tool_calls:**
   - `id`: معرف الاستدعاء
   - `conversation_id`: معرف المحادثة
   - `tool_name`: اسم الـ Tool
   - `parameters`: المعاملات (JSON)
   - `result`: النتيجة (JSON)

---

## ✅ قائمة التحقق

- [ ] Voice ID: `6ZVgc4q9LWAloWbuwjuu` مضاف في `.env`
- [ ] Webhook Handler محدث
- [ ] Agent Service محدث
- [ ] Libraries موجودة
- [ ] قاعدة البيانات محدثة
- [ ] اختبار بدء المحادثة
- [ ] اختبار تنفيذ أمر
- [ ] اختبار التواصل في حالة مشكلة

---

## 🔗 الروابط

- **Webhook Endpoint:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Libraries API:** `https://api.zien-ai.app/api/libraries`
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل إعداد Agent للتعامل مع المالك وحفظ وتنفيذ أوامره

---

## ✅ Voice ID للمالك

**Voice ID:** `6ZVgc4q9LWAloWbuwjuu`

هذا هو Voice ID الخاص بك (Nader) والذي يستخدمه الـ Agent للتعرف عليك وحفظ وتنفيذ أوامرك.

---

## 🔧 الإعدادات المحدثة

### 1. Webhook Handler (`elevenlabs-webhook.js`):
- ✅ **التحقق من Voice ID:** عند بدء المحادثة، يتم التحقق من Voice ID
- ✅ **حفظ سياق المالك:** إذا كان Voice ID = `6ZVgc4q9LWAloWbuwjuu`، يتم حفظ السياق كمالك
- ✅ **تفعيل تنفيذ الأوامر:** جميع أوامر المالك يتم تنفيذها مباشرة
- ✅ **حفظ الأوامر:** جميع أوامر المالك يتم حفظها في قاعدة البيانات

### 2. Agent Service (`elevenLabsAgentService.js`):
- ✅ **Owner Context:** عند إنشاء محادثة، إذا كان Voice ID للمالك، يتم إضافة سياق خاص
- ✅ **Libraries Access:** المالك لديه وصول كامل للمكتبات (Templates, Systems, Themes)
- ✅ **Command Execution:** تفعيل تنفيذ الأوامر للمالك

### 3. Libraries:
- ✅ **appTemplatesLibrary.js:** مكتبة قوالب التطبيقات
- ✅ **systemsLibrary.js:** مكتبة الأنظمة
- ✅ **themesLibrary.js:** مكتبة الثيمات

---

## 📚 Knowledge Base للـ Agent

الـ Agent الآن يفهم:

### 1. **Libraries Structure:**
```javascript
// Templates Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  category: "string (e-commerce, social, business, etc.)",
  description: "string",
  features: ["array"],
  price: "number"
}

// Systems Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  category: "string (crm, erp, inventory, etc.)",
  description: "string",
  features: ["array"],
  price: "number"
}

// Themes Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  primary: "string (color)",
  secondary: "string (color)",
  description: "string"
}
```

### 2. **API Endpoints:**
- `GET /api/libraries/templates` - جميع القوالب
- `GET /api/libraries/systems` - جميع الأنظمة
- `GET /api/libraries/themes` - جميع الثيمات
- `GET /api/libraries/search?q=query` - البحث في جميع المكتبات

### 3. **Tools المتاحة:**
- `preview_library` - معاينة المكتبات
- `search_library` - البحث في المكتبات
- `submit_to_builder` - إرسال طلب للبيلدر
- `create_payment` - إنشاء عملية دفع
- `send_twilio_message` - إرسال رسالة عبر Twilio
- `notify_owner` - إشعار المالك
- `execute_owner_command` - تنفيذ أمر المالك

---

## 🎯 كيفية استخدام Agent كمالك

### 1. **بدء المحادثة:**
- استخدم Voice ID: `6ZVgc4q9LWAloWbuwjuu`
- الـ Agent سيتعرف عليك تلقائياً كمالك

### 2. **الأوامر المتاحة:**

#### أ. **معاينة المكتبات:**
```
"أعرض لي القوالب المتاحة"
"Show me available templates"
"ما هي الأنظمة المتاحة؟"
"What systems are available?"
```

#### ب. **البحث في المكتبات:**
```
"ابحث عن تطبيق تجارة إلكترونية"
"Search for e-commerce app"
"أريد نظام إدارة علاقات العملاء"
"I need a CRM system"
```

#### ج. **إنشاء طلب بناء:**
```
"أنشئ طلب بناء لتطبيق تجارة إلكترونية"
"Create build request for e-commerce app"
"أريد بناء نظام إدارة المخزون"
"I want to build an inventory management system"
```

#### د. **إنشاء عملية دفع:**
```
"أنشئ عملية دفع بقيمة 1000 درهم"
"Create payment for 1000 AED"
"أريد دفع 500 دولار"
"I want to pay 500 USD"
```

#### ه. **إرسال رسالة:**
```
"أرسل رسالة للعميل محمد"
"Send message to client Mohamed"
"أرسل واتساب للعميل"
"Send WhatsApp to client"
```

#### و. **في حالة مشكلة:**
```
"لدي مشكلة في البيلدر"
"I have a problem with the builder"
"البيلدر لا يعمل"
"The builder is not working"
```

الـ Agent سيتواصل معك مباشرة عبر Twilio أو سيحفظ الأمر وينفذه.

---

## 🔄 تدفق العمل

### 1. **بدء المحادثة:**
```
User (Nader) → Voice ID: 6ZVgc4q9LWAloWbuwjuu
↓
Agent → يتحقق من Voice ID
↓
Agent → يحفظ السياق كمالك
↓
Agent → يفعل تنفيذ الأوامر
```

### 2. **تنفيذ أمر:**
```
User (Nader) → "أنشئ طلب بناء"
↓
Agent → يستدعي Tool: submit_to_builder
↓
Backend → ينفذ الأمر
↓
Backend → يرسل النتيجة للـ Agent
↓
Agent → يرد للمالك
```

### 3. **في حالة مشكلة:**
```
User (Nader) → "لدي مشكلة"
↓
Agent → يحفظ الأمر
↓
Agent → يستدعي Tool: notify_owner
↓
Backend → يرسل إشعار للمالك عبر Twilio
↓
Backend → يحفظ المشكلة في قاعدة البيانات
```

---

## 📊 قاعدة البيانات

### Tables المستخدمة:

1. **conversations:**
   - `id`: معرف المحادثة
   - `user_id`: معرف المستخدم (owner_nader للمالك)
   - `voice_id`: Voice ID (`6ZVgc4q9LWAloWbuwjuu`)
   - `is_owner`: 1 للمالك، 0 للعميل
   - `context`: السياق (JSON)

2. **conversation_messages:**
   - `id`: معرف الرسالة
   - `conversation_id`: معرف المحادثة
   - `role`: user أو assistant
   - `text`: نص الرسالة
   - `language`: اللغة
   - `dialect`: اللهجة

3. **user_commands:**
   - `id`: معرف الأمر
   - `conversation_id`: معرف المحادثة
   - `command`: نص الأمر
   - `status`: saved, executed, failed
   - `executed_at`: وقت التنفيذ

4. **agent_tool_calls:**
   - `id`: معرف الاستدعاء
   - `conversation_id`: معرف المحادثة
   - `tool_name`: اسم الـ Tool
   - `parameters`: المعاملات (JSON)
   - `result`: النتيجة (JSON)

---

## ✅ قائمة التحقق

- [ ] Voice ID: `6ZVgc4q9LWAloWbuwjuu` مضاف في `.env`
- [ ] Webhook Handler محدث
- [ ] Agent Service محدث
- [ ] Libraries موجودة
- [ ] قاعدة البيانات محدثة
- [ ] اختبار بدء المحادثة
- [ ] اختبار تنفيذ أمر
- [ ] اختبار التواصل في حالة مشكلة

---

## 🔗 الروابط

- **Webhook Endpoint:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Libraries API:** `https://api.zien-ai.app/api/libraries`
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل إعداد Agent للتعامل مع المالك وحفظ وتنفيذ أوامره

---

## ✅ Voice ID للمالك

**Voice ID:** `6ZVgc4q9LWAloWbuwjuu`

هذا هو Voice ID الخاص بك (Nader) والذي يستخدمه الـ Agent للتعرف عليك وحفظ وتنفيذ أوامرك.

---

## 🔧 الإعدادات المحدثة

### 1. Webhook Handler (`elevenlabs-webhook.js`):
- ✅ **التحقق من Voice ID:** عند بدء المحادثة، يتم التحقق من Voice ID
- ✅ **حفظ سياق المالك:** إذا كان Voice ID = `6ZVgc4q9LWAloWbuwjuu`، يتم حفظ السياق كمالك
- ✅ **تفعيل تنفيذ الأوامر:** جميع أوامر المالك يتم تنفيذها مباشرة
- ✅ **حفظ الأوامر:** جميع أوامر المالك يتم حفظها في قاعدة البيانات

### 2. Agent Service (`elevenLabsAgentService.js`):
- ✅ **Owner Context:** عند إنشاء محادثة، إذا كان Voice ID للمالك، يتم إضافة سياق خاص
- ✅ **Libraries Access:** المالك لديه وصول كامل للمكتبات (Templates, Systems, Themes)
- ✅ **Command Execution:** تفعيل تنفيذ الأوامر للمالك

### 3. Libraries:
- ✅ **appTemplatesLibrary.js:** مكتبة قوالب التطبيقات
- ✅ **systemsLibrary.js:** مكتبة الأنظمة
- ✅ **themesLibrary.js:** مكتبة الثيمات

---

## 📚 Knowledge Base للـ Agent

الـ Agent الآن يفهم:

### 1. **Libraries Structure:**
```javascript
// Templates Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  category: "string (e-commerce, social, business, etc.)",
  description: "string",
  features: ["array"],
  price: "number"
}

// Systems Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  category: "string (crm, erp, inventory, etc.)",
  description: "string",
  features: ["array"],
  price: "number"
}

// Themes Structure
{
  id: "string",
  name: "string (Arabic)",
  nameEn: "string (English)",
  primary: "string (color)",
  secondary: "string (color)",
  description: "string"
}
```

### 2. **API Endpoints:**
- `GET /api/libraries/templates` - جميع القوالب
- `GET /api/libraries/systems` - جميع الأنظمة
- `GET /api/libraries/themes` - جميع الثيمات
- `GET /api/libraries/search?q=query` - البحث في جميع المكتبات

### 3. **Tools المتاحة:**
- `preview_library` - معاينة المكتبات
- `search_library` - البحث في المكتبات
- `submit_to_builder` - إرسال طلب للبيلدر
- `create_payment` - إنشاء عملية دفع
- `send_twilio_message` - إرسال رسالة عبر Twilio
- `notify_owner` - إشعار المالك
- `execute_owner_command` - تنفيذ أمر المالك

---

## 🎯 كيفية استخدام Agent كمالك

### 1. **بدء المحادثة:**
- استخدم Voice ID: `6ZVgc4q9LWAloWbuwjuu`
- الـ Agent سيتعرف عليك تلقائياً كمالك

### 2. **الأوامر المتاحة:**

#### أ. **معاينة المكتبات:**
```
"أعرض لي القوالب المتاحة"
"Show me available templates"
"ما هي الأنظمة المتاحة؟"
"What systems are available?"
```

#### ب. **البحث في المكتبات:**
```
"ابحث عن تطبيق تجارة إلكترونية"
"Search for e-commerce app"
"أريد نظام إدارة علاقات العملاء"
"I need a CRM system"
```

#### ج. **إنشاء طلب بناء:**
```
"أنشئ طلب بناء لتطبيق تجارة إلكترونية"
"Create build request for e-commerce app"
"أريد بناء نظام إدارة المخزون"
"I want to build an inventory management system"
```

#### د. **إنشاء عملية دفع:**
```
"أنشئ عملية دفع بقيمة 1000 درهم"
"Create payment for 1000 AED"
"أريد دفع 500 دولار"
"I want to pay 500 USD"
```

#### ه. **إرسال رسالة:**
```
"أرسل رسالة للعميل محمد"
"Send message to client Mohamed"
"أرسل واتساب للعميل"
"Send WhatsApp to client"
```

#### و. **في حالة مشكلة:**
```
"لدي مشكلة في البيلدر"
"I have a problem with the builder"
"البيلدر لا يعمل"
"The builder is not working"
```

الـ Agent سيتواصل معك مباشرة عبر Twilio أو سيحفظ الأمر وينفذه.

---

## 🔄 تدفق العمل

### 1. **بدء المحادثة:**
```
User (Nader) → Voice ID: 6ZVgc4q9LWAloWbuwjuu
↓
Agent → يتحقق من Voice ID
↓
Agent → يحفظ السياق كمالك
↓
Agent → يفعل تنفيذ الأوامر
```

### 2. **تنفيذ أمر:**
```
User (Nader) → "أنشئ طلب بناء"
↓
Agent → يستدعي Tool: submit_to_builder
↓
Backend → ينفذ الأمر
↓
Backend → يرسل النتيجة للـ Agent
↓
Agent → يرد للمالك
```

### 3. **في حالة مشكلة:**
```
User (Nader) → "لدي مشكلة"
↓
Agent → يحفظ الأمر
↓
Agent → يستدعي Tool: notify_owner
↓
Backend → يرسل إشعار للمالك عبر Twilio
↓
Backend → يحفظ المشكلة في قاعدة البيانات
```

---

## 📊 قاعدة البيانات

### Tables المستخدمة:

1. **conversations:**
   - `id`: معرف المحادثة
   - `user_id`: معرف المستخدم (owner_nader للمالك)
   - `voice_id`: Voice ID (`6ZVgc4q9LWAloWbuwjuu`)
   - `is_owner`: 1 للمالك، 0 للعميل
   - `context`: السياق (JSON)

2. **conversation_messages:**
   - `id`: معرف الرسالة
   - `conversation_id`: معرف المحادثة
   - `role`: user أو assistant
   - `text`: نص الرسالة
   - `language`: اللغة
   - `dialect`: اللهجة

3. **user_commands:**
   - `id`: معرف الأمر
   - `conversation_id`: معرف المحادثة
   - `command`: نص الأمر
   - `status`: saved, executed, failed
   - `executed_at`: وقت التنفيذ

4. **agent_tool_calls:**
   - `id`: معرف الاستدعاء
   - `conversation_id`: معرف المحادثة
   - `tool_name`: اسم الـ Tool
   - `parameters`: المعاملات (JSON)
   - `result`: النتيجة (JSON)

---

## ✅ قائمة التحقق

- [ ] Voice ID: `6ZVgc4q9LWAloWbuwjuu` مضاف في `.env`
- [ ] Webhook Handler محدث
- [ ] Agent Service محدث
- [ ] Libraries موجودة
- [ ] قاعدة البيانات محدثة
- [ ] اختبار بدء المحادثة
- [ ] اختبار تنفيذ أمر
- [ ] اختبار التواصل في حالة مشكلة

---

## 🔗 الروابط

- **Webhook Endpoint:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- **Libraries API:** `https://api.zien-ai.app/api/libraries`
- **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`
- **Voice ID (Owner):** `6ZVgc4q9LWAloWbuwjuu`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

