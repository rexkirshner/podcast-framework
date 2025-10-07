# Quick Reference Dashboard

> **Auto-generated summary** for fast orientation. For full details, see other context files.
> **Last Updated:** 2025-10-07 Session 13 (Theme Refinement)

---

## Project

**Name:** Podcast Website Framework
**Type:** Web Application
**Owner:** Rex Kirshner
**Phase:** Phase 2a - CMS Theming & Optional Features
**Status:** ✅ Theming Complete | 🤔 Evaluating Community Feature

---

## Tech Stack

- **Frontend:** Astro (SSG, zero-JS by default)
- **Styling:** Tailwind CSS + CSS Custom Properties (CMS-driven theming)
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

**Phase:** Phase 2a - CMS Theming Complete, Evaluating Community Feature
**Next Priority:** Review community contribution proposal and decide on implementation

**Recent Work (Session 13):**
- ✅ Theme color refinement (light aesthetic: white bg, black header/footer, teal accents)
- ✅ Fixed header/footer text visibility (added headerText/footerText fields)
- ✅ Improved footer layout (proportional grid, better spacing)
- ✅ Integrated theme into BaseLayout (all pages themed)
- ✅ Created comprehensive community contribution feature proposal (13 pages)

**Final Theme Colors:**
- Primary: #00a3b5 (bright teal)
- Secondary: #67cccc (light teal for accents)
- Background: #ffffff (white)
- Header/Footer: #000000 (black)

---

## Quick Commands

### Development
```bash
npm run dev                  # Start Astro dev server (localhost:4322)
npm run sanity               # Start Sanity Studio (localhost:3333)
npm run build                # Build for production
npm run init:theme           # Initialize default theme in Sanity
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
- 146 pages in ~30s (with theme system)
- Zero errors
- GA4 on all pages
- CMS-driven theming (colors, typography, layout)

**Theme System:**
- ✅ Complete CMS-driven color/typography customization
- ✅ Theme applied to all pages via BaseLayout
- ✅ Header/footer fully customizable
- ✅ Google Fonts dynamic loading

**Pending Decision:**
- Community contribution feature (see context/tasks/requests-proposal.md)
- Options: Implement now (8-12h) | Add to template | Skip for Strange Water

---

## Next Steps

1. **Review Community Feature Proposal** (now)
   - Read context/tasks/requests-proposal.md
   - Answer 5 key questions (naming, email service, anonymity, notifications, fields)
   - Decide: implement now vs. template vs. skip

2. **If Implementing** (8-12 hours)
   - Sanity schema for contributions
   - /contribute page with dynamic forms
   - Serverless function + email notifications
   - Spam protection + privacy compliance

3. **Or, Move to Templatization** (Phase 2b)
   - Extract environment variables
   - Create verification script
   - Document deployment guide
   - Tag v2.0.0

---

## Key Files

- `CONTEXT.md` - Project orientation and setup (rarely changes)
- `STATUS.md` - Current state (frequently updated)
- `DECISIONS.md` - Technical decision log (WHY documentation)
- `SESSIONS.md` - Session history (13 sessions)
- `PRD.md` - Strategic blueprint
- `IMPLEMENTATION_PLAN.md` - Day-by-day execution guide
- `context/tasks/requests-proposal.md` - Community feature proposal (NEW)

---

## Blockers

**None.** Theme system complete. Awaiting decision on community contribution feature.

---

**For detailed status:** See `STATUS.md`
**For project setup:** See `CONTEXT.md`
**For decision rationale:** See `DECISIONS.md`
**For session history:** See `SESSIONS.md`
