/**
 * RARE 4N - Communication Analyzer Service
 * تحليل وملخص الرسائل (Email, WhatsApp, SMS)
 */

import { API_URL } from './config';

export interface CommunicationMessage {
  id: string;
  type: 'email' | 'whatsapp' | 'sms';
  from: string;
  to: string;
  subject?: string;
  body: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface AnalysisResult {
  summary: string;
  intent: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  entities: Array<{ type: string; value: string }>;
  actions: Array<{ type: string; description: string }>;
}

class CommunicationAnalyzer {
  private static instance: CommunicationAnalyzer;

  private constructor() {}

  static getInstance(): CommunicationAnalyzer {
    if (!CommunicationAnalyzer.instance) {
      CommunicationAnalyzer.instance = new CommunicationAnalyzer();
    }
    return CommunicationAnalyzer.instance;
  }

  /**
   * Analyze email message
   */
  async analyzeEmail(message: CommunicationMessage): Promise<AnalysisResult> {
    try {
      const response = await fetch(`${API_URL}/api/ultimate-assistant/analyze-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: message.from,
          to: message.to,
          subject: message.subject,
          body: message.body,
          timestamp: message.timestamp,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Email analysis error:', error);
      return this.getDefaultAnalysis(message.body);
    }
  }

  /**
   * Analyze WhatsApp message
   */
  async analyzeWhatsApp(message: CommunicationMessage): Promise<AnalysisResult> {
    try {
      const response = await fetch(`${API_URL}/api/ultimate-assistant/analyze-whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: message.from,
          to: message.to,
          body: message.body,
          timestamp: message.timestamp,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('WhatsApp analysis error:', error);
      return this.getDefaultAnalysis(message.body);
    }
  }

  /**
   * Analyze SMS message
   */
  async analyzeSMS(message: CommunicationMessage): Promise<AnalysisResult> {
    try {
      const response = await fetch(`${API_URL}/api/ultimate-assistant/analyze-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: message.from,
          to: message.to,
          body: message.body,
          timestamp: message.timestamp,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('SMS analysis error:', error);
      return this.getDefaultAnalysis(message.body);
    }
  }

  /**
   * Analyze multiple messages
   */
  async analyzeBatch(messages: CommunicationMessage[]): Promise<AnalysisResult[]> {
    return Promise.all(
      messages.map((msg) => {
        switch (msg.type) {
          case 'email':
            return this.analyzeEmail(msg);
          case 'whatsapp':
            return this.analyzeWhatsApp(msg);
          case 'sms':
            return this.analyzeSMS(msg);
          default:
            return this.getDefaultAnalysis(msg.body);
        }
      })
    );
  }

  /**
   * Get summary of multiple messages
   */
  async getSummary(messages: CommunicationMessage[]): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/api/ultimate-assistant/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error(`Summary failed: ${response.status}`);
      }

      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.error('Summary error:', error);
      return `تم استقبال ${messages.length} رسالة`;
    }
  }

  private getDefaultAnalysis(text: string): AnalysisResult {
    return {
      summary: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      intent: 'general',
      sentiment: 'neutral',
      urgency: 'low',
      entities: [],
      actions: [],
    };
  }
}

export const communicationAnalyzer = CommunicationAnalyzer.getInstance();
export default communicationAnalyzer;

 * RARE 4N - Communication Analyzer Service
 * تحليل وملخص الرسائل (Email, WhatsApp, SMS)
 */

import { API_URL } from './config';

export interface CommunicationMessage {
  id: string;
  type: 'email' | 'whatsapp' | 'sms';
  from: string;
  to: string;
  subject?: string;
  body: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface AnalysisResult {
  summary: string;
  intent: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  entities: Array<{ type: string; value: string }>;
  actions: Array<{ type: string; description: string }>;
}

class CommunicationAnalyzer {
  private static instance: CommunicationAnalyzer;

  private constructor() {}

  static getInstance(): CommunicationAnalyzer {
    if (!CommunicationAnalyzer.instance) {
      CommunicationAnalyzer.instance = new CommunicationAnalyzer();
    }
    return CommunicationAnalyzer.instance;
  }

  /**
   * Analyze email message
   */
  async analyzeEmail(message: CommunicationMessage): Promise<AnalysisResult> {
    try {
      const response = await fetch(`${API_URL}/api/ultimate-assistant/analyze-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: message.from,
          to: message.to,
          subject: message.subject,
          body: message.body,
          timestamp: message.timestamp,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Email analysis error:', error);
      return this.getDefaultAnalysis(message.body);
    }
  }

  /**
   * Analyze WhatsApp message
   */
  async analyzeWhatsApp(message: CommunicationMessage): Promise<AnalysisResult> {
    try {
      const response = await fetch(`${API_URL}/api/ultimate-assistant/analyze-whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: message.from,
          to: message.to,
          body: message.body,
          timestamp: message.timestamp,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('WhatsApp analysis error:', error);
      return this.getDefaultAnalysis(message.body);
    }
  }

  /**
   * Analyze SMS message
   */
  async analyzeSMS(message: CommunicationMessage): Promise<AnalysisResult> {
    try {
      const response = await fetch(`${API_URL}/api/ultimate-assistant/analyze-sms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: message.from,
          to: message.to,
          body: message.body,
          timestamp: message.timestamp,
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('SMS analysis error:', error);
      return this.getDefaultAnalysis(message.body);
    }
  }

  /**
   * Analyze multiple messages
   */
  async analyzeBatch(messages: CommunicationMessage[]): Promise<AnalysisResult[]> {
    return Promise.all(
      messages.map((msg) => {
        switch (msg.type) {
          case 'email':
            return this.analyzeEmail(msg);
          case 'whatsapp':
            return this.analyzeWhatsApp(msg);
          case 'sms':
            return this.analyzeSMS(msg);
          default:
            return this.getDefaultAnalysis(msg.body);
        }
      })
    );
  }

  /**
   * Get summary of multiple messages
   */
  async getSummary(messages: CommunicationMessage[]): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/api/ultimate-assistant/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        throw new Error(`Summary failed: ${response.status}`);
      }

      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.error('Summary error:', error);
      return `تم استقبال ${messages.length} رسالة`;
    }
  }

  private getDefaultAnalysis(text: string): AnalysisResult {
    return {
      summary: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      intent: 'general',
      sentiment: 'neutral',
      urgency: 'low',
      entities: [],
      actions: [],
    };
  }
}

export const communicationAnalyzer = CommunicationAnalyzer.getInstance();
export default communicationAnalyzer;


