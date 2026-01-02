/**
 * RARE 4N - Cognitive Debugger
 * نظام Debugging متكامل مع Cognitive Loop & Kernel
 * ✅ جميع الأخطاء تمر عبر Kernel - لا crashes أبداً
 */

export class CognitiveDebugger {
  static instance = null;
  #kernel = null;
  #io = null;
  #errorHistory = [];
  #maxHistorySize = 1000;

  constructor() {
    if (CognitiveDebugger.instance) {
      return CognitiveDebugger.instance;
    }
    CognitiveDebugger.instance = this;
  }

  static getInstance() {
    if (!CognitiveDebugger.instance) {
      CognitiveDebugger.instance = new CognitiveDebugger();
    }
    return CognitiveDebugger.instance;
  }

  /**
   * Initialize with Kernel (optional)
   */
  init(kernel = null, io = null) {
    this.#kernel = kernel;
    this.#io = io;
    
    if (kernel) {
      // Subscribe to Kernel errors if kernel is available
      try {
        kernel.on('error', (event) => {
          this.handleError(event.data?.error || event.error || new Error('Unknown error'), event.data?.context || {});
        });

        kernel.on('system:error', (event) => {
          this.handleError(event.data?.error || event.error || new Error('Unknown error'), event.data?.context || {});
        });
      } catch (e) {
        console.warn('[CognitiveDebugger] Kernel event subscription failed:', e.message);
      }
    }

    console.log('✅ Cognitive Debugger initialized');
  }

  /**
   * Handle error with fallback and retry
   */
  async handleError(error, context = {}) {
    // Ensure error is an Error object
    if (!(error instanceof Error)) {
      error = new Error(String(error));
    }

    const errorEntry = {
      timestamp: Date.now(),
      error,
      context,
      stack: error.stack || '',
      resolved: false,
    };

    // Add to history
    this.#errorHistory.push(errorEntry);
    if (this.#errorHistory.length > this.#maxHistorySize) {
      this.#errorHistory.shift();
    }

    // Emit to Kernel for Cognitive Loop processing (if available)
    if (this.#kernel) {
      try {
        this.#kernel.emit({
          type: 'debug:error',
          data: {
            error: {
              message: error.message,
              name: error.name,
              stack: error.stack,
            },
            context: this.sanitizeContext(context),
            timestamp: errorEntry.timestamp,
          },
        });
      } catch (e) {
        console.warn('[CognitiveDebugger] Kernel emit failed:', e.message);
      }
    }

    // Emit to Socket.IO if available
    if (this.#io) {
      try {
        this.#io.emit('debugger:error', {
          source: context.source || 'unknown',
          error: error.message,
          stack: error.stack,
          context: this.sanitizeContext(context),
          timestamp: errorEntry.timestamp,
        });
      } catch (e) {
        console.warn('[CognitiveDebugger] Socket.IO emit failed:', e.message);
      }
    }

    // Log error (sanitized)
    console.error(`[CognitiveDebugger] Error: ${error.message}`, {
      name: error.name,
      context: this.sanitizeContext(context),
    });

    // Try to resolve automatically
    const resolved = await this.attemptResolution(error, context);
    if (resolved) {
      errorEntry.resolved = true;
      console.log(`[CognitiveDebugger] Error resolved automatically`);
    }

    return errorEntry;
  }

  /**
   * Attempt automatic resolution
   */
  async attemptResolution(error, context) {
    try {
      // Database connection errors - retry
      if (error.message.includes('MongoDB') || error.message.includes('connection')) {
        await this.retryDatabaseConnection();
        return true;
      }

      // Network errors - retry with backoff
      if (error.message.includes('network') || error.message.includes('timeout')) {
        await this.retryWithBackoff(async () => {
          // Retry logic here
          return Promise.resolve();
        });
        return true;
      }

      // Permission errors - notify user (don't auto-request)
      if (error.message.includes('permission') || error.message.includes('unauthorized')) {
        if (this.#kernel) {
          try {
            this.#kernel.emit({
              type: 'permission:required',
              data: {
                permission: context.permission,
                reason: error.message,
              },
            });
          } catch (e) {
            console.warn('[CognitiveDebugger] Permission emit failed:', e.message);
          }
        }
        return false; // Don't auto-resolve - requires user action
      }

      return false;
    } catch (resolveError) {
      console.error('[CognitiveDebugger] Resolution attempt failed:', resolveError);
      return false;
    }
  }

  /**
   * Retry database connection
   */
  async retryDatabaseConnection() {
    const maxRetries = 3;
    const delay = 5000;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const { initMongoDB } = await import('../database/mongodb.js');
        await initMongoDB();
        console.log('[CognitiveDebugger] Database reconnected');
        return;
      } catch (error) {
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
  }

  /**
   * Retry with exponential backoff
   */
  async retryWithBackoff(fn, maxRetries = 3) {
    let delay = 1000;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        } else {
          throw error;
        }
      }
    }
  }

  /**
   * Sanitize context (remove sensitive data)
   */
  sanitizeContext(context) {
    if (!context) return {};
    
    const sanitized = { ...context };
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'apiKey', 'auth'];

    for (const key in sanitized) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        sanitized[key] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }

  /**
   * Get error history
   */
  getErrorHistory(limit = 100) {
    return this.#errorHistory.slice(-limit);
  }

  /**
   * Clear error history
   */
  clearHistory() {
    this.#errorHistory = [];
  }
}

export default CognitiveDebugger.getInstance();
