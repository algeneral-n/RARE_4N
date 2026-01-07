/**
 * RARE 4N - Template Engine
 * محرك القوالب - توليد ملفات المشروع من القوالب
 */

import { Blueprint } from './types';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECTS_DIR = path.join(__dirname, '../../../projects');

if (!fs.existsSync(PROJECTS_DIR)) {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

export interface TemplateResult {
  projectName: string;
  projectPath: string;
  files: string[];
  success: boolean;
  error?: string;
}

export class TemplateEngine {
  /**
   * توليد ملفات المشروع من المخطط
   */
  static async generate(blueprint: Blueprint): Promise<TemplateResult> {
    try {
      if (!blueprint || !blueprint.data) {
        throw new Error('Invalid blueprint');
      }

      const projectName = blueprint.data.projectName || `project-${Date.now()}`;
      const projectPath = path.join(PROJECTS_DIR, projectName);

      // إنشاء مجلد المشروع
      if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath, { recursive: true });
      }

      const files: string[] = [];

      // توليد package.json
      const packageJson = this.generatePackageJson(blueprint);
      const packageJsonPath = path.join(projectPath, 'package.json');
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      files.push('package.json');

      // توليد app.json (لـ React Native/Expo)
      if (blueprint.data.projectType === 'mobile-app') {
        const appJson = this.generateAppJson(blueprint);
        const appJsonPath = path.join(projectPath, 'app.json');
        fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
        files.push('app.json');
      }

      // توليد README.md
      const readme = this.generateReadme(blueprint);
      const readmePath = path.join(projectPath, 'README.md');
      fs.writeFileSync(readmePath, readme);
      files.push('README.md');

      // إنشاء هيكل المجلدات
      const structure = blueprint.data.structure || {};
      this.createDirectoryStructure(projectPath, structure);
      files.push('src/');

      return {
        projectName,
        projectPath,
        files,
        success: true,
      };
    } catch (error: any) {
      console.error('[TemplateEngine] Error:', error);
      return {
        projectName: '',
        projectPath: '',
        files: [],
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * توليد package.json
   */
  private static generatePackageJson(blueprint: Blueprint): any {
    const deps = blueprint.data.dependencies || [];
    const techStack = blueprint.data.techStack || {};

    return {
      name: blueprint.data.projectName,
      version: '1.0.0',
      description: `RARE 4N Generated Project - ${blueprint.data.projectType}`,
      main: 'index.js',
      scripts: {
        start: techStack.framework === 'next.js' ? 'next dev' : 'expo start',
        build: techStack.framework === 'next.js' ? 'next build' : 'expo build',
      },
      dependencies: {
        ...this.getBaseDependencies(techStack.framework),
        ...this.getFeatureDependencies(deps),
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        typescript: '^5.0.0',
      },
    };
  }

  /**
   * الحصول على Dependencies الأساسية
   */
  private static getBaseDependencies(framework: string): any {
    switch (framework) {
      case 'react-native':
        return {
          'expo': '~52.0.0',
          'react': '18.3.1',
          'react-native': '0.76.9',
        };
      case 'next.js':
        return {
          'next': '^14.0.0',
          'react': '^18.0.0',
          'react-dom': '^18.0.0',
        };
      default:
        return {};
    }
  }

  /**
   * الحصول على Dependencies للميزات
   */
  private static getFeatureDependencies(features: string[]): any {
    const deps: any = {};
    
    features.forEach(feature => {
      switch (feature) {
        case '@react-native-async-storage/async-storage':
          deps[feature] = '^1.23.1';
          break;
        case 'expo-secure-store':
          deps[feature] = '~14.0.1';
          break;
        case 'react-native-maps':
          deps[feature] = '^1.18.0';
          break;
        case 'socket.io-client':
          deps[feature] = '^4.8.1';
          break;
        default:
          if (feature.startsWith('@') || feature.includes('/')) {
            deps[feature] = 'latest';
          }
      }
    });

    return deps;
  }

  /**
   * توليد app.json
   */
  private static generateAppJson(blueprint: Blueprint): any {
    return {
      expo: {
        name: blueprint.data.projectName,
        slug: blueprint.data.projectName,
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'dark',
        splash: {
          image: './assets/splash.png',
          resizeMode: 'contain',
          backgroundColor: '#000408',
        },
        ios: {
          bundleIdentifier: `com.rare.${blueprint.data.projectName}`,
          buildNumber: '1',
        },
        android: {
          package: `com.rare.${blueprint.data.projectName}`,
          versionCode: 1,
        },
      },
    };
  }

  /**
   * توليد README.md
   */
  private static generateReadme(blueprint: Blueprint): string {
    return `# ${blueprint.data.projectName}

تم إنشاء هذا المشروع بواسطة RARE 4N Auto Builder

## نوع المشروع
${blueprint.data.projectType}

## المنصات
${(blueprint.data.platforms || []).join(', ')}

## الميزات
${(blueprint.data.features || []).map(f => `- ${f}`).join('\n')}

## التقنيات المستخدمة
- Framework: ${blueprint.data.techStack?.framework || 'N/A'}
- Language: ${blueprint.data.techStack?.language || 'N/A'}

## التثبيت
\`\`\`bash
npm install
\`\`\`

## التشغيل
\`\`\`bash
npm start
\`\`\`

---
Generated by RARE 4N Auto Builder
Created: ${blueprint.data.createdAt}
`;
  }

  /**
   * إنشاء هيكل المجلدات
   */
  private static createDirectoryStructure(basePath: string, structure: any): void {
    if (structure.src) {
      const srcPath = path.join(basePath, 'src');
      if (!fs.existsSync(srcPath)) {
        fs.mkdirSync(srcPath, { recursive: true });
      }

      if (structure.src.components) {
        const componentsPath = path.join(srcPath, 'components');
        fs.mkdirSync(componentsPath, { recursive: true });
      }

      if (structure.src.screens) {
        const screensPath = path.join(srcPath, 'screens');
        fs.mkdirSync(screensPath, { recursive: true });
      }

      if (structure.src.services) {
        const servicesPath = path.join(srcPath, 'services');
        fs.mkdirSync(servicesPath, { recursive: true });
      }
    }

    if (structure.assets) {
      const assetsPath = path.join(basePath, 'assets');
      fs.mkdirSync(assetsPath, { recursive: true });

      if (structure.assets.images) {
        const imagesPath = path.join(assetsPath, 'images');
        fs.mkdirSync(imagesPath, { recursive: true });
      }
    }
  }
}






















