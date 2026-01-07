# إعداد Stripe Webhook - RARE 4N
## دليل إعداد Stripe Webhook للبورتال والـ Backend

---

## ✅ Stripe Webhook Secrets

لديك **2 Webhook Destinations** في Stripe:

### 1. Snapshot (الأهم - 221 events)
- **Destination:** `rare_4n_stripe_snapshot`
- **URL:** `https://api.zien-ai.app/api/payment/webhook`
- **API Version:** `2025-11-17.clover`
- **Payload Style:** `Snapshot`
- **Events:** 221 events
- **Signing Secret:** `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`

### 2. Thin (3 events)
- **Destination:** `inspiring-glow-thin`
- **URL:** `https://api.zien-ai.app/api/payment/webhook`
- **API Version:** `Unversioned`
- **Payload Style:** `Thin`
- **Events:** 3 events
- **Signing Secret:** `whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A`

---

## ✅ المفاتيح في .env

تم إضافة المفاتيح التالية في `apps/backend/.env.TEMPLATE`:

```bash
# Stripe Webhook Secrets
STRIPE_WEBHOOK_SECRET=whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm
STRIPE_WEBHOOK_SECRET_SNAPSHOT=whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm
STRIPE_WEBHOOK_SECRET_THIN=whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A
```

---

## ✅ الكود في Backend

الكود في `apps/backend/src/routes/payment.js` يستخدم `STRIPE_WEBHOOK_SECRET` بشكل صحيح:

```javascript
// Payment Webhook (Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const stripe = await getStripeClient();
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    try {
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        // In development, parse without verification
        event = JSON.parse(req.body.toString());
        console.warn('⚠️ Stripe webhook signature verification skipped (STRIPE_WEBHOOK_SECRET not set)');
      }
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle events...
    if (event.type === 'payment_intent.succeeded') {
      // Process payment...
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});
```

---

## ✅ إعداد Webhook في Stripe Dashboard

### الخطوات:

1. **اذهب إلى Stripe Dashboard:**
   - https://dashboard.stripe.com/webhooks

2. **تحقق من Webhook Destinations:**
   - ✅ `rare_4n_stripe_snapshot` → `https://api.zien-ai.app/api/payment/webhook`
   - ✅ `inspiring-glow-thin` → `https://api.zien-ai.app/api/payment/webhook`

3. **تحقق من Events:**
   - Snapshot: 221 events (جميع الأحداث المهمة)
   - Thin: 3 events (أحداث محددة)

4. **تحقق من Signing Secret:**
   - Snapshot: `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`
   - Thin: `whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A`

---

## ✅ اختبار Webhook

### 1. اختبار من Stripe Dashboard:

1. اذهب إلى: https://dashboard.stripe.com/webhooks
2. اختر Webhook Destination
3. اضغط **"Send test webhook"**
4. اختر Event Type (مثل `payment_intent.succeeded`)
5. اضغط **"Send test webhook"**

### 2. التحقق من Backend Logs:

```bash
# يجب أن ترى:
📥 Stripe Webhook received: payment_intent.succeeded
✅ Payment processed successfully
```

### 3. اختبار من Client Portal:

1. اذهب إلى Client Portal
2. قم بعملية دفع تجريبية
3. تحقق من Backend logs
4. تحقق من Stripe Dashboard → Events

---

## ✅ Events المهمة

### Snapshot (221 events):
- `payment_intent.succeeded` - ✅ معالج في الكود
- `payment_intent.payment_failed`
- `charge.succeeded`
- `charge.failed`
- `customer.created`
- `customer.updated`
- `subscription.created`
- `subscription.updated`
- `subscription.deleted`
- وغيرها...

### Thin (3 events):
- أحداث محددة حسب الحاجة

---

## ✅ التحقق من الاستيراد

### في Backend:
- ✅ `apps/backend/src/routes/payment.js` - يستخدم `process.env.STRIPE_WEBHOOK_SECRET`
- ✅ `apps/backend/src/services/paymentservice.js` - يستخدم `process.env.STRIPE_SECRET_KEY`

### في Client Portal:
- ✅ `apps/client-portal/services/PaymentService.js` - يستخدم `STRIPE_PUBLISHABLE_KEY` (من Base44 Environment Variables)
- ✅ جميع الطلبات تذهب للباك اند

