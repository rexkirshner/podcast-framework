# Templatization Plan - Critical Review

**Date:** 2025-10-14 (Session 20)
**Reviewer:** Claude (Fresh Perspective Analysis)
**Purpose:** Identify critical gaps, contradictions, and risks that could prevent long-term success
**Methodology:** Line-by-line review with focus on architectural soundness, technical feasibility, and maintainability

---

## Executive Summary

**Overall Assessment:** The plan is comprehensive and well-intentioned, but contains several **critical architectural contradictions** that would prevent successful implementation.

**Grade:** C+ (Needs Major Revision)
- ✅ Good: Service categorization, configuration design, risk awareness
- ⚠️ Major Issues: Architectural confusion, missing technical details, unrealistic timelines
- ❌ Critical Flaws: Contradictory upgrade mechanisms, undefined component override strategy

**Recommendation:** **DO NOT PROCEED** without resolving the issues identified below. Revise plan to commit to a single, coherent architecture.

---

## CRITICAL ISSUE #1: Contradictory Upgrade Mechanisms

### The Problem

The plan proposes **TWO incompatible upgrade strategies simultaneously:**

**Location 1 - Section 3.3 (Template Repository Workflow):**
```bash
# Pull framework updates
git fetch upstream
git merge upstream/main --allow-unrelated-histories

# Or use CLI tool
npx @podcast-framework/cli update
```

**Location 2 - Section 6.1 (Upgrade Paths):**
```json
{
  "dependencies": {
    "@podcast-framework/core": "^2.1.0", // Auto-updates 2.1.x
  }
}
```

### Why This is Contradictory

These represent two **fundamentally different architectural patterns:**

**Pattern A: Framework as NPM Package**
- Framework code lives in `node_modules/@podcast-framework/core`
- Updates via `npm update` or `npm install @podcast-framework/core@latest`
- No git relationship between podcast and framework
- Template is just a one-time starter
- Podcasts customize via configuration and local overrides

**Pattern B: Template as Git Fork**
- Framework code lives directly in podcast repo
- Updates via `git merge upstream/main`
- Requires resolving merge conflicts
- Template maintains ongoing git relationship
- Podcasts customize by editing files directly

**You cannot do both.** Attempting to mix these will result in:
- Confusion about how to update
- Import path inconsistencies (`../components/Header.astro` vs `@podcast-framework/core/components/Header.astro`)
- Merge conflicts even when using npm packages
- Broken builds when approaches conflict

### Impact

🔴 **CRITICAL** - This is a foundational decision. Everything else depends on it.

### Recommendation

**Choose Pattern A (NPM Package)** because:
1. Clearer dependency management
2. Semantic versioning works naturally
3. No merge conflict hell
4. Better for TypeScript/intellisense
5. Standard npm ecosystem tooling
6. Can still override via Astro's import system

**Remove all references to git merge upstream strategy.**

---

## CRITICAL ISSUE #2: Undefined Component Override Mechanism

### The Problem

The plan mentions podcasts can "override components" but **never explains HOW this actually works** in Astro.

**From Section 2.2:**
> **Podcast Instance (Customizable)**
> - Custom components
> - Theme overrides

**But:** No explanation of the technical mechanism.

### Why This Matters

If framework provides `@podcast-framework/core/components/Header.astro` and a podcast wants a custom header:

**Question 1:** Where do they put their custom `Header.astro`?
- `src/components/Header.astro`?
- How does Astro know to use this instead of framework version?

**Question 2:** How do they import it?
- Do all framework layout files need to check for local override first?
- Does podcast owner manually change every import?

**Question 3:** What happens on framework updates?
- If framework Header gets new props, does custom Header break?
- How does podcast owner know framework Header changed?
- Is there a diff tool to see what changed?

**Question 4:** What about partial overrides?
- Can they override just the header styling but keep logic?
- Or must they copy-paste entire component?

### Astro's Component Resolution

Astro **does not have built-in component override/shadowing** like Gatsby themes. You need to explicitly design this:

**Option A: Manual Import Swapping**
```typescript
// In framework layout
import Header from '../components/Header.astro'; // Breaks with npm package
```

**Option B: Configuration-Based Override**
```javascript
// podcast.config.js
export default {
  components: {
    Header: './src/components/CustomHeader.astro'
  }
}

// Framework needs to check config and dynamically import
```

