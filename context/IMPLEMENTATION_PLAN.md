# Implementation Plan
## Podcast Website Framework

**Last Updated:** 2025-10-05
**Status:** Ready for Development

---

## Implementation Philosophy

**Every increment should be:**
1. **Demonstrable:** Can show working output
2. **Testable:** Can verify it works
3. **Deployable:** Can push to staging immediately
4. **Valuable:** Moves us closer to launch

**Daily Rhythm:**
- Morning: Pick 1-3 tasks from current sub-phase
- Afternoon: Ship to staging, verify, demo
- End of day: Working site exists (even if incomplete)

---

## Phase 1: Strange Water MVP (Weeks 1-4)

Broken into **sub-phases** delivering vertical slices with continuous deployment.

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

**Goal:** Replace hardcoded data with Sanity CMS. Add 5 real episodes manually. Start config abstraction.

**Success Criteria:**
- ✅ Homepage shows episodes from Sanity
- ✅ Episode pages dynamically generated from Sanity
- ✅ Can add episode in Sanity Studio, appears on site after rebuild
- ✅ Config layer started (colors, fonts in config file)

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

#### **Day 6: Config Abstraction & Guest Schema**

**Morning (3 hours) - Config Layer:**
- [ ] **Task 6.1:** Create `config/theme.json` file with branding tokens
  - Colors (primary, secondary, accent, background, text)
  - Typography (heading font, body font, weights)
  - Logo paths
- [ ] **Task 6.2:** Create `src/lib/config.ts` helper to load config
- [ ] **Task 6.3:** Update `src/components/Header.astro` to read from config (test pattern)
- [ ] **Task 6.4:** Update BaseLayout to apply CSS variables from config
- [ ] **Task 6.5:** Deploy, verify branding loads from config (change primary color, rebuild, confirm change)

**Afternoon (3 hours) - Guest Schema:**
- [ ] **Task 6.6:** Create `sanity/schemas/guest.ts` schema
  - Fields: name, slug, bio, photo, socialLinks (array)
- [ ] **Task 6.7:** Update Episode schema to reference Guests (array of references)
- [ ] **Task 6.8:** Deploy Sanity schema updates (`sanity deploy`)
- [ ] **Task 6.9:** Add 3 guests manually in Sanity Studio
- [ ] **Task 6.10:** Link guests to existing episodes

**End of Day 6 Checkpoint:**
- ✅ Config layer working (can change branding via JSON file)
- ✅ Guest schema in Sanity
- ✅ 3 guests entered and linked to episodes
- ✅ **Milestone:** Framework pattern established (config-driven design)

#### **Day 7: Guest Pages & Hosted Sanity Studio**

**Morning (2-3 hours):**
- [ ] **Task 7.1:** Create `src/pages/guests/[slug].astro` (dynamic guest page)
- [ ] **Task 7.2:** Implement `getStaticPaths()` for guests
- [ ] **Task 7.3:** Fetch guest data + episodes featuring guest
- [ ] **Task 7.4:** Build guest page layout (photo, bio, social links, episode list)
- [ ] **Task 7.5:** Create `src/pages/guests/index.astro` (guest directory)
- [ ] **Task 7.6:** Display guest grid with photos

**Afternoon (2-3 hours) - Hosted Studio:**
- [ ] **Task 7.7:** Deploy Sanity Studio to hosted URL (`sanity deploy`)
- [ ] **Task 7.8:** Configure CORS settings (allow Netlify domains)
- [ ] **Task 7.9:** Set up user accounts for Content Coordinator role (editor permissions)
- [ ] **Task 7.10:** Test publishing workflow: create episode in hosted Studio → triggers Netlify rebuild
- [ ] **Task 7.11:** Update navigation (header) to include Episodes, Guests, About links

**End of Day 7 Checkpoint:**
- ✅ Guest directory & profiles live
- ✅ Hosted Sanity Studio accessible (non-technical users can access)
- ✅ Publishing workflow validated (Studio → webhook → rebuild)
- ✅ **Milestone:** Content management operational for non-technical users

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

### **Phase 1d: "SEO, Performance & Monetization" - Production Ready (Days 12-15)**

**Goal:** Optimize for SEO, performance, accessibility. Add monetization CTAs. Production launch.

**Success Criteria:**
- ✅ Lighthouse Performance >90, SEO >95, Accessibility >90
- ✅ Schema.org markup implemented
- ✅ Patreon widget & subscribe CTAs live
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

#### **Day 13: Monetization CTAs & Analytics**

