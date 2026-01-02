/**
 * RARE 4N - Cognitive Loop
 * The decision-making brain that processes user intent and emotions.
 * 
 * Architecture: Cognitive Loop → Personality Engine → Emotion Engine → Kernel → Agents
 * Built for longevity - Comprehensive protection
 */

// CRITICAL: This must execute before anything else
console.log('[CognitiveLoop] FILE LOADED - Top of file executed');

// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:8',message:'CognitiveLoop.ts module loading started',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
} catch (e) {
  console.error('[CognitiveLoop] CRITICAL: Failed to send initial log:', e);
}
// #endregion

import { RAREKernel } from './RAREKernel';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:14',message:'RAREKernel imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
} catch (e) {}
// #endregion

import { ContextStore } from './ContextStore';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:18',message:'ContextStore imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
} catch (e) {}
// #endregion

import { rarePersonalityEngine } from './engines/RAREPersonalityEngine';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:22',message:'rarePersonalityEngine imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
} catch (e) {}
// #endregion

import { rareEmotionEngine } from './engines/RAREEmotionEngine';
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:26',message:'rareEmotionEngine imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
} catch (e) {}
// #endregion

console.log('[CognitiveLoop.ts] About to import absoluteLoyaltyProtocol...');
import { absoluteLoyaltyProtocol } from './protocols/absolute-loyalty-protocol';
console.log('[CognitiveLoop.ts] ====== absoluteLoyaltyProtocol IMPORTED ======');
console.log('[CognitiveLoop.ts] absoluteLoyaltyProtocol:', typeof absoluteLoyaltyProtocol, !!absoluteLoyaltyProtocol);
console.log('[CognitiveLoop.ts] absoluteLoyaltyProtocol.init:', typeof absoluteLoyaltyProtocol?.init);
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:30',message:'absoluteLoyaltyProtocol imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
} catch (e) {}
// #endregion

console.log('[CognitiveLoop.ts] About to import guardianProtocol...');
import { guardianProtocol } from './protocols/guardian-protocol';
console.log('[CognitiveLoop.ts] ====== guardianProtocol IMPORTED ======');
console.log('[CognitiveLoop.ts] guardianProtocol:', typeof guardianProtocol, !!guardianProtocol);
console.log('[CognitiveLoop.ts] guardianProtocol.init:', typeof guardianProtocol?.init);
// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:34',message:'guardianProtocol imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
} catch (e) {}
// #endregion

export class CognitiveLoop {
  private static instance: CognitiveLoop;
  private kernel: RAREKernel | null = null;
  private contextStore: ContextStore;

  private constructor() {
    this.contextStore = ContextStore.getInstance();
  }