---

## ✅ قائمة التحقق

- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env`
- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env.TEMPLATE`
- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env.example`
- [ ] Webhook URL في Stripe: `https://api.zien-ai.app/api/payment/webhook`
- [ ] Webhook Secret في Stripe: `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`
- [ ] Backend يعمل
- [ ] اختبر Webhook من Stripe Dashboard
- [ ] تحققت من Backend logs
- [ ] اختبر عملية دفع من Client Portal

---

## 🔗 الروابط

- **Stripe Dashboard:** https://dashboard.stripe.com/webhooks
- **Webhook Endpoint:** https://api.zien-ai.app/api/payment/webhook
- **Backend API:** https://api.zien-ai.app/api/payment

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل إعداد Stripe Webhook للبورتال والـ Backend

---

## ✅ Stripe Webhook Secrets

لديك **2 Webhook Destinations** في Stripe:

### 1. Snapshot (الأهم - 221 events)
- **Destination:** `rare_4n_stripe_snapshot`
- **URL:** `https://api.zien-ai.app/api/payment/webhook`
- **API Version:** `2025-11-17.clover`
- **Payload Style:** `Snapshot`
- **Events:** 221 events
- **Signing Secret:** `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`

### 2. Thin (3 events)
- **Destination:** `inspiring-glow-thin`
- **URL:** `https://api.zien-ai.app/api/payment/webhook`
- **API Version:** `Unversioned`
- **Payload Style:** `Thin`
- **Events:** 3 events
- **Signing Secret:** `whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A`

---

## ✅ المفاتيح في .env

تم إضافة المفاتيح التالية في `apps/backend/.env.TEMPLATE`:

```bash
# Stripe Webhook Secrets
STRIPE_WEBHOOK_SECRET=whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm
STRIPE_WEBHOOK_SECRET_SNAPSHOT=whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm
STRIPE_WEBHOOK_SECRET_THIN=whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A
```

---

## ✅ الكود في Backend

الكود في `apps/backend/src/routes/payment.js` يستخدم `STRIPE_WEBHOOK_SECRET` بشكل صحيح:

```javascript
// Payment Webhook (Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const stripe = await getStripeClient();
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    try {
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        // In development, parse without verification
        event = JSON.parse(req.body.toString());
        console.warn('⚠️ Stripe webhook signature verification skipped (STRIPE_WEBHOOK_SECRET not set)');
      }
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle events...
    if (event.type === 'payment_intent.succeeded') {
      // Process payment...
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});
```

---

## ✅ إعداد Webhook في Stripe Dashboard

### الخطوات:

1. **اذهب إلى Stripe Dashboard:**
   - https://dashboard.stripe.com/webhooks

2. **تحقق من Webhook Destinations:**
   - ✅ `rare_4n_stripe_snapshot` → `https://api.zien-ai.app/api/payment/webhook`
   - ✅ `inspiring-glow-thin` → `https://api.zien-ai.app/api/payment/webhook`

3. **تحقق من Events:**
   - Snapshot: 221 events (جميع الأحداث المهمة)
   - Thin: 3 events (أحداث محددة)

4. **تحقق من Signing Secret:**
   - Snapshot: `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`
   - Thin: `whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A`

---

## ✅ اختبار Webhook

### 1. اختبار من Stripe Dashboard:

1. اذهب إلى: https://dashboard.stripe.com/webhooks
2. اختر Webhook Destination
3. اضغط **"Send test webhook"**
4. اختر Event Type (مثل `payment_intent.succeeded`)
5. اضغط **"Send test webhook"**

### 2. التحقق من Backend Logs:

```bash
# يجب أن ترى:
📥 Stripe Webhook received: payment_intent.succeeded
✅ Payment processed successfully
```

### 3. اختبار من Client Portal:

1. اذهب إلى Client Portal
2. قم بعملية دفع تجريبية
3. تحقق من Backend logs
4. تحقق من Stripe Dashboard → Events

---

## ✅ Events المهمة

### Snapshot (221 events):
- `payment_intent.succeeded` - ✅ معالج في الكود
- `payment_intent.payment_failed`
- `charge.succeeded`
- `charge.failed`
- `customer.created`
- `customer.updated`
- `subscription.created`
- `subscription.updated`
- `subscription.deleted`
- وغيرها...