**Option C: Slot-Based Composition**
```astro
// Framework provides slots, podcast provides content
<BaseLayout>
  <Header slot="header">
    <!-- Custom header content -->
  </Header>
</BaseLayout>
```

**None of these are mentioned in the plan.**

### Impact

🔴 **CRITICAL** - Without this, podcasts cannot meaningfully customize beyond configuration. This defeats the purpose of a framework.

### Recommendation

**Add Section 2.4: Component Override System**

Detail the chosen mechanism:
1. How to override a component
2. How framework resolves overrides
3. How updates work with overrides
4. Migration path for breaking changes to overridden components
5. Tools to diff framework vs custom components

---

## CRITICAL ISSUE #3: Sanity Schema Migration Not Addressed

### The Problem

The plan assumes schemas can be "deployed" to Sanity projects via API, but **Sanity doesn't work this way.**

**From addendum Section 3.3:**
```javascript
await deploySchema({
  projectId: project.id,
  dataset: 'production',
  schemas: baseSchemas
});
```

### How Sanity Actually Works

1. **Schemas are files in your repo**, not API-deployed
2. **Sanity Studio reads schema files** and generates UI
3. **Schema changes require manual migration** if they affect existing data
4. **No "deploy schema via API"** - you deploy the Studio app, which includes schemas

### The Real Problem

**Scenario:**
- Framework v1 has episode schema with field `description` (text)
- Podcast uses v1, has 50 episodes in Sanity
- Framework v2 changes `description` to `summary` (text)
- Podcast upgrades framework to v2

**What happens?**
- New schema expects `summary` field
- Sanity still has data in `description` field
- Episodes appear broken in UI
- Need to migrate 50 documents: rename field `description` → `summary`

**Who writes the migration?**
- Framework maintainer? They don't have access to podcast's Sanity project
- Podcast owner? They don't know what changed in framework schema

**How is migration delivered?**
- As a Sanity migration script? How do podcasts run it?
- As part of CLI update? How does CLI access Sanity?

**The plan doesn't address any of this.**

### Sanity Studio Deployment (Also Missing)

Each podcast needs their own Sanity Studio (admin UI). The plan never mentions where this lives or how it's deployed:

**Options:**
1. **Hosted by Sanity** (sanity.io/studio) - requires studio config
2. **Self-hosted** in podcast repo - requires deploying a separate app
3. **Embedded** in main site - requires special routing

**None of these are specified.**

### Impact

🔴 **CRITICAL** - Schema evolution is essential for framework updates. Without a clear strategy, podcasts will be stuck on old versions.

### Recommendation

**Add Section 3.5: Sanity Schema Evolution Strategy**

1. **Schema Versioning:**
   - Framework ships schema packages: `@podcast-framework/sanity-schema-v1`, `v2`, etc.
   - Podcasts pin specific version: `import { episode } from '@podcast-framework/sanity-schema-v1'`

2. **Breaking Changes:**
   - Framework provides migration guide (not automated)
   - Podcast owner runs Sanity CLI migration manually
   - Or framework provides migration script podcast can review and run

3. **Studio Deployment:**
   - Decide: Hosted or self-hosted?
   - Document deployment process
   - Automate Studio config generation

4. **Backward Compatibility:**
   - Framework maintains 2-3 schema versions simultaneously
   - Podcasts upgrade on their schedule
   - Deprecated field warnings in Studio

---

## CRITICAL ISSUE #4: CLI Timeline Too Optimistic

### The Problem

**Week 3: CLI Tool** - Build entire production CLI in 1 week

### What This Actually Requires

A production-quality CLI with features listed in plan:
- Project scaffolding with templates
- Interactive prompts (name, theme, features)
- Service setup orchestration (Sanity, Cloudflare, Analytics)
- Deployment automation
- Update management
- Migration system
- Error handling and recovery
- Progress indicators
- Testing

**Realistic timeline:** 3-4 weeks minimum

### Similar Projects' Timelines

- **create-react-app:** Months of development
- **create-next-app:** Months of development
- **create-astro:** Weeks of development (with existing framework team)

### Impact

🟡 **HIGH** - Under-estimating timeline leads to:
- Rushed, buggy CLI
- Poor error handling
- Inadequate testing
- Technical debt from shortcuts

