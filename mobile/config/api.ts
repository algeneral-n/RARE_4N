/**
 * RARE 4N - Unified API Service
 * المحرك المركزي للربط بين الكيرنل والباك إند
 */

import { API_BASE, API_TIMEOUT, API_RETRY, getApiUrl } from './config'; // الربط بملف الكونفيج
import { RAREKernel } from '../core/RAREKernel';

class UnifiedApiService {
  private static instance: UnifiedApiService;
  private kernel = RAREKernel.getInstance();

  private constructor() {
    this.setupKernelListeners();
  }

  public static getInstance(): UnifiedApiService {
    if (!UnifiedApiService.instance) {
      UnifiedApiService.instance = new UnifiedApiService();
    }
    return UnifiedApiService.instance;
  }

  // 1️⃣ الاستماع لأوامر الكيرنل وتوجيهها للباك إند
  private setupKernelListeners() {
    // استماع لطلبات التوليد (Generator)
    this.kernel.on('agent:generator:request', async (event) => {
      await this.handleRequest('generator', event.data);
    });

    // استماع لطلبات القبو (Vault & OCR)
    this.kernel.on('agent:vault:request', async (event) => {
      await this.handleRequest('vault', event.data);
    });

    // استماع لطلبات المجلس والأمان (Council & Security)
    this.kernel.on('agent:council:request', async (event) => {
      await this.handleRequest('council', event.data);
    });
  }

  // 2️⃣ المحرك التنفيذي للطلبات مع نظام الـ Retry
  private async handleRequest(service: string, payload: any) {
    const endpoint = this.determineEndpoint(service, payload.action);
    const url = getApiUrl(endpoint);

    let retries = 0;
    while (retries < API_RETRY.maxRetries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const data = await response.json();

        if (response.ok) {
          // إعادة النتيجة للكيرنل لتحديث الواجهة
          this.kernel.emit({ type: `agent:${service}:response`, data: { ...data, success: true } });
          return;
        }

        if (!API_RETRY.retryableStatusCodes.includes(response.status)) break;
      } catch (error) {
        console.error(`Request failed (Attempt ${retries + 1}):`, error);
      }

      retries++;
      await new Promise(res => setTimeout(res, API_RETRY.retryDelay));
    }

    // إبلاغ الكيرنل بالفشل النهائي
    this.kernel.emit({ type: `agent:${service}:error`, data: { error: 'فشل الاتصال بالخادم بعد عدة محاولات' } });
  }

  // 3️⃣ توجيه المسارات بناءً على الملفات الـ 16 الأساسية
  private determineEndpoint(service: string, action: string): string {
    const routes: any = {
      generator: {
        image: '/api/file-generator/image', //
        audio: '/api/file-generator/audio', //
        code: '/api/file-generator/code',   //
      },
      vault: {
        list: '/api/vault/list',        //
        encrypt: '/api/vault/encrypt',  //
        ocr: '/api/vision-ai/analyze',  //
      },
      council: {
        chat: '/api/ai/chat',           //
        voice: '/api/voice/transcribe', //
      }
    };
    return routes[service]?.[action] || `/api/${service}/${action}`;
  }
}

export const apiService = UnifiedApiService.getInstance();