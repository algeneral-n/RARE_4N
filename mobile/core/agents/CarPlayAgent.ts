/**
 * RARE 4N - CarPlay Agent
 * Manages Apple CarPlay integration for smart navigation, voice commands, and media control.
 * Connects the RARE Kernel to the vehicle's infotainment system.
 */

import { BaseAgent } from './BaseAgent';
import { API_URL } from '../../services/config';

export class CarPlayAgent extends BaseAgent {
  private socket: any = null;

  constructor() {
    super({
      id: 'carplay',
      name: 'CarPlay Agent',
      description: 'CarPlay integration for navigation, voice, and media control',
      capabilities: [
        'carplay_connect',
        'carplay_navigate',
        'carplay_voice',
        'carplay_media',
        'carplay_maps',
      ],
    });
  }

  /**
   * init: تهيئة العميل وتجهيز الاتصال بالنظام الأصلي للسيارة
   */
  async init(): Promise<void> {
    await super.init();
    console.log('[CarPlayAgent] Initialized and ready for vehicle pairing');
  }

  /**
   * execute: تنفيذ الأوامر الصادرة من الـ Cognitive Loop (مثل "وديني البيت")
   */
  async execute(action: string, parameters: any): Promise<any> {
    try {
      switch (action) {
        case 'carplay_connect':
          return await this.connect(parameters);
        case 'carplay_navigate':
          return await this.navigate(parameters);
        case 'carplay_voice':
          return await this.handleVoice(parameters);
        case 'carplay_media':
          return await this.handleMedia(parameters);
        case 'carplay_maps':
          return await this.showMaps(parameters);
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error: any) {
      this.emit('agent:carplay:error', { error: error.message || 'CarPlay operation failed' });
      throw error;
    }
  }

  /**
   * connect: الربط مع CarPlay والتأكد من توافق الجهاز
   */
  private async connect(parameters: any): Promise<any> {
    const isAvailable = await this.checkCarPlayAvailability();
    if (!isAvailable) {
      throw new Error('CarPlay is not supported on this platform/device');
    }

    const response = await fetch(`${API_URL}/api/carplay/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: parameters.deviceId,
        vehicleInfo: parameters.vehicleInfo,
      }),
    });

    const data = await response.json();
    if (data.success) {
      this.emit('agent:carplay:response', { connected: true, sessionId: data.sessionId });
      return data;
    }
    throw new Error(data.error || 'Connection to vehicle failed');
  }

  /**
   * navigate: التحكم في الخرائط والملاحة الذكية
   */
  private async navigate(parameters: any): Promise<any> {
    const { destination, routeType } = parameters;
    if (!destination) throw new Error('Destination is required');

    const response = await fetch(`${API_URL}/api/carplay/navigate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination, routeType: routeType || 'driving' }),
    });

    const data = await response.json();
    if (data.success) {
      this.emit('agent:carplay:response', { navigation: data.route });
      return data;
    }
    throw new Error(data.error || 'Navigation failed');
  }

  /**
   * checkCarPlayAvailability: التأكد أن الكود يعمل على آيفون وبإصدار مناسب
   */
  private async checkCarPlayAvailability(): Promise<boolean> {
    const { Platform } = require('react-native');
    if (Platform.OS !== 'ios') return false;

    try {
      const { NativeModules } = require('react-native');
      if (NativeModules.CarPlayModule) {
        return await NativeModules.CarPlayModule.isCarPlayAvailable();
      }
      // Fallback: CarPlay requires iOS 12+
      const iosVersion = parseFloat(Platform.Version);
      return iosVersion >= 12.0;
    } catch (error) {
      return false;
    }
  }

  async stop(): Promise<void> {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    console.log('[CarPlayAgent] Connection terminated');
  }
}