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
function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#34;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
  };

  return text
    .replace(/&[#\w]+;/g, (entity) => entities[entity] || entity)
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
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
