import { describe, it, expect } from 'vitest';
import { formatDate, stripHTML, decodeHTMLEntities, sanitizeHTML } from './utils';

describe('formatDate', () => {
  it('should format date in MMMM DD, YYYY format', () => {
    // Use noon to avoid timezone issues
    const date = '2024-01-15T12:00:00Z';
    const result = formatDate(date);
    expect(result).toBe('January 15, 2024');
  });

  it('should handle different months', () => {
    expect(formatDate('2024-06-30T12:00:00Z')).toBe('June 30, 2024');
    expect(formatDate('2024-12-25T12:00:00Z')).toBe('December 25, 2024');
  });

  it('should handle single-digit days', () => {
    expect(formatDate('2024-03-05T12:00:00Z')).toBe('March 5, 2024');
  });

  it('should handle edge case dates', () => {
    expect(formatDate('2024-02-29T12:00:00Z')).toBe('February 29, 2024'); // Leap year
    expect(formatDate('2024-01-01T12:00:00Z')).toBe('January 1, 2024');
    expect(formatDate('2024-12-31T12:00:00Z')).toBe('December 31, 2024');
  });

  it('should handle ISO datetime strings', () => {
    expect(formatDate('2024-01-15T10:30:00Z')).toMatch(/January 1[45], 2024/); // Could be 14 or 15 depending on timezone
  });
});

describe('stripHTML', () => {
  it('should remove HTML tags', () => {
    const html = '<p>Hello World</p>';
    const result = stripHTML(html);
    expect(result).toBe('Hello World');
  });

  it('should remove multiple tags', () => {
    const html = '<div><p>Hello</p> <strong>World</strong></div>';
    const result = stripHTML(html);
    expect(result).toBe('Hello World');
  });

  it('should decode HTML entities', () => {
    const html = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
    const result = stripHTML(html);
    expect(result).toBe('<script>alert("xss")</script>');
  });

  it('should handle mixed HTML and entities', () => {
    const html = '<p>Hello &amp; Welcome</p>';
    const result = stripHTML(html);
    expect(result).toBe('Hello & Welcome');
  });

  it('should handle empty string', () => {
    expect(stripHTML('')).toBe('');
  });

  it('should handle string with no HTML', () => {
    const text = 'Plain text';
    expect(stripHTML(text)).toBe('Plain text');
  });

  it('should handle nested tags', () => {
    const html = '<div><p><strong><em>Text</em></strong></p></div>';
    const result = stripHTML(html);
    expect(result).toBe('Text');
  });

  it('should handle self-closing tags', () => {
    const html = 'Line 1<br/>Line 2<hr/>Line 3';
    const result = stripHTML(html);
    expect(result).toBe('Line 1Line 2Line 3');
  });

  it('should handle malformed HTML gracefully', () => {
    const html = '<p>Unclosed paragraph';
    const result = stripHTML(html);
    expect(result).toBe('Unclosed paragraph');
  });

  it('should preserve whitespace between words', () => {
    const html = '<p>Hello</p> <p>World</p>';
    const result = stripHTML(html);
    expect(result).toBe('Hello World');
  });

  it('should handle common HTML entities', () => {
    const html = '&nbsp;&copy;&reg;&trade;';
    const result = stripHTML(html);
    expect(result).toContain('©'); // Copyright symbol
    expect(result).toContain('®'); // Registered symbol
    expect(result).toContain('™'); // Trademark symbol
  });
});

describe('decodeHTMLEntities', () => {
  it('should decode common HTML entities', () => {
    expect(decodeHTMLEntities('&amp;')).toBe('&');
    expect(decodeHTMLEntities('&lt;')).toBe('<');
    expect(decodeHTMLEntities('&gt;')).toBe('>');
    expect(decodeHTMLEntities('&quot;')).toBe('"');
    expect(decodeHTMLEntities('&#39;')).toBe("'");
  });

  it('should decode multiple entities in one string', () => {
    const text = 'Tom &amp; Jerry &lt;3 &quot;cheese&quot;';
    const result = decodeHTMLEntities(text);
    expect(result).toBe('Tom & Jerry <3 "cheese"');
  });

  it('should handle numeric character references', () => {
    expect(decodeHTMLEntities('&#169;')).toBe('©'); // Copyright
    expect(decodeHTMLEntities('&#8364;')).toBe('€'); // Euro
  });

  it('should handle hex character references', () => {
    expect(decodeHTMLEntities('&#x00A9;')).toBe('©'); // Copyright in hex
  });

  it('should handle empty string', () => {
    expect(decodeHTMLEntities('')).toBe('');
  });

  it('should handle string with no entities', () => {
    const text = 'Plain text';
    expect(decodeHTMLEntities(text)).toBe('Plain text');
  });

  it('should handle special characters', () => {
    expect(decodeHTMLEntities('&nbsp;')).toBeTruthy(); // Non-breaking space
    expect(decodeHTMLEntities('&copy;')).toBe('©');
    expect(decodeHTMLEntities('&reg;')).toBe('®');
    expect(decodeHTMLEntities('&trade;')).toBe('™');
  });

  it('should not break on malformed entities', () => {
    const text = '&notarealentity; &amp;';
    const result = decodeHTMLEntities(text);
    expect(result).toContain('&'); // Should decode the valid one
  });
});

