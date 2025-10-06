# Code Review Improvement Plan

**Based On:** Session 1 Code Review (2025-10-06)
**Overall Grade:** B (82/100)
**Total Issues:** 22 (C:2, H:8, M:7, L:5)

---

## Decision Framework: What to Fix When?

### Option A: Fix Critical Issues First (Recommended)

**Time:** 4-5 hours before Days 6-7 QA
**Rationale:** Prevent compounding issues, make QA testing more effective

**Pros:**
- Mobile menu fixed = better QA experience
- Env vars fixed = framework actually reusable
- Utils extracted = cleaner codebase for testing
- Sets good pattern for future work

**Cons:**
- Delays QA by ~half day
- Might find more issues during QA anyway

### Option B: Proceed with QA, Batch Fixes After

**Time:** Start QA immediately, fix all issues Week 2 (15-20 hours)
**Rationale:** Get QA data first, prioritize fixes based on real issues

**Pros:**
- QA might reveal different priorities
- Batch fixing more efficient
- Faster to Phase 1 launch

**Cons:**
- Mobile QA limited (no working menu)
- Technical debt compounds
- Harder to separate "review issues" from "QA issues"

### Recommendation: **Hybrid Approach**

Fix **only the blockers** before QA (2 hours):
1. Mobile menu (2 hours) - blocks mobile QA
2. Package rename (1 min) - annoyance factor

Defer everything else to post-QA batch (12 hours):
- Env vars (not blocking, but high priority)
- Utils extraction (cleanup, not critical)
- Tests (write after QA finds bugs)
- Error handling (add during bug fixing)

**Total Time Before QA:** 2 hours
**Total Time After QA:** 12 hours
**Net Result:** Better QA experience, efficient fixing

---

## Immediate Actions (Before Days 6-7 QA)

### 1. Fix Mobile Menu (H4)
**Priority:** BLOCKER
**Time:** 2 hours
**Why Now:** Cannot test mobile experience without working navigation

**Implementation:**
```astro
<!-- src/components/Header.astro -->
<script>
  const menuButton = document.querySelector('[data-mobile-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');

  menuButton?.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', (!isExpanded).toString());
    mobileMenu?.classList.toggle('hidden');
  });
</script>

<!-- Mobile menu markup -->
<div data-mobile-menu class="hidden md:hidden">
  <nav class="px-4 pb-4 space-y-2">
    <a href="/" class="block py-2">Home</a>
    <a href="/episodes" class="block py-2">Episodes</a>
    <a href="/about" class="block py-2">About</a>
  </nav>
</div>
```

### 2. Rename Package (M4)
**Priority:** Quick win
**Time:** 1 minute
**Why Now:** Annoying to see "temp-astro" during QA

**Implementation:**
```json
// package.json
{
  "name": "podcast-framework",
  ...
}
```

**Total Time:** ~2 hours

---

## Post-QA Batch Fixes (Week 2 - Days 8-10)

### Phase 1: Security & Framework (4 hours)

#### 3. Move Project ID to Env Vars (C1) - 30 min
**Files to update:** 9 files
- `src/lib/sanity.ts`
- All 7 scripts in `scripts/`
- `.env.example`

**Template:**
```typescript
// src/lib/sanity.ts
export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

// Validation
if (!import.meta.env.PUBLIC_SANITY_PROJECT_ID) {
  throw new Error('Missing SANITY_PROJECT_ID environment variable');
}
```

**Test:** Run all scripts, verify build works

#### 4. Extract Utils to lib/utils.ts (H2) - 30 min

Create `src/lib/utils.ts`:
```typescript
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
```

Update 3 pages to import from utils.

#### 5. Add Confirmation to Delete Script (M1) - 15 min

```javascript
// scripts/delete-all-episodes.js
import readline from 'readline';

async function confirmDeletion() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('⚠️  WARNING: This will DELETE ALL EPISODES from Sanity.');
    console.log('Type "DELETE ALL EPISODES" to confirm, or anything else to cancel:');

    rl.question('> ', (answer) => {
      rl.close();
      resolve(answer === 'DELETE ALL EPISODES');
    });
  });
}

async function main() {
  const confirmed = await confirmDeletion();
  if (!confirmed) {
    console.log('Cancelled. No episodes deleted.');
    process.exit(0);
  }

  await deleteAllEpisodes();
}
```

