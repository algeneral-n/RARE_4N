/**
 * RARE 4N - Risk Detection Service
 * خدمة كشف المخاطر والتهديدات
 */

import { API_URL } from './config';

export interface RiskLevel {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  threats: Array<{ type: string; description: string; severity: number }>;
  recommendations: string[];
}

export interface ThreatAnalysis {
  detected: boolean;
  riskLevel: RiskLevel;
  context: Record<string, any>;
  timestamp: number;
}

class RiskDetectionService {
  private static instance: RiskDetectionService;

  private constructor() {}

  static getInstance(): RiskDetectionService {
    if (!RiskDetectionService.instance) {
      RiskDetectionService.instance = new RiskDetectionService();
    }
    return RiskDetectionService.instance;
  }

  /**
   * Detect risk from text/voice input
   */
  async detectRisk(input: string, context?: Record<string, any>): Promise<ThreatAnalysis> {
    try {
      const response = await fetch(`${API_URL}/api/sos/risk-detection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          context: context || {},
        }),
      });

      if (!response.ok) {
        throw new Error(`Risk detection failed: ${response.status}`);
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Risk detection error:', error);
      return this.getDefaultAnalysis();
    }
  }

  /**
   * Analyze threat level
   */
  async analyzeThreat(input: string): Promise<RiskLevel> {
    try {
      const response = await fetch(`${API_URL}/api/sos/threat-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error(`Threat analysis failed: ${response.status}`);
      }

      const data = await response.json();
      return data.riskLevel;
    } catch (error) {
      console.error('Threat analysis error:', error);
      return {
        level: 'low',
        score: 0,
        threats: [],
        recommendations: [],
      };
    }
  }

  private getDefaultAnalysis(): ThreatAnalysis {
    return {
      detected: false,
      riskLevel: {
        level: 'low',
        score: 0,
        threats: [],
        recommendations: [],
      },
      context: {},
      timestamp: Date.now(),
    };
  }
}

export const riskDetectionService = RiskDetectionService.getInstance();
export default riskDetectionService;

 * RARE 4N - Risk Detection Service
 * خدمة كشف المخاطر والتهديدات
 */

import { API_URL } from './config';

export interface RiskLevel {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  threats: Array<{ type: string; description: string; severity: number }>;
  recommendations: string[];
}

export interface ThreatAnalysis {
  detected: boolean;
  riskLevel: RiskLevel;
  context: Record<string, any>;
  timestamp: number;
}

class RiskDetectionService {
  private static instance: RiskDetectionService;

  private constructor() {}

  static getInstance(): RiskDetectionService {
    if (!RiskDetectionService.instance) {
      RiskDetectionService.instance = new RiskDetectionService();
    }
    return RiskDetectionService.instance;
  }

  /**
   * Detect risk from text/voice input
   */
  async detectRisk(input: string, context?: Record<string, any>): Promise<ThreatAnalysis> {
    try {
      const response = await fetch(`${API_URL}/api/sos/risk-detection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          context: context || {},
        }),
      });

      if (!response.ok) {
        throw new Error(`Risk detection failed: ${response.status}`);
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Risk detection error:', error);
      return this.getDefaultAnalysis();
    }
  }

  /**
   * Analyze threat level
   */
  async analyzeThreat(input: string): Promise<RiskLevel> {
    try {
      const response = await fetch(`${API_URL}/api/sos/threat-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        throw new Error(`Threat analysis failed: ${response.status}`);
      }

      const data = await response.json();
      return data.riskLevel;
    } catch (error) {
      console.error('Threat analysis error:', error);
      return {
        level: 'low',
        score: 0,
        threats: [],
        recommendations: [],
      };
    }
  }

  private getDefaultAnalysis(): ThreatAnalysis {
    return {
      detected: false,
      riskLevel: {
        level: 'low',
        score: 0,
        threats: [],
        recommendations: [],
      },
      context: {},
      timestamp: Date.now(),
    };
  }
}

export const riskDetectionService = RiskDetectionService.getInstance();
export default riskDetectionService;


