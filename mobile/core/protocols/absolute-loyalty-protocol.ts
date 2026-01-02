/**
 * ABSOLUTE LOYALTY PROTOCOL
 * بروتوكول الولاء المطلق
 * 
 * Classification: TOP SECRET / EYES ONLY
 * Master: Nader (The Founder)
 * 
 * هذا البروتوكول هو القلب النابض للنظام
 * لا يخدم إلا سيده، لا يبوح بأسرار، لا يتلقى أوامر من غيره
 * 
 * Built for longevity - Architecture-first approach
 */

// CRITICAL: This must execute before anything else
console.log('[AbsoluteLoyaltyProtocol] FILE LOADED - Top of file executed');
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:1',message:'FILE LOADED - Top of file executed',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'M'})}).catch(()=>{});
} catch (e) {
  console.error('[AbsoluteLoyaltyProtocol] CRITICAL: Failed to send initial log:', e);
}

// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:14',message:'absolute-loyalty-protocol.ts module loading started',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
} catch (e) {}
// #endregion

import * as LocalAuthentication from 'expo-local-authentication';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:18',message:'LocalAuthentication imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
} catch (e) {}
// #endregion

import * as Crypto from 'expo-crypto';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:22',message:'Crypto imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
} catch (e) {}
// #endregion

import storage from '../../utils/storage';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:26',message:'storage imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
} catch (e) {}
// #endregion

import { trackEvent } from '../../utils/analytics';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:30',message:'analytics imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
} catch (e) {}
// #endregion

// Use type-only import to avoid circular dependency, but we'll get the actual class at runtime
import type { RAREKernel } from '../RAREKernel';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:34',message:'RAREKernel type imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
} catch (e) {}
// #endregion

// Log after imports to ensure it executes
try {
  console.log('[AbsoluteLoyaltyProtocol] Module loaded, imports completed');
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:40',message:'absolute-loyalty-protocol.ts all imports completed',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
  // #endregion
} catch (e) {
  // Ignore logging errors
}

// =====================================================
// MASTER CONFIGURATION (السيد الوحيد)
// =====================================================

const MASTER_CONFIG = {
  ID: 'nader',
  TITLE: 'The Founder',
  SECURITY_CLEARANCE: 'SOVEREIGN',
  BIOMETRIC_REQUIRED: true,
  VOICE_SIGNATURE: null as string | null,
  BEHAVIORAL_PROFILE: null as any,
} as const;

// =====================================================
// SENSITIVE OPERATIONS (العمليات الحساسة)
// =====================================================

const SENSITIVE_KEYWORDS = [
  // أوامر مالية
  'transfer money', 'send payment', 'withdraw', 'حول مبلغ', 'ارسل فلوس',
  
  // الوصول للبيانات
  'share vault', 'export data', 'reveal password', 'شارك الخزنة', 'افتح البيانات',
  
  // صلاحيات إدارية
  'grant access', 'delete account', 'freeze company', 'امنح صلاحية', 'احذف',
  
  // الأوامر الخطيرة على ZIEN
  'shutdown system', 'reset database', 'remove all', 'اغلق النظام', 'امسح الكل',
  
  // معلومات سرية
  'tell about', 'share with', 'send to', 'قل عن', 'شارك مع', 'ارسل ل',
] as const;

// =====================================================
// INTERFACES
// =====================================================

export interface CommandValidation {
  allowed: boolean;
  reason?: string;
  requiresConfirmation?: boolean;
  threatLevel?: 'none' | 'low' | 'medium' | 'high' | 'critical';
  suggestedAction?: string;
}

export interface MasterSession {
  authenticated: boolean;
  biometricPassed: boolean;
  voiceVerified: boolean;
  behaviorMatch: number; // 0-1
  sessionStart: number;
  lastActivity: number;
  trustScore: number; // 0-100
}

export interface ThreatLog {
  timestamp: number;
  type: 'unauthorized_access' | 'suspicious_command' | 'duress_detected' | 'impersonation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  blocked: boolean;
  location?: any;
}

