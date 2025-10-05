# Podcast Website Framework - Developer Guide

**Project Type:** Web Application (Astro + Sanity CMS + Netlify)
**Status:** Pre-Implementation (PRD Complete, Ready for Day 1)
**Owner:** Rex Kirshner
**Last Updated:** 2025-10-05

---

## Project Overview

Building a **reusable podcast website framework** to replace Strange Water (strangewater.xyz) and enable rapid deployment of future podcast sites.

**Dual Goals:**
1. **Immediate:** Launch performant, SEO-optimized Strange Water site (69 episodes, archival)
2. **Strategic:** Build reusable template for deploying new podcasts in <4 hours

**Current State:** Planning complete, implementation starts Day 1

---

## Tech Stack

**Frontend:** Astro (SSG, zero-JS by default, SEO-optimized)
**CMS:** Sanity.io (real-time collaboration, customizable Studio, GROQ queries)
**Hosting:** Netlify (free tier, 300 build min/month, instant rollbacks)
**Styling:** Tailwind CSS
**Language:** TypeScript
**Analytics:** Google Analytics 4
**Error Monitoring:** Sentry (free tier)

**Key Integrations:**
- Patreon (monetization widget)
- ConvertKit (newsletter, Phase 2)
- OpenAI Whisper API (transcripts, Phase 2)
- Subscribe CTAs (Spotify, Apple, YouTube, RSS)

---

## Architecture Overview

**Build Flow:**
1. Content published in Sanity Studio
2. Sanity webhook → Netlify build hook
3. Astro generates static HTML (build time: ~3-5 min)
4. Deploy to Netlify CDN

**Configuration-Driven Design:**
- `config/theme.json` - Colors, fonts, branding, monetization URLs
- `sanity/` - Content models (episodes, guests, pages)
- `src/` - Framework components (reusable across podcasts)
- `public/` - Instance-specific assets (logos, favicons)

**Multi-Podcast Strategy:**
- Each podcast = separate Sanity project (clean permissions, no cross-contamination)
- Each podcast = separate repository (cloned from template)
- Template evolves: Strange Water (Phase 1) → Generic framework (Phase 2-3)

---

## Development Methodology

**Iterative, Small-Step Approach:**
- ✅ Vertical slices (working episode page Day 2, not scaffolded pages Week 2)
- ✅ Deploy continuously from Day 1 (3-5 deploys/day to staging)
- ✅ Half-day tasks (2-4 hours each, not week-long tasks)
- ✅ Each increment: demonstrable, testable, deployable, valuable
- ✅ Refactor as we learn, don't over-engineer upfront

**Anti-Patterns to Avoid:**
- ❌ Building all components before wiring them together
- ❌ Waiting weeks before first deploy
- ❌ Large PRs changing 50 files
- ❌ "It'll all come together in Week 4"

**Daily Rhythm:**
- Morning: Pick 1-3 tasks from current sub-phase
- Afternoon: Ship to staging, verify, demo
- End of day: Working site exists (even if incomplete)

---

## Key Commands

**Setup (Day 1):**
```bash
npm create astro@latest           # Initialize Astro project
npx astro add tailwind            # Add Tailwind CSS
npm create sanity@latest          # Initialize Sanity CMS
sanity dev                        # Run Sanity Studio locally
```

**Development:**
```bash
npm run dev                       # Start Astro dev server (localhost:4321)
sanity dev                        # Start Sanity Studio (localhost:3333)
npm run build                     # Build for production
```

**Deployment:**
```bash
git push                          # Auto-deploys to Netlify (develop → staging, main → production)
sanity deploy                     # Deploy hosted Sanity Studio
```

**Context System:**
```bash
/save-context                     # Capture major work changes
/quick-save-context              # Fast checkpoints during coding
/review-context                  # Verify documentation continuity
/code-review                     # Comprehensive code audit
```

---

## Core Development Methodology

**Simplicity First:**
- Prefer simple solutions over clever ones
- No temporary fixes - root cause only
- Minimal impact changes (smallest possible scope)
- Full code tracing (understand before changing)

**Quality Standards:**
- Test before commit (coverage target: >80% for critical paths)
- No secrets in code (use environment variables)
- Accessibility (WCAG 2.1 AA compliance)
- Performance (Lighthouse >90 all metrics)

**Workflow Rules:**
- Require plan approval before major changes
- Require push approval (no auto-push to remote)
- Use TodoList for task tracking
- Document decisions as we make them

---

## Current Status

**Phase:** Pre-Implementation
**Next Milestone:** Day 1 - Project Setup & First Deploy

**Completed:**
- ✅ PRD finalized (PRD.md - 1,239 lines)
- ✅ Implementation plan detailed (IMPLEMENTATION_PLAN.md - 679 lines, 120+ tasks)
- ✅ Claude Context System installed
- ✅ Ready to begin Day 1 tasks

**Next Steps (Day 1 Morning):**
1. Create GitHub repository `podcast-framework`
2. Run `npm create astro@latest` (minimal template, TypeScript)
3. Install Tailwind CSS
4. Initial commit + push to GitHub

**Next Steps (Day 1 Afternoon):**
5. Create Netlify account, connect to GitHub
6. Deploy to Netlify
7. Configure staging subdomain `staging.strangewater.xyz`

---

## Communication Preferences

**Style:** Concise, high-level summaries (skip preamble unless complex)
**Code References:** Always include line numbers (`file.ts:42`)
**Emojis:** No (unless explicitly requested)
**Explanations:** Only for complex logic (simple code speaks for itself)

**When Running Commands:**
- Explain non-trivial bash commands before running
- Verify directory structure before creating files/folders
- Use proper quoting for paths with spaces

**Git Workflow:**
- Never push without approval
- Always include Co-Authored-By for commits
- Create descriptive commit messages (why, not just what)
- Check authorship before amending commits

---

## Reference Documents

**Primary:**
- `context/PRD.md` - Complete strategic blueprint (all decisions, architecture, personas, metrics)
- `context/IMPLEMENTATION_PLAN.md` - Day-by-day execution guide (120+ tasks, Days 1-60)

**Context System:**
- `context/CLAUDE.md` - This file (developer guide)
- `context/SESSIONS.md` - Session history (what happened when)
- `context/tasks/next-steps.md` - Action items
- `context/tasks/todo.md` - Current session tasks

**Archive:**
- `archive/pre-project-PRDs/` - All PRD draft versions (v1-v6, codex reviews)

---

## Success Metrics

**Phase 1 Launch (Day 15):**
- Lighthouse: Performance >90, SEO >95, Accessibility >90
- All 69 episodes migrated successfully
- Zero broken links/images
- Monetization CTAs operational (Patreon, subscribe)

**Framework Reusability (Phase 3):**
- Time to deploy new podcast: <4 hours (manual)
- Branding customization: <2 hours
- Component reuse rate: >80%

**Iteration Velocity:**
- Tasks completed per day: 8-12 (average ~10)
- Staging deploys per day: 3-5
- Days to first deploy: Day 1 (not Week 4!)

---

**Last Context Save:** 2025-10-05 (Context System Initialized)
