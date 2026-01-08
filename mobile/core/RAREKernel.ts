/**
 * RARE 4N - Core Kernel
 * The central orchestration engine for all RARE services and agents.
 * 
 * Architecture: Kernel → Engines → Agents → Services
 * Built for longevity - Comprehensive protection
 */

// CRITICAL: This must execute before anything else
console.log('[RAREKernel] FILE LOADED - Top of file executed');

// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:1',message:'RAREKernel module loading started',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
} catch (e) {
  console.error('[RAREKernel] CRITICAL: Failed to send initial log:', e);
}
// #endregion

import { RAREEngine } from './RAREEngine';
import { ContextStore } from './ContextStore';
import { EventBus } from './EventBus';
import { PolicyEngine } from './PolicyEngine';
import { MemoryEngine } from './MemoryEngine';
import { AwarenessSystem } from './AwarenessSystem';

// Log after imports to track execution
try {
  console.log('[RAREKernel.ts] Core engines imported');
} catch (e) {
  // Ignore logging errors
}

// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:20',message:'Core engines imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
} catch (e) {}
// #endregion

// استيراد العملاء الأساسيين
import {
  BuilderAgent,
  VoiceAgent,
  VaultAgent,
  MapsAgent,
  CommunicationAgent,
  CouncilAgent
} from './agents';

// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:35',message:'Agents imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
} catch (e) {}
// #endregion

// استيراد المحركات
import { rarePersonalityEngine } from './engines/RAREPersonalityEngine';
import { rareEmotionEngine } from './engines/RAREEmotionEngine';
import { rareDialectEngine } from './engines/RAREDialectEngine';

// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:42',message:'Engines imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
} catch (e) {}
// #endregion

// استيراد البروتوكولات
console.log('[RAREKernel.ts] ====== ABOUT TO IMPORT PROTOCOLS ======');
console.log('[RAREKernel.ts] About to import absoluteLoyaltyProtocol...');

import { absoluteLoyaltyProtocol } from './protocols/absolute-loyalty-protocol';

console.log('[RAREKernel.ts] ====== absoluteLoyaltyProtocol IMPORTED ======');
console.log('[RAREKernel.ts] absoluteLoyaltyProtocol imported:', typeof absoluteLoyaltyProtocol, !!absoluteLoyaltyProtocol);
console.log('[RAREKernel.ts] absoluteLoyaltyProtocol.init:', typeof absoluteLoyaltyProtocol?.init);
if (absoluteLoyaltyProtocol) {
  console.log('[RAREKernel.ts] absoluteLoyaltyProtocol keys:', Object.keys(absoluteLoyaltyProtocol));
} else {
  console.error('[RAREKernel.ts] CRITICAL: absoluteLoyaltyProtocol is null or undefined!');
}

console.log('[RAREKernel.ts] About to import guardianProtocol...');

import { guardianProtocol } from './protocols/guardian-protocol';

console.log('[RAREKernel.ts] ====== guardianProtocol IMPORTED ======');
console.log('[RAREKernel.ts] guardianProtocol imported:', typeof guardianProtocol, !!guardianProtocol);
console.log('[RAREKernel.ts] guardianProtocol.init:', typeof guardianProtocol?.init);
if (guardianProtocol) {
  console.log('[RAREKernel.ts] guardianProtocol keys:', Object.keys(guardianProtocol));
} else {
  console.error('[RAREKernel.ts] CRITICAL: guardianProtocol is null or undefined!');
}
console.log('[RAREKernel.ts] ====== BOTH PROTOCOLS IMPORTED SUCCESSFULLY ======');

// #region agent log
try {
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:48',message:'Protocols imported',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
} catch (e) {}
// #endregion

// Re-export KernelEvent for convenience
export type { KernelEvent } from './types';

export class RAREKernel {
  private static instance: RAREKernel;
  private initialized: boolean = false;
  private running: boolean = false;
  
  // Engines & Stores
  private contextStore: ContextStore;
  private eventBus: EventBus;
  private policyEngine: PolicyEngine;
  private memoryEngine: MemoryEngine;
  private awarenessSystem: AwarenessSystem;
  
  // Agents Registry
  private agents: Map<string, any> = new Map();

  private constructor() {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:50',message:'RAREKernel constructor called',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    this.contextStore = ContextStore.getInstance();
    this.eventBus = EventBus.getInstance();
    this.policyEngine = PolicyEngine.getInstance();
    this.memoryEngine = MemoryEngine.getInstance();
    this.awarenessSystem = AwarenessSystem.getInstance();
    
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:58',message:'RAREKernel constructor completed',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
  }

