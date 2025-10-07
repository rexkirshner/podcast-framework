# Technical Decisions & Architecture Choices

> **Purpose:** Document WHY we made specific technical choices to inform future decisions and enable perfect session continuity.
> **Critical for AI agents:** Understanding rationale, constraints, and tradeoffs behind each decision.

**Last Updated:** 2025-10-06 (v2.0.0 migration)

---

## Table of Contents

1. [Core Architecture](#core-architecture)
2. [Content Management](#content-management)
3. [Development Workflow](#development-workflow)
4. [Data Migration](#data-migration)
5. [User Experience](#user-experience)
6. [Framework Reusability](#framework-reusability)
7. [Deferred Decisions](#deferred-decisions)

---

## Core Architecture

### Decision: Astro for Static Site Generation
**Date:** Pre-project (PRD)
**Status:** ✅ Implemented

**Why:**
- Zero-JS by default (optimal performance for content sites)
- SEO-optimized out of the box (critical for podcast discoverability)
- Build-time rendering (fast page loads, no runtime overhead)
- Excellent DX with component islands architecture

**Alternatives Considered:**
- Next.js (rejected: runtime overhead for simple content site)
- Gatsby (rejected: build complexity, slower builds)
- Plain HTML (rejected: no component reusability)

**Constraints:**
- Must support dynamic routing for episodes
- Must integrate with headless CMS
- Must be fast to deploy (<5 min builds)

**Outcome:**
- ✅ Build time: ~10s for 72 pages
- ✅ Perfect Lighthouse scores achievable
- ✅ Zero client-side JS by default

---

### Decision: Netlify for Hosting
**Date:** Pre-project (PRD)
**Status:** ✅ Implemented

**Why:**
- Free tier sufficient (300 build min/month)
- Instant rollbacks (safety for production)
- Git-based deployment (no manual upload steps)
- Custom domain support (staging.strangewater.xyz)
- Build hooks for Sanity integration

**Alternatives Considered:**
- Vercel (similar, but Netlify free tier more generous)
- GitHub Pages (rejected: no build hooks, limited SSG support)
- Traditional hosting (rejected: manual deployment overhead)

**Constraints:**
- Must be cost-effective for multiple podcast instances
- Must support custom domains
- Must integrate with Sanity webhooks

**Outcome:**
- ✅ Deployed Day 1 (vertical slice approach validated)
- ✅ staging.strangewater.xyz working
- ✅ Zero hosting costs

---

### Decision: Tailwind CSS for Styling
**Date:** Day 1
**Status:** ✅ Implemented

**Why:**
- Utility-first approach (rapid iteration)
- Responsive design built-in
- Small bundle size (only used classes shipped)
- No context switching (styles inline with markup)

**Alternatives Considered:**
- CSS Modules (rejected: more boilerplate)
- Styled Components (rejected: runtime overhead)
- Plain CSS (rejected: no design system)

**Constraints:**
- Must support responsive design
- Must be maintainable across podcast instances
- Brand colors should be customizable (future: via CMS)

**Outcome:**
- ✅ Responsive design working
- ⏳ Brand customization deferred to Phase 2 (hardcoded for now)

---

## Content Management

### Decision: Sanity.io for CMS
**Date:** Pre-project (PRD)
**Status:** ✅ Implemented

**Why:**
- Real-time collaboration (multiple podcast managers)
- Customizable Studio (tailored content editing)
- GROQ queries (powerful data fetching)
- Structured content (podcasts, episodes, guests, hosts)
- Free tier generous (10k documents, 100k API requests/mo)

**Alternatives Considered:**
- Contentful (rejected: expensive for multi-project use)
- Strapi (rejected: hosting overhead, self-managed)
- Markdown files (rejected: no collaboration, no guest management)

**Constraints:**
- Must support relationships (episodes ↔ guests)
- Must be accessible to non-technical users
- Must support images and rich text

**Outcome:**
- ✅ 69 episodes + 72 guests + 1 host managed
- ✅ Relationships working (63/67 auto-linked)
- ✅ Local Studio functional (deployment deferred indefinitely)

---

### Decision: Local Sanity Studio Only (No Hosted Deployment)
**Date:** Day 5
**Status:** ✅ Implemented (deferred indefinitely)

**Why:**
- Strange Water is archival (no ongoing content updates)
- Deploying Studio adds complexity (auth, hosting, maintenance)
- Local Studio sufficient for manual updates (episode artwork, guest photos)
- Future podcasts can deploy Studio if needed

**Original Plan:**
- Deploy hosted Sanity Studio for remote content management

**Trade-off:**
- ✅ Simpler stack (one less deployment)
- ✅ No auth complexity
- ❌ Manual updates require local development environment

**Outcome:**
- ✅ Task 5.1 (Deploy Sanity Studio) deferred indefinitely
- ✅ Local Studio working at http://localhost:3333/
- ✅ Manual uploads completed (episode covers, guest photos)

---

### Decision: Separate Content Types for Hosts and Guests
**Date:** Day 6
**Status:** ✅ Implemented

**Why:**
- Semantic clarity (hosts vs guests are different roles)
- Flexible layout (side-by-side sections, different styling)
- Accurate representation (Rex hosts all episodes, guests vary)
- Future-proof (multi-host podcasts supported)

**Alternatives Considered:**
- Single "person" type with role field (rejected: less clear, harder to query)
- Hardcode host (rejected: not reusable framework)

**Constraints:**
- Must support episodes with zero guests (solo episodes)
- Must support multiple hosts per episode (future)
- Must support dynamic labeling (Host/Hosts, Guest/Guests based on count)

**Outcome:**
- ✅ Host schema created
- ✅ Rex added to all 68 episodes
- ✅ Side-by-side layout working
- ✅ Dynamic labels implemented

---

## Development Workflow

### Decision: Iterative, Vertical-Slice Approach
**Date:** Day 1
**Status:** ✅ Validated

**Why:**
- Working site exists from Day 1 (not Week 4)
- Each day produces demonstrable value
- Continuous deployment (3-5 deploys/day to staging)
- Small tasks (2-4 hours each, not week-long)
- Refactor as we learn (don't over-engineer upfront)

**Anti-patterns Avoided:**
- ❌ Building all components before wiring them together
- ❌ Waiting weeks before first deploy
- ❌ Large PRs changing 50 files
- ❌ "It'll all come together in Week 4"

**Outcome:**
- ✅ Deployed Day 1 (Astro + Tailwind + hardcoded episode)
- ✅ 10 sessions, 6 days of work, Phase 1 complete
- ✅ Avg 10 tasks/day completed

---

### Decision: Claude Context System v2.0.0
**Date:** Day 6 (post-Phase 1)
**Status:** ✅ Migrated

**Why:**
- Status duplication eliminated (CLAUDE.md + next-steps.md → STATUS.md)
- Decision log needed (15+ decisions scattered in SESSIONS.md)
- Natural break point (Phase 1 complete, before Phase 2 planning)
- Single source of truth (STATUS.md for current state)

**Migration Rationale:**
- v1.x structure worked well for Phase 1
- v2.0.0 addresses pain points identified during 10 sessions
- Manual migration acceptable (thorough, intentional)
- v2.1 automation not needed for this project

**Outcome:**
- ✅ CLAUDE.md → CONTEXT.md (orientation)
- ✅ STATUS.md created (single source of truth)
- ✅ DECISIONS.md created (this file - WHY documentation)
- ✅ QUICK_REF.md planned (auto-generated dashboard)
- ✅ All 10 sessions of history preserved

---

## Data Migration

### Decision: Automated RSS Import Script
**Date:** Day 5
**Status:** ✅ Implemented

**Why:**
- Manual entry = error-prone (69 episodes, 20+ fields each)
- RSS feed has canonical data (titles, descriptions, durations, URLs)
- Reusable across podcast instances (framework feature)
- Idempotent (can re-run without duplicates)

**Implementation:**
- Parse RSS XML from Anchor.fm
- Extract episode metadata (title, description, date, duration, Spotify URL)
- Generate clean slugs (sw0, sw1, etc.)
- Upload to Sanity via API

**Outcome:**
- ✅ 69 episodes imported automatically
- ✅ Zero manual data entry
- ✅ Script reusable for future podcasts

---

### Decision: Web Scraping for Guest Data
**Date:** Day 5
**Status:** ✅ Implemented

**Why:**
- RSS feed lacks guest information
- strangewater.xyz has structured guest data (names, social links)
- Manual entry = error-prone (72 guests)
- Automated extraction = accurate, fast

**Implementation:**
- Fetch episode pages from strangewater.xyz
- Parse HTML for guest sections
- Extract names and social links (Twitter, Instagram, website)
- Upload to Sanity via API

**Challenges:**
- HTML structure inconsistent (some episodes formatted differently)
- Solution: Robust parsing with fallbacks

**Outcome:**
- ✅ 72 guests imported automatically
- ✅ Social links preserved
- ✅ 63/67 episodes auto-linked to guests

---

### Decision: Automated Guest-to-Episode Linking
**Date:** Day 5
**Status:** ✅ Implemented (63/67 success rate)

**Why:**
- Manual linking = tedious (69 episodes, 72 guests)
- Fuzzy matching = high success rate
- Remaining 4 require manual review (acceptable trade-off)

**Implementation:**
- Fuzzy name matching (Levenshtein distance)
- Conservative threshold (avoid false positives)
- Review unlinked episodes manually

**Outcome:**
- ✅ 63/67 episodes auto-linked
- ✅ 4 manual reviews pending
- ✅ Zero false positives

---

## User Experience

### Decision: Dynamic Labels (Host/Hosts, Guest/Guests)
**Date:** Day 6
**Status:** ✅ Implemented

**Why:**
- Grammatical correctness matters for UX
- "1 Host" vs "2 Hosts" reads better
- "0 Guests" vs "1 Guest" vs "2 Guests"

**Implementation:**
- Conditional rendering based on array length
- `{hosts.length === 1 ? 'Host' : 'Hosts'}`
- `{guests.length === 1 ? 'Guest' : 'Guests'}`

**Outcome:**
- ✅ All episode pages grammatically correct
- ✅ Small detail, polished UX

---

### Decision: BaseLayout Refactor (Centralized SEO & Meta Tags)
**Date:** Day 6 (Session 10)
**Status:** ✅ Implemented

**Why:**
- DRY principle (eliminate duplication across 4 pages)
- Single source of truth for SEO (title, description, favicon)
- Consistent GA4 tracking (all pages)
- Easier to maintain (one file vs 72 pages)

**Trigger:**
- Discovered GA4 script missing from homepage, about, episodes list, 404
- Root cause: Pages imported Header/Footer directly (bypassed BaseLayout)

**Solution:**
- Refactored all pages to use BaseLayout
- Removed duplicate HTML structure
- Centralized SEO meta tags, favicon, GA4 script

**Outcome:**
- ✅ All 72 pages use BaseLayout
- ✅ GA4 on every page
- ✅ 4 files refactored (404, about, episodes list, homepage)
- ✅ Zero duplicate HTML

---

### Decision: Google Analytics 4 (Not Google Analytics Universal)
**Date:** Day 6 (Session 10)
**Status:** ✅ Implemented

**Why:**
- GA Universal sunset (July 2023)
- GA4 is current standard
- Event-based tracking (better for modern SPAs, though not needed here)
- Future-proof

**Implementation:**
- Environment variable: `PUBLIC_GA_MEASUREMENT_ID`
- Conditional loading (only if env var set)
- Astro-specific script directives (`is:inline`, `define:vars`)

**Outcome:**
- ✅ GA4 tracking on all 72 pages
- ✅ Measurement ID: G-V74NXPXZWQ
- ✅ Privacy-friendly (no tracking in development)

---

## Framework Reusability

### Decision: Configuration-Driven Design (Sanity CMS, Not Hardcoded)
**Date:** Day 4
**Status:** ✅ Implemented

**Why:**
- Multiple podcast instances planned (Phase 3)
- Each podcast = different content, branding, URLs
- Content in CMS = zero code changes for new podcast
- Podcast owner can customize everything

**What's in Sanity:**
- Podcast name, tagline, description
- Logo, favicon
- Social links (Twitter/X, Discord, RSS)
- isActive toggle (active vs concluded shows)
- Patreon URL (monetization)

**What's NOT in Sanity (hardcoded for now):**
- Brand colors (Tailwind classes)
- Typography
- Layout structure
- (Deferred to Phase 2)

**Outcome:**
- ✅ Strange Water fully CMS-driven
- ✅ Zero hardcoded content in code
- ✅ Ready for multi-podcast deployment (Phase 3)

---

### Decision: Episode Slug Format (sw0, sw1, etc.)
**Date:** Day 5
**Status:** ✅ Implemented

**Why:**
- Short, clean URLs (/episodes/sw1 vs /episodes/episode-1-long-title)
- Predictable (easy to reference)
- Sortable (sw0 < sw1 < sw10)
- Podcast-specific prefix ("sw" = Strange Water)

**Implementation:**
- Prefix from podcast slug
- Number from episode number field
- Episode 0 = Trailer (sw0)

**Outcome:**
- ✅ All 69 episodes have clean slugs
- ✅ URLs short and memorable

---

## Deferred Decisions

### Decision: Sanity Studio Deployment → Deferred Indefinitely
**Original Date:** Day 4 (planned)
**Deferred Date:** Day 5
**Status:** ⏸️ Deferred

**Why Deferred:**
- Strange Water is archival (no ongoing updates)
- Local Studio sufficient for manual work
- Hosted Studio adds complexity (auth, deployment, maintenance)
- Not worth overhead for infrequent use

**When to Revisit:**
- Active podcasts (Phase 2) with weekly episodes
- Multiple content managers needing remote access

---

### Decision: Brand Color Customization via CMS → Deferred to Phase 2
**Original Date:** Phase 1 (considered)
**Deferred Date:** Phase 1 wrap-up
**Status:** ⏸️ Deferred

**Why Deferred:**
- Strange Water branding works with default colors
- Complex implementation (CSS custom properties or dynamic Tailwind)
- Not blocking Phase 1 launch
- Better to validate framework with 2-3 podcasts before generalizing

**When to Revisit:**
- Phase 3 (Framework generalization)
- After deploying 2nd podcast instance

**Options Under Consideration:**
1. CSS Custom Properties (simple, less Tailwind-native)
2. Dynamic Tailwind Config (native, complex build pipeline)

---

### Decision: Episode Artwork Automation → Deferred to Phase 2
**Original Date:** Phase 1 (discovered need during Day 5)
**Deferred Date:** Day 5
**Status:** ⏸️ Deferred

**Why Deferred:**
- Strange Water artwork uploaded manually (one-time task, acceptable)
- Automation requires research (Spotify API, RSS alternatives, webhooks)
- Not blocking Phase 1 launch
- Critical for active podcasts only

**Research Needed:**
- Spotify Web API episode metadata endpoints
- Alternative RSS sources (Apple Podcasts, YouTube)
- Webhook-based automation (ideal)

**When to Revisit:**
- Phase 2 (before deploying active podcast)
- Required for any podcast with ongoing episodes

**Success Criteria:**
- New episode published → Artwork auto-imported within 5 minutes
- Zero manual uploads for active podcasts

---

## Decision Log Guidelines

**When to Document a Decision:**
- Non-obvious technical choice
- Trade-off between 2+ approaches
- Deferred feature (with rationale)
- Pivot from original plan

**What to Include:**
- **Date:** When decided
- **Why:** Rationale, constraints, trade-offs
- **Alternatives:** What was considered and rejected
- **Outcome:** What happened (success criteria met?)

**What to Avoid:**
- Implementation details (those go in code comments or docs)
- Obvious choices (e.g., "used npm install to install packages")
- Bikeshedding (minor style preferences)

---

**For current status:** See `STATUS.md`
**For session history:** See `SESSIONS.md`
**For project orientation:** See `CONTEXT.md`
