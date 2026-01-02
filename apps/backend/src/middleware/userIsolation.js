/**
 * User Isolation Middleware
 * Ensures multi-tenant data isolation
 * 
 * ✅ SECURITY: Prevents data leakage between users
 */

import jwt from 'jsonwebtoken';
import { DB } from '../database/localDB.js';

const JWT_SECRET = process.env.RARE_JWT_SECRET || '91d517e555899ffc9ffc11ad11ad70743';

/**
 * Extract user ID from request (JWT token or session)
 */
export function getUserIdFromRequest(req) {
  // Try JWT token first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded.userId;
    } catch (error) {
      // Token invalid, continue to session check
    }
  }

  // Try session token
  const sessionToken = req.headers['x-session-token'] || req.body?.sessionToken || req.query?.sessionToken;
  if (sessionToken) {
    try {
      const session = DB.sessions.findByToken(sessionToken);
      if (session) {
        return session.user_id;
      }
    } catch (error) {
      // Session invalid
    }
  }

  return null;
}

/**
 * Middleware: Verify user authentication and add userId to request
 */
export function requireAuth(req, res, next) {
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware/userIsolation.js:requireAuth',message:'Auth check started',data:{path:req.path,method:req.method},timestamp:Date.now(),sessionId:'auth-check',runId:'run1',hypothesisId:'AUTH_CHECK_START'})}).catch(()=>{});
  // #endregion
  const userId = getUserIdFromRequest(req);
  
  if (!userId) {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware/userIsolation.js:requireAuth',message:'Auth check failed',data:{path:req.path,reason:'no_user_id'},timestamp:Date.now(),sessionId:'auth-check',runId:'run1',hypothesisId:'AUTH_CHECK_FAILED'})}).catch(()=>{});
    // #endregion
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  // ✅ Add userId to request for use in routes
  req.userId = userId;
  // #region agent log
  fetch('http://127.0.0.1:7244/ingest/4c242350-3788-46f7-ada6-4565774061b0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'middleware/userIsolation.js:requireAuth',message:'Auth check passed',data:{path:req.path,userId},timestamp:Date.now(),sessionId:'auth-check',runId:'run1',hypothesisId:'AUTH_CHECK_SUCCESS'})}).catch(()=>{});
  // #endregion
  next();
}

/**
 * Middleware: Verify user owns the resource
 * @param {Function} getResourceUserId - Function to get resource owner's userId
 */
export function requireOwnership(getResourceUserId) {
  return async (req, res, next) => {
    try {
      const userId = getUserIdFromRequest(req);
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
      }

      // Get resource owner
      const resourceUserId = await getResourceUserId(req);
      
      // ✅ SECURITY: Verify ownership
      if (resourceUserId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied: You do not own this resource',
        });
      }

      req.userId = userId;
      next();
    } catch (error) {
      console.error('[UserIsolation] Error checking ownership:', error);
      res.status(500).json({
        success: false,
        error: 'Error verifying resource ownership',
      });
    }
  };
}

/**
 * Helper: Ensure query includes user_id filter
 * @param {Object} query - MongoDB/SQL query
 * @param {string} userId - User ID
 */
export function addUserFilter(query, userId) {
  if (!userId) {
    throw new Error('User ID is required for data isolation');
  }

  return {
    ...query,
    user_id: userId,
  };
}

/**
 * Helper: Verify user_id in data matches authenticated user
 * @param {Object} data - Data object
 * @param {string} userId - Authenticated user ID
 */
export function verifyUserOwnership(data, userId) {
  if (!data) {
    return false;
  }

  // Check various possible user ID fields
  const dataUserId = data.user_id || data.userId || data.owner_id || data.ownerId;
  
  if (!dataUserId) {
    // If no user_id field, assume it's a new resource and assign to current user
    return true;
  }

  // ✅ SECURITY: Verify ownership
  return dataUserId === userId;
}

/**
 * Helper: Sanitize data to remove user_id if not owner
 * @param {Object} data - Data object
 * @param {string} userId - Authenticated user ID
 */
export function sanitizeDataForUser(data, userId) {
  if (!data) {
    return null;
  }

  const dataUserId = data.user_id || data.userId || data.owner_id || data.ownerId;
  
  // ✅ SECURITY: If user doesn't own the data, return null
  if (dataUserId && dataUserId !== userId) {
    return null;
  }

  return data;
}

/**
 * Helper: Filter array of data by user ownership
 * @param {Array} dataArray - Array of data objects
 * @param {string} userId - Authenticated user ID
 */
export function filterDataByUser(dataArray, userId) {
  if (!Array.isArray(dataArray)) {
    return [];
  }

  return dataArray.filter(item => {
    const itemUserId = item.user_id || item.userId || item.owner_id || item.ownerId;
    return itemUserId === userId;
  });
}

export default {
  getUserIdFromRequest,
  requireAuth,
  requireOwnership,
  addUserFilter,
  verifyUserOwnership,
  sanitizeDataForUser,
  filterDataByUser,
};

