/**
 * RARE 4N - Dual AI Service
 * GPT + Gemini معاً - مقارنة الردود
 */

import { API_URL } from './config';

export interface AIResponse {
  provider: 'gpt' | 'gemini';
  response: string;
  quality: number;
  time: number;
  tokens?: number;
}

export interface DualAIResult {
  best: AIResponse;
  all: AIResponse[];
  comparison: {
    faster: 'gpt' | 'gemini';
    better: 'gpt' | 'gemini';
    moreTokens: 'gpt' | 'gemini';
  };
}

class DualAIService {
  private static instance: DualAIService;

  private constructor() {}

  static getInstance(): DualAIService {
    if (!DualAIService.instance) {
      DualAIService.instance = new DualAIService();
    }
    return DualAIService.instance;
  }

  async generate(prompt: string, context?: string): Promise<DualAIResult> {
    try {
      const response = await fetch(`${API_URL}/api/ai/dual-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          context: context || '',
        }),
      });

      const data = await response.json();

      if (data.success && data.results) {
        return this.compareResponses(data.results);
      }

      throw new Error(data.error || 'Failed to generate responses');
    } catch (error: any) {
      console.error('Dual AI generate error:', error);
      throw error;
    }
  }

  private compareResponses(results: AIResponse[]): DualAIResult {
    const gptResponse = results.find(r => r.provider === 'gpt');
    const geminiResponse = results.find(r => r.provider === 'gemini');

    if (!gptResponse || !geminiResponse) {
      throw new Error('Missing AI responses');
    }

    const faster = gptResponse.time < geminiResponse.time ? 'gpt' : 'gemini';
    const better = gptResponse.quality > geminiResponse.quality ? 'gpt' : 'gemini';
    const moreTokens = (gptResponse.tokens || 0) > (geminiResponse.tokens || 0) ? 'gpt' : 'gemini';

    const best = gptResponse.quality > geminiResponse.quality ? gptResponse : geminiResponse;

    return {
      best,
      all: results,
      comparison: {
        faster,
        better,
        moreTokens,
      },
    };
  }

  async chat(messages: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<DualAIResult> {
    try {
      const response = await fetch(`${API_URL}/api/ai/dual-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
        }),
      });

      const data = await response.json();

      if (data.success && data.results) {
        return this.compareResponses(data.results);
      }

      throw new Error(data.error || 'Failed to chat');
    } catch (error: any) {
      console.error('Dual AI chat error:', error);
      throw error;
    }
  }

  async analyze(text: string): Promise<DualAIResult> {
    try {
      const response = await fetch(`${API_URL}/api/ai/dual-analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
        }),
      });

      const data = await response.json();

      if (data.success && data.results) {
        return this.compareResponses(data.results);
      }

      throw new Error(data.error || 'Failed to analyze');
    } catch (error: any) {
      console.error('Dual AI analyze error:', error);
      throw error;
    }
  }
}

export default DualAIService.getInstance();

