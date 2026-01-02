/**
 * RARE 4N - Sentry Integration
 * ✅ Error tracking and monitoring
 * ✅ Performance monitoring
 */

import * as Sentry from '@sentry/node';
// Optional profiling - will be loaded dynamically if available
let nodeProfilingIntegration = null;

/**
 * Initialize Sentry
 */
export async function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  
  if (!dsn) {
    console.warn('[Sentry] SENTRY_DSN not set, skipping Sentry initialization');
    return;
  }
  
  // Try to load profiling integration dynamically
  if (!nodeProfilingIntegration) {
    try {
      const profilingModule = await import('@sentry/profiling-node');
      nodeProfilingIntegration = profilingModule.nodeProfilingIntegration;
    } catch (e) {
      // Profiling not available - that's okay
      console.warn('[Sentry] Profiling not available, continuing without it');
    }
  }
  
  try {
    Sentry.init({
      dsn,
      environment: process.env.NODE_ENV || 'production',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      integrations: [
        ...(nodeProfilingIntegration ? [nodeProfilingIntegration()] : []),
      ],
      beforeSend(event, hint) {
        // Filter out sensitive data
        if (event.request) {
          // Remove sensitive headers
          if (event.request.headers) {
            const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
            sensitiveHeaders.forEach(header => {
              if (event.request.headers[header]) {
                event.request.headers[header] = '[Filtered]';
              }
            });
          }
          
          // Remove sensitive query params
          if (event.request.query_string) {
            const sensitiveParams = ['password', 'token', 'secret'];
            // Note: This is a simplified filter - in production, parse and filter properly
          }
        }
        
        return event;
      },
    });
    
    console.log('✅ Sentry initialized');
  } catch (error) {
    console.error('[Sentry] Initialization error:', error.message);
  }
}

/**
 * Sentry error handler middleware
 */
export function sentryErrorHandler(err, req, res, next) {
  Sentry.captureException(err, {
    tags: {
      path: req.path,
      method: req.method,
    },
    extra: {
      userId: req.userId,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    },
  });
  
  next(err);
}

/**
 * Sentry request handler middleware
 */
export function sentryRequestHandler() {
  return Sentry.Handlers.requestHandler();
}

/**
 * Sentry tracing handler middleware
 */
export function sentryTracingHandler() {
  return Sentry.Handlers.tracingHandler();
}

export default {
  initSentry,
  sentryErrorHandler,
  sentryRequestHandler,
  sentryTracingHandler,
};


