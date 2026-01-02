/**
 * RARE 4N - Voice Library Manager
 * إدارة مكتبة أصوات RARE
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import voicesConfig from '../assets/sounds/voices.json';

export interface Voice {
  id: string;
  name: string;
  nameEn: string;
  files: string[];
  dialect: string;
  description: string;
  descriptionEn: string;
}

class VoiceLibraryManager {
  private voices: Voice[] = [];
  private selectedVoiceId: string | null = null;
  private readonly STORAGE_KEY = 'rare_selected_voice';

  constructor() {
    this.loadVoices();
  }

  /**
   * تحميل الأصوات من ملف التكوين
   */
  private loadVoices() {
    try {
      this.voices = (voicesConfig as any).voices || [];
      this.selectedVoiceId = (voicesConfig as any).defaultVoice || null;
    } catch (error) {
      console.error('[VoiceLibraryManager] Error loading voices:', error);
      this.voices = [];
    }
  }

  /**
   * الحصول على جميع الأصوات المتاحة
   */
  getAllVoices(): Voice[] {
    return this.voices;
  }

  /**
   * الحصول على صوت محدد بالـ ID
   */
  getVoiceById(id: string): Voice | null {
    return this.voices.find(v => v.id === id) || null;
  }

  /**
   * الحصول على الأصوات حسب اللهجة
   */
  getVoicesByDialect(dialect: string): Voice[] {
    return this.voices.filter(v => v.dialect === dialect);
  }

  /**
   * الحصول على الصوت المحدد حالياً
   */
  async getSelectedVoice(): Promise<Voice | null> {
    try {
      const savedId = await AsyncStorage.getItem(this.STORAGE_KEY);
      const voiceId = savedId || this.selectedVoiceId;
      
      if (voiceId) {
        return this.getVoiceById(voiceId);
      }
      
      return this.voices[0] || null;
    } catch (error) {
      console.error('[VoiceLibraryManager] Error getting selected voice:', error);
      return this.voices[0] || null;
    }
  }

  /**
   * تعيين الصوت المحدد
   */
  async setSelectedVoice(voiceId: string): Promise<boolean> {
    try {
      const voice = this.getVoiceById(voiceId);
      if (!voice) {
        console.warn(`[VoiceLibraryManager] Voice not found: ${voiceId}`);
        return false;
      }

      await AsyncStorage.setItem(this.STORAGE_KEY, voiceId);
      this.selectedVoiceId = voiceId;
      
      console.log(`[VoiceLibraryManager] Voice selected: ${voice.name} (${voiceId})`);
      return true;
    } catch (error) {
      console.error('[VoiceLibraryManager] Error setting selected voice:', error);
      return false;
    }
  }

  /**
   * الحصول على مسار ملف صوتي
   */
  getVoiceFilePath(voiceId: string, fileIndex: number = 0): string {
    const voice = this.getVoiceById(voiceId);
    if (!voice || !voice.files || voice.files.length === 0) {
      return '';
    }

    const fileName = voice.files[fileIndex] || voice.files[0];
    // في React Native/Expo، نستخدم require أو Asset
    return `../assets/sounds/${fileName}`;
  }

  /**
   * تحميل ملف صوتي كـ Asset
   */
  async loadVoiceAsset(voiceId: string, fileIndex: number = 0): Promise<Asset | null> {
    try {
      const voice = this.getVoiceById(voiceId);
      if (!voice || !voice.files || voice.files.length === 0) {
        return null;
      }

      const fileName = voice.files[fileIndex] || voice.files[0];
      // في Expo، يمكن استخدام require للـ assets
      // أو استخدام Asset.fromModule
      return null; // سيتم التعامل معه في الكود الذي يستخدم الصوت
    } catch (error) {
      console.error('[VoiceLibraryManager] Error loading voice asset:', error);
      return null;
    }
  }

  /**
   * الحصول على الصوت الافتراضي
   */
  getDefaultVoice(): Voice | null {
    const defaultId = (voicesConfig as any).defaultVoice;
    if (defaultId) {
      return this.getVoiceById(defaultId);
    }
    return this.voices[0] || null;
  }

  /**
   * البحث عن أصوات
   */
  searchVoices(query: string): Voice[] {
    const lowerQuery = query.toLowerCase();
    return this.voices.filter(voice => 
      voice.name.toLowerCase().includes(lowerQuery) ||
      voice.nameEn.toLowerCase().includes(lowerQuery) ||
      voice.description.toLowerCase().includes(lowerQuery) ||
      voice.descriptionEn.toLowerCase().includes(lowerQuery) ||
      voice.dialect.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * الحصول على إحصائيات الأصوات
   */
  getStats() {
    return {
      total: this.voices.length,
      byDialect: this.voices.reduce((acc, voice) => {
        acc[voice.dialect] = (acc[voice.dialect] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

// Export singleton instance
const voiceLibraryManager = new VoiceLibraryManager();
export default voiceLibraryManager;





















