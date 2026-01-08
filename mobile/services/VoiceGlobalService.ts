/**
 * RARE 4N - Voice Global Service
 * خدمة الصوت العالمية - تفعيل تلقائي على جميع الصفحات
 */

import { RAREKernel } from '../core/RAREKernel';
import { voiceConsciousness } from '../core/services/VoiceConsciousness';
import { storage } from '../utils/storage';

class VoiceGlobalService {
  private static instance: VoiceGlobalService;
  private kernel: RAREKernel;
  private isEnabled: boolean = false;
  private currentScreen: string = '';

  private constructor() {
    this.kernel = RAREKernel.getInstance();
  }

  static getInstance(): VoiceGlobalService {
    if (!VoiceGlobalService.instance) {
      VoiceGlobalService.instance = new VoiceGlobalService();
    }
    return VoiceGlobalService.instance;
  }

  async init(): Promise<void> {
    try {
      const saved = await storage.get<boolean>('voice:global:enabled');
      if (saved !== null) {
        this.isEnabled = saved;
      }

      if (this.isEnabled) {
        await this.enable();
      }
    } catch (error) {
      console.error('VoiceGlobalService init error:', error);
    }
  }

  async enable(): Promise<void> {
    try {
      this.isEnabled = true;
      await storage.set('voice:global:enabled', true);
      
      await voiceConsciousness.activate();
      
      this.kernel.emit({
        type: 'voice:global:enabled',
        data: { enabled: true },
        source: 'voice-global-service',
      });
    } catch (error) {
      console.error('VoiceGlobalService enable error:', error);
    }
  }

  async disable(): Promise<void> {
    try {
      this.isEnabled = false;
      await storage.set('voice:global:enabled', false);
      
      await voiceConsciousness.deactivate();
      
      this.kernel.emit({
        type: 'voice:global:disabled',
        data: { enabled: false },
        source: 'voice-global-service',
      });
    } catch (error) {
      console.error('VoiceGlobalService disable error:', error);
    }
  }

  async toggle(): Promise<boolean> {
    if (this.isEnabled) {
      await this.disable();
      return false;
    } else {
      await this.enable();
      return true;
    }
  }

  updateScreen(screenName: string): void {
    this.currentScreen = screenName;
    voiceConsciousness.updateScreenContext(screenName);
  }

  isVoiceEnabled(): boolean {
    return this.isEnabled;
  }
}

export const voiceGlobalService = VoiceGlobalService.getInstance();
export default voiceGlobalService;

 * RARE 4N - Voice Global Service
 * خدمة الصوت العالمية - تفعيل تلقائي على جميع الصفحات
 */

import { RAREKernel } from '../core/RAREKernel';
import { voiceConsciousness } from '../core/services/VoiceConsciousness';
import { storage } from '../utils/storage';

class VoiceGlobalService {
  private static instance: VoiceGlobalService;
  private kernel: RAREKernel;
  private isEnabled: boolean = false;
  private currentScreen: string = '';

  private constructor() {
    this.kernel = RAREKernel.getInstance();
  }

  static getInstance(): VoiceGlobalService {
    if (!VoiceGlobalService.instance) {
      VoiceGlobalService.instance = new VoiceGlobalService();
    }
    return VoiceGlobalService.instance;
  }

  async init(): Promise<void> {
    try {
      const saved = await storage.get<boolean>('voice:global:enabled');
      if (saved !== null) {
        this.isEnabled = saved;
      }

      if (this.isEnabled) {
        await this.enable();
      }
    } catch (error) {
      console.error('VoiceGlobalService init error:', error);
    }
  }

  async enable(): Promise<void> {
    try {
      this.isEnabled = true;
      await storage.set('voice:global:enabled', true);
      
      await voiceConsciousness.activate();
      
      this.kernel.emit({
        type: 'voice:global:enabled',
        data: { enabled: true },
        source: 'voice-global-service',
      });
    } catch (error) {
      console.error('VoiceGlobalService enable error:', error);
    }
  }

  async disable(): Promise<void> {
    try {
      this.isEnabled = false;
      await storage.set('voice:global:enabled', false);
      
      await voiceConsciousness.deactivate();
      
      this.kernel.emit({
        type: 'voice:global:disabled',
        data: { enabled: false },
        source: 'voice-global-service',
      });
    } catch (error) {
      console.error('VoiceGlobalService disable error:', error);
    }
  }

  async toggle(): Promise<boolean> {
    if (this.isEnabled) {
      await this.disable();
      return false;
    } else {
      await this.enable();
      return true;
    }
  }

  updateScreen(screenName: string): void {
    this.currentScreen = screenName;
    voiceConsciousness.updateScreenContext(screenName);
  }

  isVoiceEnabled(): boolean {
    return this.isEnabled;
  }
}

export const voiceGlobalService = VoiceGlobalService.getInstance();
export default voiceGlobalService;


