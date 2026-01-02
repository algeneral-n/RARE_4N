/**
 * FilingAgent - وكيل إدارة الملفات
 * المسؤول عن: رفع الملفات، جلب القوائم، التحميل، الحذف، والمسح الضوئي (OCR).
 */

import { BaseAgent } from './BaseAgent';

// جلب الرابط من الإعدادات العامة للمشروع
import { API_URL } from '../../services/config';

export class FilingAgent extends BaseAgent {
  constructor() {
    super({
      id: 'filing',
      name: 'Filing Agent',
      description: 'إدارة الملفات والتحليل الضوئي للنصوص',
      capabilities: [
        'list_files',
        'upload_file',
        'download_file',
        'delete_file',
        'ocr_scan',
        'generate_image',
      ],
    });
  }

  /**
   * onExecuteAction: المحرك الأساسي لتنفيذ أوامر الملفات
   */
  protected async onExecuteAction(action: string, parameters: any): Promise<any> {
    try {
      // التحقق من صحة الأمر
      if (!action || typeof action !== 'string') {
        throw new Error('أمر غير صالح');
      }
      
      let result: any;
      
      switch (action) {
        case 'list_files':
          result = await this.listFiles();
          break;

        case 'upload_file':
          if (!parameters?.file) throw new Error('الملف مطلوب للرفع');
          result = await this.uploadFile(parameters.file);
          break;

        case 'download_file':
          if (!parameters?.fileId) throw new Error('معرف الملف مطلوب للتحميل');
          result = await this.downloadFile(parameters.fileId);
          break;

        case 'ocr_scan':
          if (!parameters?.imageUri) throw new Error('رابط الصورة مطلوب للمسح الضوئي');
          result = await this.ocrScan(parameters.imageUri);
          break;

        case 'delete_file':
          if (!parameters?.fileId) throw new Error('معرف الملف مطلوب للحذف');
          result = await this.deleteFile(parameters.fileId);
          break;

        default:
          throw new Error(`الأمر ${action} غير مدعوم في وكيل الملفات`);
      }
      
      return result;
    } catch (error: any) {
      console.error(`[FilingAgent] فشلت العملية ${action}:`, error);
      throw error;
    }
  }

  /**
   * listFiles: جلب قائمة الملفات من السيرفر
   */
  private async listFiles(): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/api/files/list`);
      if (!response.ok) throw new Error(`خطأ في الاتصال بالسيرفر: ${response.status}`);
      
      const json = await response.json();
      
      if (json.success && json.files) {
        this.emit('agent:filing:response', { files: json.files });
      } else {
        this.emit('agent:filing:error', { error: json.error || 'فشل جلب قائمة الملفات' });
      }
      
      return json;
    } catch (error: any) {
      this.emit('agent:filing:error', { error: error?.message || 'فشل الاتصال' });
      throw error;
    }
  }

  /**
   * uploadFile: رفع ملف جديد باستخدام FormData
   */
  private async uploadFile(file: any): Promise<any> {
    const formData = new FormData();
    formData.append('file', file as any);

    const response = await fetch(`${API_URL}/api/files/upload`, {
      method: 'POST',
      body: formData,
    });

    const json = await response.json();
    if (json.success) {
      this.emit('agent:filing:response', { file: json.file });
    }
    return json;
  }

  /**
   * ocrScan: تحليل النصوص من الصور (OCR)
   * يدعم روابط الملفات المحلية والـ File IDs من السيرفر
   */
  private async ocrScan(imageUri: string): Promise<any> {
    let response;

    // إذا كان المدخل File ID وليس رابطاً كاملاً
    if (imageUri && !imageUri.startsWith('file://') && !imageUri.startsWith('http')) {
      response = await fetch(`${API_URL}/api/ocr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId: imageUri }),
      });
    } else {
      // رفع الصورة الحالية للمسح الضوئي
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'scan.jpg',
      } as any);

      response = await fetch(`${API_URL}/api/ocr`, {
        method: 'POST',
        body: formData,
      });
    }

    const json = await response.json();
    if (json.success) {
      this.emit('agent:filing:response', { ocr: json.text });
    }
    return json;
  }

  private async deleteFile(fileId: string): Promise<any> {
    const response = await fetch(`${API_URL}/api/files/delete/${fileId}`, {
      method: 'DELETE',
    });
    return await response.json();
  }

  private async downloadFile(fileId: string): Promise<any> {
    return await fetch(`${API_URL}/api/files/download/${fileId}`);
  }
}