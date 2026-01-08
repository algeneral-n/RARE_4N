# 🚀 تشغيل جميع الخدمات - RARE 4N

## ✅ الحالة الحالية

### الخدمات النشطة:

1. **✅ Backend (rare4n-backend)**
   - الحالة: ✅ Online
   - Port: 5000
   - URL: http://localhost:5000
   - API: https://api.zien-ai.app

2. **✅ Cloudflare Tunnel (CF-MAESTRO)**
   - الحالة: ✅ Online
   - Tunnel: متصل ويعمل
   - Location: dxb02, sin07, sin15

3. **✅ MCP Agent (ElevenLabs)**
   - الحالة: ✅ متصل (من خلال ElevenLabs Dashboard)
   - Integration ID: `POISff1Do4B1q3oBd7EB`
   - MCP Server URL: `https://api.zien-ai.app/api/mcp`

4. **✅ Portal (Client Portal)**
   - الحالة: ✅ يعمل (من خلال Base44)
   - URL: https://portal.zien-ai.app

---

## 📋 أوامر التشغيل

### 1. تشغيل جميع الخدمات مع PM2:

```bash
cd C:\abo-zien
pm2 start ecosystem.config.js
```

### 2. تشغيل كل خدمة على حدة:

```bash
# Backend
pm2 start ecosystem.config.js --only rare4n-backend

# Cloudflare
pm2 start ecosystem.config.js --only CF-MAESTRO
```

### 3. إعادة تشغيل الخدمات:

```bash
# إعادة تشغيل جميع الخدمات
pm2 restart all

# إعادة تشغيل خدمة محددة
pm2 restart rare4n-backend
pm2 restart CF-MAESTRO
```

### 4. عرض الحالة:

```bash
# عرض حالة جميع الخدمات
pm2 status

# عرض Logs
pm2 logs

# عرض Logs لخدمة محددة
pm2 logs rare4n-backend
pm2 logs CF-MAESTRO
```

---

## 🔧 MCP Agent (ElevenLabs)

### ✅ الإعداد:

MCP Agent يعمل من خلال **ElevenLabs Dashboard** وليس من الكود المحلي:

1. **Integration ID:** `POISff1Do4B1q3oBd7EB`
2. **MCP Server URL:** `https://api.zien-ai.app/api/mcp`
3. **Agent ID:** `agent_0701kc4axybpf6fvak70xwfzpyka`

### التحقق من الاتصال:

- اذهب إلى [ElevenLabs Dashboard](https://elevenlabs.io/app/agents)
- تحقق من Agent Status
- تحقق من MCP Server Connection

---

## 🌐 Portal (Client Portal)

### ✅ الإعداد:

Portal يعمل من خلال **Base44**:

1. **URL:** https://portal.zien-ai.app
2. **Environment Variables:** موجودة في Base44 Dashboard
3. **Backend API Key:** `HEADRAREBACK1END0097100201141009563`

### التحقق:

- افتح: https://portal.zien-ai.app
- تحقق من أن التطبيق يعمل
- تحقق من الترجمة (Google Translate)

---

## 📊 مراقبة الخدمات

### PM2 Monitor:

```bash
pm2 monit
```

### Health Check:

```bash
# Backend Health
curl http://localhost:5000/api/health

# أو من المتصفح
http://localhost:5000/api/health
```

---

## ⚠️ ملاحظات مهمة

1. **Backend** يجب أن يعمل على Port 5000
2. **Cloudflare Tunnel** يحتاج `CLOUDFLARE_TUNNEL_TOKEN` في `.env`
3. **MCP Agent** يعمل من ElevenLabs Dashboard (ليس محلياً)
4. **Portal** يعمل من Base44 (ليس محلياً)

---

## 🔗 الروابط

- **Backend Local:** http://localhost:5000
- **Backend API:** https://api.zien-ai.app
- **Portal:** https://portal.zien-ai.app
- **ElevenLabs Dashboard:** https://elevenlabs.io/app/agents
- **PM2 Docs:** https://pm2.keymetrics.io

---

**آخر تحديث:** 2025-01-XX  
**الحالة:** ✅ جميع الخدمات تعمل

