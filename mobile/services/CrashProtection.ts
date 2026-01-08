/**
 * RARE 4N - Crash Protection Service
 * حماية من الكراشات
 */

import { storage } from '../utils/storage';
import * as ErrorRecovery from 'expo-error-recovery';

export interface CrashReport {
  error: string;
  stack?: string;
  timestamp: number;
  context?: Record<string, any>;
}

class CrashProtection {
  private static instance: CrashProtection;
  private crashReports: CrashReport[] = [];
  private maxReports = 50;

  private constructor() {
    this.initialize();
  }

  static getInstance(): CrashProtection {
    if (!CrashProtection.instance) {
      CrashProtection.instance = new CrashProtection();
    }
    return CrashProtection.instance;
  }

  private async initialize(): Promise<void> {
    try {
      const savedReports = await storage.get<CrashReport[]>('crash:reports');
      if (savedReports) {
        this.crashReports = savedReports.slice(0, this.maxReports);
      }

      const recoveryProps = ErrorRecovery.recoveredProps;
      if (recoveryProps && recoveryProps.error) {
        await this.logCrash(recoveryProps.error, recoveryProps.stack);
      }
    } catch (error) {
      console.error('Crash protection init error:', error);
    }
  }

  async logCrash(error: string, stack?: string, context?: Record<string, any>): Promise<void> {
    try {
      const report: CrashReport = {
        error,
        stack,
        timestamp: Date.now(),
        context,
      };

      this.crashReports.unshift(report);
      if (this.crashReports.length > this.maxReports) {
        this.crashReports = this.crashReports.slice(0, this.maxReports);
      }

      await storage.set('crash:reports', this.crashReports);

      await this.sendCrashReport(report);
    } catch (err) {
      console.error('Log crash error:', err);
    }
  }

  private async sendCrashReport(report: CrashReport): Promise<void> {
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.zien-ai.app';
      await fetch(`${API_URL}/api/crash/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });
    } catch (error) {
      console.error('Send crash report error:', error);
    }
  }

  async recoverFromError(error: Error, context?: Record<string, any>): Promise<boolean> {
    try {
      await this.logCrash(error.message, error.stack, context);

      const recoveryActions = [
        this.clearCache,
        this.resetState,
        this.reloadApp,
      ];

      for (const action of recoveryActions) {
        try {
          await action();
          return true;
        } catch (err) {
          console.error('Recovery action error:', err);
        }
      }

      return false;
    } catch (err) {
      console.error('Recover from error error:', err);
      return false;
    }
  }

  private async clearCache(): Promise<void> {
    try {
      await storage.remove('cache');
    } catch (error) {
      console.error('Clear cache error:', error);
    }
  }

  private async resetState(): Promise<void> {
    try {
      await storage.remove('app:state');
    } catch (error) {
      console.error('Reset state error:', error);
    }
  }

  private async reloadApp(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.location) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Reload app error:', error);
    }
  }

  getCrashReports(): CrashReport[] {
    return [...this.crashReports];
  }

  async clearCrashReports(): Promise<void> {
    this.crashReports = [];
    await storage.remove('crash:reports');
  }
}

export default CrashProtection.getInstance();