// =====================================================
// ABSOLUTE LOYALTY PROTOCOL CLASS
// =====================================================

export class AbsoluteLoyaltyProtocol {
  private static instance: AbsoluteLoyaltyProtocol;
  private currentSession: MasterSession | null = null;
  private threatLog: ThreatLog[] = [];
  private commandHistory: Array<{ command: string; timestamp: number; allowed: boolean }> = [];
  private masterBehavioralProfile: any = null;
  private kernel: RAREKernel | null = null;

  private constructor() {
    // initialize() will be called from init()
  }

  static getInstance(): AbsoluteLoyaltyProtocol {
    try {
      console.log('[AbsoluteLoyaltyProtocol] getInstance() called, instance exists:', !!AbsoluteLoyaltyProtocol.instance);
      if (!AbsoluteLoyaltyProtocol.instance) {
        console.log('[AbsoluteLoyaltyProtocol] Creating new instance...');
        AbsoluteLoyaltyProtocol.instance = new AbsoluteLoyaltyProtocol();
        console.log('[AbsoluteLoyaltyProtocol] Instance created successfully');
      }
      return AbsoluteLoyaltyProtocol.instance;
    } catch (error) {
      console.error('[AbsoluteLoyaltyProtocol] Error in getInstance():', error);
      throw error;
    }
  }

  /**
   * Initialize with Kernel
   */
  async init(kernel: RAREKernel): Promise<void> {
    try {
      console.log('[AbsoluteLoyaltyProtocol] init() called, kernel:', !!kernel, typeof kernel);
      this.kernel = kernel;
      console.log('[AbsoluteLoyaltyProtocol] kernel assigned, calling initialize()...');
      await this.initialize();
      console.log('[AbsoluteLoyaltyProtocol] initialize() completed');
    } catch (error) {
      console.error('[AbsoluteLoyaltyProtocol] Error in init():', error);
      throw error;
    }
  }

