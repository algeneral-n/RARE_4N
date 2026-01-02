/**
 * RARE 4N - Auto Builder Memory
 * ذاكرة Auto Builder - حفظ واسترجاع بيانات المشاريع
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEMORY_DIR = path.join(__dirname, '../../../data/autobuilder-memory');

if (!fs.existsSync(MEMORY_DIR)) {
  fs.mkdirSync(MEMORY_DIR, { recursive: true });
}

export interface MemoryEntry {
  requestId?: string;
  clientId?: string;
  blueprint?: any;
  builds?: any;
  delivery?: any;
  timestamp?: number;
}

export class AutoBuilderMemory {
  /**
   * حفظ بيانات المشروع
   */
  static async save(entry: MemoryEntry): Promise<boolean> {
    try {
      const requestId = entry.requestId || `req_${Date.now()}`;
      const filePath = path.join(MEMORY_DIR, `${requestId}.json`);

      const data = {
        ...entry,
        requestId,
        savedAt: new Date().toISOString(),
      };

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`[AutoBuilderMemory] Saved: ${requestId}`);
      return true;
    } catch (error: any) {
      console.error('[AutoBuilderMemory] Save error:', error);
      return false;
    }
  }

  /**
   * استرجاع بيانات المشروع
   */
  static async get(requestId: string): Promise<MemoryEntry | null> {
    try {
      const filePath = path.join(MEMORY_DIR, `${requestId}.json`);

      if (!fs.existsSync(filePath)) {
        return null;
      }

      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error: any) {
      console.error('[AutoBuilderMemory] Get error:', error);
      return null;
    }
  }

  /**
   * الحصول على جميع المشاريع
   */
  static async getAll(): Promise<MemoryEntry[]> {
    try {
      const files = fs.readdirSync(MEMORY_DIR);
      const entries: MemoryEntry[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(MEMORY_DIR, file);
          const data = fs.readFileSync(filePath, 'utf-8');
          entries.push(JSON.parse(data));
        }
      }

      return entries.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (error: any) {
      console.error('[AutoBuilderMemory] GetAll error:', error);
      return [];
    }
  }

  /**
   * حذف بيانات المشروع
   */
  static async delete(requestId: string): Promise<boolean> {
    try {
      const filePath = path.join(MEMORY_DIR, `${requestId}.json`);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`[AutoBuilderMemory] Deleted: ${requestId}`);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('[AutoBuilderMemory] Delete error:', error);
      return false;
    }
  }
}



