describe('sanitizeHTML', () => {
  it('should remove script tags and their contents', () => {
    const malicious = '<p>Hello</p><script>alert("XSS")</script><p>World</p>';
    const result = sanitizeHTML(malicious);
    expect(result).not.toContain('<script');
    expect(result).not.toContain('alert');
    expect(result).toContain('<p>Hello</p>');
    expect(result).toContain('<p>World</p>');
  });

  it('should remove inline event handlers (onclick)', () => {
    const malicious = '<div onclick="alert(\'XSS\')">Click me</div>';
    const result = sanitizeHTML(malicious);
    expect(result).not.toContain('onclick');
    expect(result).toContain('Click me'); // Event handler removed, content preserved
  });

  it('should remove inline event handlers (onload)', () => {
    const malicious = '<img src="x" onload="alert(\'XSS\')" />';
    const result = sanitizeHTML(malicious);
    expect(result).not.toContain('onload');
    expect(result).toContain('<img src="x"');
  });

  it('should remove javascript: protocols', () => {
    const malicious = '<a href="javascript:alert(\'XSS\')">Click</a>';
    const result = sanitizeHTML(malicious);
    expect(result).not.toContain('javascript:');
  });

  it('should remove data:text/html URIs', () => {
    const malicious = '<iframe src="data:text/html,<script>alert(\'XSS\')</script>"></iframe>';
    const result = sanitizeHTML(malicious);
    expect(result).not.toContain('data:text/html');
  });

  it('should preserve safe HTML formatting', () => {
    const safe = '<p>Hello <strong>World</strong></p><ul><li>Item 1</li></ul>';
    const result = sanitizeHTML(safe);
    expect(result).toBe(safe); // Should be unchanged
  });

  it('should handle multiple attack vectors in one string', () => {
    const malicious = '<p onclick="evil()">Text</p><script>alert("XSS")</script><a href="javascript:void(0)">Link</a>';
    const result = sanitizeHTML(malicious);
    expect(result).not.toContain('onclick');
    expect(result).not.toContain('<script');
    expect(result).not.toContain('javascript:');
    expect(result).toContain('Text'); // onclick removed, content preserved
    expect(result).toContain('Link'); // javascript: protocol removed
  });

  it('should handle empty string', () => {
    expect(sanitizeHTML('')).toBe('');
  });

  it('should handle string with no HTML', () => {
    const text = 'Plain text';
    expect(sanitizeHTML(text)).toBe('Plain text');
  });

  it('should prevent XSS in email generation context', () => {
    const userInput = '<img src=x onerror="alert(\'XSS\')">';
    const result = sanitizeHTML(userInput);
    expect(result).not.toContain('onerror');
    expect(result).not.toContain('alert');
  });

  it('should handle case-insensitive javascript protocol', () => {
    const malicious1 = '<a href="JavaScript:alert(\'XSS\')">Link</a>';
    const malicious2 = '<a href="JAVASCRIPT:alert(\'XSS\')">Link</a>';
    expect(sanitizeHTML(malicious1)).not.toContain('JavaScript:');
    expect(sanitizeHTML(malicious2)).not.toContain('JAVASCRIPT:');
  });

  it('should handle nested script tags', () => {
    const malicious = '<script><script>alert("XSS")</script></script>';
    const result = sanitizeHTML(malicious);
    expect(result).not.toContain('<script');
    expect(result).not.toContain('alert');
  });
});

describe('Integration tests', () => {
  it('stripHTML should decode entities after removing tags', () => {
    const html = '<p>Hello &amp; <strong>Welcome</strong> &lt;3</p>';
    const result = stripHTML(html);
    expect(result).toBe('Hello & Welcome <3');
  });

  it('should handle real-world podcast description', () => {
    const description = '<p>In this episode, we discuss <strong>Ethereum</strong> &amp; <em>Web3</em>. Learn more at <a href="https://example.com">our website</a>.</p>';
    const result = stripHTML(description);
    expect(result).toBe('In this episode, we discuss Ethereum & Web3. Learn more at our website.');
  });

  it('should handle complex nested structure with entities', () => {
    const html = '<div class="content"><h1>Title &amp; Subtitle</h1><p>Content with &lt;code&gt; and &quot;quotes&quot;</p></div>';
    const result = stripHTML(html);
    expect(result).toBe('Title & SubtitleContent with <code> and "quotes"');
  });

  it('sanitizeHTML should protect against real-world XSS attacks', () => {
    const userSubmission = {
      name: '<script>steal_cookies()</script>John Doe',
      email: 'test@example.com',
      message: '<img src=x onerror="phishing_attack()">Hello!',
    };

    // Simulate email generation like in contribute.ts
    const safeEmail = `
      <p>Name: ${sanitizeHTML(userSubmission.name)}</p>
      <p>Email: ${sanitizeHTML(userSubmission.email)}</p>
      <p>Message: ${sanitizeHTML(userSubmission.message)}</p>
    `;

    expect(safeEmail).not.toContain('<script');
    expect(safeEmail).not.toContain('onerror');
    expect(safeEmail).not.toContain('steal_cookies');
    expect(safeEmail).not.toContain('phishing_attack');
    expect(safeEmail).toContain('John Doe');
    expect(safeEmail).toContain('test@example.com');
    expect(safeEmail).toContain('Hello!');
  });
});
