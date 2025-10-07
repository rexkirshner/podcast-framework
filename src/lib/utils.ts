/**
 * Utility Functions
 *
 * Shared helper functions used across pages
 */

/**
 * Format a date string to human-readable format
 * @param dateString - ISO date string or any valid date format
 * @returns Formatted date like "January 15, 2024"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
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
    .replace(/&[#\w]+;/g, (entity) => entities[entity] || entity)
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
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
 * Uses DOMPurify to clean potentially dangerous HTML
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeHTML(html: string): string {
  // Import DOMPurify dynamically for SSR compatibility
  if (typeof window !== 'undefined') {
    // Client-side: use DOMPurify
    const DOMPurify = require('isomorphic-dompurify');
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      ALLOW_DATA_ATTR: false,
    });
  }

  // Server-side (SSG): basic sanitization fallback
  // Remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    .replace(/javascript:/gi, '');
}