### Recommendation

**Extend CLI development to Weeks 3-6** (4 weeks)

**Adjust overall timeline:**
- Weeks 1-2: Core extraction
- Weeks 3-6: CLI tool (4 weeks)
- Week 7: Configuration system
- Week 8: Template repository
- Then proceed with documentation, testing, launch

**Total:** 10-12 weeks instead of 8 weeks

---

## CRITICAL ISSUE #5: Service Setup Automation Not Technically Feasible

### The Problem

**From addendum Section 3.3:**
```javascript
// 1. Create new Sanity project via API
const project = await createSanityProject({
  title: podcastName,
  organizationId: process.env.SANITY_ORG_ID
});
```

### Sanity API Limitations

Sanity's Management API **does not support** creating projects programmatically without manual intervention:
- Requires organization owner approval
- May require 2FA verification
- Has rate limiting
- Needs special permissions

**You cannot fully automate Sanity project creation** from a CLI.

### Similar Issues

**Cloudflare Pages:**
- API access requires tokens with specific permissions
- Organization permissions may require manual setup
- Can't fully automate "first connection" to GitHub repo

**Google Analytics:**
- API requires OAuth flow
- Can't fully automate property creation without browser

### Impact

🟡 **HIGH** - The "4-hour new podcast setup" promise relies on automation that may not be technically possible.

### Recommendation

**Accept semi-manual setup:**

1. **Sanity:** CLI provides link to create project, waits for project ID input
2. **Cloudflare:** CLI opens browser for OAuth, then uses API
3. **Analytics:** Provide manual setup guide, CLI validates setup

**Update promise:** "Deploy new podcast in 4-6 hours" (includes manual steps)

**Add clear documentation** for each manual step with screenshots

---

## CRITICAL ISSUE #6: Template Sync Problem

### The Problem

`podcast-template` repository is a GitHub template. Someone clicks "Use this template" and gets the code as of today.

**Question:** When framework releases v2.1.0 next month, how does the template repo get updated?

**Options:**
1. **Manual:** Maintainer manually updates template repo each release
2. **Automated:** CI/CD updates template when packages are published
3. **Version tags:** Template has multiple branches (v2.0, v2.1, etc.)

**The plan doesn't specify any of these.**

### Why This Matters

If template is out of sync with framework:
- New podcasts start with outdated package.json
- May get wrong framework version
- May missing new recommended configurations
- May have security vulnerabilities

### Impact

🟡 **MEDIUM** - Not critical but will cause confusion and support burden

### Recommendation

**Add Section 3.4: Template Maintenance Strategy**

1. **Automated sync:**
   - GitHub Action runs on framework package publish
   - Updates template's package.json
   - Commits and tags new template version
   - Keeps template in sync automatically

2. **Version branches:**
   - `main` - latest stable
   - `v2.x` - v2 compatible
   - `v1.x` - v1 compatible (maintenance only)

3. **Template changelog:**
   - Document what changed in each template version
   - Help existing podcasts decide if they need to pull updates

---

## CRITICAL ISSUE #7: Monorepo vs Separate Repos Confusion

### The Problem

**Section 2.1 shows structure:**
```
podcast-framework/
├── packages/
│   ├── core/
│   ├── cli/
│   └── themes/
├── template/
├── examples/
└── docs/
```

**But Section 3.1 says:**
> **Three-Repository Approach (Recommended)**
> 1. podcast-framework (Main Repository)
> 2. podcast-template (Template Repository)
> 3. podcast-framework-docs (Documentation)

### The Contradiction

If template and docs are **separate repos**, why are they shown **inside the monorepo** in Section 2.1?

GitHub template repositories don't work on subdirectories of monorepos. You can't say "Use this template" on `/template` subdirectory.

### Impact

🟡 **MEDIUM** - Creates confusion about actual repository structure

### Recommendation

**Clarify in Section 3.1:**

**Main Monorepo:** `podcast-framework`
- packages/core
- packages/cli
- packages/themes
- examples/ (for testing, not published)

**Separate Repository:** `podcast-template`
- Contains starter code
- Has "Use this template" button
- References `@podcast-framework/core` in package.json

