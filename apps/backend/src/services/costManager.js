/**
 * AI Cost Manager
 * Manages AI API costs with rate limiting and daily/monthly caps
 * 
 * Features:
 * - Daily cost limits per user
 * - Monthly cost limits per user
 * - Rate limiting (requests per minute) - Redis-backed
 * - Cost tracking
 * - Graceful degradation (switch to cheaper models)
 * - Kill switch support
 */

import { getDatabase } from '../database/localDB.js';
import { checkAIRateLimit } from '../middleware/rateLimiter.js';

class CostManager {
  constructor() {
    // Default limits (can be overridden via environment variables)
    this.defaultDailyLimit = parseFloat(process.env.AI_DAILY_LIMIT || '10.00'); // $10/day
    this.defaultMonthlyLimit = parseFloat(process.env.AI_MONTHLY_LIMIT || '200.00'); // $200/month
    this.rateLimitPerMinute = parseInt(process.env.AI_RATE_LIMIT_PER_MIN || '20'); // 20 requests/min
    
    // Cost estimates per 1K tokens (approximate)
    this.costEstimates = {
      'gpt-4o': { input: 0.0025, output: 0.010 }, // $2.50/$10 per 1M tokens
      'gpt-4o-mini': { input: 0.00015, output: 0.0006 }, // $0.15/$0.60 per 1M tokens
      'gpt-4-turbo': { input: 0.01, output: 0.03 },
      'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
      'claude-3-opus': { input: 0.015, output: 0.075 },
      'claude-3-sonnet': { input: 0.003, output: 0.015 },
      'claude-3-haiku': { input: 0.00025, output: 0.00125 },
      'gemini-pro': { input: 0.00025, output: 0.0005 },
      'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
    };

    // Fallback models (cheaper alternatives)
    this.fallbackModels = {
      'gpt-4o': 'gpt-4o-mini',
      'gpt-4-turbo': 'gpt-3.5-turbo',
      'claude-3-opus': 'claude-3-sonnet',
      'claude-3-sonnet': 'claude-3-haiku',
      'gemini-1.5-pro': 'gemini-pro',
    };
    
    // Kill switch state
    this.killSwitchActive = false;
    this.killSwitchReason = null;
  }

  /**
   * Check if AI is enabled (kill switch check)
   */
  isAIEnabled() {
    return !this.killSwitchActive;
  }

  /**
   * Activate kill switch (emergency shutdown)
   */
  activateKillSwitch(reason = 'Emergency shutdown') {
    this.killSwitchActive = true;
    this.killSwitchReason = reason;
    console.error(`[CostManager] 🔴 KILL SWITCH ACTIVATED: ${reason}`);
  }

  /**
   * Deactivate kill switch
   */
  deactivateKillSwitch() {
    this.killSwitchActive = false;
    this.killSwitchReason = null;
    console.log('[CostManager] ✅ Kill switch deactivated');
  }

  /**
   * Get kill switch status
   */
  getKillSwitchStatus() {
    return {
      active: this.killSwitchActive,
      reason: this.killSwitchReason,
    };
  }

  /**
   * Check rate limit (Redis-backed with in-memory fallback)
   */
  async checkRateLimit(userId) {
    try {
      return await checkAIRateLimit(userId, this.rateLimitPerMinute);
    } catch (error) {
      console.error('[CostManager] Rate limit check error:', error);
      // Allow request if rate limiter fails (fail open)
      return { allowed: true, remaining: this.rateLimitPerMinute };
    }
  }

  /**
   * Calculate cost for API call
   */
  calculateCost(model, inputTokens, outputTokens) {
    const estimate = this.costEstimates[model];
    if (!estimate) {
      // Default to gpt-4o-mini pricing if unknown
      return (inputTokens / 1000) * 0.00015 + (outputTokens / 1000) * 0.0006;
    }

    return (inputTokens / 1000) * estimate.input + (outputTokens / 1000) * estimate.output;
  }

  /**
   * Get user's daily cost
   */
  async getDailyCost(userId) {
    try {
      const db = getDatabase();
      if (!db) return 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = Math.floor(today.getTime() / 1000);

      const stmt = db.prepare(`
        SELECT SUM(cost) as total
        FROM ai_usage_logs
        WHERE user_id = ? AND created_at >= ?
      `);
      const result = stmt.get(userId, todayTimestamp);
      return result?.total || 0;
    } catch (error) {
      console.error('[CostManager] Error getting daily cost:', error);
      return 0;
    }
  }

