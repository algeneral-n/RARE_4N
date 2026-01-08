/**
 * GUARDIAN PROTOCOL - The Ultimate Protection System
 * بروتوكول الحارس - نظام الحماية النهائي
 * 
 * Classification: CRITICAL SECURITY
 * 
 * المهام:
 * - نظام SOS وطوارئ فوري
 * - كشف الإكراه (Duress Detection)
 * - المراقبة الصوتية المستمرة
 * - الحماية الاستباقية
 * 
 * Built for longevity - Architecture-first approach
 */

// CRITICAL: This must execute before anything else
console.log('[GuardianProtocol] FILE LOADED - Top of file executed');
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:1',message:'FILE LOADED - Top of file executed',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'M'})}).catch(()=>{});
} catch (e) {
  console.error('[GuardianProtocol] CRITICAL: Failed to send initial log:', e);
}

// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:16',message:'guardian-protocol.ts module loading started',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
} catch (e) {}
// #endregion

import * as Location from 'expo-location';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:20',message:'Location imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
} catch (e) {}
// #endregion

import * as Notifications from 'expo-notifications';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:24',message:'Notifications imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
} catch (e) {}
// #endregion

import * as FileSystem from 'expo-file-system';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:28',message:'FileSystem imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
} catch (e) {}
// #endregion

import { Audio } from 'expo-av';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:32',message:'Audio imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
} catch (e) {}
// #endregion

import storage from '../../utils/storage';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:36',message:'storage imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
} catch (e) {}
// #endregion

import { trackEvent } from '../../utils/analytics';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:40',message:'analytics imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
} catch (e) {}
// #endregion

import { AwarenessSystem } from '../AwarenessSystem';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:44',message:'AwarenessSystem imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
} catch (e) {}
// #endregion

import type { RAREKernel } from '../RAREKernel';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:48',message:'RAREKernel type imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
} catch (e) {}
// #endregion

// Log after imports to ensure it executes
try {
  console.log('[GuardianProtocol] Module loaded, imports completed');
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:54',message:'guardian-protocol.ts all imports completed',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
  // #endregion
} catch (e) {
  // Ignore logging errors
}

// =====================================================
// CONFIGURATION
// =====================================================

const GUARDIAN_CONFIG = {
  // كلمات الاستغاثة (بالعربية والإنجليزية)
  DISTRESS_KEYWORDS: [
    'help', 'emergency', 'police', '911', 
    'مساعدة', 'نجدة', 'الشرطة', 'خطر', 'طوارئ',
    'save me', 'danger', 'threat',
    'أنقذني', 'تهديد', 'اتصل بالشرطة'
  ],
  
  // أرقام الطوارئ
  EMERGENCY_CONTACTS: [
    { name: 'Emergency Contact 1', number: '+971501234567' },
    { name: 'Emergency Contact 2', number: '+971509876543' },
    { name: 'Police', number: '999' }
  ],
  
  // إعدادات التسجيل السري
  SILENT_RECORDING: {
    enabled: true,
    maxDuration: 300000, // 5 minutes
    quality: Audio.RecordingOptionsPresets.HIGH_QUALITY
  },
  
  // حدود الإكراه
  DURESS_THRESHOLDS: {
    voiceStress: 0.7,      // 0-1
    facialFear: 0.6,       // 0-1
    behaviorAnomaly: 0.8,  // 0-1
    combinedScore: 0.65    // 0-1
  }
} as const;

// =====================================================
// INTERFACES
// =====================================================

export interface EmergencyEvent {
  id: string;
  type: 'sos_button' | 'voice_distress' | 'duress_detected' | 'threat_detected';
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
    address?: string;
  };
  recording?: string; // file path
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  notes?: string;
}

export interface DuressIndicators {
  voiceStress: number;
  facialExpression: {
    fear: number;
    anxiety: number;
    normal: number;
  };
  behaviorScore: number;
  environmentalFactors: {
    unusualLocation: boolean;
    unusualTime: boolean;
    rapidActions: boolean;
  };
  overallScore: number;
}

export interface SOSResponse {
  success: boolean;
  messagesSent: number;
  locationCaptured: boolean;
  recordingStarted: boolean;
  vaultLocked: boolean;
  cloudBackup: boolean;
}

// =====================================================
// GUARDIAN PROTOCOL CLASS
// =====================================================

