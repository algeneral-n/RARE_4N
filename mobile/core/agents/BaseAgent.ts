/**
 * RARE 4N - BaseAgent
 * The foundation class for all AI agents within the RARE ecosystem.
 * Inherits from RAREEngine to ensure consistent lifecycle and kernel integration.
 */

import { RAREEngine, EngineConfig } from '../RAREEngine';
import { RAREKernel } from '../RAREKernel';

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
}

export abstract class BaseAgent extends RAREEngine {
  protected config: AgentConfig;
  protected kernel: RAREKernel | null = null;

  // Implement abstract properties from RAREEngine using config
  get id(): string {
    return this.config.id;
  }

  get name(): string {
    return this.config.name;
  }

  get version(): string {
    return '1.0.0';
  }

  constructor(config: AgentConfig) {
    super();
    this.config = config;
  }

  /**
   * initialize: ربط العميل بالنواة (Kernel) وتجهيزه للعمل.
   */
  async initialize(config: EngineConfig): Promise<void> {
    this.kernel = config.kernel;
    this.initialized = true;
    await this.init();
  }

  /**
   * init: استدعاء دالة التهيئة الخاصة بكل عميل.
   */
  async init(): Promise<void> {
    console.log(`[${this.config.name}] Initializing Agent...`);
    try {
      await this.onInit();
      this.initialized = true;
      console.log(`[${this.config.name}] Agent Ready.`);
    } catch (error) {
      console.error(`[${this.config.name}] Init error:`, error);
    }
  }

  /**
   * start: بدء تشغيل العميل وتفعيل وظائفه.
   */
  async start(): Promise<void> {
    if (this.running) return;
    console.log(`[${this.config.name}] Starting Agent...`);
    this.running = true;
    try {
      await this.onStart();
    } catch (error) {
      this.running = false;
      console.error(`[${this.config.name}] Start error:`, error);
      throw error;
    }
  }

  /**
   * stop: إيقاف العميل لتحرير موارد الموبايل.
   */
  async stop(): Promise<void> {
    if (!this.running) return;
    console.log(`[${this.config.name}] Stopping Agent...`);
    this.running = false;
    try {
      await this.onStop();
    } catch (error) {
      console.error(`[${this.config.name}] Stop error:`, error);
      throw error;
    }
  }

  /**
   * executeAction: تنفيذ أمر معين يطلبه الـ Cognitive Loop.
   */
  async executeAction(action: string, parameters: any): Promise<any> {
    if (!this.initialized) {
      await this.init();
    }
    console.log(`[${this.config.name}] Executing: ${action}`);
    try {
      return await this.onExecuteAction(action, parameters);
    } catch (error) {
      console.error(`[${this.config.name}] Execution error:`, error);
      throw error;
    }
  }

  getCapabilities(): string[] {
    return this.config.capabilities;
  }

  // دوال يتم تعريفها داخل كل عميل (Subclasses)
  protected async onInit(): Promise<void> {}
  protected async onStart(): Promise<void> {}
  protected async onStop(): Promise<void> {}
  protected abstract onExecuteAction(action: string, parameters: any): Promise<any>;
}