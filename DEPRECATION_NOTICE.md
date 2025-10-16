# REPOSITORY DEPRECATED

**Status:** Archived
**Date:** October 16, 2025
**Reason:** Project evolved into reusable framework

---

## What Happened

This repository originally contained the Strange Water podcast website. During development (Summer-Fall 2025), we realized the architecture was valuable as a **reusable framework** for all podcasts, not just Strange Water.

The project was systematically extracted into three new repositories:

1. **Podcast Framework** (reusable npm packages)
2. **Strange Water** (production site rebuilt using framework)
3. **Podcast Framework Docs** (comprehensive documentation)

---

## Where Everything Moved

### Framework Code
**Repository:** https://github.com/rejected-media/podcast-framework

**What's There:**
- `@rejected-media/podcast-framework-core` - Components, layouts, utilities
- `@rejected-media/podcast-framework-sanity-schema` - CMS schemas
- `@rejected-media/podcast-framework-cli` - CLI tool for creating podcast sites

**Published on npm:**
```bash
npm install @rejected-media/podcast-framework-core
npm install @rejected-media/podcast-framework-sanity-schema
npm install @rejected-media/podcast-framework-cli
```

### Strange Water Production Site
**Repository:** https://github.com/rejected-media/strange-water
**Live Site:** https://strangewater.xyz

The Strange Water website now uses the framework packages. This validates the framework works for real production sites with 69+ episodes.

### Documentation
**Repository:** https://github.com/rejected-media/podcast-framework-docs
**Docs Site:** https://podcast-framework-docs.pages.dev

Complete documentation for using the Podcast Framework:
- Getting started guides
- Component API reference
- Deployment guides
- Customization examples
- Migration guides

### Template Repository
**Repository:** https://github.com/rejected-media/podcast-template

Pre-configured template for creating new podcast sites:
```bash
npx @rejected-media/podcast-framework-cli create my-podcast
```

---

## Development History Preserved

### Where The Planning Docs Went

All valuable documentation from this repository has been migrated:

