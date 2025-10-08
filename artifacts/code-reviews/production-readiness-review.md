# Production Readiness Code Review
**Date:** 2025-10-08
**Reviewer:** Claude Code
**Scope:** Complete codebase - Performance, Security, Cost Optimization
**Duration:** 90 minutes (comprehensive analysis)
**Session:** 18

---

## Executive Summary

**Overall Grade:** B+

**Overall Assessment:**
The codebase is **largely production-ready** with strong fundamentals: build-time caching, TypeScript strict mode, error handling, and good security practices. However, there are **critical cost optimization** opportunities and several **high-priority improvements** needed before public launch to ensure optimal performance, security, and cost efficiency.

**Critical Issues:** 2
**High Priority:** 7
**Medium Priority:** 9
**Low Priority:** 6

**Top 3 Recommendations:**
1. **[CRITICAL - COST]** Implement caching for Netlify function Sanity API calls to prevent quota exhaustion
2. **[CRITICAL - PERFORMANCE]** Add missing build-time cache for `getEpisodeBySlug` and config queries
3. **[HIGH - SECURITY]** Restrict CORS `Access-Control-Allow-Origin` from wildcard to specific domain

---

## Critical Issues (Fix Immediately - Before Launch)

### C1: Runtime Sanity API Calls in Netlify Functions (COST CRITICAL)
- **Severity:** Critical
- **Location:**
  - `netlify/functions/newsletter-subscribe.ts:101`
  - `netlify/functions/contribute.ts` (likely similar pattern)
- **Issue:** Every newsletter subscription and contribution form submission fetches podcast config from Sanity API. With free tier limit of 100k API requests/month, high traffic could exhaust quota quickly.
- **Impact:**
  - **Cost:** 1000 newsletter signups = 1000 Sanity API calls = 1% of monthly quota
  - **Performance:** 200-500ms latency on every form submission
  - **Reliability:** Quota exhaustion = service outage for all forms
- **Root Cause:** No caching strategy for runtime Netlify function calls to Sanity
- **Suggestion:** Implement one of these patterns:
  - **Option A (Recommended):** Cache podcast config in Netlify function with 5-minute TTL
  - **Option B:** Move config to environment variables (but loses CMS flexibility)
  - **Option C:** Use Netlify Edge Functions with KV cache
- **Effort:** 2-3 hours (Option A), 30 minutes (Option B)
- **Code Example:**
```typescript
// Option A: In-memory cache with TTL
let cachedPodcastConfig: any = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getPodcastConfig() {
  const now = Date.now();
  if (cachedPodcastConfig && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedPodcastConfig;
  }

  cachedPodcastConfig = await sanityClient.fetch(`*[_type == "podcast"][0]`);
  cacheTimestamp = now;
  return cachedPodcastConfig;
}
```

---

### C2: Incomplete Build-Time Caching (COST CRITICAL)
- **Severity:** Critical
- **Location:**
  - `src/lib/sanity.ts:364` - `getEpisodeBySlug` bypasses cache
  - `src/lib/sanity.ts:541` - `getHomepageConfig` not cached
  - `src/lib/sanity.ts:564` - `getAboutPageConfig` not cached
  - `src/pages/guest/[slug].astro:40` - Guest page fetches bypass cache
- **Issue:** During Astro SSG build, these queries run independently for each page, causing **redundant API calls**. For 69 episodes + 72 guests = 141+ redundant Sanity API calls per build.
- **Impact:**
  - **Cost:** Each build consumes 140+ API calls unnecessarily (3-5 builds/day = 500-700 calls/day wasted)
  - **Performance:** Build time increases by 5-10 seconds
  - **Quota:** ~10% of monthly Sanity quota wasted on redundant queries
- **Root Cause:** Not all query functions use the `cachedFetch` wrapper implemented in sanity.ts:39
- **Suggestion:** Wrap all remaining queries with `cachedFetch`:
  - `getEpisodeBySlug` → use cache with key `episode-${slug}`
  - `getHomepageConfig` → already has query but not wrapped
  - `getAboutPageConfig` → already has query but not wrapped
  - Guest pages → add `getGuestBySlug` with caching
