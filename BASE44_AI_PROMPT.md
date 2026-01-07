# Base44 AI Prompt - Client Portal Professional Setup
## RARE 4N - Complete Base44 Setup Instructions

---

## PROMPT للـ AI بتاع Base44

```
أنت مسؤول عن بناء Client Portal احترافي لـ RARE 4N على Base44.

المشروع: RARE 4N Client Portal
الموقع: portal.zien-ai.app
Backend API: https://api.zien-ai.app

---

## المتطلبات الأساسية:

### 1. البنية الأساسية:
- الملف الرئيسي: index.html في الجذر
- الملف الرئيسي للتطبيق: app-new.js
- ملف الإعدادات: config.js (يقرأ من Environment Variables)
- ملفات CSS: styles.css
- مجلدات: components/, pages/, services/, themes/

### 2. Environment Variables (من Base44 Dashboard):
- API_URL=https://api.zien-ai.app
- STRIPE_PUBLISHABLE_KEY=pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg
- SUPABASE_URL=https://fgvrilruqzajstprioqj.supabase.co
- SUPABASE_ANON_KEY=sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy
- ELEVENLABS_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka

### 3. التكامل مع Backend:
- جميع الطلبات تذهب إلى: https://api.zien-ai.app
- Socket.IO للـ Real-time: wss://api.zien-ai.app
- جميع المفاتيح الحساسة في Backend فقط
- Client Portal يستخدم فقط Publishable Keys

### 4. Builder Integration:
- Builder موجود في: /api/auto-builder
- Builder يستخدم: GPT + Gemini معاً
- Builder يبني: iOS, Android, Web (Cloudflare)
- Builder يستخدم: Stripe للدفع
- Builder يستخدم: Twilio للإشعارات

### 5. Agent Integration (ElevenLabs):
- ✅ **Agent موجود في:** `apps/client-portal/services/ClientPortalAgent.js`
- ✅ **Backend API:** `/api/elevenlabs` و `/api/elevenlabs-webhook`
- ✅ **Webhook URL:** `https://api.zien-ai.app/api/elevenlabs/webhook`
- ✅ **دعم جميع اللغات واللهجات:** العربية (جميع اللهجات), الإنجليزية, الفرنسية, إلخ
- ✅ **ربط مع Twilio:** لإرسال الرسائل للعملاء عبر WhatsApp/SMS
- ✅ **حفظ الأوامر:** في قاعدة البيانات (user_commands table)
- ✅ **شخصية المستخدم:** حفظ في user_profiles table
- ✅ **Socket.IO:** للـ Real-time communication
- ✅ **الاستخدام:**
  ```javascript
  import { ClientPortalAgent } from './services/ClientPortalAgent.js';
  
  const agent = new ClientPortalAgent();
  await agent.init();
  
  // بدء محادثة
  await agent.startConversation({
    clientName: 'عميل',
    language: 'ar',
    dialect: 'eg', // لهجة مصرية
    phone: '+201234567890',
    email: 'client@example.com'
  });
  
  // إرسال رسالة
  await agent.sendMessage('مرحبا');
  ```
- ✅ **Webhook Events:**
  - `conversation.started` - بدء المحادثة
  - `conversation.message` - رسالة جديدة
  - `conversation.ended` - انتهاء المحادثة
  - `agent.tool_call` - استدعاء أداة
  - `agent.action` - إجراء من الـ Agent

