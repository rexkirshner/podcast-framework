/**
 * Utility Functions
 *
 * Shared helper functions used across pages
 */

import { DEFAULT_LOCALE } from "../config/constants";

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
 * Removes script tags, event handlers, and other potentially dangerous content
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeHTML(html: string): string {
  // Server-side sanitization (used during SSG build)
  // Remove script tags, event handlers, and javascript: protocols
  return html
    // Remove script tags and their contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove inline event handlers (onclick, onload, etc.)
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    // Remove javascript: protocols
    .replace(/javascript:/gi, '')
    // Remove data: URIs (can be used for XSS)
    .replace(/data:text\/html/gi, '');
}
