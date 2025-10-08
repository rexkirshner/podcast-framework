import type { PlatformAdapter, UniversalRequest, UniversalResponse, RateLimiter } from './types';
import { Redis } from '@upstash/redis/cloudflare';

/**
 * Cloudflare Workers adapter
 *
 * Adapts Cloudflare Workers Request/Response to our universal format
 * Uses Upstash Redis for distributed rate limiting
 */

/**
 * Cloudflare-specific rate limiter using Upstash Redis
 */
export class CloudflareRateLimiter implements RateLimiter {
  private redis: Redis;
  private maxRequests: number;
  private windowMs: number;

  constructor(
    upstashRedisRestUrl: string,
    upstashRedisRestToken: string,
    maxRequests: number = 5,
    windowMs: number = 60000
  ) {
    this.redis = new Redis({
      url: upstashRedisRestUrl,
      token: upstashRedisRestToken,
    });
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async checkRateLimit(ip: string): Promise<boolean> {
    const key = `rate_limit:${ip}`;
    const now = Date.now();
    const windowStart = now - this.windowMs;

    try {
      // Use Redis sorted set for sliding window rate limiting
      // Remove old entries
      await this.redis.zremrangebyscore(key, 0, windowStart);

      // Count requests in current window
      const count = await this.redis.zcard(key);

      if (count >= this.maxRequests) {
        return false; // Rate limit exceeded
      }

      // Add current request
      await this.redis.zadd(key, { score: now, member: `${now}` });

      // Set expiry on the key
      await this.redis.expire(key, Math.ceil(this.windowMs / 1000));

      return true;
    } catch (error) {
      console.error('Rate limit check failed:', error);
      // On error, allow the request (fail open)
      return true;
    }
  }
}

/**
 * Cloudflare Workers platform adapter
 */
export class CloudflareAdapter implements PlatformAdapter {
  private allowedOrigin: string;
  private rateLimiter: RateLimiter;

  constructor(
    allowedOrigin: string,
    upstashRedisRestUrl?: string,
    upstashRedisRestToken?: string,
    maxRequests?: number,
    windowMs?: number
  ) {
    this.allowedOrigin = allowedOrigin;

    // Initialize rate limiter if Redis credentials provided
    if (upstashRedisRestUrl && upstashRedisRestToken) {
      this.rateLimiter = new CloudflareRateLimiter(
        upstashRedisRestUrl,
        upstashRedisRestToken,
        maxRequests,
        windowMs
      );
    } else {
      // Fallback: always allow (no rate limiting)
      this.rateLimiter = {
        checkRateLimit: async () => true,
      };
      console.warn('Upstash Redis not configured - rate limiting disabled');
    }
  }

  parseRequest(request: Request): UniversalRequest {
    // Extract headers as Record<string, string>
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    // Extract client IP from Cloudflare headers
    const clientIp = headers['cf-connecting-ip'] || headers['x-forwarded-for'] || 'unknown';

    return {
      method: request.method,
      headers,
      body: null, // Will be populated by the handler after reading the stream
      clientIp,
    };
  }

  formatResponse(response: UniversalResponse): Response {
    return new Response(response.body, {
      status: response.statusCode,
      headers: response.headers,
    });
  }

  getRateLimiter(): RateLimiter {
    return this.rateLimiter;
  }

  getCorsHeaders(): Record<string, string> {
    return {
      'Access-Control-Allow-Origin': this.allowedOrigin,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
  }
}

/**
 * Environment interface for Cloudflare Workers
 */
export interface CloudflareEnv {
  // Sanity
  SANITY_PROJECT_ID: string;
  SANITY_DATASET: string;
  SANITY_API_TOKEN: string;

  // Resend
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  NOTIFICATION_EMAIL: string;

  // Upstash Redis (for rate limiting)
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;

  // Optional
  ALLOWED_ORIGIN?: string;
  STUDIO_URL?: string;
}