  static getInstance(): RAREKernel {
    // #region agent log
    try {
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:getInstance',message:'RAREKernel.getInstance() called',data:{instanceExists:!!RAREKernel.instance},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
    } catch (e) {}
    // #endregion
    if (!RAREKernel.instance) {
      // #region agent log
      try {
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:getInstance',message:'Creating new RAREKernel instance',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      } catch (e) {}
      // #endregion
      RAREKernel.instance = new RAREKernel();
      // #region agent log
      try {
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:getInstance',message:'RAREKernel instance created',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
      } catch (e) {}
      // #endregion
    }
    return RAREKernel.instance;
  }

  getState(): { initialized: boolean; running: boolean } {
    return {
      initialized: this.initialized,
      running: this.running,
    };
  }

  async init(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:72',message:'Kernel init started',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      // 1. Initialize Core Stores
      await this.contextStore.init();
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:78',message:'ContextStore initialized',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      await this.policyEngine.init();
      await this.memoryEngine.init();
      
      // 2. Initialize Awareness System
      await this.awarenessSystem.init(this);
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:85',message:'AwarenessSystem initialized',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      // 3. Initialize Absolute Loyalty Protocol
      try {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:169',message:'Starting AbsoluteLoyaltyProtocol init',data:{protocolExists:!!absoluteLoyaltyProtocol,initExists:typeof absoluteLoyaltyProtocol?.init},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        console.log('[RAREKernel] Starting AbsoluteLoyaltyProtocol init...');
        console.log('[RAREKernel] absoluteLoyaltyProtocol:', typeof absoluteLoyaltyProtocol, !!absoluteLoyaltyProtocol);
        console.log('[RAREKernel] absoluteLoyaltyProtocol.init:', typeof absoluteLoyaltyProtocol?.init);
        if (absoluteLoyaltyProtocol && typeof absoluteLoyaltyProtocol.init === 'function') {
          console.log('[RAREKernel] Calling absoluteLoyaltyProtocol.init(this)...');
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:175',message:'Calling absoluteLoyaltyProtocol.init',data:{kernelExists:!!this},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
          const initResult = await absoluteLoyaltyProtocol.init(this);
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:178',message:'absoluteLoyaltyProtocol.init completed',data:{result:!!initResult},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
          console.log('[RAREKernel] absoluteLoyaltyProtocol.init completed:', initResult);
        } else {
          console.warn('[RAREKernel] absoluteLoyaltyProtocol.init is not a function or protocol is null');
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:183',message:'absoluteLoyaltyProtocol.init is not a function',data:{protocolExists:!!absoluteLoyaltyProtocol,initType:typeof absoluteLoyaltyProtocol?.init},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
        }
      } catch (loyaltyError) {
        console.error('[RAREKernel] AbsoluteLoyaltyProtocol init error:', loyaltyError);
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:188',message:'Error initializing AbsoluteLoyaltyProtocol',data:{error:loyaltyError instanceof Error?loyaltyError.message:'Unknown',stack:loyaltyError instanceof Error?loyaltyError.stack?.substring(0,200):undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        console.error('[ERROR] Absolute Loyalty Protocol init error:', loyaltyError);
      }
      
      // 4. Initialize Guardian Protocol
      try {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:201',message:'Starting GuardianProtocol init',data:{protocolExists:!!guardianProtocol,initExists:typeof guardianProtocol?.init},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        console.log('[RAREKernel] Starting GuardianProtocol init...');
        console.log('[RAREKernel] guardianProtocol:', typeof guardianProtocol, !!guardianProtocol);
        console.log('[RAREKernel] guardianProtocol.init:', typeof guardianProtocol?.init);
        if (guardianProtocol && typeof guardianProtocol.init === 'function') {
          console.log('[RAREKernel] Calling guardianProtocol.init(this)...');
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:208',message:'Calling guardianProtocol.init',data:{kernelExists:!!this},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
          const initResult = await guardianProtocol.init(this);
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:211',message:'guardianProtocol.init completed',data:{result:!!initResult},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
          console.log('[RAREKernel] guardianProtocol.init completed:', initResult);
        } else {
          console.warn('[RAREKernel] guardianProtocol.init is not a function or protocol is null');
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:215',message:'guardianProtocol.init is not a function',data:{protocolExists:!!guardianProtocol,initType:typeof guardianProtocol?.init},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
          // #endregion
        }
      } catch (guardianError) {
        console.error('[RAREKernel] GuardianProtocol init error:', guardianError);
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:220',message:'Error initializing GuardianProtocol',data:{error:guardianError instanceof Error?guardianError.message:'Unknown',stack:guardianError instanceof Error?guardianError.stack?.substring(0,200):undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        console.error('[ERROR] Guardian Protocol init error:', guardianError);
      }
      
      // 5. Register Agents
      await this.registerAgents();
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:94',message:'Agents registered',data:{agentCount:this.agents.size},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      // 6. Setup Analytics Kernel Getter (avoid circular dependency)
      try {
        const { analytics } = await import('../../utils/analytics');
        analytics.setKernelGetter(() => this);
      } catch (analyticsError) {
        console.warn('[WARNING] Could not setup analytics kernel getter:', analyticsError);
      }
      
      this.initialized = true;
      this.emit({ type: 'kernel:initialized', data: { status: 'ready' } });
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:120',message:'Kernel init completed',data:{initialized:this.initialized},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      console.log('[INIT] RAREKernel initialized successfully');
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:103',message:'Kernel init error',data:{error:error instanceof Error?error.message:'Unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.error('[ERROR] Kernel init error:', error);
      throw error;
    }
  }

