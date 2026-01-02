/**
 * RARE 4N - Rate Limiting Middleware
 * ✅ Redis-backed rate limiting with in-memory fallback
 * ✅ Prevents API abuse and DDoS attacks
 */

import rateLimit from 'express-rate-limit';
import { getDatabase } from '../database/localDB.js';

// In-memory store fallback (if Redis not available)
const memoryStore = new Map();

/**
 * Create rate limiter with Redis support (fallback to memory)
 */
function createRateLimiter(options = {}) {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // 100 requests
    message = 'Too many requests, please try again later.',
    keyGenerator = (req) => req.ip || 'unknown',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = options;

  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'rate_limited',
        message: typeof message === 'string' ? message : 'Too many requests. Please try again later.',
        retryAfterSeconds: Math.ceil(windowMs / 1000),
      });
    },
    windowMs,
    max,
    message,
    keyGenerator,
    skipSuccessfulRequests,
    skipFailedRequests,
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    // Custom store with Redis fallback
    store: {
      async incr(key, cb) {
        try {
          // Try Redis first (if available)
          if (process.env.REDIS_URL) {
            const Redis = (await import('ioredis')).default;
            const redis = new Redis(process.env.REDIS_URL);
            
            const current = await redis.incr(key);
            if (current === 1) {
              await redis.expire(key, Math.ceil(windowMs / 1000));
            }
            
            const ttl = await redis.ttl(key);
            cb(null, current, ttl * 1000);
            return;
          }
        } catch (error) {
          console.warn('[RateLimiter] Redis unavailable, using memory store:', error.message);
        }

        // Fallback to memory store
        const now = Date.now();
        const record = memoryStore.get(key) || { count: 0, resetTime: new Date(now + windowMs) };

        if (now > record.resetTime.getTime()) {
          record.count = 1;
          record.resetTime = new Date(now + windowMs);
        } else {
          record.count++;
        }

        memoryStore.set(key, record);

        // Cleanup old entries periodically
        if (memoryStore.size > 10000) {
          for (const [k, v] of memoryStore.entries()) {
            if (now > v.resetTime.getTime()) {
              memoryStore.delete(k);
            }
          }
        }

        // express-rate-limit expects a Date object for resetTime
        cb(null, record.count, record.resetTime);
      },
      async decrement(key) {
        try {
          if (process.env.REDIS_URL) {
            const Redis = (await import('ioredis')).default;
            const redis = new Redis(process.env.REDIS_URL);
            await redis.decr(key);
            return;
          }
        } catch (error) {
          // Ignore Redis errors
        }

        const record = memoryStore.get(key);
        if (record && record.count > 0) {
          record.count--;
          memoryStore.set(key, record);
        }
      },
      async resetKey(key) {
        try {
          if (process.env.REDIS_URL) {
            const Redis = (await import('ioredis')).default;
            const redis = new Redis(process.env.REDIS_URL);
            await redis.del(key);
            return;
          }
        } catch (error) {
          // Ignore Redis errors
        }

        memoryStore.delete(key);
      },
    },
  });
}

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

/**
 * Strict API rate limiter
 * 50 requests per 15 minutes per IP
 */
export const strictLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Rate limit exceeded. Please slow down.',
});

/**
 * AI API rate limiter
 * 20 requests per minute per user
 */
export const aiLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: 'Too many AI requests. Please wait a moment.',
  keyGenerator: (req) => {
    // Use userId if available, otherwise fallback to IP
    return req.userId || req.ip || 'unknown';
  },
});

/**
 * Authentication rate limiter
 * 5 login attempts per 15 minutes per IP
 */
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many login attempts. Please try again later.',
  skipSuccessfulRequests: true, // Don't count successful logins
});

/**
 * Terminal command rate limiter
 * 30 commands per minute per user
 */
export const terminalLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Too many terminal commands. Please slow down.',
  keyGenerator: (req) => req.userId || req.ip || 'unknown',
});

/**
 * File upload rate limiter
 * 10 uploads per hour per user
 */
export const uploadLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Too many file uploads. Please try again later.',
  keyGenerator: (req) => req.userId || req.ip || 'unknown',
});

/**
 * Check AI rate limit programmatically (for use in services)
 * @param {string} userId - User ID
 * @param {number} maxRequests - Maximum requests per minute
 * @returns {Promise<{allowed: boolean, remaining: number, resetTime: number}>}
 */
export async function checkAIRateLimit(userId, maxRequests = 20) {
  const key = `ai_rate_limit:${userId}`;
  const windowMs = 60 * 1000; // 1 minute
  
  try {
    // Try Redis first
    if (process.env.REDIS_URL) {
      const Redis = (await import('ioredis')).default;
      const redis = new Redis(process.env.REDIS_URL);
      
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, Math.ceil(windowMs / 1000));
      }
      
      const ttl = await redis.ttl(key);
      const remaining = Math.max(0, maxRequests - current);
      
      return {
        allowed: current <= maxRequests,
        remaining,
        resetTime: Date.now() + (ttl * 1000),
      };
    }
  } catch (error) {
    console.warn('[RateLimiter] Redis unavailable for checkAIRateLimit:', error.message);
  }

  // Fallback to memory store
  const now = Date.now();
  const record = memoryStore.get(key) || { count: 0, resetTime: new Date(now + windowMs) };

  if (now > record.resetTime.getTime()) {
    record.count = 1;
    record.resetTime = new Date(now + windowMs);
  } else {
    record.count++;
  }

  memoryStore.set(key, record);
  const remaining = Math.max(0, maxRequests - record.count);

  return {
    allowed: record.count <= maxRequests,
    remaining,
    resetTime: record.resetTime.getTime(),
  };
}

export default {
  apiLimiter,
  strictLimiter,
  aiLimiter,
  authLimiter,
  terminalLimiter,
  uploadLimiter,
  checkAIRateLimit,
};




