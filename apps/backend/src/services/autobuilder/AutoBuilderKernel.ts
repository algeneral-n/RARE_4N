/**
 * RARE 4N - Auto Builder Kernel
 * النواة الأساسية لنظام Auto Builder
 */

import { AutoBuilderMemory } from './AutoBuilderMemory';
import { BlueprintArchitect } from './BlueprintArchitect';
import { BuildPipeline } from './BuildPipeline';
import { DeliveryEngine } from './DeliveryEngine';
import { FeatureInjector } from './FeatureInjector';
import { TemplateEngine } from './TemplateEngine';
import { VoiceUnderstanding } from './VoiceUnderstanding';
import { Blueprint } from './types';

export interface BuildRequest {
  text: string;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  requestId?: string;
  projectType?: 'mobile-app' | 'web-app' | 'desktop-app' | 'api';
  platforms?: string[];
  features?: string[];
}

export interface BuildResult {
  success: boolean;
  projectName?: string;
  projectPath?: string;
  builds?: any[];
  blueprint?: Blueprint;
  error?: string;
  delivery?: any;
}

export class AutoBuilderKernel {
  private static instance: AutoBuilderKernel;
  private memory: AutoBuilderMemory;

  private constructor() {
    this.memory = new AutoBuilderMemory();
  }

  static getInstance(): AutoBuilderKernel {
    if (!AutoBuilderKernel.instance) {
      AutoBuilderKernel.instance = new AutoBuilderKernel();
    }
    return AutoBuilderKernel.instance;
  }

  /**
   * تشغيل Auto Builder مع طلب العميل
   */
  async run(request: BuildRequest): Promise<BuildResult> {
    try {
      console.log('[AutoBuilderKernel] Processing request:', request.requestId);

      // 1. فهم الطلب (صوتي أو نصي)
      const understood = await VoiceUnderstanding.parse(request.text);
      console.log('[AutoBuilderKernel] Understood:', understood);

      // 2. إنشاء مخطط المشروع
      const blueprint = await BlueprintArchitect.make({
        ...understood,
        projectType: request.projectType,
        platforms: request.platforms,
        features: request.features,
        clientId: request.clientId,
        clientName: request.clientName,
        clientEmail: request.clientEmail,
      });
      console.log('[AutoBuilderKernel] Blueprint created:', blueprint);

      // 3. حقن الميزات المطلوبة
      const enhancedBlueprint = await FeatureInjector.inject(blueprint);
      console.log('[AutoBuilderKernel] Features injected');

      // 4. توليد القوالب
      const templates = await TemplateEngine.generate(enhancedBlueprint);
      console.log('[AutoBuilderKernel] Templates generated');

      // 5. بناء المشروع
      const builds = await BuildPipeline.build({
        projectName: templates.projectName,
        projectPath: templates.projectPath,
        blueprint: enhancedBlueprint,
        platforms: request.platforms || ['ios', 'android'],
      });
      console.log('[AutoBuilderKernel] Build completed');

      // 6. تسليم الملفات
      const delivery = await DeliveryEngine.deliver({
        builds,
        clientEmail: request.clientEmail,
        clientName: request.clientName,
        projectName: templates.projectName,
      });
      console.log('[AutoBuilderKernel] Delivery completed');

      // 7. حفظ في الذاكرة
      await this.memory.save({
        requestId: request.requestId,
        clientId: request.clientId,
        blueprint: enhancedBlueprint,
        builds,
        delivery,
        timestamp: Date.now(),
      });

      return {
        success: true,
        projectName: templates.projectName,
        projectPath: templates.projectPath,
        builds,
        blueprint: enhancedBlueprint,
        delivery,
      };
    } catch (error: any) {
      console.error('[AutoBuilderKernel] Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to build project',
      };
    }
  }

  /**
   * الحصول على حالة البناء
   */
  async getBuildStatus(requestId: string): Promise<any> {
    return await this.memory.get(requestId);
  }

  /**
   * الحصول على جميع المشاريع
   */
  async getAllProjects(): Promise<any[]> {
    return await this.memory.getAll();
  }
}

export default AutoBuilderKernel.getInstance();























