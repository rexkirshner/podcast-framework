# Week 0: Prerequisites - Implementation Tracker

**Started:** 2025-10-14 (Session 20)
**Status:** In Progress
**Goal:** Complete all prerequisites before Phase 1
**Estimated Time:** 2-3 hours

---

## Overview

Week 0 is **CRITICAL** - these tasks must be completed before starting development. Do NOT skip.

**Reference:** See `templatization-plan-v2.1-FINAL.md` - Week 0 section

---

## Task Checklist

### 1. NPM Organization Setup 🔴 **BLOCKING**

**Status:** 🟡 In Progress

#### 1.1 Check Scope Availability

```bash
npm info @podcast-framework
```

**Result:** _[To be filled after check]_

**Options if taken:**
- `@podcast-fm`
- `@podframework`
- `@podcast-web`
- `@podcastframework`
- Other creative names

**Decision:** _[To be documented]_

#### 1.2 Create NPM Organization

```bash
npm login
# Then: https://www.npmjs.com/org/create
```

- [ ] Organization created
- [ ] Scope: ________________
- [ ] URL: https://www.npmjs.com/org/[scope-name]

#### 1.3 Enable 2FA

```bash
npm profile enable-2fa auth-and-writes
```

- [ ] 2FA enabled for account
- [ ] Confirmed working

#### 1.4 Invite Team Members (if applicable)

- [ ] Rex Kirshner (owner)
- [ ] Additional members: ________________

**Completion Criteria:** ✅ NPM scope owned and secured

---

### 2. GitHub Organization Setup

**Status:** ⏸️ Waiting (depends on NPM scope decision)

#### 2.1 Create Organization

```bash
# URL: https://github.com/organizations/new
# Name: podcast-framework (or chosen name)
```

- [ ] Organization created
- [ ] Name: ________________
- [ ] URL: https://github.com/[org-name]

#### 2.2 Configure Settings

- [ ] Base permissions: Read
- [ ] Allow forking: Yes
- [ ] Enable discussions: Yes
- [ ] Require 2FA: Yes

#### 2.3 Create Teams

- [ ] **Maintainers** team (write access)
  - Members: ________________
- [ ] **Contributors** team (triage access)
  - Members: ________________

**Completion Criteria:** ✅ GitHub org configured with teams

---

### 3. Domain Registration (Optional for v1.0)

**Status:** ⏸️ Not Started

**Decision:** Use GitHub Pages initially or register domains?

**Option A: GitHub Pages (Free, quick)**
- URL: `podcast-framework.github.io`
- Can add custom domain later
- No cost

**Option B: Custom Domains**
- podcast-framework.com: $12/year
- Already registered? ☐ Yes ☐ No
- If yes, where? ________________

**Choice:** _[To be decided]_

**Completion Criteria:** ✅ Hosting decision made

---

### 4. Service Accounts Setup

**Status:** ⏸️ Not Started

#### 4.1 NPM Publish Token

```bash
# Create token for CI/CD
npm token create --cidr=0.0.0.0/0
```

- [ ] Token created
- [ ] Token stored securely: ________________

#### 4.2 GitHub Personal Access Token

```bash
# URL: GitHub Settings → Developer settings → PAT → Fine-grained tokens
# Permissions needed:
# - Contents: read/write
# - Workflows: read/write
# - Administration: read/write (for template repo creation)
```

- [ ] PAT created
- [ ] Scopes configured
- [ ] Token stored securely: ________________

#### 4.3 Configure GitHub Secrets

**In main framework repo (when created):**
- [ ] `NPM_TOKEN` - for publishing packages
- [ ] `TEMPLATE_REPO_PAT` - for syncing template

**Completion Criteria:** ✅ All tokens created and secrets configured

---

### 5. Development Environment

**Status:** ⏸️ Not Started

#### 5.1 Verify Tools

```bash
node --version   # Should be 18.0.0 or higher
npm --version    # Should be 9.0.0 or higher
git --version    # Any recent version
```

**Results:**
- Node version: ________________
- npm version: ________________
- Git version: ________________

#### 5.2 Configure Git

```bash
git config --global user.name "Rex Kirshner"
git config --global user.email "your@email.com"
```

- [ ] Git configured
- [ ] SSH keys set up for GitHub

#### 5.3 Editor Setup

- [ ] VS Code (or preferred editor) installed
- [ ] Extensions installed:
  - [ ] Astro
  - [ ] TypeScript
  - [ ] Prettier
  - [ ] ESLint

**Completion Criteria:** ✅ Environment verified and ready

---

## Week 0 Exit Criteria

**Before proceeding to Week 1 (Phase 1), confirm:**

- ✅ NPM scope secured and owned
- ✅ NPM organization created with 2FA
- ✅ GitHub organization created with teams
- ✅ All CI/CD secrets configured
- ✅ Development environment verified
- ✅ No blockers to starting Phase 1

**Estimated completion time:** 2-3 hours

---

## Next Steps (After Week 0 Complete)

**Week 1 - Phase 1: Foundation**

1. Create repositories:
   - `podcast-framework` (main monorepo)
   - `podcast-template` (GitHub template)
   - `podcast-framework-docs` (documentation)

2. Set up monorepo structure (npm workspaces)

3. Begin core extraction from Strange Water

---

## Notes

**Blockers:** _[Document any blockers here]_

**Decisions Made:** _[Document key decisions]_

**Questions:** _[Questions that arise during setup]_

---

**Last Updated:** 2025-10-14
**Status:** In Progress - Starting with NPM scope check