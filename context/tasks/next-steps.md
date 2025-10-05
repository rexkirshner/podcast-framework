# Next Steps

Current action items and priorities. Reference `IMPLEMENTATION_PLAN.md` for full 120+ task breakdown.

---

## Immediate Next Steps (Day 1 - Morning)

**Status:** Ready to Start
**Phase:** Phase 1a - "Hello World" Deployed Site
**Time Estimate:** 2-3 hours

### Tasks:
- [ ] **Task 1.1:** Create GitHub repository `podcast-framework`
- [ ] **Task 1.2:** Run `npm create astro@latest` (select minimal template, TypeScript)
- [ ] **Task 1.3:** Install Tailwind CSS (`npx astro add tailwind`)
- [ ] **Task 1.4:** Create `.env.example` file (empty for now)
- [ ] **Task 1.5:** Update `README.md` with project name, purpose
- [ ] **Task 1.6:** Initial commit + push to GitHub

**End of Morning Checkpoint:**
- ✅ Astro project initialized with TypeScript
- ✅ Tailwind CSS installed
- ✅ Code pushed to GitHub

---

## Day 1 - Afternoon

**Time Estimate:** 2-3 hours

### Tasks:
- [ ] **Task 1.7:** Create Netlify account, connect to GitHub repo
- [ ] **Task 1.8:** Configure Netlify build settings (Astro defaults)
- [ ] **Task 1.9:** Deploy to Netlify (default domain `random-name.netlify.app`)
- [ ] **Task 1.10:** Verify site loads ("Astro" default page)
- [ ] **Task 1.11:** Configure custom subdomain `staging.strangewater.xyz` (DNS setup)

**End of Day 1 Checkpoint:**
- ✅ Deployed site accessible at staging URL
- ✅ GitHub → Netlify auto-deploy working
- ✅ Can make change, push, see update (test deployment pipeline)

---

## Day 2 Preview

**Goal:** First Episode Page (Hardcoded)
**Phase:** Phase 1a continues

**Morning:**
- Create hardcoded episode page with basic layout
- Embed Spotify audio player
- Add basic header/footer

**Afternoon:**
- Test audio playback
- Deploy to staging
- Verify page looks acceptable

---

## Current Focus

**Milestone:** Phase 1a - "Hello World" (Days 1-3)
**Goal:** Working Astro site deployed to staging with 1 hardcoded episode visible

**Success Criteria:**
- ✅ Site accessible at `staging.strangewater.xyz`
- ✅ Homepage shows 1 episode
- ✅ Can click episode, see episode page
- ✅ Build/deploy pipeline working

---

## Blockers

None currently. All prerequisites completed (PRD, Implementation Plan, Context System).

---

## Notes

- Reference `IMPLEMENTATION_PLAN.md` for complete Day 1-60 task breakdown
- Each task designed for 30min-2 hours (half-day blocks)
- Deploy to staging 3-5 times per day (continuous deployment)
- Run `/quick-save-context` after every 2-3 completed tasks
- Run `/save-context` at end of each sub-phase (1a, 1b, 1c, etc.)

---

**Last Updated:** 2025-10-05
