/**
 * RARE 4N - Voice Understanding
 * فهم وتحليل الطلبات الصوتية والنصية
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface UnderstoodRequest {
  raw: string;
  intent: string;
  projectType?: 'mobile-app' | 'web-app' | 'desktop-app' | 'api';
  features?: string[];
  platforms?: string[];
  requirements?: string[];
  style?: string;
  targetAudience?: string;
  language?: string;
}

export class VoiceUnderstanding {
  /**
   * تحليل وفهم الطلب (صوتي أو نصي)
   */
  static async parse(text: string): Promise<UnderstoodRequest> {
    try {
      if (!text || typeof text !== 'string') {
        return { raw: text || '', intent: 'unknown' };
      }

      // إذا كان OPENAI_API_KEY موجود، استخدم GPT لتحليل الطلب
      if (process.env.OPENAI_API_KEY) {
        try {
          const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: `أنت مساعد متخصص في تحليل طلبات بناء التطبيقات. حلل الطلب التالي وحدد:
1. نوع المشروع (mobile-app, web-app, desktop-app, api)
2. الميزات المطلوبة
3. المنصات (ios, android, web)
4. المتطلبات
5. الأسلوب والتصميم
6. الجمهور المستهدف
7. اللغة

أرجع JSON فقط بدون أي نص إضافي.`
              },
              {
                role: 'user',
                content: text
              }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3,
          });

          const parsed = JSON.parse(response.choices[0].message.content || '{}');
          
          return {
            raw: text,
            intent: parsed.intent || 'build-app',
            projectType: parsed.projectType || 'mobile-app',
            features: parsed.features || [],
            platforms: parsed.platforms || ['ios', 'android'],
            requirements: parsed.requirements || [],
            style: parsed.style || 'modern',
            targetAudience: parsed.targetAudience || 'general',
            language: parsed.language || 'ar',
          };
        } catch (error) {
          console.warn('[VoiceUnderstanding] GPT parsing failed, using fallback:', error);
        }
      }

      // Fallback: تحليل بسيط
      return this.simpleParse(text);
    } catch (error: any) {
      console.error('[VoiceUnderstanding] Parse error:', error);
      return { raw: text, intent: 'unknown' };
    }
  }

  /**
   * تحليل بسيط بدون GPT
   */
  private static simpleParse(text: string): UnderstoodRequest {
    const lowerText = text.toLowerCase();
    
    // تحديد نوع المشروع
    let projectType: 'mobile-app' | 'web-app' | 'desktop-app' | 'api' = 'mobile-app';
    if (lowerText.includes('موقع') || lowerText.includes('web') || lowerText.includes('website')) {
      projectType = 'web-app';
    } else if (lowerText.includes('سطح المكتب') || lowerText.includes('desktop')) {
      projectType = 'desktop-app';
    } else if (lowerText.includes('api') || lowerText.includes('واجهة برمجية')) {
      projectType = 'api';
    }

    // تحديد الميزات
    const features: string[] = [];
    if (lowerText.includes('تسجيل دخول') || lowerText.includes('auth') || lowerText.includes('login')) {
      features.push('authentication');
    }
    if (lowerText.includes('دفع') || lowerText.includes('payment') || lowerText.includes('stripe')) {
      features.push('payment');
    }
    if (lowerText.includes('خريطة') || lowerText.includes('map') || lowerText.includes('location')) {
      features.push('maps');
    }
    if (lowerText.includes('دردشة') || lowerText.includes('chat') || lowerText.includes('messaging')) {
      features.push('chat');
    }
    if (lowerText.includes('كاميرا') || lowerText.includes('camera') || lowerText.includes('photo')) {
      features.push('camera');
    }

    // تحديد المنصات
    const platforms: string[] = [];
    if (lowerText.includes('ios') || lowerText.includes('آيفون') || lowerText.includes('iphone')) {
      platforms.push('ios');
    }
    if (lowerText.includes('android') || lowerText.includes('أندرويد')) {
      platforms.push('android');
    }
    if (lowerText.includes('web') || lowerText.includes('موقع')) {
      platforms.push('web');
    }
    if (platforms.length === 0) {
      platforms.push('ios', 'android'); // Default
    }

    return {
      raw: text,
      intent: 'build-app',
      projectType,
      features,
      platforms,
      requirements: [],
      style: 'modern',
      targetAudience: 'general',
      language: 'ar',
    };
  }
}



















