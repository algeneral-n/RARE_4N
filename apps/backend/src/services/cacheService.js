/**
 * RARE 4N - Cache Service
 * ✅ Redis-backed caching with in-memory fallback
 * ✅ Reduces database load and API calls
 */

let redis = null;
const memoryCache = new Map();
const memoryCacheTTL = new Map();

/**
 * Initialize Redis connection
 */
async function initRedis() {
  if (redis) return redis;

  try {
    if (process.env.REDIS_URL) {
      const Redis = (await import('ioredis')).default;
      redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      redis.on('error', (error) => {
        console.error('[CacheService] Redis error:', error.message);
        redis = null; // Fallback to memory
      });

      redis.on('connect', () => {
        console.log('✅ Redis cache connected');
      });

      return redis;
    }
  } catch (error) {
    console.warn('[CacheService] Redis unavailable, using memory cache:', error.message);
    redis = null;
  }

  return null;
}

/**
 * Get value from cache
 */
export async function get(key) {
  try {
    // Try Redis first
    const redisClient = await initRedis();
    if (redisClient) {
      const value = await redisClient.get(key);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    }

    // Fallback to memory
    const cached = memoryCache.get(key);
    if (cached) {
      const ttl = memoryCacheTTL.get(key);
      if (ttl && Date.now() < ttl) {
        return cached;
      }
      // Expired, remove it
      memoryCache.delete(key);
      memoryCacheTTL.delete(key);
    }
    return null;
  } catch (error) {
    console.error('[CacheService] Get error:', error.message);
    return null;
  }
}

/**
 * Set value in cache
 */
export async function set(key, value, ttl = 3600) {
  try {
    // Try Redis first
    const redisClient = await initRedis();
    if (redisClient) {
      await redisClient.setex(key, ttl, JSON.stringify(value));
      return true;
    }

    // Fallback to memory
    memoryCache.set(key, value);
    memoryCacheTTL.set(key, Date.now() + (ttl * 1000));

    // Cleanup old entries if memory cache is too large
    if (memoryCache.size > 10000) {
      const now = Date.now();
      for (const [k, expireTime] of memoryCacheTTL.entries()) {
        if (now > expireTime) {
          memoryCache.delete(k);
          memoryCacheTTL.delete(k);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('[CacheService] Set error:', error.message);
    return false;
  }
}

/**
 * Delete value from cache
 */
export async function del(key) {
  try {
    const redisClient = await initRedis();
    if (redisClient) {
      await redisClient.del(key);
    }
    memoryCache.delete(key);
    memoryCacheTTL.delete(key);
    return true;
  } catch (error) {
    console.error('[CacheService] Delete error:', error.message);
    return false;
  }
}

/**
 * Delete multiple keys matching pattern
 */
export async function invalidate(pattern) {
  try {
    const redisClient = await initRedis();
    if (redisClient) {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    }

    // Also clear from memory cache
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of memoryCache.keys()) {
      if (regex.test(key)) {
        memoryCache.delete(key);
        memoryCacheTTL.delete(key);
      }
    }

    return true;
  } catch (error) {
    console.error('[CacheService] Invalidate error:', error.message);
    return false;
  }
}

/**
 * Clear all cache
 */
export async function clear() {
  try {
    const redisClient = await initRedis();
    if (redisClient) {
      await redisClient.flushdb();
    }
    memoryCache.clear();
    memoryCacheTTL.clear();
    return true;
  } catch (error) {
    console.error('[CacheService] Clear error:', error.message);
    return false;
  }
}

/**
 * Get cache statistics
 */
export async function getStats() {
  const redisClient = await initRedis();
  if (redisClient) {
    try {
      const info = await redisClient.info('stats');
      return {
        type: 'redis',
        memorySize: memoryCache.size,
      };
    } catch (error) {
      // Ignore
    }
  }

  return {
    type: 'memory',
    size: memoryCache.size,
    ttlCount: memoryCacheTTL.size,
  };
}

export default {
  get,
  set,
  del,
  invalidate,
  clear,
  getStats,
};
























