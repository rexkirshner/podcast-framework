# Product Requirements Document (PRD) v4
## Podcast Website Framework

**Document Version:** 4.0
**Last Updated:** 2025-10-05
**Status:** Draft - Iteration Focus

---

## Document Change Log

| Version | Changes | Focus |
|---------|---------|-------|
| v1 | Initial PRD with tech stack, features, phased plan | Foundation |
| v2 | Added personas, analytics, accessibility, testing, compliance | Operations |
| v3 | Added project structure & organization strategy | Architecture |
| v4 | **Rewrote implementation plan with granular, iterative tasks** | **Execution** |

---

## 1. Executive Summary

This PRD outlines the development of a **reusable podcast website framework** to replace the current Strange Water podcast site (strangewater.xyz) hosted on PodcastPage.io. The framework will be deployed first for Strange Water (69 episodes, completed/archival series), then reused for future podcasts with customized branding and features.

### Dual Goals

1. **Immediate:** Launch performant, SEO-optimized Strange Water site (archival/marketing property)
2. **Strategic:** Build reusable framework/template enabling rapid deployment of future podcast websites

**Learning Feedback Loop:** Strange Water rollout serves as production validation for the framework. All architecture decisions, content workflows, and deployment processes will be documented and abstracted into the template for future shows.

### Development Methodology

**Iterative, Small-Step Approach:**
- ✅ Vertical slices (episode page working end-to-end) over horizontal layers (all pages scaffolded)
- ✅ Deploy continuously from Day 1 (staging), not waiting for "done"
- ✅ Smallest possible increments (half-day tasks, not week-long tasks)
- ✅ Each increment is testable, demonstrable, shippable
- ✅ Refactor as we learn, don't over-engineer upfront

**Anti-Patterns to Avoid:**
- ❌ Building all components before wiring them together
- ❌ Waiting weeks before first deploy
- ❌ Large PRs that change 50 files
- ❌ "It'll all come together in Week 4"

### Primary Audience Segments & Business Goals

| Segment | Needs | Business Goals |
|---------|-------|----------------|
| **Listeners** | Discover episodes, consume content, subscribe | ↑ Organic traffic, ↑ session duration, ↑ platform subscriptions |
| **Prospective Guests** | Learn about show, assess fit, submit pitch | ↑ High-quality guest applications, ↓ outreach effort |
| **Partners/Sponsors** | Validate audience, assess brand alignment | ↑ Sponsorship inquiries, ↑ Patreon conversions |
| **Content Operators** | Publish episodes efficiently, update content | ↓ Time to publish, ↓ technical friction, ↑ content quality |

### Out of Scope (Phase 1)

- ❌ Paid membership/premium content tiers
- ❌ Community forums or user-generated content (beyond forms)
- ❌ Advanced analytics dashboard (custom reporting)
- ❌ Mobile apps (native iOS/Android)
- ❌ Live streaming or real-time episode publishing
- ❌ Podcast hosting (RSS generation, audio distribution)

### Framework Reusability KPIs

- ⏱ **Time to Deploy New Podcast:** <4 hours from zero to production-ready
- 🎨 **Branding Customization Effort:** <2 hours (colors, fonts, logos, copy)
- ✅ **Launch Checklist Completion:** 100% automated checks (SEO, performance, accessibility)
- 📊 **Content Migration Speed:** <1 hour per 50 episodes (scripted import)

---

## 2. Background & Current State

### Current Site Analysis (strangewater.xyz)
**Strengths:**
- Clean, modern design
- Comprehensive guest profiles with images
- Multiple platform subscription options
- Responsive mobile layout
- Good episode metadata display

**Limitations:**
- Paid service ($) with limited flexibility
- Performance constraints
- Cannot customize features
- No control over hosting/infrastructure
- Limited monetization options
- No analytics access or customization

**Current URL Structure (to preserve via redirects):**
- Homepage: `/`
- Episodes: `/episodes`
- Individual Episode: `/episode/[slug]`
- Guests: `/guests`
- Individual Guest: `/person/[slug]`
- About: `/about`

### User Context
- **Site Owner:** High technical proficiency (can manage complex systems)
- **Future Operators:** Entry-level/junior staff (non-technical content coordinators)
- **Strange Water Status:** 69 episodes, ceased production (archival site)
- **Future Podcasts:** Active production, require growth/engagement features

---

_[Sections 3-10 remain identical to v3, covering Personas, Project Structure, Technical Architecture, Theming, Content Migration, Functional Requirements, SEO Strategy, Analytics, and Accessibility]_