### Thin (3 events):
- أحداث محددة حسب الحاجة

---

## ✅ التحقق من الاستيراد

### في Backend:
- ✅ `apps/backend/src/routes/payment.js` - يستخدم `process.env.STRIPE_WEBHOOK_SECRET`
- ✅ `apps/backend/src/services/paymentservice.js` - يستخدم `process.env.STRIPE_SECRET_KEY`

### في Client Portal:
- ✅ `apps/client-portal/services/PaymentService.js` - يستخدم `STRIPE_PUBLISHABLE_KEY` (من Base44 Environment Variables)
- ✅ جميع الطلبات تذهب للباك اند

---

## ✅ قائمة التحقق

- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env`
- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env.TEMPLATE`
- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env.example`
- [ ] Webhook URL في Stripe: `https://api.zien-ai.app/api/payment/webhook`
- [ ] Webhook Secret في Stripe: `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`
- [ ] Backend يعمل
- [ ] اختبر Webhook من Stripe Dashboard
- [ ] تحققت من Backend logs
- [ ] اختبر عملية دفع من Client Portal

---

## 🔗 الروابط

- **Stripe Dashboard:** https://dashboard.stripe.com/webhooks
- **Webhook Endpoint:** https://api.zien-ai.app/api/payment/webhook
- **Backend API:** https://api.zien-ai.app/api/payment

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل إعداد Stripe Webhook للبورتال والـ Backend

---

## ✅ Stripe Webhook Secrets

لديك **2 Webhook Destinations** في Stripe:

### 1. Snapshot (الأهم - 221 events)
- **Destination:** `rare_4n_stripe_snapshot`
- **URL:** `https://api.zien-ai.app/api/payment/webhook`
- **API Version:** `2025-11-17.clover`
- **Payload Style:** `Snapshot`
- **Events:** 221 events
- **Signing Secret:** `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`

### 2. Thin (3 events)
- **Destination:** `inspiring-glow-thin`
- **URL:** `https://api.zien-ai.app/api/payment/webhook`
- **API Version:** `Unversioned`
- **Payload Style:** `Thin`
- **Events:** 3 events
- **Signing Secret:** `whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A`

---

## ✅ المفاتيح في .env

تم إضافة المفاتيح التالية في `apps/backend/.env.TEMPLATE`:

```bash
# Stripe Webhook Secrets
STRIPE_WEBHOOK_SECRET=whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm
STRIPE_WEBHOOK_SECRET_SNAPSHOT=whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm
STRIPE_WEBHOOK_SECRET_THIN=whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A
```

---

## ✅ الكود في Backend

الكود في `apps/backend/src/routes/payment.js` يستخدم `STRIPE_WEBHOOK_SECRET` بشكل صحيح:

```javascript
// Payment Webhook (Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const stripe = await getStripeClient();
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    try {
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        // In development, parse without verification
        event = JSON.parse(req.body.toString());
        console.warn('⚠️ Stripe webhook signature verification skipped (STRIPE_WEBHOOK_SECRET not set)');
      }
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle events...
    if (event.type === 'payment_intent.succeeded') {
      // Process payment...
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});
```

---

## ✅ إعداد Webhook في Stripe Dashboard

### الخطوات:

1. **اذهب إلى Stripe Dashboard:**
   - https://dashboard.stripe.com/webhooks

2. **تحقق من Webhook Destinations:**
   - ✅ `rare_4n_stripe_snapshot` → `https://api.zien-ai.app/api/payment/webhook`
   - ✅ `inspiring-glow-thin` → `https://api.zien-ai.app/api/payment/webhook`

3. **تحقق من Events:**
   - Snapshot: 221 events (جميع الأحداث المهمة)
   - Thin: 3 events (أحداث محددة)

4. **تحقق من Signing Secret:**
   - Snapshot: `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`
   - Thin: `whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A`

---

## ✅ اختبار Webhook

### 1. اختبار من Stripe Dashboard:

1. اذهب إلى: https://dashboard.stripe.com/webhooks
2. اختر Webhook Destination
3. اضغط **"Send test webhook"**
4. اختر Event Type (مثل `payment_intent.succeeded`)
5. اضغط **"Send test webhook"**

### 2. التحقق من Backend Logs:

