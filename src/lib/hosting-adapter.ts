/**
 * Hosting Platform Adapter
 *
 * Abstracts platform-specific differences between Netlify, Cloudflare, Vercel, etc.
 * Use these utilities instead of directly accessing environment variables or
 * platform-specific APIs.
 */

import type { APIContext } from 'astro';

export type HostingPlatform = 'cloudflare' | 'netlify' | 'vercel' | 'local' | 'unknown';

/**
 * Detect which hosting platform we're running on
 */
export function detectPlatform(context?: APIContext): HostingPlatform {
  // Check Cloudflare-specific indicators
  if (typeof (globalThis as any).caches !== 'undefined') {
    return 'cloudflare';
  }

  // Check environment variables
  const env = getEnvironmentVariables(context);

  if (env.CF_PAGES === '1' || env.CF_PAGES_BRANCH) {
    return 'cloudflare';
  }

  if (env.NETLIFY === 'true' || env.NETLIFY_DEV === 'true') {
    return 'netlify';
  }

  if (env.VERCEL === '1' || env.VERCEL_ENV) {
    return 'vercel';
  }

  if (env.NODE_ENV === 'development') {
    return 'local';
  }

  return 'unknown';
}

/**
 * Get environment variables in a platform-agnostic way
 *
 * @param context - Astro API context (optional, but required for Cloudflare)
 * @returns Environment variables object
 */
export function getEnvironmentVariables(context?: APIContext): Record<string, string> {
  // Cloudflare Pages Functions: env vars are in locals.runtime.env
  if (context?.locals && (context.locals as any).runtime?.env) {
    return (context.locals as any).runtime.env;
  }

  // Netlify, Vercel, Local: env vars are in import.meta.env or process.env
  if (typeof import.meta.env !== 'undefined') {
    return import.meta.env as any;
  }

  if (typeof process !== 'undefined' && process.env) {
    return process.env as any;
  }

  console.warn('[hosting-adapter] Unable to access environment variables');
  return {};
}

/**
 * Get a specific environment variable with fallback
 *
 * @param key - Environment variable name
 * @param context - Astro API context (optional, but required for Cloudflare)
 * @param fallback - Default value if not found
 * @returns Environment variable value or fallback
 */
export function getEnv(key: string, context?: APIContext, fallback?: string): string {
  const env = getEnvironmentVariables(context);
  return env[key] || fallback || '';
}

/**
 * Get all required environment variables with validation
 *
 * @param keys - Array of required environment variable names
 * @param context - Astro API context (optional, but required for Cloudflare)
 * @throws Error if any required variables are missing
 * @returns Object with all environment variables
 */
export function getRequiredEnv(
  keys: string[],
  context?: APIContext
): Record<string, string> {
  const env = getEnvironmentVariables(context);
  const missing: string[] = [];
  const result: Record<string, string> = {};

  for (const key of keys) {
    if (!env[key]) {
      missing.push(key);
    } else {
      result[key] = env[key];
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  return result;
}

/**
 * Platform-specific client IP address
 *
 * @param context - Astro API context
 * @returns Client IP address
 */
export function getClientIP(context: APIContext): string {
  const { request, clientAddress } = context;

  // Cloudflare-specific headers
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Netlify, Vercel, general proxies
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  // Astro's built-in clientAddress
  return clientAddress || 'unknown';
}

/**
 * Platform-specific request context information
 *
 * @param context - Astro API context
 * @returns Platform information
 */
export function getPlatformInfo(context?: APIContext) {
  const platform = detectPlatform(context);
  const env = getEnvironmentVariables(context);

  return {
    platform,
    isDevelopment: platform === 'local' || env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    region: env.CF_PAGES_BRANCH || env.VERCEL_REGION || env.AWS_REGION || 'unknown',
    deploymentId: env.CF_PAGES_COMMIT_SHA || env.VERCEL_GIT_COMMIT_SHA || env.COMMIT_REF || 'unknown',
  };
}

/**
 * Platform-specific error logging
 *
 * @param error - Error to log
 * @param context - Additional context
 * @param apiContext - Astro API context
 */
export function logError(
  error: unknown,
  context?: Record<string, any>,
  apiContext?: APIContext
) {
  const platform = detectPlatform(apiContext);
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  const logData = {
    platform,
    error: errorMessage,
    stack: errorStack,
    ...context,
  };

  // Use platform-specific logging if available
  if (platform === 'cloudflare') {
    // Cloudflare Workers: console.error is captured in logs
    console.error('[Error]', JSON.stringify(logData, null, 2));
  } else if (platform === 'netlify') {
    // Netlify: console.error is captured in function logs
    console.error('[Error]', JSON.stringify(logData, null, 2));
  } else {
    // Default: structured console logging
    console.error('[Error]', logData);
  }
}

/**
 * Example: Get environment variables for a service
 *
 * Usage in API routes:
 * ```typescript
 * import { getEnvironmentVariables } from '@/lib/hosting-adapter';
 *
 * export const POST: APIRoute = async (context) => {
 *   const env = getEnvironmentVariables(context);
 *
 *   const service = new MyService({
 *     apiKey: env.API_KEY,
 *     endpoint: env.API_ENDPOINT,
 *   });
 * };
 * ```
 */
export function getServiceConfig(context?: APIContext) {
  const env = getEnvironmentVariables(context);

  return {
    sanity: {
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET,
      apiToken: env.SANITY_API_TOKEN,
      apiVersion: '2024-01-01',
    },
    email: {
      resendApiKey: env.RESEND_API_KEY,
      fromEmail: env.RESEND_FROM_EMAIL || 'contribution@noreply.strangewater.xyz',
      notificationEmail: env.NOTIFICATION_EMAIL || 'swrequests@rexkirshner.com',
    },
    analytics: {
      gaMeasurementId: env.PUBLIC_GA_MEASUREMENT_ID,
    },
    redis: {
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    },
  };
}