---

## 11. Phased Implementation Plan (REVISED - Granular & Iterative)

### Implementation Philosophy

**Every increment should be:**
1. **Demonstrable:** Can show working output
2. **Testable:** Can verify it works
3. **Deployable:** Can push to staging immediately
4. **Valuable:** Moves us closer to launch

**Daily Rhythm:**
- Morning: Pick 1-3 tasks from current sub-phase
- Afternoon: Ship to staging, verify, demo
- End of day: Working site exists (even if incomplete)

### Phase 1: Strange Water MVP (4 Weeks)

Broken into **sub-phases** delivering vertical slices:

---

### **Phase 1a: "Hello World" - Deployed Site (Days 1-3)**

**Goal:** Working Astro site deployed to staging with 1 hardcoded episode visible.

**Success Criteria:**
- ✅ Site accessible at `staging.strangewater.xyz`
- ✅ Homepage shows 1 episode
- ✅ Can click episode, see episode page
- ✅ Build/deploy pipeline working

#### **Day 1: Project Setup & First Deploy**

**Morning (2-3 hours):**
- [ ] **Task 1.1:** Create GitHub repository `podcast-framework`
- [ ] **Task 1.2:** Run `npm create astro@latest` (select minimal template, TypeScript)
- [ ] **Task 1.3:** Install Tailwind CSS (`npx astro add tailwind`)
- [ ] **Task 1.4:** Create `.env.example` file (empty for now)
- [ ] **Task 1.5:** Update `README.md` with project name, purpose
- [ ] **Task 1.6:** Initial commit + push to GitHub

**Afternoon (2-3 hours):**
- [ ] **Task 1.7:** Create Netlify account, connect to GitHub repo
- [ ] **Task 1.8:** Configure Netlify build settings (Astro defaults)
- [ ] **Task 1.9:** Deploy to Netlify (default domain `random-name.netlify.app`)
- [ ] **Task 1.10:** Verify site loads ("Astro" default page)
- [ ] **Task 1.11:** Configure custom subdomain `staging.strangewater.xyz` (DNS setup)

**End of Day 1 Checkpoint:**
- ✅ Deployed site accessible at staging URL
- ✅ GitHub → Netlify auto-deploy working
- ✅ Can make change, push, see update (test deployment pipeline)

#### **Day 2: First Episode Page (Hardcoded)**

**Morning (3-4 hours):**
- [ ] **Task 2.1:** Create `src/pages/episodes/test-episode.astro`
- [ ] **Task 2.2:** Hardcode episode data in frontmatter (title, date, description, audio URL from Spotify)
- [ ] **Task 2.3:** Build basic episode page layout (HTML structure)
  - Title (h1)
  - Publish date
  - Description paragraph
  - Placeholder for audio player
- [ ] **Task 2.4:** Add Tailwind styling (typography, spacing)
- [ ] **Task 2.5:** Deploy to staging, verify `/episodes/test-episode` loads

**Afternoon (2-3 hours):**
- [ ] **Task 2.6:** Embed Spotify player (iframe embed code)
- [ ] **Task 2.7:** Test audio playback in browser
- [ ] **Task 2.8:** Add basic header (site name, nav placeholder)
- [ ] **Task 2.9:** Add basic footer (copyright)
- [ ] **Task 2.10:** Deploy, verify header/footer show on episode page

**End of Day 2 Checkpoint:**
- ✅ Episode page exists with working audio player
- ✅ Basic header/footer in place
- ✅ Page looks acceptable (not polished, but functional)

#### **Day 3: Homepage with Episode List (Hardcoded)**

**Morning (2-3 hours):**
- [ ] **Task 3.1:** Create `src/components/EpisodeCard.astro`
- [ ] **Task 3.2:** Accept props (title, date, slug, description)
- [ ] **Task 3.3:** Style episode card (image placeholder, text, "Listen" link)
- [ ] **Task 3.4:** Update `src/pages/index.astro` (homepage)
- [ ] **Task 3.5:** Hardcode array of 3 episode objects in frontmatter
- [ ] **Task 3.6:** Map over episodes, render `<EpisodeCard>` for each
- [ ] **Task 3.7:** Deploy, verify homepage shows 3 episode cards

**Afternoon (2-3 hours):**
- [ ] **Task 3.8:** Create `src/layouts/BaseLayout.astro`
- [ ] **Task 3.9:** Move header/footer to BaseLayout
- [ ] **Task 3.10:** Wrap homepage and episode page with BaseLayout
- [ ] **Task 3.11:** Add basic SEO meta tags (title, description) to BaseLayout
- [ ] **Task 3.12:** Deploy, verify both pages use shared layout

