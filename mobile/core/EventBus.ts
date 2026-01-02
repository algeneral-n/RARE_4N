/**
 * RARE 4N - Event Bus
 * Core Pub/Sub messaging system for asynchronous kernel communication.
 * Handles event distribution, history management, and pattern matching.
 */

// Log after module load to track execution
try {
  console.log('[EventBus.ts] Module loading started');
} catch (e) {
  // Ignore logging errors
}

import type { KernelEvent } from './types';

// Log after import to track execution
try {
  console.log('[EventBus.ts] Imports completed');
} catch (e) {
  // Ignore logging errors
}

type EventHandler = (event: KernelEvent) => void;

export class EventBus {
  private static instance: EventBus;
  private handlers: Map<string, Set<EventHandler>>;
  private eventHistory: KernelEvent[];
  private readonly MAX_HISTORY = 1000;

  private constructor() {
    this.handlers = new Map();
    this.eventHistory = [];
  }

  /**
   * getInstance: لضمان وجود نسخة واحدة فقط من ناقل الأحداث في التطبيق (Singleton)
   */
  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * init: تهيئة الناقل (جاهز للتوسعة مستقبلاً)
   */
  init(): void {
    console.log('RARE EventBus initialized and ready.');
  }

  /**
   * emit: إرسال حدث جديد وتوزيعه على جميع "المستمعين" المسجلين
   */
  emit(event: KernelEvent): void {
    // 1. إضافة الحدث للسجل (History) مع الحفاظ على الحد الأقصى
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.MAX_HISTORY) {
      this.eventHistory.shift();
    }

    // 2. استدعاء المستمعين للنوع المحدد (Specific Handlers)
    const specificHandlers = this.handlers.get(event.type);
    if (specificHandlers) {
      specificHandlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in specific event handler for ${event.type}:`, error);
        }
      });
    }

    // 3. استدعاء مستمعي "العلامة الشاملة" (Wildcard Handlers)
    const wildcardHandlers = this.handlers.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in wildcard handler:`, error);
        }
      });
    }

    // 4. استدعاء مستمعي الأنماط (Pattern Handlers) مثل 'ai:*'
    const parts = event.type.split(':');
    if (parts.length > 1) {
      const pattern = `${parts[0]}:*`;
      const patternHandlers = this.handlers.get(pattern);
      if (patternHandlers) {
        patternHandlers.forEach(handler => {
          try {
            handler(event);
          } catch (error) {
            console.error(`Error in pattern handler for ${pattern}:`, error);
          }
        });
      }
    }
  }

  /**
   * on: تسجيل مستمع لحدث معين
   * @returns دالة لإلغاء الاشتراك (Unsubscribe)
   */
  on(eventType: string, handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);

    // دالة إلغاء الاشتراك لمنع استهلاك الذاكرة
    return () => {
      const handlers = this.handlers.get(eventType);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.handlers.delete(eventType);
        }
      }
    };
  }

  /**
   * off: إلغاء تسجيل مستمع محدد
   */
  off(eventType: string, handler: EventHandler): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(eventType);
      }
    }
  }

  /**
   * getHistory: جلب سجل الأحداث مع إمكانية الفلترة
   */
  getHistory(filter?: (event: KernelEvent) => boolean): KernelEvent[] {
    if (filter) {
      return this.eventHistory.filter(filter);
    }
    return [...this.eventHistory];
  }

  /**
   * clearHistory: مسح السجل لتوفير المساحة
   */
  clearHistory(): void {
    this.eventHistory = [];
  }
}