**Morning (3-4 hours) - Patreon & Subscribe Widgets:**
- [ ] **Task 13.1:** Create `src/components/PatreonWidget.astro` (sidebar widget)
- [ ] **Task 13.2:** Add Patreon URL to `config/theme.json` (monetization section)
- [ ] **Task 13.3:** Add Patreon widget to episode page layout (sidebar)
- [ ] **Task 13.4:** Create `src/components/SubscribeCTA.astro` (button with dropdown)
- [ ] **Task 13.5:** Add subscribe links to `config/theme.json` (Spotify, Apple, YouTube, RSS)
- [ ] **Task 13.6:** Add subscribe CTA to homepage hero
- [ ] **Task 13.7:** Add floating subscribe bar to episode pages (sticky, dismissible)
- [ ] **Task 13.8:** Deploy, verify CTAs visible and functional

**Afternoon (2-3 hours) - Analytics & Tracking:**
- [ ] **Task 13.9:** Create Google Analytics 4 property
- [ ] **Task 13.10:** Add GA4 tracking script to BaseLayout
- [ ] **Task 13.11:** Create `src/lib/analytics.ts` abstraction layer
- [ ] **Task 13.12:** Implement event tracking:
  - `subscribe_click` (platform, location)
  - `patreon_click` (episode_id, location)
  - `audio_play` (episode_id)
  - `social_share` (platform, episode_id)
- [ ] **Task 13.13:** Deploy, verify pageview + event tracking in GA4 Real-Time report

**End of Day 13 Checkpoint:**
- ✅ Patreon widget on episode pages
- ✅ Subscribe CTAs on homepage & episode pages
- ✅ Analytics tracking verified
- ✅ **Milestone:** Monetization infrastructure operational

#### **Day 14: Performance Optimization & Redirects**

**Morning (3-4 hours) - Performance:**
- [ ] **Task 14.1:** Run Lighthouse audit (baseline scores)
- [ ] **Task 14.2:** Optimize images with `@astrojs/image` (convert to WebP, responsive srcset)
- [ ] **Task 14.3:** Implement lazy loading for images below fold
- [ ] **Task 14.4:** Add font-display: swap to font declarations
- [ ] **Task 14.5:** Inline critical CSS for above-the-fold content
- [ ] **Task 14.6:** Lazy-load audio player (only when scrolled into view)

**Afternoon (2-3 hours) - Sitemap & Redirects:**
- [ ] **Task 14.7:** Install `@astrojs/sitemap` integration
- [ ] **Task 14.8:** Configure sitemap generation (all episode/guest pages)
- [ ] **Task 14.9:** Deploy, verify `/sitemap-index.xml` exists
- [ ] **Task 14.10:** Update `robots.txt` to reference sitemap
- [ ] **Task 14.11:** Configure 301 redirects in `netlify.toml`
  - `/episode/* → /episodes/:splat`
  - `/person/* → /guests/:splat`
- [ ] **Task 14.12:** Deploy, test redirects (visit old URLs, verify redirects)
- [ ] **Task 14.13:** Run Lighthouse again, verify Performance >90

**End of Day 14 Checkpoint:**
- ✅ Lighthouse Performance >90
- ✅ Images optimized (WebP, lazy loading)
- ✅ Sitemap generated
- ✅ Redirects configured and tested
- ✅ **Milestone:** Performance targets met

#### **Day 15: Accessibility, Final Polish & Production Launch**

**Morning (3 hours) - Accessibility:**
- [ ] **Task 15.1:** Run axe DevTools accessibility scan
- [ ] **Task 15.2:** Fix color contrast issues (text, buttons)
- [ ] **Task 15.3:** Add ARIA labels to audio player, nav
- [ ] **Task 15.4:** Test keyboard navigation (Tab through all pages)
- [ ] **Task 15.5:** Test with screen reader (VoiceOver or NVDA) on 3 pages
- [ ] **Task 15.6:** Fix focus indicators (visible outline on interactive elements)

**Afternoon (2-3 hours) - Launch:**
- [ ] **Task 15.7:** Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] **Task 15.8:** Mobile device testing (iPhone, Android)
- [ ] **Task 15.9:** Final Lighthouse audit (Performance, SEO, Accessibility all >90)
- [ ] **Task 15.10:** Create production Netlify site
- [ ] **Task 15.11:** Point `strangewater.xyz` DNS to Netlify
- [ ] **Task 15.12:** Deploy to production