### 6. Translation Integration:
- ✅ **TranslationService موجود في:** `apps/client-portal/services/TranslationService.js`
- ✅ **يستخدم Backend فقط:** لا حاجة لـ Google API Key في Client Portal
- ✅ **Endpoint:** `/api/translation/translate` (من Backend)
- ✅ **دعم جميع اللغات:** 100+ لغة ولهجات
- ✅ **الاستخدام:**
  ```javascript
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
- ✅ **ترجمة تلقائية:** عند تغيير اللغة يتم ترجمة جميع النصوص
- ✅ **حفظ اللغة المفضلة:** في localStorage
- ✅ **Cache:** الترجمة محفوظة في cache لتقليل الطلبات

### 7. Payment Integration:
- Stripe Checkout: /api/payments/create
- Stripe Publishable Key: من Environment Variables
- Apple Pay Later: /api/payments/apple-pay
- معالجة Webhooks: /api/payments/webhook

### 8. Customization Libraries:
- مكتبة الثيمات: themes/themes.js
- مكتبة الخطوط: fonts/fonts.js
- مكتبة الأيقونات: icons/icons.js
- مكتبة الخلفيات: backgrounds/backgrounds.js
- تطبيق فوري على جميع الصفحات

### 9. الصفحات المطلوبة:
- Dashboard (الصفحة الرئيسية)
- Libraries (المكتبات)
- Preview Studio (معاينة المشاريع)
- Payments (الدفع)
- Projects (المشاريع)
- Settings (الإعدادات)

### 10. المكونات المطلوبة:
- RARE Character (الشخصية)
- Voice Agent Widget (ElevenLabs)
- Payment Modal (Stripe)
- Project Builder (Auto Builder)
- Translation Service (Google Translation)

---

## القواعد الصارمة:

1. لا تستخدم إيموجيز في الكود
2. الخطوط يجب أن تكون متنسقة فقط
3. لا تستخدم ألوان كثيرة
4. يجب استخدام خلفية الأسماء (NamesTunnel) كخيار
5. يجب استخدام RARE Character كخلفية
6. يجب تطبيق Translation على كل شيء
7. جميع الطلبات تذهب للباك اند
8. لا تضع مفاتيح حساسة في Client Portal

---

## التكامل المطلوب:

### Builder Integration:
- ربط مع /api/auto-builder
- إرسال طلبات البناء
- استقبال حالة البناء
- عرض حالة البناء في Real-time
- معالجة الدفع عبر Stripeو apple pay -googlepay -
- إرسال إشعارات عبر Twilio

### Agent Integration:
- ربط مع /api/client-portal (Socket.IO)
- استخدام ElevenLabs Voice Agent
- Real-time communication
- ترجمة تلقائية (Google Translation API)
- حفظ المحادثات

### Payment Integration:
- Stripe Checkout
- Apple Pay Later
- معالجة Webhooks
- تحديث حالة المشروع بعد الدفع

### Translation Integration:
- استخدام /api/translation/translate
- دعم جميع اللغات
- ترجمة تلقائية
- حفظ اللغة المفضلة

---

## الملفات المطلوبة:

1. index.html - نقطة الدخول
2. app-new.js - التطبيق الرئيسي
3. config.js - الإعدادات (يقرأ من Environment Variables)
4. styles.css - التصميم
5. components/RARECharacter.js - الشخصية
6. services/ClientPortalAgent.js - الاجنت
7. services/TranslationService.js - الترجمة
8. services/PaymentService.js - الدفع
9. services/BuilderService.js - البيلدر
10. themes/themes.js - الثيمات
11. fonts/fonts.js - الخطوط
12. icons/icons.js - الأيقونات
13. backgrounds/backgrounds.js - الخلفيات
14. libraries
15. real preview and snapshot then send to builder with describtion 
16. cinematic portal has to be so professional for developers and normal users 

---

## الخطوات:

1. قراءة جميع الملفات الموجودة في apps/client-portal/
2. التأكد من قراءة Environment Variables من config.js
3. ربط جميع الخدمات مع Backend API
4. تطبيق Translation على جميع النصوص
5. تطبيق الثيمات والخطوط والخلفيات
6. ربط Builder مع Auto Builder API
7. ربط Agent مع Client Portal API
8. ربط Payment مع Payments API
9. اختبار جميع الوظائف
10. التأكد من عدم وجود مفاتيح حساسة

---

## النتيجة المطلوبة:

- Client Portal احترافي
- Agent احترافي (ElevenLabs Voice)
- Builder متكامل (Auto Builder)
- Translation احترافية (Google Translation API)
- Payment متكامل (Stripe + Apple Pay)
- مكتبات تخصيص احترافية (Themes, Fonts, Icons, Backgrounds)
- تكامل كامل مع Backend
- Real-time communication
- لا مفاتيح حساسة في Client Portal

---

ابدأ الآن بقراءة الملفات الموجودة وبناء Client Portal احترافي.
```

---

## ملاحظات مهمة للـ AI:

1. **اقرأ الملفات الموجودة أولاً:**
   - apps/client-portal/index.html
   - apps/client-portal/app-new.js
   - apps/client-portal/config.js
   - apps/client-portal/services/ClientPortalAgent.js
   - apps/client-portal/services/TranslationService.js

2. **تأكد من قراءة Environment Variables:**
   - من config.js
   - من window.API_URL أو import.meta.env.VITE_API_URL

3. **ربط جميع الخدمات:**
   - Builder → /api/auto-builder
   - Agent → /api/client-portal (Socket.IO)
   - Payment → /api/payments
   - Translation → /api/translation

4. **تطبيق Translation:**
   - استخدام TranslationService.js
   - ترجمة جميع النصوص
   - حفظ اللغة المفضلة

5. **تطبيق التخصيص:**
   - استخدام themes/themes.js
   - استخدام fonts/fonts.js
   - استخدام icons/icons.js
   - استخدام backgrounds/backgrounds.js

6. **التأكد من الأمان:**
   - لا مفاتيح حساسة
   - فقط Publishable Keys
   - جميع الطلبات للباك اند

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