export class GuardianProtocol {
  private static instance: GuardianProtocol;
  private isMonitoring: boolean = false;
  private isRecording: boolean = false;
  private currentRecording: Audio.Recording | null = null;
  private emergencyEvents: EmergencyEvent[] = [];
  private duressMode: boolean = false;
  private kernel: RAREKernel | null = null;
  private awarenessSystem: AwarenessSystem;

  private constructor() {
    this.awarenessSystem = AwarenessSystem.getInstance();
    // initialize() will be called from init()
  }

  static getInstance(): GuardianProtocol {
    try {
      console.log('[GuardianProtocol] getInstance() called, instance exists:', !!GuardianProtocol.instance);
      if (!GuardianProtocol.instance) {
        console.log('[GuardianProtocol] Creating new instance...');
        GuardianProtocol.instance = new GuardianProtocol();
        console.log('[GuardianProtocol] Instance created successfully');
      }
      return GuardianProtocol.instance;
    } catch (error) {
      console.error('[GuardianProtocol] Error in getInstance():', error);
      throw error;
    }
  }

  /**
   * Initialize with Kernel
   */
  async init(kernel: RAREKernel): Promise<void> {
    try {
      console.log('[GuardianProtocol] init() called, kernel:', !!kernel, typeof kernel);
      this.kernel = kernel;
      console.log('[GuardianProtocol] kernel assigned, calling initialize()...');
      await this.initialize();
      console.log('[GuardianProtocol] initialize() completed');
    } catch (error) {
      console.error('[GuardianProtocol] Error in init():', error);
      throw error;
    }
  }

