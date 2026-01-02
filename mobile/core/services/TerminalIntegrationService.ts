/**
 * RARE 4N - Terminal Integration Service
 * Integrated Communication Hub: Widget, Client Portal, Twilio, Email, Phone, and Media Generation.
 */

import { RAREKernel } from '../RAREKernel';

// جلب رابط السيرفر من الإعدادات
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.zien-ai.app';

export class TerminalIntegrationService {
  private kernel: RAREKernel;

  constructor() {
    this.kernel = RAREKernel.getInstance();
  }

  /**
   * notifyClientViaWidget: إرسال إشعار مباشر لـ Widget العميل
   */
  async notifyClientViaWidget(clientId: string, message: string, data?: any): Promise<void> {
    try {
      this.kernel.emit({
        type: 'agent:portal:execute',
        data: {
          action: 'send_widget_notification',
          parameters: { clientId, message, data },
        },
      });
    } catch (error) {
      console.error('[Terminal] Widget notification error:', error);
      throw error;
    }
  }

  /**
   * sendWhatsApp: إرسال رسالة واتساب عبر Twilio
   */
  async sendWhatsApp(phone: string, message: string, template?: string): Promise<void> {
    try {
      this.kernel.emit({
        type: 'agent:communication:execute',
        data: {
          action: 'send_whatsapp',
          parameters: { phone, message, template },
        },
      });
    } catch (error) {
      console.error('[Terminal] WhatsApp error:', error);
      throw error;
    }
  }

  /**
   * sendEmail: إرسال بريد إلكتروني احترافي مع مرفقات
   */
  async sendEmail(to: string, subject: string, body: string, attachments?: any[]): Promise<void> {
    try {
      this.kernel.emit({
        type: 'agent:communication:execute',
        data: {
          action: 'send_email',
          parameters: { to, subject, body, attachments },
        },
      });
    } catch (error) {
      console.error('[Terminal] Email error:', error);
      throw error;
    }
  }

  /**
   * generateClientPortalLink: إنشاء رابط دخول آمن للعميل
   */
  async generateClientPortalLink(clientId: string, requestId?: string): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/api/client-portal/generate-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, requestId }),
      });
      const data = await response.json();
      return data.link || '';
    } catch (error) {
      console.error('[Terminal] Portal link error:', error);
      return '';
    }
  }

  /**
   * generateMedia: توليد ملفات أو صور أو فيديو ذكياً
   */
  async generateFile(type: string, content: string, filename?: string): Promise<void> {
    this.kernel.emit({
      type: 'agent:filing:execute',
      data: {
        action: 'generate_file',
        parameters: { type, content, filename },
      },
    });
  }

  /**
   * notifyClientComprehensive: إرسال إشعار شامل (Widget + WhatsApp + Email)
   * يستخدم عند اكتمال بناء تطبيق العميل مثلاً.
   */
  async notifyClientComprehensive(clientId: string, phone: string, email: string, message: string, link?: string): Promise<void> {
    try {
      // إشعار الـ Widget
      await this.notifyClientViaWidget(clientId, message, { link });

      // رسالة الواتساب
      if (phone) await this.sendWhatsApp(phone, message, 'build_completion');

      // رسالة الإيميل
      if (email) {
        await this.sendEmail(email, 'تحديث من RARE 4N', `${message}\n\nالرابط: ${link}`);
      }
    } catch (error) {
      console.error('[Terminal] Comprehensive notification error:', error);
    }
  }
}