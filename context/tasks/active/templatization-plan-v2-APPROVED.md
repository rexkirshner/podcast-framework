# Podcast Framework Templatization Plan v2.0

**Document Version:** 2.0.0 (APPROVED)
**Date Created:** 2025-10-14 (Session 20)
**Status:** READY FOR IMPLEMENTATION
**Previous Version:** v1.0 (rejected - critical architectural issues)

---

## ✅ ARCHITECTURAL DECISIONS CONFIRMED

All critical decisions have been made and approved:

1. ✅ **Architecture Pattern:** NPM Package (not git fork)
2. ✅ **Component Overrides:** Hybrid (auto-resolution + slots)
3. ✅ **Sanity Schema Strategy:** Hybrid Extensible (versioned base + extensions)
4. ✅ **Repository Structure:** 3 separate repos (framework, template, docs)
5. ✅ **License:** MIT

---

## Executive Summary

### Vision
Transform the Strange Water podcast framework into a production-ready, maintainable NPM package system that enables rapid deployment of new podcast websites while preserving upgradeability and customization options.

### Core Architecture: NPM Package Pattern

**How it works:**
```
New Podcast Project/
├── package.json
│   ├── @podcast-framework/core: "^2.1.0"
│   ├── @podcast-framework/cli: "^2.1.0"
│   └── @podcast-framework/sanity-schema: "^2.0.0"
├── node_modules/
│   └── @podcast-framework/    # Framework code lives here
├── src/
│   ├── components/            # Custom/override components
│   └── pages/                 # Podcast-specific pages
├── sanity.config.ts           # Extended from base schemas
└── podcast.config.js          # Podcast configuration
```

**Updates:**
```bash
npm update @podcast-framework/core
# Or guided:
npx @podcast-framework/cli update
```

### Key Outcomes
- Deploy new podcast in 4-6 hours (includes semi-manual service setup)
- Maintain upgrade path for all instances
- Support 100+ podcast instances
- Enable community contributions
- Preserve customization flexibility

---

## Table of Contents

