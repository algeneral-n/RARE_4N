/**
 * RARE 4N - System Health Check
 * ✅ التحقق الشامل من جميع المكونات قبل البدء
 * ✅ التأكد من أن جميع الخدمات جاهزة للعمل
 */

import { validateAllKeys } from '../services/apiKeyValidator.js';
import { getTerminalSandbox } from '../services/terminalSandbox.js';
import logger from './logger.js';

/**
 * ✅ Health Check Results
 */
export class HealthCheckResult {
  constructor() {
    this.checks = {};
    this.overall = 'unknown';
    this.errors = [];
    this.warnings = [];
  }

  addCheck(name, status, message, details = null) {
    this.checks[name] = {
      status, // 'pass', 'fail', 'warning'
      message,
      details,
      timestamp: Date.now(),
    };

    if (status === 'fail') {
      this.errors.push({ name, message, details });
    } else if (status === 'warning') {
      this.warnings.push({ name, message, details });
    }
  }

  finalize() {
    if (this.errors.length > 0) {
      this.overall = 'fail';
    } else if (this.warnings.length > 0) {
      this.overall = 'warning';
    } else {
      this.overall = 'pass';
    }
  }
}

/**
 * ✅ Run comprehensive health check
 */
export async function runHealthCheck() {
  const result = new HealthCheckResult();

  try {
    // ✅ 1. Check API Keys
    logger.info('[HealthCheck] Checking API keys...');
    const keyValidation = validateAllKeys();
    
    if (keyValidation.allValid) {
      result.addCheck('api_keys', 'pass', 'All API keys are configured and valid');
    } else {
      const missingKeys = Object.entries(keyValidation.results)
        .filter(([_, r]) => !r.valid)
        .map(([name]) => name);
      
      result.addCheck(
        'api_keys',
        'warning',
        `Some API keys are missing or invalid: ${missingKeys.join(', ')}`,
        { missing: missingKeys, errors: keyValidation.errors }
      );
    }

    // ✅ 2. Check Terminal Sandbox
    logger.info('[HealthCheck] Checking Terminal Sandbox...');
    try {
      const sandbox = getTerminalSandbox();
      const stats = sandbox.getSecurityStats();
      
      if (stats && stats.resourceLimits) {
        result.addCheck('terminal_sandbox', 'pass', 'Terminal Sandbox is initialized and ready', stats);
      } else {
        result.addCheck('terminal_sandbox', 'fail', 'Terminal Sandbox is not properly initialized');
      }
    } catch (error) {
      result.addCheck('terminal_sandbox', 'fail', `Terminal Sandbox error: ${error.message}`);
    }

    // ✅ 3. Check Database Connections
    logger.info('[HealthCheck] Checking database connections...');
    try {
      // Check if database modules are available
      const { DB } = await import('../database/localDB.js');
      if (DB) {
        result.addCheck('database_local', 'pass', 'Local database (SQLite) is available');
      } else {
        result.addCheck('database_local', 'warning', 'Local database module not available');
      }
    } catch (error) {
      result.addCheck('database_local', 'warning', `Local database check failed: ${error.message}`);
    }

    // ✅ 4. Check File System
    logger.info('[HealthCheck] Checking file system...');
    try {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      const { pathToFileURL } = await import('url');
      
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      
      const requiredDirs = [
        path.join(__dirname, '../../uploads'),
        path.join(__dirname, '../../projects'),
        path.join(__dirname, '../../server/builds'),
      ];

      const dirChecks = [];
      for (const dir of requiredDirs) {
        try {
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            dirChecks.push({ dir, status: 'created' });
          } else {
            dirChecks.push({ dir, status: 'exists' });
          }
        } catch (dirError) {
          dirChecks.push({ dir, status: 'error', error: dirError.message });
        }
      }

      const hasErrors = dirChecks.some(d => d.status === 'error');
      if (!hasErrors) {
        result.addCheck('filesystem', 'pass', 'All required directories exist', dirChecks);
      } else {
        result.addCheck('filesystem', 'warning', 'Some directories had issues', dirChecks);
      }
    } catch (error) {
      result.addCheck('filesystem', 'fail', `File system check failed: ${error.message}`);
    }

    // ✅ 5. Check Environment Variables
    logger.info('[HealthCheck] Checking environment variables...');
    const requiredEnvVars = [
      'NODE_ENV',
      'PORT',
      'API_DOMAIN',
    ];

    const optionalEnvVars = [
      'OPENAI_API_KEY',
      'GEMINI_API_KEY',
      'ANTHROPIC_API_KEY',
      'ELEVENLABS_API_KEY',
      'GOOGLE_MAPS_API_KEY',
      'STRIPE_SECRET_KEY',
      'TWILIO_ACCOUNT_SID',
    ];

    const missingRequired = requiredEnvVars.filter(v => !process.env[v]);
    const missingOptional = optionalEnvVars.filter(v => !process.env[v] || process.env[v] === 'REPLACE_ME');

    if (missingRequired.length === 0) {
      result.addCheck(
        'environment',
        missingOptional.length === 0 ? 'pass' : 'warning',
        missingOptional.length === 0
          ? 'All environment variables are set'
          : `Required env vars set, but ${missingOptional.length} optional vars missing`,
        { missingOptional }
      );
    } else {
      result.addCheck(
        'environment',
        'fail',
        `Missing required environment variables: ${missingRequired.join(', ')}`,
        { missingRequired, missingOptional }
      );
    }

    // ✅ 6. Check Socket.IO Integration
    logger.info('[HealthCheck] Checking Socket.IO integration...');
    if (global.io) {
      result.addCheck('socketio', 'pass', 'Socket.IO server is initialized');
    } else {
      result.addCheck('socketio', 'warning', 'Socket.IO server not yet initialized (may be normal during startup)');
    }

  } catch (error) {
    logger.error('[HealthCheck] Health check failed:', error);
    result.addCheck('health_check', 'fail', `Health check execution failed: ${error.message}`);
  }

  result.finalize();
  return result;
}

/**
 * ✅ Get health status summary
 */
export function getHealthStatus() {
  return {
    timestamp: Date.now(),
    status: 'unknown',
    checks: {},
  };
}

export default {
  runHealthCheck,
  getHealthStatus,
  HealthCheckResult,
};