```bash
# يجب أن ترى:
📥 Stripe Webhook received: payment_intent.succeeded
✅ Payment processed successfully
```

### 3. اختبار من Client Portal:

1. اذهب إلى Client Portal
2. قم بعملية دفع تجريبية
3. تحقق من Backend logs
4. تحقق من Stripe Dashboard → Events

---

## ✅ Events المهمة

### Snapshot (221 events):
- `payment_intent.succeeded` - ✅ معالج في الكود
- `payment_intent.payment_failed`
- `charge.succeeded`
- `charge.failed`
- `customer.created`
- `customer.updated`
- `subscription.created`
- `subscription.updated`
- `subscription.deleted`
- وغيرها...

### Thin (3 events):
- أحداث محددة حسب الحاجة

---

## ✅ التحقق من الاستيراد

### في Backend:
- ✅ `apps/backend/src/routes/payment.js` - يستخدم `process.env.STRIPE_WEBHOOK_SECRET`
- ✅ `apps/backend/src/services/paymentservice.js` - يستخدم `process.env.STRIPE_SECRET_KEY`

### في Client Portal:
- ✅ `apps/client-portal/services/PaymentService.js` - يستخدم `STRIPE_PUBLISHABLE_KEY` (من Base44 Environment Variables)
- ✅ جميع الطلبات تذهب للباك اند

---

## ✅ قائمة التحقق

- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env`
- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env.TEMPLATE`
- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env.example`
- [ ] Webhook URL في Stripe: `https://api.zien-ai.app/api/payment/webhook`
- [ ] Webhook Secret في Stripe: `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`
- [ ] Backend يعمل
- [ ] اختبر Webhook من Stripe Dashboard
- [ ] تحققت من Backend logs
- [ ] اختبر عملية دفع من Client Portal

---

## 🔗 الروابط

- **Stripe Dashboard:** https://dashboard.stripe.com/webhooks
- **Webhook Endpoint:** https://api.zien-ai.app/api/payment/webhook
- **Backend API:** https://api.zien-ai.app/api/payment

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل إعداد Stripe Webhook للبورتال والـ Backend

---

## ✅ Stripe Webhook Secrets

لديك **2 Webhook Destinations** في Stripe:

### 1. Snapshot (الأهم - 221 events)
- **Destination:** `rare_4n_stripe_snapshot`
- **URL:** `https://api.zien-ai.app/api/payment/webhook`
- **API Version:** `2025-11-17.clover`
- **Payload Style:** `Snapshot`
- **Events:** 221 events
- **Signing Secret:** `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`

### 2. Thin (3 events)
- **Destination:** `inspiring-glow-thin`
- **URL:** `https://api.zien-ai.app/api/payment/webhook`
- **API Version:** `Unversioned`
- **Payload Style:** `Thin`
- **Events:** 3 events
- **Signing Secret:** `whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A`

---

## ✅ المفاتيح في .env

تم إضافة المفاتيح التالية في `apps/backend/.env.TEMPLATE`:

```bash
# Stripe Webhook Secrets
STRIPE_WEBHOOK_SECRET=whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm
STRIPE_WEBHOOK_SECRET_SNAPSHOT=whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm
STRIPE_WEBHOOK_SECRET_THIN=whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A
```

---

## ✅ الكود في Backend

الكود في `apps/backend/src/routes/payment.js` يستخدم `STRIPE_WEBHOOK_SECRET` بشكل صحيح:

```javascript
// Payment Webhook (Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const stripe = await getStripeClient();
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    try {
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        // In development, parse without verification
        event = JSON.parse(req.body.toString());
        console.warn('⚠️ Stripe webhook signature verification skipped (STRIPE_WEBHOOK_SECRET not set)');
      }
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle events...
    if (event.type === 'payment_intent.succeeded') {
      // Process payment...
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});
```

---

## ✅ إعداد Webhook في Stripe Dashboard

### الخطوات:

1. **اذهب إلى Stripe Dashboard:**
   - https://dashboard.stripe.com/webhooks

2. **تحقق من Webhook Destinations:**
   - ✅ `rare_4n_stripe_snapshot` → `https://api.zien-ai.app/api/payment/webhook`
   - ✅ `inspiring-glow-thin` → `https://api.zien-ai.app/api/payment/webhook`

