# Product Requirements Document (PRD)
## Podcast Website Framework

**Document Version:** 5.0 (Final)
**Last Updated:** 2025-10-05
**Status:** Approved for Development

---

## 1. Executive Summary

This PRD outlines the development of a **reusable podcast website framework** to replace the current Strange Water podcast site (strangewater.xyz) hosted on PodcastPage.io. The framework will be deployed first for Strange Water (69 episodes, completed/archival series), then reused for future podcasts with customized branding and features.

### 1.1 Dual Goals

1. **Immediate:** Launch performant, SEO-optimized Strange Water site (archival/marketing property)
2. **Strategic:** Build reusable framework/template enabling rapid deployment of future podcast websites

**Learning Feedback Loop:** Strange Water rollout serves as production validation for the framework. All architecture decisions, content workflows, and deployment processes will be documented and abstracted into the template for future shows.

### 1.2 Development Methodology

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

### 1.3 Primary Audience Segments & Business Goals

| Segment | Needs | Business Goals |
|---------|-------|----------------|
| **Listeners** | Discover episodes, consume content, subscribe | ↑ Organic traffic, ↑ session duration, ↑ platform subscriptions |
| **Prospective Guests** | Learn about show, assess fit, submit pitch | ↑ High-quality guest applications, ↓ outreach effort |
| **Partners/Sponsors** | Validate audience, assess brand alignment | ↑ Sponsorship inquiries, ↑ Patreon conversions |
| **Content Operators** | Publish episodes efficiently, update content | ↓ Time to publish, ↓ technical friction, ↑ content quality |

### 1.4 Out of Scope (Phase 1)

- ❌ Paid membership/premium content tiers
- ❌ Community forums or user-generated content (beyond forms)
- ❌ Advanced analytics dashboard (custom reporting)
- ❌ Mobile apps (native iOS/Android)
- ❌ Live streaming or real-time episode publishing
- ❌ Podcast hosting (RSS generation, audio distribution)

### 1.5 Framework Reusability KPIs

- ⏱ **Time to Deploy New Podcast:** <4 hours from zero to production-ready
- 🎨 **Branding Customization Effort:** <2 hours (colors, fonts, logos, copy)
- ✅ **Launch Checklist Completion:** 100% automated checks (SEO, performance, accessibility)
- 📊 **Content Migration Speed:** <1 hour per 50 episodes (scripted import)

---

## 2. Background & Current State

### 2.1 Current Site Analysis (strangewater.xyz)

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

### 2.2 User Context

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

## 4. Project Structure & Organization Strategy

This section defines how we organize the codebase to support both the immediate goal (Strange Water launch) and the strategic goal (reusable framework for multiple podcasts).

### 4.1 Repository Strategy

**Approach: Single Template Repository**

We will use a **single template repository** model where:
- The repo starts as Strange Water-specific (Phase 1)
- Gets progressively abstracted into a template (Phase 2)
- Serves as the source for new podcast instances (Phase 3)

**Why this approach:**
- ✅ Simple to start (no premature abstraction)
- ✅ Learn from real production use case (Strange Water)
- ✅ Natural evolution from specific → generic
- ✅ Standard pattern (like create-react-app, Next.js starters)

**Alternative considered (rejected for now):**
- ❌ **npm package approach:** Too complex initially, better for Phase 4+ after pattern stabilizes
- ❌ **Monorepo:** Not needed for 1-2 podcasts owned by same person

### 4.2 Evolution Strategy: Instance → Template → Instances

```
Phase 1 (Weeks 1-4):
┌─────────────────────────────────┐
│   podcast-framework (repo)      │
│   ├── Strange Water specific    │
│   ├── Configurable branding*    │
│   └── Single Sanity project     │
└─────────────────────────────────┘
   *Config layer added Day 6

Phase 2 (Weeks 5-8):
┌─────────────────────────────────┐
│   podcast-framework (repo)      │
│   ├── Fully abstracted config   │
│   ├── Generic components        │
│   ├── Documentation added       │
│   └── Still running SW          │
└─────────────────────────────────┘

Phase 3 (Weeks 9-12):
┌─────────────────────────────────┐
│   podcast-framework (template)  │ ← Source of truth
│   ├── Generic codebase          │
│   ├── Example configs           │
│   └── CLI scaffold tool         │
└─────────────────────────────────┘
        │
        ├─── Clone/Fork ───┐
        │                  │
        ▼                  ▼
┌──────────────┐   ┌──────────────┐
│ Strange Water│   │ New Podcast  │
│ (instance)   │   │ (instance)   │
└──────────────┘   └──────────────┘
```

