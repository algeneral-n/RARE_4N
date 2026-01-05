# 🚀 Base44 - Client Portal Keys (Quick Reference)

## ⚠️ مهم: Client Portal فقط على Base44

### ✅ المفاتيح المطلوبة في Base44 Environment Variables:

```bash
# Supabase (Publishable Keys Only)
SUPABASE_URL=https://fgvrilruqzajstprioqj.supabase.co
SUPABASE_ANON_KEY=sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy

# Stripe (Publishable Key Only)
STRIPE_PUBLISHABLE_KEY=pk_test_... أو pk_live_...

# API Endpoint
API_URL=https://api.zien-ai.app
API_DOMAIN=https://api.zien-ai.app

# Frontend URLs
FRONTEND_URL=https://portal.zien-ai.app
CLIENT_PORTAL_URL=https://portal.zien-ai.app

# ElevenLabs (Agent ID - Non-secret)
ELEVENLABS_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka
ELEVENLABS_CONVAI_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka

# Monitoring (Optional)
SENTRY_DSN=https://...@sentry.io/...
```

---

## ❌ **لا تضع في Base44:**

- ❌ `STRIPE_SECRET_KEY`
- ❌ `SUPABASE_SERVICE_ROLE_KEY`
- ❌ `OPENAI_API_KEY`
- ❌ `ELEVENLABS_API_KEY`
- ❌ `MONGODB_URI`
- ❌ `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN`
- ❌ `JWT_SECRET`
- ❌ أي `SECRET` أو `PRIVATE KEY`

---

## 📝 **خطوات الإعداد:**

1. اذهب إلى Base44 Dashboard
2. افتح **Environment Variables** أو **Secrets**
3. أضف المفاتيح من القائمة أعلاه فقط
4. تأكد من أنك تضيف فقط **Publishable/Public Keys**

---

**ملاحظة:** للحصول على القيم الحقيقية، راجع `KEYS_SETUP_GUIDE.md`

