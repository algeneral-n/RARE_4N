/**
 * PortalAgent - Client Portal Management
 * Handles real-time requests, forms, notifications, and widget updates via Socket.IO.
 */

import { BaseAgent } from './BaseAgent';
import io from 'socket.io-client';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.zien-ai.app';

export class PortalAgent extends BaseAgent {
  private socket: any;

  constructor() {
    super({
      id: 'portal',
      name: 'Portal Agent',
      description: 'Client Portal Management Engine',
      capabilities: [
        'handle_request',
        'update_request',
        'create_invoice',
        'send_form',
        'get_notifications',
        'voice_interaction',
        'send_widget_notification',
      ],
    });
  }

  protected async onInit(): Promise<void> {
    try {
      // إعداد الاتصال بالـ Socket الخاص ببوابة العملاء
      this.socket = io(`${API_URL}/client-portal`, {
        transports: ['websocket'],
        reconnection: true,
        timeout: 20000,
      });

      this.socket.on('connect', () => {
        console.log('[PortalAgent] Socket connection established.');
      });

      this.socket.on('client:request', (data: any) => {
        if (data) this.emit({ type: 'portal:request', data });
      });

      this.socket.on('client:form:response', (data: any) => {
        if (data) this.emit({ type: 'portal:form:response', data });
      });

      this.socket.on('error', (error: any) => {
        console.error('[PortalAgent] Socket error:', error);
        this.emit({ type: 'portal:error', data: error });
      });
    } catch (error) {
      console.error('[PortalAgent] Initialization failed:', error);
    }
  }

  protected async onExecuteAction(action: string, parameters: any): Promise<any> {
    switch (action) {
      case 'send_widget_notification':
        if (!parameters?.clientId || !parameters?.message) throw new Error('Client ID and message required');
        return await this.sendWidgetNotification(parameters.clientId, parameters.message, parameters.data);

      case 'handle_request':
        return new Promise((resolve, reject) => {
          this.socket.emit('client:request:handle', parameters);
          this.socket.once('client:request:handled', resolve);
          this.socket.once('error', reject);
        });

      case 'get_notifications':
        const response = await fetch(`${API_URL}/api/client-portal/notifications`);
        return await response.json();

      default:
        throw new Error(`Action ${action} not supported in PortalAgent`);
    }
  }

  private async sendWidgetNotification(clientId: string, message: string, data?: any): Promise<any> {
    const response = await fetch(`${API_URL}/api/terminal-integration/widget/notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, message, data }),
    });
    return await response.json();
  }

  protected async onStop(): Promise<void> {
    if (this.socket) this.socket.disconnect();
  }
}