**Instance Management:**
- Each podcast is a **separate repository** (forked/cloned from template)
- Instances are **independent** after creation (no git connection to template)
- Updates propagated via **manual merge** or **CLI tool** (Phase 3+)

### 4.3 File Structure (Annotated)

```
podcast-framework/
│
├── src/                                    # [FRAMEWORK] Astro application
│   ├── components/                         # [FRAMEWORK] Shared UI components
│   │   ├── EpisodeCard.astro              # Episode list item
│   │   ├── GuestProfile.astro             # Guest card/profile display
│   │   ├── AudioPlayer.astro              # Audio embed wrapper
│   │   ├── Header.astro                   # Site header (uses config)
│   │   ├── Footer.astro                   # Site footer (uses config)
│   │   ├── SEO.astro                      # Meta tags, Schema.org markup
│   │   ├── SubscribeCTA.astro             # Subscribe button component
│   │   └── PatreonWidget.astro            # Patreon support widget
│   │
│   ├── layouts/                            # [FRAMEWORK] Page layouts
│   │   ├── BaseLayout.astro               # Global layout (header, footer)
│   │   ├── EpisodeLayout.astro            # Episode page template
│   │   ├── GuestLayout.astro              # Guest page template
│   │   └── PageLayout.astro               # Generic page template
│   │
│   ├── pages/                              # [FRAMEWORK] Routes (Astro file-based routing)
│   │   ├── index.astro                    # Homepage
│   │   ├── about.astro                    # About page (content from Sanity)
│   │   ├── episodes/
│   │   │   ├── index.astro                # Episodes archive
│   │   │   └── [slug].astro               # Individual episode page
│   │   ├── guests/
│   │   │   ├── index.astro                # Guest directory
│   │   │   └── [slug].astro               # Individual guest page
│   │   └── 404.astro                      # Custom 404 page
│   │
│   ├── lib/                                # [FRAMEWORK] Utilities & helpers
│   │   ├── sanity.ts                      # Sanity client, queries (uses env vars)
│   │   ├── config.ts                      # Load & validate config/theme.json
│   │   ├── seo.ts                         # SEO helpers (meta tags, schema)
│   │   ├── analytics.ts                   # Analytics abstraction (GA4, Plausible)
│   │   └── utils.ts                       # Date formatting, string utils
│   │
│   ├── styles/                             # [FRAMEWORK] Global styles
│   │   ├── global.css                     # Base styles, CSS reset
│   │   └── theme.css                      # CSS variables (from config/theme.json)
│   │
│   └── env.d.ts                            # TypeScript environment types
│
├── config/                                 # [INSTANCE] Podcast-specific configuration
│   ├── theme.json                         # Colors, fonts, branding
│   ├── site.json                          # Site metadata (name, URL, description)
│   └── features.json                      # Feature flags (newsletter, comments, etc.)
│
├── public/                                 # [INSTANCE] Static assets (podcast-specific)
│   ├── assets/
│   │   ├── logo.svg                       # Podcast logo
│   │   ├── logo.png                       # Logo fallback
│   │   ├── favicon.ico                    # Favicon
│   │   └── og-image.jpg                   # Default social sharing image
│   ├── robots.txt                         # [INSTANCE] Sitemap URL
│   └── _redirects                         # [INSTANCE] Netlify redirects (optional)
│
├── sanity/                                 # Sanity Studio
│   ├── schemas/                            # [FRAMEWORK] Content models
│   │   ├── podcast.ts                     # Podcast info schema
│   │   ├── episode.ts                     # Episode schema
│   │   ├── guest.ts                       # Guest schema
│   │   ├── page.ts                        # Generic page schema
│   │   └── index.ts                       # Schema registry
│   │
│   ├── config/                             # [INSTANCE] Sanity project config
│   │   └── sanity.config.ts               # Project ID, dataset, API version
│   │
│   ├── plugins/                            # [FRAMEWORK] Custom Sanity plugins (optional)
│   └── static/                             # Sanity Studio assets
│
├── scripts/                                # [INSTANCE/FRAMEWORK] Migration & utility scripts
│   ├── migrate-strangewater.js            # [INSTANCE] Strange Water migration
│   ├── import-from-rss.js                 # [FRAMEWORK] Generic RSS import
│   ├── validate-content.js                # [FRAMEWORK] Content validation
│   └── backup-sanity.js                   # [FRAMEWORK] Automated backup script
│
├── .github/                                # CI/CD configuration
│   └── workflows/
│       ├── deploy.yml                     # Netlify deployment pipeline
│       ├── lighthouse.yml                 # Performance testing
│       └── dependabot.yml                 # Automated dependency updates
│
├── docs/                                   # [FRAMEWORK] Documentation
│   ├── SETUP.md                           # New instance setup guide
│   ├── CUSTOMIZATION.md                   # Branding & theming guide
│   ├── CONTENT_MIGRATION.md               # Import episode data
│   ├── DEPLOYMENT.md                      # Hosting & domain setup
│   └── ARCHITECTURE.md                    # Technical architecture overview
│
├── .env.example                            # [FRAMEWORK] Environment variable template
├── .gitignore                              # [FRAMEWORK] Git ignore rules
├── netlify.toml                            # [INSTANCE] Netlify configuration
├── package.json                            # [FRAMEWORK] Dependencies & scripts
├── tsconfig.json                           # [FRAMEWORK] TypeScript configuration
├── astro.config.mjs                        # [FRAMEWORK] Astro configuration
├── tailwind.config.cjs                     # [FRAMEWORK] Tailwind CSS config
├── CHANGELOG.md                            # [FRAMEWORK] Version history
├── LICENSE                                 # [FRAMEWORK] MIT License
└── README.md                               # [FRAMEWORK] Project overview
```