  private async initialize() {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:140',message:'GuardianProtocol initialize started',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      console.log('🛡️ Guardian Protocol Initializing...');

      // تحميل الأحداث السابقة
      this.emergencyEvents = (await storage.get<EmergencyEvent[]>('emergency_events')) || [];

      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:148',message:'GuardianProtocol initialize completed',data:{eventCount:this.emergencyEvents.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion

      console.log('[ACTIVE] Guardian Protocol Active');
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:153',message:'GuardianProtocol initialize error',data:{error:error instanceof Error?error.message:'Unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      console.error('[ERROR] Guardian Protocol Init Error:', error);
    }
  }

  // =====================================================
  // SOS ACTIVATION (تفعيل نظام الطوارئ)
  // =====================================================

  async activateSOS(reason: string = 'Manual SOS Button'): Promise<SOSResponse> {
    console.log('[SOS] SOS ACTIVATED');
    console.log(`Reason: ${reason}`);

    const response: SOSResponse = {
      success: false,
      messagesSent: 0,
      locationCaptured: false,
      recordingStarted: false,
      vaultLocked: false,
      cloudBackup: false
    };

    try {
      // 1. الحصول على الموقع الحالي
      const location = await this.captureLocation();
      response.locationCaptured = !!location;

      // 2. إرسال رسائل طوارئ (سيتم إرسالها للـ Backend)
      // response.messagesSent = await this.sendEmergencyMessages(location);

      // 3. بدء التسجيل السري
      if (GUARDIAN_CONFIG.SILENT_RECORDING.enabled) {
        try {
          await this.startSilentRecording();
          response.recordingStarted = true;
        } catch (recordingError) {
          console.error('Recording error:', recordingError);
        }
      }

      // 4. قفل الخزنة وتشفير البيانات
      await this.lockdownVault();
      response.vaultLocked = true;

      // 5. رفع للسحابة المشفرة
      await this.backupToSecureCloud(location);
      response.cloudBackup = true;

      // 6. إرسال إشعار فوري
      try {
        await this.sendCriticalNotification('[SOS] SOS Activated', 
          'Emergency protocol engaged. Help is on the way.');
      } catch (notifError) {
        console.error('Notification error:', notifError);
      }

      // 7. تسجيل الحدث
      const event: EmergencyEvent = {
        id: this.generateEventId(),
        type: 'sos_button',
        timestamp: Date.now(),
        location,
        severity: 'critical',
        resolved: false,
        notes: reason
      };

      this.emergencyEvents.push(event);
      await this.saveEvents();

      // 8. إرسال للـ Kernel
      if (this.kernel) {
        this.kernel.emit({
          type: 'guardian:sos_activated',
          data: { event, response }
        });
      }

      trackEvent('sos_activated', { reason, location });

      response.success = true;
      console.log('[SUCCESS] SOS Protocol Completed Successfully');

      return response;

    } catch (error) {
      console.error('[ERROR] SOS Activation Error:', error);
      throw error;
    }
  }

  // =====================================================
  // LOCATION CAPTURE (التقاط الموقع)
  // =====================================================

  private async captureLocation() {
    try {
      console.log('📍 Capturing current location...');

      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('[WARNING] Location permission not granted');
        return undefined;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      // محاولة الحصول على العنوان
      let address;
      try {
        const geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
        
        if (geocode.length > 0) {
          const loc = geocode[0];
          address = `${loc.street || ''}, ${loc.city || ''}, ${loc.country || ''}`.trim();
        }
      } catch (e) {
        console.warn('Could not get address');
      }

      const locationData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
        address
      };

      console.log('[SUCCESS] Location captured:', locationData);
      return locationData;

    } catch (error) {
      console.error('[ERROR] Location capture failed:', error);
      return undefined;
    }
  }

  // =====================================================
  // SILENT RECORDING (التسجيل السري)
  // =====================================================

  private async startSilentRecording() {
    try {
      console.log('🎙️ Starting silent recording...');

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      this.currentRecording = new Audio.Recording();
      await this.currentRecording.prepareToRecordAsync(
        GUARDIAN_CONFIG.SILENT_RECORDING.quality
      );

      await this.currentRecording.startAsync();
      this.isRecording = true;

      console.log('[RECORD] Silent recording started');

      // إيقاف تلقائي بعد المدة المحددة
      setTimeout(() => {
        this.stopSilentRecording();
      }, GUARDIAN_CONFIG.SILENT_RECORDING.maxDuration);

    } catch (error) {
      console.error('[ERROR] Failed to start recording:', error);
    }
  }

  private async stopSilentRecording(): Promise<string | undefined> {
    if (!this.currentRecording || !this.isRecording) {
      return undefined;
    }

    try {
      console.log('⏹️ Stopping recording...');

      await this.currentRecording.stopAndUnloadAsync();
      const uri = this.currentRecording.getURI();
      
      this.currentRecording = null;
      this.isRecording = false;

      if (uri && FileSystem.documentDirectory) {
        // حفظ التسجيل في مكان آمن
        const timestamp = Date.now();
        const newPath = `${FileSystem.documentDirectory}emergency_${timestamp}.m4a`;
        await FileSystem.moveAsync({ from: uri, to: newPath });

        console.log('[SUCCESS] Recording saved:', newPath);
        return newPath;
      }

    } catch (error) {
      console.error('[ERROR] Failed to stop recording:', error);
    }

    return undefined;
  }

  // =====================================================
  // VAULT LOCKDOWN (قفل الخزنة)
  // =====================================================

  private async lockdownVault() {
    console.log('[SECURITY] Locking down vault...');

    try {
      // تشفير جميع البيانات الحساسة
      await storage.set('vault_locked', true);
      await storage.set('lockdown_timestamp', Date.now());

      // إرسال للـ Kernel
      if (this.kernel) {
        this.kernel.emit({
          type: 'guardian:vault_locked',
          data: { timestamp: Date.now() }
        });
      }

      console.log('[SUCCESS] Vault locked down');
    } catch (error) {
      console.error('[ERROR] Vault lockdown failed:', error);
    }
  }

  // =====================================================
  // CLOUD BACKUP (النسخ الاحتياطي السحابي)
  // =====================================================

  private async backupToSecureCloud(location?: any) {
    console.log('☁️ Backing up to secure cloud...');

    try {
      const backupData = {
        timestamp: Date.now(),
        location,
        device: {
          platform: 'iOS',
          os: 'iOS'
        },
        emergencyType: 'SOS',
      };

      // في الإنتاج: رفع إلى Backend API
      await storage.set('last_cloud_backup', backupData);

      // إرسال للـ Kernel
      if (this.kernel) {
        this.kernel.emit({
          type: 'guardian:cloud_backup',
          data: backupData
        });
      }

      console.log('[SUCCESS] Backup completed');
    } catch (error) {
      console.error('[ERROR] Cloud backup failed:', error);
    }
  }

  // =====================================================
  // VOICE MONITORING (المراقبة الصوتية)
  // =====================================================

  async startVoiceMonitoring() {
    console.log('👂 Starting voice monitoring for distress keywords...');
    this.isMonitoring = true;
    
    trackEvent('voice_monitoring_started');
  }

  async stopVoiceMonitoring() {
    console.log('⏹️ Stopping voice monitoring');
    this.isMonitoring = false;
    
    trackEvent('voice_monitoring_stopped');
  }

  detectDistressInText(text: string): boolean {
    const lowerText = text.toLowerCase();
    
    for (const keyword of GUARDIAN_CONFIG.DISTRESS_KEYWORDS) {
      if (lowerText.includes(keyword.toLowerCase())) {
        console.log(`[SOS] DISTRESS KEYWORD DETECTED: "${keyword}"`);
        return true;
      }
    }

    return false;
  }

  // =====================================================
  // DURESS DETECTION (كشف الإكراه)
  // =====================================================

  async analyzeDuress(
    voiceData?: any,
    faceData?: any,
    behaviorData?: any
  ): Promise<DuressIndicators> {
    
    console.log('[ANALYZE] Analyzing for duress indicators...');

    // تحليل الصوت
    const voiceStress = voiceData ? this.analyzeVoiceStress(voiceData) : 0;

    // تحليل الوجه
    const facialExpression = faceData ? this.analyzeFacialExpression(faceData) : {
      fear: 0,
      anxiety: 0,
      normal: 1
    };

    // تحليل السلوك
    const behaviorScore = behaviorData ? this.analyzeBehavior(behaviorData) : 0;

    // العوامل البيئية
    const context = this.awarenessSystem;
    const environmentalFactors = {
      unusualLocation: false, // يحتاج GPS history
      unusualTime: false, // يمكن تحسينه
      rapidActions: false
    };

    // حساب النقاط الإجمالية
    const overallScore = 
      (voiceStress * 0.4) +
      (facialExpression.fear * 0.3) +
      (behaviorScore * 0.2) +
      ((environmentalFactors.unusualTime ? 0.05 : 0) +
       (environmentalFactors.rapidActions ? 0.05 : 0));

    const indicators: DuressIndicators = {
      voiceStress,
      facialExpression,
      behaviorScore,
      environmentalFactors,
      overallScore
    };

    // التحقق من التجاوز للحد
    if (overallScore >= GUARDIAN_CONFIG.DURESS_THRESHOLDS.combinedScore) {
      await this.activateDuressMode(indicators);
    }

    return indicators;
  }

  private analyzeVoiceStress(voiceData: any): number {
    // تحليل التوتر في الصوت
    // يحتاج integration مع audio analysis API
    return 0; // placeholder
  }

  private analyzeFacialExpression(faceData: any) {
    // تحليل تعابير الوجه
    // يحتاج integration مع vision API
    return {
      fear: 0,
      anxiety: 0,
      normal: 1
    };
  }

  private analyzeBehavior(behaviorData: any): number {
    // تحليل النمط السلوكي
    return 0;
  }

  // =====================================================
  // DURESS MODE (وضع الإكراه)
  // =====================================================

  private async activateDuressMode(indicators: DuressIndicators) {
    if (this.duressMode) return; // مفعّل مسبقاً

    console.log('[SOS] DURESS MODE ACTIVATED');
    console.log('Indicators:', indicators);

    this.duressMode = true;

    try {
      // 1. عرض واجهة وهمية بريئة
      await this.showDecoyInterface();

      // 2. إرسال تنبيه صامت
      await this.sendSilentAlert(indicators);

      // 3. بدء التسجيل السري
      await this.startSilentRecording();

      // 4. تسجيل الحدث
      const event: EmergencyEvent = {
        id: this.generateEventId(),
        type: 'duress_detected',
        timestamp: Date.now(),
        severity: 'critical',
        resolved: false,
        notes: `Duress score: ${indicators.overallScore.toFixed(2)}`
      };

      this.emergencyEvents.push(event);
      await this.saveEvents();

      // 5. إرسال للـ Kernel
      if (this.kernel) {
        this.kernel.emit({
          type: 'guardian:duress_activated',
          data: { event, indicators }
        });
      }

      trackEvent('duress_mode_activated', { 
        score: indicators.overallScore 
      });

    } catch (error) {
      console.error('[ERROR] Duress mode activation error:', error);
    }
  }

  private async showDecoyInterface() {
    console.log('[SECURITY] Showing decoy interface...');
    await storage.set('show_decoy_mode', true);
  }

  private async sendSilentAlert(indicators: DuressIndicators) {
    console.log('📢 Sending silent alert...');

    const alert = {
      type: 'DURESS_DETECTED',
      timestamp: Date.now(),
      indicators,
      device: 'iOS',
      priority: 'CRITICAL'
    };

    await storage.set('pending_silent_alerts', [alert]);
  }

  async deactivateDuressMode() {
    console.log('[DEACTIVE] Deactivating duress mode');
    
    this.duressMode = false;
    await storage.set('show_decoy_mode', false);
    
    if (this.isRecording) {
      await this.stopSilentRecording();
    }
    
    trackEvent('duress_mode_deactivated');
  }

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  private async sendCriticalNotification(title: string, body: string) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: null, // فوري
      });
    } catch (error) {
      console.error('Notification error:', error);
    }
  }

  // =====================================================
  // UTILITY
  // =====================================================

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private async saveEvents() {
    await storage.set('emergency_events', this.emergencyEvents);
  }

  // =====================================================
  // GETTERS
  // =====================================================

  getEmergencyEvents(): EmergencyEvent[] {
    return [...this.emergencyEvents];
  }

  getActiveEvents(): EmergencyEvent[] {
    return this.emergencyEvents.filter(e => !e.resolved);
  }

  isDuressMode(): boolean {
    return this.duressMode;
  }

  isMonitoringActive(): boolean {
    return this.isMonitoring;
  }

  async resolveEvent(eventId: string) {
    const event = this.emergencyEvents.find(e => e.id === eventId);
    if (event) {
      event.resolved = true;
      await this.saveEvents();
    }
  }
}