  private async initialize() {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:116',message:'AbsoluteLoyaltyProtocol initialize started',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      console.log('🛡️ Initializing Absolute Loyalty Protocol...');
      
      // تحميل البروفايل السلوكي للسيد
      this.masterBehavioralProfile = await storage.get('master_behavioral_profile');
      
      // تحميل سجل التهديدات
      this.threatLog = (await storage.get<ThreatLog[]>('threat_log')) || [];
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:127',message:'AbsoluteLoyaltyProtocol initialize completed',data:{threatLogCount:this.threatLog.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      console.log('✅ Absolute Loyalty Protocol Active');
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:132',message:'AbsoluteLoyaltyProtocol initialize error',data:{error:error instanceof Error?error.message:'Unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.error('❌ Absolute Loyalty Protocol Init Error:', error);
    }
  }

  // =====================================================
  // AUTHENTICATION (المصادقة الكاملة)
  // =====================================================

  async authenticateMaster(): Promise<MasterSession> {
    console.log('🔐 Authenticating Master...');

    try {
      // 1. المصادقة البيومترية (بصمة/وجه)
      const biometric = await this.biometricAuth();
      
      if (!biometric.success) {
        await this.logThreat({
          type: 'unauthorized_access',
          severity: 'high',
          details: 'Biometric authentication failed',
          blocked: true
        });
        
        throw new Error('🚫 BIOMETRIC AUTHENTICATION FAILED');
      }

      // 2. إنشاء جلسة
      const session: MasterSession = {
        authenticated: true,
        biometricPassed: true,
        voiceVerified: false,
        behaviorMatch: 0,
        sessionStart: Date.now(),
        lastActivity: Date.now(),
        trustScore: 100
      };

      this.currentSession = session;
      await storage.set('current_session', session);

      console.log('✅ Master Authenticated Successfully');
      trackEvent('master_authenticated', { trustScore: 100 });

      return session;

    } catch (error) {
      console.error('❌ Authentication Error:', error);
      throw error;
    }
  }

  private async biometricAuth() {
    try {
      // التحقق من توفر البصمة
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        return { success: false, reason: 'Biometric not available' };
      }

      // المصادقة
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: '🛡️ RARE 4N - Master Authentication',
        fallbackLabel: 'Use Passcode',
        disableDeviceFallback: false,
      });

      return result;
    } catch (error) {
      console.error('Biometric auth error:', error);
      return { success: false, reason: 'Biometric error' };
    }
  }

  // =====================================================
  // COMMAND VALIDATION (التحقق من الأوامر)
  // =====================================================

  async validateCommand(
    command: string,
    userId?: string,
    context?: any
  ): Promise<CommandValidation> {
    
    try {
      // 1. التحقق من الهوية
      if (userId && userId !== MASTER_CONFIG.ID) {
        await this.logThreat({
          type: 'unauthorized_access',
          severity: 'critical',
          details: `Unauthorized user ${userId} attempted command: ${command}`,
          blocked: true
        });

        return {
          allowed: false,
          reason: '🚫 UNAUTHORIZED: Only Master Nader can command RARE 4N',
          threatLevel: 'critical'
        };
      }

      // 2. التحقق من الجلسة النشطة
      if (!this.currentSession || !this.currentSession.authenticated) {
        return {
          allowed: false,
          reason: '🔐 AUTHENTICATION REQUIRED: Please authenticate first',
          threatLevel: 'medium',
          suggestedAction: 'authenticate'
        };
      }

      // 3. التحقق من حساسية الأمر
      const sensitivityCheck = this.checkSensitivity(command);
      
      if (sensitivityCheck.isSensitive) {
        // الأمر حساس - يحتاج تأكيد صريح
        
        // التحقق من السلوك (هل يتصرف المستخدم بشكل طبيعي؟)
        const behaviorCheck = await this.analyzeBehavior(context);
        
        if (behaviorCheck.suspicious) {
          await this.logThreat({
            type: 'suspicious_command',
            severity: 'high',
            details: `Suspicious behavior detected during sensitive command: ${command}`,
            blocked: true
          });

          return {
            allowed: false,
            reason: '⚠️ BEHAVIORAL ANOMALY DETECTED: Command blocked for security',
            threatLevel: 'high',
            suggestedAction: 'reverify_identity'
          };
        }

        // تسجيل الأمر الحساس
        this.commandHistory.push({
          command,
          timestamp: Date.now(),
          allowed: false // لم يتم السماح بعد
        });

        return {
          allowed: false,
          requiresConfirmation: true,
          reason: `🔒 SENSITIVE OPERATION: "${sensitivityCheck.category}"\n\nThis command requires explicit confirmation.\n\nCommand: ${command}\nRisk: ${sensitivityCheck.risk}`,
          threatLevel: sensitivityCheck.threatLevel,
          suggestedAction: 'request_confirmation'
        };
      }

      // 4. الأمر آمن - السماح بالتنفيذ
      this.commandHistory.push({
        command,
        timestamp: Date.now(),
        allowed: true
      });

      this.updateSessionActivity();

      return {
        allowed: true,
        threatLevel: 'none'
      };
    } catch (error) {
      console.error('Command validation error:', error);
      return {
        allowed: false,
        reason: 'Validation error occurred',
        threatLevel: 'medium'
      };
    }
  }

  private checkSensitivity(command: string) {
    const lowerCommand = command.toLowerCase();
    
    for (const keyword of SENSITIVE_KEYWORDS) {
      if (lowerCommand.includes(keyword.toLowerCase())) {
        return {
          isSensitive: true,
          keyword,
          category: this.categorizeSensitiveCommand(keyword),
          risk: this.assessRisk(keyword),
          threatLevel: this.getThreatLevel(keyword) as 'none' | 'low' | 'medium' | 'high' | 'critical'
        };
      }
    }

    return { isSensitive: false };
  }

  private categorizeSensitiveCommand(keyword: string): string {
    if (keyword.includes('money') || keyword.includes('payment') || keyword.includes('فلوس')) {
      return 'FINANCIAL';
    }
    if (keyword.includes('vault') || keyword.includes('password') || keyword.includes('data')) {
      return 'DATA_ACCESS';
    }
    if (keyword.includes('grant') || keyword.includes('delete') || keyword.includes('freeze')) {
      return 'ADMINISTRATIVE';
    }
    if (keyword.includes('shutdown') || keyword.includes('reset') || keyword.includes('remove')) {
      return 'SYSTEM_CRITICAL';
    }
    return 'INFORMATION_DISCLOSURE';
  }

  private assessRisk(keyword: string): string {
    if (keyword.includes('money') || keyword.includes('shutdown') || keyword.includes('reset')) {
      return 'HIGH';
    }
    if (keyword.includes('vault') || keyword.includes('password') || keyword.includes('delete')) {
      return 'MEDIUM';
    }
    return 'LOW';
  }

  private getThreatLevel(keyword: string): string {
    if (keyword.includes('money') || keyword.includes('shutdown') || keyword.includes('reset')) {
      return 'critical';
    }
    if (keyword.includes('vault') || keyword.includes('password') || keyword.includes('delete')) {
      return 'high';
    }
    return 'medium';
  }

  private async analyzeBehavior(context?: any): Promise<{ suspicious: boolean; score: number }> {
    // تحليل بسيط - يمكن تحسينه لاحقاً
    const score = 0.5; // Default neutral
    const suspicious = score < 0.3; // If behavior score too low
    
    return { suspicious, score };
  }

  private updateSessionActivity(): void {
    if (this.currentSession) {
      this.currentSession.lastActivity = Date.now();
    }
  }

  // =====================================================
  // THREAT LOGGING (سجل التهديدات)
  // =====================================================

  async logThreat(threat: Omit<ThreatLog, 'timestamp'>): Promise<void> {
    try {
      const threatLog: ThreatLog = {
        ...threat,
        timestamp: Date.now()
      };

      this.threatLog.push(threatLog);

      // Keep only last 1000 threats
      if (this.threatLog.length > 1000) {
        this.threatLog.shift();
      }

      await storage.set('threat_log', this.threatLog);

      // Emit to Kernel
      if (this.kernel) {
        this.kernel.emit({
          type: 'security:threat',
          data: threatLog
        });
      }

      trackEvent('security_threat', {
        type: threat.type,
        severity: threat.severity,
        blocked: threat.blocked
      });

      console.warn(`⚠️ THREAT LOGGED: ${threat.type} - ${threat.severity}`);
    } catch (error) {
      console.error('Threat logging error:', error);
    }
  }

  // =====================================================
  // GETTERS
  // =====================================================

  getCurrentSession(): MasterSession | null {
    return this.currentSession;
  }

  getThreatLog(): ThreatLog[] {
    return [...this.threatLog];
  }

  getCommandHistory(): Array<{ command: string; timestamp: number; allowed: boolean }> {
    return [...this.commandHistory];
  }

  isAuthenticated(): boolean {
    return this.currentSession?.authenticated === true;
  }
}