  /**
   * Get user's monthly cost
   */
  async getMonthlyCost(userId) {
    try {
      const db = getDatabase();
      if (!db) return 0;

      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);
      const monthTimestamp = Math.floor(firstDayOfMonth.getTime() / 1000);

      const stmt = db.prepare(`
        SELECT SUM(cost) as total
        FROM ai_usage_logs
        WHERE user_id = ? AND created_at >= ?
      `);
      const result = stmt.get(userId, monthTimestamp);
      return result?.total || 0;
    } catch (error) {
      console.error('[CostManager] Error getting monthly cost:', error);
      return 0;
    }
  }

  /**
   * Get user limits
   */
  async getUserLimits(userId) {
    // In production, fetch from database per user
    // For now, use defaults
    return {
      daily: this.defaultDailyLimit,
      monthly: this.defaultMonthlyLimit,
    };
  }

  /**
   * Check if user can make AI request
   */
  async canMakeRequest(userId, requestedModel) {
    // 1. Check kill switch
    if (!this.isAIEnabled()) {
      return {
        allowed: false,
        reason: 'kill_switch',
        message: `AI is currently disabled: ${this.killSwitchReason}`,
      };
    }

    // 2. Check rate limit (Redis-backed)
    const rateLimit = await this.checkRateLimit(userId);
    if (!rateLimit.allowed) {
      return {
        allowed: false,
        reason: 'rate_limit',
        message: `Rate limit exceeded. Try again in ${rateLimit.resetIn} seconds.`,
        resetIn: rateLimit.resetIn,
      };
    }

    // 3. Check daily limit
    const dailyCost = await this.getDailyCost(userId);
    const limits = await this.getUserLimits(userId);
    
    if (dailyCost >= limits.daily) {
      return {
        allowed: false,
        reason: 'daily_limit',
        message: `Daily limit reached ($${limits.daily.toFixed(2)}). Resets at midnight.`,
        dailyCost: dailyCost.toFixed(2),
        limit: limits.daily.toFixed(2),
      };
    }

    // 4. Check monthly limit
    const monthlyCost = await this.getMonthlyCost(userId);
    if (monthlyCost >= limits.monthly) {
      return {
        allowed: false,
        reason: 'monthly_limit',
        message: `Monthly limit reached ($${limits.monthly.toFixed(2)}).`,
        monthlyCost: monthlyCost.toFixed(2),
        limit: limits.monthly.toFixed(2),
      };
    }

    // 5. Check if we should use fallback model (approaching limit)
    const estimatedCost = this.calculateCost(requestedModel, 1000, 500); // Rough estimate
    const remainingDaily = limits.daily - dailyCost;
    
    let finalModel = requestedModel;
    if (estimatedCost > remainingDaily * 0.5 && this.fallbackModels[requestedModel]) {
      // If estimated cost is more than 50% of remaining budget, use fallback
      finalModel = this.fallbackModels[requestedModel];
      return {
        allowed: true,
        reason: 'fallback_model',
        message: `Using cheaper model to stay within budget.`,
        requestedModel,
        finalModel,
        remainingDaily: remainingDaily.toFixed(2),
      };
    }

    return {
      allowed: true,
      model: finalModel,
      remainingDaily: remainingDaily.toFixed(2),
      remainingMonthly: (limits.monthly - monthlyCost).toFixed(2),
    };
  }

  /**
   * Log AI usage and cost
   */
  async logUsage(userId, model, inputTokens, outputTokens, cost) {
    try {
      const db = getDatabase();
      if (!db) return;

      const stmt = db.prepare(`
        INSERT INTO ai_usage_logs (user_id, model, input_tokens, output_tokens, cost, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        userId,
        model,
        inputTokens,
        outputTokens,
        cost,
        Math.floor(Date.now() / 1000)
      );
    } catch (error) {
      console.error('[CostManager] Error logging usage:', error);
    }
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(userId) {
    const dailyCost = await this.getDailyCost(userId);
    const monthlyCost = await this.getMonthlyCost(userId);
    const limits = await this.getUserLimits(userId);

    return {
      daily: {
        cost: dailyCost.toFixed(2),
        limit: limits.daily.toFixed(2),
        remaining: (limits.daily - dailyCost).toFixed(2),
        percentage: ((dailyCost / limits.daily) * 100).toFixed(1),
      },
      monthly: {
        cost: monthlyCost.toFixed(2),
        limit: limits.monthly.toFixed(2),
        remaining: (limits.monthly - monthlyCost).toFixed(2),
        percentage: ((monthlyCost / limits.monthly) * 100).toFixed(1),
      },
      killSwitch: this.getKillSwitchStatus(),
    };
  }
}

// Singleton instance
let costManagerInstance = null;

export function getCostManager() {
  if (!costManagerInstance) {
    costManagerInstance = new CostManager();
  }
  return costManagerInstance;
}

export default getCostManager;

