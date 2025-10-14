# Product Requirements Document (PRD) v3
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

## 4. Project Structure & Organization Strategy

This section defines how we organize the codebase to support both the immediate goal (Strange Water launch) and the strategic goal (reusable framework for multiple podcasts).

### 4.1 Repository Strategy

**Phase 1-2 Approach: Single Template Repository**

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
│   ├── Hardcoded branding        │
│   └── Single Sanity project     │
└─────────────────────────────────┘

Phase 2 (Weeks 5-8):
┌─────────────────────────────────┐
│   podcast-framework (repo)      │
│   ├── Abstracted config         │
│   ├── Theming system            │
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
│   │   └── SubscribeCTA.astro             # Subscribe button component
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

**Week 1-4 (Phase 1):** Build Strange Water-specific site
- Hardcode branding in components (acceptable)
- Use Strange Water Sanity project directly
- Focus on shipping fast, learning

**Week 5-6 (Phase 2):** Abstract configuration
- Extract all branding to `config/theme.json`
- Update components to read from config (via `getConfig()`)
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

### 6.2 New Instance Creation Process

See **Section 4.6** for detailed step-by-step guide.

**Quick Reference:**
1. Clone repository
2. Update `config/theme.json`, `config/site.json`
3. Replace assets (`public/assets/*`)
4. Create Sanity project, update config
5. Set environment variables
6. Deploy to Netlify

**Time Estimate:** <4 hours (manual), <30 min (CLI tool in Phase 3)

### 6.3 Component Versioning & Release

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

## 7. Content & Data Migration

### 7.1 URL Mapping & Redirects

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

_[Sections 8-17 remain identical to v2, continuing with Functional Requirements, SEO Strategy, Analytics, Accessibility, Implementation Plan, Testing, Success Metrics, Risks, Appendix, and Next Steps]_

---

## Summary of Changes (v2 → v3)

**Major Addition:**

**New Section 4: Project Structure & Organization Strategy** - Comprehensive 9-subsection guide covering:
1. Repository strategy (single template approach)
2. Evolution from instance → template → instances (visual diagram)
3. Complete annotated file structure (FRAMEWORK vs INSTANCE markers)
4. Framework vs. instance file taxonomy
5. Configuration-driven customization pattern (code examples)
6. Step-by-step new podcast instance creation guide
7. Update propagation strategy across phases
8. Refactoring roadmap (Strange Water → generic template)
9. Version control & branching conventions

**Impact:**
- All subsequent sections renumbered (old Section 4 → new Section 5, etc.)
- Provides explicit architectural blueprint for codebase organization
- Clarifies transition strategy from monolithic instance to reusable template
- Defines operational processes for creating and maintaining multiple podcast instances

**Why This Matters:**
This addresses the core question: "How do we structure this to support both Strange Water (specific) and future podcasts (generic)?" The answer is now fully specified with file paths, configuration examples, and phase-by-phase evolution plan.