### 4.4 Framework vs. Instance Files

**[FRAMEWORK] Files** (shared across all podcasts):
- Core logic in `src/components/`, `src/layouts/`, `src/pages/`, `src/lib/`
- Sanity schemas in `sanity/schemas/`
- Build configuration (`astro.config.mjs`, `tsconfig.json`, `tailwind.config.cjs`)
- Migration scripts (generic: `import-from-rss.js`)
- Documentation in `docs/`

**[INSTANCE] Files** (customized per podcast):
- Configuration: `config/theme.json`, `config/site.json`, `config/features.json`
- Assets: `public/assets/*` (logo, favicon, OG image)
- Sanity config: `sanity/config/sanity.config.ts` (project ID, dataset)
- Environment variables: `.env` (Sanity token, GA4 ID, API keys)
- Netlify config: `netlify.toml` (domain, redirects)
- robots.txt: `public/robots.txt` (sitemap URL)
- Instance-specific migration scripts: `scripts/migrate-strangewater.js`

**Decision Rule:**
- If code references `config/*.json` → stays generic (FRAMEWORK)
- If file contains hardcoded podcast name/URL → needs abstraction (INSTANCE)
- If file is brand assets → always INSTANCE

### 4.5 Configuration-Driven Customization

**Core Principle:** All podcast-specific data lives in **config files** or **Sanity CMS**, never hardcoded in components.

**Example: Header Component**

❌ **Bad (Hardcoded):**
```astro
<!-- src/components/Header.astro -->
<header>
  <img src="/assets/logo.svg" alt="Strange Water" />
  <h1 style="color: #1a73e8">Strange Water Podcast</h1>
</header>
```

✅ **Good (Config-Driven):**
```astro
<!-- src/components/Header.astro -->
---
import { getConfig } from '@/lib/config';
const { podcast, branding } = getConfig();
---
<header>
  <img src={branding.logo.svg} alt={podcast.name} />
  <h1 style={`color: ${branding.colors.primary}`}>{podcast.name}</h1>
</header>
```

**Config File (`config/theme.json`):**
```json
{
  "podcast": {
    "name": "Strange Water",
    "tagline": "Exploring Ethereum and Web3"
  },
  "branding": {
    "colors": {
      "primary": "#1a73e8"
    },
    "logo": {
      "svg": "/assets/logo.svg"
    }
  }
}
```

**For New Podcast:** Just update `config/theme.json`, zero code changes needed.

### 4.6 Creating a New Podcast Instance (Phase 3)

**Automated Process (CLI Tool - Future):**

