/**
 * RARE 4N - Multi-AI Generator Service
 * GPT + ElevenLabs + Gemini + Vision + Claude
 */

import { API_URL } from './config';

export type AIProvider = 'gpt' | 'gemini' | 'claude' | 'elevenlabs' | 'vision';

export interface GenerationRequest {
  prompt: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'code' | 'file';
  providers?: AIProvider[];
  options?: Record<string, any>;
}

export interface GenerationResult {
  provider: AIProvider;
  result: any;
  quality: number;
  time: number;
}

class MultiAIGenerator {
  private static instance: MultiAIGenerator;

  private constructor() {}

  static getInstance(): MultiAIGenerator {
    if (!MultiAIGenerator.instance) {
      MultiAIGenerator.instance = new MultiAIGenerator();
    }
    return MultiAIGenerator.instance;
  }

  /**
   * Generate with multiple AIs and return best result
   */
  async generate(request: GenerationRequest): Promise<GenerationResult> {
    const providers = request.providers || this.getBestProviders(request.type);
    
    try {
      const response = await fetch(`${API_URL}/api/generator/multi-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          type: request.type,
          providers,
          options: request.options || {},
        }),
      });

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.status}`);
      }

      const data = await response.json();
      return data.bestResult;
    } catch (error) {
      console.error('Multi-AI generation error:', error);
      throw error;
    }
  }

  /**
   * Generate with all AIs and compare
   */
  async generateAndCompare(request: GenerationRequest): Promise<GenerationResult[]> {
    const providers = request.providers || ['gpt', 'gemini', 'claude'];
    
    try {
      const response = await fetch(`${API_URL}/api/generator/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          type: request.type,
          providers,
          options: request.options || {},
        }),
      });

      if (!response.ok) {
        throw new Error(`Comparison failed: ${response.status}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('AI comparison error:', error);
      throw error;
    }
  }

  /**
   * Get best providers for task type
   */
  private getBestProviders(type: GenerationRequest['type']): AIProvider[] {
    switch (type) {
      case 'image':
        return ['vision', 'gpt', 'gemini'];
      case 'audio':
        return ['elevenlabs', 'gpt'];
      case 'video':
        return ['vision', 'gpt'];
      case 'code':
        return ['gpt', 'claude', 'gemini'];
      case 'file':
        return ['gpt', 'claude'];
      default:
        return ['gpt', 'gemini', 'claude'];
    }
  }
}

export const multiAIGenerator = MultiAIGenerator.getInstance();
export default multiAIGenerator;

 * RARE 4N - Multi-AI Generator Service
 * GPT + ElevenLabs + Gemini + Vision + Claude
 */

import { API_URL } from './config';

export type AIProvider = 'gpt' | 'gemini' | 'claude' | 'elevenlabs' | 'vision';

export interface GenerationRequest {
  prompt: string;
  type: 'text' | 'image' | 'audio' | 'video' | 'code' | 'file';
  providers?: AIProvider[];
  options?: Record<string, any>;
}

export interface GenerationResult {
  provider: AIProvider;
  result: any;
  quality: number;
  time: number;
}

class MultiAIGenerator {
  private static instance: MultiAIGenerator;

  private constructor() {}

  static getInstance(): MultiAIGenerator {
    if (!MultiAIGenerator.instance) {
      MultiAIGenerator.instance = new MultiAIGenerator();
    }
    return MultiAIGenerator.instance;
  }

  /**
   * Generate with multiple AIs and return best result
   */
  async generate(request: GenerationRequest): Promise<GenerationResult> {
    const providers = request.providers || this.getBestProviders(request.type);
    
    try {
      const response = await fetch(`${API_URL}/api/generator/multi-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          type: request.type,
          providers,
          options: request.options || {},
        }),
      });

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.status}`);
      }

      const data = await response.json();
      return data.bestResult;
    } catch (error) {
      console.error('Multi-AI generation error:', error);
      throw error;
    }
  }

  /**
   * Generate with all AIs and compare
   */
  async generateAndCompare(request: GenerationRequest): Promise<GenerationResult[]> {
    const providers = request.providers || ['gpt', 'gemini', 'claude'];
    
    try {
      const response = await fetch(`${API_URL}/api/generator/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          type: request.type,
          providers,
          options: request.options || {},
        }),
      });

      if (!response.ok) {
        throw new Error(`Comparison failed: ${response.status}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('AI comparison error:', error);
      throw error;
    }
  }

  /**
   * Get best providers for task type
   */
  private getBestProviders(type: GenerationRequest['type']): AIProvider[] {
    switch (type) {
      case 'image':
        return ['vision', 'gpt', 'gemini'];
      case 'audio':
        return ['elevenlabs', 'gpt'];
      case 'video':
        return ['vision', 'gpt'];
      case 'code':
        return ['gpt', 'claude', 'gemini'];
      case 'file':
        return ['gpt', 'claude'];
      default:
        return ['gpt', 'gemini', 'claude'];
    }
  }
}

export const multiAIGenerator = MultiAIGenerator.getInstance();
export default multiAIGenerator;


