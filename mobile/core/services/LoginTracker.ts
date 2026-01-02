/**
 * RARE 4N - Login Tracker
 * Monitors and records login attempts, session duration, and device security analytics.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface LoginAttempt {
  id: string;
  timestamp: number;
  method: 'password' | 'faceid' | 'google' | 'apple';
  success: boolean;
  userId?: string;
  error?: string;
  deviceInfo: {
    platform: string;
    osVersion: string | number;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface LoginSession {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  loginMethod: string;
}

export class LoginTracker {
  private static instance: LoginTracker;
  private loginAttempts: LoginAttempt[] = [];
  private activeSessions: Map<string, LoginSession> = new Map();
  private readonly maxAttemptsHistory = 1000;

  private constructor() {
    this.loadHistory();
  }

  static getInstance(): LoginTracker {
    if (!LoginTracker.instance) {
      LoginTracker.instance = new LoginTracker();
    }
    return LoginTracker.instance;
  }

  /**
   * trackAttempt: تسجيل محاولة دخول جديدة (ناجحة أو فاشلة)
   */
  async trackAttempt(
    method: LoginAttempt['method'],
    success: boolean,
    userId?: string,
    error?: string
  ): Promise<string> {
    const attempt: LoginAttempt = {
      id: `login_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: Date.now(),
      method,
      success,
      userId,
      error,
      deviceInfo: {
        platform: Platform.OS,
        osVersion: Platform.Version,
      }
    };

    this.loginAttempts.push(attempt);
    if (this.loginAttempts.length > this.maxAttemptsHistory) {
      this.loginAttempts.shift();
    }

    await this.saveHistory();

    if (success && userId) {
      await this.startSession(userId, method);
    }

    return attempt.id;
  }

  private async startSession(userId: string, method: string): Promise<void> {
    const session: LoginSession = {
      id: `session_${Date.now()}`,
      userId,
      startTime: Date.now(),
      loginMethod: method,
    };
    this.activeSessions.set(session.id, session);
    await this.saveSessions();
  }

  async endSession(sessionId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.endTime = Date.now();
      session.duration = session.endTime - session.startTime;
      this.activeSessions.delete(sessionId);
      await this.saveSessions();
    }
  }

  getStatistics() {
    const total = this.loginAttempts.length;
    const success = this.loginAttempts.filter(a => a.success).length;
    return {
      totalAttempts: total,
      successRate: total > 0 ? (success / total) * 100 : 0,
      failedAttempts: total - success,
    };
  }

  private async saveHistory(): Promise<void> {
    try {
      await AsyncStorage.setItem('login_history', JSON.stringify(this.loginAttempts));
    } catch (e) { console.error('History save error', e); }
  }

  private async loadHistory(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('login_history');
      if (stored) this.loginAttempts = JSON.parse(stored);
    } catch (e) { console.error('History load error', e); }
  }

  private async saveSessions(): Promise<void> {
    try {
      const sessions = Array.from(this.activeSessions.values());
      await AsyncStorage.setItem('active_sessions', JSON.stringify(sessions));
    } catch (e) { console.error('Sessions save error', e); }
  }
}