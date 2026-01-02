/**
 * RARE 4N - Comprehensive Input Validation Middleware
 * ✅ التحقق الشامل من جميع المدخلات قبل المعالجة
 * ✅ منع injection attacks و invalid data
 */

/**
 * ✅ Validate request body structure
 */
export function validateBody(schema) {
  return (req, res, next) => {
    try {
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Invalid request body',
          message: 'Request body must be a valid JSON object',
        });
      }

      // Validate against schema
      const errors = [];
      
      for (const [field, rules] of Object.entries(schema)) {
        const value = req.body[field];
        const isRequired = rules.required !== false;
        
        // Check required fields
        if (isRequired && (value === undefined || value === null || value === '')) {
          errors.push({
            field,
            message: `${field} is required`,
          });
          continue;
        }

        // Skip validation if field is optional and not provided
        if (!isRequired && (value === undefined || value === null)) {
          continue;
        }

        // Type validation
        if (rules.type && value !== undefined && value !== null) {
          const actualType = Array.isArray(value) ? 'array' : typeof value;
          if (actualType !== rules.type) {
            errors.push({
              field,
              message: `${field} must be of type ${rules.type}, got ${actualType}`,
            });
            continue;
          }
        }

        // String validations
        if (rules.type === 'string' && typeof value === 'string') {
          if (rules.minLength && value.length < rules.minLength) {
            errors.push({
              field,
              message: `${field} must be at least ${rules.minLength} characters`,
            });
          }
          
          if (rules.maxLength && value.length > rules.maxLength) {
            errors.push({
              field,
              message: `${field} must be at most ${rules.maxLength} characters`,
            });
          }
          
          if (rules.pattern && !rules.pattern.test(value)) {
            errors.push({
              field,
              message: `${field} format is invalid`,
            });
          }
          
          // Sanitize string inputs
          if (rules.sanitize !== false) {
            req.body[field] = sanitizeString(value);
          }
        }

        // Number validations
        if (rules.type === 'number' && typeof value === 'number') {
          if (rules.min !== undefined && value < rules.min) {
            errors.push({
              field,
              message: `${field} must be at least ${rules.min}`,
            });
          }
          
          if (rules.max !== undefined && value > rules.max) {
            errors.push({
              field,
              message: `${field} must be at most ${rules.max}`,
            });
          }
        }

        // Array validations
        if (rules.type === 'array' && Array.isArray(value)) {
          if (rules.minItems && value.length < rules.minItems) {
            errors.push({
              field,
              message: `${field} must have at least ${rules.minItems} items`,
            });
          }
          
          if (rules.maxItems && value.length > rules.maxItems) {
            errors.push({
              field,
              message: `${field} must have at most ${rules.maxItems} items`,
            });
          }
        }

        // Enum validation
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push({
            field,
            message: `${field} must be one of: ${rules.enum.join(', ')}`,
          });
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          errors,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Validation Error',
        message: error.message,
      });
    }
  };
}

/**
 * ✅ Sanitize string input
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  
  // Remove null bytes
  let sanitized = str.replace(/\0/g, '');
  
  // Remove control characters (except newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * ✅ Validate email format
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * ✅ Validate phone number format
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  // Allow international format: +971501234567 or local: 0501234567
  const phoneRegex = /^(\+?971|0)?[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

/**
 * ✅ Validate project name (safe for file system)
 */
export function validateProjectName(name) {
  if (!name || typeof name !== 'string') return false;
  // Only allow alphanumeric, underscore, and hyphen
  const projectNameRegex = /^[a-zA-Z0-9_-]+$/;
  return projectNameRegex.test(name) && name.length >= 1 && name.length <= 50;
}

/**
 * ✅ Common validation schemas
 */
export const schemas = {
  terminal: {
    command: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 1000,
      sanitize: true,
    },
    clientId: {
      type: 'string',
      required: false,
    },
    requestId: {
      type: 'string',
      required: false,
    },
  },
  
  build: {
    projectName: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 50,
      pattern: /^[a-zA-Z0-9_-]+$/,
      sanitize: true,
    },
    platforms: {
      type: 'string',
      required: false,
      enum: ['ios', 'android', 'web', 'hybrid', 'ios,android', 'ios,web', 'android,web', 'ios,android,web'],
    },
    email: {
      type: 'string',
      required: false,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      type: 'string',
      required: false,
    },
    projectType: {
      type: 'string',
      required: false,
      enum: ['react-native', 'expo', 'web', 'hybrid'],
    },
  },
  
  codegen: {
    prompt: {
      type: 'string',
      required: true,
      minLength: 1,
      maxLength: 5000,
      sanitize: true,
    },
    language: {
      type: 'string',
      required: false,
      enum: ['typescript', 'javascript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'dart', 'html', 'css'],
    },
    extension: {
      type: 'string',
      required: false,
      maxLength: 10,
    },
  },
  
  clientRegister: {
    name: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 100,
      sanitize: true,
    },
    email: {
      type: 'string',
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      type: 'string',
      required: true,
    },
  },
};

export default {
  validateBody,
  validateEmail,
  validatePhone,
  validateProjectName,
  schemas,
};