```bash
# Clone template
npx create-podcast-site my-new-podcast

# Interactive wizard prompts for:
# - Podcast name, tagline, description
# - Primary color, fonts
# - Host name, email
# - Sanity project ID (creates new project automatically)

cd my-new-podcast
npm install
npm run dev  # Site running with new branding!
```

**Manual Process (Phase 1-2):**

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourname/podcast-framework.git my-new-podcast
   cd my-new-podcast
   rm -rf .git
   git init
   ```

2. **Update Configuration Files**
   - Edit `config/theme.json` (colors, fonts, podcast name)
   - Edit `config/site.json` (URL, description, social links)
   - Edit `config/features.json` (enable/disable features)

3. **Replace Assets**
   - Replace `public/assets/logo.svg` and `logo.png`
   - Replace `public/assets/favicon.ico`
   - Replace `public/assets/og-image.jpg`

4. **Configure Sanity**
   ```bash
   cd sanity
   sanity init  # Creates new Sanity project
   # Copy project ID to sanity/config/sanity.config.ts
   ```

5. **Configure Environment**
   ```bash
   cp .env.example .env
   # Fill in:
   # SANITY_PROJECT_ID=xxx
   # SANITY_DATASET=production
   # SANITY_API_TOKEN=xxx
   # GA4_MEASUREMENT_ID=G-xxx
   ```

6. **Update Instance-Specific Files**
   - Edit `netlify.toml` (update domain, build settings)
   - Edit `public/robots.txt` (update sitemap URL)
   - Edit `package.json` (update name, repository URL)

7. **Deploy**
   ```bash
   git add .
   git commit -m "Initial commit for New Podcast"
   git remote add origin https://github.com/yourname/new-podcast.git
   git push -u origin main
   # Connect repo to Netlify
   ```

**Time Estimate:**
- Manual process (Phase 1-2): ~4 hours (matches KPI)
- Automated CLI (Phase 3): ~30 minutes

### 4.7 Update Propagation Strategy

**Challenge:** How do instances receive framework improvements after they've diverged?

**Phase 1-2 Strategy (Manual):**

1. **Framework updates** pushed to template repo's `main` branch
2. **Release tagged** with version (e.g., `v1.1.0`)
3. **Changelog** documents breaking changes, migration steps
4. **Instance owners** manually merge updates:
   ```bash
   cd my-podcast-instance
   git remote add template https://github.com/yourname/podcast-framework.git
   git fetch template
   git merge template/main  # Or cherry-pick specific commits
   # Resolve conflicts (usually in config/ or public/)
   git push
   ```

**Phase 3 Strategy (Semi-Automated):**

CLI tool handles selective updates:
```bash
cd my-podcast-instance
npx podcast-framework upgrade

# Interactive prompts:
# ✓ Update Astro components? (recommended)
# ✓ Update Sanity schemas? (breaking change - review migration guide)
# ✗ Update config/theme.json? (will overwrite your customizations)
# ✓ Update dependencies?