**End of Day 3 Checkpoint:**
- ✅ Homepage shows 3 episodes
- ✅ Clicking episode card navigates to episode page
- ✅ Shared layout (header/footer) across pages
- ✅ Basic SEO meta tags present
- ✅ **Milestone:** Deployed site looks like a real podcast site (even if hardcoded)

---

### **Phase 1b: "Sanity Integration" - Real Data (Days 4-7)**

**Goal:** Replace hardcoded data with Sanity CMS. Add 5 real episodes manually.

**Success Criteria:**
- ✅ Homepage shows episodes from Sanity
- ✅ Episode pages dynamically generated from Sanity
- ✅ Can add episode in Sanity Studio, appears on site after rebuild

#### **Day 4: Sanity Setup & Schema**

**Morning (2-3 hours):**
- [ ] **Task 4.1:** Create Sanity account at sanity.io
- [ ] **Task 4.2:** Run `npm create sanity@latest` in project root
- [ ] **Task 4.3:** Configure Sanity project (name: "Strange Water", dataset: "production")
- [ ] **Task 4.4:** Create `sanity/schemas/episode.ts` schema
  - Fields: title, slug, episodeNumber, publishDate, audioUrl, showNotes
- [ ] **Task 4.5:** Register episode schema in `sanity/schemas/index.ts`
- [ ] **Task 4.6:** Run `sanity dev` locally, verify Studio loads

**Afternoon (2-3 hours):**
- [ ] **Task 4.7:** Add 1 episode manually in Sanity Studio (test data)
- [ ] **Task 4.8:** Install `@sanity/client` in Astro project
- [ ] **Task 4.9:** Create `src/lib/sanity.ts` client config
- [ ] **Task 4.10:** Add Sanity env vars to `.env` (project ID, dataset)
- [ ] **Task 4.11:** Write GROQ query to fetch all episodes
- [ ] **Task 4.12:** Test query in Sanity Vision (verify returns data)

**End of Day 4 Checkpoint:**
- ✅ Sanity Studio running locally
- ✅ 1 episode entered in Sanity
- ✅ Sanity client configured in Astro
- ✅ Can fetch episode from Sanity (log to console to verify)

#### **Day 5: Dynamic Episode Pages**

**Morning (3-4 hours):**
- [ ] **Task 5.1:** Update `src/pages/episodes/[slug].astro` (dynamic route)
- [ ] **Task 5.2:** Implement `getStaticPaths()` to fetch all episode slugs
- [ ] **Task 5.3:** Fetch individual episode data by slug in page frontmatter
- [ ] **Task 5.4:** Replace hardcoded data with Sanity data
- [ ] **Task 5.5:** Deploy, verify `/episodes/[first-episode-slug]` loads

**Afternoon (2-3 hours):**
- [ ] **Task 5.6:** Update homepage `src/pages/index.astro` to fetch episodes from Sanity
- [ ] **Task 5.7:** Remove hardcoded episode array
- [ ] **Task 5.8:** Deploy, verify homepage shows episode from Sanity
- [ ] **Task 5.9:** Add 4 more episodes manually in Sanity Studio (total: 5 episodes)
- [ ] **Task 5.10:** Trigger rebuild, verify all 5 episodes show on homepage

**End of Day 5 Checkpoint:**
- ✅ Homepage dynamically shows episodes from Sanity
- ✅ Episode pages dynamically generated from Sanity
- ✅ Adding episode in Sanity → rebuilds site → appears live
- ✅ **Milestone:** Site is now fully dynamic (no hardcoded content)

#### **Day 6-7: Guest Schema & Pages**

**Day 6 Morning (3 hours):**
- [ ] **Task 6.1:** Create `sanity/schemas/guest.ts` schema
  - Fields: name, slug, bio, photo, socialLinks (array)
- [ ] **Task 6.2:** Update Episode schema to reference Guests (array of references)
- [ ] **Task 6.3:** Deploy Sanity schema updates (`sanity deploy`)
- [ ] **Task 6.4:** Add 3 guests manually in Sanity Studio
- [ ] **Task 6.5:** Link guests to existing episodes

