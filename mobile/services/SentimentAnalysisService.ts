/**
 * RARE 4N - Sentiment Analysis Service
 * ربط مع Google Natural Language API
 */

import { API_URL } from './config';

export interface SentimentResult {
  score: number;
  magnitude: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  entities?: Array<{
    name: string;
    type: string;
    salience: number;
  }>;
}

class SentimentAnalysisService {
  private static instance: SentimentAnalysisService;

  private constructor() {}

  static getInstance(): SentimentAnalysisService {
    if (!SentimentAnalysisService.instance) {
      SentimentAnalysisService.instance = new SentimentAnalysisService();
    }
    return SentimentAnalysisService.instance;
  }

  async analyzeSentiment(text: string, language: string = 'ar'): Promise<SentimentResult> {
    try {
      const response = await fetch(`${API_URL}/api/natural-language/analyze-sentiment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language,
        }),
      });

      const data = await response.json();

      if (data.success && data.result) {
        return this.formatSentimentResult(data.result);
      }

      throw new Error(data.error || 'Failed to analyze sentiment');
    } catch (error: any) {
      console.error('Sentiment analysis error:', error);
      throw error;
    }
  }

  async extractEntities(text: string, language: string = 'ar'): Promise<Array<{ name: string; type: string; salience: number }>> {
    try {
      const response = await fetch(`${API_URL}/api/natural-language/extract-entities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language,
        }),
      });

      const data = await response.json();

      if (data.success && data.entities) {
        return data.entities;
      }

      throw new Error(data.error || 'Failed to extract entities');
    } catch (error: any) {
      console.error('Entity extraction error:', error);
      throw error;
    }
  }

  async analyzeText(text: string, language: string = 'ar'): Promise<SentimentResult> {
    try {
      const [sentimentResult, entities] = await Promise.all([
        this.analyzeSentiment(text, language),
        this.extractEntities(text, language),
      ]);

      return {
        ...sentimentResult,
        entities,
      };
    } catch (error: any) {
      console.error('Analyze text error:', error);
      throw error;
    }
  }

  private formatSentimentResult(result: any): SentimentResult {
    const score = result.score || 0;
    const magnitude = result.magnitude || 0;

    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (score > 0.25) {
      sentiment = 'positive';
    } else if (score < -0.25) {
      sentiment = 'negative';
    }

    return {
      score,
      magnitude,
      sentiment,
      entities: result.entities || [],
    };
  }
}

export default SentimentAnalysisService.getInstance();