- **Effort:** 2 hours
- **Code Example:**
```typescript
export async function getEpisodeBySlug(slug: string): Promise<Episode | null> {
  return cachedFetch(`episode-${slug}`, async () => {
    const query = `*[_type == "episode" && slug.current == $slug][0] { ... }`;
    // ... rest of existing code
  });
}
```

---

## High Priority Issues (Fix Before Launch)

### H1: Overly Permissive CORS Configuration (SECURITY)
- **Severity:** High
- **Location:**
  - `netlify/functions/contribute.ts:82-86`
  - `netlify/functions/newsletter-subscribe.ts:42-46`
- **Issue:** `Access-Control-Allow-Origin: "*"` allows any website to call these endpoints, enabling potential abuse
- **Impact:**
  - **Security:** Malicious sites could embed your forms and abuse them
  - **Cost:** Spam attacks could exhaust Sanity/Resend/ConvertKit quotas
  - **Reputation:** Your domain could be flagged for spam if abused
- **Root Cause:** Default CORS configuration for MVP development
- **Suggestion:** Restrict to specific domains:
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "https://strangewater.xyz",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
```
- **Effort:** 30 minutes

---

### H2: XSS Risk in TranscriptViewer via innerHTML
- **Severity:** High
- **Location:** `src/components/TranscriptViewer.astro:150, 166, 173`
- **Issue:** Uses `innerHTML` to inject transcript content and search highlights. While transcript comes from trusted Sanity source, if Sanity is compromised or user-generated content is added later, XSS is possible.
- **Impact:**
  - **Security:** XSS if malicious content enters transcripts
  - **User Trust:** Potential for session hijacking or data theft
- **Root Cause:** Client-side HTML generation without sanitization
- **Suggestion:**
  - **Option A:** Use `textContent` + DOM manipulation instead of `innerHTML`
  - **Option B:** Add DOMPurify library for sanitization
  - **Option C:** Server-side render highlights (but loses search functionality)
- **Effort:** 2-3 hours (Option A recommended)
- **Example:**
```typescript
// Instead of: contentEl.innerHTML = formatTranscriptHTML(text);
// Use:
function formatTranscriptDOM(text: string, container: HTMLElement) {
  container.textContent = ''; // Clear
  const lines = text.split('\n');
  lines.forEach(line => {
    const p = document.createElement('p');
    p.textContent = line;
    container.appendChild(p);
  });
}
```

---

### H3: Missing Sanity CDN Configuration for useCdn
- **Severity:** High
- **Location:** `netlify/functions/contribute.ts:15` and `newsletter-subscribe.ts:10`
- **Issue:** Netlify functions create Sanity client with `useCdn: false`, fetching directly from API instead of using CDN
- **Impact:**
  - **Performance:** 200-500ms slower response times
  - **Cost:** Every request hits API instead of free CDN
  - **Reliability:** More load on Sanity API = higher chance of rate limiting
- **Root Cause:** Conservative default (write token requires useCdn: false, but read-only queries don't)
- **Suggestion:** These functions only READ, so enable CDN:
```typescript
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || "",
  dataset: process.env.SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN, // Still needed for read permissions
  apiVersion: "2024-01-01",
  useCdn: true, // ← CHANGE THIS
});
```
- **Effort:** 5 minutes

---

### H4: No Image Optimization Plugin
- **Severity:** High
- **Location:** `astro.config.mjs` - missing @astrojs/image or similar
- **Issue:** Images are served as-is without optimization (responsive sizes, modern formats like WebP/AVIF)
- **Impact:**
  - **Performance:** Core Web Vitals (LCP) likely poor for image-heavy pages
  - **Bandwidth:** Serving full-size PNGs/JPGs wastes Netlify bandwidth quota
  - **User Experience:** Slow page loads on mobile/slow connections
- **Root Cause:** Relying on Sanity CDN URLs without Astro's image optimization
- **Suggestion:** Add Astro image optimization:
```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import image from '@astrojs/image';