**Day 6 Afternoon (3 hours):**
- [ ] **Task 6.6:** Create `src/pages/guests/[slug].astro` (dynamic guest page)
- [ ] **Task 6.7:** Implement `getStaticPaths()` for guests
- [ ] **Task 6.8:** Fetch guest data + episodes featuring guest
- [ ] **Task 6.9:** Build guest page layout (photo, bio, social links, episode list)
- [ ] **Task 6.10:** Deploy, verify guest page loads

**Day 7 Morning (2-3 hours):**
- [ ] **Task 7.1:** Create `src/pages/guests/index.astro` (guest directory)
- [ ] **Task 7.2:** Fetch all guests from Sanity
- [ ] **Task 7.3:** Create `src/components/GuestCard.astro`
- [ ] **Task 7.4:** Display guest grid with photos
- [ ] **Task 7.5:** Deploy, verify guest directory loads

**Day 7 Afternoon (2-3 hours):**
- [ ] **Task 7.6:** Update episode page to link to guest profiles
- [ ] **Task 7.7:** Update navigation (header) to include Episodes, Guests, About links
- [ ] **Task 7.8:** Create About page (`src/pages/about.astro`) with hardcoded content
- [ ] **Task 7.9:** Deploy, verify navigation works across all pages

**End of Day 7 Checkpoint:**
- ✅ Guest directory live
- ✅ Guest profiles with episodes featuring them
- ✅ Episode pages link to guests
- ✅ Navigation works across all pages
- ✅ **Milestone:** Core content types (episodes, guests) fully implemented

---

### **Phase 1c: "Content Migration" - All 69 Episodes (Days 8-11)**

**Goal:** Import all 69 Strange Water episodes + guests into Sanity. Site fully populated.

**Success Criteria:**
- ✅ All 69 episodes live on site
- ✅ All guests imported with photos
- ✅ Episode pages render correctly with real data
- ✅ No broken links or missing images

#### **Day 8-9: Migration Script Development**

**Day 8 Morning (3-4 hours):**
- [ ] **Task 8.1:** Scrape strangewater.xyz with Puppeteer (export episode list to JSON)
- [ ] **Task 8.2:** Extract episode data: title, slug, description, publish date, audio URL
- [ ] **Task 8.3:** Save scraped data to `data/episodes-raw.json`
- [ ] **Task 8.4:** Manually review 10 episodes for data quality

**Day 8 Afternoon (3 hours):**
- [ ] **Task 8.5:** Fetch Spotify RSS feed for Strange Water
- [ ] **Task 8.6:** Parse RSS XML to extract audio URLs, durations
- [ ] **Task 8.7:** Merge scraped data with RSS data (match by title or date)
- [ ] **Task 8.8:** Save merged data to `data/episodes-merged.json`

**Day 9 Morning (3-4 hours):**
- [ ] **Task 9.1:** Create `scripts/migrate-episodes.js`
- [ ] **Task 9.2:** Read `data/episodes-merged.json`
- [ ] **Task 9.3:** Transform data to Sanity Episode schema format
- [ ] **Task 9.4:** Use Sanity client to upload 5 episodes (test batch)
- [ ] **Task 9.5:** Verify 5 episodes appear in Sanity Studio

**Day 9 Afternoon (3 hours):**
- [ ] **Task 9.6:** Scrape guest data from strangewater.xyz
- [ ] **Task 9.7:** Extract guest names, photos, bios, social links
- [ ] **Task 9.8:** Save to `data/guests-raw.json`
- [ ] **Task 9.9:** Create `scripts/migrate-guests.js`
- [ ] **Task 9.10:** Upload 10 guests to Sanity (test batch)

#### **Day 10: Full Migration Execution**

**Morning (2-3 hours):**
- [ ] **Task 10.1:** Run `scripts/migrate-guests.js` for all guests
- [ ] **Task 10.2:** Verify all guests in Sanity Studio (manual spot-check 10)
- [ ] **Task 10.3:** Download missing guest photos (if any scraped URLs broken)
- [ ] **Task 10.4:** Upload missing photos to Sanity

**Afternoon (3-4 hours):**
- [ ] **Task 10.5:** Run `scripts/migrate-episodes.js` for all 69 episodes
- [ ] **Task 10.6:** Monitor for errors (log failures to `data/migration-errors.log`)
- [ ] **Task 10.7:** Retry failed episodes manually (if any)
- [ ] **Task 10.8:** Trigger Netlify rebuild

**Evening:**
- [ ] **Task 10.9:** Wait for build to complete (~5-10 min)
- [ ] **Task 10.10:** Verify staging site shows 69 episodes

