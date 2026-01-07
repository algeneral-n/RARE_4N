# إعداد ElevenLabs Agent - RARE 4N
## دليل شامل لإعداد Agent الصوتي في البورتال

---

## 📋 نظرة عامة

ElevenLabs Agent في Client Portal يدعم:
- ✅ **جميع اللغات واللهجات** (العربية بجميع لهجاتها، الإنجليزية، الفرنسية، إلخ)
- ✅ **ربط مع Twilio** لإرسال الرسائل للعملاء
- ✅ **حفظ الأوامر** في قاعدة البيانات
- ✅ **شخصية المستخدم** (User Profile) - على دراية بشخصية كل عميل
- ✅ **Webhook Integration** مع الباك اند

---

## 🔧 الإعداد في ElevenLabs Dashboard

### 1. إعداد Webhook URL

1. اذهب إلى: https://elevenlabs.io/app/convai/agents
2. اختر Agent الخاص بك: `agent_0701kc4axybpf6fvak70xwfzpyka`
3. اذهب إلى **Settings** → **Webhooks**
4. أضف Webhook URL:
   ```
   https://api.zien-ai.app/api/elevenlabs/webhook
   ```
5. أضف Webhook Secret (من `.env`):
   ```
   ELEVENLABS_WEBHOOK_SECRET=your_secret_here
   ```
6. فعّل الأحداث التالية:
   - ✅ `conversation.started`
   - ✅ `conversation.message`
   - ✅ `conversation.ended`
   - ✅ `agent.tool_call`
   - ✅ `agent.action`

### 2. إعداد Agent Context

في Agent Settings → Context، أضف:

```json
{
  "webhook_url": "https://api.zien-ai.app/api/elevenlabs/webhook",
  "supported_languages": ["ar", "en", "fr", "es", "de", "it", "pt", "ru", "zh", "ja", "ko"],
  "supported_dialects": {
    "ar": ["eg", "sa", "ae", "jo", "lb", "ma", "tn", "dz", "iq", "sy", "ye", "om", "kw", "qa", "bh"],
    "en": ["us", "uk", "au", "ca", "nz", "ie"],
    "es": ["es", "mx", "ar", "co", "cl", "pe", "ve"]
  },
  "twilio_enabled": true,
  "command_saving_enabled": true,
  "personality_awareness": true
}
```

### 3. إعداد Tools (اختياري)

يمكنك إضافة Tools للـ Agent:
- `send_twilio_message` - إرسال رسالة عبر Twilio
- `save_command` - حفظ أمر
- `execute_command` - تنفيذ أمر
- `get_user_profile` - الحصول على شخصية المستخدم

---

## 🔗 الربط مع الباك اند

### 1. Webhook Endpoint

الباك اند يستقبل الأحداث من ElevenLabs على:
```
POST /api/elevenlabs/webhook
```

### 2. الأحداث المستلمة

#### `conversation.started`
```json
{
  "event_type": "conversation.started",
  "data": {
    "conversation_id": "conv_123",
    "agent_id": "agent_0701kc4axybpf6fvak70xwfzpyka",
    "user_id": "user_123",
    "context": {
      "clientName": "عميل",
      "language": "ar",
      "dialect": "eg",
      "phone": "+201234567890"
    }
  }
}
```

#### `conversation.message`
```json
{
  "event_type": "conversation.message",
  "data": {
    "conversation_id": "conv_123",
    "message_id": "msg_123",
    "role": "user",
    "text": "مرحبا",
    "audio_url": "https://...",
    "language": "ar",
    "dialect": "eg",
    "sentiment": "positive",
    "intent": "greeting"
  }
}
```

#### `agent.action`
```json
{
  "event_type": "agent.action",
  "data": {
    "conversation_id": "conv_123",
    "action_type": "send_twilio_message",
    "action_data": {
      "phone": "+201234567890",
      "message": "مرحبا! كيف يمكنني مساعدتك؟"
    }
  }
}
```

---

## 💾 حفظ البيانات

### 1. Conversations Table

```sql
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  agent_id TEXT,
  user_id TEXT,
  context TEXT,
  status TEXT DEFAULT 'active',
  summary TEXT,
  started_at INTEGER,
  ended_at INTEGER
);
```

### 2. Conversation Messages Table

```sql
CREATE TABLE conversation_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT,
  role TEXT,
  text TEXT,
  audio_url TEXT,
  language TEXT DEFAULT 'ar',
  dialect TEXT,
  sentiment TEXT,
  intent TEXT,
  created_at INTEGER
);
```

### 3. User Commands Table

```sql
CREATE TABLE user_commands (
  id TEXT PRIMARY KEY,
  conversation_id TEXT,
  command TEXT,
  context TEXT,
  status TEXT DEFAULT 'saved',
  executed_at INTEGER,
  created_at INTEGER
);
```

