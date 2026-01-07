# مفاتيح النشر - Keys for Deployment
## RARE 4N - Real Keys for GitHub, Expo, Base44

---

## 1. GitHub Secrets (للرفع Android + iOS + Cloudflare)

**الموقع:** https://github.com/algeneral-n/abo-zien/settings/secrets/actions

### المفاتيح المطلوبة:

```bash
# ============================================
# Expo Token (مطلوب للبناء)
# ============================================
EXPO_TOKEN=s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn

# ============================================
# Expo Project ID (Non-secret - يمكن وضعه في Variables)
# ============================================
EAS_PROJECT_ID=c2f7ad03-bef4-4e74-b426-4170a9d788b3

# ============================================
# Apple App Store Connect (للبناء على iOS)
# ============================================
ASC_API_KEY_ID=6AR5VSRINSC3
ASC_API_KEY_ISSUER_ID=BN4DXG557F
ASC_API_KEY_P8=-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvo+3ieNujr8usWIx
5173ukKtHO8svfese75jWplP+JihRANCAARY+gjvpXDrtXWTGtJhfGeXPSELfrH2
n6aZcfLkaBWOCtH3ZzfWuBB2a5f9gKnqzVJ/h/bC0z3gSjzjhqHI6jp6
-----END PRIVATE KEY-----

# ============================================
# Apple App ID (الرئيسي - للرفع على iOS)
# ============================================
APPLE_APP_ID=6756657662
ASC_APP_ID=6756657662

# ============================================
# Google Play (للبناء على Android)
# ============================================
# GOOGLE_PLAY_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
# (إذا كان لديك حساب Google Play)

# ============================================
# Cloudflare (لنشر الويب App)
# ============================================
CLOUDFLARE_ACCOUNT_ID=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_ZONE_ID=cb61498c69c654043b54b30550151b8f
CLOUDFLARE_API_KEY=b1a6484ff2a4d441092133debec6b99ff512c
CLOUDFLARE_R2_ACCESS_KEY_ID=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_R2_SECRET_ACCESS_KEY=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_R2_BUCKET_NAME=rare

# ============================================
# Webhook URL (للإشعارات بعد البناء)
# ============================================
WEBHOOK_URL=https://api.zien-ai.app
```

**رابط مباشر:** https://github.com/algeneral-n/abo-zien/settings/secrets/actions

---

## 2. Expo EAS Secrets (للبناء iOS + Android)

**الموقع:** https://expo.dev/accounts/zien/projects/c2f7ad03-bef4-4e74-b426-4170a9d788b3/settings/secrets

### المفاتيح المطلوبة:

```bash
# ============================================
# Expo Token (مطلوب للبناء)
# ============================================
EXPO_TOKEN=s2qpGH-Hg-8MQNLFT-2nYxH0dhuTHaGBs-p4_sbn

# ============================================
# Apple App Store Connect (للبناء على iOS)
# ============================================
ASC_API_KEY_ID=6AR5VSRINSC3
ASC_API_KEY_ISSUER_ID=BN4DXG557F
ASC_API_KEY_P8=-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgvo+3ieNujr8usWIx
5173ukKtHO8svfese75jWplP+JihRANCAARY+gjvpXDrtXWTGtJhfGeXPSELfrH2
n6aZcfLkaBWOCtH3ZzfWuBB2a5f9gKnqzVJ/h/bC0z3gSjzjhqHI6jp6
-----END PRIVATE KEY-----

# ============================================
# Apple App ID (الرئيسي - للرفع على iOS)
# ============================================
APPLE_APP_ID=6756657662
ASC_APP_ID=6756657662

# ============================================
# Google Play (للبناء على Android)
# ============================================
# GOOGLE_PLAY_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
# (إذا كان لديك حساب Google Play)

# ============================================
# Environment Variables (Publishable Keys Only)
# ============================================
EXPO_PUBLIC_API_URL=https://api.zien-ai.app
EXPO_PUBLIC_SUPABASE_URL=https://fgvrilruqzajstprioqj.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg
EXPO_PUBLIC_ELEVENLABS_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka
```

**رابط مباشر:** https://expo.dev/accounts/zien/projects/c2f7ad03-bef4-4e74-b426-4170a9d788b3/settings/secrets

---

## 3. Base44 Environment Variables (للـ Client Portal)

**الموقع:** Base44 Dashboard → Project Settings → Environment Variables

### المفاتيح المطلوبة:

```bash
# ============================================
# API Configuration
# ============================================
API_URL=https://api.zien-ai.app

# ============================================
# Stripe (Publishable Key Only)
# ============================================
STRIPE_PUBLISHABLE_KEY=pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg

# ============================================
# Supabase (Publishable Keys Only)
# ============================================
SUPABASE_URL=https://fgvrilruqzajstprioqj.supabase.co
SUPABASE_ANON_KEY=sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy

# ============================================
# ElevenLabs (Non-secret Agent ID)
# ============================================
ELEVENLABS_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka

# ============================================
# Google Translation API (للترجمة الاحترافية)
# ============================================
# ملاحظة: Google Translation API يتم استدعاؤه من Backend
# لا حاجة لمفتاح هنا - يتم عبر API_URL
```

**مهم جداً:**
- لا تضع مفاتيح حساسة هنا
- فقط Publishable Keys
- جميع الطلبات تذهب للباك اند

---

## ملخص سريع

| المفتاح | GitHub | Expo | Base44 |
|---------|--------|------|--------|
| EXPO_TOKEN | ✅ | ✅ | ❌ |
| ASC_API_KEY_ID | ✅ | ✅ | ❌ |
| ASC_API_KEY_ISSUER_ID | ✅ | ✅ | ❌ |
| ASC_API_KEY_P8 | ✅ | ✅ | ❌ |
| APPLE_APP_ID | ✅ | ✅ | ❌ |
| ASC_APP_ID | ✅ | ✅ | ❌ |
| CLOUDFLARE_* | ✅ | ❌ | ❌ |
| EXPO_PUBLIC_API_URL | ❌ | ✅ | ✅ (API_URL) |
| EXPO_PUBLIC_SUPABASE_URL | ❌ | ✅ | ✅ (SUPABASE_URL) |
| EXPO_PUBLIC_SUPABASE_KEY | ❌ | ✅ | ✅ (SUPABASE_ANON_KEY) |
| EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY | ❌ | ✅ | ✅ (STRIPE_PUBLISHABLE_KEY) |
| EXPO_PUBLIC_ELEVENLABS_AGENT_ID | ❌ | ✅ | ✅ (ELEVENLABS_AGENT_ID) |

---

**تاريخ الإنشاء:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام

