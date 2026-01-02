/**
 * Admin Authentication Middleware
 * For critical system operations (Kill Switch, etc.)
 * 
 * ✅ SECURITY: Multi-layer authentication for admin operations
 */

import jwt from 'jsonwebtoken';
import { DB } from '../database/localDB.js';
import crypto from 'crypto';

const JWT_SECRET = process.env.RARE_JWT_SECRET || process.env.JWT_SECRET || '91d517e555899ffc9ffc11ad11ad70743';
const ADMIN_KILL_SWITCH_KEY = process.env.ADMIN_KILL_SWITCH_KEY || 'RARE4N-EMERGENCY-KILL-SWITCH-2024';

// Admin user IDs (can be configured via env)
const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || 'family_user').split(',').map(id => id.trim());

/**
 * Check if user is admin
 */
function isAdminUser(userId) {
  if (!userId) return false;
  
  // Check if user ID is in admin list
  if (ADMIN_USER_IDS.includes(userId)) {
    return true;
  }
  
  // Check user in database (if has admin role)
  try {
    const user = DB.users.findById(userId);
    if (user && user.role === 'admin') {
      return true;
    }
  } catch (error) {
    // User not found or error
  }
  
  return false;
}

/**
 * Verify admin key from request body
 */
function verifyAdminKey(adminKey) {
  if (!adminKey || typeof adminKey !== 'string') return false;
  
  // Constant-time comparison to prevent timing attacks
  if (adminKey.length !== ADMIN_KILL_SWITCH_KEY.length) {
    return false;
  }
  
  try {
    return crypto.timingSafeEqual(
      Buffer.from(adminKey, 'utf8'),
      Buffer.from(ADMIN_KILL_SWITCH_KEY, 'utf8')
    );
  } catch (error) {
    return false;
  }
}

/**
 * Middleware: Require admin authentication
 * Supports multiple methods:
 * 1. JWT token with admin user
 * 2. Admin key in request body
 * 3. Admin key in Authorization header
 */
export function requireAdmin(req, res, next) {
  let authenticated = false;
  let authMethod = null;
  let userId = null;

  // Method 1: JWT Token (preferred)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
      
      if (isAdminUser(userId)) {
        authenticated = true;
        authMethod = 'jwt';
      }
    } catch (error) {
      // Token invalid, continue to other methods
    }
  }

  // Method 2: Admin key in request body
  if (!authenticated && req.body?.adminKey) {
    if (verifyAdminKey(req.body.adminKey)) {
      authenticated = true;
      authMethod = 'admin_key_body';
    }
  }

  // Method 3: Admin key in Authorization header (X-Admin-Key)
  if (!authenticated && req.headers['x-admin-key']) {
    if (verifyAdminKey(req.headers['x-admin-key'])) {
      authenticated = true;
      authMethod = 'admin_key_header';
    }
  }

  // Method 4: Admin key in query parameter (less secure, but useful for testing)
  if (!authenticated && req.query?.adminKey && process.env.NODE_ENV === 'development') {
    if (verifyAdminKey(req.query.adminKey)) {
      authenticated = true;
      authMethod = 'admin_key_query';
    }
  }

  if (!authenticated) {
    // Log failed attempt
    console.warn(`[AdminAuth] Unauthorized admin access attempt from ${req.ip}`, {
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });

    return res.status(403).json({
      success: false,
      error: 'Unauthorized: Admin access required',
      message: 'This operation requires administrator privileges',
    });
  }

  // ✅ Add admin info to request
  req.isAdmin = true;
  req.adminUserId = userId;
  req.authMethod = authMethod;

  // Log successful admin access
  console.log(`[AdminAuth] Admin access granted via ${authMethod}`, {
    userId: userId || 'admin_key',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  next();
}

/**
 * Middleware: Require admin OR allow with admin key
 * Less strict - allows admin key without full JWT
 */
export function requireAdminOrKey(req, res, next) {
  let authenticated = false;
  let authMethod = null;

  // Check admin key first (simpler)
  const adminKey = req.body?.adminKey || req.headers['x-admin-key'] || req.query?.adminKey;
  if (adminKey && verifyAdminKey(adminKey)) {
    authenticated = true;
    authMethod = 'admin_key';
  }

  // Check JWT admin
  if (!authenticated) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, JWT_SECRET);
        if (isAdminUser(decoded.userId)) {
          authenticated = true;
          authMethod = 'jwt_admin';
        }
      } catch (error) {
        // Token invalid
      }
    }
  }

  if (!authenticated) {
    return res.status(403).json({
      success: false,
      error: 'Unauthorized: Admin access required',
    });
  }

  req.isAdmin = true;
  req.authMethod = authMethod;
  next();
}

export default {
  requireAdmin,
  requireAdminOrKey,
  isAdminUser,
  verifyAdminKey,
};