### 4. User Profiles Table

```sql
CREATE TABLE user_profiles (
  user_id TEXT PRIMARY KEY,
  name TEXT,
  phone TEXT,
  email TEXT,
  language TEXT DEFAULT 'ar',
  dialect TEXT,
  personality_traits TEXT,
  preferences TEXT,
  commands_history TEXT,
  updated_at INTEGER
);
```

---

## 📱 استخدام Agent في Client Portal

### 1. استيراد ClientPortalAgent

```javascript
import { ClientPortalAgent } from './services/ClientPortalAgent.js';

const agent = new ClientPortalAgent();
await agent.init();
```

### 2. بدء محادثة

```javascript
await agent.startConversation({
  clientName: 'عميل',
  language: 'ar',
  dialect: 'eg', // لهجة مصرية
  phone: '+201234567890',
  email: 'client@example.com',
  userId: 'user_123'
});
```

### 3. إرسال رسالة

```javascript
await agent.sendMessage('مرحبا، أريد بناء تطبيق');
```

### 4. حفظ أمر

```javascript
await agent.saveCommand('احفظ: بناء تطبيق iOS', {
  language: 'ar',
  dialect: 'eg'
});
```

### 5. تنفيذ أمر

```javascript
await agent.executeCommand('نفذ: بناء التطبيق');
```

---

## 🔔 ربط مع Twilio

### 1. إرسال رسالة عبر Twilio

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

### 2. استقبال رسائل من Twilio

عندما يرسل العميل رسالة عبر WhatsApp:

```javascript
// في الباك اند (communication.js)
router.post('/twilio/webhook', async (req, res) => {
  const { From, Body } = req.body;
  
  // إرسال للـ Agent
  await agent.sendMessage(Body, {
    phone: From,
    language: 'ar'
  });
});
```

---

## 🌍 دعم اللغات واللهجات

### اللغات المدعومة:

- **العربية:** `ar` (مع اللهجات: `eg`, `sa`, `ae`, `jo`, `lb`, `ma`, `tn`, `dz`, `iq`, `sy`, `ye`, `om`, `kw`, `qa`, `bh`)
- **الإنجليزية:** `en` (مع اللهجات: `us`, `uk`, `au`, `ca`, `nz`, `ie`)
- **الفرنسية:** `fr`
- **الإسبانية:** `es` (مع اللهجات: `es`, `mx`, `ar`, `co`, `cl`, `pe`, `ve`)
- **الألمانية:** `de`
- **الإيطالية:** `it`
- **البرتغالية:** `pt`
- **الروسية:** `ru`
- **الصينية:** `zh`
- **اليابانية:** `ja`
- **الكورية:** `ko`

### استخدام اللهجات:

```javascript
await agent.startConversation({
  language: 'ar',
  dialect: 'eg' // لهجة مصرية
});
```

---

## 🎯 حفظ شخصية المستخدم

### 1. إنشاء User Profile

```javascript
// في الباك اند
const db = getDatabase();
const stmt = db.prepare(`
  INSERT INTO user_profiles (
    user_id, name, phone, email, language, dialect,
    personality_traits, preferences
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

stmt.run(
  userId,
  name,
  phone,
  email,
  'ar',
  'eg',
  JSON.stringify({
    friendly: true,
    professional: true,
    prefersVoice: true
  }),
  JSON.stringify({
    theme: 'dark',
    notifications: true
  })
);
```

### 2. استخدام User Profile في Agent

```javascript
// في elevenLabsAgentService.js
const userProfile = await getUserProfile(userId);

const conversationContext = {
  clientName: userProfile.name,
  language: userProfile.language,
  dialect: userProfile.dialect,
  personality: JSON.parse(userProfile.personality_traits),
  preferences: JSON.parse(userProfile.preferences)
};
```

---

## ✅ قائمة التحقق

- [ ] إعداد Webhook URL في ElevenLabs Dashboard
- [ ] إضافة `ELEVENLABS_WEBHOOK_SECRET` في `.env`
- [ ] تفعيل جميع الأحداث في Webhook
- [ ] إعداد Agent Context
- [ ] اختبار Webhook (استخدام ngrok للتطوير)
- [ ] ربط مع Twilio
- [ ] اختبار حفظ الأوامر
- [ ] اختبار حفظ شخصية المستخدم
- [ ] اختبار دعم اللغات واللهجات

---

## 🔗 الروابط المهمة

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Webhook Endpoint:** https://api.zien-ai.app/api/elevenlabs/webhook
- **Backend API:** https://api.zien-ai.app/api/elevenlabs
- **Client Portal Agent:** `apps/client-portal/services/ClientPortalAgent.js`

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

