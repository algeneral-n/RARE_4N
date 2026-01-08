/**
 * RARE 4N - Output Sanitization Middleware
 * ✅ Prevents XSS attacks in API responses
 * ✅ Sanitizes sensitive data before sending
 */

import { sanitizeObject, sanitizeString } from './validation.js';

/**
 * List of sensitive fields to mask/remove from responses
 */
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'secret',
  'apiKey',
  'privateKey',
  'accessToken',
  'refreshToken',
  'authorization',
  'creditCard',
  'cvv',
  'ssn',
  'socialSecurityNumber',
];

/**
 * Mask sensitive values (show only last 4 characters)
 */
function maskSensitiveValue(value) {
  if (typeof value !== 'string' || value.length <= 4) {
    return '***';
  }
  return '***' + value.slice(-4);
}

/**
 * Remove sensitive fields from object recursively
 */
function removeSensitiveFields(obj, depth = 0) {
  // Prevent deep recursion
  if (depth > 10) return obj;
  
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => removeSensitiveFields(item, depth + 1));
  }
  
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      
      // Check if field is sensitive
      const isSensitive = SENSITIVE_FIELDS.some(field => 
        lowerKey.includes(field.toLowerCase())
      );
      
      if (isSensitive) {
        // Mask sensitive values instead of removing
        sanitized[key] = typeof value === 'string' 
          ? maskSensitiveValue(value)
          : '***';
      } else {
        // Recursively sanitize nested objects
        sanitized[key] = removeSensitiveFields(value, depth + 1);
      }
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Output sanitization middleware
 * Sanitizes response data before sending to client
 */
export function sanitizeOutput(req, res, next) {
  // Store original json method
  const originalJson = res.json.bind(res);
  
  // Override json method to sanitize response
  res.json = function(data) {
    try {
      // Sanitize the response data
      const sanitized = removeSensitiveFields(data);
      
      // Call original json method with sanitized data
      return originalJson(sanitized);
    } catch (error) {
      console.error('[OutputSanitization] Error:', error.message);
      // Fallback to original data if sanitization fails
      return originalJson(data);
    }
  };
  
  next();
}

/**
 * Sanitize specific fields in response
 */
export function sanitizeFields(fields) {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);
    
    res.json = function(data) {
      try {
        const sanitized = { ...data };
        
        for (const field of fields) {
          if (sanitized[field] !== undefined) {
            sanitized[field] = typeof sanitized[field] === 'string'
              ? sanitizeString(sanitized[field])
              : '***';
          }
        }
        
        return originalJson(sanitized);
      } catch (error) {
        console.error('[OutputSanitization] Error:', error.message);
        return originalJson(data);
      }
    };
    
    next();
  };
}

export default {
  sanitizeOutput,
  sanitizeFields,
  removeSensitiveFields,
  maskSensitiveValue,
};
























