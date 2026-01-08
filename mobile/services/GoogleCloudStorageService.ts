/**
 * RARE 4N - Google Cloud Storage Service
 * ربط مع Google Cloud Storage
 */

import { API_URL } from './config';
import * as FileSystem from 'expo-file-system';

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  mimeType: string;
}

class GoogleCloudStorageService {
  private static instance: GoogleCloudStorageService;

  private constructor() {}

  static getInstance(): GoogleCloudStorageService {
    if (!GoogleCloudStorageService.instance) {
      GoogleCloudStorageService.instance = new GoogleCloudStorageService();
    }
    return GoogleCloudStorageService.instance;
  }

  async uploadFile(fileUri: string, fileName: string, folder?: string): Promise<UploadResult> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: 'application/octet-stream',
        name: fileName,
      } as any);
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await fetch(`${API_URL}/api/storage/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (data.success && data.file) {
        return {
          url: data.file.url,
          path: data.file.path,
          size: data.file.size,
          mimeType: data.file.mimeType,
        };
      }

      throw new Error(data.error || 'Failed to upload file');
    } catch (error: any) {
      console.error('Upload file error:', error);
      throw error;
    }
  }

  async downloadFile(filePath: string, localPath: string): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/api/storage/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: filePath,
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        const downloadResult = await FileSystem.downloadAsync(data.url, localPath);
        return downloadResult.uri;
      }

      throw new Error(data.error || 'Failed to download file');
    } catch (error: any) {
      console.error('Download file error:', error);
      throw error;
    }
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/storage/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: filePath,
        }),
      });

      const data = await response.json();

      return data.success || false;
    } catch (error: any) {
      console.error('Delete file error:', error);
      return false;
    }
  }

  async listFiles(folder?: string): Promise<Array<{ name: string; path: string; size: number; mimeType: string }>> {
    try {
      const response = await fetch(`${API_URL}/api/storage/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folder: folder || '',
        }),
      });

      const data = await response.json();

      if (data.success && data.files) {
        return data.files;
      }

      throw new Error(data.error || 'Failed to list files');
    } catch (error: any) {
      console.error('List files error:', error);
      throw error;
    }
  }
}

export default GoogleCloudStorageService.getInstance();

