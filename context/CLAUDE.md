# Podcast Website Framework - Developer Guide

**Project Type:** Web Application (Astro + Sanity CMS + Netlify)
**Status:** Phase 1b - Polish & QA (Day 6 in progress)
**Owner:** Rex Kirshner
**Last Updated:** 2025-10-06

---

## Project Overview

Building a **reusable podcast website framework** to replace Strange Water (strangewater.xyz) and enable rapid deployment of future podcast sites.

**Dual Goals:**
1. **Immediate:** Launch performant, SEO-optimized Strange Water site (69 episodes, archival)
2. **Strategic:** Build reusable template for deploying new podcasts in <4 hours

**Current State:** Planning complete, implementation starts Day 1

---

## Tech Stack

**Frontend:** Astro (SSG, zero-JS by default, SEO-optimized)
**CMS:** Sanity.io (real-time collaboration, customizable Studio, GROQ queries)
**Hosting:** Netlify (free tier, 300 build min/month, instant rollbacks)
**Styling:** Tailwind CSS
**Language:** TypeScript
**Analytics:** Google Analytics 4
**Error Monitoring:** Sentry (free tier)

**Key Integrations:**
- Patreon (monetization widget)
- ConvertKit (newsletter, Phase 2)
- OpenAI Whisper API (transcripts, Phase 2)
- Subscribe CTAs (Spotify, Apple, YouTube, RSS)

---

## Architecture Overview

**Build Flow:**
1. Content published in Sanity Studio
2. Sanity webhook → Netlify build hook
3. Astro generates static HTML (build time: ~3-5 min)
4. Deploy to Netlify CDN

**Configuration-Driven Design:**
- `config/theme.json` - Colors, fonts, branding, monetization URLs
- `sanity/` - Content models (episodes, guests, pages)
- `src/` - Framework components (reusable across podcasts)
- `public/` - Instance-specific assets (logos, favicons)

**Multi-Podcast Strategy:**
- Each podcast = separate Sanity project (clean permissions, no cross-contamination)
- Each podcast = separate repository (cloned from template)
- Template evolves: Strange Water (Phase 1) → Generic framework (Phase 2-3)

---

## Development Methodology

**Iterative, Small-Step Approach:**
- ✅ Vertical slices (working episode page Day 2, not scaffolded pages Week 2)
- ✅ Deploy continuously from Day 1 (3-5 deploys/day to staging)
- ✅ Half-day tasks (2-4 hours each, not week-long tasks)
- ✅ Each increment: demonstrable, testable, deployable, valuable
- ✅ Refactor as we learn, don't over-engineer upfront

**Anti-Patterns to Avoid:**
- ❌ Building all components before wiring them together
- ❌ Waiting weeks before first deploy
- ❌ Large PRs changing 50 files
- ❌ "It'll all come together in Week 4"

**Daily Rhythm:**
- Morning: Pick 1-3 tasks from current sub-phase
- Afternoon: Ship to staging, verify, demo
- End of day: Working site exists (even if incomplete)

---

## Key Commands

**Setup (Day 1):**
```bash
npm create astro@latest           # Initialize Astro project
npx astro add tailwind            # Add Tailwind CSS
npm create sanity@latest          # Initialize Sanity CMS
sanity dev                        # Run Sanity Studio locally
```

**Development:**
```bash
npm run dev                       # Start Astro dev server (localhost:4321)
sanity dev                        # Start Sanity Studio (localhost:3333)
npm run build                     # Build for production
```

**Deployment:**
```bash
git push                          # Auto-deploys to Netlify (develop → staging, main → production)
sanity deploy                     # Deploy hosted Sanity Studio
```

**Context System:**
```bash
/save-context                     # Capture major work changes
/quick-save-context              # Fast checkpoints during coding
/review-context                  # Verify documentation continuity
/code-review                     # Comprehensive code audit
```

---

## Core Development Methodology

**Simplicity First:**
- Prefer simple solutions over clever ones
- No temporary fixes - root cause only
- Minimal impact changes (smallest possible scope)
- Full code tracing (understand before changing)

**Quality Standards:**
- Test before commit (coverage target: >80% for critical paths)
- No secrets in code (use environment variables)
- Accessibility (WCAG 2.1 AA compliance)
- Performance (Lighthouse >90 all metrics)

**Workflow Rules:**
- Require plan approval before major changes
- Require push approval (no auto-push to remote)
- Use TodoList for task tracking
- Document decisions as we make them

---

## Current Status

**Phase:** Phase 1b - Polish & QA (Day 6 in progress)
**Next Milestone:** Production Launch (Day 15)

**Completed in Session 2025-10-06G (Day 6 - Host Implementation & Episode Cover Upload):**
- ✅ Episode-specific Spotify embeds (per-episode audio players)
- ✅ Host content type created (independent from guests)
- ✅ Rex Kirshner added as host to all 68 episodes
- ✅ Episode page UI refinements (hosts/guests side-by-side)
- ✅ Dynamic labels (Host/Hosts, Guest/Guests based on count)
- ✅ Episode description moved above player
- ✅ Platform links styling (removed background)
- ✅ Episode cover automation documentation (AUTOMATION_NOTES.md)
- ✅ Automated episode cover upload (66/68 covers uploaded)
- ✅ All changes committed and pushed to GitHub (7 commits)