  private async registerAgents(): Promise<void> {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:135',message:'Starting agent registration',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      // Register core agents (Agents have their own constructors with config)
      const agents = [
        new BuilderAgent(),
        new VoiceAgent(),
        new VaultAgent(),
        new MapsAgent(),
        new CommunicationAgent(),
        new CouncilAgent(),
      ];
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:147',message:'Agents created',data:{count:agents.length,agentIds:agents.map(a=>a.id)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      for (const agent of agents) {
        try {
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:151',message:'Initializing agent',data:{agentId:agent.id,agentName:agent.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          
          this.agents.set(agent.id, agent);
          
          // All agents extend BaseAgent which implements initialize()
          await agent.initialize({ kernel: this });
          
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:196',message:'Agent initialized',data:{agentId:agent.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
        } catch (agentError) {
          // #region agent log
          fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:164',message:'Agent init error',data:{agentId:agent.id,error:agentError instanceof Error?agentError.message:'Unknown',stack:agentError instanceof Error?agentError.stack:undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
          console.error(`[ERROR] Agent ${agent.id} init error:`, agentError);
          // Continue with other agents even if one fails
        }
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:171',message:'Agents registered',data:{count:this.agents.size,agentIds:Array.from(this.agents.keys())},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      console.log(`[SUCCESS] Registered ${agents.length} agents`);
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'RAREKernel.ts:177',message:'Agent registration error',data:{error:error instanceof Error?error.message:'Unknown',stack:error instanceof Error?error.stack:undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.error('[ERROR] Agent registration error:', error);
    }
  }

  async start(): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
    this.running = true;
    this.emit({ type: 'kernel:started', data: { status: 'running' } });
  }

  async stop(): Promise<void> {
    this.running = false;
    this.emit({ type: 'kernel:stopped', data: { status: 'stopped' } });
  }

  emit(event: { type: string; data: any; source?: string }): void {
    try {
      const fullEvent = { ...event, timestamp: Date.now() };
      this.eventBus.emit(fullEvent);
    } catch (error) {
      console.error('Kernel emit error:', error);
    }
  }

  on(type: string, handler: (event: any) => void): () => void {
    try {
      return this.eventBus.on(type, handler);
    } catch (error) {
      console.error('Kernel on error:', error);
      return () => {}; // Return no-op unsubscribe
    }
  }

  off(type: string, handler: (event: any) => void): void {
    try {
      this.eventBus.off(type, handler);
    } catch (error) {
      console.error('Kernel off error:', error);
    }
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): any | null {
    return this.agents.get(agentId) || null;
  }

  /**
   * Get all agents
   */
  getAllAgents(): Map<string, any> {
    return new Map(this.agents);
  }

  /**
   * Get Personality Engine
   */
  getPersonalityEngine() {
    return rarePersonalityEngine;
  }

  /**
   * Get Emotion Engine
   */
  getEmotionEngine() {
    return rareEmotionEngine;
  }

  /**
   * Get Dialect Engine
   */
  getDialectEngine() {
    return rareDialectEngine;
  }

  /**
   * Get Absolute Loyalty Protocol
   */
  getLoyaltyProtocol() {
    return absoluteLoyaltyProtocol;
  }

  /**
   * Get Guardian Protocol
   */
  getGuardianProtocol() {
    return guardianProtocol;
  }
}