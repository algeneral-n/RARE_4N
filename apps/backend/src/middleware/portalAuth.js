/**
 * Portal Authentication Middleware
 * للتحقق من مفتاح الأمان للتواصل بين Portal والـ Backend
 * 
 * ✅ SECURITY: Validates X-Portal-Key header for Portal-to-Backend communication
 */

import crypto from 'crypto';

const BACKEND_API_KEY = process.env.BACKEND_API_KEY || process.env.X_PORTAL_KEY;

/**
 * Verify Portal API Key from X-Portal-Key header
 * Uses constant-time comparison to prevent timing attacks
 */
function verifyPortalKey(portalKey) {
  if (!BACKEND_API_KEY) {
    console.warn('[PortalAuth] BACKEND_API_KEY not configured - Portal authentication disabled');
    // In development, allow if key is not set (for easier testing)
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    return false;
  }

  if (!portalKey || typeof portalKey !== 'string') {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  if (portalKey.length !== BACKEND_API_KEY.length) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(
      Buffer.from(portalKey, 'utf8'),
      Buffer.from(BACKEND_API_KEY, 'utf8')
    );
  } catch (error) {
    return false;
  }
}

/**
 * Middleware: Require Portal API Key authentication
 * Validates X-Portal-Key header for Portal-to-Backend API calls
 */
export function requirePortalKey(req, res, next) {
  // Skip authentication if key is not configured (development mode)
  if (!BACKEND_API_KEY && process.env.NODE_ENV === 'development') {
    console.warn('[PortalAuth] BACKEND_API_KEY not set - allowing request in development mode');
    req.isPortalRequest = true;
    return next();
  }

  // Check X-Portal-Key header
  const portalKey = req.headers['x-portal-key'] || req.headers['X-Portal-Key'];

  if (!portalKey) {
    console.warn(`[PortalAuth] Missing X-Portal-Key header from ${req.ip}`, {
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });

    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Portal API key required',
      message: 'This endpoint requires X-Portal-Key header for authentication',
    });
  }

  if (!verifyPortalKey(portalKey)) {
    console.warn(`[PortalAuth] Invalid Portal API key from ${req.ip}`, {
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });

    return res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid Portal API key',
      message: 'The provided X-Portal-Key is invalid',
    });
  }

  // ✅ Add portal info to request
  req.isPortalRequest = true;
  req.portalAuthMethod = 'x-portal-key';

  // Log successful portal authentication (optional, can be removed in production)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[PortalAuth] Portal request authenticated`, {
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }

  next();
}

/**
 * Middleware: Optional Portal Key (allows requests with or without key)
 * Useful for endpoints that should work for both Portal and other clients
 */
export function optionalPortalKey(req, res, next) {
  const portalKey = req.headers['x-portal-key'] || req.headers['X-Portal-Key'];

  if (portalKey && BACKEND_API_KEY) {
    if (verifyPortalKey(portalKey)) {
      req.isPortalRequest = true;
      req.portalAuthMethod = 'x-portal-key';
    }
  }

  next();
}

export default {
  requirePortalKey,
  optionalPortalKey,
  verifyPortalKey,
};