3. **تحقق من Events:**
   - Snapshot: 221 events (جميع الأحداث المهمة)
   - Thin: 3 events (أحداث محددة)

4. **تحقق من Signing Secret:**
   - Snapshot: `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`
   - Thin: `whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A`

---

## ✅ اختبار Webhook

### 1. اختبار من Stripe Dashboard:

1. اذهب إلى: https://dashboard.stripe.com/webhooks
2. اختر Webhook Destination
3. اضغط **"Send test webhook"**
4. اختر Event Type (مثل `payment_intent.succeeded`)
5. اضغط **"Send test webhook"**

### 2. التحقق من Backend Logs:

```bash
# يجب أن ترى:
📥 Stripe Webhook received: payment_intent.succeeded
✅ Payment processed successfully
```

### 3. اختبار من Client Portal:

1. اذهب إلى Client Portal
2. قم بعملية دفع تجريبية
3. تحقق من Backend logs
4. تحقق من Stripe Dashboard → Events

---

## ✅ Events المهمة

### Snapshot (221 events):
- `payment_intent.succeeded` - ✅ معالج في الكود
- `payment_intent.payment_failed`
- `charge.succeeded`
- `charge.failed`
- `customer.created`
- `customer.updated`
- `subscription.created`
- `subscription.updated`
- `subscription.deleted`
- وغيرها...

### Thin (3 events):
- أحداث محددة حسب الحاجة

---

## ✅ التحقق من الاستيراد

### في Backend:
- ✅ `apps/backend/src/routes/payment.js` - يستخدم `process.env.STRIPE_WEBHOOK_SECRET`
- ✅ `apps/backend/src/services/paymentservice.js` - يستخدم `process.env.STRIPE_SECRET_KEY`

### في Client Portal:
- ✅ `apps/client-portal/services/PaymentService.js` - يستخدم `STRIPE_PUBLISHABLE_KEY` (من Base44 Environment Variables)
- ✅ جميع الطلبات تذهب للباك اند

---

## ✅ قائمة التحقق

- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env`
- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env.TEMPLATE`
- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env.example`
- [ ] Webhook URL في Stripe: `https://api.zien-ai.app/api/payment/webhook`
- [ ] Webhook Secret في Stripe: `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`
- [ ] Backend يعمل
- [ ] اختبر Webhook من Stripe Dashboard
- [ ] تحققت من Backend logs
- [ ] اختبر عملية دفع من Client Portal

---

## 🔗 الروابط

- **Stripe Dashboard:** https://dashboard.stripe.com/webhooks
- **Webhook Endpoint:** https://api.zien-ai.app/api/payment/webhook
- **Backend API:** https://api.zien-ai.app/api/payment

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل إعداد Stripe Webhook للبورتال والـ Backend

---

## ✅ Stripe Webhook Secrets

لديك **2 Webhook Destinations** في Stripe:

### 1. Snapshot (الأهم - 221 events)
- **Destination:** `rare_4n_stripe_snapshot`
- **URL:** `https://api.zien-ai.app/api/payment/webhook`
- **API Version:** `2025-11-17.clover`
- **Payload Style:** `Snapshot`
- **Events:** 221 events
- **Signing Secret:** `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`

### 2. Thin (3 events)
- **Destination:** `inspiring-glow-thin`
- **URL:** `https://api.zien-ai.app/api/payment/webhook`
- **API Version:** `Unversioned`
- **Payload Style:** `Thin`
- **Events:** 3 events
- **Signing Secret:** `whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A`

---

## ✅ المفاتيح في .env

تم إضافة المفاتيح التالية في `apps/backend/.env.TEMPLATE`:

```bash
# Stripe Webhook Secrets
STRIPE_WEBHOOK_SECRET=whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm
STRIPE_WEBHOOK_SECRET_SNAPSHOT=whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm
STRIPE_WEBHOOK_SECRET_THIN=whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A
```

---

## ✅ الكود في Backend

الكود في `apps/backend/src/routes/payment.js` يستخدم `STRIPE_WEBHOOK_SECRET` بشكل صحيح:

```javascript
// Payment Webhook (Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const stripe = await getStripeClient();
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    try {
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        // In development, parse without verification
        event = JSON.parse(req.body.toString());
        console.warn('⚠️ Stripe webhook signature verification skipped (STRIPE_WEBHOOK_SECRET not set)');
      }
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle events...
    if (event.type === 'payment_intent.succeeded') {
      // Process payment...
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});
```