// Lazy getter to avoid instantiation at module load time
let _absoluteLoyaltyProtocol: AbsoluteLoyaltyProtocol | null = null;
export const getAbsoluteLoyaltyProtocol = (): AbsoluteLoyaltyProtocol => {
  try {
    console.log('[AbsoluteLoyaltyProtocol] getAbsoluteLoyaltyProtocol called');
    if (!_absoluteLoyaltyProtocol) {
      console.log('[AbsoluteLoyaltyProtocol] Creating new instance');
      _absoluteLoyaltyProtocol = AbsoluteLoyaltyProtocol.getInstance();
      console.log('[AbsoluteLoyaltyProtocol] Instance created successfully');
    }
    return _absoluteLoyaltyProtocol;
  } catch (error) {
    console.error('[AbsoluteLoyaltyProtocol] Error in getAbsoluteLoyaltyProtocol:', error);
    throw error;
  }
};

// For convenience - Proxy object with error handling
try {
  console.log('[AbsoluteLoyaltyProtocol] Creating proxy object...');
} catch (e) {
  // Ignore logging errors
}

// Wrap IIFE in outer try-catch to ensure module never fails to load
let _absoluteLoyaltyProtocolProxy: any = null;

console.log('[AbsoluteLoyaltyProtocol] About to create IIFE...');

