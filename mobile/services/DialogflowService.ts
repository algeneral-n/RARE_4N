/**
 * RARE 4N - Dialogflow Service
 * ربط مع Google Dialogflow API
 */

import { API_URL } from './config';

export interface DialogflowResponse {
  intent: string;
  confidence: number;
  response: string;
  entities?: Array<{ type: string; value: string }>;
}

class DialogflowService {
  private static instance: DialogflowService;

  private constructor() {}

  static getInstance(): DialogflowService {
    if (!DialogflowService.instance) {
      DialogflowService.instance = new DialogflowService();
    }
    return DialogflowService.instance;
  }

  async detectIntent(text: string, languageCode: string = 'ar'): Promise<DialogflowResponse> {
    try {
      const response = await fetch(`${API_URL}/api/dialogflow/detect-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          languageCode,
        }),
      });

      const data = await response.json();

      if (data.success && data.result) {
        return data.result;
      }

      throw new Error(data.error || 'Failed to detect intent');
    } catch (error: any) {
      console.error('Dialogflow detect intent error:', error);
      throw error;
    }
  }

  async processVoice(audioUri: string, languageCode: string = 'ar'): Promise<DialogflowResponse> {
    try {
      const formData = new FormData();
      formData.append('audio', {
        uri: audioUri,
        type: 'audio/wav',
        name: 'audio.wav',
      } as any);
      formData.append('languageCode', languageCode);

      const response = await fetch(`${API_URL}/api/dialogflow/process-voice`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();

      if (data.success && data.result) {
        return data.result;
      }

      throw new Error(data.error || 'Failed to process voice');
    } catch (error: any) {
      console.error('Dialogflow process voice error:', error);
      throw error;
    }
  }

  async getResponse(intent: string, context?: Record<string, any>): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/api/dialogflow/get-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          intent,
          context: context || {},
        }),
      });

      const data = await response.json();

      if (data.success && data.response) {
        return data.response;
      }

      throw new Error(data.error || 'Failed to get response');
    } catch (error: any) {
      console.error('Dialogflow get response error:', error);
      throw error;
    }
  }
}

export default DialogflowService.getInstance();

