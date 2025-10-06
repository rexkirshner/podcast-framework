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

## ✅ Day 5 - Data Migration - COMPLETE

**Status:** ✅ Complete
**Completed:** 2025-10-06

### Completed Tasks:
- [✅] **Task 5.2:** Deleted legacy episode page (`src/pages/episodes/1.astro`)
- [✅] **Task 5.3:** Created RSS import script - imported all 69 episodes automatically
- [✅] **Task 5.4:** Created guest scraper - imported 72 guests from strangewater.xyz
- [✅] **Task 5.5:** Automated guest-to-episode linking (63/67 auto-linked)
- [✅] **Task 5.6:** Data quality cleanup (removed 18 duplicate drafts)
- [✅] **Task 5.7:** Frontend UI fixes (HTML stripping, logo fallbacks, Spotify embeds)
- [✅] **BONUS:** Created reusable import scripts for framework
- [✅] **BONUS:** Fixed duration parsing (HH:MM:SS format from RSS)
- [✅] **BONUS:** Implemented sw[number] slug format
- [✅] **DEFERRED:** Task 5.1 (Sanity Studio deployment) indefinitely

**Day 5 Achievements:**
- ✅ 69 episodes fully imported with correct metadata
- ✅ 72 guests imported with social links
- ✅ 63 episodes auto-linked to guests
- ✅ All import scripts reusable across podcast projects
- ✅ Zero duplicates, clean dataset
- 🚧 Profile images: User uploading in Sanity Studio (in progress)

---

## 🎯 Immediate Next Steps (Days 6-7)

**Status:** In Progress
**Phase:** Phase 1b - Polish & QA
**Priority:** High

### Tasks:
- [✅] Host/Guest implementation (separate content types, side-by-side layout)
- [✅] Episode page layout refinements (description above player, platform links)
- [✅] Dynamic labels (Host/Hosts, Guest/Guests based on count)
- [ ] Manual upload of episode artwork to Sanity (Strange Water only - 69 episodes)
- [ ] Test sample of episode pages (verify all 69 work correctly)
- [ ] Verify responsive design on mobile and tablet
- [ ] Run Lighthouse audit (target: >90 performance)
- [ ] Test Spotify audio playback across browsers
- [ ] Verify all navigation links work correctly
- [ ] Check SEO meta tags on all page types
- [ ] Test 404 error page
- [ ] Verify social sharing (Open Graph, Twitter Cards)
- [ ] Final visual polish (spacing, typography, colors)
- [ ] Push to GitHub and verify staging deployment

---

## 🔮 Future Automation Requirements (Phase 2/3)

**Context:** Strange Water is a completed podcast (manual workflow acceptable)
**Priority:** Critical for active podcasts in Phase 2+

### Episode Artwork Automation

**Current Limitation:**
- RSS feed from Anchor.fm is no longer accessible (404 error)
- Episode artwork visible in Spotify embed but not imported to Sanity
- Strange Water: Manual upload acceptable (69 episodes, one-time task)
- **Future podcasts:** MUST have automated artwork import

**Required Solutions (Research & Implement in Phase 2):**

1. **Spotify Web API Integration** (Recommended)
   - [ ] Research Spotify Web API episode metadata endpoints
   - [ ] Create Spotify Developer account and app credentials
   - [ ] Build script to fetch episode data including artwork URLs
   - [ ] Implement artwork download and Sanity upload
   - [ ] Test with active podcast feed
   - **Pros:** Direct source of truth, high-quality images
   - **Cons:** Requires API credentials, rate limits

2. **Alternative RSS Sources** (Fallback)
   - [ ] Research Spotify RSS feed alternatives (if available)
   - [ ] Check Apple Podcasts RSS feed structure
   - [ ] Evaluate YouTube RSS feeds for video podcasts
   - [ ] Build multi-source RSS parser with fallbacks
   - **Pros:** No API credentials needed
   - **Cons:** Feed availability varies by platform

3. **Webhook-Based Automation** (Ideal)
   - [ ] Research podcast hosting platform webhooks (Spotify, Anchor, etc.)
   - [ ] Build webhook receiver endpoint
   - [ ] Implement automatic Sanity update on new episode publish
   - [ ] Include artwork, show notes, and all metadata
   - **Pros:** Real-time, zero manual work
   - **Cons:** Platform-dependent, complex setup

**Success Criteria for Phase 2:**
- New episode published → Artwork auto-imported within 5 minutes
- Zero manual uploads required for active podcasts
- Framework supports multiple podcast platforms (Spotify, Apple, YouTube)

**Documentation Needed:**
- API integration guide for Spotify/Apple
- Webhook setup instructions
- Troubleshooting guide for artwork import failures

---

## Current Focus

**Milestone:** Phase 1b - Polish & QA (Days 6-7)
**Goal:** Complete Strange Water launch with manual artwork upload

**Success Criteria:**
- ✅ Sanity Studio configured (local)
- ✅ Podcast, episode, and guest schemas created
- ✅ Astro can fetch data from Sanity
- ✅ All 69 episodes migrated to Sanity
- ✅ All 72 guests imported
- ✅ Guests linked to episodes
- ✅ Host schema created and implemented
- ✅ Episode page UI refinements complete
- ⏳ Episode artwork uploaded manually (Strange Water only)
- ⏳ All episode pages tested
- ⏳ Lighthouse audit passing
- ⏳ Ready for production launch

---

## Blockers

None currently. All prerequisites completed (PRD, Implementation Plan, Context System).

---

## 🔔 Upgrade Reminders

### Claude Context System v2.0.0 Upgrade
**Status:** Deferred to optimal window
**Version Available:** v2.0.0 (CONTEXT.md, STATUS.md, DECISIONS.md, QUICK_REF.md)
**Current Version:** v1.x (CLAUDE.md, SESSIONS.md)

**⚠️ PROACTIVE REMINDER TRIGGERS:**
1. **After Phase 1 launch complete** (Day 15+) - REMIND USER
2. **Before Phase 2 planning starts** (Day 16-20) - REMIND USER
3. **If context duplication pain emerges** - REMIND USER
4. **Before Phase 3 framework generalization** - REMIND USER

**Why upgrade eventually:**
- Eliminates status duplication across files
- Single source of truth (STATUS.md)
- Decision log for "why" (DECISIONS.md)
- Streamlined 2-tier workflow
- Auto-generated dashboard (QUICK_REF.md)

**Upgrade command:** `/update-context-system`

---

## Notes

- Reference `IMPLEMENTATION_PLAN.md` for complete Day 1-60 task breakdown
- Each task designed for 30min-2 hours (half-day blocks)
- Deploy to staging 3-5 times per day (continuous deployment)
- Run `/quick-save-context` after every 2-3 completed tasks
- Run `/save-context` at end of each sub-phase (1a, 1b, 1c, etc.)

---

**Last Updated:** 2025-10-06 (Day 5 - Data Migration Complete)