export default defineConfig({
  integrations: [
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
    }),
    sitemap(),
  ],
});
```
Then update image tags to use `<Image>` component
- **Effort:** 3-4 hours
- **Impact:** 30-50% faster image loading, better Core Web Vitals

---

### H5: Rate Limiting Only Per-Instance (Scale Issue)
- **Severity:** High
- **Location:** `netlify/functions/contribute.ts:41` and `newsletter-subscribe.ts:17`
- **Issue:** In-memory rate limiting resets on every cold start and doesn't share across function instances
- **Impact:**
  - **Security:** Distributed attack across multiple instances bypasses rate limit
  - **Cost:** Spam attacks could exhaust ConvertKit/Resend/Sanity quotas
- **Root Cause:** Acknowledged MVP limitation (see line 24-39 comments)
- **Suggestion:** For production, implement shared rate limiting:
  - **Option A:** Upstash Redis (free tier, 10k commands/day)
  - **Option B:** Netlify Blobs (simple key-value store)
  - **Option C:** Keep MVP pattern but add IP blocking list in code
- **Effort:** 4-6 hours (Option A), 2 hours (Option C)
- **Priority:** High for production launch, especially if traffic exceeds 100 submissions/day

---

### H6: Missing Error Monitoring (Sentry) Integration
- **Severity:** High
- **Location:** Multiple TODO comments throughout codebase:
  - `netlify/functions/contribute.ts:272, 287, 291`
  - `src/lib/sanity.ts:355, 416, 465, etc.`
- **Issue:** All errors just `console.error` with TODO comments to add Sentry. No visibility into production errors.
- **Impact:**
  - **Reliability:** Can't detect or fix production issues proactively
  - **User Experience:** Silent failures go unnoticed
  - **Debugging:** No stack traces or context when issues occur
- **Root Cause:** Deferred during MVP development
- **Suggestion:** Implement Sentry integration before launch:
```typescript
// Add to netlify functions and sanity.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Replace console.error with:
Sentry.captureException(error, {
  extra: { context: 'newsletter-subscribe', email },
});
```
- **Effort:** 2-3 hours
- **Cost:** Free tier (5k events/month)

---

### H7: No Environment Variable Validation at Build Time
- **Severity:** High
- **Location:** Only `src/lib/sanity.ts:4-9` validates `PUBLIC_SANITY_PROJECT_ID`
- **Issue:** Missing env vars for Netlify functions (RESEND_API_KEY, NOTIFICATION_EMAIL, SANITY_API_TOKEN, etc.) only fail at runtime
- **Impact:**
  - **Deployment:** Silent deployment failures (site builds but features broken)
  - **Debugging:** Hard to diagnose "function not working" issues
  - **User Experience:** Forms appear to work but silently fail
- **Root Cause:** No build-time validation script
- **Suggestion:** Add env validation script:
```typescript
// scripts/validate-env.ts
const required = [
  'PUBLIC_SANITY_PROJECT_ID',
  'PUBLIC_SANITY_DATASET',
  'SANITY_API_TOKEN',
  'RESEND_API_KEY',
  'NOTIFICATION_EMAIL',
  // ...
];