  static getInstance(): CognitiveLoop {
    // #region agent log
    try {
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:getInstance',message:'CognitiveLoop.getInstance() called',data:{instanceExists:!!CognitiveLoop.instance},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
    } catch (e) {}
    // #endregion
    if (!CognitiveLoop.instance) {
      // #region agent log
      try {
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:getInstance',message:'Creating new CognitiveLoop instance',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      } catch (e) {}
      // #endregion
      CognitiveLoop.instance = new CognitiveLoop();
      // #region agent log
      try {
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:getInstance',message:'CognitiveLoop instance created',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      } catch (e) {}
      // #endregion
    }
    return CognitiveLoop.instance;
  }

  async init(kernel: RAREKernel): Promise<void> {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:58',message:'CognitiveLoop.init started',data:{kernelExists:!!kernel,protocolExists:!!absoluteLoyaltyProtocol,guardianExists:!!guardianProtocol},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      this.kernel = kernel;
      
      // ربط Absolute Loyalty Protocol
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:64',message:'About to call absoluteLoyaltyProtocol.init',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      await absoluteLoyaltyProtocol.init(kernel);
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:67',message:'absoluteLoyaltyProtocol.init completed',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      
      // ربط Guardian Protocol
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:71',message:'About to call guardianProtocol.init',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      await guardianProtocol.init(kernel);
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:74',message:'guardianProtocol.init completed',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
      // #endregion
      
      // الاستماع لمدخلات المستخدم
      this.kernel.on('user:input', async (event) => {
        await this.processInput(event.data);
      });
      
      // الاستماع لأحداث الأمان
      this.kernel.on('security:threat', async (event) => {
        console.warn('🚨 Security threat detected:', event.data);
      });
      
    } catch (error) {
      console.error('CognitiveLoop init error:', error);
    }
  }

  async processInput(input: any) {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:57',message:'processInput started',data:{hasText:!!input.text,hasAudio:!!input.audio},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      if (!input.text && !input.audio) return;
      
      // 1. التحقق من الأمان أولاً (Absolute Loyalty Protocol)
      if (input.text) {
        const validation = await absoluteLoyaltyProtocol.validateCommand(
          input.text,
          input.userId || 'nader',
          input.context
        );
        
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:69',message:'Command validation result',data:{allowed:validation.allowed,threatLevel:validation.threatLevel},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        if (!validation.allowed) {
          this.kernel?.emit({
            type: 'cognitive:blocked',
            data: { 
              reason: validation.reason,
              threatLevel: validation.threatLevel,
              requiresConfirmation: validation.requiresConfirmation
            }
          });
          return;
        }
      }
      
      // 2. كشف الاستغاثة في النص (Guardian Protocol)
      if (input.text && guardianProtocol.detectDistressInText(input.text)) {
        await guardianProtocol.activateSOS('Distress keyword detected in text');
        return;
      }
      
      // 3. تحليل المشاعر (Emotion Engine)
      let emotionResult = null;
      if (input.text) {
        emotionResult = rareEmotionEngine.detectFromText(input.text);
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:91',message:'Emotion detected from text',data:{emotion:emotionResult?.emotion,confidence:emotionResult?.confidence},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
      }
      if (input.audio) {
        const audioEmotion = rareEmotionEngine.detectFromAudio(input.audio);
        if (emotionResult) {
          emotionResult = rareEmotionEngine.mergeEmotions(emotionResult, audioEmotion);
        } else {
          emotionResult = audioEmotion;
        }
      }
      
      // 4. اختيار الشخصية المناسبة (Personality Engine)
      const personalityMode = rarePersonalityEngine.autoSelectMode(input.text || '');
      const personalityProfile = rarePersonalityEngine.getProfile();
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:104',message:'Personality mode selected',data:{mode:personalityMode},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      // 5. تحليل النية (Intent)
      const intent = this.recognizeIntent(input.text);
      
      // 6. تحديث السياق
      this.contextStore.updateContext({
        session: {
          currentEmotion: emotionResult ? {
            type: emotionResult.emotion as any,
            intensity: emotionResult.intensity,
            confidence: emotionResult.confidence
          } : null,
          currentIntent: intent
        }
      });
      
      // 7. إرسال القرار للـ Kernel
      if (this.kernel) {
        this.kernel.emit({
          type: 'cognitive:decision',
          data: { 
            action: intent.action, 
            confidence: 0.95,
            emotion: emotionResult,
            personality: personalityProfile,
            personalityMode
          }
        });
        
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:123',message:'Cognitive decision emitted',data:{intent:intent.type,personalityMode},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
        // إرسال حدث المشاعر
        if (emotionResult) {
          this.kernel.emit({
            type: 'emotion:detected',
            data: emotionResult
          });
        }
        
        // إرسال حدث النية
        this.kernel.emit({
          type: 'intent:recognized',
          data: intent
        });
      }
      
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CognitiveLoop.ts:149',message:'processInput error',data:{error:error instanceof Error?error.message:'Unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      console.error('CognitiveLoop processInput error:', error);
      this.kernel?.emit({
        type: 'cognitive:error',
        data: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
  }

  private recognizeIntent(text: string) {
    try {
      const lowerText = (text || '').toLowerCase();
      
      // بناء على Personality Engine
      const personalityMode = rarePersonalityEngine.autoSelectMode(text);
      
      if (lowerText.includes('build') || lowerText.includes('تطبيق') || lowerText.includes('بناء')) {
        return { type: 'build_app', confidence: 0.9, parameters: { personalityMode } };
      }
      if (lowerText.includes('generate') || lowerText.includes('توليد')) {
        return { type: 'generate', confidence: 0.85, parameters: { personalityMode } };
      }
      if (lowerText.includes('vault') || lowerText.includes('خزنة')) {
        return { type: 'vault_access', confidence: 0.8, parameters: { personalityMode } };
      }
      if (lowerText.includes('maps') || lowerText.includes('خريطة')) {
        return { type: 'maps', confidence: 0.8, parameters: { personalityMode } };
      }
      
      return { type: 'chat', confidence: 0.7, parameters: { personalityMode } };
    } catch (error) {
      console.error('Intent recognition error:', error);
      return { type: 'chat', confidence: 0.5, parameters: {} };
    }
  }
}