**Separate Repository:** `podcast-framework-docs`
- Documentation website
- Can be Astro site or Starlight

**Remove** template/ and docs/ from monorepo structure diagram

---

## CRITICAL ISSUE #8: Breaking Change Handling Underspecified

### The Problem

**Section 6.2** shows a migration script structure, but doesn't explain:

1. **How does podcast know they need to migrate?**
   - Does `npm update` automatically run migrations?
   - Do they get a warning when they try to build?
   - Is there a pre-install script?

2. **How does migration script know current version?**
   - Check package.json version?
   - Read from state file?
   - What if podcast skipped versions?

3. **What if migration fails?**
   - How to rollback?
   - Restore from backup (but where is backup stored)?
   - How to debug what went wrong?

4. **What if podcast customized files that migration wants to change?**
   - Auto-merge? Could break custom code
   - Skip? Then podcast is half-migrated
   - Manual review? How?

### Example Scenario

**Podcast on v1.9 wants to upgrade to v2.5:**
- Skipped v2.0, v2.1, v2.2, v2.3, v2.4
- Each version had migrations
- Do they run all 6 migrations in sequence?
- What if migration #3 fails?
- Are they left in a v2.2 half-migrated state?

**The plan doesn't address this complexity.**

### Impact

🔴 **CRITICAL** - Without clear migration strategy, major version updates will be too risky and podcasts will stay on old versions.

### Recommendation

**Expand Section 6.2 with:**

1. **Migration Orchestration:**
   ```bash
   npx @podcast-framework/cli update --major
   # Checks current version
   # Lists all migrations needed
   # Runs them in sequence
   # Creates backup before each
   # Validates after each
   # Rollback on any failure
   ```

2. **Version Detection:**
   - Store framework version in `.podcast-framework-version` file
   - Update on each successful migration
   - Use for determining required migrations

3. **Dry Run Mode:**
   ```bash
   npx @podcast-framework/cli update --dry-run
   # Shows what would change
   # Lets user review before committing
   ```

4. **Interactive Conflict Resolution:**
   - Detect conflicts with custom code
   - Pause migration
   - Show diff
   - Let user resolve
   - Continue

---

## CRITICAL ISSUE #9: Missing Multi-Podcast Management Strategy

### The Problem

If someone runs 10+ podcasts, how do they:
- View all podcasts in one dashboard?
- See which need updates?
- Monitor costs across all?
- Deploy updates to multiple at once?
- Manage shared services (OpenAI API costs)?

**From addendum Section 3.6:** Brief mention of dashboard, but no details

### Why This Matters

Managing 10+ podcasts individually is unsustainable:
- Checking each one for updates: 10 minutes each = 100 minutes
- Deploying update to all: Hours of repetitive work
- Monitoring costs: Logging into 10 different service accounts

**This doesn't scale.**

### Impact

🟡 **MEDIUM** - Not critical for MVP (1-2 podcasts) but essential for long-term goal of "support 100+ podcast instances"

### Recommendation

**Add Section 15: Multi-Podcast Management**

1. **CLI Workspace Mode:**
   ```bash
   # Initialize workspace
   npx @podcast-framework/cli workspace init

   # Register podcasts
   npx @podcast-framework/cli workspace add ./podcast-1
   npx @podcast-framework/cli workspace add ./podcast-2

   # Update all
   npx @podcast-framework/cli workspace update-all

   # Check status
   npx @podcast-framework/cli workspace status
   ```

2. **Dashboard Application:**
   - Web app showing all podcasts
   - Framework versions for each
   - Pending updates
   - Cost breakdown
   - Error monitoring
   - Deploy button

3. **Service Usage Tracking:**
   - Track OpenAI API usage per podcast (via metadata)
   - Aggregate costs monthly
   - Alert on cost spikes

4. **Bulk Operations:**
   - Update multiple podcasts at once
   - Deploy to staging for all
   - Promote staging to production

---

## CRITICAL ISSUE #10: Open Source License Not Chosen

### The Problem

**Section 12.2** lists "Open source license" as a future decision. But this should be decided **before launch** because:

1. **It affects how people can use the framework**
2. **You can't easily change it later** (requires all contributors to agree)
3. **Different licenses have different community implications**

### License Options

**MIT:**
- ✅ Most permissive
- ✅ Encourages adoption
- ✅ Commercial use allowed
- ❌ Others can fork and commercialize without contributing back

