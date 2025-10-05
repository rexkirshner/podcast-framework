# Podcast Website Framework

**Reusable podcast website framework built with Astro, Sanity CMS, and Netlify.**

Deploy production-ready podcast sites in <4 hours with performance, SEO, and accessibility built-in.

---

## Project Goals

**Immediate:** Launch Strange Water podcast site (strangewater.xyz) with 69 episodes
**Strategic:** Build reusable template for deploying future podcasts rapidly

---

## Tech Stack

- **Frontend:** Astro (SSG, zero-JS by default, TypeScript)
- **CMS:** Sanity.io (real-time collaboration, customizable Studio)
- **Hosting:** Netlify (free tier, instant rollbacks, build hooks)
- **Styling:** Tailwind CSS v4
- **Analytics:** Google Analytics 4 (Phase 2)
- **Error Monitoring:** Sentry (Phase 2)

---

## Project Structure

```
/
├── .claude/                   # Context system for AI assistance
├── context/                   # Project documentation
│   ├── PRD.md                # Strategic blueprint
│   ├── IMPLEMENTATION_PLAN.md # Day-by-day tasks (120+)
│   ├── CLAUDE.md             # Developer guide
│   └── SESSIONS.md           # Work history
├── src/
│   ├── pages/                # Astro routes
│   ├── components/           # Reusable UI components
│   └── styles/               # Global styles (Tailwind)
├── public/                   # Static assets (logos, favicons)
├── sanity/                   # CMS schemas (to be created)
└── config/                   # Theme configuration (to be created)
```

---

## Commands

**Development:**
```bash
npm run dev          # Start Astro dev server (localhost:4321)
npm run build        # Build production site
npm run preview      # Preview production build locally
```

**Sanity CMS (Phase 1b):**
```bash
sanity dev           # Run Sanity Studio locally (localhost:3333)
sanity deploy        # Deploy hosted Sanity Studio
```

**Deployment:**
```bash
git push             # Auto-deploys to Netlify (develop → staging, main → production)
```

---

## Getting Started

See `context/IMPLEMENTATION_PLAN.md` for detailed setup and development workflow.

**Quick Start:**
1. Clone this repository
2. Run `npm install`
3. Copy `.env.example` to `.env` and configure Sanity credentials
4. Run `npm run dev` to start local development

---

## Documentation

- **`context/PRD.md`** - Complete project vision and architecture
- **`context/IMPLEMENTATION_PLAN.md`** - 120+ tasks broken down by day (Days 1-60)
- **`context/CLAUDE.md`** - Developer guide (tech stack, methodology, preferences)
- **`context/SESSIONS.md`** - Work history and decisions

---

## Development Methodology

**Iterative, small-step approach:**
- ✅ Vertical slices (working features end-to-end)
- ✅ Deploy continuously from Day 1 (3-5 deploys/day to staging)
- ✅ Half-day tasks (2-4 hours each)
- ✅ Refactor as we learn, don't over-engineer upfront

---

## Success Metrics

**Phase 1 Launch (Day 15):**
- Lighthouse: Performance >90, SEO >95, Accessibility >90
- All 69 episodes migrated successfully
- Zero broken links/images
- Monetization CTAs operational (Patreon, subscribe buttons)

**Framework Reusability (Phase 3):**
- Time to deploy new podcast: <4 hours (manual configuration)
- Branding customization: <2 hours
- Component reuse rate: >80%

---

## License

Private repository - Rex Kirshner

---

**Current Phase:** Phase 1a - "Hello World" Deployed Site
**Status:** Day 1 Complete, Day 2 Ready to Start
**Last Updated:** 2025-10-05
