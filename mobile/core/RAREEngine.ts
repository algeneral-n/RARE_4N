/**
 * RARE 4N - Base Engine Interface
 * Abstract base class for all RARE OS engines and agents.
 * Ensures consistent lifecycle management and kernel communication.
 */

import { RAREKernel } from './RAREKernel';

export interface EngineConfig {
  kernel: RAREKernel;
  [key: string]: any;
}

export interface EngineStatus {
  id: string;
  name: string;
  version: string;
  initialized: boolean;
  running: boolean;
  error?: string;
}

export abstract class RAREEngine {
  // معرفات المحرك الأساسية (يمكن أن تكون getters أو properties)
  abstract get id(): string;
  abstract get name(): string;
  abstract get version(): string;

  protected kernel: RAREKernel | null = null;
  protected initialized: boolean = false;
  protected running: boolean = false;

  /**
   * initialize: تهيئة المحرك وربطه بالـ Kernel
   */
  abstract initialize(config: EngineConfig): Promise<void>;

  /**
   * start: بدء تشغيل المحرك
   */
  abstract start(): Promise<void>;

  /**
   * stop: إيقاف المحرك وتحرير الموارد
   */
  abstract stop(): Promise<void>;

  /**
   * pause: إيقاف مؤقت (اختياري - مفيد لتوفير البطارية)
   */
  pause?(): Promise<void>;

  /**
   * resume: استئناف العمل (اختياري)
   */
  resume?(): Promise<void>;

  /**
   * getStatus: جلب الحالة اللحظية للمحرك لعرضها في واجهة المستخدم
   */
  getStatus(): EngineStatus {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      initialized: this.initialized,
      running: this.running,
    };
  }

  /**
   * onEvent: التعامل مع أحداث الـ Kernel العامة (اختياري)
   */
  onEvent?(event: any): void;

  /**
   * emit: إرسال حدث من المحرك إلى الـ Kernel ليتم توزيعه
   */
  protected emit(type: string, data: any): void {
    if (this.kernel) {
      // يتم إرسال الحدث مع تحديد المصدر (source) لسهولة التتبع
      this.kernel.emit({ type, data, source: this.id });
    }
  }
}