**Completed in Session 2025-10-06F (Day 5 - Code Review Fixes):**
- ✅ Code review fixes (5 critical issues: M4, C1, H2, M1, H4)
- ✅ Environment variables pattern (all scripts + frontend)
- ✅ Shared utilities extracted (formatDate, stripHTML)
- ✅ Mobile menu implemented (functional navigation)
- ✅ Delete confirmation added (safety)
- ✅ HTML entity decoding (fixes &#39; display issues)
- ✅ Missing _key fix (Sanity guest editing unblocked)
- ✅ Trailer detection (episode 0, episode 1 restored)
- ✅ Automated guest photo upload (65/71 uploaded)
- ✅ Background process cleanup (11 duplicates killed)

**Completed in Session 2025-10-06E (Day 5 - Data Migration):**
- ✅ RSS import script - 69 episodes imported automatically
- ✅ Guest web scraper - 72 guests imported from strangewater.xyz
- ✅ Automated guest-to-episode linking (63/67 auto-linked)
- ✅ Data quality cleanup (removed 18 duplicate drafts)
- ✅ Frontend UI fixes (HTML stripping, logo fallbacks, Spotify embeds)
- ✅ sw[number] slug format (clean, short URLs)
- ✅ Duration parsing fixed (HH:MM:SS format from RSS)
- ✅ All scripts reusable across podcast projects

**Sanity CMS Data:**
- 69 episodes (all metadata, correct durations, clean slugs)
- 72 guests (names, social links, 65 profile photos uploaded)
- 1 host (Rex Kirshner, linked to all 68 episodes)
- 63 episodes linked to guests automatically
- All guest/host arrays have _key property (editing functional)
- Episode covers: 66/68 uploaded (Episode 0 and 40 missing source files)
- Episode-specific Spotify embeds (per-episode audio players)
- Trailer = episode 0, episode 1 restored
- Profile images: 65 uploaded, 6 manual uploads pending

**Import Scripts (Framework Feature):**
- `scripts/import-from-rss.js` - RSS feed parser & episode importer
- `scripts/import-guests-from-web.js` - Web scraper for guest data
- `scripts/link-guests-to-episodes.js` - Automated guest-episode linking
- `scripts/delete-all-episodes.js` - Bulk delete utility (with confirmation)
- `scripts/check-duplicate-guests.js` - Duplicate detection
- `scripts/delete-draft-guests.js` - Draft cleanup
- `scripts/fix-draft-references.js` - Reference repair
- `scripts/fix-guests-keys.js` - Add _key to guest arrays
- `scripts/upload-guest-photos.js` - Automated photo upload
- `scripts/create-rex-host.js` - Create host record with deterministic ID
- `scripts/add-rex-to-all-episodes.js` - Bulk host assignment
- `scripts/upload-episode-covers.js` - Automated episode cover upload
- `scripts/check-episode-guests.js` - Diagnostic utility for guest data

**Key Commands:**
- `npm run import:rss` - Import/update episodes from RSS
- `npm run import:guests` - Scrape and import guests
- `npm run link:guests` - Auto-link guests to episodes
- `npm run delete:episodes` - Clean slate for re-import
- `npm run fix:guests-keys` - Fix missing _key properties
- `npm run upload:photos` - Upload guest photos
- `npm run upload:covers` - Upload episode cover images

**Dev Servers:**
- Astro: http://localhost:4322/ (all 69 episodes live)
- Sanity Studio: http://localhost:3333/ (local, not yet deployed)

**Next Steps (Days 6-7 - Polish & QA):**
1. Test sample of episode pages (verify all 69 work correctly)
2. Verify responsive design on mobile/tablet
3. Run Lighthouse audit (target: Performance >90)
4. Test Spotify audio playback across browsers
5. Verify all navigation links work correctly
6. Check SEO meta tags on all page types
7. Test 404 error page
8. Verify social sharing (Open Graph, Twitter Cards)
9. Final visual polish (spacing, typography, colors)
10. Push to staging and verify deployment

---

## Communication Preferences

**Style:** Concise, high-level summaries (skip preamble unless complex)
**Code References:** Always include line numbers (`file.ts:42`)
**Emojis:** No (unless explicitly requested)
**Explanations:** Only for complex logic (simple code speaks for itself)

**When Running Commands:**
- Explain non-trivial bash commands before running
- Verify directory structure before creating files/folders
- Use proper quoting for paths with spaces

**Git Workflow:**
- Never push without approval
- Always include Co-Authored-By for commits
- Create descriptive commit messages (why, not just what)
- Check authorship before amending commits

---

## Reference Documents

**Primary:**
- `context/PRD.md` - Complete strategic blueprint (all decisions, architecture, personas, metrics)
- `context/IMPLEMENTATION_PLAN.md` - Day-by-day execution guide (120+ tasks, Days 1-60)

**Context System:**
- `context/CLAUDE.md` - This file (developer guide)
- `context/SESSIONS.md` - Session history (what happened when)
- `context/tasks/next-steps.md` - Action items
- `context/tasks/todo.md` - Current session tasks
- `context/AUTOMATION_NOTES.md` - Episode artwork automation research (Phase 2)

**Archive:**
- `archive/pre-project-PRDs/` - All PRD draft versions (v1-v6, codex reviews)

---

## Success Metrics

**Phase 1 Launch (Day 15):**
- Lighthouse: Performance >90, SEO >95, Accessibility >90
- All 69 episodes migrated successfully
- Zero broken links/images
- Monetization CTAs operational (Patreon, subscribe)

**Framework Reusability (Phase 3):**
- Time to deploy new podcast: <4 hours (manual)
- Branding customization: <2 hours
- Component reuse rate: >80%

**Iteration Velocity:**
- Tasks completed per day: 8-12 (average ~10)
- Staging deploys per day: 3-5
- Days to first deploy: Day 1 (not Week 4!)

---

**Last Context Save:** 2025-10-06 Session G (Day 6 - Host Implementation & Episode Cover Upload Complete)