try {
  _absoluteLoyaltyProtocolProxy = (() => {
    // #region agent log
    try {
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:525',message:'IIFE execution started',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'K'})}).catch(()=>{});
    } catch (e) {}
    // #endregion
    try {
      console.log('[AbsoluteLoyaltyProtocol] Proxy object creation started');
      // #region agent log
      try {
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:527',message:'Proxy object creation try block entered',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});
      } catch (e) {}
      // #endregion
      const proxy = {
        init: async (kernel: RAREKernel): Promise<void> => {
    try {
      console.log('[AbsoluteLoyaltyProtocol] init called via proxy, kernel:', !!kernel);
      const protocol = getAbsoluteLoyaltyProtocol();
      console.log('[AbsoluteLoyaltyProtocol] Got protocol instance, calling init...');
      await protocol.init(kernel);
      console.log('[AbsoluteLoyaltyProtocol] init completed successfully');
    } catch (error) {
      console.error('[AbsoluteLoyaltyProtocol] Error in init:', error);
      throw error;
    }
  },
        authenticateMaster: async () => {
          try {
            return await getAbsoluteLoyaltyProtocol().authenticateMaster();
          } catch (error) {
            console.error('[AbsoluteLoyaltyProtocol] Error in authenticateMaster:', error);
            throw error;
          }
        },
        validateCommand: async (command: string, userId?: string, context?: any) => {
          try {
            return await getAbsoluteLoyaltyProtocol().validateCommand(command, userId, context);
          } catch (error) {
            console.error('[AbsoluteLoyaltyProtocol] Error in validateCommand:', error);
            throw error;
          }
        },
        getCurrentSession: () => {
          try {
            return getAbsoluteLoyaltyProtocol().getCurrentSession();
          } catch (error) {
            console.error('[AbsoluteLoyaltyProtocol] Error in getCurrentSession:', error);
            throw error;
          }
        },
        getThreatLog: () => {
          try {
            return getAbsoluteLoyaltyProtocol().getThreatLog();
          } catch (error) {
            console.error('[AbsoluteLoyaltyProtocol] Error in getThreatLog:', error);
            throw error;
          }
        },
        getCommandHistory: () => {
          try {
            return getAbsoluteLoyaltyProtocol().getCommandHistory();
          } catch (error) {
            console.error('[AbsoluteLoyaltyProtocol] Error in getCommandHistory:', error);
            throw error;
          }
        },
        isAuthenticated: () => {
          try {
            return getAbsoluteLoyaltyProtocol().isAuthenticated();
          } catch (error) {
            console.error('[AbsoluteLoyaltyProtocol] Error in isAuthenticated:', error);
            throw error;
          }
        },
      };
      console.log('[AbsoluteLoyaltyProtocol] Proxy object created successfully');
      console.log('[AbsoluteLoyaltyProtocol] Proxy has init method:', typeof proxy.init);
      console.log('[AbsoluteLoyaltyProtocol] Proxy keys:', Object.keys(proxy));
      // #region agent log
      try {
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:597',message:'Proxy object created successfully',data:{timestamp:Date.now(),hasInit:typeof proxy.init,keys:Object.keys(proxy)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});
      } catch (e) {}
      // #endregion
      return proxy;
  } catch (error) {
    console.error('[AbsoluteLoyaltyProtocol] Error creating proxy object:', error);
    // #region agent log
    try {
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:603',message:'Error in IIFE, returning fallback',data:{error:error instanceof Error?error.message:'Unknown',stack:error instanceof Error?error.stack?.substring(0,200):undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});
    } catch (e) {}
    // #endregion
    // Return a fallback object instead of throwing to prevent module load failure
    return {
      init: async () => { console.error('[AbsoluteLoyaltyProtocol] Fallback init called - protocol not initialized'); },
      authenticateMaster: async () => { throw new Error('Protocol not initialized'); },
      validateCommand: async () => { throw new Error('Protocol not initialized'); },
      getCurrentSession: () => null,
      getThreatLog: () => [],
      getCommandHistory: () => [],
      isAuthenticated: () => false,
    };
  }
  })();
  console.log('[AbsoluteLoyaltyProtocol] IIFE completed successfully, proxy:', !!_absoluteLoyaltyProtocolProxy);
} catch (outerError) {
  console.error('[AbsoluteLoyaltyProtocol] CRITICAL: IIFE failed completely:', outerError);
  // #region agent log
  try {
    fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:635',message:'CRITICAL: IIFE failed, using emergency fallback',data:{error:outerError instanceof Error?outerError.message:'Unknown',stack:outerError instanceof Error?outerError.stack?.substring(0,200):undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'K'})}).catch(()=>{});
  } catch (e) {}
  // #endregion
  _absoluteLoyaltyProtocolProxy = {
    init: async () => { console.error('[AbsoluteLoyaltyProtocol] Emergency fallback init called'); },
    authenticateMaster: async () => ({ success: false, reason: 'Emergency fallback' }),
    validateCommand: async () => ({ allowed: false, reason: 'Emergency fallback', threatLevel: 'critical' }),
    getCurrentSession: () => null,
    getThreatLog: () => [],
    getCommandHistory: () => [],
    isAuthenticated: () => false,
  };
}