#### 6. Add Error Handling to Sanity Queries (H1) - 2 hours

```typescript
// src/lib/sanity.ts
export async function getAllEpisodes(): Promise<Episode[]> {
  try {
    const query = `...`;
    const episodes = await sanityClient.fetch(query);

    if (!episodes || !Array.isArray(episodes)) {
      throw new Error('Invalid response from Sanity');
    }

    return episodes;
  } catch (error) {
    console.error('Failed to fetch episodes:', error);

    if (error instanceof Error) {
      throw new Error(`Sanity fetch failed: ${error.message}`);
    }
    throw error;
  }
}
```

Repeat for all 5 query functions.

#### 7. Input Validation for Scripts (H5) - 1 hour

```javascript
// scripts/import-from-rss.js
import { z } from 'zod';

const EpisodeSchema = z.object({
  title: z.string().min(1).max(200),
  episodeNumber: z.number().int().positive(),
  publishDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  duration: z.string().regex(/^\d+:\d{2}(:\d{2})?$/).optional(),
  description: z.string().min(1),
});

function transformToEpisode(item, index, totalEpisodes) {
  const episode = {
    // ... transformation logic
  };

  // Validate before returning
  try {
    return EpisodeSchema.parse(episode);
  } catch (error) {
    console.error(`Validation failed for episode:`, error);
    throw new Error(`Invalid episode data: ${error.message}`);
  }
}
```

---

### Phase 2: Documentation & Testing (6 hours)

#### 8. Create Missing Context Docs (H3) - 2 hours

**CODE_STYLE.md:**
```markdown
# Code Style Guide

## Principles
1. Simplicity first - no clever code
2. No temporary fixes - root cause only
3. Minimal impact - surgical changes
4. Full tracing - understand before changing

## TypeScript
- Use strict mode
- Explicit types preferred over inference
- No `any` types

## Astro
- Use Astro components over React when possible
- Prefer SSG over SSR
- Zero-JS by default

## Tailwind
- Utility classes preferred
- Extract to components when repeated 3+ times
- Use theme colors, not arbitrary values
```

**ARCHITECTURE.md:**
```markdown
# System Architecture

## Build Flow
1. User edits content in Sanity Studio
2. Webhook triggers Netlify build
3. Astro fetches data from Sanity at build time
4. Static HTML generated
5. Deployed to Netlify CDN

## Data Flow
Sanity CMS → GROQ Query → Astro Component → Static HTML

## Key Decisions
- Static generation (not SSR) for performance
- Sanity for CMS (not Contentful) for collaboration features
- Tailwind for styling (not Styled Components) for simplicity
```

**DECISIONS.md:**
```markdown
# Architectural Decision Records

## ADR-001: Use sw[number] Slug Format (2025-10-06)
**Context:** Episode slugs were title-based, resulting in 100+ char URLs
**Decision:** Use `sw${episodeNumber}` format (e.g., sw57)
**Rationale:** Short, memorable, easy to type, never changes
**Status:** Implemented

## ADR-002: Show-Level Spotify Embed (2025-10-06)
**Context:** Anchor RSS episode IDs aren't valid Spotify IDs
**Decision:** Use show-level embed for MVP, defer episode-specific to Phase 2
**Rationale:** Unblocks launch, provides audio playback, avoids API complexity
**Status:** Implemented, Phase 2 planned
```

**KNOWN_ISSUES.md:**
```markdown
# Known Issues

## Phase 2 Features (Deferred)
- Episode-specific Spotify/Apple Podcast links (requires API integration)
- 4 episodes need manual guest linking (ambiguous names)
- Guest profile photos stored as URLs, not Sanity assets
- No mobile menu (FIXED 2025-10-06)

## Technical Debt
- Helper functions duplicated across pages (FIXED 2025-10-06)
- No tests (planned Week 2)
```

