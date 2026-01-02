/**
 * RARE 4N - Analytics Utility
 * Event tracking for security and system monitoring
 * Built for longevity and maintainability
 * 
 * NOTE: No direct RAREKernel import to avoid circular dependencies
 */

// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'analytics.ts:12',message:'analytics.ts module loading started',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
} catch (e) {}
// #endregion

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
  sessionId?: string;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private readonly MAX_EVENTS = 1000;
  private sessionId: string;
  private kernelGetter: (() => any) | null = null;

  private constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Set kernel getter (lazy initialization to avoid circular dependency)
   */
  setKernelGetter(getter: () => any): void {
    this.kernelGetter = getter;
  }

  /**
   * Track an event
   */
  trackEvent(name: string, properties?: Record<string, any>): void {
    try {
      const event: AnalyticsEvent = {
        name,
        properties,
        timestamp: Date.now(),
        sessionId: this.sessionId,
      };

      this.events.push(event);

      // Keep only last MAX_EVENTS
      if (this.events.length > this.MAX_EVENTS) {
        this.events.shift();
      }

      // Emit to Kernel for system-wide awareness (lazy)
      if (this.kernelGetter) {
        try {
          const kernel = this.kernelGetter();
          if (kernel && kernel.emit) {
            kernel.emit({
              type: 'analytics:event',
              data: event,
            });
          }
        } catch (kernelError) {
          // Silently fail if kernel not available
        }
      }

      // Log critical security events
      if (name.includes('security') || name.includes('threat') || name.includes('auth')) {
        console.log(`[Analytics] ${name}:`, properties);
      }
    } catch (error) {
      console.error('Analytics trackEvent error:', error);
    }
  }

  /**
   * Get all events
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Get events by name
   */
  getEventsByName(name: string): AnalyticsEvent[] {
    return this.events.filter(event => event.name === name);
  }

  /**
   * Clear events
   */
  clearEvents(): void {
    this.events = [];
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }
}

export const trackEvent = (name: string, properties?: Record<string, any>) => {
  AnalyticsService.getInstance().trackEvent(name, properties);
};

export const analytics = AnalyticsService.getInstance();
export default analytics;

