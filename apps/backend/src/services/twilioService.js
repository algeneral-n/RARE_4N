/**
 * RARE 4N - Twilio Service
 * ✅ SMS, Voice, WhatsApp Integration
 * ✅ جميع المفاتيح من process.env
 */

let twilioClient = null;
let twilioModule = null;

// ✅ Load from environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+14155238886';
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

/**
 * Get Twilio client (lazy load)
 */
async function getTwilioClient() {
  if (twilioClient !== null) return twilioClient; // Already initialized or marked unavailable

  try {
    if (!twilioModule) {
      twilioModule = await import('twilio').catch(() => null);
    }

    if (twilioModule && TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      twilioClient = twilioModule.default(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      console.log('✅ Twilio client initialized');
    } else {
      console.warn('⚠️ Twilio credentials not configured');
      twilioClient = false; // Mark as unavailable
    }
  } catch (error) {
    console.warn('⚠️ Twilio not available:', error.message);
    twilioClient = false; // Mark as unavailable
  }

  return twilioClient;
}

/**
 * Send SMS via Twilio
 */
export async function sendSMS(to, message, from = null) {
  try {
    const client = await getTwilioClient();
    if (!client) {
      return {
        success: false,
        error: 'Twilio not configured',
      };
    }

    const result = await client.messages.create({
      body: message,
      from: from || TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log('✅ SMS sent:', result.sid);
    return {
      success: true,
      messageSid: result.sid,
      status: result.status,
    };
  } catch (error) {
    console.error('❌ SMS send error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Send WhatsApp message via Twilio
 */
export async function sendWhatsApp(to, message) {
  try {
    const client = await getTwilioClient();
    if (!client) {
      return {
        success: false,
        error: 'Twilio not configured',
      };
    }

    const result = await client.messages.create({
      body: message,
      from: TWILIO_WHATSAPP_NUMBER,
      to: to.startsWith('whatsapp:') ? to : `whatsapp:${to}`,
    });

    console.log('✅ WhatsApp sent:', result.sid);
    return {
      success: true,
      messageSid: result.sid,
      status: result.status,
    };
  } catch (error) {
    console.error('❌ WhatsApp send error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Make phone call via Twilio
 */
export async function makePhoneCall(to, message, from = null) {
  try {
    const client = await getTwilioClient();
    if (!client) {
      return {
        success: false,
        error: 'Twilio not configured',
      };
    }

    const result = await client.calls.create({
      url: `${process.env.API_DOMAIN || 'https://api.zien-ai.app'}/api/twilio/voice`,
      to: to,
      from: from || TWILIO_PHONE_NUMBER,
    });

    console.log('✅ Phone call initiated:', result.sid);
    return {
      success: true,
      callSid: result.sid,
      status: result.status,
    };
  } catch (error) {
    console.error('❌ Phone call error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Send OTP via Twilio Verify
 */
export async function sendOTP(phoneNumber) {
  try {
    const client = await getTwilioClient();
    if (!client || !TWILIO_VERIFY_SERVICE_SID) {
      return {
        success: false,
        error: 'Twilio Verify not configured',
      };
    }

    const result = await client.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
      });

    console.log('✅ OTP sent:', result.sid);
    return {
      success: true,
      verificationSid: result.sid,
      status: result.status,
    };
  } catch (error) {
    console.error('❌ OTP send error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Verify OTP
 */
export async function verifyOTP(phoneNumber, code) {
  try {
    const client = await getTwilioClient();
    if (!client || !TWILIO_VERIFY_SERVICE_SID) {
      return {
        success: false,
        error: 'Twilio Verify not configured',
      };
    }

    const result = await client.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phoneNumber,
        code: code,
      });

    return {
      success: result.status === 'approved',
      status: result.status,
    };
  } catch (error) {
    console.error('❌ OTP verify error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default {
  sendSMS,
  sendWhatsApp,
  makePhoneCall,
  sendOTP,
  verifyOTP,
};




















