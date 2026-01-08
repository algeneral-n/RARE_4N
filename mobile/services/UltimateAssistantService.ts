/**
 * RARE 4N - Ultimate Assistant Service
 * خدمة المساعد المتقدم - Twilio Integration
 */

import { API_URL } from './config';

export interface TwilioMessage {
  to: string;
  from?: string;
  body: string;
  type: 'whatsapp' | 'sms';
}

export interface TwilioCall {
  to: string;
  from?: string;
  message?: string;
}

class UltimateAssistantService {
  private static instance: UltimateAssistantService;

  private constructor() {}

  static getInstance(): UltimateAssistantService {
    if (!UltimateAssistantService.instance) {
      UltimateAssistantService.instance = new UltimateAssistantService();
    }
    return UltimateAssistantService.instance;
  }

  /**
   * Send WhatsApp message
   */
  async sendWhatsApp(message: TwilioMessage): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/ultimate-assistant/twilio/whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: message.to,
          from: message.from,
          body: message.body,
        }),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp send failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('WhatsApp send error:', error);
      return false;
    }
  }

  /**
   * Send SMS message
   */
  async sendSMS(message: TwilioMessage): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/ultimate-assistant/twilio/sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: message.to,
          from: message.from,
          body: message.body,
        }),
      });

      if (!response.ok) {
        throw new Error(`SMS send failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('SMS send error:', error);
      return false;
    }
  }

  /**
   * Make phone call
   */
  async makeCall(call: TwilioCall): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/ultimate-assistant/twilio/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: call.to,
          from: call.from,
          message: call.message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Call failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Call error:', error);
      return false;
    }
  }

  /**
   * Get communication history
   */
  async getHistory(type?: 'whatsapp' | 'sms' | 'call'): Promise<any[]> {
    try {
      const url = type
        ? `${API_URL}/api/ultimate-assistant/history?type=${type}`
        : `${API_URL}/api/ultimate-assistant/history`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Get history failed: ${response.status}`);
      }

      const data = await response.json();
      return data.history || [];
    } catch (error) {
      console.error('Get history error:', error);
      return [];
    }
  }
}

export const ultimateAssistantService = UltimateAssistantService.getInstance();
export default ultimateAssistantService;

 * RARE 4N - Ultimate Assistant Service
 * خدمة المساعد المتقدم - Twilio Integration
 */

import { API_URL } from './config';

export interface TwilioMessage {
  to: string;
  from?: string;
  body: string;
  type: 'whatsapp' | 'sms';
}

export interface TwilioCall {
  to: string;
  from?: string;
  message?: string;
}

class UltimateAssistantService {
  private static instance: UltimateAssistantService;

  private constructor() {}

  static getInstance(): UltimateAssistantService {
    if (!UltimateAssistantService.instance) {
      UltimateAssistantService.instance = new UltimateAssistantService();
    }
    return UltimateAssistantService.instance;
  }

  /**
   * Send WhatsApp message
   */
  async sendWhatsApp(message: TwilioMessage): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/ultimate-assistant/twilio/whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: message.to,
          from: message.from,
          body: message.body,
        }),
      });

      if (!response.ok) {
        throw new Error(`WhatsApp send failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('WhatsApp send error:', error);
      return false;
    }
  }

  /**
   * Send SMS message
   */
  async sendSMS(message: TwilioMessage): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/ultimate-assistant/twilio/sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: message.to,
          from: message.from,
          body: message.body,
        }),
      });

      if (!response.ok) {
        throw new Error(`SMS send failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('SMS send error:', error);
      return false;
    }
  }

  /**
   * Make phone call
   */
  async makeCall(call: TwilioCall): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/ultimate-assistant/twilio/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: call.to,
          from: call.from,
          message: call.message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Call failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Call error:', error);
      return false;
    }
  }

  /**
   * Get communication history
   */
  async getHistory(type?: 'whatsapp' | 'sms' | 'call'): Promise<any[]> {
    try {
      const url = type
        ? `${API_URL}/api/ultimate-assistant/history?type=${type}`
        : `${API_URL}/api/ultimate-assistant/history`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Get history failed: ${response.status}`);
      }

      const data = await response.json();
      return data.history || [];
    } catch (error) {
      console.error('Get history error:', error);
      return [];
    }
  }
}

export const ultimateAssistantService = UltimateAssistantService.getInstance();
export default ultimateAssistantService;