**End of Day 10 Checkpoint:**
- ✅ All 69 episodes imported to Sanity
- ✅ All guests imported with photos
- ✅ Staging site shows full episode archive
- ✅ **Milestone:** Site is content-complete

#### **Day 11: Data Validation & Fixes**

**Morning (3-4 hours):**
- [ ] **Task 11.1:** Create `scripts/validate-content.js`
- [ ] **Task 11.2:** Check all episodes have: title, audio URL, publish date, show notes (>50 words)
- [ ] **Task 11.3:** Generate validation report (`data/validation-report.json`)
- [ ] **Task 11.4:** Review report, identify issues (missing audio, short show notes, etc.)
- [ ] **Task 11.5:** Manually fix top 10 most critical issues in Sanity

**Afternoon (2-3 hours):**
- [ ] **Task 11.6:** Spot-check 15 random episode pages (click through, verify data)
- [ ] **Task 11.7:** Spot-check 10 random guest pages
- [ ] **Task 11.8:** Test audio playback on 5 episodes (different browsers)
- [ ] **Task 11.9:** Document any remaining issues in GitHub Issues
- [ ] **Task 11.10:** Trigger rebuild, final verification

**End of Day 11 Checkpoint:**
- ✅ Data validation complete
- ✅ Critical issues fixed
- ✅ Spot-check passed
- ✅ Audio playback verified
- ✅ **Milestone:** Content migration DONE

---

### **Phase 1d: "SEO & Performance" - Production Ready (Days 12-15)**

**Goal:** Optimize for SEO, performance, accessibility. Production launch.

**Success Criteria:**
- ✅ Lighthouse Performance >90, SEO >95, Accessibility >90
- ✅ Schema.org markup implemented
- ✅ Sitemap generated and submitted
- ✅ 301 redirects configured
- ✅ Google Analytics tracking

#### **Day 12: SEO Foundation**

**Morning (3-4 hours):**
- [ ] **Task 12.1:** Create `src/components/SEO.astro` component
- [ ] **Task 12.2:** Add meta tags: title, description, canonical URL
- [ ] **Task 12.3:** Add Open Graph tags (og:title, og:description, og:image, og:url)
- [ ] **Task 12.4:** Add Twitter Card tags
- [ ] **Task 12.5:** Integrate SEO component into BaseLayout
- [ ] **Task 12.6:** Test meta tags with OpenGraph debugger

**Afternoon (3 hours):**
- [ ] **Task 12.7:** Implement Schema.org JSON-LD for PodcastSeries (homepage)
- [ ] **Task 12.8:** Implement Schema.org JSON-LD for PodcastEpisode (episode pages)
- [ ] **Task 12.9:** Implement Schema.org JSON-LD for Person (guest pages)
- [ ] **Task 12.10:** Validate structured data with Google Rich Results Test
- [ ] **Task 12.11:** Deploy, verify structured data shows in validator

**End of Day 12 Checkpoint:**
- ✅ Meta tags on all pages
- ✅ Schema.org markup implemented
- ✅ Validation passed (zero errors)

#### **Day 13: Sitemap, Redirects, Analytics**

**Morning (2-3 hours):**
- [ ] **Task 13.1:** Install `@astrojs/sitemap` integration
- [ ] **Task 13.2:** Configure sitemap generation (all episode/guest pages)
- [ ] **Task 13.3:** Deploy, verify `/sitemap-index.xml` exists
- [ ] **Task 13.4:** Update `robots.txt` to reference sitemap
- [ ] **Task 13.5:** Submit sitemap to Google Search Console

**Afternoon (2-3 hours):**
- [ ] **Task 13.6:** Configure 301 redirects in `netlify.toml`
  - `/episode/* → /episodes/:splat`
  - `/person/* → /guests/:splat`
- [ ] **Task 13.7:** Deploy, test redirects (visit old URLs, verify redirects)
- [ ] **Task 13.8:** Create Google Analytics 4 property
- [ ] **Task 13.9:** Add GA4 tracking script to BaseLayout
- [ ] **Task 13.10:** Verify pageview tracking in GA4 Real-Time report

**End of Day 13 Checkpoint:**
- ✅ Sitemap submitted to Google
- ✅ Redirects configured and tested
- ✅ Analytics tracking verified

#### **Day 14: Performance Optimization**

