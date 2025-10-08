import { sanityClient } from './sanity';
import { captureException } from './sentry';

// ============================================================================
// Build-Time Cache for Theme
// ============================================================================
// Theme is fetched on every page during builds. Cache it to avoid redundant calls.
// ============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const themeCache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 60 * 1000; // 1 minute

async function cachedThemeFetch<T>(cacheKey: string, fetchFn: () => Promise<T>): Promise<T> {
  const isBuild = import.meta.env.MODE === 'production';

  if (!isBuild) {
    return fetchFn();
  }

  const cached = themeCache.get(cacheKey);
  const now = Date.now();

  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetchFn();
  themeCache.set(cacheKey, { data, timestamp: now });

  return data;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  headerBackground: string;
  footerBackground: string;
  headerText: string;
  footerText: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  googleFonts: string[];
}

export interface ThemeLayout {
  maxWidth: string;
  borderRadius: string;
}

export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  layout: ThemeLayout;
}

/**
 * Fetch theme configuration from Sanity
 * Gets the active theme, or falls back to the first theme if none are active
 * Returns null on error (caller should use defaultTheme fallback)
 * Cached during builds to avoid redundant API calls
 */
export async function getTheme(): Promise<Theme | null> {
  return cachedThemeFetch('active-theme', async () => {
    try {
      const query = `*[_type == "theme" && isActive == true][0] {
        "colors": {
          "primary": colors.primary,
          "secondary": colors.secondary,
          "background": colors.background,
          "surface": colors.surface,
          "text": colors.text,
          "textMuted": colors.textMuted,
          "headerBackground": colors.headerBackground,
          "footerBackground": colors.footerBackground,
          "headerText": colors.headerText,
          "footerText": colors.footerText
        },
        typography,
        layout
      }`;

      const theme = await sanityClient.fetch(query);

      // If no theme found in CMS, return null (will use defaultTheme)
      if (!theme) {
        console.warn('No active theme found in Sanity CMS. Using default theme.');
        return null;
      }

      // Validate required fields exist
      if (!theme.colors || !theme.typography) {
        console.error('Theme missing required fields (colors or typography). Using default theme.');
        return null;
      }

      return theme;
    } catch (error) {
      captureException(error, {
        tags: { context: 'sanity', operation: 'fetch-theme' },
        level: 'warning',
      });
      console.error('Failed to fetch theme from Sanity:', error);
      return null;
    }
  });
}

/**
 * Default theme fallback (Strange Water colors)
 */
export const defaultTheme: Theme = {
  colors: {
    primary: '#3B82F6', // Blue
    secondary: '#8B5CF6', // Purple
    background: '#F9FAFB', // Light gray
    surface: '#FFFFFF', // White
    text: '#111827', // Dark gray
    textMuted: '#6B7280', // Medium gray
    headerBackground: '#000000', // Black
    footerBackground: '#000000', // Black
    headerText: '#ffffff', // White
    footerText: '#ffffff', // White
  },
  typography: {
    headingFont: 'Inter, system-ui, sans-serif',
    bodyFont: 'Inter, system-ui, sans-serif',
    googleFonts: ['Inter:400,500,600,700'],
  },
  layout: {
    maxWidth: 'max-w-7xl',
    borderRadius: 'rounded-lg',
  },
};

/**
 * Generate CSS custom properties from theme
 */
export function generateThemeCSS(theme: Theme): string {
  return `
    :root {
      /* Colors */
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-text: ${theme.colors.text};
      --color-text-muted: ${theme.colors.textMuted};
      --color-header-bg: ${theme.colors.headerBackground};
      --color-footer-bg: ${theme.colors.footerBackground};
      --color-header-text: ${theme.colors.headerText};
      --color-footer-text: ${theme.colors.footerText};

      /* Typography */
      --font-heading: ${theme.typography.headingFont};
      --font-body: ${theme.typography.bodyFont};
    }

    body {
      background-color: var(--color-background);
      color: var(--color-text);
      font-family: var(--font-body);
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
    }
  `.trim();
}

/**
 * Generate Google Fonts import URL
 */
export function getGoogleFontsURL(fonts: string[]): string {
  if (!fonts || fonts.length === 0) return '';
  const fontsParam = fonts.join('&family=');
  return `https://fonts.googleapis.com/css2?family=${fontsParam}&display=swap`;
}