**Evening - Post-Launch:**
- [ ] **Task 15.13:** Verify production site live at `strangewater.xyz`
- [ ] **Task 15.14:** Submit sitemap to Google Search Console
- [ ] **Task 15.15:** Monitor analytics (first pageviews)
- [ ] **Task 15.16:** Monitor Sentry (zero errors expected)
- [ ] **Task 15.17:** Post-launch smoke tests (homepage, 5 episodes, 3 guests load)

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
- [ ] Monitor Google Analytics (traffic, top episodes, bounce rate, CTA performance)
- [ ] Monitor Sentry (JavaScript errors)
- [ ] Monitor Core Web Vitals (RUM data from GA4)
- [ ] Analyze monetization funnel (subscribe CTR, Patreon CTR)
- [ ] Fix any bugs reported
- [ ] Improve episode pages based on analytics (which pages have high bounce?)
- [ ] Add any missing guest photos
- [ ] Optimize low-performing images

**Key Metrics to Track (Week 3):**
- Subscribe CTR (target >5%)
- Patreon CTR (target >2%)
- Avg session duration (target >2 min)
- Bounce rate (target <60%)

**Deliverable:** Stable, production site with <1% error rate, measurable monetization performance

---

## Phase 2: Enhancement (Weeks 5-8) - New Podcast Features

**Goal:** Add features for future active podcasts (forms, newsletter, transcripts).

**Approach:** Same iterative methodology - small tasks, continuous deployment.

### **Phase 2a: Newsletter & Forms (Days 21-28)**

**Week 5 Breakdown:**

**Days 21-22: Newsletter Infrastructure**
- [ ] Choose newsletter platform (ConvertKit recommended, free tier <1k subscribers)
- [ ] Create ConvertKit account, configure API keys
- [ ] Build `src/components/NewsletterSignup.astro` component
- [ ] Add to homepage (footer), episode pages (sidebar)
- [ ] Implement `newsletter_signup` event tracking
- [ ] Test signup flow end-to-end

**Days 23-24: "Request an Episode" Form**
- [ ] Configure Netlify Forms or Airtable API
- [ ] Create `/request-episode` page with form
- [ ] Fields: Name, email, topic, why interested (textarea)
- [ ] Add spam protection (reCAPTCHA or honeypot)
- [ ] Configure notification (email to host on submission)
- [ ] Test form submission, verify email arrives

**Days 25-26: "Ask a Question" Form**
- [ ] Create `/ask-question` page with form
- [ ] Fields: Name, email (optional), question (textarea)
- [ ] Integrate with same backend (Netlify Forms/Airtable)
- [ ] Add moderation workflow (Airtable view for review)
- [ ] Link from navigation, episode pages

**Days 27-28: Privacy & Compliance**
- [ ] Add cookie consent banner (Cookiebot free tier)
- [ ] Create Privacy Policy page (template from Termly)
- [ ] Create Terms of Service page
- [ ] Add GDPR compliance (email opt-in checkboxes)
- [ ] Test cookie consent workflow

**End of Phase 2a:**
- ✅ Newsletter signup functional (50+ subscribers target by end of Phase 2)
- ✅ Forms live and receiving submissions
- ✅ GDPR compliance validated

### **Phase 2b: Enhanced Discovery (Days 29-35)**

**Days 29-30: Episode Tagging**
- [ ] Add `tags` field to Episode schema in Sanity
- [ ] Manually tag 20 episodes (test data)
- [ ] Build tag filter UI on episodes archive page
- [ ] Deploy, test filtering

**Days 31-32: Episode Search**
- [ ] Implement client-side search (Fuse.js or Pagefind)
- [ ] Add search bar to episodes page
- [ ] Search by title, show notes, guest names
- [ ] Test search performance (sub-200ms response time)

**Days 33-34: Related Episodes**
- [ ] Build algorithm: match episodes by tags (3-5 related)
- [ ] Add "Related Episodes" section to episode page (below show notes)
- [ ] Track `related_episode_click` event
- [ ] Analyze which recommendations perform best

**Day 35: Analytics Review**
- [ ] Review Phase 2a/2b metrics (newsletter signups, form submissions, search usage)
- [ ] Identify low-performing features
- [ ] Plan improvements for Phase 3

**End of Phase 2b:**
- ✅ Episode search functional (<200ms)
- ✅ Tags & filtering operational
- ✅ Related episodes improving engagement (+10% session duration target)

### **Phase 2c: Transcript Generation (Days 36-40)**

**Day 36-37: Whisper API Integration**
- [ ] Sign up for OpenAI API or Together AI
- [ ] Build `scripts/generate-transcript.js`
- [ ] Test on 3 episodes (different lengths)
- [ ] Verify transcript accuracy (spot-check)