# Tool creates PR with changes, you review & merge
```

**Phase 4 Strategy (npm Package - Future):**

Framework published as `@podcast-framework/core` npm package:
```bash
npm install @podcast-framework/core@latest
# Components imported from package, config stays local
# Breaking changes handled via major version bumps
```

**Update Communication:**
- GitHub Releases (changelog, migration guide)
- Email notification for breaking changes
- Office hours (live support during major updates)

### 4.8 Refactoring Roadmap: Strange Water → Template

**Day 6 (Phase 1b):** Begin configuration abstraction
- Extract branding to `config/theme.json`
- Create `src/lib/config.ts` helper
- Update 2-3 components to read from config (test pattern)

**Week 5-6 (Phase 2):** Complete abstraction
- All components read from config (no hardcoded strings)
- Test: Can change brand by editing config alone?

**Week 7-8 (Phase 2):** Documentation & tooling
- Write `docs/SETUP.md`, `docs/CUSTOMIZATION.md`
- Create `.env.example` template
- Build content validation scripts

**Week 9-10 (Phase 3):** Multi-instance testing
- Create second podcast instance manually (follow docs)
- Identify pain points, update docs
- Measure time to deploy (target: <4 hours)

**Week 11-12 (Phase 3):** CLI scaffold tool
- Build `npx create-podcast-site` wizard
- Automate Sanity project creation
- Automate asset replacement prompts

**Success Criteria:**
- ✅ Second podcast deployed in <4 hours (manual) or <30 min (CLI)
- ✅ Zero hardcoded references to "Strange Water" in framework files
- ✅ Config changes alone sufficient for full rebrand
- ✅ Documentation complete (non-technical user can follow)

### 4.9 Version Control & Branching

**Template Repository Branches:**
- `main` → Stable template (used for cloning new instances)
- `develop` → Active development
- `feature/*` → Feature branches
- `release/*` → Release candidates (tested before merging to main)

**Instance Repository Branches:**
- `main` → Production (auto-deploys to podcast.com)
- `develop` → Staging (auto-deploys to staging.podcast.com)
- `feature/*` → Feature branches (Netlify branch previews)

**Git Workflow (Instance):**
```
1. Clone template → Initialize instance repo
2. Disconnect from template (remove remote)
3. Develop independently
4. Optionally add template as upstream remote (for updates)
```

**Tagging Convention:**
- Template releases: `v1.0.0`, `v1.1.0`, `v2.0.0` (semantic versioning)
- Instance releases: `strangewater-v1.0`, `newpodcast-v1.0` (instance-prefixed)

---

## 5. Recommended Technical Architecture

### 5.1 Core Stack: **Astro + Sanity CMS + Netlify**

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

### 5.2 Architecture Overview

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

### 5.3 Environments & Deployment

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

### 5.4 Dependency Management

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

## 6. Template & Theming Strategy

### 6.1 Configuration Layer

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
  },
  "monetization": {
    "patreonUrl": "https://patreon.com/strangewater",
    "subscribeLinks": [
      {
        "platform": "Spotify",
        "url": "https://open.spotify.com/show/xxx"
      },
      {
        "platform": "Apple Podcasts",
        "url": "https://podcasts.apple.com/us/podcast/xxx"
      },
      {
        "platform": "YouTube",
        "url": "https://youtube.com/@strangewater"
      }
    ]
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
- Monetization URLs (Patreon, subscribe links)

**Image Ratios:**
- Episode artwork: 1:1 (square)
- Guest photos: 1:1 (square)
- Social sharing: 1.91:1 (OG image standard)
- Hero images: 16:9 (optional homepage banner)

**Custom Component Slots:**
- Homepage hero section (replace with custom HTML/component)
- Episode page sidebar (inject custom widgets)
- Footer (custom links, legal pages)

### 6.2 Component Versioning & Release

**Shared Component Library:**
- Core components (EpisodeCard, GuestProfile, AudioPlayer, PatreonWidget) maintained in `src/components/`
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

## 7. Content & Data Migration

### 7.1 URL Mapping & Redirects

**Strange Water URL Structure (Old → New):**

```
https://strangewater.xyz/                          → https://strangewater.xyz/
https://strangewater.xyz/episodes                  → https://strangewater.xyz/episodes
https://strangewater.xyz/episode/[title-slug]      → https://strangewater.xyz/episodes/[title-slug]
https://strangewater.xyz/guests                    → https://strangewater.xyz/guests
https://strangewater.xyz/person/[name-slug]        → https://strangewater.xyz/guests/[name-slug]
https://strangewater.xyz/about                     → https://strangewater.xyz/about
```

**301 Redirect Rules** (`netlify.toml`):

```toml
[[redirects]]
  from = "/episode/*"
  to = "/episodes/:splat"
  status = 301

[[redirects]]
  from = "/person/*"
  to = "/guests/:splat"
  status = 301
```

**Redirect Validation:**
- Pre-launch: Crawl old site with Screaming Frog, export URL list
- Map all URLs to new structure (spreadsheet or script)
- Test redirects in staging environment
- Post-launch: Monitor Google Search Console for 404 errors (first 2 weeks)

### 7.2 Data Migration Strategy

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

### 7.3 Fallback Behavior for Missing Data

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

### 7.4 Multi-Source Import (Future Podcasts)

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

## 8. Functional Requirements

### 8.1 MVP Features (Phase 1 - Strange Water Launch)

#### **Episode Management**
- Display episode list (reverse chronological, paginated 12 per page)
- Individual episode pages with:
  - Audio player (embedded from podcast host)
  - Show notes (rich text, formatted)
  - Episode metadata (date, duration, episode number)
  - Guest information (linked to guest profiles)
  - Social share buttons (Twitter, LinkedIn, copy link)
  - YouTube video embed (if available)
  - Patreon support widget (sidebar)
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

#### **Monetization & Growth (Phase 1 - Core Requirement)**

**Subscribe CTAs:**
- Homepage hero: Primary "Subscribe" button with dropdown (Spotify, Apple, YouTube, RSS)
- Episode pages: Floating subscribe bar (sticky, non-intrusive)
- Footer: Subscribe links with platform icons

**Patreon Integration:**
- Episode page sidebar: "Support on Patreon" widget with tier preview
- Homepage: Patreon CTA module (above-the-fold or hero section)
- About page: Patreon benefits explanation

**CTA Placement Strategy:**
- Homepage hero: "Subscribe" button (primary CTA)
- Episode pages: "Support on Patreon" sidebar widget + subscribe bar
- Footer: Social links, subscribe links, Patreon link

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
- Fast Core Web Vitals scores (LCP <2.5s, FID <100ms, CLS <0.1)

### 8.2 Phase 2 Features (Weeks 5-8 - New Podcast Features)

#### **Audience Interaction:**
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

#### **Newsletter:**
- Email signup form (header/footer, slide-in on exit intent)
- ConvertKit integration (tagged by podcast)
- Automated episode notifications (RSS → ConvertKit automation)

#### **Enhanced Discovery:**
- Topic/category tagging (filterable episode list)
- Related episodes algorithm (tag-based + manual curation)
- Transcript search (full-text, indexed by Algolia or Pagefind)

#### **Content Enrichment:**
- Episode transcripts (Whisper API, auto-generated on publish)
- Chapter markers in player (custom audio player implementation)
- Key takeaways/highlights (manually curated, displayed on episode page)

### 8.3 Phase 3 Features (Weeks 9-12 - Future)

- Multi-language support (i18n via Astro's built-in `astro:i18n`)
- Premium content tiers (members-only episodes, locked via Patreon API)
- Advanced analytics dashboard (custom reporting, subscriber growth charts)
- Guest submission portal (guests upload own info, photos, bio)
- Automated social media clips/audiograms (Headliner or custom FFmpeg scripts)
- Integration with additional monetization (pods.media, Buy Me a Coffee, Stripe)

---

## 9. SEO & Performance Strategy

### 9.1 SEO Requirements

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

### 9.2 Performance Targets

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

## 10. Analytics, Instrumentation & Observability

### 10.1 Analytics Stack

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

### 10.2 Error Monitoring & Uptime

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

### 10.3 Data Retention & Compliance

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

### 10.4 Experimentation Framework (Phase 2)

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

## 11. Accessibility, Localization & Compliance

### 11.1 Accessibility Requirements (WCAG 2.1 AA)

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

### 11.2 Localization & Internationalization (i18n)

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

### 11.3 Legal & Compliance

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

## 13. Phased Implementation Plan

### 13.1 Implementation Philosophy

**Every increment should be:**
1. **Demonstrable:** Can show working output
2. **Testable:** Can verify it works
3. **Deployable:** Can push to staging immediately
4. **Valuable:** Moves us closer to launch

**Daily Rhythm:**
- Morning: Pick 1-3 tasks from current sub-phase
- Afternoon: Ship to staging, verify, demo
- End of day: Working site exists (even if incomplete)

### 13.2 Phase 1: Strange Water MVP (Weeks 1-4)

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

**Morning (3 hours) - Config Layer (Early Start per Codex Suggestion):**
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

**Afternoon (2-3 hours) - Hosted Studio (per Codex Suggestion):**
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

#### **Day 13: Monetization CTAs & Analytics** *(Codex Improvement)*

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

### 13.3 Phase 2: Enhancement (Weeks 5-8) - New Podcast Features

**Goal:** Add features for future active podcasts (forms, newsletter, transcripts).

**Approach:** Same iterative methodology - small tasks, continuous deployment.

**Sub-Phases:**

#### **Phase 2a: Newsletter & Forms (Days 21-28)**

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

#### **Phase 2b: Enhanced Discovery (Days 29-35)**

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

#### **Phase 2c: Transcript Generation (Days 36-40)**

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

### 13.4 Phase 3: Scale (Weeks 9-12) - Second Podcast Deployment

**Goal:** Fully abstract Strange Water code into reusable template. Deploy second podcast.

#### **Phase 3a: Final Config Abstraction (Days 41-48)**

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

#### **Phase 3b: Documentation (Days 49-53)**

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

#### **Phase 3c: Second Podcast Deployment (Days 54-60)**

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

### 13.5 Definition of "Done" for Each Task

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

## 14. Success Metrics

### 14.1 Launch Metrics (End of Phase 1, Day 15)

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

**Monetization Infrastructure:**
- ✅ Patreon widget live on all episode pages
- ✅ Subscribe CTAs on homepage + episode pages
- ✅ Event tracking functional (subscribe, Patreon, audio plays)

### 14.2 Growth Metrics (Ongoing - Months 1-6)

**Traffic:**
- Organic search traffic (Google Analytics): +20% MoM (months 2-6)
- Direct traffic: Establish baseline (month 1), grow +10% MoM
- Referral traffic: Track backlinks (Ahrefs), target +5 quality backlinks/month

**Engagement:**
- Episode page views: Track top 10 episodes, identify patterns
- Audio play rate: >40% of episode page visitors
- Avg. session duration: >2 minutes (engaged browsing)
- Bounce rate: <60% (industry benchmark: 70-80%)

**Conversions (Monetization):**
- Subscribe clicks: >5% of visitors (any platform)
- Patreon clicks: >2% of episode page visitors
- Email newsletter signups: >3% of homepage visitors (Phase 2)

**SEO Performance:**
- Keyword rankings: Track 10 target keywords (Ahrefs/SEMrush)
- SERP features: Featured snippets, people also ask (track monthly)
- Domain authority: Baseline at launch, grow +5 points in 6 months

### 14.3 Technical Metrics

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

### 14.4 Framework Reusability Metrics

**Deployment Efficiency:**
- Time to deploy new podcast: <4 hours (zero to production)
- Branding customization effort: <2 hours (measured with timer)
- Launch checklist completion: 100% automated checks pass

**Developer Experience:**
- Documentation completeness: 100% of features documented
- Onboarding time (new developer): <2 hours to first local build
- Component reuse rate: >80% of components unchanged between podcasts

### 14.5 Iteration Velocity Metrics

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

## 15. Risks, Dependencies & Mitigation

### 15.1 Risk Register

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Content migration errors** | High | Medium | Automated validation script, manual QA sample (10 episodes), fallback data handling |
| **Tasks take longer than estimated** | Medium | High | Build in buffer days (Day 16-20), prioritize ruthlessly |
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
| **Scope creep during development** | Medium | Medium | Strict definition of done, new ideas → GitHub Issues for Phase 2 |
| **Developer burnout (too many small tasks)** | Medium | Low | Focus on 1 sub-phase at a time, celebrate daily wins |

### 15.2 External Dependencies

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

### 15.3 Open Questions & Decisions

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

## 16. Appendix: Research Findings

### 16.1 Competitive Analysis

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

### 16.2 Technical Research

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

### 16.3 SEO Best Practices

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

## 17. Next Steps

### 17.1 Immediate Actions (Day 0 - Pre-Development)

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
5. **Set Up Development Environment:**
   - Install Node.js (LTS version)
   - Install Git
   - Configure code editor (VS Code recommended)

### 17.2 Day 1 Kickoff

**Morning:**
- [ ] Run `npm create astro@latest`
- [ ] Push to GitHub
- [ ] Connect Netlify
- [ ] Coffee break to celebrate first deploy!

**Afternoon:**
- [ ] Configure staging DNS
- [ ] Verify staging site loads
- [ ] Share staging URL with stakeholders

### 17.3 Success Criteria Recap

**Phase 1 Complete When:**
- ✅ All 69 Strange Water episodes live on new site
- ✅ Lighthouse scores: Performance >90, SEO >95, Accessibility >90
- ✅ Core Web Vitals: All green (RUM data)
- ✅ Zero 404 errors, all redirects functional
- ✅ Analytics tracking verified
- ✅ Monetization CTAs operational (Patreon, subscribe)
- ✅ strangewater.xyz DNS pointed to Netlify

**Estimated Timeline:** 4 weeks (20 days) to Strange Water launch, then iterate based on analytics and user feedback.

**Long-Term Vision:** Reusable podcast framework enabling rapid deployment of future shows, with proven performance, SEO, monetization, and user experience standards.

---

**End of PRD v5 - Complete Standalone Document**