1. [Architecture](#1-architecture)
2. [Repository Structure](#2-repository-structure)
3. [Component Override System](#3-component-override-system)
4. [Sanity Schema Strategy](#4-sanity-schema-strategy)
5. [Configuration Management](#5-configuration-management)
6. [Upgrade & Migration Strategy](#6-upgrade--migration-strategy)
7. [Implementation Roadmap](#7-implementation-roadmap)
8. [Testing Strategy](#8-testing-strategy)
9. [Service Setup](#9-service-setup)
10. [Multi-Podcast Management](#10-multi-podcast-management)
11. [Documentation Strategy](#11-documentation-strategy)
12. [Success Metrics](#12-success-metrics)
13. [Risk Mitigation](#13-risk-mitigation)

---

## 1. Architecture

### 1.1 NPM Package Pattern

**Framework packages published to npm:**
- `@podcast-framework/core` - Components, layouts, utilities
- `@podcast-framework/cli` - Development tools
- `@podcast-framework/sanity-schema` - Base CMS schemas
- `@podcast-framework/themes` - Optional premium themes

**Podcasts consume as dependencies:**
```json
{
  "name": "my-podcast",
  "dependencies": {
    "@podcast-framework/core": "^2.1.0",
    "@podcast-framework/cli": "^2.1.0",
    "@podcast-framework/sanity-schema": "^2.0.0",
    "astro": "^5.1.0",
    "sanity": "^3.0.0"
  }
}
```

### 1.2 Package Structure

```
@podcast-framework/core/
├── components/
│   ├── Header.astro
│   ├── Footer.astro
│   ├── EpisodeCard.astro
│   ├── EpisodeSearch.astro
│   ├── NewsletterSignup.astro
│   ├── TranscriptViewer.astro
│   └── ...
├── layouts/
│   ├── BaseLayout.astro
│   └── ...
├── lib/
│   ├── component-resolver.ts    # Auto-resolution magic
│   ├── sanity.ts                # CMS client
│   ├── utils.ts                 # Formatters, helpers
│   └── types.ts                 # TypeScript types
├── styles/
│   └── base.css                 # Optional base styles
├── package.json
├── LICENSE (MIT)
└── README.md
```

### 1.3 Why NPM Package Pattern?

**Advantages:**
- ✅ Semantic versioning (2.1.0 → 2.1.1 auto-updates)
- ✅ No git merge conflicts
- ✅ TypeScript/IntelliSense works perfectly
- ✅ Clear dependency management
- ✅ Podcast repos stay clean (only custom code)
- ✅ Industry standard (Next.js, Gatsby, SvelteKit all use this)

**Trade-offs:**
- Can't directly edit framework files (intentional - separation of concerns)
- Requires override system design (solved in Section 3)

---

## 2. Repository Structure

### 2.1 Three Repositories

**Repository 1: `podcast-framework`** (Main Development)
```
podcast-framework/
├── packages/
│   ├── core/                    # @podcast-framework/core
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   ├── cli/                     # @podcast-framework/cli
│   │   ├── src/
│   │   ├── package.json
│   │   └── README.md
│   ├── sanity-schema/           # @podcast-framework/sanity-schema
│   │   ├── src/
│   │   ├── migrations/
│   │   ├── package.json
│   │   └── README.md
│   └── themes/                  # @podcast-framework/themes
│       ├── default/
│       └── minimal/
├── examples/
│   ├── basic/                   # Test podcast (minimal features)
│   └── advanced/                # Test podcast (all features)
├── .github/
│   └── workflows/
│       ├── publish.yml          # Publish to npm on tag
│       ├── test.yml             # Run tests
│       └── sync-template.yml    # Update template repo
├── package.json                 # Workspace config
├── LICENSE (MIT)
└── README.md
```

**Visibility:** Public (open source)
**Purpose:** Framework development, issue tracking, PRs

---

**Repository 2: `podcast-template`** (GitHub Template)
```
podcast-template/
├── .github/
│   └── workflows/
│       ├── deploy.yml           # Cloudflare Pages deployment
│       └── sync.yml             # Auto-update from framework releases
├── src/
│   ├── pages/
│   │   └── index.astro          # Example homepage
│   └── components/              # Empty (for overrides)
├── public/
│   └── placeholder-logo.png
├── sanity/
│   ├── sanity.config.ts         # Configured with base schemas
│   └── schemas/
│       └── index.ts             # Extends base schemas
├── astro.config.mjs
├── podcast.config.js            # Template config (to be customized)
├── package.json                 # Framework dependencies
├── .env.template                # Environment variable template
├── LICENSE (MIT)
└── README.md                    # Setup instructions
```

**Visibility:** Public
**Purpose:** "Use this template" for new podcasts
**Feature:** GitHub template enabled

---

**Repository 3: `podcast-framework-docs`** (Documentation Site)
```
podcast-framework-docs/
├── src/
│   ├── content/
│   │   ├── docs/
│   │   │   ├── getting-started/
│   │   │   ├── customization/
│   │   │   ├── deployment/
│   │   │   └── api-reference/
│   │   └── versions/
│   │       ├── v1/
│   │       └── v2/
│   └── pages/
├── astro.config.mjs             # Starlight config
├── package.json
└── README.md
```

**Visibility:** Public
**Purpose:** Documentation website
**URL:** docs.podcast-framework.com

---

### 2.2 Repository Sync

**Problem:** When `@podcast-framework/core@2.1.0` is published, template needs to update

**Solution:** Automated sync via GitHub Actions

```yaml
# podcast-framework/.github/workflows/publish.yml
on:
  push:
    tags: ['v*']

jobs:
  publish-and-sync:
    steps:
      - run: npm publish --workspaces

      - uses: peter-evans/repository-dispatch@v2
        with:
          token: ${{ secrets.TEMPLATE_REPO_PAT }}
          repository: your-org/podcast-template
          event-type: framework-updated
          client-payload: '{"version": "${{ github.ref_name }}"}'
```

**Result:** Template automatically stays in sync with framework releases

---

## 3. Component Override System

### 3.1 Hybrid Approach

**Two mechanisms for maximum flexibility:**

1. **Auto-Resolution** (Simple case - global override)
2. **Slot-Based** (Advanced case - per-page customization)

### 3.2 Auto-Resolution (Primary Mechanism)

**Framework provides component resolver:**

```typescript
// @podcast-framework/core/lib/component-resolver.ts
export async function getComponent(name: string) {
  // Try podcast's local override first
  try {
    return await import(`/src/components/${name}.astro`);
  } catch {
    // Fallback to framework component
    return await import(`@podcast-framework/core/components/${name}.astro`);
  }
}
```

**Framework layouts use resolver:**

```astro
---
// @podcast-framework/core/layouts/BaseLayout.astro
import { getComponent } from '@podcast-framework/core/lib/component-resolver';

const Header = await getComponent('Header');
const Footer = await getComponent('Footer');
---

<Header />
<slot />
<Footer />
```

**Podcast overrides by creating local file:**

```astro
<!-- Podcast's src/components/Header.astro -->
---
// Automatically used instead of framework Header!
---
<header class="my-custom-design">
  <!-- Custom implementation -->
</header>
```

**That's it!** No configuration needed.

### 3.3 Slot-Based Overrides (Advanced)

**Framework layouts also provide slots:**

```astro
---
// @podcast-framework/core/layouts/BaseLayout.astro
import { getComponent } from '@podcast-framework/core/lib/component-resolver';

const Header = await getComponent('Header');
const Footer = await getComponent('Footer');
---

<!-- Allow per-page slot overrides -->
<slot name="header">
  <Header />
</slot>

<main>
  <slot />
</main>

<slot name="footer">
  <Footer />
</slot>
```

**Podcast can override per-page:**

```astro
---
// src/pages/special-page.astro
import BaseLayout from '@podcast-framework/core/layouts/BaseLayout.astro';
import SpecialHeader from '../components/SpecialHeader.astro';
---

<BaseLayout>
  <!-- Override header just for this page -->
  <SpecialHeader slot="header" />

  <h1>Special Page Content</h1>

  <!-- Footer uses default (global override or framework) -->
</BaseLayout>
```

### 3.4 Extending Framework Components

**Podcasts can wrap framework components:**

```astro
---
// src/components/Header.astro
import FrameworkHeader from '@podcast-framework/core/components/Header.astro';
---

<!-- Add announcement bar before framework header -->
<div class="announcement-bar">
  🎉 New episode every Monday!
</div>

<!-- Use framework header with all its logic -->
<FrameworkHeader {...Astro.props} />
```

### 3.5 Override Discovery

**How podcasts know what's overridable:**

1. **Documentation:** Full component API reference at docs.podcast-framework.com
2. **TypeScript:** IntelliSense shows available components
3. **CLI Helper:**
   ```bash
   npx @podcast-framework/cli list-components
   # Shows all overridable components with descriptions
   ```

4. **Starter Files:**
   ```bash
   npx @podcast-framework/cli override Header
   # Creates src/components/Header.astro with framework code as starting point
   ```

---

## 4. Sanity Schema Strategy

### 4.1 Hybrid Extensible Pattern

**Framework provides base schemas as npm package:**

```typescript
// @podcast-framework/sanity-schema/schemas/episode.ts
export const baseEpisodeSchema = {
  name: 'episode',
  type: 'document',
  title: 'Episode',
  fields: [
    {name: 'title', type: 'string', validation: Rule => Rule.required()},
    {name: 'episodeNumber', type: 'number', validation: Rule => Rule.required()},
    {name: 'publishDate', type: 'datetime'},
    {name: 'duration', type: 'string'},
    {name: 'description', type: 'text'},
    {name: 'guests', type: 'array', of: [{type: 'reference', to: [{type: 'guest'}]}]},
    {name: 'hosts', type: 'array', of: [{type: 'reference', to: [{type: 'host'}]}]},
    {name: 'transcript', type: 'text'},
    {name: 'transcriptSegments', type: 'array', of: [{type: 'object', fields: [...]}]},
    {name: 'spotifyLink', type: 'url'},
    {name: 'applePodcastLink', type: 'url'},
    {name: 'youtubeLink', type: 'url'},
    // ... all core fields framework needs
  ]
};

export function extendEpisodeSchema(customFields: FieldDefinition[]) {
  return {
    ...baseEpisodeSchema,
    fields: [...baseEpisodeSchema.fields, ...customFields]
  };
}
```

**Podcast extends in their sanity.config.ts:**

```typescript
// sanity.config.ts (in podcast repo)
import { defineConfig } from 'sanity';
import { baseEpisodeSchema, baseGuestSchema, extendEpisodeSchema } from '@podcast-framework/sanity-schema';

// Extend with podcast-specific fields
const episode = extendEpisodeSchema([
  {name: 'sponsor', type: 'reference', to: [{type: 'sponsor'}]},
  {name: 'videoUrl', type: 'url'},
  {name: 'privateNotes', type: 'text'}
]);

// Add completely custom types
const sponsor = {
  name: 'sponsor',
  type: 'document',
  fields: [
    {name: 'name', type: 'string'},
    {name: 'website', type: 'url'}
  ]
};

export default defineConfig({
  name: 'my-podcast',
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',

  schema: {
    types: [
      episode,           // Extended base schema
      baseGuestSchema,   // Using base as-is
      sponsor           // Custom type
    ]
  }
});
```

### 4.2 Schema Versioning

**Framework maintains versioned schema packages:**

- `@podcast-framework/sanity-schema@1.x` - v1 schemas
- `@podcast-framework/sanity-schema@2.x` - v2 schemas (current)
- `@podcast-framework/sanity-schema@3.x` - v3 schemas (future)

**Podcasts control their version:**

```json
{
  "dependencies": {
    "@podcast-framework/core": "^2.5.0",           // Can update freely
    "@podcast-framework/sanity-schema": "^2.0.0"   // Pin major version
  }
}
```

### 4.3 Schema Migration Process

**When framework releases breaking schema change (v2→v3):**

**Step 1:** Framework publishes new version
```bash
npm publish @podcast-framework/sanity-schema@3.0.0
```

**Step 2:** Podcast checks for updates
```bash
npx @podcast-framework/cli check-updates

# Output:
# Schema update available: v2.0.0 → v3.0.0
#
# Breaking changes:
# - episode.description renamed to episode.summary
# - episode.duration changed from string to durationSeconds (number)
#
# This will affect 69 documents in your Sanity dataset.
#
# Run: npx @podcast-framework/cli migrate-schema --from=2 --to=3
```

**Step 3:** Generate migration script
```bash
npx @podcast-framework/cli migrate-schema --from=2 --to=3

# Generates: sanity/migrations/v2-to-v3.ts
# Shows preview of changes
# Asks: "Test on development dataset first? (y/n)"
```

**Step 4:** Review generated migration
```typescript
// sanity/migrations/v2-to-v3.ts (auto-generated by CLI)
import {getCliClient} from 'sanity/cli'

const client = getCliClient()

async function migrateEpisodes() {
  const episodes = await client.fetch('*[_type == "episode" && defined(description)]')

  for (const episode of episodes) {
    await client
      .patch(episode._id)
      .set({
        summary: episode.description,
        durationSeconds: parseDuration(episode.duration) // Helper function
      })
      .unset(['description', 'duration'])
      .commit()

    console.log(`✓ Migrated: ${episode.title}`)
  }
}

function parseDuration(duration: string): number {
  // "1:23:45" → 5025 seconds
  const parts = duration.split(':').map(Number)
  return parts[0] * 3600 + parts[1] * 60 + (parts[2] || 0)
}

migrateEpisodes().then(() => console.log('Migration complete!'))
```

**Step 5:** Test on development dataset
```bash
npx sanity exec sanity/migrations/v2-to-v3.ts \
  --dataset development \
  --with-user-token

# Verify in Sanity Studio (development)
```

**Step 6:** Backup production
```bash
npx @podcast-framework/cli backup-sanity --dataset production
# Creates: backups/sanity-production-2025-10-14.tar.gz
```

**Step 7:** Run on production
```bash
npx sanity exec sanity/migrations/v2-to-v3.ts \
  --dataset production \
  --with-user-token
```

**Step 8:** Update package version
```bash
npm install @podcast-framework/sanity-schema@^3.0.0

# Update import in sanity.config.ts:
# from '@podcast-framework/sanity-schema' still works (uses new version)
```

### 4.4 Backward Compatibility Policy

**Framework maintains:**
- Current major version (v3)
- Previous major version (v2) - security patches only
- Two versions back (v1) - critical security only

**Example timeline:**
- 2025 Q1: v2 current, v1 maintenance
- 2026 Q1: v3 released, v2 maintenance, v1 EOL
- 2027 Q1: v4 released, v3 maintenance, v2 EOL

---

## 5. Configuration Management

### 5.1 Configuration Hierarchy

**Priority order (highest to lowest):**
1. Environment variables (`.env.local`)
2. Podcast configuration (`podcast.config.js`)
3. Framework defaults

### 5.2 Podcast Configuration File

```javascript
// podcast.config.js
export default {
  // Identity
  name: "Tech Talks",
  tagline: "Deep dives into technology",
  description: "Weekly conversations with tech leaders",
  language: "en",

  // URLs
  domain: "techtalks.fm",
  url: "https://techtalks.fm",

  // Sanity CMS (per-podcast)
  sanity: {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
  },

  // Feature Flags
  features: {
    transcripts: true,
    newsletter: true,
    contributions: true,
    search: true,
    comments: false,
    platformLinks: {
      spotify: true,
      apple: true,
      youtube: true,
    }
  },

  // Integrations (per-podcast)
  integrations: {
    analytics: {
      provider: 'google',
      measurementId: process.env.GA_MEASUREMENT_ID,
    },
    newsletter: {
      provider: 'convertkit',
      apiKey: process.env.CONVERTKIT_API_KEY,
      formId: process.env.CONVERTKIT_FORM_ID,
    },
    transcripts: {
      provider: 'whisper',
      apiKey: process.env.OPENAI_API_KEY, // Can be shared across podcasts
    }
  },

  // Theme
  theme: '@podcast-framework/theme-default',
  themeOptions: {
    colorScheme: 'light',
    customCSS: './src/styles/custom.css',
  },

  // Deployment
  deployment: {
    provider: 'cloudflare-pages',
    branch: 'main',
  },

  // SEO
  seo: {
    defaultImage: '/og-image.png',
    twitterHandle: '@techtalks',
  }
}
```

### 5.3 Environment Variables

```bash
# .env.template (committed to repo)

# Sanity CMS (per-podcast)
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_TOKEN=your_token

# Analytics (per-podcast)
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Newsletter (per-podcast, optional)
CONVERTKIT_API_KEY=
CONVERTKIT_FORM_ID=

# Transcripts (can be shared)
OPENAI_API_KEY=

# Deployment (per-podcast)
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
```

---

## 6. Upgrade & Migration Strategy

### 6.1 Semantic Versioning

**Version format:** MAJOR.MINOR.PATCH (e.g., 2.1.3)

- **PATCH** (2.1.3 → 2.1.4): Bug fixes, auto-update safe
- **MINOR** (2.1.0 → 2.2.0): New features, backward compatible, auto-update safe
- **MAJOR** (2.0.0 → 3.0.0): Breaking changes, manual migration required

### 6.2 Package Updates

**Automatic (Patch/Minor):**
```json
// package.json uses caret (^) for auto-updates
{
  "dependencies": {
    "@podcast-framework/core": "^2.1.0"
    // npm update gets: 2.1.x and 2.2.x automatically
    // Does NOT get: 3.0.0 (major version change)
  }
}
```

```bash
# Update to latest patch/minor
npm update

# Or check first
npm outdated
```

**Manual (Major):**
```bash
# Check what major updates are available
npx @podcast-framework/cli check-updates

# Output:
# Major update available: 2.5.3 → 3.0.0
# Breaking changes:
# - Component API changes (see migration guide)
# - Schema changes (run schema migration)
#
# Run: npx @podcast-framework/cli update --major

# Guided major update
npx @podcast-framework/cli update --major

# Interactive prompts:
# ✓ Backup created: .backups/2025-10-14_v2.5.3
# ✓ Dependencies updated
# ✓ Migration guide: https://docs.podcast-framework.com/migration/v2-to-v3
# ⚠ Schema migration required (see above)
#
# Next steps:
# 1. Review migration guide
# 2. Run schema migration (if applicable)
# 3. Test locally
# 4. Deploy when ready
```

### 6.3 Rollback System

**Automatic backups before major updates:**

```bash
.podcast-framework-backups/
├── 2025-10-14_v2.5.3/
│   ├── package.json
│   ├── package-lock.json
│   ├── podcast.config.js
│   └── src/                  # Source files only
├── 2025-11-01_v3.0.0/
└── latest -> 2025-11-01_v3.0.0/
```

**Rollback command:**

```bash
# List backups
npx @podcast-framework/cli rollback --list

# Rollback to previous version
npx @podcast-framework/cli rollback --last

# Rollback to specific version
npx @podcast-framework/cli rollback --to=v2.5.3

# Restores package.json, reinstalls dependencies, keeps custom code
```

### 6.4 Testing Updates

**Framework provides test suite:**

```bash
# After updating, run compatibility tests
npm run test:framework

# Tests:
# ✓ All components render
# ✓ Custom overrides still work
# ✓ Configuration valid
# ✓ Build succeeds
# ✓ No TypeScript errors
```

---

## 7. Implementation Roadmap

### Revised Timeline: 12-14 Weeks

*Original plan: 8 weeks (unrealistic)*
*Revised: 12-14 weeks (realistic with proper CLI development)*

---

### **Phase 1: Foundation (Weeks 1-2)**

**Goal:** Extract core framework and establish npm package structure

**Week 1: Core Extraction**
- [ ] Audit Strange Water codebase (identify framework vs custom)
- [ ] Create `podcast-framework` monorepo structure
- [ ] Extract components to `packages/core/src/components/`
- [ ] Extract layouts to `packages/core/src/layouts/`
- [ ] Extract utilities to `packages/core/src/lib/`
- [ ] Create TypeScript types/interfaces
- [ ] Configure package build (tsup/vite)

**Week 2: Component Resolver & Testing**
- [ ] Implement component resolver (`getComponent()`)
- [ ] Update all layouts to use resolver
- [ ] Write unit tests for core components (>80% coverage)
- [ ] Create example podcast (test framework usage)
- [ ] Configure Changesets for versioning
- [ ] Add MIT license to all packages

**Deliverables:**
- `@podcast-framework/core` package (not yet published)
- Component resolver working in example podcast
- Test suite passing

---

### **Phase 2: Schema System (Week 3)**

**Goal:** Create extensible Sanity schema package

- [ ] Create `packages/sanity-schema/` package
- [ ] Extract base schemas (episode, guest, host, theme, contribution)
- [ ] Implement extension helpers (`extendEpisodeSchema()`)
- [ ] Create schema version numbering system
- [ ] Write schema documentation
- [ ] Test schema extension in example podcast

**Deliverables:**
- `@podcast-framework/sanity-schema` package
- Extension system working
- Documentation for custom fields

---

### **Phase 3: CLI Tool (Weeks 4-7)** ⏱️ *Extended from 1 week*

**Goal:** Production-quality CLI for scaffolding and management

**Week 4: CLI Foundation**
- [ ] Set up CLI package (`packages/cli/`)
- [ ] Choose framework (Commander.js recommended)
- [ ] Implement `create` command (scaffold new podcast)
- [ ] Implement template file system
- [ ] Add interactive prompts (Inquirer.js)
- [ ] Create progress indicators

**Week 5: Update & Migration Commands**
- [ ] Implement `check-updates` command
- [ ] Implement `update` command (with backup)
- [ ] Implement `rollback` command
- [ ] Implement `migrate-schema` command (generate migration scripts)
- [ ] Add dry-run mode for migrations

**Week 6: Helper Commands**
- [ ] Implement `list-components` command
- [ ] Implement `override <component>` command (scaffold override)
- [ ] Implement `backup-sanity` command
- [ ] Implement `validate` command (check config/schema)
- [ ] Add `--help` and `--version` flags

**Week 7: CLI Testing & Polish**
- [ ] Write CLI integration tests
- [ ] Test on Windows/Mac/Linux
- [ ] Add error handling and recovery
- [ ] Create CLI documentation
- [ ] Record video tutorials

**Deliverables:**
- `@podcast-framework/cli` package
- Full command suite
- >80% test coverage

---

### **Phase 4: Template Repository (Week 8)**

**Goal:** Create GitHub template for new podcasts

- [ ] Create `podcast-template` repository
- [ ] Scaffold minimal structure (src/, public/, sanity/)
- [ ] Configure Astro with framework packages
- [ ] Set up example podcast.config.js
- [ ] Create .env.template
- [ ] Add GitHub Actions (deploy to Cloudflare)
- [ ] Add setup script (npx @podcast-framework/cli setup)
- [ ] Enable "Use this template" feature
- [ ] Write comprehensive README

**Deliverables:**
- `podcast-template` repository (public)
- One-click template creation
- Automated deployment workflow

---

### **Phase 5: Documentation Site (Weeks 9-10)**

**Goal:** Comprehensive documentation website

**Week 9: Content**
- [ ] Set up docs site (Astro + Starlight)
- [ ] Write Getting Started guide (5-minute quickstart)
- [ ] Write Customization guides (components, themes, pages)
- [ ] Write Deployment guides (Cloudflare, Vercel, Netlify)
- [ ] Write Configuration reference (podcast.config.js)
- [ ] Write Schema guide (extending schemas)

**Week 10: API Reference & Advanced**
- [ ] Generate API docs from TypeScript (TypeDoc)
- [ ] Write Component API reference
- [ ] Write CLI command reference
- [ ] Write Migration guides (v1→v2, future versions)
- [ ] Create troubleshooting guide
- [ ] Add search functionality

**Deliverables:**
- docs.podcast-framework.com live
- 15+ documentation pages
- Full API reference
- Video tutorials (3-5 videos)

---

### **Phase 6: Testing & Validation (Week 11)**

**Goal:** Ensure production readiness

- [ ] Deploy test podcast from template
- [ ] Performance testing (Lighthouse scores)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iOS, Android)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Security audit (npm audit, Dependabot)
- [ ] Load testing (100+ concurrent users)
- [ ] Upgrade path testing (v1→v2 migration)

**Deliverables:**
- Test podcast deployed
- Performance report (Lighthouse 90+)
- Accessibility report (WCAG AA compliant)
- Security report (no critical vulnerabilities)

---

### **Phase 7: Launch Preparation (Week 12)**

**Goal:** Prepare for public release

- [ ] Create framework landing page
- [ ] Write launch blog post
- [ ] Create showcase gallery (Strange Water + test podcast)
- [ ] Set up GitHub Discussions
- [ ] Set up Discord server (optional)
- [ ] Prepare marketing materials (images, tweets, etc.)
- [ ] Create demo video (5 minutes)
- [ ] Set up analytics (track npm downloads, GitHub stars)

**Deliverables:**
- podcast-framework.com landing page
- Launch materials ready
- Community channels active

---

### **Phase 8: Beta Launch (Weeks 13-14)**

**Goal:** Soft launch with limited users

**Week 13:**
- [ ] Publish packages to npm (beta tag)
- [ ] Announce to 5-10 beta testers
- [ ] Monitor for issues
- [ ] Gather feedback
- [ ] Fix critical bugs

**Week 14:**
- [ ] Incorporate feedback
- [ ] Update documentation based on user questions
- [ ] Refine CLI UX
- [ ] Publish v1.0.0 (stable)
- [ ] Public launch announcement

**Deliverables:**
- v1.0.0 published to npm
- Beta feedback incorporated
- Ready for public launch

---

### **Post-Launch (Ongoing)**

- Monitor npm downloads, GitHub stars
- Respond to issues within 24-48 hours
- Release bug fixes as needed
- Plan v1.1 features based on feedback
- Grow community (Discord, showcases)

---

## 8. Testing Strategy

### 8.1 Test Pyramid

```
         /\
        /E2E\         5% - Full podcast creation/deployment
       /------\
      /Integ.  \      25% - Component integration, API
     /----------\
    /    Unit    \    70% - Component logic, utilities
   /--------------\
```

### 8.2 Coverage Requirements

- **Core package:** >90% coverage
- **CLI package:** >80% coverage
- **Schema package:** >85% coverage
- **Template:** >70% coverage

### 8.3 Test Types

**Unit Tests** (Vitest)
```typescript
// packages/core/src/lib/utils.test.ts
import { formatDate, stripHTML } from './utils';

describe('formatDate', () => {
  it('formats ISO date to readable string', () => {
    expect(formatDate('2025-10-14')).toBe('October 14, 2025');
  });
});
```

**Component Tests** (Vitest + Testing Library)
```typescript
// packages/core/src/components/EpisodeCard.test.ts
import { render } from '@testing-library/astro';
import EpisodeCard from './EpisodeCard.astro';

describe('EpisodeCard', () => {
  it('renders episode title and number', () => {
    const { getByText } = render(EpisodeCard, {
      props: { episode: { title: 'Test Episode', episodeNumber: 1 } }
    });
    expect(getByText('Episode 1')).toBeInTheDocument();
    expect(getByText('Test Episode')).toBeInTheDocument();
  });
});
```

**Integration Tests**
```typescript
// Test component resolver
describe('Component Resolver', () => {
  it('uses local override when available', async () => {
    // Mock local override exists
    const Header = await getComponent('Header');
    expect(Header).toBe(LocalHeader);
  });

  it('falls back to framework component', async () => {
    // Mock no local override
    const Footer = await getComponent('Footer');
    expect(Footer).toBe(FrameworkFooter);
  });
});
```

**E2E Tests** (Playwright)
```typescript
// e2e/create-podcast.spec.ts
test('create podcast from template', async ({ page }) => {
  // 1. Use template
  await page.goto('https://github.com/org/podcast-template');
  await page.click('text=Use this template');

  // 2. Clone and setup
  await exec('git clone ...');
  await exec('npm install');
  await exec('npm run dev');

  // 3. Verify site loads
  await page.goto('http://localhost:4321');
  await expect(page).toHaveTitle(/My Podcast/);

  // 4. Verify components render
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
});
```

### 8.4 CI/CD Testing

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [18, 20]
        test-podcast: [basic, custom-overrides, all-features]

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node }}

      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:framework -- --podcast=${{ matrix.test-podcast }}
      - run: npm run build

      - name: Lighthouse CI
        run: npm run lighthouse
```

---

## 9. Service Setup

### 9.1 Service Categories

**Per-Podcast Services** (each podcast needs its own):
- Sanity CMS project ($0-499/month)
- Google Analytics property (free)
- Cloudflare Pages project (free)
- Newsletter account (ConvertKit/Mailchimp, $0-30/month)
- Domain name ($12/year)

**Shared Services** (can use one account):
- OpenAI API for transcripts (shared key, track usage)
- GitHub organization (one org, many repos)
- Sentry error tracking (one org, multiple projects)

### 9.2 Setup Process (Semi-Manual)

**Reality:** Full automation not technically possible. Accepting semi-manual setup.

**CLI-guided setup:**

```bash
npx @podcast-framework/cli create my-podcast

# Interactive wizard:
? Podcast name: My Awesome Podcast
? Choose theme: default
? Enable transcripts? Yes
? Newsletter provider: ConvertKit
? Deploy to: Cloudflare Pages

# CLI creates project, then guides manual steps:

📝 Setup Checklist

✅ 1. Project scaffolded
✅ 2. Dependencies installed

🔧 3. Sanity CMS Setup (MANUAL - 5 minutes)

   Open: https://sanity.io/manage

   Steps:
   1. Click "Create Project"
   2. Name: "My Awesome Podcast"
   3. Copy Project ID

   Paste Project ID here: _______

✅ 4. Sanity configured

🔧 5. Google Analytics (MANUAL - 5 minutes)

   Open: https://analytics.google.com

   Steps:
   1. Create Property
   2. Copy Measurement ID (G-XXXXXXXXXX)

   Paste Measurement ID: _______

✅ 6. Analytics configured

🔧 7. Cloudflare Pages (SEMI-AUTOMATED - 5 minutes)

   Opening browser for OAuth...

   Steps:
   1. Authorize GitHub connection
   2. Select repository: my-podcast
   3. Click "Save and Deploy"

✅ 8. Deployment configured

🎉 Setup Complete! (15 minutes)

Next steps:
1. cd my-podcast
2. npm run dev
3. Open http://localhost:4321
4. Start customizing!
```

**Total setup time:** 15-30 minutes (realistic)

### 9.3 Service Costs Per Podcast

**Free Tier** (hobby podcast):
- Sanity: $0 (3 users, 100K requests)
- Cloudflare: $0
- Analytics: $0
- Domain: $12/year
- **Total:** ~$1/month

**Professional** (active podcast):
- Sanity: $99/month
- Cloudflare: $0
- Analytics: $0
- ConvertKit: $30/month
- Domain: $12/year
- Transcripts: ~$10/month
- **Total:** ~$140/month

---

## 10. Multi-Podcast Management

### 10.1 CLI Workspace Mode

**For managing 5+ podcasts:**

```bash
# Initialize workspace
npx @podcast-framework/cli workspace init

# Register podcasts
npx @podcast-framework/cli workspace add ./podcast-1
npx @podcast-framework/cli workspace add ./podcast-2
npx @podcast-framework/cli workspace add ./podcast-3

# View status
npx @podcast-framework/cli workspace status

# Output:
# Podcast Workspace Overview
#
# podcast-1      v2.1.0    ✅ Up to date    Last deploy: 2 days ago
# podcast-2      v2.0.3    ⚠️  Update: v2.1.0   Last deploy: 1 week ago
# podcast-3      v1.9.0    🔴 Update: v2.1.0   Last deploy: 3 weeks ago

# Update all podcasts
npx @podcast-framework/cli workspace update-all

# Deploy all
npx @podcast-framework/cli workspace deploy-all
```

### 10.2 Dashboard (Future Enhancement)

**Web dashboard for managing multiple podcasts:**

```typescript
// dashboard.podcast-framework.com
interface PodcastDashboard {
  podcasts: [{
    name: 'Strange Water',
    version: '2.1.0',
    status: 'active',
    episodes: 69,
    monthlyViews: 15000,
    sanityUsage: '45K/100K requests',
    costs: '$0/month',
    lastDeploy: '2 days ago'
  }],
  totalCosts: '$140/month',
  pendingUpdates: 2,
  alerts: []
}
```

**Features:**
- View all podcasts in one place
- See which need updates
- Monitor costs across all
- One-click deploy to staging/production
- Usage alerts (approaching Sanity limit)

**Timeline:** Post-v1.0 (nice-to-have, not MVP)

---

## 11. Documentation Strategy

### 11.1 Documentation Site Structure

```
docs.podcast-framework.com/
├── /                          # Landing page
├── /docs/
│   ├── /getting-started/
│   │   ├── introduction
│   │   ├── installation
│   │   ├── your-first-podcast
│   │   └── deployment
│   ├── /customization/
│   │   ├── components
│   │   ├── themes
│   │   ├── schemas
│   │   └── pages
│   ├── /deployment/
│   │   ├── cloudflare-pages
│   │   ├── vercel
│   │   └── netlify
│   └── /api/
│       ├── components/
│       ├── configuration
│       └── cli
├── /migration/
│   └── v1-to-v2
├── /showcase/               # Community podcasts
└── /changelog/
```

### 11.2 Documentation Maintenance

- **Auto-generated:** API docs from TypeScript (TypeDoc)
- **Manual:** Guides, tutorials, migration docs
- **Versioned:** Separate docs for v1, v2, etc.
- **Community:** Accept docs PRs

---

## 12. Success Metrics

### 12.1 Launch Metrics (First 3 Months)

**Adoption:**
- [ ] 10+ podcasts deployed
- [ ] 100+ GitHub stars
- [ ] 50+ npm downloads/week

**Quality:**
- [ ] <5 critical bugs reported
- [ ] <24h issue response time
- [ ] >90% user satisfaction (surveys)

### 12.2 Growth Metrics (First Year)

**Adoption:**
- [ ] 100+ podcasts deployed
- [ ] 1000+ GitHub stars
- [ ] 500+ npm downloads/week

**Ecosystem:**
- [ ] 5+ community plugins
- [ ] 3+ premium themes
- [ ] 20+ showcase sites

### 12.3 Technical Metrics (Ongoing)

**Performance:**
- Lighthouse score: >90 (all categories)
- Build time: <60 seconds
- Bundle size: <200KB (JS)
- First Contentful Paint: <1.5s

**Reliability:**
- Uptime: >99.9% (for docs/services)
- Test coverage: >85%
- Security: 0 critical vulnerabilities

---

## 13. Risk Mitigation

### 13.1 Technical Risks

| Risk | Mitigation |
|------|------------|
| Astro breaking changes | Pin Astro version, test upgrades thoroughly |
| Sanity API changes | Abstraction layer, version pinning |
| Component override complexity | Comprehensive docs, helper commands |
| npm package issues | Automated testing, version pinning |

### 13.2 Adoption Risks

| Risk | Mitigation |
|------|------------|
| Setup too complex | CLI wizard, video tutorials, live support |
| Poor documentation | Dedicated docs site, community feedback |
| Lack of community | Active engagement, showcases, Discord |
| Competition | Focus on quality, DX, and support |

### 13.3 Business Risks

| Risk | Mitigation |
|------|------------|
| Maintenance burden | Community contributors, automation |
| Support overwhelm | Excellent docs, community forum |
| Scope creep | Clear roadmap, v1.0 feature freeze |
| Burnout | Sustainable pace, 12-14 week timeline |

---

## 14. Appendices

### A. Package Structure Details

**@podcast-framework/core:**
```
packages/core/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── lib/
│   └── styles/
├── package.json
├── tsconfig.json
├── LICENSE (MIT)
└── README.md
```

**@podcast-framework/cli:**
```
packages/cli/
├── src/
│   ├── commands/
│   │   ├── create.ts
│   │   ├── update.ts
│   │   ├── migrate-schema.ts
│   │   └── ...
│   ├── templates/
│   └── index.ts
├── bin/
│   └── cli.js              # Executable
├── package.json
└── README.md
```

**@podcast-framework/sanity-schema:**
```
packages/sanity-schema/
├── src/
│   ├── schemas/
│   │   ├── episode.ts
│   │   ├── guest.ts
│   │   ├── host.ts
│   │   └── theme.ts
│   ├── migrations/
│   │   └── templates/
│   └── index.ts
├── package.json
└── README.md
```

### B. Technology Stack

- **Framework:** Astro 5.x
- **Language:** TypeScript 5.x
- **CMS:** Sanity 3.x
- **Styling:** Tailwind CSS 3.x
- **Testing:** Vitest + Playwright
- **CI/CD:** GitHub Actions
- **Hosting:** Cloudflare Pages (primary)
- **Package Manager:** npm
- **Monorepo:** npm workspaces
- **Documentation:** Starlight
- **License:** MIT

### C. License Text

```
MIT License

Copyright (c) 2025 [Your Name/Organization]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[Standard MIT License text continues...]
```

---

## 15. Next Steps

### Immediate Actions (Week 1)

1. ✅ **Approve this plan** - Confirm all decisions
2. [ ] **Create GitHub organization** - podcast-framework
3. [ ] **Initialize repositories:**
   - [ ] podcast-framework (main)
   - [ ] podcast-template
   - [ ] podcast-framework-docs
4. [ ] **Begin Phase 1** - Core extraction
5. [ ] **Set up project management** - GitHub Projects board

### Week 1 Checklist

- [ ] Create repos with MIT license
- [ ] Set up monorepo structure (npm workspaces)
- [ ] Configure TypeScript
- [ ] Set up testing (Vitest)
- [ ] Create first component extraction
- [ ] Document progress in project board

---

## 16. Conclusion

This revised plan provides a **realistic, coherent roadmap** for transforming Strange Water into a reusable podcast framework.

**Key improvements over v1.0:**
- ✅ Single, consistent architecture (NPM package pattern)
- ✅ Clear component override mechanism (hybrid auto-resolution + slots)
- ✅ Realistic Sanity schema strategy (versioned, extensible, manual migration)
- ✅ Realistic timeline (12-14 weeks, not 8)
- ✅ Clear repository structure (3 separate repos)
- ✅ License chosen (MIT)
- ✅ Honest about semi-manual service setup
- ✅ Multi-podcast management strategy
- ✅ No contradictions or undefined mechanisms

**Confidence level:** HIGH - This plan is technically sound and executable.

**Next milestone:** Complete Phase 1 (Weeks 1-2) - Core extraction and component resolver

---

**Document Status:** APPROVED - READY FOR IMPLEMENTATION
**Version:** 2.0.0
**Owner:** Rex Kirshner
**Last Updated:** 2025-10-14

---

*End of Document*