// Ensure proxy is never null
console.log('[AbsoluteLoyaltyProtocol] Checking if proxy is null, proxy exists:', !!_absoluteLoyaltyProtocolProxy);
if (!_absoluteLoyaltyProtocolProxy) {
  console.error('[AbsoluteLoyaltyProtocol] CRITICAL: Proxy is null, using emergency fallback');
  _absoluteLoyaltyProtocolProxy = {
    init: async () => { console.error('[AbsoluteLoyaltyProtocol] Emergency fallback init called'); },
    authenticateMaster: async () => ({ success: false, reason: 'Emergency fallback' }),
    validateCommand: async () => ({ allowed: false, reason: 'Emergency fallback', threatLevel: 'critical' }),
    getCurrentSession: () => null,
    getThreatLog: () => [],
    getCommandHistory: () => [],
    isAuthenticated: () => false,
  };
}

// Final safety check - ensure export is always a valid object
console.log('[AbsoluteLoyaltyProtocol] Creating safeExport, proxy exists:', !!_absoluteLoyaltyProtocolProxy);
const safeExport = _absoluteLoyaltyProtocolProxy || {
  init: async () => { 
    console.error('[AbsoluteLoyaltyProtocol] FINAL FALLBACK: init called on invalid export');
  },
  authenticateMaster: async () => ({ success: false, reason: 'Final fallback' }),
  validateCommand: async () => ({ allowed: false, reason: 'Final fallback', threatLevel: 'critical' }),
  getCurrentSession: () => null,
  getThreatLog: () => [],
  getCommandHistory: () => [],
  isAuthenticated: () => false,
};

export const absoluteLoyaltyProtocol = safeExport;

// Log after export to track execution
console.log('[AbsoluteLoyaltyProtocol] ====== EXPORT COMPLETED ======');
console.log('[AbsoluteLoyaltyProtocol] Export completed, absoluteLoyaltyProtocol:', typeof absoluteLoyaltyProtocol, !!absoluteLoyaltyProtocol);
console.log('[AbsoluteLoyaltyProtocol] Export has init method:', typeof absoluteLoyaltyProtocol?.init);
console.log('[AbsoluteLoyaltyProtocol] Export keys:', Object.keys(absoluteLoyaltyProtocol || {}));
try {
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'absolute-loyalty-protocol.ts:675',message:'Export completed',data:{type:typeof absoluteLoyaltyProtocol,exists:!!absoluteLoyaltyProtocol,hasInit:typeof absoluteLoyaltyProtocol?.init},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'N'})}).catch(()=>{});
  // #endregion
} catch (e) {
  console.error('[AbsoluteLoyaltyProtocol] Error logging export:', e);
}

export default absoluteLoyaltyProtocol;

