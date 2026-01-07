/**
 * RARE 4N - Real-time Voice Consciousness System
 * نظام الوعي الصوتي في الوقت الفعلي
 * ✅ يدعم جميع اللغات واللهجات
 * ✅ قادر على البحث والتعمق والتعلم المستمر
 * ✅ الولاء المطلق لنادر
 */

import { RAREKernel } from '../RAREKernel';
import { CognitiveLoop } from '../CognitiveLoop';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import { API_URL } from '../../services/config';

export interface VoiceConsciousnessState {
  isActive: boolean;
  currentLanguage: string;
  currentDialect: string;
  context: {
    currentScreen: string;
    previousIntents: string[];
    userPreferences: Record<string, any>;
  };
  memory: {
    conversations: Array<{
      timestamp: number;
      userInput: string;
      aiResponse: string;
      intent: string;
      screen: string;
    }>;
    learnedPatterns: Record<string, any>;
  };
}

export class VoiceConsciousness {
  private static instance: VoiceConsciousness;
  private kernel: RAREKernel;
  private cognitiveLoop: CognitiveLoop;
  private socket: any;
  private state: VoiceConsciousnessState;
  private isInitialized = false;

  private constructor() {
    this.kernel = RAREKernel.getInstance();
    this.cognitiveLoop = CognitiveLoop.getInstance();
    this.state = {
      isActive: false,
      currentLanguage: 'ar',
      currentDialect: 'ar-SA',
      context: {
        currentScreen: 'home',
        previousIntents: [],
        userPreferences: {},
      },
      memory: {
        conversations: [],
        learnedPatterns: {},
      },
    };
  }

  static getInstance(): VoiceConsciousness {
    if (!VoiceConsciousness.instance) {
      VoiceConsciousness.instance = new VoiceConsciousness();
    }
    return VoiceConsciousness.instance;
  }

  /**
   * Initialize Voice Consciousness System
   */
  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load state from storage
      await this.loadState();