**Apache 2.0:**
- ✅ Similar to MIT but with patent protection
- ✅ Good for projects with potential patent concerns
- ✅ Commercial use allowed

**GPL v3:**
- ✅ Requires derived works to be open source
- ✅ Prevents proprietary forks
- ❌ May discourage commercial adoption
- ❌ Complex compliance for users

**AGPL v3:**
- ✅ Like GPL but covers SaaS usage
- ✅ Prevents cloud-based proprietary versions
- ❌ Significantly limits adoption (most restrictive)

**Custom / Dual License:**
- ✅ Can restrict commercial use
- ✅ Can sell commercial licenses
- ❌ More complex
- ❌ May confuse users

### Impact

🟡 **MEDIUM** - Needs decision before public launch, but doesn't block initial development

### Recommendation

**For this project: MIT License**

**Reasoning:**
- Goal is max adoption (support 100+ podcasts)
- Framework adds value through features, not license restriction
- Can always offer paid support/themes separately
- Keeps door open for commercial SaaS later
- Simple, well-understood

**Add license to all package.json files immediately**

---

## CRITICAL ISSUE #11: Cost Monitoring Not Addressed

### The Problem

**From addendum:** Sanity free tier is 100K API calls/month. What happens when podcast exceeds this?

- Sanity auto-upgrades to $99/month
- No warning to podcast owner
- Unexpected bill

**Similar issues:**
- OpenAI API usage spikes (transcript generation)
- Cloudflare bandwidth limits
- CDN storage limits

**The plan doesn't address monitoring or alerting.**

### Impact

🟡 **MEDIUM** - Won't stop framework working, but will cause very unhappy users ("Your framework cost me $500 unexpectedly!")

### Recommendation

**Add Section 10.5: Cost Monitoring & Alerting**

1. **Usage Dashboard (in CLI or web dashboard):**
   - Show current month's API calls to Sanity
   - Show OpenAI API spend
   - Show Cloudflare bandwidth
   - Highlight approaching limits

2. **Webhooks:**
   - Sanity can send usage webhooks
   - CLI can listen and alert
   - Or email podcast owner

3. **Preventive Measures:**
   - Rate limiting on API routes
   - Caching to reduce Sanity API calls
   - Transcript batch processing (not real-time)

4. **Documentation:**
   - Clear guidance on expected costs
   - How to optimize for free tier
   - When to upgrade to paid tier

---

## MAJOR ISSUE #12: Framework Update Testing Not Explained

### The Problem

**Section 8.4** mentions testing upgrade paths but doesn't explain HOW.

**To test upgrades, you need:**
1. Create podcast on v1.0
2. Add content (episodes, guests)
3. Customize it (override components, add pages)
4. Upgrade to v2.0
5. Verify:
   - Site builds successfully
   - All features still work
   - Custom code didn't break
   - Content migrated correctly

**This needs automation to test with each framework release.**

### Why This Matters

Without automated upgrade testing:
- Framework maintainer doesn't know if update broke existing podcasts
- Only discover breakage when users complain
- Too late to fix before release

### Impact

🟡 **MEDIUM** - Important for quality but can be added post-MVP

### Recommendation

**Add Section 8.5: Framework Compatibility Testing**

1. **Test Matrix:**
   - Create sample podcasts for each supported version (v1.0, v1.5, v2.0)
   - Store in `tests/fixtures/podcasts/`
   - Each has content, customizations, overrides

2. **Upgrade Test Suite:**
   ```javascript
   describe('Upgrades', () => {
     it('upgrades v1.0 podcast to v2.0', async () => {
       const testPodcast = await loadFixture('v1.0-basic');
       const result = await upgradePodcast(testPodcast, '2.0.0');

       expect(result.success).toBe(true);
       expect(result.buildsSuccessfully).toBe(true);
       expect(result.allFeaturesWork).toBe(true);
     });
   });
   ```

3. **CI Integration:**
   - Run upgrade tests on every PR
   - Block merging if any upgrade path breaks
   - Test against sample podcasts with various customizations

---

## MAJOR ISSUE #13: Rollback Procedures Not Detailed

### The Problem

**Section 6.2** shows rollback() function but doesn't explain:

