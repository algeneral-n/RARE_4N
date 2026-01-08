/**
 * RARE 4N - Auto Builder Types
 * أنواع البيانات لـ Auto Builder
 */

export interface Blueprint {
  blueprint: boolean;
  data: {
    projectType?: 'mobile-app' | 'web-app' | 'desktop-app' | 'api';
    platforms?: string[];
    features?: string[];
    requirements?: string[];
    style?: string;
    targetAudience?: string;
    language?: string;
    clientId?: string;
    clientName?: string;
    clientEmail?: string;
    raw?: string;
    createdAt?: string;
    projectName?: string;
    projectId?: string;
    techStack?: any;
    structure?: any;
    dependencies?: string[];
    injectedFeatures?: any;
    injected?: boolean;
    injectedAt?: string;
    injectionError?: string;
    error?: string;
  };
}























