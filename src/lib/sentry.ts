/**
 * Sentry Error Monitoring Configuration
 *
 * Centralized error tracking for production issues.
 * Only initializes in production to avoid noise during development.
 */

import * as Sentry from '@sentry/node';

let sentryInitialized = false;

/**
 * Initialize Sentry for server-side error tracking
 *
 * Environment variables required:
 * - SENTRY_DSN: Your Sentry project DSN
 * - NODE_ENV: Set to 'production' to enable Sentry
 */
export function initSentry() {
  // Only initialize once
  if (sentryInitialized) {
    return;
  }

  // Only initialize in production
  const isProduction = process.env.NODE_ENV === 'production';
  const sentryDsn = process.env.SENTRY_DSN;

  if (!isProduction) {
    console.log('Sentry: Skipping initialization (not production)');
    return;
  }

  if (!sentryDsn) {
    console.warn('Sentry: DSN not configured. Error monitoring disabled.');
    return;
  }

  try {
    Sentry.init({
      dsn: sentryDsn,
      environment: process.env.NODE_ENV || 'production',
      tracesSampleRate: 0.1, // Sample 10% of transactions for performance monitoring

      // Don't send errors in development
      enabled: isProduction,

      // Release tracking (useful for identifying which deploy caused issues)
      release: process.env.COMMIT_REF || undefined,

      // Ignore common bot/spam errors
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        'Network request failed',
      ],

      beforeSend(event, hint) {
        // Filter out low-value errors
        const error = hint.originalException;

        if (error && typeof error === 'object' && 'message' in error) {
          const message = String(error.message);

          // Ignore rate limit errors (expected behavior)
          if (message.includes('rate limit') || message.includes('429')) {
            return null;
          }

          // Ignore validation errors (user error, not system error)
          if (message.includes('validation') || message.includes('invalid email')) {
            return null;
          }
        }

        return event;
      },
    });

    sentryInitialized = true;
    console.log('Sentry: Initialized successfully');
  } catch (error) {
    console.error('Sentry: Failed to initialize:', error);
  }
}

/**
 * Capture an exception with Sentry
 *
 * @param error - The error to capture
 * @param context - Additional context (tags, extra data, etc.)
 */
export function captureException(error: unknown, context?: {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
}) {
  if (!sentryInitialized) {
    // Fallback to console if Sentry not initialized
    console.error('Error:', error, context);
    return;
  }

  Sentry.withScope((scope) => {
    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      Object.entries(context.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }

    if (context?.level) {
      scope.setLevel(context.level);
    }

    Sentry.captureException(error);
  });
}

/**
 * Capture a message with Sentry
 *
 * @param message - The message to capture
 * @param level - Severity level
 */
export function captureMessage(message: string, level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info') {
  if (!sentryInitialized) {
    console.log(`[${level}]`, message);
    return;
  }

  Sentry.captureMessage(message, level);
}