**Morning (3-4 hours):**
- [ ] **Task 14.1:** Run Lighthouse audit (baseline scores)
- [ ] **Task 14.2:** Optimize images with `@astrojs/image` (convert to WebP, responsive srcset)
- [ ] **Task 14.3:** Implement lazy loading for images below fold
- [ ] **Task 14.4:** Add font-display: swap to font declarations
- [ ] **Task 14.5:** Inline critical CSS for above-the-fold content

**Afternoon (2-3 hours):**
- [ ] **Task 14.6:** Minify CSS/JS (Astro default, verify enabled)
- [ ] **Task 14.7:** Lazy-load audio player (only when scrolled into view)
- [ ] **Task 14.8:** Deploy, run Lighthouse again
- [ ] **Task 14.9:** Review Performance score (target >90)
- [ ] **Task 14.10:** Fix any remaining issues (largest contentful paint, CLS)

**End of Day 14 Checkpoint:**
- ✅ Lighthouse Performance >90
- ✅ Images optimized (WebP, lazy loading)
- ✅ Fonts optimized
- ✅ **Milestone:** Performance targets met

#### **Day 15: Accessibility, Polish & Production Launch**

**Morning (3 hours):**
- [ ] **Task 15.1:** Run axe DevTools accessibility scan
- [ ] **Task 15.2:** Fix color contrast issues (text, buttons)
- [ ] **Task 15.3:** Add ARIA labels to audio player, nav
- [ ] **Task 15.4:** Test keyboard navigation (Tab through all pages)
- [ ] **Task 15.5:** Test with screen reader (VoiceOver or NVDA) on 3 pages
- [ ] **Task 15.6:** Fix focus indicators (visible outline on interactive elements)

**Afternoon (2-3 hours):**
- [ ] **Task 15.7:** Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] **Task 15.8:** Mobile device testing (iPhone, Android)
- [ ] **Task 15.9:** Final Lighthouse audit (Performance, SEO, Accessibility all >90)
- [ ] **Task 15.10:** Create production Netlify site
- [ ] **Task 15.11:** Point `strangewater.xyz` DNS to Netlify
- [ ] **Task 15.12:** Deploy to production

**Evening:**
- [ ] **Task 15.13:** Verify production site live at `strangewater.xyz`
- [ ] **Task 15.14:** Monitor analytics (first pageviews)
- [ ] **Task 15.15:** Monitor Sentry (zero errors expected)
- [ ] **Task 15.16:** Post-launch smoke tests (homepage, 5 episodes, 3 guests load)

**End of Day 15 Checkpoint:**
- ✅ Lighthouse scores: Performance >90, SEO >95, Accessibility >90
- ✅ Cross-browser/device tested
- ✅ Production site live at strangewater.xyz
- ✅ Analytics tracking verified
- ✅ **PHASE 1 COMPLETE: Strange Water site launched!**

---

### **Phase 1e: "Refinement" - Post-Launch (Days 16-20)**

**Goal:** Monitor, fix issues, refine based on real user data.

**Ongoing Tasks:**
- [ ] Monitor Google Search Console (404 errors, crawl issues)
- [ ] Monitor Google Analytics (traffic, top episodes, bounce rate)
- [ ] Monitor Sentry (JavaScript errors)
- [ ] Monitor Core Web Vitals (RUM data from GA4)
- [ ] Fix any bugs reported
- [ ] Improve episode pages based on analytics (which pages have high bounce?)
- [ ] Add any missing guest photos
- [ ] Optimize low-performing images

**Deliverable:** Stable, production site with <1% error rate

---

### **Phase 2: Enhancement (Weeks 5-8) - New Podcast Features**

**Goal:** Add features for future active podcasts (forms, newsletter, transcripts).

**Approach:** Same iterative methodology - small tasks, continuous deployment.

**Sub-Phases:**
- **Phase 2a (Days 21-25):** Newsletter signup form + ConvertKit integration
- **Phase 2b (Days 26-30):** "Request Episode" & "Ask Question" forms (Netlify Forms → Airtable)
- **Phase 2c (Days 31-35):** Transcript generation (Whisper API) for 10 test episodes
- **Phase 2d (Days 36-40):** Episode search/filter, related episodes, accessibility improvements

**Task Breakdown:** (Similar granularity to Phase 1, will detail when ready to execute)

---

### **Phase 3: Scale (Weeks 9-12) - Second Podcast Deployment**

**Goal:** Abstract Strange Water-specific code into reusable template. Deploy second podcast.

**Sub-Phases:**
- **Phase 3a (Days 41-50):** Configuration abstraction (extract all hardcoded branding to `config/theme.json`)
- **Phase 3b (Days 51-55):** Documentation (SETUP.md, CUSTOMIZATION.md, video tutorials)
- **Phase 3c (Days 56-60):** Deploy second podcast manually (timed test, <4 hours target)

