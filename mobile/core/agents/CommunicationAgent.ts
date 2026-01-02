/**
 * CommunicationAgent - RARE 4N
 * Integrated communication hub for Phone Calls, Email, WhatsApp, and SMS.
 * Includes the "Ultimate Assistant" logic for family and automated messaging.
 */

import { BaseAgent } from './BaseAgent';
import * as Linking from 'expo-linking';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.zien-ai.app';

// Family members data - Centralized for assistant access
const FAMILY_MEMBERS = {
  NADER: { name: 'Nader', phone: '+971529211077', email: 'GM@ZIEN-AI.APP', whatsapp: '+971529211077' },
  OMY: { name: 'Omy', phone: '', email: '', whatsapp: '' },
  NARIMAN: { name: 'Nariman', phone: '', email: '', whatsapp: '' },
  NADA: { name: 'Nada', phone: '', email: '', whatsapp: '' },
  ZIEN: { name: 'Zien', phone: '', email: '', whatsapp: '' },
  TAMARA: { name: 'Tamara', phone: '', email: '', whatsapp: '' },
  OMAR: { name: 'Omar', phone: '', email: '', whatsapp: '' },
  KAYAN: { name: 'Kayan', phone: '', email: '', whatsapp: '' },
};

export class CommunicationAgent extends BaseAgent {
  constructor() {
    super({
      id: 'communication',
      name: 'Communication Agent',
      description: 'Ultimate Assistant - Multi-channel Communication Hub',
      capabilities: [
        'make_phone_call',
        'send_email',
        'send_whatsapp',
        'send_sms',
        'contact_family_member',
        'ultimate_assistant',
      ],
    });
  }

  protected async onExecuteAction(action: string, parameters: any): Promise<any> {
    switch (action) {
      case 'make_phone_call':
        return await this.makePhoneCall(parameters);
      case 'send_email':
        return await this.sendEmail(parameters);
      case 'send_whatsapp':
        return await this.sendWhatsApp(parameters);
      case 'send_sms':
        return await this.sendSMS(parameters);
      case 'contact_family_member':
        return await this.contactFamilyMember(parameters);
      case 'ultimate_assistant':
        return await this.ultimateAssistant(parameters);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  /**
   * makePhoneCall: Triggers a call via backend (Twilio) or native dialer.
   */
  private async makePhoneCall(parameters: any): Promise<any> {
    const { phone, message } = parameters;
    if (!phone) throw new Error('Phone number is required');

    try {
      if (message) {
        const response = await fetch(`${API_URL}/api/communication/call`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: phone, message }),
        });
        const json = await response.json();
        if (json.success) return json;
      }

      const phoneUrl = `tel:${phone}`;
      if (await Linking.canOpenURL(phoneUrl)) {
        await Linking.openURL(phoneUrl);
        return { success: true, method: 'native_dialer' };
      }
      throw new Error('Cannot open native phone dialer');
    } catch (error) {
      this.emit('agent:communication:error', { error: String(error) });
      throw error;
    }
  }

  /**
   * sendWhatsApp: Sends message via API or native WhatsApp app.
   */
  private async sendWhatsApp(parameters: any): Promise<any> {
    const { phone, message, mediaUrl } = parameters;
    if (!phone || !message) throw new Error('Phone and message required');

    try {
      const response = await fetch(`${API_URL}/api/communication/whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: phone, message, mediaUrl }),
      });
      const json = await response.json();
      if (json.success) return json;

      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      if (await Linking.canOpenURL(whatsappUrl)) {
        await Linking.openURL(whatsappUrl);
        return { success: true, method: 'native_whatsapp' };
      }
      throw new Error('WhatsApp not installed or supported');
    } catch (error) {
      this.emit('agent:communication:error', { error: String(error) });
      throw error;
    }
  }

  /**
   * contactFamilyMember: Handles specific logic for pre-defined family members.
   */
  private async contactFamilyMember(parameters: any): Promise<any> {
    const { member, method, message } = parameters;
    const memberData = FAMILY_MEMBERS[member.toUpperCase() as keyof typeof FAMILY_MEMBERS];
    
    if (!memberData) throw new Error(`Family member ${member} not found`);
    const contactMethod = (method || 'whatsapp').toLowerCase();

    switch (contactMethod) {
      case 'call':
        return await this.makePhoneCall({ phone: memberData.phone, message });
      case 'whatsapp':
        return await this.sendWhatsApp({ 
          phone: memberData.whatsapp, 
          message: message || `Hello ${memberData.name}, this is an automated message from Nader's assistant.` 
        });
      default:
        throw new Error(`Method ${contactMethod} not supported for family contact`);
    }
  }

  /**
   * ultimateAssistant: Master controller for all-in-one smart communication.
   */
  private async ultimateAssistant(parameters: any): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/communication/ultimate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parameters),
      });
      return await response.json();
    } catch (error) {
      this.emit('agent:communication:error', { error: String(error) });
      throw error;
    }
  }
}