**podcast-framework/context/archive/strange-water-development/**
- `SESSIONS.md` - Complete 20+ session development history (195KB)
- `STATUS.md` - Final project status
- `DECISIONS.md` - Architecture decisions and rationale
- `PRD.md` - Original product requirements
- `claude-context-feedback.md` - Claude Context System feedback
- `tasks/` - All planning documents

**podcast-framework-docs/src/content/docs/**
- `guides/transcript-generation.md` - Whisper API transcription guide
- `deployment/cloudflare-troubleshooting.md` - Cloudflare deployment issues
- `deployment/hosting-migration.md` - Platform migration checklist

---

## Git History Retained

**This repository is archived, not deleted.** Why?

1. **Complete Git History:** All commits from initial development preserved
2. **Historical Reference:** Shows evolution from single site to framework
3. **Learning Resource:** Demonstrates framework extraction process
4. **Context For Contributors:** Helps understand framework design decisions

If you want to understand WHY a framework decision was made, this repo tells that story.

---

## The Migration Story

### Phase 1: Build Strange Water (Sessions 1-10)
- Built production podcast website with Astro + Sanity
- 69 episodes, transcripts, search, newsletter signup
- Deployed to Cloudflare Pages

### Phase 2: Recognize Reusability (Sessions 10-15)
- Realized architecture could power any podcast
- Planned systematic extraction to npm packages
- Designed component override system
- Created hybrid schema extension pattern

### Phase 3: Extract Framework (Sessions 15-20)
- Created monorepo structure
- Extracted components to `core` package
- Extracted schemas to `sanity-schema` package
- Built CLI tool for project scaffolding
- Published to npm as `@rejected-media/podcast-framework-*`

### Phase 4: Validate With Strange Water (Sessions 20-25)
- Rebuilt Strange Water from scratch using framework
- Validated 69-episode migration
- Discovered and fixed UX issues
- Refined documentation based on real usage

### Phase 5: Polish & Launch (Sessions 25+)
- Created comprehensive documentation site
- Added sample content and examples
- Published template repository
- Framework ready for public use

---

## Key Lessons Learned

### What Worked

1. **Incremental Extraction:** Didn't build framework upfront - extracted from working production code
2. **Real-World Validation:** Using Strange Water to test framework caught actual issues
3. **Comprehensive Documentation:** Extensive planning prevented major rework
4. **Monorepo Structure:** Made managing interdependent packages manageable
5. **TypeScript Everywhere:** Strict typing caught bugs early

### Architectural Wins

1. **Component Resolver:** `import.meta.glob` pattern for auto-detecting overrides
2. **Theme System:** CSS variables for customization without component changes
3. **Hybrid Schemas:** Extending base Sanity schemas with custom fields
4. **Hosting Abstraction:** Platform-agnostic API for Cloudflare, Netlify, Vercel

### Technology Choices

- **Astro:** Perfect for content-heavy sites, zero JS by default
- **Sanity:** Flexible CMS with great developer experience
- **TypeScript:** Type safety throughout prevents runtime errors
- **Cloudflare Pages:** Fast edge deployment, generous free tier
- **Vitest:** Fast unit tests for utilities and business logic

---

## For Future Reference

### If You Want To...

**Use the framework:**
→ https://github.com/rejected-media/podcast-framework

**See example podcast site:**
→ https://strangewater.xyz (production)
→ https://github.com/rejected-media/strange-water (code)

**Read the documentation:**
→ https://podcast-framework-docs.pages.dev

**Start your own podcast site:**
```bash
npx @rejected-media/podcast-framework-cli create my-podcast
```

**Understand framework design decisions:**
→ Look at this repo's git history
→ Read `podcast-framework/context/archive/strange-water-development/`

### If You're A Contributor

The archived development history in the framework repo explains:
- Why certain patterns were chosen
- What alternatives were considered
- What issues were encountered in production
- How decisions evolved over time

Reading `DECISIONS.md` and `SESSIONS.md` in the archive gives valuable context for understanding the framework architecture.

---

## Repository Structure (Frozen)

This repository contains the final state before framework extraction:

```
/
├── src/                    # Astro application code
│   ├── pages/              # Page routes
│   ├── components/         # UI components (now in framework)
│   ├── layouts/            # Page layouts (now in framework)
│   └── lib/                # Utilities (now in framework)
├── sanity/                 # Sanity schemas (now in framework)
├── context/                # Development documentation (archived in framework)
├── docs/                   # Technical guides (moved to framework docs)
├── scripts/                # Sanity utilities
└── public/                 # Static assets
```

**This code is frozen.** Active development is in:
- `rejected-media/podcast-framework` (framework packages)
- `rejected-media/strange-water` (Strange Water production site)

---

## Timeline

- **July 2025:** Initial Strange Water development begins
- **August 2025:** Production site launched (69 episodes)
- **September 2025:** Framework extraction begins
- **October 2025:** Framework published to npm
- **October 16, 2025:** Strange Water migrated to framework, this repo archived

---

## Thank You

This project represents 25+ sessions of development, planning, refactoring, and learning. The journey from single-purpose website to reusable framework taught us invaluable lessons about:

- Framework design and API ergonomics
- Developer experience and documentation
- Real-world production constraints
- Systematic code extraction and migration

The Podcast Framework exists because Strange Water needed to exist first.

---

## Questions?

**Framework Issues:** https://github.com/rejected-media/podcast-framework/issues
**Documentation Issues:** https://github.com/rejected-media/podcast-framework-docs/issues
**Strange Water Issues:** https://github.com/rejected-media/strange-water/issues

**General Questions:** Open a discussion in the framework repository

---

**Repository Status:** ARCHIVED (Read-Only)
**Last Active:** October 16, 2025
**Successor:** https://github.com/rejected-media/podcast-framework
**Production Site:** https://strangewater.xyz (now using framework)