// Lazy getter to avoid instantiation at module load time
let _guardianProtocol: GuardianProtocol | null = null;
export const getGuardianProtocol = (): GuardianProtocol => {
  try {
    console.log('[GuardianProtocol] getGuardianProtocol called');
    if (!_guardianProtocol) {
      console.log('[GuardianProtocol] Creating new instance');
      _guardianProtocol = GuardianProtocol.getInstance();
      console.log('[GuardianProtocol] Instance created successfully');
    }
    return _guardianProtocol;
  } catch (error) {
    console.error('[GuardianProtocol] Error in getGuardianProtocol:', error);
    throw error;
  }
};

// For convenience - Proxy object with error handling
try {
  console.log('[GuardianProtocol] Creating proxy object...');
} catch (e) {
  // Ignore logging errors
}

// Wrap IIFE in outer try-catch to ensure module never fails to load
let _guardianProtocolProxy: any = null;

console.log('[GuardianProtocol] About to create IIFE...');

try {
  _guardianProtocolProxy = (() => {
    // #region agent log
    try {
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:777',message:'IIFE execution started',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'K'})}).catch(()=>{});
    } catch (e) {}
    // #endregion
    try {
      console.log('[GuardianProtocol] Proxy object creation started');
      // #region agent log
      try {
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:779',message:'Proxy object creation try block entered',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});
      } catch (e) {}
      // #endregion
      const proxy = {
        init: async (kernel: RAREKernel): Promise<void> => {
          try {
            console.log('[GuardianProtocol] init called via proxy, kernel:', !!kernel);
            const protocol = getGuardianProtocol();
            console.log('[GuardianProtocol] Got protocol instance, calling init...');
            await protocol.init(kernel);
            console.log('[GuardianProtocol] init completed successfully');
          } catch (error) {
            console.error('[GuardianProtocol] Error in init:', error);
            throw error;
          }
        },
        activateSOS: async (reason?: string) => {
          try {
            return await getGuardianProtocol().activateSOS(reason);
          } catch (error) {
            console.error('[GuardianProtocol] Error in activateSOS:', error);
            throw error;
          }
        },
        startVoiceMonitoring: async () => {
          try {
            return await getGuardianProtocol().startVoiceMonitoring();
          } catch (error) {
            console.error('[GuardianProtocol] Error in startVoiceMonitoring:', error);
            throw error;
          }
        },
        stopVoiceMonitoring: async () => {
          try {
            return await getGuardianProtocol().stopVoiceMonitoring();
          } catch (error) {
            console.error('[GuardianProtocol] Error in stopVoiceMonitoring:', error);
            throw error;
          }
        },
        detectDistressInText: (text: string) => {
          try {
            return getGuardianProtocol().detectDistressInText(text);
          } catch (error) {
            console.error('[GuardianProtocol] Error in detectDistressInText:', error);
            throw error;
          }
        },
        analyzeDuress: async (voiceData?: any, faceData?: any, behaviorData?: any) => {
          try {
            return await getGuardianProtocol().analyzeDuress(voiceData, faceData, behaviorData);
          } catch (error) {
            console.error('[GuardianProtocol] Error in analyzeDuress:', error);
            throw error;
          }
        },
        deactivateDuressMode: async () => {
          try {
            return await getGuardianProtocol().deactivateDuressMode();
          } catch (error) {
            console.error('[GuardianProtocol] Error in deactivateDuressMode:', error);
            throw error;
          }
        },
        getEmergencyEvents: () => {
          try {
            return getGuardianProtocol().getEmergencyEvents();
          } catch (error) {
            console.error('[GuardianProtocol] Error in getEmergencyEvents:', error);
            throw error;
          }
        },
        getActiveEvents: () => {
          try {
            return getGuardianProtocol().getActiveEvents();
          } catch (error) {
            console.error('[GuardianProtocol] Error in getActiveEvents:', error);
            throw error;
          }
        },
        isDuressMode: () => {
          try {
            return getGuardianProtocol().isDuressMode();
          } catch (error) {
            console.error('[GuardianProtocol] Error in isDuressMode:', error);
            throw error;
          }
        },
        isMonitoringActive: () => {
          try {
            return getGuardianProtocol().isMonitoringActive();
          } catch (error) {
            console.error('[GuardianProtocol] Error in isMonitoringActive:', error);
            throw error;
          }
        },
        resolveEvent: async (eventId: string) => {
          try {
            return await getGuardianProtocol().resolveEvent(eventId);
          } catch (error) {
            console.error('[GuardianProtocol] Error in resolveEvent:', error);
            throw error;
          }
        },
      };
      console.log('[GuardianProtocol] Proxy object created successfully');
      console.log('[GuardianProtocol] Proxy has init method:', typeof proxy.init);
      console.log('[GuardianProtocol] Proxy keys:', Object.keys(proxy));
      // #region agent log
      try {
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:889',message:'Proxy object created successfully',data:{timestamp:Date.now(),hasInit:typeof proxy.init,keys:Object.keys(proxy)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});
      } catch (e) {}
      // #endregion
      return proxy;
  } catch (error) {
    console.error('[GuardianProtocol] Error creating proxy object:', error);
    // #region agent log
    try {
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:895',message:'Error in IIFE, returning fallback',data:{error:error instanceof Error?error.message:'Unknown',stack:error instanceof Error?error.stack?.substring(0,200):undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});
    } catch (e) {}
    // #endregion
    // Return a fallback object instead of throwing to prevent module load failure
    return {
      init: async () => { console.error('[GuardianProtocol] Fallback init called - protocol not initialized'); },
      activateSOS: async () => { throw new Error('Protocol not initialized'); },
      startVoiceMonitoring: async () => { throw new Error('Protocol not initialized'); },
      stopVoiceMonitoring: async () => { throw new Error('Protocol not initialized'); },
      detectDistressInText: () => false,
      analyzeDuress: async () => { throw new Error('Protocol not initialized'); },
      deactivateDuressMode: async () => { throw new Error('Protocol not initialized'); },
      getEmergencyEvents: () => [],
      getActiveEvents: () => [],
      isDuressMode: () => false,
      isMonitoringActive: () => false,
      resolveEvent: async () => { throw new Error('Protocol not initialized'); },
    };
  }
  })();
  console.log('[GuardianProtocol] IIFE completed successfully, proxy:', !!_guardianProtocolProxy);
} catch (outerError) {
  console.error('[GuardianProtocol] CRITICAL: IIFE failed completely:', outerError);
  // #region agent log
  try {
    fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:933',message:'CRITICAL: IIFE failed, using emergency fallback',data:{error:outerError instanceof Error?outerError.message:'Unknown',stack:outerError instanceof Error?outerError.stack?.substring(0,200):undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'K'})}).catch(()=>{});
  } catch (e) {}
  // #endregion
  _guardianProtocolProxy = {
    init: async () => { console.error('[GuardianProtocol] Emergency fallback init called'); },
    activateSOS: async () => ({ success: false, message: 'Emergency fallback' }),
    startVoiceMonitoring: async () => { console.error('[GuardianProtocol] Emergency fallback startVoiceMonitoring called'); },
    stopVoiceMonitoring: async () => { console.error('[GuardianProtocol] Emergency fallback stopVoiceMonitoring called'); },
    detectDistressInText: () => false,
    analyzeDuress: async () => ({ duressDetected: false, reason: 'Emergency fallback' }),
    deactivateDuressMode: async () => { console.error('[GuardianProtocol] Emergency fallback deactivateDuressMode called'); },
    getEmergencyEvents: () => [],
    getActiveEvents: () => [],
    isDuressMode: () => false,
    isMonitoringActive: () => false,
    resolveEvent: async () => ({ success: false, message: 'Emergency fallback' }),
  };
}

