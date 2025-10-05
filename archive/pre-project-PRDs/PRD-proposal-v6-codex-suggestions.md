# PRD-proposal-v6 Codex Suggestions

## Self-Contained Execution Plan
- `PRD-proposal-v6.md:938-940` points implementers back to `PRD-proposal-v5.md` for the 120+ granular tasks. To avoid version drift and ensure the “approved for development” document stands on its own, embed the authoritative task list (or link to a maintained single source such as `/docs/IMPLEMENTATION_PLAN.md`) inside v6.

## Editorial Scheduling Mechanics
- The editorial workflow introduces a `Scheduled` state (`PRD-proposal-v6.md:126-143`) but the build/deploy stack only reacts to immediate publishes. Define how scheduled releases trigger builds (Sanity Scheduled Publishing → Netlify build hook, cron-triggered rebuild, etc.) so coordinators can rely on that stage without manual intervention.

## Multi-Podcast Content Isolation
- The evolution diagram keeps a “single Sanity project” through Phase 2 (`PRD-proposal-v6.md:193-209`). Before onboarding a second show, spell out whether each podcast gets its own dataset/project (preferred for permissions and analytics) or if a multi-tenant schema will live in one dataset. Document secrets management and webhook routing for whichever approach you choose to prevent cross-site leakage.

## Configuration vs. CMS Source of Truth
- `config/theme.json` stores podcast name, tagline, branding (`PRD-proposal-v6.md:286-326`) while `sanity/schemas/podcast.ts` will hold similar fields (`PRD-proposal-v6.md:231-268`). Decide which system is authoritative for brand metadata and eliminate the duplicate entry path (e.g., move podcast meta into Sanity with a publish-to-config build step) to avoid drift when non-technical editors update content.