#### 9. Write Unit Tests (C2) - 4 hours

```typescript
// src/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, stripHTML, truncate } from '../lib/utils';

describe('formatDate', () => {
  it('formats valid date strings', () => {
    expect(formatDate('2025-10-06')).toBe('October 6, 2025');
  });

  it('handles invalid dates gracefully', () => {
    expect(() => formatDate('invalid')).toThrow();
  });
});

describe('stripHTML', () => {
  it('removes HTML tags', () => {
    expect(stripHTML('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
  });

  it('handles nested tags', () => {
    expect(stripHTML('<div><p><a href="#">Link</a></p></div>')).toBe('Link');
  });

  it('handles empty strings', () => {
    expect(stripHTML('')).toBe('');
  });

  it('handles malformed HTML', () => {
    expect(stripHTML('<p>Unclosed tag')).toBe('Unclosed tag');
  });
});
```

```javascript
// scripts/__tests__/import-from-rss.test.js
import { describe, it, expect } from 'vitest';
import { formatDuration, extractEpisodeNumber } from '../import-from-rss.js';

describe('formatDuration', () => {
  it('handles HH:MM:SS format', () => {
    expect(formatDuration(['01:23:45'])).toBe('01:23:45');
  });

  it('handles MM:SS format', () => {
    expect(formatDuration(['23:45'])).toBe('23:45');
  });

  it('converts seconds to HH:MM:SS', () => {
    expect(formatDuration(['5025'])).toBe('1:23:45');
  });

  it('handles null/undefined', () => {
    expect(formatDuration(null)).toBe(null);
    expect(formatDuration([])).toBe(null);
  });
});
```

Setup:
```bash
npm install -D vitest @testing-library/react
```

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

---

### Phase 3: UX & Accessibility (6 hours)

#### 10. Refactor Pages to Use BaseLayout (H6) - 1 hour

```astro
---
// src/pages/index.astro - BEFORE
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
---
<html lang="en">
  <head>...</head>
  <body>
    <Header />
    <main>...</main>
    <Footer />
  </body>
</html>
```

