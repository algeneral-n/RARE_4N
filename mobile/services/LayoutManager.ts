/**
 * RARE 4N - Layout Manager Service
 * Layout management and responsive design
 */

import { Dimensions } from 'react-native';
import { storage } from '../utils/storage';

export interface LayoutPreferences {
  orientation: 'portrait' | 'landscape' | 'auto';
  density: 'compact' | 'normal' | 'comfortable';
  fontSize: 'small' | 'medium' | 'large';
  spacing: 'tight' | 'normal' | 'loose';
}

export interface Breakpoint {
  name: string;
  width: number;
  height: number;
}

class LayoutManager {
  private static instance: LayoutManager;
  private preferences: LayoutPreferences = {
    orientation: 'auto',
    density: 'normal',
    fontSize: 'medium',
    spacing: 'normal',
  };
  private breakpoints: Breakpoint[] = [
    { name: 'xs', width: 0, height: 0 },
    { name: 'sm', width: 576, height: 0 },
    { name: 'md', width: 768, height: 0 },
    { name: 'lg', width: 992, height: 0 },
    { name: 'xl', width: 1200, height: 0 },
  ];

  private constructor() {
    this.loadPreferences();
    this.updateDimensions();
  }

  static getInstance(): LayoutManager {
    if (!LayoutManager.instance) {
      LayoutManager.instance = new LayoutManager();
    }
    return LayoutManager.instance;
  }

  private async loadPreferences(): Promise<void> {
    try {
      const saved = await storage.get<LayoutPreferences>('layout:preferences');
      if (saved) {
        this.preferences = saved;
      }
    } catch (error) {
      console.error('Load layout preferences error:', error);
    }
  }

  private updateDimensions(): void {
    Dimensions.addEventListener('change', ({ window }) => {
      this.handleDimensionChange(window.width, window.height);
    });
  }

  private handleDimensionChange(width: number, height: number): void {
    if (this.preferences.orientation === 'auto') {
      const isLandscape = width > height;
    }
  }

  async setPreferences(preferences: Partial<LayoutPreferences>): Promise<void> {
    this.preferences = { ...this.preferences, ...preferences };
    await storage.set('layout:preferences', this.preferences);
  }

  getPreferences(): LayoutPreferences {
    return { ...this.preferences };
  }

  getCurrentBreakpoint(): string {
    const { width } = Dimensions.get('window');
    for (let i = this.breakpoints.length - 1; i >= 0; i--) {
      if (width >= this.breakpoints[i].width) {
        return this.breakpoints[i].name;
      }
    }
    return 'xs';
  }

  isMobile(): boolean {
    const { width } = Dimensions.get('window');
    return width < 768;
  }

  isTablet(): boolean {
    const { width } = Dimensions.get('window');
    return width >= 768 && width < 1024;
  }

  isDesktop(): boolean {
    const { width } = Dimensions.get('window');
    return width >= 1024;
  }

  getSpacing(): number {
    switch (this.preferences.spacing) {
      case 'tight':
        return 4;
      case 'loose':
        return 16;
      default:
        return 8;
    }
  }

  getFontSize(): number {
    switch (this.preferences.fontSize) {
      case 'small':
        return 12;
      case 'large':
        return 18;
      default:
        return 14;
    }
  }

  getDensity(): number {
    switch (this.preferences.density) {
      case 'compact':
        return 0.8;
      case 'comfortable':
        return 1.2;
      default:
        return 1.0;
    }
  }
}

export default LayoutManager.getInstance();

