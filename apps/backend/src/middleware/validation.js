/**
 * RARE 4N - Input Validation Middleware
 * ✅ Comprehensive validation using Zod schemas
 * ✅ Prevents injection attacks and invalid data
 */

import { z } from 'zod';

/**
 * Validation Schemas
 */
export const schemas = {
  // Chat/AI Request
  chat: z.object({
    message: z.string()
      .min(1, 'Message cannot be empty')
      .max(10000, 'Message too long (max 10000 characters)')
      .trim(),
    aiModel: z.enum(['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku', 'gemini-pro', 'gemini-1.5-pro'])
      .optional(),
    openaiModel: z.string().optional(),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().int().min(1).max(4000).optional(),
    context: z.record(z.any()).optional(),
  }),

  // Terminal Command
  terminal: z.object({
    command: z.string()
      .min(1, 'Command cannot be empty')
      .max(1000, 'Command too long (max 1000 characters)')
      .trim(),
    clientId: z.string().uuid().optional(),
    requestId: z.string().optional(),
    workingDirectory: z.string().optional(),
  }),

  // Payment Request
  payment: z.object({
    amount: z.number()
      .positive('Amount must be positive')
      .max(100000, 'Amount too large (max 100000)'),
    currency: z.enum(['aed', 'usd', 'eur', 'gbp', 'sar']).default('aed'),
    method: z.enum(['stripe', 'apple_pay']).default('stripe'),
    requestId: z.string().optional(),
    clientId: z.string().uuid().optional(),
    successUrl: z.string().url().optional(),
    cancelUrl: z.string().url().optional(),
    metadata: z.record(z.any()).optional(),
  }),

  // File Upload
  fileUpload: z.object({
    filename: z.string().min(1).max(255),
    mimeType: z.string().optional(),
    size: z.number().int().positive().max(50 * 1024 * 1024), // 50MB max
    category: z.enum(['document', 'image', 'video', 'audio', 'code', 'other']).optional(),
  }),

  // Authentication
  login: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    rememberMe: z.boolean().optional(),
  }),

  register: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().min(2).max(100),
  }),

  // Client Request
  clientRequest: z.object({
    clientName: z.string().min(2).max(100),
    clientEmail: z.string().email('Invalid email address'),
    clientPhone: z.string().optional(),
    type: z.enum(['template', 'system', 'theme', 'custom']),
    selectedItem: z.any().optional(),
    description: z.string().min(10).max(5000),
    budget: z.number().positive().optional(),
    deadline: z.string().optional(),
  }),

  // Build Request
  build: z.object({
    projectName: z.string().min(1).max(100),
    platform: z.enum(['ios', 'android', 'all']),
    profile: z.enum(['development', 'preview', 'production']).default('production'),
    requestId: z.string().optional(),
  }),

  // Voice Input
  voiceInput: z.object({
    audio: z.string().optional(), // Base64 encoded audio
    audioUri: z.string().url().optional(),
    language: z.string().length(2).optional(), // ISO 639-1 code
    dialect: z.string().optional(),
    context: z.record(z.any()).optional(),
  }),

  // Settings Update
  settings: z.object({
    theme: z.enum(['light', 'dark', 'auto']).optional(),
    language: z.string().length(2).optional(),
    notifications: z.boolean().optional(),
    aiModel: z.string().optional(),
    voiceEnabled: z.boolean().optional(),
  }),

  // Vault Operation
  vaultOperation: z.object({
    action: z.enum(['store', 'retrieve', 'delete', 'list']),
    key: z.string().min(1).max(255).optional(),
    data: z.any().optional(),
    encryption: z.boolean().optional(),
  }),
};

/**
 * Validation Middleware Factory
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {string} source - Where to validate from: 'body', 'query', 'params'
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const data = source === 'body' ? req.body : 
                   source === 'query' ? req.query : 
                   req.params;

      const result = schema.safeParse(data);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: result.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      // Replace original data with validated data
      if (source === 'body') {
        req.body = result.data;
      } else if (source === 'query') {
        req.query = result.data;
      } else {
        req.params = result.data;
      }

      next();
    } catch (error) {
      console.error('[Validation] Error:', error);
      res.status(500).json({
        success: false,
        error: 'Validation error occurred',
      });
    }
  };
}

/**
 * Sanitize string input (prevent XSS)
 */
export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject(obj) {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Sanitization Middleware
 */
export function sanitize(req, res, next) {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  next();
}

export default {
  schemas,
  validate,
  sanitize,
  sanitizeString,
  sanitizeObject,
};