```astro
---
// src/pages/index.astro - AFTER
import BaseLayout from "../layouts/BaseLayout.astro";
import { getAllEpisodes } from "../lib/sanity";

const episodes = await getAllEpisodes();
const latestEpisode = episodes[0];
---
<BaseLayout
  title={`${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`}
  description={SITE_CONFIG.description}
>
  <main class="flex-grow">
    <!-- Page content -->
  </main>
</BaseLayout>
```

Repeat for: `episodes/[slug].astro`, `episodes/index.astro`, `about.astro`

#### 11. Accessibility Improvements (H7) - 3 hours

**Skip Link:**
```astro
<!-- src/layouts/BaseLayout.astro -->
<body>
  <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white">
    Skip to content
  </a>
  <Header />
  <slot />
  <Footer />
</body>
```

**ARIA Labels:**
```astro
<!-- src/components/Header.astro -->
<nav aria-label="Main navigation">...</nav>

<!-- src/pages/episodes/[slug].astro -->
<iframe
  title="Spotify Podcast Player"
  aria-label={`Listen to ${episode.title} on Spotify`}
  ...
></iframe>
```

**Image Alt Text:**
```astro
{guest.photo?.url && (
  <img
    src={guest.photo.url}
    alt={`${guest.name} profile photo`}
    class="..."
  />
)}
```

**External Link Indicators:**
```astro
<a
  href={SITE_CONFIG.links.spotify}
  target="_blank"
  rel="noopener noreferrer"
  class="..."
>
  Spotify
  <span class="sr-only">(opens in new tab)</span>
</a>
```

Run audit:
```bash
npm install -D @axe-core/cli
npx axe http://localhost:4321 --exit
```

#### 12. SEO Optimizations (H8) - 2 hours

**JSON-LD Structured Data:**
```astro
<!-- src/pages/episodes/[slug].astro -->
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "PodcastEpisode",
  "name": episode.title,
  "description": episode.description.substring(0, 160),
  "datePublished": episode.publishDate,
  "duration": episode.duration,
  "partOfSeries": {
    "@type": "PodcastSeries",
    "name": SITE_CONFIG.name,
    "url": SITE_CONFIG.url
  }
})} />
```

**Sitemap:**
```bash
npm install @astrojs/sitemap
```

```javascript
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://staging.strangewater.xyz',
  integrations: [sitemap()],
});
```

**Robots.txt:**
```
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://staging.strangewater.xyz/sitemap-index.xml
```

**RSS Feed Link:**
```astro
<!-- src/layouts/BaseLayout.astro -->
<head>
  ...
  <link rel="alternate" type="application/rss+xml" title="Strange Water RSS Feed" href="https://anchor.fm/s/dcf17d04/podcast/rss" />
</head>
```

---

## Optional Enhancements (Low Priority - Week 3+)

### 13. Content Security Policy (M6) - 1 hour

```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = """
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://open.spotify.com;
      frame-src https://open.spotify.com;
      img-src 'self' data: https: blob:;
      style-src 'self' 'unsafe-inline';
      font-src 'self' data:;
      connect-src 'self' https://ej6443ov.api.sanity.io;
    """
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

Test with: https://csp-evaluator.withgoogle.com/

### 14. Theme Centralization (L1) - 2 hours

```javascript
// src/config/theme.json
{
  "colors": {
    "primary": {
      "50": "#eff6ff",
      "600": "#2563eb",
      "700": "#1d4ed8"
    },
    "secondary": {
      "50": "#f9fafb",
      "700": "#374151",
      "900": "#111827"
    }
  }
}
```

```javascript
// tailwind.config.mjs
import theme from './src/config/theme.json';

export default {
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
      }
    }
  }
}
```

Update components: `bg-blue-600` → `bg-primary-600`

### 15. Structured Logging (L4) - 1 hour

```javascript
// scripts/lib/logger.js
export const logger = {
  info: (msg, data = {}) => console.log(JSON.stringify({
    level: 'info',
    time: new Date().toISOString(),
    msg,
    ...data
  })),
  success: (msg, data = {}) => console.log(`✅ ${msg}`, data),
  error: (msg, error, data = {}) => console.error(JSON.stringify({
    level: 'error',
    time: new Date().toISOString(),
    msg,
    error: error?.message,
    stack: error?.stack,
    ...data
  })),
  warn: (msg, data = {}) => console.warn(`⚠️  ${msg}`, data),
};
```

---

## Timeline Summary

### Immediate (Today - 2 hours)
- ✅ Mobile menu
- ✅ Package rename

### Week 2, Day 8 (4 hours)
- ✅ Move to env vars
- ✅ Extract utils
- ✅ Confirmation on delete script
- ✅ Error handling

### Week 2, Day 9 (6 hours)
- ✅ Create context docs
- ✅ Write unit tests

### Week 2, Day 10 (6 hours)
- ✅ Refactor to BaseLayout
- ✅ Accessibility fixes
- ✅ SEO optimizations

### Week 3+ (Optional - 4 hours)
- CSP headers
- Theme centralization
- Structured logging

**Total Effort:** 22 hours (18 hours core, 4 hours optional)

---

## Success Metrics

**Before Fixes:**
- Grade: B (82/100)
- Critical: 2
- Test Coverage: 0%
- Accessibility Score: Unknown (likely 75-80)
- Hardcoded secrets: Yes

**After All Fixes:**
- Grade: A- (90/100) target
- Critical: 0
- Test Coverage: >60% (critical paths)
- Accessibility Score: >90 (WCAG 2.1 AA)
- Hardcoded secrets: None

**Framework Reusability:**
- Before: 40% (hardcoded IDs, no tests, poor docs)
- After: 85% (env vars, tested, documented, accessible)

---

## Notes

- Run `/save-context` after each phase
- Commit after each major fix (not one giant commit)
- Test locally before each commit
- Update KNOWN_ISSUES.md as issues are fixed
- Re-run code review after all fixes to measure improvement

---

**Created:** 2025-10-06
**Based On:** artifacts/code-reviews/session-1-review.md
**Next Action:** Decide on Option A, B, or Hybrid approach
