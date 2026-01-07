/**
 * RARE 4N - Cache Middleware
 * ✅ Response caching for improved performance
 * ✅ Reduces database load and API calls
 */

import { get, set } from '../services/cacheService.js';
import crypto from 'crypto';

/**
 * Generate cache key from request
 */
function generateCacheKey(req, prefix = 'api') {
  const { method, path, query, body } = req;
  const userId = req.userId || req.ip || 'anonymous';
  
  // Create hash from relevant request data
  const dataToHash = JSON.stringify({
    method,
    path,
    query: query ? Object.keys(query).sort().reduce((acc, key) => {
      acc[key] = query[key];
      return acc;
    }, {}) : {},
    // Only include non-sensitive body fields
    body: body ? Object.keys(body).filter(k => !['password', 'token', 'secret'].includes(k.toLowerCase()))
      .reduce((acc, key) => {
        acc[key] = body[key];
        return acc;
      }, {}) : {},
    userId,
  });
  
  const hash = crypto.createHash('md5').update(dataToHash).digest('hex');
  return `${prefix}:${method}:${path}:${hash}`;
}

/**
 * Cache middleware factory
 * @param {Object} options - Cache options
 * @param {number} options.ttl - Time to live in seconds (default: 300)
 * @param {boolean} options.includeUser - Include user ID in cache key (default: true)
 * @param {Function} options.keyGenerator - Custom key generator function
 * @param {Function} options.shouldCache - Function to determine if response should be cached
 */
export function cacheMiddleware(options = {}) {
  const {
    ttl = 300, // 5 minutes default
    includeUser = true,
    keyGenerator = generateCacheKey,
    shouldCache = (req, res) => {
      // Only cache GET requests and successful responses
      return req.method === 'GET' && res.statusCode === 200;
    },
  } = options;

  return async (req, res, next) => {
    // Skip caching for non-GET requests unless explicitly enabled
    if (req.method !== 'GET' && !options.cachePost) {
      return next();
    }

    // Generate cache key
    const cacheKey = keyGenerator(req, options.prefix || 'api');

    try {
      // Try to get from cache
      const cached = await get(cacheKey);
      
      if (cached) {
        // Set cache headers
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-Key', cacheKey);
        
        return res.json(cached);
      }

      // Cache miss - store original json method
      const originalJson = res.json.bind(res);
      
      // Override json method to cache response
      res.json = function(data) {
        // Only cache if shouldCache returns true
        if (shouldCache(req, res)) {
          // Cache the response asynchronously (don't block response)
          set(cacheKey, data, ttl).catch(err => {
            console.warn('[CacheMiddleware] Failed to cache response:', err.message);
          });
        }
        
        // Set cache headers
        res.setHeader('X-Cache', 'MISS');
        res.setHeader('X-Cache-Key', cacheKey);
        
        // Call original json method
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('[CacheMiddleware] Error:', error.message);
      // Continue without caching on error
      next();
    }
  };
}

/**
 * Invalidate cache by pattern
 */
export async function invalidateCache(pattern) {
  const { invalidate } = await import('../services/cacheService.js');
  return await invalidate(pattern);
}

/**
 * Pre-configured cache middleware for different use cases
 */

// Short cache (1 minute) - for frequently changing data
export const shortCache = cacheMiddleware({ ttl: 60 });

// Medium cache (5 minutes) - default for most APIs
export const mediumCache = cacheMiddleware({ ttl: 300 });

// Long cache (30 minutes) - for static or rarely changing data
export const longCache = cacheMiddleware({ ttl: 1800 });

// User-specific cache (5 minutes) - includes user ID in key
export const userCache = cacheMiddleware({ 
  ttl: 300,
  includeUser: true,
});

// Public cache (15 minutes) - doesn't include user ID
export const publicCache = cacheMiddleware({ 
  ttl: 900,
  includeUser: false,
});

export default {
  cacheMiddleware,
  invalidateCache,
  shortCache,
  mediumCache,
  longCache,
  userCache,
  publicCache,
};























