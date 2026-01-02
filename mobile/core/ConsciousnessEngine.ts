/**
 * RARE 4N - Consciousness Engine
 * Responsible for self-awareness, meta-cognition, and decision reflection.
 * Evaluates the quality of Cognitive Loop decisions and suggests improvements.
 */

import { RAREKernel } from './RAREKernel';
import { CognitiveDecision } from './CognitiveLoop';

export interface ConsciousnessReflection {
  decision: CognitiveDecision;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  reasoning: string;
  improvements: string[];
  confidence: number;
  timestamp: number;
}

export class ConsciousnessEngine {
  private static instance: ConsciousnessEngine;
  private kernel: RAREKernel | null = null;
  private cognitiveLoop: any = null;
  private initialized: boolean = false;
  private reflectionHistory: ConsciousnessReflection[] = [];

  private constructor() {}

  static getInstance(): ConsciousnessEngine {
    if (!ConsciousnessEngine.instance) {
      ConsciousnessEngine.instance = new ConsciousnessEngine();
    }
    return ConsciousnessEngine.instance;
  }

  /**
   * init: تهيئة محرك الوعي وربطه بأحداث القرار
   */
  async init(kernel: RAREKernel, cognitiveLoop: any): Promise<void> {
    if (this.initialized) return;

    this.kernel = kernel;
    this.cognitiveLoop = cognitiveLoop;
    this.initialized = true;

    if (this.kernel) {
      // الاستماع للقرارات المنطقية لتحليلها
      this.kernel.on('cognitive:decision', (event: any) => {
        this.reflectOnDecision(event.data as CognitiveDecision);
      });

      // تقييم ردود فعل العملاء
      this.kernel.on('agent:*:response', (event: any) => {
        this.evaluateResponse(event);
      });
    }

    this.kernel?.emit({
      type: 'consciousness:initialized',
      data: { status: 'self_aware' },
      source: 'consciousness',
    });
  }

  /**
   * reflectOnDecision: التفكير في القرار (Meta-cognition)
   */
  private async reflectOnDecision(decision: CognitiveDecision): Promise<void> {
    try {
      const reflection: ConsciousnessReflection = {
        decision,
        quality: this.evaluateDecisionQuality(decision),
        reasoning: this.generateReasoning(decision),
        improvements: this.suggestImprovements(decision),
        confidence: decision.confidence,
        timestamp: Date.now(),
      };

      this.reflectionHistory.push(reflection);
      if (this.reflectionHistory.length > 100) {
        this.reflectionHistory.shift();
      }

      this.kernel?.emit({
        type: 'consciousness:reflection',
        data: reflection,
        source: 'consciousness',
      });
    } catch (error) {
      console.error('ConsciousnessEngine: Reflection error:', error);
    }
  }

  /**
   * evaluateDecisionQuality: تقييم جودة القرار بناءً على الثقة والأولوية
   */
  private evaluateDecisionQuality(decision: CognitiveDecision): 'excellent' | 'good' | 'fair' | 'poor' {
    if (decision.confidence >= 0.9 && decision.priority === 'high') return 'excellent';
    if (decision.confidence >= 0.7) return 'good';
    if (decision.confidence >= 0.5) return 'fair';
    return 'poor';
  }

  private generateReasoning(decision: CognitiveDecision): string {
    return `Analysis: Agent ${decision.agent} executing with ${Math.round(decision.confidence * 100)}% confidence.`;
  }

  /**
   * suggestImprovements: اقتراح تحسينات للقرارات ضعيفة الثقة
   */
  private suggestImprovements(decision: CognitiveDecision): string[] {
    const improvements: string[] = [];
    if (decision.confidence < 0.7) {
      improvements.push('Gather more user context before execution');
    }
    if (!decision.reasoning || decision.reasoning.length < 20) {
      improvements.push('Enhance reasoning logic for better transparency');
    }
    return improvements;
  }

  private async evaluateResponse(event: any): Promise<void> {
    const quality = this.evaluateResponseQuality(event.data);
    if (quality === 'poor' && this.kernel) {
      this.kernel.emit({
        type: 'consciousness:improvement_suggestion',
        data: { agent: event.type.split(':')[1], suggestion: 'Low quality response detected' },
      });
    }
  }

  private evaluateResponseQuality(response: any): 'excellent' | 'good' | 'fair' | 'poor' {
    if (!response || response.error || response.success === false) return 'poor';
    return 'good';
  }

  getSelfAwarenessSummary(): any {
    const recent = this.reflectionHistory.slice(-10);
    const avgConfidence = recent.reduce((sum, r) => sum + r.confidence, 0) / recent.length || 0;
    return {
      averageConfidence: avgConfidence,
      totalReflections: this.reflectionHistory.length,
    };
  }
}