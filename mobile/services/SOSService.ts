/**
 * RARE 4N - SOS Service
 * خدمة الطوارئ - Twilio Integration
 */

import { API_URL } from './config';
import { emergencyContactsService } from './EmergencyContactsService';
import { riskDetectionService } from './RiskDetectionService';

export interface SOSRequest {
  type: 'emergency' | 'medical' | 'fire' | 'police' | 'personal';
  message: string;
  location?: { lat: number; lng: number };
  contacts?: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

class SOSService {
  private static instance: SOSService;

  private constructor() {}

  static getInstance(): SOSService {
    if (!SOSService.instance) {
      SOSService.instance = new SOSService();
    }
    return SOSService.instance;
  }

  /**
   * Send emergency WhatsApp message
   */
  async sendEmergencyWhatsApp(request: SOSRequest): Promise<boolean> {
    try {
      const contacts = request.contacts || this.getDefaultContacts(request.type);
      
      const response = await fetch(`${API_URL}/api/sos/twilio/whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: request.type,
          message: request.message,
          location: request.location,
          contacts,
          priority: request.priority,
        }),
      });

      if (!response.ok) {
        throw new Error(`Emergency WhatsApp failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Emergency WhatsApp error:', error);
      return false;
    }
  }

  /**
   * Send emergency SMS
   */
  async sendEmergencySMS(request: SOSRequest): Promise<boolean> {
    try {
      const contacts = request.contacts || this.getDefaultContacts(request.type);
      
      const response = await fetch(`${API_URL}/api/sos/twilio/sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: request.type,
          message: request.message,
          location: request.location,
          contacts,
          priority: request.priority,
        }),
      });

      if (!response.ok) {
        throw new Error(`Emergency SMS failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Emergency SMS error:', error);
      return false;
    }
  }

  /**
   * Make emergency call
   */
  async makeEmergencyCall(request: SOSRequest): Promise<boolean> {
    try {
      const contacts = request.contacts || this.getDefaultContacts(request.type);
      
      const response = await fetch(`${API_URL}/api/sos/twilio/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: request.type,
          message: request.message,
          location: request.location,
          contacts,
          priority: request.priority,
        }),
      });

      if (!response.ok) {
        throw new Error(`Emergency call failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Emergency call error:', error);
      return false;
    }
  }

  /**
   * Detect risk and trigger SOS if needed
   */
  async detectAndTrigger(request: SOSRequest): Promise<boolean> {
    try {
      // Detect risk first
      const analysis = await riskDetectionService.detectRisk(request.message, {
        type: request.type,
        location: request.location,
      });

      if (analysis.detected && analysis.riskLevel.level === 'critical') {
        // Auto-trigger SOS
        await this.sendEmergencyWhatsApp(request);
        await this.sendEmergencySMS(request);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Detect and trigger error:', error);
      return false;
    }
  }

  private getDefaultContacts(type: SOSRequest['type']): string[] {
    const contacts = emergencyContactsService.getContacts();
    switch (type) {
      case 'police':
        return [contacts.find((c) => c.type === 'police')?.phone || '999'].filter(Boolean);
      case 'medical':
        return [contacts.find((c) => c.type === 'ambulance')?.phone || '997'].filter(Boolean);
      case 'fire':
        return [contacts.find((c) => c.type === 'fire')?.phone || '998'].filter(Boolean);
      default:
        return contacts.map((c) => c.phone).filter(Boolean);
    }
  }
}

export const sosService = SOSService.getInstance();
export default sosService;

 * RARE 4N - SOS Service
 * خدمة الطوارئ - Twilio Integration
 */

import { API_URL } from './config';
import { emergencyContactsService } from './EmergencyContactsService';
import { riskDetectionService } from './RiskDetectionService';

export interface SOSRequest {
  type: 'emergency' | 'medical' | 'fire' | 'police' | 'personal';
  message: string;
  location?: { lat: number; lng: number };
  contacts?: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

class SOSService {
  private static instance: SOSService;

  private constructor() {}

  static getInstance(): SOSService {
    if (!SOSService.instance) {
      SOSService.instance = new SOSService();
    }
    return SOSService.instance;
  }

  /**
   * Send emergency WhatsApp message
   */
  async sendEmergencyWhatsApp(request: SOSRequest): Promise<boolean> {
    try {
      const contacts = request.contacts || this.getDefaultContacts(request.type);
      
      const response = await fetch(`${API_URL}/api/sos/twilio/whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: request.type,
          message: request.message,
          location: request.location,
          contacts,
          priority: request.priority,
        }),
      });

      if (!response.ok) {
        throw new Error(`Emergency WhatsApp failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Emergency WhatsApp error:', error);
      return false;
    }
  }

  /**
   * Send emergency SMS
   */
  async sendEmergencySMS(request: SOSRequest): Promise<boolean> {
    try {
      const contacts = request.contacts || this.getDefaultContacts(request.type);
      
      const response = await fetch(`${API_URL}/api/sos/twilio/sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: request.type,
          message: request.message,
          location: request.location,
          contacts,
          priority: request.priority,
        }),
      });

      if (!response.ok) {
        throw new Error(`Emergency SMS failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Emergency SMS error:', error);
      return false;
    }
  }

  /**
   * Make emergency call
   */
  async makeEmergencyCall(request: SOSRequest): Promise<boolean> {
    try {
      const contacts = request.contacts || this.getDefaultContacts(request.type);
      
      const response = await fetch(`${API_URL}/api/sos/twilio/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: request.type,
          message: request.message,
          location: request.location,
          contacts,
          priority: request.priority,
        }),
      });

      if (!response.ok) {
        throw new Error(`Emergency call failed: ${response.status}`);
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Emergency call error:', error);
      return false;
    }
  }

  /**
   * Detect risk and trigger SOS if needed
   */
  async detectAndTrigger(request: SOSRequest): Promise<boolean> {
    try {
      // Detect risk first
      const analysis = await riskDetectionService.detectRisk(request.message, {
        type: request.type,
        location: request.location,
      });

      if (analysis.detected && analysis.riskLevel.level === 'critical') {
        // Auto-trigger SOS
        await this.sendEmergencyWhatsApp(request);
        await this.sendEmergencySMS(request);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Detect and trigger error:', error);
      return false;
    }
  }

  private getDefaultContacts(type: SOSRequest['type']): string[] {
    const contacts = emergencyContactsService.getContacts();
    switch (type) {
      case 'police':
        return [contacts.find((c) => c.type === 'police')?.phone || '999'].filter(Boolean);
      case 'medical':
        return [contacts.find((c) => c.type === 'ambulance')?.phone || '997'].filter(Boolean);
      case 'fire':
        return [contacts.find((c) => c.type === 'fire')?.phone || '998'].filter(Boolean);
      default:
        return contacts.map((c) => c.phone).filter(Boolean);
    }
  }
}

export const sosService = SOSService.getInstance();
export default sosService;


