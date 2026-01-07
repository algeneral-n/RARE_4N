# خطوات إعداد Webhook للـ ElevenLabs Agent
## دليل خطوة بخطوة

---

## ✅ الخطوة 1: التحقق من الكود

الكود جاهز بالفعل:
- ✅ `apps/backend/src/routes/elevenlabs-webhook.js` - موجود
- ✅ `apps/backend/src/server.js` - Route مسجل
- ✅ Database tables - جاهزة

---

## ✅ الخطوة 2: إضافة المفاتيح في Backend `.env`

افتح `apps/backend/.env` وأضف:

```bash
# ElevenLabs Webhook Secret
ELEVENLABS_WEBHOOK_SECRET=your_webhook_secret_here_123456789
```

**ملاحظة:** استخدم secret قوي (على الأقل 32 حرف)

---

## ✅ الخطوة 3: إعداد Webhook في ElevenLabs Dashboard

### 3.1. اذهب إلى ElevenLabs Dashboard

1. افتح: https://elevenlabs.io/app/convai/agents
2. سجل دخول بحسابك

### 3.2. اختر Agent

1. ابحث عن Agent: `agent_0701kc4axybpf6fvak70xwfzpyka`
2. اضغط عليه

### 3.3. إعداد Webhook

1. اذهب إلى **Settings** (أو **Configuration**)
2. ابحث عن **Webhooks** أو **Integrations**
3. اضغط **Add Webhook** أو **Configure Webhook**

### 3.4. أدخل معلومات Webhook

**Webhook URL:**
```
https://api.zien-ai.app/api/elevenlabs/webhook
```

**Webhook Secret:**
```
(نفس القيمة التي وضعتها في .env)
```

**Events (الأحداث):**
فعّل جميع الأحداث التالية:
- ✅ `conversation.started`
- ✅ `conversation.message`
- ✅ `conversation.ended`
- ✅ `agent.tool_call`
- ✅ `agent.action`

### 3.5. احفظ الإعدادات

1. اضغط **Save** أو **Update**
2. تأكد من أن Webhook **Active** أو **Enabled**

---

## ✅ الخطوة 4: اختبار Webhook

### 4.1. تشغيل Backend

```bash
cd apps/backend
npm start
# أو
pm2 start server.js
```

### 4.2. التحقق من الـ Route

افتح المتصفح واذهب إلى:
```
https://api.zien-ai.app/api/elevenlabs/webhook
```

يجب أن ترى:
- `404` أو `Method Not Allowed` (لأنه POST فقط)
- هذا يعني أن الـ Route يعمل ✅

### 4.3. اختبار من ElevenLabs

1. اذهب إلى Agent في ElevenLabs Dashboard
2. ابدأ محادثة تجريبية
3. تحقق من Backend logs:

```bash
# يجب أن ترى:
📥 ElevenLabs Webhook received: conversation.started
✅ Conversation started: conv_123
```

---

## ✅ الخطوة 5: إعداد Agent Context (اختياري)

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

---

## ✅ الخطوة 6: التحقق من قاعدة البيانات

### 6.1. تحقق من الجداول

الكود ينشئ الجداول تلقائياً عند بدء Backend:
- `conversations`
- `conversation_messages`
- `user_commands`
- `user_profiles`
- `agent_tool_calls`

### 6.2. تحقق من البيانات

بعد بدء محادثة، تحقق من قاعدة البيانات:

```sql
SELECT * FROM conversations ORDER BY started_at DESC LIMIT 10;
SELECT * FROM conversation_messages ORDER BY created_at DESC LIMIT 10;
```

---

## 🔍 استكشاف الأخطاء

### المشكلة: Webhook لا يستقبل الأحداث

**الحل:**
1. تحقق من أن Backend يعمل
2. تحقق من أن URL صحيح: `https://api.zien-ai.app/api/elevenlabs/webhook`
3. تحقق من أن Webhook **Active** في ElevenLabs Dashboard
4. تحقق من Backend logs

### المشكلة: Invalid signature

**الحل:**
1. تحقق من أن `ELEVENLABS_WEBHOOK_SECRET` في `.env` مطابق للـ Secret في ElevenLabs Dashboard
2. تأكد من عدم وجود مسافات إضافية

### المشكلة: Database error

**الحل:**
1. تحقق من أن قاعدة البيانات تعمل
2. تحقق من أن الجداول موجودة
3. تحقق من Backend logs للأخطاء

---

## 📋 قائمة التحقق النهائية

- [ ] أضفت `ELEVENLABS_WEBHOOK_SECRET` في `apps/backend/.env`
- [ ] أضفت Webhook URL في ElevenLabs Dashboard
- [ ] أضفت Webhook Secret في ElevenLabs Dashboard
- [ ] فعّلت جميع الأحداث في ElevenLabs Dashboard
- [ ] Backend يعمل بدون أخطاء
- [ ] اختبرت Webhook (بدأت محادثة تجريبية)
- [ ] تحققت من Backend logs (يجب أن ترى الأحداث)
- [ ] تحققت من قاعدة البيانات (يجب أن ترى البيانات)

---

## 🔗 الروابط المهمة

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Webhook Endpoint:** https://api.zien-ai.app/api/elevenlabs/webhook
- **Backend API:** https://api.zien-ai.app/api/elevenlabs

---

## 📝 ملاحظات

1. **Webhook Secret:** استخدم secret قوي (32+ حرف)
2. **HTTPS:** تأكد من أن Backend يستخدم HTTPS
3. **CORS:** Webhook لا يحتاج CORS (من ElevenLabs مباشرة)
4. **Logs:** راقب Backend logs للتأكد من استقبال الأحداث

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للتنفيذ

