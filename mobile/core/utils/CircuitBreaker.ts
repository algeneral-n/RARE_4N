/**
 * RARE 4N - Circuit Breaker Pattern
 * Prevents system overload and cascading failures by monitoring service stability.
 * Transitions between CLOSED, OPEN, and HALF_OPEN states based on failure thresholds.
 */

export interface CircuitBreakerOptions {
  failureThreshold: number; // عدد الإخفاقات المسموح بها قبل قطع الدائرة
  resetTimeout: number; // الوقت بالملي ثانية قبل محاولة إعادة الاختبار
  monitoringWindow: number; // النافذة الزمنية لمراقبة الإخفاقات
}

export enum CircuitState {
  CLOSED = 'closed', // الحالة الطبيعية: الطلبات تمر بسلام
  OPEN = 'open', // الدائرة مقطوعة: الطلبات ترفض فوراً لحماية النظام
  HALF_OPEN = 'half_open', // حالة اختبار: محاولة إرسال طلبات محدودة للتأكد من التعافي
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failures: number = 0;
  private lastFailureTime: number = 0;
  private successCount: number = 0;
  private options: CircuitBreakerOptions;

  constructor(options: Partial<CircuitBreakerOptions> = {}) {
    this.options = {
      failureThreshold: options.failureThreshold || 5,
      resetTimeout: options.resetTimeout || 60000, // دقيقة واحدة
      monitoringWindow: options.monitoringWindow || 60000,
    };
  }

  /**
   * execute: تنفيذ الوظيفة البرمجية تحت حماية الفيوز
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // التحقق من حالة الدائرة
    if (this.state === CircuitState.OPEN) {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime;
      
      // إذا مر وقت كافٍ، ننتقل لحالة نصف مفتوحة للاختبار
      if (timeSinceLastFailure >= this.options.resetTimeout) {
        this.state = CircuitState.HALF_OPEN;
        this.successCount = 0;
      } else {
        throw new Error('Circuit breaker is OPEN - Service currently unavailable to prevent overload');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;

    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      // إذا نجحت محاولتين متتاليتين في حالة الاختبار، نغلق الدائرة ونعود للعمل الطبيعي
      if (this.successCount >= 2) {
        this.state = CircuitState.CLOSED;
        this.successCount = 0;
      }
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.state === CircuitState.HALF_OPEN) {
      // إذا فشل الاختبار في حالة نصف مفتوحة، نفتح الدائرة مرة أخرى فوراً
      this.state = CircuitState.OPEN;
      this.successCount = 0;
    } else if (this.failures >= this.options.failureThreshold) {
      // فتح الدائرة بعد تجاوز حد الإخفاقات المسموح به
      this.state = CircuitState.OPEN;
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failures = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
  }
}