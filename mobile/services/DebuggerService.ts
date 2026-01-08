/**
 * RARE 4N - Debugger Service
 * Debug capabilities and logging
 */

import { storage } from '../utils/storage';

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: number;
  context?: Record<string, any>;
  stack?: string;
}

export interface ErrorTrack {
  id: string;
  error: string;
  stack?: string;
  count: number;
  firstOccurrence: number;
  lastOccurrence: number;
  context?: Record<string, any>;
}

class DebuggerService {
  private static instance: DebuggerService;
  private logs: LogEntry[] = [];
  private errors: Map<string, ErrorTrack> = new Map();
  private maxLogs = 1000;
  private maxErrors = 100;

  private constructor() {
    this.loadLogs();
    this.loadErrors();
  }

  static getInstance(): DebuggerService {
    if (!DebuggerService.instance) {
      DebuggerService.instance = new DebuggerService();
    }
    return DebuggerService.instance;
  }

  private async loadLogs(): Promise<void> {
    try {
      const savedLogs = await storage.get<LogEntry[]>('debug:logs');
      if (savedLogs) {
        this.logs = savedLogs.slice(-this.maxLogs);
      }
    } catch (error) {
      console.error('Load logs error:', error);
    }
  }

  private async loadErrors(): Promise<void> {
    try {
      const savedErrors = await storage.get<Array<[string, ErrorTrack]>>('debug:errors');
      if (savedErrors) {
        this.errors = new Map(savedErrors);
      }
    } catch (error) {
      console.error('Load errors error:', error);
    }
  }

  async log(level: LogEntry['level'], message: string, context?: Record<string, any>): Promise<void> {
    try {
      const entry: LogEntry = {
        level,
        message,
        timestamp: Date.now(),
        context,
      };

      this.logs.push(entry);
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(-this.maxLogs);
      }

      await storage.set('debug:logs', this.logs);

      if (level === 'error') {
        await this.trackError(message, undefined, context);
      }
    } catch (error) {
      console.error('Log error:', error);
    }
  }

  async trackError(error: string, stack?: string, context?: Record<string, any>): Promise<void> {
    try {
      const errorId = this.getErrorId(error, stack);
      const existing = this.errors.get(errorId);

      if (existing) {
        existing.count++;
        existing.lastOccurrence = Date.now();
        if (context) {
          existing.context = { ...existing.context, ...context };
        }
      } else {
        const track: ErrorTrack = {
          id: errorId,
          error,
          stack,
          count: 1,
          firstOccurrence: Date.now(),
          lastOccurrence: Date.now(),
          context,
        };
        this.errors.set(errorId, track);
      }

      if (this.errors.size > this.maxErrors) {
        const firstKey = this.errors.keys().next().value;
        this.errors.delete(firstKey);
      }

      await storage.set('debug:errors', Array.from(this.errors.entries()));
    } catch (err) {
      console.error('Track error error:', err);
    }
  }

  private getErrorId(error: string, stack?: string): string {
    const stackHash = stack ? this.hashString(stack.substring(0, 100)) : '';
    return this.hashString(error + stackHash);
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  getLogs(level?: LogEntry['level'], limit?: number): LogEntry[] {
    let filtered = this.logs;
    if (level) {
      filtered = filtered.filter(log => log.level === level);
    }
    if (limit) {
      filtered = filtered.slice(-limit);
    }
    return [...filtered];
  }

  getErrors(): ErrorTrack[] {
    return Array.from(this.errors.values());
  }

  async clearLogs(): Promise<void> {
    this.logs = [];
    await storage.remove('debug:logs');
  }

  async clearErrors(): Promise<void> {
    this.errors.clear();
    await storage.remove('debug:errors');
  }

  async exportLogs(): Promise<string> {
    return JSON.stringify(this.logs, null, 2);
  }

  async exportErrors(): Promise<string> {
    return JSON.stringify(Array.from(this.errors.values()), null, 2);
  }
}

export default DebuggerService.getInstance();

