# Product Requirements Document (PRD) v2
## Podcast Website Framework

---

## 1. Executive Summary

This PRD outlines the development of a **reusable podcast website framework** to replace the current Strange Water podcast site (strangewater.xyz) hosted on PodcastPage.io. The framework will be deployed first for Strange Water (69 episodes, completed/archival series), then reused for future podcasts with customized branding and features.

### Dual Goals

1. **Immediate:** Launch performant, SEO-optimized Strange Water site (archival/marketing property)
2. **Strategic:** Build reusable framework/template enabling rapid deployment of future podcast websites

**Learning Feedback Loop:** Strange Water rollout serves as production validation for the framework. All architecture decisions, content workflows, and deployment processes will be documented and abstracted into the template for future shows.

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

### User Context
- **Site Owner:** High technical proficiency (can manage complex systems)
- **Future Operators:** Entry-level/junior staff (non-technical content coordinators)
- **Strange Water Status:** 69 episodes, ceased production (archival site)
- **Future Podcasts:** Active production, require growth/engagement features

---

## 3. Personas & Content Operations

### 3.1 Core Personas

#### **Persona 1: Host/Producer (Rex)**
- **Technical Level:** High
- **Responsibilities:** Content strategy, guest coordination, final approval
- **Needs:** Quick publishing, performance metrics, brand control
- **Pain Points:** Time-consuming manual processes, limited monetization options
- **Success Metrics:** <10 min episode publishing time, real-time analytics access

#### **Persona 2: Content Coordinator (Future Hire)**
- **Technical Level:** Low (familiar with web forms, basic CMS)
- **Responsibilities:** Episode uploads, show notes formatting, social media prep
- **Needs:** Intuitive CMS, clear workflows, error prevention
- **Pain Points:** Complex interfaces, unclear publishing steps, missing asset specs
- **Success Metrics:** Zero publishing errors, <30 min training time

#### **Persona 3: Guest Contributor**
- **Technical Level:** Variable
- **Responsibilities:** Provide bio, headshot, social links
- **Needs:** Simple submission form, clear asset requirements
- **Pain Points:** Unclear expectations, multiple back-and-forth communications
- **Success Metrics:** One-touch guest info collection

### 3.2 Editorial Workflow (Sanity CMS)

```
[Draft] → [Ready for Review] → [Scheduled] → [Published] → [Archived]
```

**Roles & Permissions:**
- **Administrator** (Host/Producer): Full access, publish/unpublish, delete, configure
- **Editor** (Content Coordinator): Create, edit, schedule, cannot delete or configure
- **Contributor** (Guest): Submit guest info only, cannot publish

