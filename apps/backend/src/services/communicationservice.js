/**
 * RARE 4N - Communication Service
 * Phone Calls, Email, WhatsApp, SMS via Twilio
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+14155238886';
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

let twilioClient = null;
let twilioModule = null;

async function getTwilioClient() {
  if (twilioClient !== null) return twilioClient; // Already initialized or marked unavailable
  
  try {
    if (!twilioModule) {
      twilioModule = await import('twilio').catch(() => null);
    }
    
    if (twilioModule && TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
      twilioClient = twilioModule.default(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    } else {
      twilioClient = false; // Mark as unavailable
    }
  } catch (error) {
    console.warn('⚠️ Twilio not available:', error.message);
    twilioClient = false; // Mark as unavailable
  }
  
  return twilioClient;
}

/**
 * Make phone call via Twilio
 */
export async function makePhoneCall(to, from = null, message = null) {
  try {
    const client = await getTwilioClient();
    if (!client || client === false) {
      return {
        success: false,
        error: 'Twilio not configured',
        simulated: true,
        message: 'Phone call would be made to ' + to,
      };
    }

    const call = await client.calls.create({
      to,
      from: from || TWILIO_PHONE_NUMBER,
      url: message ? `https://api.zien-ai.app/api/communication/twiml?message=${encodeURIComponent(message)}` : undefined,
      twiml: message ? `<Response><Say>${message}</Say></Response>` : undefined,
    });

    return {
      success: true,
      callSid: call.sid,
      status: call.status,
    };
  } catch (error) {
    console.error('Phone call error:', error);
    return {
      success: false,
      error: error.message,
      simulated: true,
    };
  }
}

/**
 * Send WhatsApp message via Twilio
 */
export async function sendWhatsAppMessage(to, message = null, mediaUrl = null, options = {}) {
  try {
    const client = await getTwilioClient();
    if (!client || client === false) {
      return {
        success: false,
        error: 'Twilio not configured',
        simulated: true,
        message: 'WhatsApp message would be sent to ' + to,
      };
    }

    // Ensure WhatsApp format
    const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

    const params = {
      to: whatsappTo,
      from: TWILIO_WHATSAPP_NUMBER,
    };

    // Content Template (Business-Initiated)
    if (options.contentSid) {
      params.contentSid = options.contentSid;
      if (options.contentVariables) {
        params.contentVariables = JSON.stringify(options.contentVariables);
      }
    } else if (message) {
      // Regular message
      params.body = message;
    } else {
      throw new Error('Either message or contentSid is required');
    }

    // Add media if provided
    if (mediaUrl) {
      params.mediaUrl = Array.isArray(mediaUrl) ? mediaUrl : [mediaUrl];
    }

    const result = await client.messages.create(params);

    return {
      success: true,
      messageSid: result.sid,
      status: result.status,
    };
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return {
      success: false,
      error: error.message,
      simulated: true,
    };
  }
}

/**
 * Send SMS via Twilio
 */
export async function sendSMS(to, message, from = null) {
  try {
    const client = await getTwilioClient();
    if (!client || client === false) {
      return {
        success: false,
        error: 'Twilio not configured',
        simulated: true,
        message: 'SMS would be sent to ' + to,
      };
    }

    const result = await client.messages.create({
      body: message,
      from: from || TWILIO_PHONE_NUMBER,
      to,
    });

    return {
      success: true,
      messageSid: result.sid,
      status: result.status,
    };
  } catch (error) {
    console.error('SMS send error:', error);
    return {
      success: false,
      error: error.message,
      simulated: true,
    };
  }
}

/**
 * Send Email (wrapper for emailService)
 */
export async function sendEmailMessage(to, subject, text, html) {
  const emailService = await import('./emailService.js');
  return await emailService.sendEmail({ to, subject, text, html });
}

/**
 * Ultimate Assistant Communication
 * Chooses best communication method based on context
 */
export async function ultimateAssistantCommunication(options) {
  const { to, message, method = 'auto', userId } = options;

  try {
    // Auto-detect best method
    if (method === 'auto') {
      // If phone number, prefer WhatsApp or SMS
      if (/^\+?[1-9]\d{1,14}$/.test(to)) {
        // Try WhatsApp first
        const whatsappResult = await sendWhatsAppMessage(to, message);
        if (whatsappResult.success) {
          return { ...whatsappResult, method: 'whatsapp' };
        }
        // Fallback to SMS
        return { ...(await sendSMS(to, message)), method: 'sms' };
      }
      // If email format, use email
      if (to.includes('@')) {
        return { ...(await sendEmailMessage(to, 'Message from RARE 4N', message)), method: 'email' };
      }
    }

    // Explicit method
    switch (method.toLowerCase()) {
      case 'whatsapp':
        return { ...(await sendWhatsAppMessage(to, message)), method: 'whatsapp' };
      case 'sms':
        return { ...(await sendSMS(to, message)), method: 'sms' };
      case 'email':
        return { ...(await sendEmailMessage(to, 'Message from RARE 4N', message)), method: 'email' };
      case 'call':
        return { ...(await makePhoneCall(to, null, message)), method: 'call' };
      default:
        throw new Error(`Unknown communication method: ${method}`);
    }
  } catch (error) {
    console.error('Ultimate communication error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default {
  makePhoneCall,
  sendWhatsAppMessage,
  sendSMS,
  sendEmail: sendEmailMessage,
  ultimateAssistantCommunication,
};