**Task Breakdown:** (Will detail in Week 8)

---

## 12. Definition of "Done" for Each Increment

Every task must meet these criteria to be considered complete:

1. **Code Quality:**
   - [ ] No TypeScript errors
   - [ ] No console errors in browser
   - [ ] Code follows project conventions (file naming, component structure)

2. **Functionality:**
   - [ ] Feature works as intended (manual test)
   - [ ] Edge cases handled (empty states, long text, missing data)

3. **Deployment:**
   - [ ] Pushed to GitHub
   - [ ] Deployed to staging
   - [ ] Verified working on staging URL

4. **Documentation:**
   - [ ] Inline comments for complex logic
   - [ ] Updated README if adding new scripts/tools
   - [ ] GitHub commit message descriptive

5. **Accessibility (where applicable):**
   - [ ] Keyboard accessible
   - [ ] Proper ARIA labels
   - [ ] Color contrast meets WCAG AA

---

## 13. Risk Mitigation for Iterative Approach

**Risk:** Too many small tasks feels overwhelming
**Mitigation:** Focus on 1 sub-phase at a time. Don't look ahead at all 100+ tasks.

**Risk:** Tasks depend on each other, can't work in parallel
**Mitigation:** Sub-phases ordered to minimize dependencies. Most tasks within a day are sequential.

**Risk:** Scope creep - "while we're at it, let's add X"
**Mitigation:** Strict "definition of done" per task. New ideas go into GitHub Issues for Phase 2/3.

**Risk:** Deploying broken code to staging
**Mitigation:** Manual test before every push. Staging is for testing, expect some breakage.

**Risk:** Migration script fails on edge case
**Mitigation:** Run on small batch first (5 episodes), validate, then full migration.

**Risk:** Performance optimization at wrong time (premature)
**Mitigation:** Only optimize in Phase 1d (Day 14), after content is live.

---

## 14. Testing & Quality Assurance

### 14.1 Testing Cadence

**Daily (during development):**
- Manual testing of new features (each task)
- Visual inspection (does it look right?)
- Browser DevTools (no console errors)

**Weekly (end of each sub-phase):**
- Lighthouse audit (performance, SEO, accessibility)
- Cross-page navigation test (all links work?)
- Mobile responsiveness check

**Pre-Launch (Day 15):**
- Full Lighthouse audit (all pages)
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile device testing (iPhone, Android, tablet)
- Screen reader test (3 pages)
- Load testing (1,000 concurrent users via Artillery.io)

### 14.2 Automated Testing (Phase 2)

**Unit Tests:**
- Component tests (Vitest + Testing Library)
- Utility function tests (date formatting, URL parsing)
- Target: >80% coverage for critical paths

**CI/CD Integration (Phase 2):**
- GitHub Actions workflow on every PR
- Lint, type check, build, Lighthouse CI
- Auto-deploy to Netlify preview

---

## 15. Success Metrics

### 15.1 Launch Metrics (End of Phase 1, Day 15)

**Technical Excellence:**
- ✅ Lighthouse Performance: >90 (target: >95)
- ✅ Lighthouse SEO: >95 (target: 100)
- ✅ Lighthouse Accessibility: >90 (target: 95)
- ✅ Page load time: <3s (target: <2s)
- ✅ Core Web Vitals: All green (LCP <2.5s, FID <100ms, CLS <0.1)

**Content Completeness:**
- ✅ All 69 episodes migrated successfully
- ✅ Zero broken links/images (Screaming Frog validation)
- ✅ Mobile usability: 100% (Google Search Console)
- ✅ 100% episode metadata completeness (title, audio, date, show notes)

**SEO Readiness:**
- ✅ XML sitemap submitted to Google Search Console
- ✅ Structured data validation passed (zero errors)
- ✅ 301 redirects functional (all old URLs redirect correctly)
- ✅ robots.txt configured (allows crawling)

### 15.2 Iteration Velocity Metrics

**Phase 1 Target Velocity:**
- **Tasks completed per day:** 8-12 tasks (average ~10)
- **Staging deploys per day:** 3-5 deploys
- **Days to first deploy:** Day 1 (not Week 4!)
- **Days to content-complete site:** Day 11 (not Week 3!)
- **Days to production launch:** Day 15 (matches 4-week estimate, but site usable much earlier)