**Publishing Workflow:**
1. Content Coordinator creates episode draft in Sanity
2. Uploads audio URL from podcast host (Spotify/RSS.com)
3. Formats show notes using rich text editor
4. Adds guest references, metadata (date, duration, episode #)
5. Marks as "Ready for Review"
6. Host/Producer reviews, approves, publishes
7. Sanity webhook triggers Netlify rebuild (~3-5 min)
8. Site updates with new episode

### 3.3 Content Governance

**Naming Conventions:**
- Episodes: `[Episode ###] - [Guest Name] - [Topic]` (e.g., "Episode 042 - Vitalik Buterin - Ethereum's Future")
- Guest slugs: `firstname-lastname` (lowercase, hyphens)
- Image files: `ep###-[descriptor].jpg` (e.g., `ep042-vitalik-headshot.jpg`)

**Metadata Completeness Requirements:**
- ✅ Title, episode number, publish date (required)
- ✅ Audio URL, duration (required)
- ✅ Show notes (minimum 100 words)
- ✅ At least 1 guest or host attribution
- ✅ Featured image (1200x630px minimum)
- ⚠️ Transcript (optional for MVP, recommended for SEO)

**Asset Specifications:**
- **Episode Artwork:** 3000x3000px JPG/PNG, <500KB
- **Guest Photos:** 800x800px JPG/PNG, <200KB
- **Social Sharing Images:** 1200x630px JPG/PNG, <300KB
- **Logo Files:** SVG preferred, PNG fallback (transparent background)

**Approval Cadence:**
- New podcasts: Weekly editorial review (every Monday)
- Strange Water (archival): Ad-hoc updates only

### 3.4 Ongoing Maintenance Plan

**Monthly:**
- Link rot checks (automated with Screaming Frog or similar)
- Google Search Console review (crawl errors, coverage issues)
- Analytics review (top/bottom performing episodes)

**Quarterly:**
- SEO audit (rankings, backlinks, keyword opportunities)
- Accessibility compliance check (WCAG AA validation)
- Dependency updates (Astro, Sanity, npm packages)
- Performance benchmarking (Lighthouse, Core Web Vitals)

**Annually:**
- Content refresh (update outdated references, dead links)
- Design refresh (evaluate UX improvements)
- Competitive analysis (benchmark against top podcast sites)

---

## 4. Recommended Technical Architecture

### 4.1 Core Stack: **Astro + Sanity CMS + Netlify**

#### **Frontend Framework: Astro**
**Why Astro:**
- **SEO Excellence:** Pre-rendered HTML, perfect for content-heavy sites
- **Performance:** Minimal JavaScript shipped to client (faster Time to Interactive)
- **Content-First:** Built specifically for blogs, marketing, and content sites
- **Flexibility:** Supports React/Vue/Svelte components when needed
- **Developer Experience:** Simple, modern, great documentation

**vs Next.js:** While Next.js is feature-rich, Astro's zero-JS-by-default approach delivers superior performance for static podcast content. Next.js shines for apps with heavy interactivity (not our use case).

#### **CMS: Sanity.io**
**Why Sanity:**
- **Real-time Collaboration:** Built-in collaborative editing
- **Customizable Studio:** Tailor admin UI for podcast episodes
- **Developer-Friendly:** Portable content, GROQ query language
- **Free Tier:** Generous limits (100k API requests, 3 users)
- **Flexible Hosting:** Cloud-hosted with self-host option
- **Content Portability:** Export-friendly (mitigation against vendor lock-in)

**vs Contentful:** Contentful is enterprise-focused with higher pricing. Sanity offers more customization at lower cost.

**vs Strapi:** Strapi requires self-hosting/management. Sanity's managed service reduces operational overhead while remaining cost-effective.

#### **Hosting: Netlify**
**Why Netlify:**
- **Free Tier for Commercial Use:** Unlike Vercel, allows commercial sites on free tier
- **Generous Limits:** 300 build minutes/month, 100GB bandwidth/month
- **Framework Agnostic:** Not tied to specific framework (unlike Vercel/Next.js)
- **Features:** Forms, redirects, edge functions, instant rollbacks
- **Pricing:** $19/month Pro tier if needed (vs Vercel's $20/user/month)

**Cost at Scale:** Bandwidth overages at $55/100GB. For high-traffic podcasts, consider Cloudflare CDN integration or migration to self-hosted (future flexibility built-in).

#### **Additional Services:**
- **Transcription:** OpenAI Whisper API or Together AI ($0.0015/min audio)
- **Analytics:** Google Analytics 4 (required) + Plausible/Fathom (privacy-focused, optional)
- **Email Capture:** ConvertKit, Mailchimp, or Resend API
- **Audio Player:** Embed from podcast host (Spotify, RSS.com) or custom player (Plyr, Howler.js)
- **Error Monitoring:** Sentry (free tier: 5k events/month)
- **Uptime Monitoring:** UptimeRobot or Netlify status notifications

### 4.2 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Netlify CDN                               │
│  (Static HTML/CSS/JS, Images, Edge Functions, Redirects)    │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│                    Astro Site (SSG)                          │
│  - Pre-rendered pages (episodes, guests, homepage)           │
│  - Schema.org JSON-LD                                        │
│  - Optimized images (WebP, responsive)                       │
└────────────┬────────────────────────────────────────────────┘
             │
             ├─────────────┐
             │             │
             ▼             ▼
┌──────────────────┐  ┌──────────────────────┐
│   Sanity CMS     │  │  External APIs       │
│  - Episode data  │  │  - Google Analytics  │
│  - Guest info    │  │  - Patreon           │
│  - Site config   │  │  - ConvertKit        │
│  - Rich text     │  │  - Podcast hosts     │
└────────┬─────────┘  └──────────────────────┘
         │
         │ Webhook on publish
         ▼
┌──────────────────────────────────────────────────────────────┐
│             Netlify Build Hook                               │
│  (Triggers rebuild when content published in Sanity)         │
└──────────────────────────────────────────────────────────────┘
```

**Build Flow:**
1. Content published in Sanity Studio
2. Sanity webhook triggers Netlify build hook
3. Netlify pulls latest content from Sanity API
4. Astro generates static HTML pages
5. Assets optimized, sitemap generated, robots.txt added
6. Deploy to Netlify CDN (~3-5 min total)

**Data Flow:**
- **Build Time:** Sanity → Astro (fetch all episodes, guests, config)
- **Runtime:** Minimal JS (audio player embeds, analytics, form submissions)
- **Forms:** Netlify Forms or Airtable API

### 4.3 Environments & Deployment

| Environment | Purpose | Hosting | Domain | Branch |
|-------------|---------|---------|--------|--------|
| **Local** | Development | localhost:4321 | N/A | feature/* |
| **Staging** | Content preview, QA | Netlify branch deploy | `staging.strangewater.xyz` | `develop` |
| **Production** | Live site | Netlify | `strangewater.xyz` | `main` |

**Content Previews:**
- Sanity Studio includes "Preview" button (opens staging URL with draft content)
- Branch deploys for feature testing (automatic via Netlify)

**Deployment Promotion:**
1. Feature branch → develop (staging auto-deploys)
2. QA approval on staging
3. develop → main (production auto-deploys)
4. Instant rollback available via Netlify UI (previous deploys cached)

**Infrastructure as Code:**
- Netlify configuration: `netlify.toml` (committed to repo)
- Sanity schema: TypeScript definitions (committed to repo)
- Environment variables: Netlify UI + `.env.example` template
- Future: Terraform or Pulumi for multi-site orchestration (Phase 3)

### 4.4 Dependency Management

**Version Pinning:**
- `package.json`: Exact versions (no `^` or `~` for major dependencies)
- Automated dependency updates: Dependabot (weekly PRs for security patches)

**Upgrade Cadence:**
- **Astro:** Monthly review of release notes, upgrade within 2 weeks of major releases
- **Sanity:** Monitor breaking changes via changelog, test in staging first
- **npm packages:** Security patches applied immediately, feature updates quarterly

**API Change Testing:**
- Sanity API: Version pinning via `@sanity/client` (e.g., `v3` vs `v4`)
- Staging environment receives updates first (1-week soak period before production)

**Vendor Lock-In Mitigation:**
- **Sanity:** Content export scripts (JSON dump, automated backups to S3)
- **Netlify:** Standard static hosting (portable to Vercel, Cloudflare Pages, S3+CloudFront)
- **Analytics:** Event abstraction layer (swap GA4 for Plausible without code changes)

---

## 5. Template & Theming Strategy

### 5.1 Configuration Layer

**Theme Configuration File** (`config/theme.json`):

```json
{
  "podcast": {
    "name": "Strange Water",
    "tagline": "Exploring Ethereum and Web3",
    "url": "https://strangewater.xyz"
  },
  "branding": {
    "colors": {
      "primary": "#1a73e8",
      "secondary": "#f57c00",
      "accent": "#00bfa5",
      "background": "#ffffff",
      "text": "#212121"
    },
    "typography": {
      "headingFont": "Inter",
      "bodyFont": "Lato",
      "fontWeights": {
        "normal": 400,
        "bold": 700
      }
    },
    "logo": {
      "svg": "/assets/logo.svg",
      "png": "/assets/logo.png",
      "favicon": "/assets/favicon.ico"
    },
    "socialSharing": {
      "defaultImage": "/assets/og-image.jpg"
    }
  },
  "layout": {
    "sidebar": false,
    "episodesPerPage": 12,
    "featuredEpisodesCount": 3
  },
  "features": {
    "newsletter": true,
    "comments": false,
    "transcripts": true,
    "darkMode": false
  }
}
```

**Required Tokens:**
- Primary color (CTA buttons, links)
- Secondary color (headings, accents)
- Background/text colors (accessibility contrast validated)
- Logo files (SVG + PNG fallback)
- Podcast name, tagline, description

**Optional Overrides:**
- Custom fonts (Google Fonts or self-hosted)
- Sidebar vs. full-width layout
- Featured episodes count
- Feature flags (newsletter, comments, dark mode)

**Image Ratios:**
- Episode artwork: 1:1 (square)
- Guest photos: 1:1 (square)
- Social sharing: 1.91:1 (OG image standard)
- Hero images: 16:9 (optional homepage banner)

**Custom Component Slots:**
- Homepage hero section (replace with custom HTML/component)
- Episode page sidebar (inject custom widgets)
- Footer (custom links, legal pages)

### 5.2 New Instance Creation Process

**CLI Scaffold (Future: `npx create-podcast-site`):**

```bash
npx create-podcast-site my-new-podcast
cd my-new-podcast
npm install
npm run setup  # Interactive config wizard
npm run dev    # Start local dev server
```

**Manual Checklist (Phase 1):**

1. **Setup (30 min)**
   - [ ] Clone repository
   - [ ] Run `npm install`
   - [ ] Copy `.env.example` to `.env`
   - [ ] Create Sanity project (`sanity init`)
   - [ ] Configure Netlify site

2. **Branding (1-2 hours)**
   - [ ] Update `config/theme.json` (colors, fonts, name)
   - [ ] Replace logo files (`public/assets/logo.*`)
   - [ ] Replace favicon (`public/assets/favicon.ico`)
   - [ ] Replace OG image (`public/assets/og-image.jpg`)
   - [ ] Update `public/robots.txt` (sitemap URL)

3. **Content (variable)**
   - [ ] Import episodes via migration script
   - [ ] Add guest profiles to Sanity
   - [ ] Create About page content
   - [ ] Configure subscribe links (Spotify, Apple, RSS)

4. **Deploy (30 min)**
   - [ ] Push to GitHub
   - [ ] Connect Netlify to repo
   - [ ] Configure Sanity webhook (trigger builds)
   - [ ] Configure custom domain
   - [ ] Run launch checklist (see Section 9.5)

**Required Assets:**
- Logo (SVG + PNG, transparent background)
- Favicon (ICO or PNG, 32x32px minimum)
- OG image (1200x630px JPG/PNG)
- Episode artwork (3000x3000px per episode)
- Guest photos (800x800px per guest)

### 5.3 Component Versioning & Release

**Shared Component Library:**
- Core components (EpisodeCard, GuestProfile, AudioPlayer) maintained in `src/components/`
- Versioned via git tags (`v1.0.0`, `v1.1.0`)
- Changelog maintained in `CHANGELOG.md`

**Release Process:**
1. Core component updates tested on Strange Water site (production validation)
2. Breaking changes documented with migration guides
3. Version bump in `package.json`, git tag created
4. Notification to downstream podcast sites (email + GitHub release notes)
5. Downstream sites opt-in to upgrade (manual merge or CLI tool)

**Communication Plan:**
- **Minor Updates:** GitHub release notes only
- **Major Updates (Breaking Changes):** Email notification + migration guide + office hours support
- **Security Patches:** Immediate notification, auto-applied via Dependabot PR

---

## 6. Content & Data Migration

### 6.1 URL Mapping & Redirects

**Strange Water URL Structure (Old → New):**

```
https://strangewater.xyz/                          → https://strangewater.xyz/
https://strangewater.xyz/episodes                  → https://strangewater.xyz/episodes
https://strangewater.xyz/episode/[title-slug]      → https://strangewater.xyz/episodes/[title-slug]
https://strangewater.xyz/guests                    → https://strangewater.xyz/guests
https://strangewater.xyz/guest/[name-slug]         → https://strangewater.xyz/guests/[name-slug]
https://strangewater.xyz/about                     → https://strangewater.xyz/about
```

**301 Redirect Rules** (`netlify.toml`):

```toml
[[redirects]]
  from = "/episode/*"
  to = "/episodes/:splat"
  status = 301

[[redirects]]
  from = "/guest/*"
  to = "/guests/:splat"
  status = 301
```

**Redirect Validation:**
- Pre-launch: Crawl old site with Screaming Frog, export URL list
- Map all URLs to new structure (spreadsheet or script)
- Test redirects in staging environment
- Post-launch: Monitor Google Search Console for 404 errors (first 2 weeks)

### 6.2 Data Migration Strategy

**Data Sources:**
1. **Spotify for Podcasters:** Export episode metadata (CSV or API)
2. **strangewater.xyz Scrape:** Show notes, guest info (Puppeteer/Playwright script)
3. **Local Assets:** Episode artwork, guest photos (manual collection)

**Migration Script** (`scripts/migrate-strangewater.js`):

```javascript
// Pseudocode
1. Fetch Spotify episode list (RSS feed or API)
2. For each episode:
   a. Scrape show notes from old site
   b. Extract guest names, photos
   c. Download episode artwork
   d. Transform to Sanity schema
   e. Upload to Sanity via API
3. Generate validation report
```

**Data Validation Plan:**

**Sample Size:** 100% of episodes (only 69 total, manageable)

**Acceptance Criteria:**
- ✅ All episode titles match source
- ✅ Audio URLs playable (automated HTTP check)
- ✅ Show notes minimum 50 words (warn if shorter)
- ✅ At least 1 guest or host attribution per episode
- ✅ Episode numbers sequential (1-69, no gaps)
- ✅ Images <500KB, dimensions ≥800x800px
- ✅ Publish dates match original site

**Automated Checks:**
- Audio URL validation (HTTP 200 response)
- Image optimization (TinyPNG API or sharp.js)
- Markdown/HTML sanitization (show notes)
- Duplicate detection (episode numbers, titles)

**Manual QA Responsibilities:**
- Spot-check 10 random episodes (end-to-end review)
- Verify guest photos match correct person
- Proofread show notes for formatting issues
- Test audio playback on 3 episodes (different browsers)

### 6.3 Fallback Behavior for Missing Data

**Missing Guest Photos:**
- Use generic avatar with initials (dynamically generated)
- Flag in Sanity Studio ("Photo Needed" label)

**Incomplete Show Notes:**
- Display episode title + audio player only
- Show "Show notes coming soon" message
- Flag for editorial team to backfill

**Broken Audio URLs:**
- Display error message: "Episode temporarily unavailable"
- Log error to Sentry
- Send alert to admin (email or Slack)

**Low-Quality Images:**
- Upscale with AI (Topaz, waifu2x) or request replacement
- Apply blur + overlay text if quality too low

### 6.4 Multi-Source Import (Future Podcasts)

**Supported Import Sources:**
- RSS feed (universal, works with any podcast host)
- Spotify for Podcasters API/export
- Apple Podcasts Connect export
- Libsyn/Buzzsprout/Transistor API
- Manual CSV upload (template provided)

**Generic Import Script** (`scripts/import-from-rss.js`):

```javascript
// Pseudocode
1. Parse RSS feed XML
2. Extract <item> elements (episodes)
3. Map to Sanity schema:
   - <title> → episode.title
   - <enclosure url> → episode.audioUrl
   - <description> → episode.showNotes
   - <pubDate> → episode.publishDate
4. Upload to Sanity
5. Validate (same checks as Strange Water migration)
```

**Reusability Validation:** Test import script on 2-3 different RSS feeds (Spotify, Apple, Libsyn) to ensure portability.

---

## 7. Functional Requirements

### 7.1 MVP Features (Phase 1 - Strange Water Launch)

#### **Episode Management**
- Display episode list (reverse chronological, paginated 12 per page)
- Individual episode pages with:
  - Audio player (embedded from podcast host)
  - Show notes (rich text, formatted)
  - Episode metadata (date, duration, episode number)
  - Guest information (linked to guest profiles)
  - Social share buttons (Twitter, LinkedIn, copy link)
  - YouTube video embed (if available)
- Episode search/filter by title (client-side, fast)

#### **Guest Profiles**
- Guest directory page (grid layout with photos)
- Individual guest pages with:
  - Photo, bio, social links
  - Episodes featuring guest (sorted by date)
  - External links (website, Twitter, LinkedIn)

#### **Core Pages**
- Homepage: Latest episodes, featured content, subscribe CTAs
- About page: Podcast description, host info
- Episodes archive: Full episode list with pagination
- 404 error page (custom, branded, helpful links)

#### **Monetization & CTAs**
- Patreon integration (prominent CTAs, member-only content badges)
- Subscribe links (Spotify, Apple Podcasts, RSS, YouTube)
- Social media links (footer/header)

**CTA Placement:**
- Homepage hero: "Subscribe" button (primary CTA)
- Episode pages: "Support on Patreon" sidebar widget
- Footer: Social links, newsletter signup (Phase 2)

**Event Tracking (Google Analytics 4):**
- `subscribe_click` (platform, location on page)
- `patreon_click` (episode ID, location)
- `audio_play` (episode ID, timestamp)
- `social_share` (platform, episode ID)

**Performance Benchmarks:**
- Subscribe CTR: >5% of visitors
- Patreon CTR: >2% of episode page visitors
- Social share rate: >1% of episode page visitors

#### **SEO Foundation**
- Schema.org markup (PodcastSeries, PodcastEpisode, Person)
- Meta tags (Open Graph, Twitter Cards)
- XML sitemap (auto-generated, submitted to Google)
- robots.txt (allow all, specify sitemap URL)
- Fast Core Web Vitals scores (see Section 8.2)

### 7.2 Phase 2 Features (Post-MVP, New Podcast)

- **Audience Interaction:**
  - "Request an Episode" form (Netlify Forms → Airtable)
  - "Ask a Question" submission (displayed on future episodes)
  - Comments (Giscus via GitHub Discussions, privacy-friendly)

**Moderation/Approval Flows:**
- Form submissions reviewed by Content Coordinator (Airtable notifications)
- Spam filtering (Akismet or reCAPTCHA)
- Comments moderated via GitHub (block/delete as needed)

**Privacy Compliance:**
- Email opt-in checkbox required (GDPR/CCPA compliant)
- Privacy policy link on all forms
- ConvertKit double opt-in enabled (confirmed subscriptions only)

- **Newsletter:**
  - Email signup form (header/footer, slide-in on exit intent)
  - ConvertKit integration (tagged by podcast)
  - Automated episode notifications (RSS → ConvertKit automation)

- **Enhanced Discovery:**
  - Topic/category tagging (filterable episode list)
  - Related episodes algorithm (tag-based + manual curation)
  - Transcript search (full-text, indexed by Algolia or Pagefind)

- **Content Enrichment:**
  - Episode transcripts (Whisper API, auto-generated on publish)
  - Chapter markers in player (custom audio player implementation)
  - Key takeaways/highlights (manually curated, displayed on episode page)

### 7.3 Phase 3 Features (Future)

- Multi-language support (i18n via Astro's built-in `astro:i18n`)
- Premium content tiers (members-only episodes, locked via Patreon API)
- Advanced analytics dashboard (custom reporting, subscriber growth charts)
- Guest submission portal (guests upload own info, photos, bio)
- Automated social media clips/audiograms (Headliner or custom FFmpeg scripts)
- Integration with additional monetization (pods.media, Buy Me a Coffee, Stripe)

---

## 8. SEO & Performance Strategy

### 8.1 SEO Requirements

**Technical SEO:**
- ✅ Schema.org markup (JSON-LD):
  - `PodcastSeries` (homepage)
  - `PodcastEpisode` (individual episodes)
  - `Person` (guest profiles, host)
- ✅ Unique meta titles/descriptions per page (template + dynamic data)
- ✅ Canonical URLs (prevent duplicate content)
- ✅ Open Graph + Twitter Cards (optimized social sharing)
- ✅ XML sitemap (auto-generated via Astro integration)
- ✅ robots.txt configuration (allow crawling, specify sitemap)

**Structured Data Testing (CI/CD Integration):**
- Pre-commit hook: Validate JSON-LD syntax (schema-dts or schema.org validator API)
- Post-deploy: Automated Lighthouse SEO audit (fail if score <95)
- Google Structured Data Testing Tool (manual check during QA)

**Content SEO:**
- ✅ Keyword-optimized episode titles (front-load primary keywords)
- ✅ Descriptive URLs (e.g., `/episodes/vitalik-buterin-ethereum-future`)
- ✅ Alt text for all images (guest names, episode topics)
- ✅ Internal linking strategy (see below)
- ✅ Transcripts (future: full-text search, keyword-rich content)

**Internal Linking Strategy:**
- Homepage → Top 5 episodes (manually curated or most-viewed)
- Episode pages → Related episodes (tag-based, 3-5 links)
- Episode pages → Guest profiles (all guests featured)
- Guest profiles → All episodes featuring guest
- About page → Latest episode, guest directory
- Footer → Sitemap, all major sections

**Anchor Text Guidelines:**
- Use descriptive text: "Episode 42 with Vitalik Buterin" (not "click here")
- Vary anchor text (avoid over-optimization)
- Automate via CMS (guest names auto-link to profiles)

**Keyword Targeting (New Podcasts):**
- Primary keywords: `[podcast topic] podcast`, `[host name] podcast`
- Episode-level keywords: `[guest name] interview`, `[topic] explained`
- Long-tail keywords: `how to [topic]`, `[guest name] on [specific subject]`

**SEO Monitoring Tools:**
- Google Search Console (weekly review)
- Ahrefs or SEMrush (keyword rankings, backlinks) - monthly check
- Screaming Frog (quarterly crawl audits)

**Off-Site Growth Tactics:**
- **Backlink Outreach:** Pitch guest profiles to their personal sites (link back to episode)
- **Directory Submissions:** Podcast directories (Listen Notes, Podchaser, Player.fm)
- **Guest Swaps:** Cross-promote with similar podcasts (link exchanges)
- **PR/Media:** Pitch newsworthy episodes to industry publications

### 8.2 Performance Targets

**Core Web Vitals:**
- **LCP** (Largest Contentful Paint): <2.5s (target: <1.5s)
- **FID** (First Input Delay): <100ms (target: <50ms)
- **CLS** (Cumulative Layout Shift): <0.1 (target: <0.05)

**Page Speed:**
- Lighthouse Performance score: >90 (target: >95)
- Time to Interactive: <3s (target: <2s)
- Total page size: <500KB excluding audio (target: <300KB)
- First Contentful Paint: <1.8s

**Optimization Tactics:**
- ✅ Image optimization (WebP + AVIF, responsive `srcset`, lazy loading)
- ✅ CDN for static assets (Netlify Edge or Cloudflare)
- ✅ Minimal third-party scripts (async/defer loading)
- ✅ Critical CSS inlining (above-the-fold styles)
- ✅ Font subsetting (only load needed characters)
- ✅ Font preloading (`<link rel="preload">` for critical fonts)
- ✅ Audio player lazy-loaded (only when user scrolls to it)

**Performance Monitoring:**
- Real User Monitoring (RUM): Google Analytics 4 Core Web Vitals report
- Synthetic Monitoring: Lighthouse CI (runs on every deploy)
- Budget alerts: Netlify build size warnings if >500KB

---

## 9. Analytics, Instrumentation & Observability

### 9.1 Analytics Stack

**Primary: Google Analytics 4**

**Event Tracking Plan:**

| Event Name | Parameters | Purpose |
|------------|------------|---------|
| `page_view` | page_path, page_title | Default pageview tracking |
| `subscribe_click` | platform (spotify, apple), location | Measure subscription intent |
| `patreon_click` | episode_id, location | Measure monetization funnel |
| `audio_play` | episode_id, timestamp | Engagement metric |
| `audio_complete` | episode_id, duration | Listener retention |
| `social_share` | platform (twitter, linkedin), episode_id | Virality metric |
| `newsletter_signup` | source (homepage, episode_page) | Email list growth |
| `episode_search` | query | Content discovery patterns |

**Naming Convention:** `snake_case`, verb-first (e.g., `click_subscribe` → `subscribe_click`)

**Custom Dimensions:**
- Podcast name (for multi-site analytics consolidation)
- Episode category/tag (if implemented)
- User type (new vs. returning)

**Dashboards (GA4):**
- **Overview:** Sessions, users, top episodes, conversion rates
- **Engagement:** Audio plays, completion rate, avg. session duration
- **Acquisition:** Traffic sources, referrals, search keywords
- **Monetization:** Patreon clicks, subscribe clicks, funnel analysis

**Secondary (Optional): Plausible Analytics**
- Privacy-friendly (no cookies, GDPR compliant)
- Lightweight script (<1KB)
- Use for EU visitors or as GA4 backup
- Parallel tracking (both GA4 + Plausible)

### 9.2 Error Monitoring & Uptime

**Error Monitoring: Sentry**
- Capture JavaScript errors (broken player, failed API calls)
- Capture build errors (Sanity fetch failures)
- Source map uploads (readable stack traces)
- Slack/email alerts for critical errors

**Uptime Monitoring: UptimeRobot (Free Tier)**
- Ping homepage every 5 minutes
- Alert if downtime >1 minute (email + SMS)
- Status page (public or private)

**Build Failure Notifications:**
- Netlify → Slack webhook (failed builds alert #dev-alerts channel)
- Email to admin if build fails 2+ times consecutively

### 9.3 Data Retention & Compliance

**Retention Periods:**
- GA4 data: 14 months (default, configurable to 2 months for GDPR)
- Sentry errors: 90 days (free tier limit)
- Netlify logs: 30 days
- Sanity content history: Unlimited (versioned by default)

**PII Handling:**
- Email addresses: Stored in ConvertKit only (not GA4)
- IP addresses: Anonymized in GA4 (`anonymize_ip: true`)
- Form submissions: No PII logged to analytics (only aggregate counts)

**GDPR/CCPA Compliance:**
- Cookie consent banner (Cookiebot or Osano, free tier)
- Privacy policy + Terms of Service (templated, customizable per podcast)
- Data deletion requests: ConvertKit + Sanity manual deletion process (documented)

### 9.4 Experimentation Framework (Phase 2)

**A/B Testing Tools:**
- Google Optimize (free, integrates with GA4)
- Netlify Edge Functions (server-side tests)

**Test Cadence:** 1 experiment per month (minimum 2-week runtime)

**Sample Experiments:**
- Homepage CTA button color/copy
- Episode card layout (grid vs. list)
- Patreon widget placement (sidebar vs. inline)

**Success Criteria:**
- Statistical significance: p-value <0.05
- Minimum sample size: 1,000 visitors per variant
- Primary metric: Conversion rate (subscribe, Patreon, newsletter)

**Guardrail Metrics:**
- Bounce rate (should not increase >5%)
- Page load time (should not increase >10%)
- Audio play rate (should not decrease)

---

## 10. Accessibility, Localization & Compliance

### 10.1 Accessibility Requirements (WCAG 2.1 AA)

**Concrete Acceptance Tests:**

| Requirement | Test Method | Tool |
|-------------|-------------|------|
| Color contrast ≥4.5:1 (text) | Automated scan | axe DevTools, Lighthouse |
| Color contrast ≥3:1 (UI components) | Automated scan | axe DevTools |
| Keyboard navigation (all interactive elements) | Manual test | Tab/Shift+Tab, Enter, Space |
| Screen reader compatibility | Manual test | NVDA (Windows), VoiceOver (macOS) |
| Focus indicators visible | Manual test | Tab through page, verify outline |
| Alt text on all images | Automated scan | Lighthouse, axe |
| ARIA labels on complex widgets (audio player) | Manual review | Browser DevTools |
| Semantic HTML (headings hierarchy) | Automated scan | WAVE, Lighthouse |
| Transcript availability (future) | Manual check | Verify transcript on episode page |

**Focus Management for Embeds:**
- Audio player: Ensure play/pause buttons keyboard-accessible
- YouTube embeds: Use `title` attribute for screen readers
- Forms: Label all inputs, logical tab order

**Audio Accessibility:**
- Transcripts downloadable (TXT or PDF format)
- Captions for video trailers (YouTube auto-captions + manual review)
- Audio descriptions for visual content (future, Phase 3)

### 10.2 Localization & Internationalization (i18n)

**Phase 1:** English only (US/UK)

**Phase 3 Strategy:**

**Static Copy Translation:**
- UI strings extracted to JSON (en.json, es.json, etc.)
- Google Translate API + human review for quality
- Astro's built-in i18n routing (`/en/episodes`, `/es/episodios`)

**Content Translation (Sanity):**
- Localized fields (e.g., `title_en`, `title_es`, `showNotes_en`, `showNotes_es`)
- Language selector in Sanity Studio (edit in multiple languages)
- Fallback to English if translation missing

**Right-to-Left (RTL) Languages:**
- CSS logical properties (`margin-inline-start` vs `margin-left`)
- RTL stylesheet for Arabic, Hebrew (auto-loaded based on language)

**Supported Languages (Priority Order):**
1. English (EN)
2. Spanish (ES) - large podcast market
3. Portuguese (PT) - Brazil podcast growth
4. Future: French, German, Japanese

### 10.3 Legal & Compliance

**Required Legal Pages:**
- Privacy Policy (template: Termly or iubenda, customized per podcast)
- Terms of Service (standard podcast TOS template)
- Cookie Policy (auto-generated by Cookiebot)
- DMCA Notice (for user-generated content in Phase 2+)

**Cookie Consent:**
- Banner on first visit (Cookiebot free tier: 100 subpages)
- Granular consent (Analytics, Marketing, Necessary)
- Logged consent in GA4 (do not track if rejected)

**Age Restrictions:**
- Explicit content warning (if applicable, per podcast)
- Age gate (checkbox: "I am 18+") before accessing explicit episodes
- Parental advisory labels (if required by content)

**Per-Podcast Customization:**
- Legal pages templated, fill in podcast-specific details (contact email, entity name)
- Content rating (clean, explicit) configured in `config/theme.json`

---

## 11. Phased Implementation Plan

### **Phase 1: MVP (Weeks 1-4) - Strange Water Launch**

**Week 1: Foundation**
- [ ] Initialize Astro project with TypeScript
- [ ] Set up Sanity Studio with schema (Podcast, Episode, Guest, Page)
- [ ] Configure Netlify deployment + environment variables
- [ ] Implement design system (Tailwind CSS, component library)
- [ ] Set up local development environment
- [ ] Create git repository, branching strategy (main, develop, feature/*)

**Week 2: Core Features**
- [ ] Homepage (latest episodes grid, subscribe CTAs, hero section)
- [ ] Episodes archive page (paginated, 12 per page)
- [ ] Individual episode pages (audio player embed, show notes, guest links)
- [ ] Guest directory (grid layout with photos)
- [ ] Individual guest pages (bio, social links, episode list)
- [ ] About page (podcast description, host bio)
- [ ] 404 error page (custom, helpful)

**Week 3: Content & SEO**
- [ ] Content migration script (Spotify + strangewater.xyz → Sanity)
- [ ] Migrate all 69 Strange Water episodes + guests
- [ ] Data validation (automated checks + manual QA of 10 episodes)
- [ ] Implement Schema.org markup (PodcastSeries, PodcastEpisode, Person)
- [ ] Add meta tags (Open Graph, Twitter Cards, dynamic per page)
- [ ] Generate XML sitemap, configure robots.txt
- [ ] Google Analytics 4 integration + event tracking
- [ ] Sentry error monitoring setup

**Week 4: Polish & Launch**
- [ ] Performance optimization (image compression, lazy loading, font subsetting)
- [ ] Accessibility audit (axe DevTools, manual keyboard/screen reader test)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iPhone, Android, tablet)
- [ ] SEO validation (Lighthouse >95, structured data test)
- [ ] Configure 301 redirects (old URLs → new URLs)
- [ ] Set up Sanity webhook → Netlify build hook
- [ ] Deploy to strangewater.xyz (production)
- [ ] Submit sitemap to Google Search Console
- [ ] Monitor analytics, Core Web Vitals (first 48 hours)

**Exit Criteria for Phase 1:**
- ✅ Lighthouse Performance: >90
- ✅ Lighthouse SEO: >95
- ✅ Lighthouse Accessibility: >90
- ✅ All 69 episodes migrated successfully (100% validation passed)
- ✅ Zero 404 errors (redirect validation complete)
- ✅ Mobile usability: 100% (Google Search Console)
- ✅ Core Web Vitals: All green (LCP <2.5s, FID <100ms, CLS <0.1)
- ✅ Analytics tracking verified (at least 10 events captured in GA4)

### **Phase 2: Enhancement (Weeks 5-8) - New Podcast Features**

- [ ] "Request an Episode" form (Netlify Forms → Airtable)
- [ ] "Ask a Question" form (same integration)
- [ ] Email newsletter signup (ConvertKit integration, double opt-in)
- [ ] Episode search & filtering (client-side, fast search)
- [ ] Related episodes algorithm (tag-based + manual curation)
- [ ] Transcript generation (Whisper API, automated on publish)
- [ ] Transcript display on episode pages (collapsible, searchable)
- [ ] Comments (Giscus via GitHub Discussions)
- [ ] pods.media integration exploration (monetization)
- [ ] Cookie consent banner (Cookiebot or Osano)
- [ ] Privacy policy + Terms of Service pages

**Exit Criteria for Phase 2:**
- ✅ Conversion forms have baseline conversion data (>50 submissions)
- ✅ Transcripts automated for 100% of new episodes
- ✅ Newsletter signup CTR >3% of homepage visitors
- ✅ Episode search functional (sub-200ms response time)
- ✅ GDPR compliance validated (legal review)

### **Phase 3: Scale (Weeks 9-12) - Second Podcast Deployment**

- [ ] Abstract theme configuration (multi-podcast support)
- [ ] Create deployment documentation (step-by-step guide + video)
- [ ] Build CLI scaffold tool (`npx create-podcast-site`)
- [ ] Create new podcast instance (new branding, different domain)
- [ ] Test content management workflow with non-technical user (junior coordinator)
- [ ] Implement privacy-focused analytics (Plausible or Fathom)
- [ ] A/B testing framework (Google Optimize integration)
- [ ] Advanced features (topic tags, custom audio player with chapters)
- [ ] Media asset storage strategy (evaluate S3 vs Netlify for large libraries)
- [ ] Automated backups (Sanity → S3 daily export)

**Exit Criteria for Phase 3:**
- ✅ Second podcast deployed in <4 hours (timed test)
- ✅ Non-technical user can publish episode in <30 min (training + execution)
- ✅ Component versioning system operational (1 release published)
- ✅ A/B test completed with statistical significance (1 experiment)
- ✅ Automated backup verified (content exportable to JSON)

---

## 12. Testing & Quality Assurance

### 12.1 Testing Activities

**Unit Testing:**
- Component tests (Vitest + Testing Library)
- Utility function tests (date formatting, URL parsing)
- Coverage target: >80% for critical paths

**Integration Testing:**
- Sanity API fetch tests (mock responses)
- Build process tests (Astro → HTML output validation)
- Form submission tests (Netlify Forms endpoints)

**Visual Regression Testing:**
- Percy or Chromatic (screenshot comparison)
- Test on: Homepage, episode page, guest page, 404
- Devices: Mobile (375px), tablet (768px), desktop (1440px)

**Accessibility Audits:**
- Automated: axe DevTools (pre-commit hook)
- Manual: NVDA screen reader test (1 episode page, 1 guest page, homepage)
- Color contrast: All text elements validated (WCAG AA)

**Performance Testing:**
- Lighthouse CI (runs on every PR)
- WebPageTest (monthly check, multiple locations)
- Load testing: Simulate 1,000 concurrent users (Artillery.io)

**SEO Testing:**
- Structured data validation (Google Rich Results Test)
- Meta tag validation (Screaming Frog crawl)
- Mobile-friendliness test (Google Search Console)

### 12.2 Deployment Pipeline

**CI/CD Provider:** GitHub Actions (free for public repos, 2,000 min/month private repos)

**Pipeline Stages:**

```yaml
1. Lint & Type Check
   - ESLint (code quality)
   - TypeScript compiler (type safety)

2. Unit Tests
   - Vitest (run all component/utility tests)
   - Fail if coverage <80%

3. Build
   - Astro build (generate static HTML)
   - Fail if build errors

4. Lighthouse CI
   - Performance: >90
   - SEO: >95
   - Accessibility: >90
   - Fail if any score below threshold

5. Deploy to Staging (develop branch)
   - Netlify preview deploy
   - Post preview URL to PR comment

6. Manual QA Approval
   - Reviewer tests staging URL
   - Approves PR

7. Deploy to Production (main branch)
   - Netlify production deploy
   - Post-deploy smoke tests (homepage loads, analytics fires)
```

**Branching Model:**
- `main` → Production (auto-deploys to strangewater.xyz)
- `develop` → Staging (auto-deploys to staging.strangewater.xyz)
- `feature/*` → Branch previews (Netlify generates unique URL)

**Required Approvals:**
- `feature/*` → `develop`: 1 reviewer (peer review)
- `develop` → `main`: 1 reviewer (QA approval) + manual testing checklist

### 12.3 Post-Launch Monitoring & Rollback

**Smoke Tests (Post-Deploy):**
- [ ] Homepage loads (HTTP 200)
- [ ] Latest episode page loads (audio player renders)
- [ ] Guest directory loads (images render)
- [ ] Google Analytics event fires (pageview tracked)
- [ ] Sitemap accessible (/sitemap.xml)

**Monitoring (First 2 Weeks):**
- Daily Google Search Console check (404 errors, coverage issues)
- Daily analytics review (traffic anomalies, error spikes)
- Core Web Vitals RUM data (ensure green across all metrics)

**Rollback Procedure:**
1. Detect issue (error spike, traffic drop, Core Web Vitals degradation)
2. Identify last known good deploy (Netlify UI, timestamp)
3. Click "Publish deploy" on previous version (instant rollback)
4. Investigate root cause (logs, error monitoring)
5. Fix forward (create hotfix branch, fast-track approval)

**Rollback Decision Criteria:**
- ❌ Homepage unavailable (HTTP 500/404)
- ❌ Core Web Vitals fail (LCP >4s, CLS >0.25)
- ❌ JavaScript errors >10% of sessions (Sentry alert)
- ❌ Analytics tracking broken (zero events in 1 hour)

---

## 13. Success Metrics

### 13.1 Launch Metrics (Week 4)

**Technical Excellence:**
- ✅ Lighthouse Performance: >90 (target: >95)
- ✅ Lighthouse SEO: >95 (target: 100)
- ✅ Lighthouse Accessibility: >90 (target: 95)
- ✅ Page load time: <3s (target: <2s)
- ✅ Core Web Vitals: All green (75th percentile)

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

### 13.2 Growth Metrics (Ongoing)

**Traffic:**
- Organic search traffic (Google Analytics): +20% MoM (months 2-6)
- Direct traffic: Establish baseline (month 1), grow +10% MoM
- Referral traffic: Track backlinks (Ahrefs), target +5 quality backlinks/month

**Engagement:**
- Episode page views: Track top 10 episodes, identify patterns
- Audio play rate: >40% of episode page visitors
- Avg. session duration: >2 minutes (engaged browsing)
- Bounce rate: <60% (industry benchmark: 70-80%)

**Conversions:**
- Subscribe clicks: >5% of visitors (any platform)
- Patreon clicks: >2% of episode page visitors
- Email newsletter signups: >3% of homepage visitors (Phase 2)

**SEO Performance:**
- Keyword rankings: Track 10 target keywords (Ahrefs/SEMrush)
- SERP features: Featured snippets, people also ask (track monthly)
- Domain authority: Baseline at launch, grow +5 points in 6 months

### 13.3 Technical Metrics

**Reliability:**
- Uptime: >99.9% (UptimeRobot monthly report)
- Build success rate: >95% (Netlify stats)
- Error rate: <1% of sessions (Sentry)

**Performance:**
- Core Web Vitals (RUM): All green (75th percentile)
- Build time: <5 minutes (average)
- Time to first byte (TTFB): <600ms

**Operations:**
- CMS editor satisfaction: Qualitative feedback (survey after Phase 2)
- Time to publish episode: <10 minutes (timed by Content Coordinator)
- Content migration speed: <1 hour per 50 episodes (validated in Phase 3)

### 13.4 Framework Reusability Metrics

**Deployment Efficiency:**
- Time to deploy new podcast: <4 hours (zero to production)
- Branding customization effort: <2 hours (measured with timer)
- Launch checklist completion: 100% automated checks pass

**Developer Experience:**
- Documentation completeness: 100% of features documented
- Onboarding time (new developer): <2 hours to first local build
- Component reuse rate: >80% of components unchanged between podcasts

---

## 14. Risks, Dependencies & Mitigation

### 14.1 Risk Register

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Content migration errors** | High | Medium | Automated validation script, manual QA sample (10 episodes), fallback data handling |
| **CMS too complex for non-technical users** | Medium | Low | Simplify Sanity Studio UI, create video tutorials, 1:1 training session |
| **Hosting costs spike with traffic** | Medium | Low | Monitor bandwidth (Netlify alerts), implement Cloudflare CDN, plan migration to self-hosted |
| **Podcast host API changes** | Low | Medium | Abstract audio URLs (CMS field, not hardcoded), fallback to direct embed codes |
| **SEO ranking doesn't transfer** | High | Medium | 301 redirects, submit sitemap to Google, monitor Search Console (2 weeks), backlink outreach |
| **Performance degrades with more episodes** | Medium | Low | Pagination (12 per page), optimize Sanity queries (projection), incremental static regeneration |
| **Vendor lock-in (Sanity pricing changes)** | Medium | Low | Automated content export (JSON → S3 daily), abstraction layer for CMS queries |
| **Vendor lock-in (Netlify limits)** | Medium | Low | Standard static hosting (portable to Vercel, Cloudflare Pages), IaC via netlify.toml |
| **External API failures (Patreon, Spotify)** | Low | Medium | Fallback behavior (cached data, error messages), rate limit handling, timeout retries |
| **Security breach (Sanity Studio)** | High | Low | Strong passwords (1Password), 2FA required, IP allowlist (Sanity Pro feature, future), audit logs |
| **Data loss (accidental delete)** | High | Low | Sanity history (versioning built-in), automated daily backups (Sanity → S3), restore procedure documented |

### 14.2 External Dependencies

| Dependency | SLA | Rate Limits | Fallback Strategy |
|------------|-----|-------------|-------------------|
| **Sanity API** | 99.9% uptime | 100k requests/month (free tier) | Cache content locally (build time), graceful degradation (stale content) |
| **Netlify Hosting** | 99.9% uptime | 300 build min, 100GB bandwidth/month | Self-hosted fallback (S3 + CloudFront), static export portable |
| **Spotify for Podcasters** | No SLA | Embed rate limits unclear | Direct MP3 URLs as backup, download + self-host audio files |
| **Google Analytics** | No SLA | No rate limits (standard) | Plausible Analytics as backup, event queue (retry on failure) |
| **Patreon API** | No SLA | 100 requests/min | Cache membership data, degrade gracefully (show static CTA) |
| **ConvertKit API** | 99% uptime | 120 requests/min | Queue signups (retry on failure), fallback to Netlify Forms |

**Dependency Monitoring:**
- Status pages bookmarked (Sanity, Netlify, Spotify)
- Slack alerts for downtime (UptimeRobot or StatusCake)
- Monthly dependency health check (review SLA reports)

### 14.3 Open Questions & Decisions

**1. Audio Player: Custom vs. Embed?**
   - **MVP:** Embed from podcast host (simplicity, zero maintenance)
   - **Phase 2:** Evaluate custom player (Plyr.js) for chapters, playback speed, analytics
   - **Decision Needed:** Week 2 (based on podcast host embed quality)

**2. Transcripts: Auto-generate vs. Manual?**
   - **MVP:** Manual for Strange Water (69 episodes = $70-100 Whisper API cost, one-time)
   - **New Podcasts:** Auto-generate on publish (Whisper API, $0.0015/min)
   - **Decision Needed:** Week 3 (budget approval)

**3. Comments: Enable for Strange Water?**
   - **Recommendation:** No (archival site, no new content)
   - **New Podcasts:** Yes (Giscus, GitHub Discussions)
   - **Decision Needed:** Week 2

**4. Newsletter Platform: ConvertKit vs. Mailchimp vs. Resend?**
   - **Recommendation:** ConvertKit (podcast-friendly, generous free tier)
   - **Decision Needed:** Phase 2 kickoff (Week 5)

**5. Media Asset Storage: Netlify vs. S3 vs. Cloudflare R2?**
   - **MVP:** Netlify (built-in, simple, free tier sufficient)
   - **Future (1,000+ episodes):** Evaluate S3 or Cloudflare R2 (cheaper at scale)
   - **Decision Needed:** Phase 3 (Week 9)

**6. Content Archival Strategy:**
   - Automated daily Sanity export → S3 (JSON + images)
   - Retention: Indefinite (S3 Glacier for cost optimization)
   - Restore procedure documented (import script)
   - **Decision Needed:** Week 3 (implement before launch)

**7. Security Posture:**
   - **Sanity Studio:** Password + 2FA (all users), consider IP allowlist (Pro tier feature)
   - **Environment Secrets:** Netlify environment variables (encrypted), rotate quarterly
   - **API Keys:** Never commit to git, use `.env.example` template
   - **Decision Needed:** Week 1 (security policy documented)

**8. Community Features Moderation:**
   - Comments: GitHub-based (block/delete via GitHub interface)
   - Forms: Manual review (Airtable notifications), spam filtering (Akismet or reCAPTCHA)
   - **Decision Needed:** Phase 2 (moderation workflow documented)

---

## 15. Appendix: Research Findings

### A. Competitive Analysis

**Best-in-Class Examples:**
- **Ahrefs Podcast:** Bold, high-energy design, strong CTA placement, excellent SEO
- **Huberman Lab:** Clean, science-backed, credible design, extensive show notes
- **99% Invisible:** Strong visual identity, excellent typography, engaging guest profiles
- **Crime Junkie:** Effective monetization integration (merch, Patreon), loyal community
- **The Joe Rogan Experience:** Minimalist, video-first, massive content library (searchable)

**Key Features (Industry Standards):**
- Embedded audio players (all sites)
- Episode transcripts (80% of top sites)
- Guest profiles with photos (70%)
- Search functionality (60%)
- Subscribe CTAs on every page (100%)
- Social share buttons (90%)

**SEO Best Practices:**
- Individual episode pages with unique URLs (100%)
- Schema.org markup (PodcastEpisode) (50%)
- Transcripts for searchability (80%)
- Internal linking (episodes ↔ guests) (70%)

### B. Technical Research

**Framework Comparison:**

| Framework | Performance | SEO | DX | Ecosystem | Best For |
|-----------|-------------|-----|----|-----------| ---------|
| **Astro** | ⭐⭐⭐⭐⭐ (zero JS) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | Content sites, blogs, podcasts |
| **Next.js** | ⭐⭐⭐⭐ (SSR/ISR) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Web apps, e-commerce, dashboards |
| **Gatsby** | ⭐⭐⭐⭐ (static) | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | Blogs, marketing sites (declining) |

**Astro Advantages for Podcasts:**
- Fastest Time to Interactive (ships zero JS by default)
- Excellent SEO (pre-rendered HTML, no client-side hydration delays)
- Content-first philosophy (built for blogs/marketing)
- Growing ecosystem (integrations with all major CMS)

**CMS Comparison:**

| CMS | Cost (Free Tier) | Customization | DX | Learning Curve | Best For |
|-----|------------------|---------------|----|--------------| ---------|
| **Sanity** | 100k API calls, 3 users | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Medium | Content-rich apps, podcasts |
| **Contentful** | 25k records, 5 users | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Low | Enterprise, large teams |
| **Strapi** | Self-hosted (free) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | High | Developers, full control |

**Sanity Chosen For:**
- Real-time collaboration (multiple editors, live updates)
- Fully customizable Studio (tailor for podcast content)
- Content portability (export to JSON, no lock-in)
- Developer-friendly (GROQ queries, portable content)
- Cost-effective (free tier sufficient for 1-2 podcasts)

**Hosting Comparison:**

| Host | Cost (Free Tier) | Build Minutes | Bandwidth | Features | Best For |
|------|------------------|---------------|-----------|----------| ---------|
| **Netlify** | $0 (commercial OK) | 300 min | 100GB | Forms, redirects, edge functions | Static sites, Jamstack |
| **Vercel** | $0 (non-commercial) | 6,000 min | 100GB | Edge functions, analytics | Next.js apps, web apps |
| **Cloudflare Pages** | $0 (unlimited) | 500 builds | Unlimited | Workers, R2 storage | High-traffic sites |

**Netlify Chosen For:**
- Commercial use allowed on free tier (Vercel requires $20/mo Pro for commerce)
- Generous free tier (sufficient for 1-2 podcasts)
- Great DX (deploy previews, instant rollbacks)
- Framework-agnostic (not tied to Next.js like Vercel)

### C. SEO Best Practices

**Schema.org Markup (Critical):**
- `PodcastSeries` (homepage): Helps Google understand site is a podcast
- `PodcastEpisode` (episode pages): Rich results eligibility (search snippets)
- `Person` (guest/host pages): Knowledge Graph integration

**Individual Episode Pages (Essential):**
- Unique URLs (not tabs or modals)
- Keyword-optimized titles (front-load important keywords)
- Descriptive meta descriptions (140-160 characters)
- Internal links (related episodes, guest profiles)

**Transcripts (High Impact):**
- 10x more indexable content per episode
- Long-tail keyword opportunities (niche phrases in conversation)
- Accessibility benefit (WCAG compliance)
- User experience (searchable, skimmable)

**Core Web Vitals (Ranking Factor):**
- LCP <2.5s: Fast loading (prioritize above-fold content)
- FID <100ms: Responsive (minimize JavaScript)
- CLS <0.1: Stable layout (reserve space for images, embeds)

**Google Prioritizes:**
- Mobile-first indexing (responsive design essential)
- HTTPS (required for ranking boost)
- Fast loading (Core Web Vitals ranking factor)
- Quality content (long-form show notes, transcripts)

---

## 16. Next Steps

### Immediate Actions (Week 0 - Pre-Development)

1. **Approve PRD** (stakeholder sign-off)
2. **Provision Accounts:**
   - Sanity.io (free tier)
   - Netlify (free tier)
   - Google Analytics 4 (create property)
   - Sentry (free tier)
   - GitHub repository (create + invite team)
3. **Gather Assets:**
   - Strange Water logo (SVG + PNG)
   - Favicon
   - OG image (1200x630px)
   - Host photo + bio
   - Guest photos (69 episodes, variable # of guests)
4. **Access Credentials:**
   - Spotify for Podcasters (episode export)
   - Existing strangewater.xyz (scrape access)
   - Domain registrar (DNS configuration)

### Phase 1 Kickoff (Week 1)

1. **Development Environment Setup**
2. **Initial Architecture Implementation**
3. **Design System Creation**
4. **Sanity Schema Definition**

### Success Criteria Recap

**Phase 1 Complete When:**
- ✅ All 69 Strange Water episodes live on new site
- ✅ Lighthouse scores: Performance >90, SEO >95, Accessibility >90
- ✅ Core Web Vitals: All green (RUM data)
- ✅ Zero 404 errors, all redirects functional
- ✅ Analytics tracking verified
- ✅ strangewater.xyz DNS pointed to Netlify

**Estimated Timeline:** 4 weeks to Strange Water launch, then iterate based on analytics and user feedback.

**Long-Term Vision:** Reusable podcast framework enabling rapid deployment of future shows, with proven performance, SEO, and user experience standards.
