/**
 * RARE 4N - Comprehensive Error Handler Middleware
 * ✅ معالجة شاملة لجميع الأخطاء في التطبيق
 * ✅ منع crashes وضمان استجابة مناسبة دائماً
 */

import logger from '../utils/logger.js';

/**
 * ✅ Error Handler Middleware
 * يجب استخدامه كآخر middleware في Express app
 */
export function errorHandler(err, req, res, next) {
  // ✅ Log error for debugging
  logger.error('[ErrorHandler]', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // ✅ Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';

  // ✅ Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: err.message,
      details: isDevelopment ? err.details : undefined,
    });
  }

  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }

  if (err.name === 'ForbiddenError' || err.status === 403) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'You do not have permission to perform this action',
    });
  }

  if (err.name === 'NotFoundError' || err.status === 404) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: err.message || 'Resource not found',
    });
  }

  // ✅ API Key errors
  if (err.message && err.message.includes('API key')) {
    return res.status(500).json({
      success: false,
      error: 'API Configuration Error',
      message: err.message,
      hint: 'Please check your API key configuration in .env file',
    });
  }

  // ✅ Database errors
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    return res.status(500).json({
      success: false,
      error: 'Database Error',
      message: isDevelopment ? err.message : 'A database error occurred',
    });
  }

  // ✅ Rate limit errors
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Rate Limit Exceeded',
      message: 'Too many requests. Please try again later.',
      retryAfter: err.retryAfter || 60,
    });
  }

  // ✅ Default error response
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: isDevelopment ? err.message : 'An unexpected error occurred',
    ...(isDevelopment && { stack: err.stack }),
  });
}

/**
 * ✅ 404 Handler - يجب أن يكون قبل errorHandler
 */
export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
}

/**
 * ✅ Async Error Wrapper
 * استخدامه لتغليف async route handlers
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * ✅ Create custom error
 */
export function createError(message, status = 500, name = 'Error') {
  const error = new Error(message);
  error.status = status;
  error.name = name;
  return error;
}

export default {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  createError,
};