1. **How is backup created?**
   - ZIP of entire project directory?
   - Git stash?
   - Copy to temp directory?

2. **Where is backup stored?**
   - `.backups/` directory?
   - System temp?
   - User's home directory?

3. **How much disk space do backups use?**
   - node_modules included? (huge)
   - How many backups kept?
   - Auto-cleanup old backups?

4. **How to rollback?**
   - `npx @podcast-framework/cli rollback` ?
   - Choose from list of backups?
   - Automatic on migration failure?

5. **What about external state?**
   - Sanity data migrated - how to un-migrate?
   - Git commits made - revert them?
   - Deployed to production - redeploy old version?

### Impact

🟡 **MEDIUM** - Users need confidence they can recover from bad upgrades

### Recommendation

**Expand Section 6.2.1: Rollback System**

1. **Backup Strategy:**
   ```bash
   .podcast-framework-backups/
   ├── 2025-01-15_v1.9.0/       # Timestamped backups
   │   ├── package.json
   │   ├── podcast.config.js
   │   ├── astro.config.mjs
   │   └── src/                  # Only source files, not node_modules
   ├── 2025-02-01_v2.0.0/
   └── latest -> 2025-02-01_v2.0.0/
   ```

2. **Rollback Command:**
   ```bash
   # List available backups
   npx @podcast-framework/cli rollback --list

   # Roll back to specific version
   npx @podcast-framework/cli rollback --to=v1.9.0

   # Roll back to last backup
   npx @podcast-framework/cli rollback --last
   ```

3. **Limitations:**
   - Can rollback code
   - Cannot rollback Sanity data (warn user)
   - Can redeploy previous version (if git commit exists)

4. **Backup Cleanup:**
   - Keep last 5 backups
   - Auto-delete older ones
   - Configurable retention

---

## MINOR ISSUES (Important but Not Blocking)

### 14. Community Governance Not Defined

**Issue:** If 50 contributors, who decides what gets merged?

**Recommendation:** Define governance model:
- BDFL (Rex as benevolent dictator)
- Core team (5-7 maintainers with merge rights)
- Voting system for major decisions
- Code owners for different packages

### 15. Documentation Versioning Not Clear

**Issue:** If framework has v1 and v2, docs need two versions

**Recommendation:** Use versioned docs:
- docs.podcast-framework.com/v1/
- docs.podcast-framework.com/v2/
- docs.podcast-framework.com/latest/

### 16. Security Disclosure Process Missing

**Issue:** What if someone finds security vulnerability?

**Recommendation:** Add SECURITY.md:
- security@podcast-framework.com email
- Private disclosure first
- Patch release within 48 hours
- Credit to reporter

### 17. Performance Budget Not Specific

**Issue:** "Bundle size <200KB" but for which page?

**Recommendation:** Specify per-page budgets:
- Homepage: 150KB JS
- Episode page: 180KB JS
- Search page: 200KB JS (includes search index)

### 18. Accessibility Testing Not Detailed

**Issue:** "Accessibility audit" but no specifics

**Recommendation:**
- WCAG 2.1 AA compliance
- Automated testing (axe-core)
- Manual screen reader testing
- Keyboard navigation verification

---

## WHAT'S GOOD ABOUT THE PLAN

Despite the issues above, many aspects are well-conceived:

✅ **Service Categorization** - Per-podcast vs shared services is well thought out

✅ **Configuration Design** - podcast.config.js structure is comprehensive and flexible

✅ **One Sanity Project Per Podcast** - Correct decision for data isolation

✅ **Cost Analysis** - Helpful breakdown of expected costs

✅ **Risk Analysis** - Shows awareness of potential problems

✅ **Success Metrics** - Reasonable and measurable

✅ **Plugin System** - Good extensibility strategy

✅ **Testing Pyramid** - Appropriate coverage strategy

✅ **Documentation Types** - Covers all necessary documentation

---

## PRIORITIZED ACTION ITEMS

### Before Starting Development

