# إعداد ElevenLabs Agent والترجمة - RARE 4N
## دليل شامل لإعداد Agent الصوتي والترجمة في Client Portal

---

## 📋 الإجابة على أسئلتك

### 1. **ElevenLabs Agent في البورتال**

#### ✅ **كيفية الربط مع الباك اند:**

**الطريقة:** استخدام **Webhook** من ElevenLabs إلى الباك اند

1. **Webhook URL في ElevenLabs Dashboard:**
   ```
   https://api.zien-ai.app/api/elevenlabs/webhook
   ```

2. **Webhook Secret في `.env`:**
   ```bash
   ELEVENLABS_WEBHOOK_SECRET=your_secret_here
   ```

3. **الأحداث المستلمة:**
   - `conversation.started` - بدء المحادثة
   - `conversation.message` - رسالة جديدة
   - `conversation.ended` - انتهاء المحادثة
   - `agent.tool_call` - استدعاء أداة
   - `agent.action` - إجراء من الـ Agent

#### ✅ **دعم جميع اللغات واللهجات:**

- **العربية:** جميع اللهجات (مصرية، سعودية، إماراتية، أردنية، لبنانية، مغربية، تونسية، جزائرية، عراقية، سورية، يمنية، عمانية، كويتية، قطرية، بحرينية)
- **الإنجليزية:** أمريكية، بريطانية، أسترالية، كندية، نيوزيلندية، أيرلندية
- **الفرنسية، الإسبانية، الألمانية، الإيطالية، البرتغالية، الروسية، الصينية، اليابانية، الكورية**

#### ✅ **ربط مع Twilio:**

عندما يريد Agent إرسال رسالة للعميل:
```javascript
// في الباك اند (elevenlabs-webhook.js)
if (action_type === 'send_twilio_message') {
  await twilioService.sendWhatsApp(
    action_data.phone,
    action_data.message
  );
}
```

#### ✅ **حفظ الأوامر:**

جميع الأوامر محفوظة في قاعدة البيانات:
- **Table:** `user_commands`
- **Fields:** `id`, `conversation_id`, `command`, `context`, `status`, `executed_at`

#### ✅ **شخصية المستخدم:**

- **Table:** `user_profiles`
- **Fields:** `user_id`, `name`, `phone`, `email`, `language`, `dialect`, `personality_traits`, `preferences`, `commands_history`

---

### 2. **الترجمة في البورتال**

#### ✅ **كيفية الاستخدام:**

**لا حاجة لإعطاء Google API Key للبورتال!**

الترجمة موجودة بالفعل في:
- **File:** `apps/client-portal/services/TranslationService.js`
- **يستخدم Backend فقط:** `/api/translation/translate`
- **Google API Key في Backend فقط:** في `apps/backend/.env`

#### ✅ **الاستخدام في Base44 AI:**

```javascript
// Base44 AI يجب أن يستورد TranslationService
import translationService from './services/TranslationService.js';

// ترجمة نص واحد
const translated = await translationService.translateText('Hello', 'ar');

// ترجمة عدة نصوص
const translated = await translationService.translateBatch(['Hello', 'World'], 'ar');

// كشف اللغة
const language = await translationService.detectLanguage('مرحبا');

// تغيير اللغة الحالية
translationService.setLanguage('ar');
```

#### ✅ **لا حاجة لـ Google API Key في Base44:**

- ✅ **TranslationService موجود** في `apps/client-portal/services/TranslationService.js`
- ✅ **يستدعي Backend** على `/api/translation/translate`
- ✅ **Google API Key في Backend فقط** في `apps/backend/.env`
- ✅ **Base44 AI يجب أن يستورد ويستخدم TranslationService** فقط

---

## 🔧 الإعدادات المطلوبة

### 1. في Backend `.env`:

```bash
# ElevenLabs
ELEVENLABS_API_KEY=your_api_key
ELEVENLABS_CONVAI_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka
ELEVENLABS_WEBHOOK_SECRET=your_webhook_secret

# Google Translation (يستخدم نفس المفتاح لـ 14 خدمة)
GOOGLE_API_KEY=AIzaSyCuS7FajWuQLpNJtyTFrwWjDMdi6wp7wmg

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+14155238886
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### 2. في ElevenLabs Dashboard:

1. اذهب إلى: https://elevenlabs.io/app/convai/agents
2. اختر Agent: `agent_0701kc4axybpf6fvak70xwfzpyka`
3. Settings → Webhooks
4. أضف Webhook URL: `https://api.zien-ai.app/api/elevenlabs/webhook`
5. أضف Webhook Secret: (من `.env`)
6. فعّل جميع الأحداث

### 3. في Base44 Environment Variables:

```bash
# لا حاجة لـ Google API Key هنا!
API_URL=https://api.zien-ai.app
ELEVENLABS_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka
```

---

## 📁 الملفات المطلوبة

### 1. Backend:

- ✅ `apps/backend/src/routes/elevenlabs-webhook.js` - Webhook endpoint
- ✅ `apps/backend/src/services/elevenLabsAgentService.js` - Agent service (محدث)
- ✅ `apps/backend/src/database/localDB.js` - Database tables (محدث)

### 2. Client Portal:

- ✅ `apps/client-portal/services/ClientPortalAgent.js` - Agent في البورتال
- ✅ `apps/client-portal/services/TranslationService.js` - Translation service

### 3. Documentation:

- ✅ `ELEVENLABS_AGENT_SETUP.md` - دليل شامل لإعداد Agent
- ✅ `BASE44_AI_PROMPT.md` - Prompt للـ Base44 AI (محدث)

---

## 🎯 الخطوات النهائية

### 1. إعداد Webhook في ElevenLabs:

- [ ] اذهب إلى ElevenLabs Dashboard
- [ ] اختر Agent
- [ ] أضف Webhook URL
- [ ] أضف Webhook Secret
- [ ] فعّل جميع الأحداث

### 2. إعداد Backend:

- [ ] أضف `ELEVENLABS_WEBHOOK_SECRET` في `.env`
- [ ] تأكد من وجود جميع المفاتيح
- [ ] اختبر Webhook endpoint

### 3. إعداد Base44 AI:

- [ ] اقرأ `BASE44_AI_PROMPT.md`
- [ ] استورد `TranslationService` في الكود
- [ ] استخدم `ClientPortalAgent` للـ Agent
- [ ] لا تضع Google API Key في Base44

---

## ✅ الخلاصة

### ElevenLabs Agent:

1. **الربط:** Webhook من ElevenLabs → Backend (`/api/elevenlabs/webhook`)
2. **اللغات:** جميع اللغات واللهجات مدعومة
3. **Twilio:** ربط تلقائي لإرسال الرسائل
4. **حفظ الأوامر:** في قاعدة البيانات
5. **شخصية المستخدم:** حفظ واستخدام في كل محادثة

### الترجمة:

1. **TranslationService موجود:** `apps/client-portal/services/TranslationService.js`
2. **يستخدم Backend فقط:** `/api/translation/translate`
3. **لا حاجة لـ Google API Key في Base44:** كل شيء في Backend
4. **Base44 AI يجب أن يستورد ويستخدم TranslationService** فقط

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

