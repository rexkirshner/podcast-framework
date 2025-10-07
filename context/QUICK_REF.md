# Quick Reference Dashboard

> **Auto-generated summary** for fast orientation. For full details, see other context files.
> **Last Updated:** 2025-10-06 (v2.0.0 migration)

---

## Project

**Name:** Podcast Website Framework
**Type:** Web Application
**Owner:** Rex Kirshner
**Phase:** Phase 1b - Polish & QA (Day 6)
**Status:** ✅ **PHASE 1 COMPLETE!**

---

## Tech Stack

- **Frontend:** Astro (SSG, zero-JS by default)
- **Styling:** Tailwind CSS
- **CMS:** Sanity.io (local Studio at http://localhost:3333/)
- **Hosting:** Netlify (staging.strangewater.xyz)
- **Analytics:** Google Analytics 4 (G-V74NXPXZWQ)
- **Language:** TypeScript

---

## URLs

- **Production:** TBD (not yet launched)
- **Staging:** https://staging.strangewater.xyz
- **Local Dev:** http://localhost:4322/
- **Sanity Studio:** http://localhost:3333/ (local only)
- **GitHub:** TBD (push pending)

---

## Current Focus

**Phase:** Phase 1b Complete - Ready for production
**Next Priority:** Phase 2 planning (framework generalization & automation)

**Recent Work (Session 10):**
- ✅ Google Analytics 4 integration (all 72 pages)
- ✅ BaseLayout refactor (centralized SEO, meta tags)
- ✅ About page improvements (RSS feed button, dynamic subscribe section)
- ✅ Phase 1 development complete

---

## Quick Commands

### Development
```bash
npm run dev                  # Start Astro dev server (localhost:4322)
npm run sanity               # Start Sanity Studio (localhost:3333)
npm run build                # Build for production
```

### Data Import
```bash
npm run import:rss           # Import/update episodes from RSS
npm run import:guests        # Scrape and import guests
npm run link:guests          # Auto-link guests to episodes
npm run upload:photos        # Upload guest photos
npm run upload:covers        # Upload episode cover images
```

### Context System
```bash
/save-context                # Update all context documentation
/quick-save-context          # Fast checkpoint (STATUS.md + SESSIONS.md)
/review-context              # Validate documentation accuracy
/code-review                 # Comprehensive code audit
```

---

## Current State

**Content:**
- 69 episodes (all metadata, clean slugs)
- 72 guests (65 with profile photos)
- 1 host (Rex Kirshner)
- 66/68 episode covers uploaded

**Build:**
- 72 pages in 9.80s
- Zero errors
- GA4 on all pages
- SEO meta tags centralized

**Production Ready:**
- ✅ All Phase 1 development complete
- ✅ Responsive design verified
- ✅ Framework features reusable

---

## Next Steps

1. **Optional QA** (before launch)
   - Test sample episode pages
   - Run Lighthouse audit (target: >90 performance)
   - Verify responsive design

2. **Phase 2 Planning** (Days 16-20)
   - Framework generalization
   - Brand customization via CMS
   - Episode artwork automation
   - Newsletter integration (ConvertKit)
   - Transcript generation (Whisper API)

---

## Key Files

- `CONTEXT.md` - Project orientation and setup (rarely changes)
- `STATUS.md` - Current state (frequently updated)
- `DECISIONS.md` - Technical decision log (WHY documentation)
- `SESSIONS.md` - Session history (comprehensive, 10 sessions)
- `PRD.md` - Strategic blueprint
- `IMPLEMENTATION_PLAN.md` - Day-by-day execution guide

---

## Blockers

**None.** All Phase 1 work complete. Ready for production deployment.

---

**For detailed status:** See `STATUS.md`
**For project setup:** See `CONTEXT.md`
**For decision rationale:** See `DECISIONS.md`
**For session history:** See `SESSIONS.md`
