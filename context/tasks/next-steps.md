# Next Steps

Current action items and priorities. Reference `IMPLEMENTATION_PLAN.md` for full 120+ task breakdown.

---

## ✅ Phase 1a - COMPLETE (Days 1-3)

**Status:** ✅ Complete
**Completed:** 2025-10-05

### Day 1 - Project Setup & First Deploy

### Completed Tasks (Day 1):
- [✅] **Task 1.1:** Create GitHub repository `podcast-framework`
- [✅] **Task 1.2:** Run `npm create astro@latest` (select minimal template, TypeScript)
- [✅] **Task 1.3:** Install Tailwind CSS (`npx astro add tailwind`)
- [✅] **Task 1.4:** Create `.env.example` file (empty for now)
- [✅] **Task 1.5:** Update `README.md` with project name, purpose
- [✅] **Task 1.6:** Initial commit + push to GitHub
- [✅] **Task 1.7:** Create Netlify account, connect to GitHub repo
- [✅] **Task 1.8:** Configure Netlify build settings (Astro defaults)
- [✅] **Task 1.9:** Deploy to Netlify (default domain `random-name.netlify.app`)
- [✅] **Task 1.10:** Verify site loads ("Astro" default page)
- [✅] **Task 1.11:** Configure custom subdomain `staging.strangewater.xyz` (DNS setup)

### Day 2 - First Episode Page

**Completed Tasks (Day 2):**
- [✅] **Task 2.1:** Create hardcoded episode page layout at `/episodes/1`
- [✅] **Task 2.2:** Add basic header component
- [✅] **Task 2.3:** Add basic footer component
- [✅] **Task 2.4:** Embed Spotify audio player (iframe) in episode page
- [✅] **Task 2.5:** Style with Tailwind CSS (basic layout, responsive)
- [✅] **Task 2.6:** Test audio playback in development
- [✅] **Task 2.7:** Deploy to staging (git push)
- [✅] **Task 2.8:** Verify responsive design (mobile, tablet, desktop)
- [✅] **Task 2.9:** Update homepage to link to episode page
- [✅] **Fix:** Import Tailwind CSS in pages

### Day 3 - Complete Phase 1a

**Completed Tasks (Day 3):**
- [✅] Create episodes list page at `/episodes`
- [✅] Add About page at `/about`
- [✅] Create 404 error page
- [✅] Test all navigation links work
- [✅] Verify mobile responsiveness on all pages
- [✅] Add favicon and meta tags (BaseLayout component)
- [✅] Deploy and verify staging site
- [✅] Update context documentation for Day 3

**Phase 1a Checkpoint Achieved:**
- ✅ Site accessible at `staging.strangewater.xyz`
- ✅ Homepage shows 1 episode
- ✅ Can click episode, see episode page
- ✅ Build/deploy pipeline working
- ✅ All navigation working
- ✅ SEO meta tags in place
- ✅ Responsive design verified

---

## ✅ Day 4 - Sanity CMS Integration - COMPLETE

**Status:** ✅ Complete
**Completed:** 2025-10-05

### Completed Tasks:
- [✅] **Task 4.1:** Initialize Sanity project (manual setup due to CLI auth issues)
- [✅] **Task 4.2:** Create podcast schema with isActive toggle
- [✅] **Task 4.3:** Create episode schema with all fields
- [✅] **Task 4.4:** Create guest schema
- [✅] **Task 4.5:** Configure Sanity Studio locally
- [✅] **Task 4.7:** Install Sanity client packages
- [✅] **Task 4.8:** Create Sanity client utility (`src/lib/sanity.ts`)
- [✅] **Task 4.9:** Write GROQ queries for all content types
- [✅] **Task 4.10:** Add sample content (podcast, guest, episode 1)
- [✅] **Task 4.11:** Update all pages to fetch from Sanity
- [✅] **Task 4.12:** Update `.env.example` with Sanity project ID
- [✅] **BONUS:** Created centralized config system (`src/config/site.ts`)
- [✅] **BONUS:** Implemented dynamic routing with `[slug].astro`
- [✅] **BONUS:** Added isActive toggle for concluded vs active shows

**Day 4 Achievements:**
- ✅ All pages fetch from Sanity at build time
- ✅ Dynamic episode routing working
- ✅ Cover images with fallback
- ✅ Logo from Sanity in header
- ✅ Sample content verified
- ✅ Committed and pushed to GitHub

---

## 🎯 Immediate Next Steps (Day 5+)

**Status:** Ready to Start
**Phase:** Phase 1b - Content Migration
**Priority:** High

### Tasks:
- [ ] **Task 5.1:** Deploy Sanity Studio to hosted URL (`npm run sanity:deploy`)
  - Choose hostname (e.g., "strangewater")
  - Will be accessible at `https://strangewater.sanity.studio`
  - **Note:** Can be done anytime - local Studio works fine for now
- [ ] **Task 5.2:** Delete legacy episode page (`src/pages/episodes/1.astro`)
- [ ] **Task 5.3:** Bulk import 69 Strange Water episodes to Sanity
- [ ] **Task 5.4:** Add all guest information
- [ ] **Task 5.5:** Upload episode cover images
- [ ] **Task 5.6:** Test all episode pages load correctly
- [ ] **Task 5.7:** Verify site performance with full dataset

---

## Current Focus

**Milestone:** Phase 1b - Sanity CMS Integration (Days 4-7)
**Goal:** Migrate all episode data to Sanity, complete CMS integration

**Success Criteria:**
- ✅ Sanity Studio configured (local or hosted)
- ✅ Podcast, episode, and guest schemas created
- ✅ Astro can fetch data from Sanity
- ✅ Sample content in Sanity Studio
- ✅ GROQ queries working
- ⏳ All 69 episodes migrated to Sanity
- ⏳ Sanity Studio deployed (optional)

---

## Blockers

None currently. All prerequisites completed (PRD, Implementation Plan, Context System).

---

## Notes

- Reference `IMPLEMENTATION_PLAN.md` for complete Day 1-60 task breakdown
- Each task designed for 30min-2 hours (half-day blocks)
- Deploy to staging 3-5 times per day (continuous deployment)
- Run `/quick-save-context` after every 2-3 completed tasks
- Run `/save-context` at end of each sub-phase (1a, 1b, 1c, etc.)

---

**Last Updated:** 2025-10-05 (Day 4 - Sanity Integration Complete)
