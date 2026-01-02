/**
 * RARE 4N - Health Monitor for Agents
 * Monitors the operational status of all engines and triggers automatic recovery
 * if a component failure is detected.
 */

export interface AgentHealth {
  engineId: string;
  isHealthy: boolean;
  lastCheck: number;
  consecutiveFailures: number;
  lastError?: string;
  uptime: number;
  responseTime: number;
}

export class HealthMonitor {
  private healthStatus: Map<string, AgentHealth> = new Map();
  private checkInterval: number = 30000; // فحص كل 30 ثانية
  private maxFailures: number = 3; // عدد المحاولات الفاشلة قبل إعلان العطل
  private intervalId: NodeJS.Timeout | null = null;

  /**
   * start: بدء عملية مراقبة الحالة لجميع المحركات المسجلة
   */
  start(engines: Map<string, any>): void {
    if (this.intervalId) return;

    engines.forEach((engine, engineId) => {
      this.healthStatus.set(engineId, {
        engineId,
        isHealthy: true,
        lastCheck: Date.now(),
        consecutiveFailures: 0,
        uptime: 0,
        responseTime: 0,
      });
    });

    this.intervalId = setInterval(() => {
      this.performHealthChecks(engines);
    }, this.checkInterval);
  }

  /**
   * performHealthChecks: تنفيذ فحص الحالة والتأكد من استجابة المحرك
   */
  private async performHealthChecks(engines: Map<string, any>): Promise<void> {
    const checkPromises = Array.from(engines.entries()).map(async ([engineId, engine]) => {
      const startTime = Date.now();
      let isHealthy = false;
      let error: string | undefined;

      try {
        const status = engine.getStatus();
        isHealthy = status.running && !status.error;
        if (status.error) error = status.error;

        const health = this.healthStatus.get(engineId);
        if (health) {
          health.lastCheck = Date.now();
          health.responseTime = Date.now() - startTime;

          if (!isHealthy) {
            health.consecutiveFailures++;
            health.lastError = error;
            
            // إذا تجاوز الفشل الحد المسموح، نبدأ عملية التعافي
            if (health.consecutiveFailures >= this.maxFailures) {
              health.isHealthy = false;
              this.triggerRecovery(engineId, engine);
            }
          } else {
            health.consecutiveFailures = 0;
            health.isHealthy = true;
            health.lastError = undefined;
          }
        }
      } catch (err: any) {
        const health = this.healthStatus.get(engineId);
        if (health) {
          health.consecutiveFailures++;
          health.isHealthy = false;
          if (health.consecutiveFailures >= this.maxFailures) {
            this.triggerRecovery(engineId, engine);
          }
        }
      }
    });

    await Promise.all(checkPromises);
  }

  /**
   * triggerRecovery: إعادة تشغيل المحرك المتعطل تلقائياً
   */
  private async triggerRecovery(engineId: string, engine: any): Promise<void> {
    try {
      console.log(`[HealthMonitor] Attempting recovery for ${engineId}...`);

      // إيقاف المحرك أولاً لضمان تنظيف الذاكرة
      try { await engine.stop(); } catch (e) {}

      // انتظار ثانية قبل إعادة التشغيل
      await new Promise(resolve => setTimeout(resolve, 1000));

      // محاولة البدء من جديد
      await engine.start();
      console.log(`[HealthMonitor] Recovery successful for ${engineId}`);
      
      const health = this.healthStatus.get(engineId);
      if (health) {
        health.consecutiveFailures = 0;
        health.isHealthy = true;
        health.lastError = undefined;
      }
    } catch (error) {
      console.error(`[HealthMonitor] Recovery failed for ${engineId}:`, error);
    }
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getHealth(engineId: string) { return this.healthStatus.get(engineId); }
  
  registerEngine(engineId: string) {
    if (!this.healthStatus.has(engineId)) {
      this.healthStatus.set(engineId, {
        engineId, isHealthy: true, lastCheck: Date.now(), 
        consecutiveFailures: 0, uptime: 0, responseTime: 0
      });
    }
  }
}