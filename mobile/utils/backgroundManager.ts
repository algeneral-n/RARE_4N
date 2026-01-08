/**
 * RARE 4N - Background Manager
 * إدارة الخلفيات
 */

import { storage } from './storage';
import { DEFAULT_BACKGROUND } from '../libraries/backgrounds';

class BackgroundManager {
  private static instance: BackgroundManager;
  private currentBackground: string = DEFAULT_BACKGROUND.id;

  private constructor() {}

  static getInstance(): BackgroundManager {
    if (!BackgroundManager.instance) {
      BackgroundManager.instance = new BackgroundManager();
    }
    return BackgroundManager.instance;
  }

  async getBackground(): Promise<string> {
    try {
      const saved = await storage.get<string>('background:selected');
      if (saved) {
        this.currentBackground = saved;
      }
      return this.currentBackground;
    } catch (error) {
      console.error('Error getting background:', error);
      return DEFAULT_BACKGROUND.id;
    }
  }

  async setBackground(backgroundId: string): Promise<boolean> {
    try {
      this.currentBackground = backgroundId;
      await storage.set('background:selected', backgroundId);
      return true;
    } catch (error) {
      console.error('Error setting background:', error);
      return false;
    }
  }

  getCurrentBackground(): string {
    return this.currentBackground;
  }
}

export const backgroundManager = BackgroundManager.getInstance();
export default backgroundManager;

 * RARE 4N - Background Manager
 * إدارة الخلفيات
 */

import { storage } from './storage';
import { DEFAULT_BACKGROUND } from '../libraries/backgrounds';

class BackgroundManager {
  private static instance: BackgroundManager;
  private currentBackground: string = DEFAULT_BACKGROUND.id;

  private constructor() {}

  static getInstance(): BackgroundManager {
    if (!BackgroundManager.instance) {
      BackgroundManager.instance = new BackgroundManager();
    }
    return BackgroundManager.instance;
  }

  async getBackground(): Promise<string> {
    try {
      const saved = await storage.get<string>('background:selected');
      if (saved) {
        this.currentBackground = saved;
      }
      return this.currentBackground;
    } catch (error) {
      console.error('Error getting background:', error);
      return DEFAULT_BACKGROUND.id;
    }
  }

  async setBackground(backgroundId: string): Promise<boolean> {
    try {
      this.currentBackground = backgroundId;
      await storage.set('background:selected', backgroundId);
      return true;
    } catch (error) {
      console.error('Error setting background:', error);
      return false;
    }
  }

  getCurrentBackground(): string {
    return this.currentBackground;
  }
}

export const backgroundManager = BackgroundManager.getInstance();
export default backgroundManager;


