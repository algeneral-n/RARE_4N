/**
 * RARE 4N - Multi-AI Codex Service
 * GPT + Gemini + Claude - مقارنة الكود
 */

import { API_URL } from './config';

export type CodexProvider = 'gpt' | 'gemini' | 'claude';

export interface CodeRequest {
  prompt: string;
  language: string;
  context?: string;
  providers?: CodexProvider[];
}

export interface CodeResult {
  provider: CodexProvider;
  code: string;
  explanation: string;
  quality: number;
  time: number;
}

class MultiAICodex {
  private static instance: MultiAICodex;

  private constructor() {}

  static getInstance(): MultiAICodex {
    if (!MultiAICodex.instance) {
      MultiAICodex.instance = new MultiAICodex();
    }
    return MultiAICodex.instance;
  }

  /**
   * Generate code with multiple AIs
   */
  async generateCode(request: CodeRequest): Promise<CodeResult> {
    const providers = request.providers || ['gpt', 'gemini', 'claude'];
    
    try {
      const response = await fetch(`${API_URL}/api/codex/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          language: request.language,
          context: request.context,
          providers,
        }),
      });

      if (!response.ok) {
        throw new Error(`Code generation failed: ${response.status}`);
      }

      const data = await response.json();
      return data.bestResult;
    } catch (error) {
      console.error('Code generation error:', error);
      throw error;
    }
  }

  /**
   * Compare code from multiple AIs
   */
  async compareCode(request: CodeRequest): Promise<CodeResult[]> {
    const providers = request.providers || ['gpt', 'gemini', 'claude'];
    
    try {
      const response = await fetch(`${API_URL}/api/codex/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          language: request.language,
          context: request.context,
          providers,
        }),
      });

      if (!response.ok) {
        throw new Error(`Code comparison failed: ${response.status}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Code comparison error:', error);
      throw error;
    }
  }

  /**
   * Get supported languages/extensions
   */
  getSupportedLanguages(): string[] {
    return [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust',
      'swift', 'kotlin', 'html', 'css', 'sql', 'jsx', 'tsx', 'vue', 'svelte',
    ];
  }
}

export const multiAICodex = MultiAICodex.getInstance();
export default multiAICodex;

 * RARE 4N - Multi-AI Codex Service
 * GPT + Gemini + Claude - مقارنة الكود
 */

import { API_URL } from './config';

export type CodexProvider = 'gpt' | 'gemini' | 'claude';

export interface CodeRequest {
  prompt: string;
  language: string;
  context?: string;
  providers?: CodexProvider[];
}

export interface CodeResult {
  provider: CodexProvider;
  code: string;
  explanation: string;
  quality: number;
  time: number;
}

class MultiAICodex {
  private static instance: MultiAICodex;

  private constructor() {}

  static getInstance(): MultiAICodex {
    if (!MultiAICodex.instance) {
      MultiAICodex.instance = new MultiAICodex();
    }
    return MultiAICodex.instance;
  }

  /**
   * Generate code with multiple AIs
   */
  async generateCode(request: CodeRequest): Promise<CodeResult> {
    const providers = request.providers || ['gpt', 'gemini', 'claude'];
    
    try {
      const response = await fetch(`${API_URL}/api/codex/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          language: request.language,
          context: request.context,
          providers,
        }),
      });

      if (!response.ok) {
        throw new Error(`Code generation failed: ${response.status}`);
      }

      const data = await response.json();
      return data.bestResult;
    } catch (error) {
      console.error('Code generation error:', error);
      throw error;
    }
  }

  /**
   * Compare code from multiple AIs
   */
  async compareCode(request: CodeRequest): Promise<CodeResult[]> {
    const providers = request.providers || ['gpt', 'gemini', 'claude'];
    
    try {
      const response = await fetch(`${API_URL}/api/codex/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          language: request.language,
          context: request.context,
          providers,
        }),
      });

      if (!response.ok) {
        throw new Error(`Code comparison failed: ${response.status}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Code comparison error:', error);
      throw error;
    }
  }

  /**
   * Get supported languages/extensions
   */
  getSupportedLanguages(): string[] {
    return [
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust',
      'swift', 'kotlin', 'html', 'css', 'sql', 'jsx', 'tsx', 'vue', 'svelte',
    ];
  }
}

export const multiAICodex = MultiAICodex.getInstance();
export default multiAICodex;


