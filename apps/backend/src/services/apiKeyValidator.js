/**
 * RARE 4N - API Key Validation Service
 * ✅ التحقق الشامل من جميع المفاتيح قبل الاستخدام
 * ✅ رسائل خطأ واضحة عند عدم وجود المفاتيح
 * ✅ منع استخدام المفاتيح غير الصحيحة
 */

/**
 * ✅ التحقق من صحة مفتاح OpenAI
 */
export function validateOpenAIKey() {
  const key = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  
  if (!key || key === 'REPLACE_ME' || key.trim() === '') {
    return {
      valid: false,
      error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.',
      key: null,
    };
  }

  // ✅ Basic format validation
  if (!key.startsWith('sk-') && !key.startsWith('sk-proj-')) {
    return {
      valid: false,
      error: 'Invalid OpenAI API key format. OpenAI keys should start with "sk-" or "sk-proj-"',
      key: null,
    };
  }

  if (key.length < 20) {
    return {
      valid: false,
      error: 'OpenAI API key appears to be invalid (too short)',
      key: null,
    };
  }

  return {
    valid: true,
    key,
  };
}

/**
 * ✅ التحقق من صحة مفتاح Gemini
 */
export function validateGeminiKey() {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
  
  if (!key || key === 'REPLACE_ME' || key.trim() === '') {
    return {
      valid: false,
      error: 'Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.',
      key: null,
    };
  }

  // ✅ Basic format validation
  if (!key.startsWith('AIza')) {
    return {
      valid: false,
      error: 'Invalid Gemini API key format. Gemini keys should start with "AIza"',
      key: null,
    };
  }

  if (key.length < 30) {
    return {
      valid: false,
      error: 'Gemini API key appears to be invalid (too short)',
      key: null,
    };
  }

  return {
    valid: true,
    key,
  };
}

/**
 * ✅ التحقق من صحة مفتاح Claude/Anthropic
 */
export function validateAnthropicKey() {
  const key = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
  
  if (!key || key === 'REPLACE_ME' || key.trim() === '') {
    return {
      valid: false,
      error: 'Anthropic API key is not configured. Please set ANTHROPIC_API_KEY in your .env file.',
      key: null,
    };
  }

  // ✅ Basic format validation
  if (!key.startsWith('sk-ant-')) {
    return {
      valid: false,
      error: 'Invalid Anthropic API key format. Anthropic keys should start with "sk-ant-"',
      key: null,
    };
  }

  if (key.length < 30) {
    return {
      valid: false,
      error: 'Anthropic API key appears to be invalid (too short)',
      key: null,
    };
  }

  return {
    valid: true,
    key,
  };
}

/**
 * ✅ التحقق من صحة مفتاح ElevenLabs
 */
export function validateElevenLabsKey() {
  const key = process.env.ELEVENLABS_API_KEY || process.env.ELEVENLABS_KEY;
  
  if (!key || key === 'REPLACE_ME' || key.trim() === '') {
    return {
      valid: false,
      error: 'ElevenLabs API key is not configured. Please set ELEVENLABS_API_KEY in your .env file.',
      key: null,
    };
  }

  // ✅ Basic format validation (ElevenLabs keys are alphanumeric)
  if (key.length < 20) {
    return {
      valid: false,
      error: 'ElevenLabs API key appears to be invalid (too short)',
      key: null,
    };
  }

  return {
    valid: true,
    key,
  };
}

/**
 * ✅ التحقق من صحة مفتاح Google Maps
 */
export function validateGoogleMapsKey() {
  const key = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_KEY;
  
  if (!key || key === 'REPLACE_ME' || key.trim() === '') {
    return {
      valid: false,
      error: 'Google Maps API key is not configured. Please set GOOGLE_MAPS_API_KEY in your .env file.',
      key: null,
    };
  }

  // ✅ Basic format validation
  if (!key.startsWith('AIza')) {
    return {
      valid: false,
      error: 'Invalid Google Maps API key format. Google Maps keys should start with "AIza"',
      key: null,
    };
  }

  return {
    valid: true,
    key,
  };
}

/**
 * ✅ التحقق من صحة مفتاح Stripe
 */
export function validateStripeKey() {
  const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_KEY;
  
  if (!key || key === 'REPLACE_ME' || key.trim() === '') {
    return {
      valid: false,
      error: 'Stripe API key is not configured. Please set STRIPE_SECRET_KEY in your .env file.',
      key: null,
    };
  }

  // ✅ Basic format validation
  if (!key.startsWith('sk_') && !key.startsWith('sk_test_') && !key.startsWith('sk_live_')) {
    return {
      valid: false,
      error: 'Invalid Stripe API key format. Stripe keys should start with "sk_", "sk_test_", or "sk_live_"',
      key: null,
    };
  }

  return {
    valid: true,
    key,
  };
}

/**
 * ✅ التحقق من صحة مفتاح Twilio
 */
export function validateTwilioKey() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || accountSid === 'REPLACE_ME' || accountSid.trim() === '') {
    return {
      valid: false,
      error: 'Twilio Account SID is not configured. Please set TWILIO_ACCOUNT_SID in your .env file.',
      key: null,
    };
  }

  if (!authToken || authToken === 'REPLACE_ME' || authToken.trim() === '') {
    return {
      valid: false,
      error: 'Twilio Auth Token is not configured. Please set TWILIO_AUTH_TOKEN in your .env file.',
      key: null,
    };
  }

  // ✅ Basic format validation
  if (!accountSid.startsWith('AC')) {
    return {
      valid: false,
      error: 'Invalid Twilio Account SID format. Account SID should start with "AC"',
      key: null,
    };
  }

  return {
    valid: true,
    accountSid,
    authToken,
  };
}

/**
 * ✅ التحقق من جميع المفاتيح الأساسية
 */
export function validateAllKeys() {
  const results = {
    openai: validateOpenAIKey(),
    gemini: validateGeminiKey(),
    anthropic: validateAnthropicKey(),
    elevenlabs: validateElevenLabsKey(),
    googleMaps: validateGoogleMapsKey(),
    stripe: validateStripeKey(),
    twilio: validateTwilioKey(),
  };

  const allValid = Object.values(results).every(r => r.valid);
  const errors = Object.entries(results)
    .filter(([_, r]) => !r.valid)
    .map(([name, r]) => `${name}: ${r.error}`);

  return {
    allValid,
    results,
    errors,
  };
}

/**
 * ✅ Helper: الحصول على مفتاح OpenAI مع التحقق
 */
export function getOpenAIKey() {
  const validation = validateOpenAIKey();
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  return validation.key;
}

/**
 * ✅ Helper: الحصول على مفتاح Gemini مع التحقق
 */
export function getGeminiKey() {
  const validation = validateGeminiKey();
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  return validation.key;
}

/**
 * ✅ Helper: الحصول على مفتاح Anthropic مع التحقق
 */
export function getAnthropicKey() {
  const validation = validateAnthropicKey();
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  return validation.key;
}

/**
 * ✅ Helper: الحصول على مفتاح ElevenLabs مع التحقق
 */
export function getElevenLabsKey() {
  const validation = validateElevenLabsKey();
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  return validation.key;
}

export default {
  validateOpenAIKey,
  validateGeminiKey,
  validateAnthropicKey,
  validateElevenLabsKey,
  validateGoogleMapsKey,
  validateStripeKey,
  validateTwilioKey,
  validateAllKeys,
  getOpenAIKey,
  getGeminiKey,
  getAnthropicKey,
  getElevenLabsKey,
};






