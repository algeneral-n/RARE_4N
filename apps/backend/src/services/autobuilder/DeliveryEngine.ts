/**
 * RARE 4N - Delivery Engine
 * محرك التسليم - تسليم الملفات للعملاء
 */

import { sendBuildFiles } from '../emailService.js';

export interface DeliveryOptions {
  builds: any;
  clientEmail?: string;
  clientName?: string;
  projectName: string;
}

export interface DeliveryResult {
  delivered: boolean;
  method: string;
  downloadUrl?: string;
  emailSent?: boolean;
  error?: string;
}

export class DeliveryEngine {
  /**
   * تسليم الملفات للعميل
   */
  static async deliver(options: DeliveryOptions): Promise<DeliveryResult> {
    try {
      const { builds, clientEmail, clientName, projectName } = options;

      console.log(`[DeliveryEngine] Delivering ${projectName} to ${clientEmail || 'default'}`);

      // إرسال البريد الإلكتروني
      if (clientEmail) {
        try {
          await sendBuildFiles({
            to: clientEmail,
            clientName: clientName || 'Client',
            projectName,
            builds: builds.builds || [],
          });

          return {
            delivered: true,
            method: 'email',
            emailSent: true,
          };
        } catch (emailError: any) {
          console.warn('[DeliveryEngine] Email delivery failed:', emailError);
          // لا نوقف العملية إذا فشل البريد
        }
      }

      // إنشاء رابط تحميل
      const downloadUrl = `/api/auto-builder/download/${projectName}`;

      return {
        delivered: true,
        method: 'download-link',
        downloadUrl,
        emailSent: !!clientEmail,
      };
    } catch (error: any) {
      console.error('[DeliveryEngine] Error:', error);
      return {
        delivered: false,
        method: 'none',
        error: error.message || 'Delivery failed',
      };
    }
  }
}























