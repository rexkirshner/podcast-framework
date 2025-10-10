/**
 * Utility Functions
 *
 * Shared helper functions used across pages
 */

import { DEFAULT_LOCALE } from "../config/constants";

// Lazy import DOMPurify only when needed (browser-only)
let DOMPurify: any = null;
if (typeof window !== 'undefined') {
  import('isomorphic-dompurify').then(module => {
    DOMPurify = module.default;
  });
}

/**
 * Format a date string to human-readable format
 * @param dateString - ISO date string or any valid date format
 * @returns Formatted date like "January 15, 2024"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(DEFAULT_LOCALE, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Decode HTML entities to their corresponding characters
 * @param text - Text with HTML entities
 * @returns Text with decoded entities
 */
export function decodeHTMLEntities(text: string): string {
  // Map of common named HTML entities (e.g., &amp; → &)
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#34;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
  };

  return text
    // Replace named entities using lookup table
    .replace(/&[#\w]+;/g, (entity) => entities[entity] || entity)
    // Decode numeric HTML entities (decimal): &#39; → '
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    // Decode hexadecimal HTML entities: &#x27; → '
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
}

/**
 * Remove HTML tags from a string and decode HTML entities
 * @param html - HTML string to strip
 * @returns Plain text without HTML tags and with decoded entities
 */
export function stripHTML(html: string): string {
  const withoutTags = html.replace(/<[^>]*>/g, "");
  return decodeHTMLEntities(withoutTags).trim();
}

/**
 * Sanitize HTML to prevent XSS attacks while preserving safe formatting
 * Uses DOMPurify for robust, production-grade HTML sanitization (client-side only)
 * For server-side rendering, falls back to simple tag stripping
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeHTML(html: string): string {
  // Server-side: use simple tag filtering as fallback
  if (typeof window === 'undefined' || !DOMPurify) {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '');
  }

  // Client-side: Use DOMPurify for comprehensive XSS protection
  // Configured to allow basic formatting while blocking scripts and dangerous attributes
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    KEEP_CONTENT: true,
  });
}