      // Initialize Socket.IO connection
      this.socket = io(`${API_URL}/voice/consciousness`, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('✅ Voice Consciousness Connected');
        this.kernel.emit({
          type: 'voice:consciousness:connected',
          data: { connected: true },
        });
      });

      this.socket.on('consciousness:response', async (data: any) => {
        await this.handleConsciousnessResponse(data);
      });

      this.socket.on('consciousness:learning', (data: any) => {
        this.updateLearning(data);
      });

      // Initialize Cognitive Loop
      await this.cognitiveLoop.init(this.kernel);

      this.isInitialized = true;
      console.log('✅ Voice Consciousness System Initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Voice Consciousness:', error);
      throw error;
    }
  }

  /**
   * Activate Voice Consciousness globally
   */
  async activate(): Promise<void> {
    if (this.state.isActive) return;

    this.state.isActive = true;
    await this.saveState();

    this.kernel.emit({
      type: 'voice:consciousness:activated',
      data: { active: true },
    });

    // Start continuous listening
    if (this.socket?.connected) {
      this.socket.emit('activate', {
        language: this.state.currentLanguage,
        dialect: this.state.currentDialect,
        context: this.state.context,
      });
    }

    console.log('✅ Voice Consciousness Activated');
  }

  /**
   * Deactivate Voice Consciousness
   */
  async deactivate(): Promise<void> {
    if (!this.state.isActive) return;

    this.state.isActive = false;
    await this.saveState();

    this.kernel.emit({
      type: 'voice:consciousness:deactivated',
      data: { active: false },
    });

    if (this.socket?.connected) {
      this.socket.emit('deactivate', {});
    }

    console.log('✅ Voice Consciousness Deactivated');
  }

  /**
   * Update current screen context
   */
  updateScreenContext(screen: string): void {
    this.state.context.currentScreen = screen;
    this.saveState();

    if (this.socket?.connected && this.state.isActive) {
      this.socket.emit('context:update', {
        screen,
        previousIntents: this.state.context.previousIntents.slice(-5),
      });
    }
  }

  /**
   * Process voice input with consciousness
   */
  async processVoiceInput(text: string, audioUri?: string): Promise<void> {
    if (!this.state.isActive) {
      console.warn('Voice Consciousness is not active');
      return;
    }

    try {
      // Add to memory
      this.state.memory.conversations.push({
        timestamp: Date.now(),
        userInput: text,
        aiResponse: '',
        intent: '',
        screen: this.state.context.currentScreen,
      });

      // Limit conversation history
      if (this.state.memory.conversations.length > 100) {
        this.state.memory.conversations.shift();
      }

      // Send to backend with full context
      if (this.socket?.connected) {
        this.socket.emit('voice:input', {
          text,
          audioUri,
          language: this.state.currentLanguage,
          dialect: this.state.currentDialect,
          context: {
            screen: this.state.context.currentScreen,
            previousIntents: this.state.context.previousIntents.slice(-3),
            userPreferences: this.state.context.userPreferences,
            memory: {
              recentConversations: this.state.memory.conversations.slice(-5),
              learnedPatterns: this.state.memory.learnedPatterns,
            },
          },
          loyalty: {
            owner: 'Nader',
            absoluteLoyalty: true,
            priority: 'owner_first',
          },
        });
      }

      // Process through Cognitive Loop
      await this.cognitiveLoop.process({
        input: text,
        type: 'voice',
        context: this.state.context,
      });
    } catch (error) {
      console.error('Failed to process voice input:', error);
    }
  }

  /**
   * Handle consciousness response
   */
  private async handleConsciousnessResponse(data: any): Promise<void> {
    try {
      const { response, intent, actions, learning } = data;

      // Update last conversation
      if (this.state.memory.conversations.length > 0) {
        const lastConv = this.state.memory.conversations[this.state.memory.conversations.length - 1];
        lastConv.aiResponse = response;
        lastConv.intent = intent;
      }

      // Update intent history
      if (intent) {
        this.state.context.previousIntents.push(intent);
        if (this.state.context.previousIntents.length > 10) {
          this.state.context.previousIntents.shift();
        }
      }

      // Apply learning
      if (learning) {
        this.updateLearning(learning);
      }

      // Emit response to kernel
      this.kernel.emit({
        type: 'voice:consciousness:response',
        data: {
          response,
          intent,
          actions,
          screen: this.state.context.currentScreen,
        },
      });

      // Execute actions if any
      if (actions && actions.length > 0) {
        for (const action of actions) {
          await this.executeAction(action);
        }
      }

      await this.saveState();
    } catch (error) {
      console.error('Failed to handle consciousness response:', error);
    }
  }

  /**
   * Execute action from consciousness
   */
  private async executeAction(action: any): Promise<void> {
    try {
      const { type, params } = action;

      switch (type) {
        case 'navigate':
          this.kernel.emit({
            type: 'navigation:request',
            data: { screen: params.screen, params: params.params },
          });
          break;

        case 'search':
          this.kernel.emit({
            type: 'search:execute',
            data: { query: params.query, deep: params.deep || false },
          });
          break;

        case 'learn':
          this.state.memory.learnedPatterns[params.pattern] = params.data;
          await this.saveState();
          break;

        default:
          console.warn('Unknown action type:', type);
      }
    } catch (error) {
      console.error('Failed to execute action:', error);
    }
  }

  /**
   * Update learning patterns
   */
  private updateLearning(learning: any): void {
    if (learning.patterns) {
      Object.assign(this.state.memory.learnedPatterns, learning.patterns);
    }
    this.saveState();
  }

  /**
   * Set language and dialect
   */
  async setLanguage(language: string, dialect?: string): Promise<void> {
    this.state.currentLanguage = language;
    if (dialect) {
      this.state.currentDialect = dialect;
    }
    await this.saveState();

    if (this.socket?.connected && this.state.isActive) {
      this.socket.emit('language:update', {
        language,
        dialect: this.state.currentDialect,
      });
    }
  }

  /**
   * Get current state
   */
  getState(): VoiceConsciousnessState {
    return { ...this.state };
  }

  /**
   * Save state to storage
   */
  private async saveState(): Promise<void> {
    try {
      await AsyncStorage.setItem('voice_consciousness_state', JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save voice consciousness state:', error);
    }
  }

  /**
   * Load state from storage
   */
  private async loadState(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('voice_consciousness_state');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.state = { ...this.state, ...parsed };
      }
    } catch (error) {
      console.error('Failed to load voice consciousness state:', error);
    }
  }
}

export const voiceConsciousness = VoiceConsciousness.getInstance();

























