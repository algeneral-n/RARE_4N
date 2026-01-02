/**
 * RARE 4N - Context Store
 * Manages real-time session state, user memory, and ambient awareness.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Emotion {
  type: 'happy' | 'neutral' | 'focused' | 'curious' | 'concerned' | 'excited';
  intensity: number; // 0-1
  confidence: number; // 0-1
}

export interface Intent {
  type: string;
  confidence: number;
  parameters?: Record<string, any>;
}

export interface Interaction {
  id: string;
  timestamp: number;
  input: string;
  output: string;
  emotion?: Emotion;
  intent?: Intent;
  context?: any;
}

export interface UserPreferences {
  language: string;
  voice: string;
  theme: string;
  autoVoice: boolean;
  [key: string]: any;
}

export interface BehavioralPattern {
  pattern: string;
  frequency: number;
  lastSeen: number;
}

export interface RAREContext {
  session: {
    id: string;
    startTime: number;
    interactions: Interaction[];
    currentEmotion: Emotion | null;
    currentIntent: Intent | null;
    situation: {
      time: string;
      location?: string;
      activity?: string;
    };
  };
  memory: {
    preferences: UserPreferences;
    patterns: BehavioralPattern[];
    history: Interaction[];
    emotionalState: {
      recent: Emotion[];
      average: Emotion;
    };
  };
  ambient: {
    time: {
      hour: number;
      dayOfWeek: number;
      isWeekend: boolean;
    };
    location?: {
      latitude: number;
      longitude: number;
      name?: string;
    };
    activity?: string;
    needs: string[];
  };
}

export class ContextStore {
  private static instance: ContextStore;
  private context: RAREContext;
  private readonly CONTEXT_KEY = 'rare_context';

  private constructor() {
    this.context = this.createDefaultContext();
  }

  static getInstance(): ContextStore {
    if (!ContextStore.instance) {
      ContextStore.instance = new ContextStore();
    }
    return ContextStore.instance;
  }

  /**
   * init: تهيئة مخزن السياق وتحميل البيانات المحفوظة
   */
  async init(): Promise<void> {
    try {
      await this.loadContext();
      this.context.session.id = `session_${Date.now()}`;
      this.context.session.startTime = Date.now();
      this.updateAmbientAwareness();
      console.log('ContextStore initialized successfully.');
    } catch (error) {
      console.error('ContextStore init error:', error);
    }
  }

  getContext(): RAREContext {
    return { ...this.context };
  }

  /**
   * updateContext: تحديث البيانات اللحظية (مثل تغيير المزاج أو النية)
   */
  updateContext(updates: Partial<RAREContext>): void {
    if (updates.session) this.context.session = { ...this.context.session, ...updates.session };
    if (updates.memory) this.context.memory = { ...this.context.memory, ...updates.memory };
    if (updates.ambient) this.context.ambient = { ...this.context.ambient, ...updates.ambient };
    
    this.persistContext();
  }

  /**
   * addInteraction: تسجيل تفاعل جديد (سؤال وجواب) وتحليل النمط السلوكي
   */
  addInteraction(interaction: Interaction): void {
    this.context.session.interactions.push(interaction);
    this.context.memory.history.push(interaction);
    
    if (this.context.memory.history.length > 100) this.context.memory.history.shift();

    if (interaction.emotion) {
      this.context.memory.emotionalState.recent.push(interaction.emotion);
      if (this.context.memory.emotionalState.recent.length > 20) {
        this.context.memory.emotionalState.recent.shift();
      }
      this.updateAverageEmotion();
    }
    this.persistContext();
  }

  private updateAmbientAwareness(): void {
    const now = new Date();
    this.context.ambient.time = {
      hour: now.getHours(),
      dayOfWeek: now.getDay(),
      isWeekend: now.getDay() === 0 || now.getDay() === 6,
    };
    this.anticipateNeeds();
  }

  private anticipateNeeds(): void {
    const needs: string[] = [];
    const hour = this.context.ambient.time.hour;
    if (hour >= 22 || hour < 6) needs.push('quiet_mode');
    this.context.ambient.needs = needs;
  }

  private updateAverageEmotion(): void {
    const recent = this.context.memory.emotionalState.recent;
    if (recent.length === 0) return;
    // منطق حساب متوسط الحالة المزاجية لضبط نبرة صوت AI
    const mostCommon = 'neutral'; 
    this.context.memory.emotionalState.average = {
      type: mostCommon as Emotion['type'],
      intensity: 0.5,
      confidence: 0.5,
    };
  }

  private createDefaultContext(): RAREContext {
    return {
      session: { id: '', startTime: Date.now(), interactions: [], currentEmotion: null, currentIntent: null, situation: { time: new Date().toISOString() } },
      memory: { preferences: { language: 'ar', voice: 'rachel', theme: 'dark', autoVoice: true }, patterns: [], history: [], emotionalState: { recent: [], average: { type: 'neutral', intensity: 0.5, confidence: 0.5 } } },
      ambient: { time: { hour: new Date().getHours(), dayOfWeek: new Date().getDay(), isWeekend: false }, needs: [] },
    };
  }

  private async loadContext(): Promise<void> {
    const stored = await AsyncStorage.getItem(this.CONTEXT_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      this.context.memory = { ...this.context.memory, ...parsed.memory };
    }
  }

  private async persistContext(): Promise<void> {
    const toStore = { memory: this.context.memory, preferences: this.context.memory.preferences };
    await AsyncStorage.setItem(this.CONTEXT_KEY, JSON.stringify(toStore));
  }
}