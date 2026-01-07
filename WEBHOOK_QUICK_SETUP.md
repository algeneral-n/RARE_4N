# إعداد Webhook للـ ElevenLabs Agent - خطوات سريعة
## ⚡ دليل سريع خطوة بخطوة

---

## ✅ الخطوة 1: إضافة المفتاح في Backend

افتح `apps/backend/.env` وأضف:

```bash
ELEVENLABS_WEBHOOK_SECRET=rare4n_webhook_secret_2026_secure_key_123456789
```

**💡 نصيحة:** استخدم secret قوي (32+ حرف)

---

## ✅ الخطوة 2: إعداد Webhook في ElevenLabs

### 2.1. اذهب إلى:
https://elevenlabs.io/app/convai/agents

### 2.2. اختر Agent:
`agent_0701kc4axybpf6fvak70xwfzpyka`

### 2.3. Settings → Webhooks → Add Webhook

**Webhook URL:**
```
https://api.zien-ai.app/api/elevenlabs/webhook
```

**Webhook Secret:**
```
(نفس القيمة من .env)
```

**Events (فعّل جميعها):**
- ✅ `conversation.started`
- ✅ `conversation.message`
- ✅ `conversation.ended`
- ✅ `agent.tool_call`
- ✅ `agent.action`

### 2.4. Save

---

## ✅ الخطوة 3: اختبار

### 3.1. شغّل Backend:
```bash
cd apps/backend
npm start
```

### 3.2. ابدأ محادثة في ElevenLabs Agent

### 3.3. تحقق من Backend logs:
```
📥 ElevenLabs Webhook received: conversation.started
✅ Conversation started: conv_123
```

---

## ✅ الخطوة 4: التحقق من قاعدة البيانات

بعد بدء محادثة، تحقق:

```sql
SELECT * FROM conversations ORDER BY started_at DESC LIMIT 5;
SELECT * FROM conversation_messages ORDER BY created_at DESC LIMIT 5;
```

---

## 🔍 استكشاف الأخطاء

### ❌ Webhook لا يستقبل الأحداث:
1. تحقق من أن Backend يعمل
2. تحقق من URL: `https://api.zien-ai.app/api/elevenlabs/webhook`
3. تحقق من أن Webhook **Active** في ElevenLabs

### ❌ Invalid signature:
1. تحقق من أن `ELEVENLABS_WEBHOOK_SECRET` في `.env` مطابق للـ Secret في ElevenLabs
2. لا مسافات إضافية

### ❌ Database error:
1. تحقق من أن قاعدة البيانات تعمل
2. تحقق من Backend logs

---

## 📋 قائمة التحقق

- [ ] `ELEVENLABS_WEBHOOK_SECRET` في `.env`
- [ ] Webhook URL في ElevenLabs: `https://api.zien-ai.app/api/elevenlabs/webhook`
- [ ] Webhook Secret في ElevenLabs (نفس `.env`)
- [ ] جميع الأحداث مفعّلة
- [ ] Backend يعمل
- [ ] اختبرت محادثة
- [ ] تحققت من logs
- [ ] تحققت من قاعدة البيانات

---

## 🔗 الروابط

- **ElevenLabs Dashboard:** https://elevenlabs.io/app/convai/agents
- **Webhook Endpoint:** https://api.zien-ai.app/api/elevenlabs/webhook

---

**✅ جاهز!** بعد إتمام الخطوات، Webhook سيعمل تلقائياً.

