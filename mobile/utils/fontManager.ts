/**
 * RARE 4N - Font Manager
 * إدارة الخطوط المتنسقة
 */

import { storage } from './storage';
import { FONTS_LIBRARY, Font } from '../libraries/fonts';

const AVAILABLE_FONTS: Font[] = FONTS_LIBRARY;

class FontManager {
  private static instance: FontManager;
  private selectedFontId: string = 'system';

  private constructor() {}

  static getInstance(): FontManager {
    if (!FontManager.instance) {
      FontManager.instance = new FontManager();
    }
    return FontManager.instance;
  }

  async getSelectedFont(): Promise<Font | null> {
    try {
      const fontId = await storage.get<string>('font:id') || 'system';
      this.selectedFontId = fontId;
      const font = AVAILABLE_FONTS.find(f => f.id === fontId);
      return font || AVAILABLE_FONTS[0];
    } catch (error) {
      console.error('Error getting selected font:', error);
      return AVAILABLE_FONTS[0];
    }
  }

  async setSelectedFont(fontId: string): Promise<boolean> {
    try {
      const font = AVAILABLE_FONTS.find(f => f.id === fontId);
      if (!font) {
        console.warn('Font not found:', fontId);
        return false;
      }
      await storage.set('font:id', font.id);
      this.selectedFontId = font.id;
      return true;
    } catch (error) {
      console.error('Error setting selected font:', error);
      return false;
    }
  }

  getAllFonts(): Font[] {
    return AVAILABLE_FONTS;
  }
}

export const fontManager = FontManager.getInstance();
export default fontManager;


 * إدارة الخطوط المتنسقة
 */

import { storage } from './storage';
import { FONTS_LIBRARY, Font } from '../libraries/fonts';

const AVAILABLE_FONTS: Font[] = FONTS_LIBRARY;

class FontManager {
  private static instance: FontManager;
  private selectedFontId: string = 'system';

  private constructor() {}

  static getInstance(): FontManager {
    if (!FontManager.instance) {
      FontManager.instance = new FontManager();
    }
    return FontManager.instance;
  }

  async getSelectedFont(): Promise<Font | null> {
    try {
      const fontId = await storage.get<string>('font:id') || 'system';
      this.selectedFontId = fontId;
      const font = AVAILABLE_FONTS.find(f => f.id === fontId);
      return font || AVAILABLE_FONTS[0];
    } catch (error) {
      console.error('Error getting selected font:', error);
      return AVAILABLE_FONTS[0];
    }
  }

  async setSelectedFont(fontId: string): Promise<boolean> {
    try {
      const font = AVAILABLE_FONTS.find(f => f.id === fontId);
      if (!font) {
        console.warn('Font not found:', fontId);
        return false;
      }
      await storage.set('font:id', font.id);
      this.selectedFontId = font.id;
      return true;
    } catch (error) {
      console.error('Error setting selected font:', error);
      return false;
    }
  }

  getAllFonts(): Font[] {
    return AVAILABLE_FONTS;
  }
}

export const fontManager = FontManager.getInstance();
export default fontManager;

