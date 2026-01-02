/**
 * RARE 4N - Build History Manager
 * إدارة تاريخ البناءات والـ Logs
 */

export interface BuildHistoryItem {
  buildId: string;
  projectName: string;
  platform: string;
  profile: string;
  status: 'pending' | 'building' | 'completed' | 'failed';
  builds?: Array<{
    platform: string;
    filename: string;
    size: number;
    downloadUrl?: string;
  }>;
  createdAt: string;
  completedAt?: string;
  error?: string;
  logs?: string[];
}

class BuildHistoryManager {
  private static instance: BuildHistoryManager;
  private history: BuildHistoryItem[] = [];
  private maxHistorySize = 100;

  private constructor() {
    // Load from storage if available
    this.loadFromStorage();
  }

  static getInstance(): BuildHistoryManager {
    if (!BuildHistoryManager.instance) {
      BuildHistoryManager.instance = new BuildHistoryManager();
    }
    return BuildHistoryManager.instance;
  }

  /**
   * Add build to history
   */
  addBuild(build: BuildHistoryItem): void {
    this.history.unshift(build);
    if (this.history.length > this.maxHistorySize) {
      this.history.pop();
    }
    this.saveToStorage();
  }

  /**
   * Update build status
   */
  updateBuild(buildId: string, updates: Partial<BuildHistoryItem>): void {
    const index = this.history.findIndex(b => b.buildId === buildId);
    if (index !== -1) {
      this.history[index] = { ...this.history[index], ...updates };
      this.saveToStorage();
    }
  }

  /**
   * Get build history
   */
  getHistory(limit?: number): BuildHistoryItem[] {
    return limit ? this.history.slice(0, limit) : this.history;
  }

  /**
   * Get build by ID
   */
  getBuild(buildId: string): BuildHistoryItem | undefined {
    return this.history.find(b => b.buildId === buildId);
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.history = [];
    this.saveToStorage();
  }

  /**
   * Save to AsyncStorage (React Native)
   */
  private async saveToStorage(): Promise<void> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('buildHistory', JSON.stringify(this.history));
    } catch (error) {
      console.error('[BuildHistory] Failed to save:', error);
    }
  }

  /**
   * Load from AsyncStorage
   */
  private async loadFromStorage(): Promise<void> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const stored = await AsyncStorage.getItem('buildHistory');
      if (stored) {
        this.history = JSON.parse(stored);
      }
    } catch (error) {
      console.error('[BuildHistory] Failed to load:', error);
    }
  }
}

export const buildHistoryManager = BuildHistoryManager.getInstance();






















