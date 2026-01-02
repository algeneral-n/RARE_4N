/**
 * RARE 4N - File Manager Service
 * إدارة تصنيفات الملفات، السجل، البحث، والمعاينة
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uri: string;
  category: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  preview?: string;
}

export interface FileCategory {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  color: string;
}

// ✅ تم تصحيح الأسماء العربية لتظهر بشكل سليم في الواجهة
export const FILE_CATEGORIES: FileCategory[] = [
  { id: 'all', name: 'All Files', nameAr: 'جميع الملفات', icon: 'folder', color: '#00eaff' },
  { id: 'code', name: 'Code', nameAr: 'برمجة', icon: 'code', color: '#00ff41' },
  { id: 'image', name: 'Images', nameAr: 'صور', icon: 'image', color: '#ff00ff' },
  { id: 'video', name: 'Videos', nameAr: 'فيديو', icon: 'video', color: '#ff0040' },
  { id: 'document', name: 'Documents', nameAr: 'مستندات', icon: 'document', color: '#00d4ff' },
  { id: 'audio', name: 'Audio', nameAr: 'صوت', icon: 'audio', color: '#a855f7' },
  { id: 'archive', name: 'Archives', nameAr: 'أرشيف', icon: 'archive', color: '#ffd700' },
  { id: 'other', name: 'Other', nameAr: 'أخرى', icon: 'file', color: '#666666' },
];

class FileManager {
  private files: Map<string, FileItem> = new Map();
  private readonly STORAGE_KEY = 'rare4n_files';

  async init(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const filesArray = JSON.parse(stored);
        if (Array.isArray(filesArray)) {
          filesArray.forEach((file: FileItem) => {
            if (file && file.id && file.name) {
              this.files.set(file.id, file);
            }
          });
        }
      }
    } catch (error) {
      console.error('FileManager init error:', error);
    }
  }

  private async save(): Promise<void> {
    try {
      const filesArray = Array.from(this.files.values());
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(filesArray));
    } catch (error) {
      console.error('FileManager save error:', error);
    }
  }

  async addFile(file: Omit<FileItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<FileItem> {
    if (!file.name || !file.type || !file.uri) {
      throw new Error('File name, type, and URI are required');
    }

    const fileItem: FileItem = {
      ...file,
      id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.files.set(fileItem.id, fileItem);
    await this.save();
    return fileItem;
  }

  getFile(id: string): FileItem | undefined {
    return this.files.get(id);
  }

  getAllFiles(): FileItem[] {
    return Array.from(this.files.values());
  }

  getFilesByCategory(categoryId: string): FileItem[] {
    if (categoryId === 'all') return this.getAllFiles();
    return this.getAllFiles().filter(file => file.category === categoryId);
  }

  getFileHistory(limit?: number): FileItem[] {
    const files = this.getAllFiles();
    files.sort((a, b) => b.updatedAt - a.updatedAt);
    return limit ? files.slice(0, limit) : files;
  }

  searchFiles(query: string): FileItem[] {
    if (!query) return [];
    const lowerQuery = query.toLowerCase().trim();
    return this.getAllFiles().filter(file =>
      file.name.toLowerCase().includes(lowerQuery) ||
      file.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async deleteFile(id: string): Promise<void> {
    if (this.files.has(id)) {
      this.files.delete(id);
      await this.save();
    }
  }
}

export const fileManager = new FileManager();