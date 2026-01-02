/**
 * RARE 4N - Health Check & Metrics Route
 * ✅ Comprehensive health monitoring
 * ✅ System metrics collection
 */

import express from 'express';
import { getDatabase } from '../database/localDB.js';
import { getMongoDB } from '../database/mongodb.js';
import { getSupabase } from '../database/supabase.js';
import { getStats as getCacheStats } from '../services/cacheService.js';
import os from 'os';

const router = express.Router();

// Metrics storage (in-memory, reset on restart)
let metrics = {
  requests: {
    total: 0,
    byMethod: {},
    byRoute: {},
    errors: 0,
  },
  responseTimes: [],
  uptime: Date.now(),
  lastHealthCheck: null,
};

/**
 * Update metrics
 */
export function updateMetrics(method, route, statusCode, responseTime) {
  metrics.requests.total++;
  
  // Track by method
  metrics.requests.byMethod[method] = (metrics.requests.byMethod[method] || 0) + 1;
  
  // Track by route
  metrics.requests.byRoute[route] = (metrics.requests.byRoute[route] || 0) + 1;
  
  // Track errors
  if (statusCode >= 400) {
    metrics.requests.errors++;
  }
  
  // Track response times (keep last 1000)
  metrics.responseTimes.push(responseTime);
  if (metrics.responseTimes.length > 1000) {
    metrics.responseTimes.shift();
  }
}

/**
 * Get system metrics
 */
function getSystemMetrics() {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  
  return {
    cpu: {
      cores: cpus.length,
      model: cpus[0]?.model || 'Unknown',
      usage: process.cpuUsage(),
    },
    memory: {
      total: totalMem,
      free: freeMem,
      used: usedMem,
      usagePercent: ((usedMem / totalMem) * 100).toFixed(2),
    },
    uptime: {
      system: os.uptime(),
      process: process.uptime(),
    },
    platform: {
      type: os.type(),
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
    },
  };
}

/**
 * Check database connections
 */
async function checkDatabases() {
  const status = {
    sqlite: { connected: false, error: null },
    mongodb: { connected: false, error: null },
    supabase: { connected: false, error: null },
  };
  
  // Check SQLite
  try {
    const db = getDatabase();
    if (db) {
      db.prepare('SELECT 1').run();
      status.sqlite.connected = true;
    }
  } catch (error) {
    status.sqlite.error = error.message;
  }
  
  // Check MongoDB
  try {
    const mongo = await getMongoDB();
    if (mongo) {
      await mongo.admin().ping();
      status.mongodb.connected = true;
    }
  } catch (error) {
    status.mongodb.error = error.message;
  }
  
  // Check Supabase
  try {
    const supabase = getSupabase();
    if (supabase) {
      status.supabase.connected = true;
    }
  } catch (error) {
    status.supabase.error = error.message;
  }
  
  return status;
}

/**
 * Basic health check
 * GET /api/health
 */
router.get('/', async (req, res) => {
  try {
    const databases = await checkDatabases();
    const cacheStats = await getCacheStats();
    
    metrics.lastHealthCheck = new Date().toISOString();
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      version: process.env.npm_package_version || '1.0.0',
      databases,
      cache: cacheStats,
      metrics: {
        requests: {
          total: metrics.requests.total,
          errors: metrics.requests.errors,
          errorRate: metrics.requests.total > 0 
            ? ((metrics.requests.errors / metrics.requests.total) * 100).toFixed(2) + '%'
            : '0%',
        },
        responseTime: {
          avg: metrics.responseTimes.length > 0
            ? (metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length).toFixed(2) + 'ms'
            : '0ms',
          min: metrics.responseTimes.length > 0
            ? Math.min(...metrics.responseTimes).toFixed(2) + 'ms'
            : '0ms',
          max: metrics.responseTimes.length > 0
            ? Math.max(...metrics.responseTimes).toFixed(2) + 'ms'
            : '0ms',
        },
        uptime: {
          seconds: Math.floor((Date.now() - metrics.uptime) / 1000),
          formatted: formatUptime(Date.now() - metrics.uptime),
        },
      },
    };
    
    // Determine overall health status
    const hasDatabaseIssues = !databases.sqlite.connected && 
                              !databases.mongodb.connected && 
                              !databases.supabase.connected;
    
    if (hasDatabaseIssues) {
      health.status = 'degraded';
    }
    
    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    console.error('[Health] Error:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Detailed metrics
 * GET /api/health/metrics
 */
router.get('/metrics', async (req, res) => {
  try {
    const databases = await checkDatabases();
    const cacheStats = await getCacheStats();
    const systemMetrics = getSystemMetrics();
    
    res.json({
      timestamp: new Date().toISOString(),
      system: systemMetrics,
      databases,
      cache: cacheStats,
      application: {
        requests: metrics.requests,
        responseTimes: {
          count: metrics.responseTimes.length,
          avg: metrics.responseTimes.length > 0
            ? metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length
            : 0,
          min: metrics.responseTimes.length > 0 ? Math.min(...metrics.responseTimes) : 0,
          max: metrics.responseTimes.length > 0 ? Math.max(...metrics.responseTimes) : 0,
          p95: getPercentile(metrics.responseTimes, 95),
          p99: getPercentile(metrics.responseTimes, 99),
        },
        uptime: {
          startTime: new Date(metrics.uptime).toISOString(),
          seconds: Math.floor((Date.now() - metrics.uptime) / 1000),
          formatted: formatUptime(Date.now() - metrics.uptime),
        },
      },
    });
  } catch (error) {
    console.error('[Health/Metrics] Error:', error);
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * System information
 * GET /api/health/system
 */
router.get('/system', (req, res) => {
  try {
    const systemMetrics = getSystemMetrics();
    res.json({
      timestamp: new Date().toISOString(),
      ...systemMetrics,
    });
  } catch (error) {
    console.error('[Health/System] Error:', error);
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Helper: Format uptime
 */
function formatUptime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Helper: Get percentile
 */
function getPercentile(arr, percentile) {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

export default router;