**Comparison (Waterfall vs. Iterative):**

| Milestone | Waterfall | Iterative (This Plan) |
|-----------|-----------|----------------------|
| First deploy | Week 3 | Day 1 |
| Working episode page | Week 2 | Day 2 |
| Dynamic content | Week 3 | Day 5 |
| All content migrated | Week 4 | Day 11 |
| Production launch | Week 4 | Day 15 |

**Key Insight:** Iterative approach reaches "usable site" 10x faster (Day 3 vs. Week 3).

---

## 16. Risks, Dependencies & Mitigation

### 16.1 Risk Register

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Content migration errors** | High | Medium | Automated validation script, manual QA sample (10 episodes), fallback data handling |
| **Tasks take longer than estimated** | Medium | High | Build in buffer days (Day 16-20), prioritize ruthlessly |
| **Sanity API rate limits** | Low | Low | Free tier allows 100k requests/month, we'll use ~1k during migration |
| **Scope creep during development** | Medium | Medium | Strict definition of done, new ideas → GitHub Issues for Phase 2 |
| **Developer burnout (too many small tasks)** | Medium | Low | Focus on 1 sub-phase at a time, celebrate daily wins |

### 16.2 External Dependencies

| Dependency | SLA | Rate Limits | Fallback Strategy |
|------------|-----|-------------|-------------------|
| **Sanity API** | 99.9% uptime | 100k requests/month (free tier) | Cache content locally (build time), graceful degradation (stale content) |
| **Netlify Hosting** | 99.9% uptime | 300 build min, 100GB bandwidth/month | Self-hosted fallback (S3 + CloudFront), static export portable |
| **Spotify for Podcasters** | No SLA | Embed rate limits unclear | Direct MP3 URLs as backup, download + self-host audio files |

---

## 17. Appendix: Research Findings

_[Same as v2/v3 - competitive analysis, technical research, SEO best practices]_

---

## 18. Next Steps

### Immediate Actions (Day 0 - Pre-Development)

1. **Approve PRD** (stakeholder sign-off on iterative approach)
2. **Provision Accounts:**
   - GitHub organization/repo
   - Sanity.io (free tier)
   - Netlify (free tier)
   - Google Analytics 4 (create property)
   - Sentry (free tier)
3. **Gather Assets (for Phase 1d):**
   - Strange Water logo (SVG + PNG)
   - Favicon
   - OG image (1200x630px)
   - Host photo + bio
4. **Access Credentials:**
   - Spotify for Podcasters (episode export)
   - Domain registrar (DNS configuration for staging.strangewater.xyz)

### Day 1 Kickoff

**Morning:**
- [ ] Run `npm create astro@latest`
- [ ] Push to GitHub
- [ ] Connect Netlify
- [ ] Coffee break to celebrate first deploy!

**Afternoon:**
- [ ] Configure staging DNS
- [ ] Verify staging site loads
- [ ] Share staging URL with stakeholders

---

## Summary of Changes (v3 → v4)

### **Complete Rewrite of Section 11: Phased Implementation Plan**

**What Changed:**

1. **Granularity:** Went from ~30 tasks over 4 weeks → **100+ tasks** broken into half-day increments
2. **Sub-Phases:** Phase 1 now has 5 sub-phases (1a-1e), each delivering a vertical slice
3. **Daily Breakdown:** First 15 days planned **day-by-day** with morning/afternoon task blocks
4. **Task Size:** Tasks now take 30 min - 2 hours (not 1-2 days)
5. **Iterative Milestones:** Deployed site on Day 1 (not Week 3), content-complete on Day 11 (not Week 4)
6. **Vertical Slices:** Episode page working end-to-end on Day 2 vs. building all components first
7. **New Sections:** Added "Definition of Done" (Section 12), "Iteration Velocity Metrics" (Section 15.2)

**Philosophy Shift:**

- **v3 Approach:** Build all pages → add content → optimize → launch (horizontal layers)
- **v4 Approach:** Build one thing end-to-end → deploy → iterate → expand (vertical slices)

**Impact:**

- **Reduced Risk:** Working site exists from Day 1, not "big bang" on Day 15
- **Faster Feedback:** Can show stakeholders progress daily, not weekly
- **Easier to Execute:** 2-hour tasks feel manageable vs. "build entire homepage" (8+ hours)
- **Better Quality:** Deploy 5x/day = catch bugs immediately vs. find all bugs on launch day

This PRD is now **execution-ready** with a clear, iterative, small-step plan that matches your stated methodology.