**Day 38: Transcript Display**
- [ ] Add `transcript` field to Episode schema
- [ ] Build transcript UI (collapsible, searchable)
- [ ] Add to episode page layout (below show notes)
- [ ] Deploy, verify transcript shows

**Day 39-40: Automated Transcription**
- [ ] Integrate transcript generation into publishing workflow
  - Option A: Sanity webhook triggers script
  - Option B: Manual button in Studio "Generate Transcript"
- [ ] Test on new episode (end-to-end)
- [ ] Budget analysis (cost per episode, ~$0.20-0.50 for 60 min)

**End of Phase 2c:**
- ✅ Transcripts automated for 100% of new episodes
- ✅ 10 historical episodes transcribed (test batch)
- ✅ Transcript search functional (Ctrl+F in browser for now, advanced search Phase 3)

**Phase 2 Success Criteria:**
- ✅ Newsletter signup CTR >3% of homepage visitors
- ✅ >50 total newsletter subscribers
- ✅ >20 form submissions (requests + questions combined)
- ✅ Episode search usage >10% of visitors
- ✅ Transcripts on 10+ episodes

---

## Phase 3: Scale (Weeks 9-12) - Second Podcast Deployment

**Goal:** Fully abstract Strange Water code into reusable template. Deploy second podcast.

### **Phase 3a: Final Config Abstraction (Days 41-48)**

**Days 41-42: Complete Config Migration**
- [ ] Audit all components for hardcoded "Strange Water" references
- [ ] Move remaining branding to `config/theme.json`
- [ ] Test: Change podcast name in config, rebuild, verify everywhere updates

**Days 43-44: Multi-Podcast Config Schema**
- [ ] Expand `config/theme.json` with all podcast-specific settings
- [ ] Add validation schema (JSON Schema or Zod)
- [ ] Create `npm run validate-config` script

**Days 45-46: Asset Management**
- [ ] Document required assets (logo, favicon, OG image, dimensions)
- [ ] Create `scripts/prepare-assets.js` (validates, optimizes, places assets)
- [ ] Test asset replacement workflow

**Days 47-48: Sanity Template**
- [ ] Create Sanity project template (exportable schema)
- [ ] Document how to create new Sanity project for new podcast
- [ ] Test: Create second Sanity project, import schema

**End of Phase 3a:**
- ✅ Zero hardcoded references to "Strange Water" in framework code
- ✅ Config-driven design fully validated
- ✅ Asset pipeline documented

### **Phase 3b: Documentation (Days 49-53)**

**Days 49-50: Setup Guide**
- [ ] Write `docs/SETUP.md` (step-by-step new instance creation)
- [ ] Include screenshots, command examples
- [ ] Test guide with second podcast instance

**Days 51-52: Customization Guide**
- [ ] Write `docs/CUSTOMIZATION.md` (branding, theming, features)
- [ ] Document config schema with examples
- [ ] Create video tutorial (5-10 min screencast)

**Day 53: Architecture Documentation**
- [ ] Write `docs/ARCHITECTURE.md` (technical overview)
- [ ] Diagram file structure, data flow
- [ ] Document key architectural decisions

**End of Phase 3b:**
- ✅ Documentation complete (100% of setup process documented)
- ✅ Video tutorial published

### **Phase 3c: Second Podcast Deployment (Days 54-60)**

**Days 54-55: Manual Deployment (Timed Test)**
- [ ] Follow `docs/SETUP.md` exactly (no shortcuts)
- [ ] Time each step (target <4 hours total)
- [ ] Create new podcast instance (different domain, branding)
- [ ] Deploy to Netlify

**Days 56-57: Content Import Test**
- [ ] Test generic RSS import script on second podcast's feed
- [ ] Import 10-20 episodes
- [ ] Verify data quality
- [ ] Fix any import script bugs

**Days 58-60: Launch Second Podcast**
- [ ] Configure custom domain
- [ ] Deploy to production
- [ ] Verify Lighthouse scores (should match Strange Water)
- [ ] Test content management workflow with non-technical user (Content Coordinator persona)
- [ ] Measure time to publish new episode (<30 min target)

**Phase 3 Success Criteria:**
- ✅ Second podcast deployed in <4 hours (manual)
- ✅ Non-technical user can publish episode in <30 min
- ✅ Component reuse rate >80% (minimal changes needed)
- ✅ Documentation allows independent deployment (no support needed)

---

## Definition of "Done" for Each Task

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

**End of Implementation Plan**