---

## ✅ إعداد Webhook في Stripe Dashboard

### الخطوات:

1. **اذهب إلى Stripe Dashboard:**
   - https://dashboard.stripe.com/webhooks

2. **تحقق من Webhook Destinations:**
   - ✅ `rare_4n_stripe_snapshot` → `https://api.zien-ai.app/api/payment/webhook`
   - ✅ `inspiring-glow-thin` → `https://api.zien-ai.app/api/payment/webhook`

3. **تحقق من Events:**
   - Snapshot: 221 events (جميع الأحداث المهمة)
   - Thin: 3 events (أحداث محددة)

4. **تحقق من Signing Secret:**
   - Snapshot: `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`
   - Thin: `whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A`

---

## ✅ اختبار Webhook

### 1. اختبار من Stripe Dashboard:

1. اذهب إلى: https://dashboard.stripe.com/webhooks
2. اختر Webhook Destination
3. اضغط **"Send test webhook"**
4. اختر Event Type (مثل `payment_intent.succeeded`)
5. اضغط **"Send test webhook"**

### 2. التحقق من Backend Logs:

```bash
# يجب أن ترى:
📥 Stripe Webhook received: payment_intent.succeeded
✅ Payment processed successfully
```

### 3. اختبار من Client Portal:

1. اذهب إلى Client Portal
2. قم بعملية دفع تجريبية
3. تحقق من Backend logs
4. تحقق من Stripe Dashboard → Events

---

## ✅ Events المهمة

### Snapshot (221 events):
- `payment_intent.succeeded` - ✅ معالج في الكود
- `payment_intent.payment_failed`
- `charge.succeeded`
- `charge.failed`
- `customer.created`
- `customer.updated`
- `subscription.created`
- `subscription.updated`
- `subscription.deleted`
- وغيرها...

### Thin (3 events):
- أحداث محددة حسب الحاجة

---

## ✅ التحقق من الاستيراد

### في Backend:
- ✅ `apps/backend/src/routes/payment.js` - يستخدم `process.env.STRIPE_WEBHOOK_SECRET`
- ✅ `apps/backend/src/services/paymentservice.js` - يستخدم `process.env.STRIPE_SECRET_KEY`

### في Client Portal:
- ✅ `apps/client-portal/services/PaymentService.js` - يستخدم `STRIPE_PUBLISHABLE_KEY` (من Base44 Environment Variables)
- ✅ جميع الطلبات تذهب للباك اند

---

## ✅ قائمة التحقق

- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env`
- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env.TEMPLATE`
- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env.example`
- [ ] Webhook URL في Stripe: `https://api.zien-ai.app/api/payment/webhook`
- [ ] Webhook Secret في Stripe: `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`
- [ ] Backend يعمل
- [ ] اختبر Webhook من Stripe Dashboard
- [ ] تحققت من Backend logs
- [ ] اختبر عملية دفع من Client Portal

---

## 🔗 الروابط

- **Stripe Dashboard:** https://dashboard.stripe.com/webhooks
- **Webhook Endpoint:** https://api.zien-ai.app/api/payment/webhook
- **Backend API:** https://api.zien-ai.app/api/payment

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

## دليل إعداد Stripe Webhook للبورتال والـ Backend

---

## ✅ Stripe Webhook Secrets

لديك **2 Webhook Destinations** في Stripe:

### 1. Snapshot (الأهم - 221 events)
- **Destination:** `rare_4n_stripe_snapshot`
- **URL:** `https://api.zien-ai.app/api/payment/webhook`
- **API Version:** `2025-11-17.clover`
- **Payload Style:** `Snapshot`
- **Events:** 221 events
- **Signing Secret:** `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`

### 2. Thin (3 events)
- **Destination:** `inspiring-glow-thin`
- **URL:** `https://api.zien-ai.app/api/payment/webhook`
- **API Version:** `Unversioned`
- **Payload Style:** `Thin`
- **Events:** 3 events
- **Signing Secret:** `whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A`

---

## ✅ المفاتيح في .env

تم إضافة المفاتيح التالية في `apps/backend/.env.TEMPLATE`:

