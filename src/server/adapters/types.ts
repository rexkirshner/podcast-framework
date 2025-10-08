/**
 * Universal adapter types for serverless functions
 *
 * These types abstract away provider-specific HTTP handling,
 * allowing our services to work with any platform (Netlify, Cloudflare, Vercel, etc.)
 */

/**
 * Universal HTTP request (provider-agnostic)
 */
export interface UniversalRequest {
  method: string;
  headers: Record<string, string>;
  body: string | null;
  clientIp: string;
}

/**
 * Universal HTTP response (provider-agnostic)
 */
export interface UniversalResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

/**
 * Rate limiting interface (provider-specific implementations)
 */
export interface RateLimiter {
  checkRateLimit(ip: string): Promise<boolean>;
}

/**
 * Platform adapter interface
 * Each platform (Netlify, Cloudflare, Vercel) implements this
 */
export interface PlatformAdapter {
  /**
   * Parse incoming request into universal format
   */
  parseRequest(event: any): UniversalRequest;

  /**
   * Convert universal response to platform-specific format
   */
  formatResponse(response: UniversalResponse): any;

  /**
   * Get rate limiter for this platform
   */
  getRateLimiter(): RateLimiter;

  /**
   * CORS headers for this platform
   */
  getCorsHeaders(): Record<string, string>;
}