1. 🔴 **RESOLVE: Architectural Pattern** - Choose NPM package OR git fork, not both
2. 🔴 **DESIGN: Component Override System** - How do podcasts customize components?
3. 🔴 **DESIGN: Sanity Schema Evolution** - How do schemas update without breaking data?
4. 🟡 **EXTEND: CLI Timeline** - 1 week → 4 weeks (realistic)
5. 🟡 **ACCEPT: Semi-Manual Setup** - Can't fully automate all services
6. 🟡 **CHOOSE: Open Source License** - MIT recommended
7. 🟡 **CLARIFY: Repository Structure** - Monorepo vs separate repos

### During Development

8. 🟡 **BUILD: Template Sync** - Automated template updates on package publish
9. 🟡 **DESIGN: Multi-Podcast Management** - CLI workspace mode + dashboard
10. 🟡 **BUILD: Cost Monitoring** - Usage dashboards and alerts
11. 🟡 **BUILD: Framework Update Testing** - Automated upgrade compatibility tests
12. 🟡 **DETAIL: Rollback System** - Backup strategy and rollback commands
13. 🟡 **DEFINE: Community Governance** - Who can merge, how decisions are made
14. 🟡 **DETAIL: Breaking Change Process** - How breaking changes are communicated and migrated

### Before Launch

15. 🟡 **ADD: Security Disclosure Process**
16. 🟡 **SPECIFY: Performance Budgets** per page type
17. 🟡 **DETAIL: Accessibility Testing** criteria and process
18. 🟡 **VERSION: Documentation** for multiple framework versions

---

## REVISED TIMELINE ESTIMATE

**Original:** 8 weeks
**Realistic:** 12-14 weeks

**Breakdown:**
- Week 1-2: Core extraction + architectural decisions (2 weeks)
- Week 3-6: CLI tool (4 weeks, not 1)
- Week 7: Configuration system (1 week)
- Week 8: Template repository (1 week)
- Week 9-10: Documentation site (2 weeks, comprehensive)
- Week 11: Testing & validation (1 week)
- Week 12: Launch preparation (1 week)
- Week 13-14: Beta testing & iteration (2 weeks)

**Total:** 14 weeks (3.5 months) to beta launch

---

## DECISION: WHICH ARCHITECTURE TO CHOOSE?

### Recommended: NPM Package Approach

**How It Works:**

1. **Framework is npm package:**
   ```json
   {
     "dependencies": {
       "@podcast-framework/core": "^2.1.0"
     }
   }
   ```

2. **Components imported from package:**
   ```astro
   ---
   import Header from '@podcast-framework/core/components/Header.astro';
   ---
   ```

3. **Overrides via Astro's import resolution:**
   ```astro
   ---
   // In podcast's src/components/Header.astro
   // This takes precedence when you import from local path

   // In layout, use conditional import:
   import Header from '../../components/Header.astro'; // Checks local first
   // Or framework provides helper:
   import { useComponent } from '@podcast-framework/core';
   const Header = useComponent('Header'); // Checks local first, falls back to framework
   ---
   ```

4. **Updates via npm:**
   ```bash
   npm update @podcast-framework/core
   # Or
   npx @podcast-framework/cli update --major
   ```

**Pros:**
- Clear dependency management
- Semantic versioning
- TypeScript support
- npm ecosystem
- No git conflicts

**Cons:**
- Need to design override system
- Can't just edit framework files
- More abstraction

**BUT:** This is the standard way modern frameworks work (Next.js, Gatsby, SvelteKit)

---

## FINAL RECOMMENDATION

### DO NOT PROCEED with current plan.

### INSTEAD:

1. **Revise plan to commit to NPM Package architecture**
2. **Design component override system (critical)**
3. **Design Sanity schema evolution strategy (critical)**
4. **Extend timeline to 12-14 weeks (realistic)**
5. **Address all 🔴 CRITICAL issues before starting**
6. **Create prototype to validate architecture** (1 week proof-of-concept)

### Success Criteria for Revised Plan:

✅ Clear, consistent upgrade mechanism (npm only)
✅ Documented component override system
✅ Sanity schema migration strategy
✅ Realistic timeline (12-14 weeks)
✅ Prototype validates architecture works
✅ All critical issues resolved

**Once revised: Grade A-, ready to proceed.**

---

**Review Status:** COMPLETE
**Recommendation:** REVISE BEFORE PROCEEDING
**Next Step:** Address critical issues #1, #2, #3
**Timeline:** 1 week to revise plan, 1 week to validate prototype, then proceed

---

*End of Critical Review*