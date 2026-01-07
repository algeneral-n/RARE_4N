# 🔐 إعداد المفاتيح في Expo / GitHub / Base44
## Secrets Setup Guide - RARE 4N

---

## 📋 نظرة عامة

هذا الملف يحتوي على **جميع المفاتيح المطلوبة** في:
- ✅ **Expo EAS Secrets** (للبناء iOS + Android)
- ✅ **GitHub Secrets** (للـ CI/CD)
- ✅ **Base44/Client Portal** (على الدومين - Cloudflare)
- ✅ **Cloudflare** (لنشر الويب App)

**⚠️ جميع القيم هنا حقيقية - استخدمها مباشرة**

---

## 🚀 1. Expo EAS Secrets

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

**🔗 الرابط المباشر:**
https://expo.dev/accounts/zien/projects/c2f7ad03-bef4-4e74-b426-4170a9d788b3/settings/secrets

---

## 🔧 2. GitHub Secrets

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

# ============================================
# Webhook URL (للإشعارات بعد البناء)
# ============================================
WEBHOOK_URL=https://api.zien-ai.app
```

**🔗 الرابط المباشر:**
https://github.com/algeneral-n/abo-zien/settings/secrets/actions

---

## 🌐 3. Base44/Client Portal Environment Variables

**الموقع:** Base44 Dashboard → Project Settings → Environment Variables

### المفاتيح المطلوبة:

```bash
# ============================================
# API URL (Public)
# ============================================
API_URL=https://api.zien-ai.app

# ============================================
# Publishable Keys Only (لا مفاتيح حساسة)
# ============================================
STRIPE_PUBLISHABLE_KEY=pk_live_51SQHZBRxUp84KGVtqOwSSn1WM5Iq4CAdebGr34IA2G7osiTkH5K9G0BrjUbEKQWV21PrTOC8pciDACR2DxJY7qno00UgNhUtVg

SUPABASE_URL=https://fgvrilruqzajstprioqj.supabase.co
SUPABASE_ANON_KEY=sb_publishable_BLkrtQ9q20tyaqCF5kWrvQ_YFElVTXy

ELEVENLABS_AGENT_ID=agent_0701kc4axybpf6fvak70xwfzpyka
```

**⚠️ مهم جداً:**
- ❌ **لا تضع مفاتيح حساسة هنا:**
  - `STRIPE_SECRET_KEY`
  - `OPENAI_API_KEY`
  - `TWILIO_AUTH_TOKEN`
  - أي مفتاح سري

- ✅ **فقط Publishable Keys:**
  - `STRIPE_PUBLISHABLE_KEY`
  - `SUPABASE_ANON_KEY`
  - `ELEVENLABS_AGENT_ID` (non-secret)

---

## ☁️ 4. Cloudflare (لنشر الويب App)

**الموقع:** Cloudflare Dashboard → Workers & Pages → Your Project → Settings → Environment Variables

### المفاتيح المطلوبة (في Backend .env):

```bash
# ============================================
# Cloudflare Services (في Backend .env فقط)
# ============================================
CLOUDFLARE_ACCOUNT_ID=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_ZONE_ID=cb61498c69c654043b54b30550151b8f
CLOUDFLARE_API_KEY=b1a6484ff2a4d441092133debec6b99ff512c
CLOUDFLARE_TUNNEL_ID=8280d872-79cc-4b82-9de8-a86ab4bf9540
CLOUDFLARE_R2_ACCESS_KEY_ID=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_R2_SECRET_ACCESS_KEY=ccc1ed9ab170eaf1e72e9a10e46ef320
CLOUDFLARE_R2_BUCKET_NAME=rare
CLOUDFLARE_R2_ENDPOINT=https://ccc1ed9ab170eaf1e72e9a10e46ef320.r2.cloudflarestorage.com
```

**⚠️ ملاحظة:** Cloudflare مفاتيح في Backend فقط - لا تضعها في Base44

---

## 📊 ملخص سريع (Quick Summary)

| المفتاح | Expo EAS | GitHub Secrets | Base44/Portal | Cloudflare |
|---------|----------|----------------|---------------|------------|
| `EXPO_TOKEN` | ✅ | ✅ | ❌ | ❌ |
| `ASC_API_KEY_ID` | ✅ | ✅ | ❌ | ❌ |
| `ASC_API_KEY_ISSUER_ID` | ✅ | ✅ | ❌ | ❌ |
| `ASC_API_KEY_P8` | ✅ | ✅ | ❌ | ❌ |
| `EXPO_PUBLIC_API_URL` | ✅ | ❌ | ✅ | ❌ |
| `EXPO_PUBLIC_SUPABASE_URL` | ✅ | ❌ | ✅ | ❌ |
| `EXPO_PUBLIC_SUPABASE_KEY` | ✅ | ❌ | ✅ | ❌ |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | ❌ | ✅ | ❌ |
| `EXPO_PUBLIC_ELEVENLABS_AGENT_ID` | ✅ | ❌ | ✅ | ❌ |
| `WEBHOOK_URL` | ❌ | ✅ | ❌ | ❌ |
| `CLOUDFLARE_*` | ❌ | ❌ | ❌ | ✅ (Backend only) |

---

## ✅ قائمة التحقق (Checklist)

### Expo EAS Secrets
- [ ] `EXPO_TOKEN` موجود
- [ ] `ASC_API_KEY_ID` موجود
- [ ] `ASC_API_KEY_ISSUER_ID` موجود
- [ ] `ASC_API_KEY_P8` موجود
- [ ] `EXPO_PUBLIC_API_URL` موجود
- [ ] `EXPO_PUBLIC_SUPABASE_URL` موجود
- [ ] `EXPO_PUBLIC_SUPABASE_KEY` موجود
- [ ] `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` موجود
- [ ] `EXPO_PUBLIC_ELEVENLABS_AGENT_ID` موجود

### GitHub Secrets
- [ ] `EXPO_TOKEN` موجود
- [ ] `ASC_API_KEY_ID` موجود
- [ ] `ASC_API_KEY_ISSUER_ID` موجود
- [ ] `ASC_API_KEY_P8` موجود
- [ ] `APPLE_APP_ID` موجود (6756657662)
- [ ] `ASC_APP_ID` موجود (6756657662)
- [ ] `WEBHOOK_URL` موجود
- [ ] `EAS_PROJECT_ID` موجود (في Variables)

### Base44/Client Portal
- [ ] `API_URL` موجود
- [ ] `STRIPE_PUBLISHABLE_KEY` موجود
- [ ] `SUPABASE_URL` موجود
- [ ] `SUPABASE_ANON_KEY` موجود
- [ ] `ELEVENLABS_AGENT_ID` موجود
- [ ] **لا توجد مفاتيح حساسة**

### Cloudflare (Backend .env)
- [ ] `CLOUDFLARE_ACCOUNT_ID` موجود
- [ ] `CLOUDFLARE_ZONE_ID` موجود
- [ ] `CLOUDFLARE_API_KEY` موجود
- [ ] `CLOUDFLARE_TUNNEL_ID` موجود
- [ ] `CLOUDFLARE_R2_*` موجود

---

## 🚨 تحذيرات أمنية

1. **❌ لا ترفع هذه المفاتيح إلى Git**
2. **✅ استخدم فقط في Secrets/Variables**
3. **✅ راجع القيم قبل الحفظ**
4. **✅ لا تشارك هذه المفاتيح مع أي شخص**

---

**تاريخ الإنشاء:** 2026-01-05  
**آخر تحديث:** 2026-01-05  
**الحالة:** ✅ جاهز للاستخدام
