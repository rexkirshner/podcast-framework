# PRD-proposal-v4 Codex Suggestions

## Document Completeness
- The current draft references prior versions for Sections 3-10 instead of embedding the content (`PRD-proposal-v4.md:108`), which breaks the PRD’s self-contained record of personas, architecture, theming, migration, and SEO strategy. Reinsert the actual material (or link to an authoritative shared source) so stakeholders do not need to cross-reference older drafts to understand requirements.

## Monetization Alignment in Phase 1
- Phase 1 tasks cover episodes, guests, migration, and technical hardening (`PRD-proposal-v4.md:133-483`) but never implement the monetization and growth levers called out in the Executive Summary (Patreon, subscribe funnels, sponsor CTAs). Add explicit work items—CTA modules, link tracking, placement tests, measurement—to Phase 1 so the MVP meets the “flexible monetization” goal rather than deferring all of it to later phases.

## Reusability & Theming Timing
- Configuration abstraction is postponed to Phase 3 (`PRD-proposal-v4.md:544-551`), meaning the whole Strange Water build will hardcode branding and layout choices. Pull at least the design tokens (colors, typography, spacing) and layout toggles into a config layer during Phase 1b/1c so the initial implementation exercises the reusable architecture and avoids a large refactor before the second podcast.

## Editorial Workflow & Preview Experience
- The plan sets up Sanity locally via `sanity dev` (`PRD-proposal-v4.md:226-245`) but never defines how non-technical coordinators will access a hosted Studio or preview unpublished content. Add requirements for deploying Studio to a secure URL, enabling live preview in Astro, documenting roles/permissions, and training coverage so the “easy content management” objective is satisfied before launch.

## Future Phases Definition
- Phase 2 and Phase 3 only list theme-level headlines with “will detail later” (`PRD-proposal-v4.md:528-553`). Flesh out the high-impact backlog now—forms, transcript automation, search relevance tuning, second-site deployment runbook—so stakeholders can confirm the roadmap actually delivers the reusable framework, growth features, and redeployment KPIs promised in the Executive Summary.