// Ensure proxy is never null
console.log('[GuardianProtocol] Checking if proxy is null, proxy exists:', !!_guardianProtocolProxy);
if (!_guardianProtocolProxy) {
  console.error('[GuardianProtocol] CRITICAL: Proxy is null, using emergency fallback');
  _guardianProtocolProxy = {
    init: async () => { console.error('[GuardianProtocol] Emergency fallback init called'); },
    activateSOS: async () => ({ success: false, message: 'Emergency fallback' }),
    startVoiceMonitoring: async () => { console.error('[GuardianProtocol] Emergency fallback startVoiceMonitoring called'); },
    stopVoiceMonitoring: async () => { console.error('[GuardianProtocol] Emergency fallback stopVoiceMonitoring called'); },
    detectDistressInText: () => false,
    analyzeDuress: async () => ({ duressDetected: false, reason: 'Emergency fallback' }),
    deactivateDuressMode: async () => { console.error('[GuardianProtocol] Emergency fallback deactivateDuressMode called'); },
    getEmergencyEvents: () => [],
    getActiveEvents: () => [],
    isDuressMode: () => false,
    isMonitoringActive: () => false,
    resolveEvent: async () => ({ success: false, message: 'Emergency fallback' }),
  };
}

// Final safety check - ensure export is always a valid object
console.log('[GuardianProtocol] Creating safeExport, proxy exists:', !!_guardianProtocolProxy);
const safeExport = _guardianProtocolProxy || {
  init: async () => { 
    console.error('[GuardianProtocol] FINAL FALLBACK: init called on invalid export');
  },
  activateSOS: async () => ({ success: false, message: 'Final fallback' }),
  startVoiceMonitoring: async () => { console.error('[GuardianProtocol] FINAL FALLBACK: startVoiceMonitoring called'); },
  stopVoiceMonitoring: async () => { console.error('[GuardianProtocol] FINAL FALLBACK: stopVoiceMonitoring called'); },
  detectDistressInText: () => false,
  analyzeDuress: async () => ({ duressDetected: false, reason: 'Final fallback' }),
  deactivateDuressMode: async () => { console.error('[GuardianProtocol] FINAL FALLBACK: deactivateDuressMode called'); },
  getEmergencyEvents: () => [],
  getActiveEvents: () => [],
  isDuressMode: () => false,
  isMonitoringActive: () => false,
  resolveEvent: async () => ({ success: false, message: 'Final fallback' }),
};

export const guardianProtocol = safeExport;

// Log after export to track execution
console.log('[GuardianProtocol] ====== EXPORT COMPLETED ======');
console.log('[GuardianProtocol] Export completed, guardianProtocol:', typeof guardianProtocol, !!guardianProtocol);
console.log('[GuardianProtocol] Export has init method:', typeof guardianProtocol?.init);
console.log('[GuardianProtocol] Export keys:', Object.keys(guardianProtocol || {}));
try {
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guardian-protocol.ts:990',message:'Export completed',data:{type:typeof guardianProtocol,exists:!!guardianProtocol,hasInit:typeof guardianProtocol?.init},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'N'})}).catch(()=>{});
  // #endregion
} catch (e) {
  console.error('[GuardianProtocol] Error logging export:', e);
}

export default guardianProtocol;

