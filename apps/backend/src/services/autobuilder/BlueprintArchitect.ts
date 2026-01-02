/**
 * RARE 4N - Blueprint Architect
 * مهندس المخططات - إنشاء مخططات المشاريع
 */

import { Blueprint } from './types';

export interface BlueprintData {
  projectType?: string;
  platforms?: string[];
  features?: string[];
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  requirements?: string[];
  style?: string;
  targetAudience?: string;
  language?: string;
  raw?: string;
}

export class BlueprintArchitect {
  /**
   * إنشاء مخطط المشروع
   */
  static async make(data: BlueprintData): Promise<Blueprint> {
    try {
      const blueprint: Blueprint = {
        blueprint: true,
        data: {
          projectType: data.projectType || 'mobile-app',
          platforms: data.platforms || ['ios', 'android'],
          features: data.features || [],
          requirements: data.requirements || [],
          style: data.style || 'modern',
          targetAudience: data.targetAudience || 'general',
          language: data.language || 'ar',
          clientId: data.clientId,
          clientName: data.clientName,
          clientEmail: data.clientEmail,
          raw: data.raw,
          createdAt: new Date().toISOString(),
          projectName: this.generateProjectName(data),
          projectId: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        },
      };

      // إضافة تفاصيل إضافية بناءً على نوع المشروع
      blueprint.data.techStack = this.getTechStack(blueprint.data.projectType);
      blueprint.data.structure = this.getProjectStructure(blueprint.data.projectType);
      blueprint.data.dependencies = this.getDependencies(blueprint.data.features || []);

      return blueprint;
    } catch (error: any) {
      console.error('[BlueprintArchitect] Error:', error);
      return {
        blueprint: true,
        data: {
          projectType: 'mobile-app',
          platforms: ['ios', 'android'],
          features: [],
          error: error.message,
        },
      };
    }
  }

  /**
   * توليد اسم المشروع
   */
  private static generateProjectName(data: BlueprintData): string {
    if (data.clientName) {
      const cleanName = data.clientName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      return `${cleanName}-app`;
    }
    
    const type = data.projectType || 'app';
    return `rare-${type}-${Date.now()}`;
  }

  /**
   * الحصول على Tech Stack المناسب
   */
  private static getTechStack(projectType: string): any {
    switch (projectType) {
      case 'mobile-app':
        return {
          framework: 'react-native',
          language: 'typescript',
          navigation: 'expo-router',
          ui: 'react-native-paper',
          state: 'zustand',
        };
      case 'web-app':
        return {
          framework: 'next.js',
          language: 'typescript',
          ui: 'tailwindcss',
          state: 'zustand',
        };
      case 'desktop-app':
        return {
          framework: 'electron',
          language: 'typescript',
          ui: 'react',
        };
      case 'api':
        return {
          framework: 'express',
          language: 'typescript',
          database: 'mongodb',
        };
      default:
        return {
          framework: 'react-native',
          language: 'typescript',
        };
    }
  }

  /**
   * الحصول على هيكل المشروع
   */
  private static getProjectStructure(projectType: string): any {
    const baseStructure = {
      src: {
        components: [],
        screens: [],
        services: [],
        utils: [],
        config: [],
      },
      assets: {
        images: [],
        fonts: [],
      },
    };

    switch (projectType) {
      case 'mobile-app':
        return {
          ...baseStructure,
          app: [],
          'app.json': {},
          'package.json': {},
        };
      case 'web-app':
        return {
          ...baseStructure,
          pages: [],
          public: [],
          'next.config.js': {},
        };
      default:
        return baseStructure;
    }
  }

  /**
   * الحصول على Dependencies المطلوبة
   */
  private static getDependencies(features: string[]): string[] {
    const deps: string[] = [];
    
    if (features.includes('authentication')) {
      deps.push('@react-native-async-storage/async-storage', 'expo-secure-store');
    }
    if (features.includes('payment')) {
      deps.push('react-native-payments', 'stripe');
    }
    if (features.includes('maps')) {
      deps.push('react-native-maps', 'expo-location');
    }
    if (features.includes('chat')) {
      deps.push('socket.io-client', 'react-native-gifted-chat');
    }
    if (features.includes('camera')) {
      deps.push('expo-camera', 'expo-image-picker');
    }

    return deps;
  }
}



