```bash
# Stripe Webhook Secrets
STRIPE_WEBHOOK_SECRET=whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm
STRIPE_WEBHOOK_SECRET_SNAPSHOT=whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm
STRIPE_WEBHOOK_SECRET_THIN=whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A
```

---

## ✅ الكود في Backend

الكود في `apps/backend/src/routes/payment.js` يستخدم `STRIPE_WEBHOOK_SECRET` بشكل صحيح:

```javascript
// Payment Webhook (Stripe)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const stripe = await getStripeClient();
    if (!stripe) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    try {
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        // In development, parse without verification
        event = JSON.parse(req.body.toString());
        console.warn('⚠️ Stripe webhook signature verification skipped (STRIPE_WEBHOOK_SECRET not set)');
      }
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle events...
    if (event.type === 'payment_intent.succeeded') {
      // Process payment...
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});
```

---

## ✅ إعداد Webhook في Stripe Dashboard

### الخطوات:

1. **اذهب إلى Stripe Dashboard:**
   - https://dashboard.stripe.com/webhooks

2. **تحقق من Webhook Destinations:**
   - ✅ `rare_4n_stripe_snapshot` → `https://api.zien-ai.app/api/payment/webhook`
   - ✅ `inspiring-glow-thin` → `https://api.zien-ai.app/api/payment/webhook`

3. **تحقق من Events:**
   - Snapshot: 221 events (جميع الأحداث المهمة)
   - Thin: 3 events (أحداث محددة)

4. **تحقق من Signing Secret:**
   - Snapshot: `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`
   - Thin: `whsec_zDvbEqYhLwlxFpdulqXsG7HNwqdRha1A`

---

## ✅ اختبار Webhook

### 1. اختبار من Stripe Dashboard:

1. اذهب إلى: https://dashboard.stripe.com/webhooks
2. اختر Webhook Destination
3. اضغط **"Send test webhook"**
4. اختر Event Type (مثل `payment_intent.succeeded`)
5. اضغط **"Send test webhook"**

### 2. التحقق من Backend Logs:

```bash
# يجب أن ترى:
📥 Stripe Webhook received: payment_intent.succeeded
✅ Payment processed successfully
```

### 3. اختبار من Client Portal:

1. اذهب إلى Client Portal
2. قم بعملية دفع تجريبية
3. تحقق من Backend logs
4. تحقق من Stripe Dashboard → Events

---

## ✅ Events المهمة

### Snapshot (221 events):
- `payment_intent.succeeded` - ✅ معالج في الكود
- `payment_intent.payment_failed`
- `charge.succeeded`
- `charge.failed`
- `customer.created`
- `customer.updated`
- `subscription.created`
- `subscription.updated`
- `subscription.deleted`
- وغيرها...

### Thin (3 events):
- أحداث محددة حسب الحاجة

---

## ✅ التحقق من الاستيراد

### في Backend:
- ✅ `apps/backend/src/routes/payment.js` - يستخدم `process.env.STRIPE_WEBHOOK_SECRET`
- ✅ `apps/backend/src/services/paymentservice.js` - يستخدم `process.env.STRIPE_SECRET_KEY`

### في Client Portal:
- ✅ `apps/client-portal/services/PaymentService.js` - يستخدم `STRIPE_PUBLISHABLE_KEY` (من Base44 Environment Variables)
- ✅ جميع الطلبات تذهب للباك اند

---

## ✅ قائمة التحقق

- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env`
- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env.TEMPLATE`
- [ ] `STRIPE_WEBHOOK_SECRET` في `apps/backend/.env.example`
- [ ] Webhook URL في Stripe: `https://api.zien-ai.app/api/payment/webhook`
- [ ] Webhook Secret في Stripe: `whsec_1qD1uWALsLEh8fiFwBYjh5vNWoGcHiUm`
- [ ] Backend يعمل
- [ ] اختبر Webhook من Stripe Dashboard
- [ ] تحققت من Backend logs
- [ ] اختبر عملية دفع من Client Portal

---

## 🔗 الروابط

- **Stripe Dashboard:** https://dashboard.stripe.com/webhooks
- **Webhook Endpoint:** https://api.zien-ai.app/api/payment/webhook
- **Backend API:** https://api.zien-ai.app/api/payment

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

