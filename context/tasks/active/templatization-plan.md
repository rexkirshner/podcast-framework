# Podcast Framework Templatization Plan

**Document Version:** 1.0.0
**Date Created:** 2025-10-14 (Session 20)
**Author:** Rex Kirshner + Claude
**Status:** DRAFT - Pending Review
**Purpose:** Comprehensive plan for converting Strange Water codebase into reusable podcast framework template

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Strategy](#architecture-strategy)
3. [GitHub Repository Strategy](#github-repository-strategy)
4. [Configuration Management](#configuration-management)
5. [Deployment Architecture](#deployment-architecture)
6. [Upgrade & Maintenance Strategy](#upgrade--maintenance-strategy)
7. [Implementation Plan](#implementation-plan)
8. [Testing Strategy](#testing-strategy)
9. [Documentation Strategy](#documentation-strategy)
10. [Long-Term Success Factors](#long-term-success-factors)
11. [Risk Analysis & Mitigation](#risk-analysis--mitigation)
12. [Decision Points](#decision-points)
13. [Success Metrics](#success-metrics)
14. [Timeline & Milestones](#timeline--milestones)

---

## 1. Executive Summary

**⚠️ CRITICAL ADDENDUM:** See `templatization-services-addendum.md` for essential details on:
- Third-party service architecture (per-podcast vs shared services)
- Strange Water repository migration strategy
- Sanity CMS architecture (one project per podcast)

### Vision
Transform the Strange Water podcast framework into a production-ready, maintainable template system that enables rapid deployment of new podcast websites while preserving upgradeability and customization options.

### Core Principles
1. **DRY (Don't Repeat Yourself):** Core framework updates benefit all podcasts
2. **Convention over Configuration:** Smart defaults with override capability
3. **Progressive Enhancement:** Start simple, add complexity as needed
4. **Backward Compatibility:** Updates don't break existing podcasts
5. **Developer Experience:** Easy to start, pleasant to maintain

### Key Outcomes
- Deploy new podcast in <4 hours
- Maintain upgrade path for all instances
- Support 100+ podcast instances
- Enable community contributions
- Preserve customization flexibility

---

## 2. Architecture Strategy

### 2.1 Template Architecture Pattern

**Recommended: Hybrid Template + Package Approach**

```
podcast-framework/
├── packages/
│   ├── core/                 # Core framework (npm package)
│   │   ├── components/        # Reusable components
│   │   ├── layouts/          # Base layouts
│   │   ├── lib/             # Core utilities
│   │   ├── styles/          # Base styles
│   │   └── package.json     # @podcast-framework/core
│   │
│   ├── cli/                  # CLI tool (npm package)
│   │   ├── commands/         # CLI commands
│   │   ├── templates/        # File templates
│   │   └── package.json      # @podcast-framework/cli
│   │
│   └── themes/               # Theme packages
│       ├── default/          # @podcast-framework/theme-default
│       └── minimal/          # @podcast-framework/theme-minimal
│
├── template/                 # GitHub template repository
│   ├── .github/             # GitHub Actions
│   ├── src/                 # Podcast-specific code
│   ├── config/              # Configuration files
│   ├── astro.config.mjs     # Astro configuration
│   ├── package.json         # Dependencies
│   └── README.md           # Setup instructions
│
├── examples/                # Example podcasts
│   ├── strange-water/      # Reference implementation
│   └── tech-talks/         # Different style example
│
└── docs/                   # Documentation site
    ├── getting-started/
    ├── customization/
    ├── deployment/
    └── api-reference/
```

### 2.2 Separation of Concerns

**Core Framework (Immutable)**
- Base components (Header, Footer, EpisodeCard, etc.)
- Core utilities (sanity client, formatters, etc.)
- Base layouts
- Common styles
- TypeScript types
- Testing utilities

**Podcast Instance (Customizable)**
- Configuration (podcast.config.js)
- Custom pages
- Theme overrides
- Custom components
- Static assets
- Environment variables

**CMS Schema (Versioned)**
- Episode schema
- Guest schema
- Theme schema
- Contribution schema
- Migration scripts

### 2.3 Plugin System

Enable extensibility through plugins:

```javascript
// podcast.config.js
export default {
  name: "My Podcast",
  plugins: [
    '@podcast-framework/plugin-comments',     // Giscus comments
    '@podcast-framework/plugin-analytics',    // Enhanced analytics
    '@podcast-framework/plugin-newsletter',   // Newsletter providers
    '@podcast-framework/plugin-transcripts',  // Transcript generation
    './plugins/custom-feature'               // Custom local plugin
  ]
}
```

---

## 3. GitHub Repository Strategy

### 3.1 Repository Structure

**Three-Repository Approach (Recommended)**

1. **podcast-framework** (Main Repository)
   - Monorepo with all packages
   - CI/CD for package publishing
   - Issue tracking
   - Development happens here

2. **podcast-template** (Template Repository)
   - GitHub template repository
   - Minimal boilerplate
   - Quick start configuration
   - "Use this template" button

3. **podcast-framework-docs** (Documentation)
   - Separate docs site
   - Tutorials and guides
   - API documentation
   - Community showcase

### 3.2 Version Management

**Semantic Versioning**
- MAJOR: Breaking changes (rare)
- MINOR: New features (monthly)
- PATCH: Bug fixes (as needed)

**Release Channels**
- `latest`: Stable releases
- `next`: Preview features
- `canary`: Nightly builds

**Git Flow**
```
main
├── develop
│   ├── feature/transcript-viewer-v2
│   ├── feature/plugin-system
│   └── fix/search-performance
├── release/v2.1.0
└── hotfix/critical-bug
```

### 3.3 Template Repository Workflow

**For New Podcasts:**
1. User clicks "Use this template"
2. GitHub creates new repository
3. User clones and runs setup script
4. Configure environment variables
5. Deploy to Cloudflare Pages

**Maintaining Connection:**
```bash
# Add upstream remote (one-time)
git remote add upstream https://github.com/your-org/podcast-template.git

# Pull framework updates
git fetch upstream
git merge upstream/main --allow-unrelated-histories

# Or use CLI tool
npx @podcast-framework/cli update
```

---

## 4. Configuration Management

### 4.1 Configuration Hierarchy

**Priority Order (highest to lowest):**
1. Environment variables (`.env.local`)
2. Podcast configuration (`podcast.config.js`)
3. Theme configuration (`theme.config.js`)
4. Framework defaults

### 4.2 Podcast Configuration File

```javascript
// podcast.config.js
export default {
  // Podcast Identity
  name: "Tech Talks",
  tagline: "Deep dives into technology",
  description: "Weekly conversations with tech leaders",
  language: "en",

  // Hosting & URLs
  domain: "techtalks.fm",
  url: "https://techtalks.fm",

  // Sanity CMS
  sanity: {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
  },

  // Features (opt-in)
  features: {
    transcripts: true,
    newsletter: true,
    contributions: true,
    search: true,
    comments: false,
    relatedEpisodes: false,
    platformLinks: {
      spotify: true,
      apple: true,
      youtube: true,
      rss: true,
    }
  },

  // Integrations
  integrations: {
    analytics: {
      provider: 'google',
      measurementId: process.env.GA_MEASUREMENT_ID,
    },
    newsletter: {
      provider: 'convertkit',
      formId: process.env.CONVERTKIT_FORM_ID,
    },
    transcripts: {
      provider: 'whisper',
      apiKey: process.env.OPENAI_API_KEY,
    }
  },

  // Theme
  theme: '@podcast-framework/theme-default',
  themeOptions: {
    colorScheme: 'light',
    fontFamily: 'Inter',
    customCSS: './src/styles/custom.css',
  },

  // Deployment
  deployment: {
    provider: 'cloudflare-pages',
    branch: 'main',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
  },

  // SEO & Social
  seo: {
    defaultImage: '/og-image.png',
    twitterHandle: '@techtalks',
    facebookAppId: null,
  },

  // Advanced
  advanced: {
    prerenderRoutes: true,
    experimentalFeatures: [],
    customWebhooks: [],
  }
}
```

### 4.3 Environment Variables

```bash
# .env.template (committed to repo)
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_TOKEN=your_token

# Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Newsletter (optional)
CONVERTKIT_API_KEY=
CONVERTKIT_FORM_ID=

# Transcripts (optional)
OPENAI_API_KEY=

# Email notifications
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
NOTIFICATION_EMAIL=

# Deployment
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
```

---

## 5. Deployment Architecture

### 5.1 One-Click Deployment Options

**Option A: Cloudflare Pages (Recommended)**
```yaml
# deploy-button.yml
name: Deploy to Cloudflare Pages
steps:
  1. Fork template repository
  2. Connect to Cloudflare Pages
  3. Set environment variables
  4. Auto-deploy on push
```

**Option B: Vercel**
```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/podcast-template)
```

**Option C: Netlify**
```markdown
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-org/podcast-template)
```

### 5.2 CLI Deployment Tool

```bash
# Install CLI globally
npm install -g @podcast-framework/cli

# Create new podcast
podcast-framework create my-podcast

# Interactive setup
? Podcast name: My Awesome Podcast
? Choose a theme: default
? Include transcripts? Yes
? Newsletter provider: ConvertKit
? Deploy to: Cloudflare Pages

# Deploy
cd my-podcast
npm run deploy
```

### 5.3 Multi-Environment Strategy

```
Production (main branch)
├── podcast.fm (custom domain)
└── my-podcast.pages.dev (Cloudflare subdomain)

Staging (staging branch)
└── staging.my-podcast.pages.dev

Development (local)
└── localhost:4321
```

### 5.4 CMS Setup Automation

```javascript
// scripts/setup-sanity.js
async function setupSanity() {
  // 1. Create Sanity project (if not exists)
  // 2. Deploy schema
  // 3. Import sample data (optional)
  // 4. Create webhook for deployment
  // 5. Set CORS origins
  // 6. Generate API token
  return {
    projectId,
    dataset,
    token
  };
}
```

---

## 6. Upgrade & Maintenance Strategy

### 6.1 Upgrade Paths

**Automatic Updates (Patch/Minor)**
```json
// package.json
{
  "dependencies": {
    "@podcast-framework/core": "^2.1.0", // Auto-updates 2.1.x
    "@podcast-framework/themes": "^2.1.0"
  }
}
```

**Manual Updates (Major)**
```bash
# Check for updates
npx @podcast-framework/cli check-updates

# View changelog
npx @podcast-framework/cli changelog

# Update with migration
npx @podcast-framework/cli update --major

# Run migrations
npx @podcast-framework/cli migrate
```

### 6.2 Migration System

```javascript
// migrations/2.0.0-to-3.0.0.js
export default {
  version: '3.0.0',
  breaking: true,

  async migrate(config) {
    // 1. Backup current state
    await backup();

    // 2. Update configuration
    if (config.analytics) {
      config.integrations = {
        ...config.integrations,
        analytics: config.analytics
      };
      delete config.analytics;
    }

    // 3. Update files
    await updateImports();

    // 4. Update dependencies
    await updatePackages();

    // 5. Run tests
    await runTests();

    return { success: true };
  },

  async rollback() {
    // Restore from backup
  }
}
```

### 6.3 Backward Compatibility Policy

- **Components:** 2 major versions supported
- **APIs:** Deprecation warnings for 1 major version
- **Configuration:** Auto-migration for 3 major versions
- **Themes:** Compatibility layer maintained

### 6.4 Update Communication

1. **Release Notes:** GitHub releases with detailed changelog
2. **Migration Guides:** Step-by-step for breaking changes
3. **Email Notifications:** Opt-in for security updates
4. **Dashboard:** In-app update notifications

---

## 7. Implementation Plan

### Phase 1: Core Extraction (Week 1)
**Goal:** Extract reusable components from Strange Water

- [ ] Identify podcast-specific vs. generic code
- [ ] Create @podcast-framework/core package
- [ ] Extract components with props/slots
- [ ] Create TypeScript interfaces
- [ ] Write unit tests for core components
- [ ] Document component APIs

**Deliverables:**
- npm package: @podcast-framework/core
- Component documentation
- Test coverage >80%

### Phase 2: Configuration System (Week 2)
**Goal:** Build flexible configuration layer

- [ ] Design configuration schema
- [ ] Create podcast.config.js loader
- [ ] Build environment variable system
- [ ] Implement feature flags
- [ ] Create validation system
- [ ] Build configuration CLI wizard

**Deliverables:**
- Configuration system
- Validation schemas
- Setup wizard

### Phase 3: CLI Tool (Week 3)
**Goal:** Create developer-friendly CLI

- [ ] Build CLI framework (Commander.js)
- [ ] Implement 'create' command
- [ ] Implement 'deploy' command
- [ ] Implement 'update' command
- [ ] Add interactive prompts
- [ ] Create progress indicators

**Deliverables:**
- npm package: @podcast-framework/cli
- CLI documentation
- Video tutorials

### Phase 4: Template Repository (Week 4)
**Goal:** Create GitHub template

- [ ] Create minimal template structure
- [ ] Add GitHub Actions workflows
- [ ] Create setup scripts
- [ ] Add example content
- [ ] Configure dependabot
- [ ] Add issue templates

**Deliverables:**
- GitHub template repository
- CI/CD pipelines
- Quick start guide

### Phase 5: Documentation Site (Week 5)
**Goal:** Comprehensive documentation

- [ ] Setup documentation site (Astro/Starlight)
- [ ] Write getting started guide
- [ ] Create customization tutorials
- [ ] Document all APIs
- [ ] Add interactive examples
- [ ] Create video walkthroughs

**Deliverables:**
- docs.podcast-framework.com
- 10+ tutorials
- API reference

### Phase 6: Testing & Validation (Week 6)
**Goal:** Ensure production readiness

- [ ] Deploy second podcast (test case)
- [ ] Performance testing
- [ ] Security audit
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Load testing

**Deliverables:**
- Test podcast deployment
- Performance report
- Security report

### Phase 7: Launch Preparation (Week 7)
**Goal:** Prepare for public release

- [ ] Create landing page
- [ ] Prepare launch blog post
- [ ] Create demo podcasts
- [ ] Setup support channels
- [ ] Prepare marketing materials
- [ ] Train support team

**Deliverables:**
- Marketing website
- Launch materials
- Support documentation

### Phase 8: Soft Launch (Week 8)
**Goal:** Beta release to limited users

- [ ] Invite beta testers
- [ ] Gather feedback
- [ ] Fix critical issues
- [ ] Iterate on documentation
- [ ] Refine onboarding
- [ ] Update based on feedback

**Deliverables:**
- Beta feedback report
- Issue resolutions
- Updated documentation

---

## 8. Testing Strategy

### 8.1 Test Pyramid

```
        /\
       /E2E\      (5%) - Full user journeys
      /------\
     /Integration\ (25%) - Component integration
    /-------------\
   /     Unit      \ (70%) - Component logic
  /-----------------\
```

### 8.2 Test Coverage Requirements

- **Core Package:** >90% coverage
- **CLI Tool:** >80% coverage
- **Template:** >70% coverage
- **Critical Paths:** 100% E2E coverage

### 8.3 Automated Testing

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
        podcast: [default, custom-theme, full-features]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:e2e
      - run: npm run test:accessibility
      - run: npm run test:performance
```

### 8.4 Test Scenarios

**New Podcast Creation**
1. Create from template
2. Configure settings
3. Import RSS feed
4. Deploy to production
5. Verify all features

**Upgrade Path**
1. Create v1 podcast
2. Upgrade to v2
3. Verify no breaking changes
4. Test rollback

**Customization**
1. Override component
2. Add custom page
3. Modify theme
4. Verify builds

---

## 9. Documentation Strategy

### 9.1 Documentation Types

**Getting Started**
- 5-minute quick start
- Video walkthrough
- Common recipes
- FAQ

**Customization**
- Theme customization
- Component overrides
- Adding features
- Plugin development

**Deployment**
- Platform guides (Cloudflare, Vercel, Netlify)
- Environment configuration
- Domain setup
- SSL certificates

**API Reference**
- Component props
- Configuration options
- CLI commands
- Hook system

**Migration**
- Version upgrade guides
- Breaking changes
- Rollback procedures
- Troubleshooting

### 9.2 Documentation Maintenance

- **Auto-generated:** API docs from TypeScript
- **Manual:** Guides and tutorials
- **Community:** User contributions
- **Versioned:** Docs for each major version

---

## 10. Long-Term Success Factors

### 10.1 Community Building

**Open Source Governance**
- Clear contribution guidelines
- Code of conduct
- Issue/PR templates
- Regular maintainer meetings
- Community showcases

**Support Channels**
- GitHub Discussions
- Discord server
- Stack Overflow tag
- Twitter presence
- Newsletter updates

### 10.2 Performance Monitoring

**Metrics Dashboard**
- Build times
- Bundle sizes
- Lighthouse scores
- Core Web Vitals
- Error rates

**Optimization Targets**
- First Contentful Paint: <1.5s
- Time to Interactive: <3.5s
- Bundle size: <200KB (JS)
- Build time: <60s
- Perfect Lighthouse score: 100/100

### 10.3 Security Strategy

**Security Measures**
- Dependency scanning (Dependabot)
- Security headers (CSP, HSTS)
- Input sanitization
- Rate limiting
- CORS configuration

**Security Updates**
- CVE monitoring
- Rapid patch releases
- Security advisories
- Responsible disclosure

### 10.4 Monetization Strategy (Optional)

**Open Core Model**
- Free: Core framework
- Paid: Premium themes
- Paid: Priority support
- Paid: Managed hosting
- Paid: Custom development

**Revenue Streams**
- GitHub Sponsors
- Premium themes ($29-99)
- Support contracts ($99-999/month)
- Custom development ($5-50k)
- Hosted solution ($19-99/month)

---

## 11. Risk Analysis & Mitigation

### 11.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|---------|------------|
| Breaking changes in dependencies | Medium | High | Pin versions, automated testing |
| Performance degradation | Low | High | Performance budgets, monitoring |
| Security vulnerabilities | Medium | Critical | Automated scanning, rapid patches |
| Browser incompatibility | Low | Medium | Progressive enhancement, polyfills |
| CMS API changes | Low | High | Abstraction layer, version pinning |

### 11.2 Adoption Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|---------|------------|
| Complex setup process | Medium | High | CLI wizard, video tutorials |
| Poor documentation | Low | High | Dedicated tech writer, user feedback |
| Lack of community | Medium | Medium | Active engagement, showcases |
| Competition from alternatives | High | Medium | Unique features, better DX |
| Upgrade friction | Medium | High | Automated migrations, clear guides |

### 11.3 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|---------|------------|
| Maintenance burden | Medium | High | Community contributors, automation |
| Support overwhelm | Medium | Medium | Self-service docs, community forum |
| Scope creep | High | Medium | Clear roadmap, feature flags |
| Burnout | Medium | High | Sustainable pace, delegation |
| Funding | Low | Medium | Multiple revenue streams |

---

## 12. Decision Points

### 12.1 Immediate Decisions Needed

1. **Repository Strategy**
   - [ ] Monorepo vs. Polyrepo
   - [ ] Package manager (npm/yarn/pnpm)
   - [ ] GitHub org name

2. **Technology Choices**
   - [ ] CLI framework (Commander/Yargs/Oclif)
   - [ ] Testing framework (Vitest/Jest)
   - [ ] Documentation platform (Starlight/Docusaurus)

3. **Release Strategy**
   - [ ] Version numbering scheme
   - [ ] Release cadence
   - [ ] Beta testing approach

### 12.2 Future Decisions (Post-MVP)

1. **Monetization**
   - Premium features
   - Support tiers
   - Hosting service

2. **Governance**
   - Open source license
   - Contribution model
   - Maintainer structure

3. **Expansion**
   - Mobile apps
   - Podcast network features
   - Analytics dashboard

---

## 13. Success Metrics

### 13.1 Launch Metrics (First 3 Months)

**Adoption**
- [ ] 10+ podcasts deployed
- [ ] 100+ GitHub stars
- [ ] 50+ Discord members
- [ ] 5+ community contributions

**Quality**
- [ ] <5 critical bugs
- [ ] >95% uptime
- [ ] <24h support response
- [ ] >90% user satisfaction

### 13.2 Growth Metrics (First Year)

**Adoption**
- [ ] 100+ podcasts deployed
- [ ] 1000+ GitHub stars
- [ ] 500+ Discord members
- [ ] 50+ contributors

**Ecosystem**
- [ ] 5+ community plugins
- [ ] 3+ premium themes
- [ ] 10+ integration partners
- [ ] 20+ showcase sites

### 13.3 Maturity Metrics (Long-term)

**Scale**
- [ ] 1000+ podcasts deployed
- [ ] 10k+ GitHub stars
- [ ] 5000+ Discord members
- [ ] 200+ contributors

**Sustainability**
- [ ] Self-sustaining financially
- [ ] Active maintainer team
- [ ] Regular release cycle
- [ ] Strong ecosystem

---

## 14. Timeline & Milestones

### Q1 2025: Foundation
- **Week 1-2:** Core extraction
- **Week 3-4:** Configuration system
- **Week 5-6:** CLI tool
- **Week 7-8:** Template repository
- **Milestone:** Internal alpha release

### Q2 2025: Polish
- **Month 1:** Documentation site
- **Month 2:** Testing & validation
- **Month 3:** Beta testing
- **Milestone:** Public beta release

### Q3 2025: Launch
- **Month 1:** Launch preparation
- **Month 2:** Public release
- **Month 3:** Growth & iteration
- **Milestone:** v1.0.0 stable release

### Q4 2025: Growth
- **Month 1:** Premium features
- **Month 2:** Partner integrations
- **Month 3:** v2.0 planning
- **Milestone:** Sustainable project

---

## 15. Implementation Checklist

### Pre-Launch Checklist
- [ ] Core package published to npm
- [ ] CLI tool published to npm
- [ ] Template repository created
- [ ] Documentation site live
- [ ] 3+ example podcasts deployed
- [ ] All tests passing
- [ ] Security audit complete
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Marketing site ready
- [ ] Support channels active
- [ ] Launch blog post written
- [ ] Video tutorials recorded
- [ ] Community guidelines posted
- [ ] Legal review complete

### Post-Launch Checklist
- [ ] Monitor error rates
- [ ] Respond to feedback
- [ ] Fix critical bugs
- [ ] Update documentation
- [ ] Engage community
- [ ] Plan next features
- [ ] Celebrate success! 🎉

---

## 16. Appendices

### A. Technology Stack
- **Framework:** Astro 5.x
- **Language:** TypeScript 5.x
- **CMS:** Sanity 3.x
- **Styling:** Tailwind CSS 3.x
- **Testing:** Vitest
- **CI/CD:** GitHub Actions
- **Hosting:** Cloudflare Pages
- **Package Manager:** npm/pnpm
- **Documentation:** Starlight

### B. File Structure Templates

**Component Template**
```typescript
// src/components/EpisodeCard.astro
---
import type { Episode } from '@podcast-framework/core';

export interface Props {
  episode: Episode;
  variant?: 'compact' | 'full';
  showTranscript?: boolean;
}

const { episode, variant = 'compact', showTranscript = false } = Astro.props;
---

<article class="episode-card" data-variant={variant}>
  <!-- Component implementation -->
</article>
```

**Plugin Template**
```javascript
// plugins/my-plugin/index.js
export default {
  name: 'my-plugin',
  version: '1.0.0',

  async install(framework, options) {
    // Register components
    framework.registerComponent('MyComponent', './MyComponent.astro');

    // Add routes
    framework.addRoute('/my-route', './pages/my-page.astro');

    // Hook into build
    framework.hooks.on('build:before', async () => {
      // Custom build logic
    });
  }
}
```

### C. Configuration Examples

**Minimal Configuration**
```javascript
// podcast.config.js
export default {
  name: "My Podcast",
  sanity: {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: 'production'
  }
}
```

**Full Configuration**
```javascript
// See Section 4.2 for complete example
```

### D. Migration Script Example

```javascript
// scripts/migrate-to-template.js
#!/usr/bin/env node

import { extractConfig } from './lib/config-extractor.js';
import { updateImports } from './lib/import-updater.js';
import { generateConfig } from './lib/config-generator.js';

async function migrate() {
  console.log('🚀 Starting migration to template...');

  // 1. Extract current configuration
  const config = await extractConfig();

  // 2. Generate podcast.config.js
  await generateConfig(config);

  // 3. Update imports to use @podcast-framework/core
  await updateImports();

  // 4. Move custom components
  await moveCustomComponents();

  // 5. Update package.json
  await updatePackageJson();

  // 6. Run tests
  await runTests();

  console.log('✅ Migration complete!');
}

migrate().catch(console.error);
```

---

## 17. Next Steps

### Immediate Actions (This Week)
1. **Review & Approve Plan:** Get stakeholder buy-in
2. **Create GitHub Organization:** Set up podcast-framework org
3. **Initialize Repositories:** Create the 3 main repos
4. **Begin Core Extraction:** Start Phase 1 implementation
5. **Recruit Contributors:** Find 2-3 developers to help

### Communication Plan
1. **Internal:** Weekly progress updates
2. **Public:** Bi-weekly blog posts
3. **Community:** Daily Discord engagement
4. **Documentation:** Continuous updates

### Resource Requirements
- **Development:** 2-3 developers (8 weeks)
- **Documentation:** 1 technical writer (4 weeks)
- **Design:** 1 designer (2 weeks)
- **Testing:** 1 QA engineer (2 weeks)
- **Total Budget:** ~$50-100k (or volunteer/equity)

---

## 18. Conclusion

This templatization plan provides a comprehensive roadmap for transforming the Strange Water podcast framework into a reusable, maintainable, and scalable template system. The hybrid approach (template + packages) offers the best balance of ease-of-use and flexibility.

Key success factors:
1. **Clear separation** between framework and instance code
2. **Strong configuration** system with sensible defaults
3. **Excellent documentation** and onboarding experience
4. **Automated tooling** for common tasks
5. **Active community** engagement and support

With proper execution, this framework can become the go-to solution for podcast websites, supporting hundreds of podcasts while maintaining upgradeability and customization options.

---

**Document Status:** Ready for Review
**Next Review:** After stakeholder feedback
**Owner:** Rex Kirshner
**Contributors:** Claude (AI Assistant)

---

## References & Resources

1. [Astro Documentation](https://docs.astro.build)
2. [Sanity Documentation](https://www.sanity.io/docs)
3. [GitHub Template Repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository)
4. [Semantic Versioning](https://semver.org/)
5. [The Twelve-Factor App](https://12factor.net/)
6. [Open Source Guides](https://opensource.guide/)
7. [npm Package Best Practices](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
8. [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)

---

*End of Document*