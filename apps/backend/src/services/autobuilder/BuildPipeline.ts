/**
 * RARE 4N - Build Pipeline
 * خط البناء - بناء المشروع للمنصات المختلفة
 */

import { Blueprint } from './types';
import { buildAllPlatforms } from '../buildService.js';

export interface BuildOptions {
  projectName: string;
  projectPath: string;
  blueprint: Blueprint;
  platforms: string[];
}

export interface BuildResult {
  ios?: any;
  android?: any;
  web?: any;
  success: boolean;
  error?: string;
}

export class BuildPipeline {
  /**
   * بناء المشروع للمنصات المختلفة
   */
  static async build(options: BuildOptions): Promise<BuildResult> {
    try {
      const { projectName, projectPath, blueprint, platforms } = options;

      console.log(`[BuildPipeline] Building ${projectName} for platforms: ${platforms.join(', ')}`);

      // استخدام buildService الموجود
      const buildResult = await buildAllPlatforms(
        projectPath,
        projectName,
        blueprint.data.clientEmail || 'gm@zien-ai.app',
        '',
        {
          platforms,
          projectType: blueprint.data.projectType || 'react-native',
          clientEmail: blueprint.data.clientEmail,
          clientId: blueprint.data.clientId,
        }
      );

      const result: BuildResult = {
        success: true,
      };

      // تنظيم النتائج حسب المنصة
      if (buildResult.builds) {
        buildResult.builds.forEach((build: any) => {
          if (build.platform === 'ios') {
            result.ios = build;
          } else if (build.platform === 'android') {
            result.android = build;
          } else if (build.platform === 'web') {
            result.web = build;
          }
        });
      }

      return result;
    } catch (error: any) {
      console.error('[BuildPipeline] Error:', error);
      return {
        success: false,
        error: error.message || 'Build failed',
      };
    }
  }
}






















