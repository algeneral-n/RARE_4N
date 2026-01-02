/**
 * RARE 4N - Policy Engine
 * Security and Governance layer for RARE OS.
 * Manages permissions, privacy rules, and automated safety decisions.
 */

export interface Policy {
  id: string;
  name: string;
  type: 'permission' | 'security' | 'usage' | 'privacy';
  rules: PolicyRule[];
  enabled: boolean;
  priority: number;
}

export interface PolicyRule {
  id: string;
  condition: string;
  action: 'allow' | 'deny' | 'warn' | 'require_auth';
  params?: Record<string, any>;
}

export interface PolicyDecision {
  allowed: boolean;
  action: string;
  reason: string;
  requiresAuth?: boolean;
  warning?: string;
}

export class PolicyEngine {
  private static instance: PolicyEngine;
  private policies: Map<string, Policy> = new Map();
  private initialized: boolean = false;

  private constructor() {
    this.initializeDefaultPolicies();
  }

  static getInstance(): PolicyEngine {
    if (!PolicyEngine.instance) {
      PolicyEngine.instance = new PolicyEngine();
    }
    return PolicyEngine.instance;
  }

  /**
   * init: تهيئة محرك السياسات
   */
  async init(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    console.log('RARE PolicyEngine: Initialized and Active');
  }

  /**
   * initializeDefaultPolicies: إعداد القواعد الأساسية للأمان
   */
  private initializeDefaultPolicies(): void {
    // 1. سياسة تسجيل الصوت (Voice Recording)
    this.policies.set('voice_recording', {
      id: 'voice_recording',
      name: 'Voice Recording',
      type: 'permission',
      enabled: true,
      priority: 1,
      rules: [{ id: 'voice_permission', condition: 'requires_microphone', action: 'require_auth' }],
    });

    // 2. سياسة الكاميرا (Camera Access)
    this.policies.set('camera_access', {
      id: 'camera_access',
      name: 'Camera Access',
      type: 'permission',
      enabled: true,
      priority: 1,
      rules: [{ id: 'camera_permission', condition: 'requires_camera', action: 'require_auth' }],
    });

    // 3. سياسة القبو المشفر (Vault Security)
    this.policies.set('file_access', {
      id: 'file_access',
      name: 'File Access',
      type: 'security',
      enabled: true,
      priority: 2,
      rules: [{ id: 'vault_access', condition: 'accessing_vault', action: 'require_auth' }],
    });

    // 4. سياسة استخدام الذكاء الاصطناعي (AI Usage)
    this.policies.set('ai_usage', {
      id: 'ai_usage',
      name: 'AI Usage',
      type: 'usage',
      enabled: true,
      priority: 3,
      rules: [{ id: 'ai_rate_limit', condition: 'excessive_ai_calls', action: 'warn' }],
    });
  }

  /**
   * evaluate: تقييم أي طلب لاتخاذ قرار (سماح أو رفض)
   */
  evaluate(context: { action: string; resource?: string }): PolicyDecision {
    try {
      const relevantPolicies = this.getRelevantPolicies(context.action);

      if (relevantPolicies.length === 0) {
        return { allowed: true, action: context.action, reason: 'No restriction' };
      }

      for (const policy of relevantPolicies) {
        if (!policy.enabled) continue;
        for (const rule of policy.rules) {
          const result = this.evaluateRule(rule, context);
          if (!result.allowed) return result;
        }
      }

      return { allowed: true, action: context.action, reason: 'Safe to execute' };
    } catch (error) {
      console.error('PolicyEngine error:', error);
      return { allowed: false, action: context.action, reason: 'Safety Fallback' };
    }
  }

  private evaluateRule(rule: PolicyRule, context: any): PolicyDecision {
    switch (rule.action) {
      case 'deny': return { allowed: false, action: context.action, reason: 'Policy Forbidden' };
      case 'require_auth': return { allowed: true, action: context.action, reason: 'Auth Required', requiresAuth: true };
      case 'warn': return { allowed: true, action: context.action, reason: 'Warning Issued', warning: rule.condition };
      default: return { allowed: true, action: context.action, reason: 'Allowed' };
    }
  }

  private getRelevantPolicies(action: string): Policy[] {
    const policies: Policy[] = [];
    const act = action.toLowerCase();
    
    if (act.includes('voice') || act.includes('record')) policies.push(this.policies.get('voice_recording')!);
    if (act.includes('camera') || act.includes('scan')) policies.push(this.policies.get('camera_access')!);
    if (act.includes('file') || act.includes('vault')) policies.push(this.policies.get('file_access')!);
    if (act.includes('ai') || act.includes('gpt')) policies.push(this.policies.get('ai_usage')!);

    return policies.filter(Boolean).sort((a, b) => a.priority - b.priority);
  }
}