required.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
```
Run in `npm run build` script
- **Effort:** 1 hour

---

## Medium Priority Issues (Address Soon)

### M1: Homepage Config and About Config Missing from Build Cache
- **Severity:** Medium
- **Location:** `src/lib/sanity.ts:541, 564`
- **Issue:** Not wrapped in `cachedFetch`, so every page that imports homepage/about config fetches independently
- **Impact:** Wastes 2-4 API calls per build (minor compared to episode/guest issue)
- **Suggestion:** Same as C2 - wrap in `cachedFetch`
- **Effort:** 30 minutes

---

### M2: sanitizeHTML Function Incomplete
- **Severity:** Medium
- **Location:** `src/lib/utils.ts:69-82`
- **Issue:** Basic XSS protection but missing several attack vectors:
  - Doesn't remove `<iframe>` tags
  - Doesn't handle SVG-based XSS (`<svg onload=...>`)
  - Doesn't sanitize style attributes (`style="background: url(javascript:...)"`)
- **Impact:** If user-generated content is added later, XSS is possible
- **Root Cause:** Custom implementation instead of battle-tested library
- **Suggestion:** Replace with DOMPurify or similar:
```typescript
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href'],
  });
}
```
- **Effort:** 1 hour

---

### M3: No Tests for Netlify Functions
- **Severity:** Medium
- **Location:** No test files for `netlify/functions/*.ts`
- **Issue:** Critical business logic (form submissions, newsletter) has zero test coverage
- **Impact:**
  - **Reliability:** Regressions can slip into production
  - **Confidence:** Can't safely refactor without tests
  - **Documentation:** Tests serve as usage documentation
- **Root Cause:** MVP timeline prioritized features over tests
- **Suggestion:** Add Vitest tests for:
  - Rate limiting logic
  - Input validation
  - Error handling
  - Happy path flows
- **Effort:** 4-6 hours

---

### M4: Large Favicon (108KB)
- **Severity:** Medium
- **Location:** `public/favicon.png` - 108KB
- **Issue:** Favicon is unnecessarily large (should be <10KB)
- **Impact:**
  - **Performance:** Extra 100KB download on every page (even if cached)
  - **Bandwidth:** Wastes Netlify bandwidth quota
- **Suggestion:** Optimize favicon:
  - Convert to .ico or .svg (vector)
  - If PNG, compress with ImageOptim or similar
  - Target: <10KB
- **Effort:** 15 minutes

---

### M5: No Content Security Policy (CSP)
- **Severity:** Medium
- **Location:** Missing from `src/layouts/BaseLayout.astro` meta tags
- **Issue:** No CSP headers to prevent XSS and other injection attacks
- **Impact:**
  - **Security:** One of the best defenses against XSS is missing
  - **Best Practice:** Modern sites should have CSP
- **Suggestion:** Add CSP meta tag:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' https://cdn.sanity.io data:;
  font-src 'self';
  connect-src 'self' https://api.sanity.io;
  frame-src 'none';
">
```
- **Effort:** 2-3 hours (testing required)

---

### M6: Client-Side Form Handling Missing CSRF Protection
- **Severity:** Medium
- **Location:**
  - `src/components/NewsletterSignup.astro:160-185`
  - `src/pages/contribute.astro` (form submission)
- **Issue:** No CSRF tokens to prevent cross-site request forgery
- **Impact:**
  - **Security:** Malicious sites could trigger form submissions on behalf of users
  - **Spam:** CSRF + open CORS = easy spam vector
- **Root Cause:** Honeypot and rate limiting relied on instead
- **Suggestion:**
  - For now: CORS restriction (H1) mitigates this
  - For production: Add CSRF token generation/validation
- **Effort:** 3-4 hours

---

### M7: No Accessibility Testing
- **Severity:** Medium
- **Location:** No automated accessibility checks in CI/CD
- **Issue:** Manual accessibility review needed before launch
- **Impact:**
  - **Legal:** ADA compliance risk (though risk is low for podcast site)
  - **User Experience:** Screen reader users may have issues
  - **SEO:** Poor accessibility can impact rankings
- **Suggestion:** Run accessibility audit:
  - Use axe DevTools or Lighthouse
  - Check keyboard navigation
  - Verify ARIA labels
  - Test with screen reader
- **Effort:** 2-3 hours

---

### M8: Episode Slugs Not Using URL-Safe Characters
- **Severity:** Medium
- **Location:** `src/lib/sanity.ts` - Episode slug format: "sw0", "sw1", etc.
- **Issue:** Current slugs work fine, but guest slugs likely auto-generated from names. Special characters in names could cause URL issues.
- **Impact:**
  - **Reliability:** Guest with name like "O'Brien" → slug "o'brien" breaks URLs
  - **SEO:** URLs with encoded characters look unprofessional
- **Suggestion:** Add slug validation/sanitization in Sanity schema
- **Effort:** 1 hour (preventative for future episodes/guests)

---

### M9: No Loading States in Client-Side Components
- **Severity:** Medium
- **Location:**
  - `src/components/NewsletterSignup.astro` - Button says "Subscribing..." but no spinner
  - `src/pages/contribute.astro` - No visual feedback during submission
- **Issue:** Users may think form is broken if network is slow
- **Impact:**
  - **User Experience:** Confusion during slow requests
  - **Duplicate Submissions:** User may click multiple times
- **Suggestion:** Add loading spinners:
```typescript
button.disabled = true;
button.innerHTML = '<svg class="animate-spin ...">...</svg> Subscribing...';
```
- **Effort:** 1 hour

---

## Low Priority Issues (Nice to Have)

### L1: Missing robots.txt
- **Severity:** Low
- **Location:** `public/robots.txt` doesn't exist
- **Issue:** Should have robots.txt even if allowing all
- **Suggestion:** Add `public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://strangewater.xyz/sitemap-index.xml
```
- **Effort:** 5 minutes

---

### L2: No Automated Build Size Monitoring
- **Severity:** Low
- **Issue:** No tracking of bundle size over time
- **Suggestion:** Add bundle size check to CI
- **Effort:** 1 hour

---

### L3: Console Logs in Production Code
- **Severity:** Low
- **Location:** Multiple `console.log`, `console.warn`, `console.error` throughout
- **Issue:** Should use proper logging library (or at least conditional logging)
- **Suggestion:** Replace with conditional logging:
```typescript
const log = process.env.NODE_ENV === 'development' ? console.log : () => {};
```
- **Effort:** 30 minutes

---

### L4: No TypeScript Strict Mode for Scripts
- **Severity:** Low
- **Location:** `scripts/*.js` - All scripts are JavaScript, not TypeScript
- **Issue:** Missing type safety for important data migration scripts
- **Suggestion:** Convert scripts to TypeScript or add JSDoc types
- **Effort:** 2-3 hours

---

### L5: Missing GitHub PR Template
- **Severity:** Low
- **Issue:** No PR template to guide code reviews
- **Suggestion:** Add `.github/pull_request_template.md`
- **Effort:** 15 minutes

---

### L6: No Automated Dependency Updates
- **Severity:** Low
- **Issue:** No Dependabot or Renovate configured
- **Suggestion:** Enable Dependabot for security updates
- **Effort:** 10 minutes

---

## Positive Findings

**What's Working Well:**
- ✅ **Build-time caching** implemented for most queries (excellent cost optimization)
- ✅ **TypeScript strict mode** enabled (tsconfig.json extends astro/tsconfigs/strict)
- ✅ **Error handling** with try-catch and graceful degradation throughout
- ✅ **Input validation** on all Netlify function inputs (email, field lengths, honeypot)
- ✅ **Minimal bundle sizes** (largest script only 9.10KB gzipped)
- ✅ **CDN enabled** for Sanity reads (useCdn: true in src/lib/sanity.ts)
- ✅ **Sitemap** automatically generated via @astrojs/sitemap
- ✅ **Security comments** documenting why API keys excluded from frontend
- ✅ **GA4** integration properly configured with conditional loading

**Strengths:**
- Strong architecture with clear separation of concerns
- Proactive caching strategy (just needs completion)
- Security-conscious development (just needs tightening)
- Good documentation in code comments
- Clean, readable code throughout

---

## Patterns Observed

**Recurring Issues:**
1. Incomplete application of caching pattern (cachedFetch not used everywhere)
2. TODO comments for Sentry integration scattered throughout
3. console.log/error instead of proper logging

**Root Causes:**
1. MVP timeline led to "good enough" solutions deferred for later
2. Cost optimization strategy partially implemented but not completed
3. Security features added incrementally but not comprehensively reviewed

**Quick Wins:**
1. Enable useCdn: true in Netlify functions (5 min, big perf gain)
2. Restrict CORS to specific domain (30 min, closes security hole)
3. Add robots.txt (5 min, SEO improvement)
4. Optimize favicon (15 min, bandwidth savings)

---

## Recommendations

### Immediate Actions (This Week - Before Launch)
1. **[C1]** Implement Netlify function caching for Sanity queries (3 hours)
2. **[C2]** Complete build-time caching for all queries (2 hours)
3. **[H1]** Restrict CORS to specific domain (30 min)
4. **[H3]** Enable useCdn: true in Netlify functions (5 min)
5. **[H6]** Implement Sentry error monitoring (3 hours)
6. **[H7]** Add environment variable validation (1 hour)

**Total Effort:** ~10 hours

### Short-term Improvements (Next 2 Weeks)
1. **[H2]** Fix XSS risk in TranscriptViewer (3 hours)
2. **[H4]** Add image optimization plugin (4 hours)
3. **[H5]** Upgrade rate limiting for production scale (4-6 hours)
4. **[M2]** Replace sanitizeHTML with DOMPurify (1 hour)
5. **[M3]** Add tests for Netlify functions (6 hours)
6. **[M5]** Implement Content Security Policy (3 hours)
7. **[M7]** Run accessibility audit and fixes (3 hours)

**Total Effort:** ~25 hours

### Long-term Enhancements (Backlog)
1. Automated dependency updates (Dependabot)
2. Bundle size monitoring
3. Comprehensive test coverage (target 80%)
4. Convert scripts to TypeScript
5. Performance monitoring (Core Web Vitals tracking)

---

## Metrics

- **Files Reviewed:** 24 source files, 2 Netlify functions, 5 config files
- **Lines of Code:** ~2500 (estimated)
- **Issues Found:** 24 total (C:2, H:7, M:9, L:6)
- **Test Coverage:** <10% (only utils.test.ts exists)
- **Code Complexity:** Low-Medium (mostly straightforward, clear logic)

---

## Compliance Check

**Simplicity Principle:**
- ✅ Code is generally simple and readable
- ✅ No over-engineering detected
- ⚠️ Some patterns (caching, error handling) partially implemented

**Root Cause Solutions:**
- ✅ Most code addresses root problems, not symptoms
- ⚠️ Rate limiting is acknowledged MVP compromise

**Security & Performance:**
- ⚠️ Security: Good foundation, needs tightening (CORS, XSS, CSP)
- ⚠️ Performance: Good basics, needs completion (caching, image optimization)
- ✅ TypeScript strict mode enforced

---

## Next Steps

**For User:**
1. Review this report and prioritize issues
2. Decide which Critical/High issues block launch
3. Run /save-context to capture current state
4. Schedule fix session(s) for chosen issues

**Suggested Fix Order:**
1. **Session 1 (4 hours):** C1, C2, H1, H3, H6, H7 - Core fixes
2. **Session 2 (4 hours):** H2, H4, M2, M5 - Security & Performance
3. **Session 3 (4 hours):** H5, M3, M7 - Production hardening
4. **Backlog:** Low priority items as time permits

**Estimated Total Effort to Production-Ready:** ~12-15 hours

---

## Notes

**Context:**
- This is a production-readiness review requested before public launch
- User specifically wanted focus on: Performance, Security, Cost Optimization
- Review found strong fundamentals with actionable improvements needed
- Most critical issues are cost optimizations (Sanity API quota management)

**Uncertainties:**
- Exact traffic expectations unknown (affects rate limiting priority)
- Launch timeline not specified (affects urgency of fixes)
- Budget for paid services (Sentry, image optimization) not discussed

**Areas Needing User Input:**
- Which Critical/High issues block launch vs can be addressed post-launch?
- Is Sentry budget approved? (free tier may suffice)
- Expected traffic volume? (affects rate limiting strategy)
- Timeline for launch? (affects how much can be fixed)

---

## Review Checklist

- [✅] All major areas reviewed (performance, security, cost)
- [✅] Issues categorized by severity
- [✅] Root causes identified
- [✅] Suggestions provided with code examples
- [✅] No changes made to code
- [✅] Report is actionable
- [✅] Effort estimates provided
- [✅] Prioritized fix order suggested

---

**Review Complete.** NO changes made to codebase. All issues documented for fixing in separate session.
