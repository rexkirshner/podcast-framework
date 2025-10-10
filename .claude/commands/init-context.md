---
name: init-context
description: Initialize Claude Context System for this project
---

# /init-context Command

Initialize a **minimal overhead** context system for this project. Creates 4 core files (CONTEXT.md, STATUS.md, DECISIONS.md, SESSIONS.md) plus 1 AI header (claude.md), with optional files (CODE_MAP.md, other AI headers) suggested when complexity demands.

**Philosophy:** Minimal overhead during work. Good-enough recovery when needed. Single source of truth. Platform-neutral core with tool-specific entry points.

**See also:**
- `.claude/docs/command-philosophy.md` for core principles

## What This Command Does

Creates **4 core files + 1 AI header** that serve dual purpose (developer productivity + AI agent review/takeover):
1. **claude.md** - AI header (entry point for Claude, points to CONTEXT.md)
2. **CONTEXT.md** - Orientation (rarely changes: who/what/how/why, platform-neutral)
3. **STATUS.md** - Current state with auto-generated Quick Reference at top
4. **DECISIONS.md** - Decision log (WHY choices made - critical for AI agents)
5. **SESSIONS.md** - History (structured, comprehensive, append-only with mandatory TL;DR)

Optional files (CODE_MAP.md, cursor.md, aider.md, PRD.md, ARCHITECTURE.md) suggested when complexity demands.

## Why 5 Core Files?

**The Dual Purpose:**
1. **Session continuity** - Resume work seamlessly
2. **AI agent review/takeover** - Enable AI to understand WHY, review code, take over development

**Real-world feedback revealed:**
- System isn't just for you - it's for AI agents reviewing and improving your work
- AI agents need to understand WHY decisions were made, not just WHAT code exists
- TodoWrite for productivity during work, rich docs for AI at save points
- DECISIONS.md is critical - AI needs rationale, constraints, tradeoffs

**v2.1.0 approach:**
- claude.md as AI header (tool-specific entry point)
- CONTEXT.md for orientation (platform-neutral, ~300 lines)
- STATUS.md for current state (with auto-generated Quick Reference section)
- **DECISIONS.md for rationale (AI agents understand WHY)**
- SESSIONS.md structured + comprehensive (mental models, mandatory TL;DR, git operations auto-logged)
- Optional: CODE_MAP.md (only if project complexity demands)
- Optional: Other AI headers (cursor.md, aider.md) for multi-tool teams
- Optional: PRD/ARCHITECTURE when complexity demands

## Execution Steps

### Step 0: Verify Working Directory and .claude Location

**CRITICAL:** Check for multiple .claude directories in the path. This causes conflicts.

```bash
# Get absolute path to current directory
CURRENT_DIR=$(pwd)
echo "Working directory: $CURRENT_DIR"

# Check for .claude directories in parent path
CLAUDE_DIRS=$(find "$CURRENT_DIR" -maxdepth 0 -name ".claude" -o -path "*/.claude" | grep -c ".claude" || echo "0")

# Also check parent directories up to 3 levels
PARENT_CLAUDE=$(find "$CURRENT_DIR/.." -maxdepth 2 -name ".claude" 2>/dev/null | grep -v "$CURRENT_DIR/.claude" || echo "")

if [ -n "$PARENT_CLAUDE" ]; then
  echo ""
  echo "⚠️  WARNING: Multiple .claude directories detected!"
  echo ""
  echo "Current project: $CURRENT_DIR/.claude"
  echo "Parent folder(s): $PARENT_CLAUDE"
  echo ""
  echo "❌ PROBLEM: Claude Code may use the wrong .claude directory"
  echo "This causes commands to be loaded from the parent instead of this project."
  echo ""
  echo "✅ SOLUTION: Only keep .claude in the actual project root"
  echo "Remove .claude from parent folders that aren't projects themselves."
  echo ""
  echo "Recommended action:"
  echo "  1. If parent folder is NOT a project: rm -rf <parent>/.claude"
  echo "  2. If parent folder IS a project: Move this project out of it"
  echo ""
  read -p "Continue anyway? [y/N] " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled. Please resolve .claude directory conflicts first."
    exit 1
  fi
fi
```

### Step 1: Check Existing Context

```
Check if context/ folder already exists:
- If exists: Warn user and ask if they want to reinitialize
- If not: Proceed to Step 2
```

### Step 2: Analyze Project

Gather information about the project:

**File System Analysis:**
- Run `ls -la` to see root structure
- Check for package.json, Cargo.toml, go.mod, requirements.txt, etc.
- Identify project type (web app, CLI, library, API, etc.)
- Find README.md if exists

**Git Analysis (if git repo):**
- Run `git log --oneline -10` for recent history
- Run `git remote -v` to find repo URL
- Check current branch with `git branch --show-current`

**Technology Stack:**
- Read package.json for Node.js projects
- Read Cargo.toml for Rust projects
- Read go.mod for Go projects
- Read requirements.txt for Python projects
- Identify framework (Next.js, React, Express, etc.)

### Step 3: Create Minimal Folder Structure

Create only what we need right now:

```bash
mkdir -p context
mkdir -p artifacts/code-reviews
mkdir -p artifacts/lighthouse
mkdir -p artifacts/performance
mkdir -p artifacts/security
mkdir -p artifacts/bundle-analysis
mkdir -p artifacts/coverage
```

### Step 4: Generate Core Documentation Files

Create the **4 core files + 1 AI header** from templates:

**context/claude.md** - AI header (entry point)
- 7-line file pointing to CONTEXT.md
- Created from claude.md.template
- **Tool-specific entry point for platform-neutral docs**

**context/CONTEXT.md** - Orientation (platform-neutral, ~300 lines)
- Project overview (from README or git description)
- **"Getting Started Path"** with 5-min and 30-min orientations
- Tech stack (from package analysis)
- High-level architecture with links to DECISIONS.md for details
- Development workflow and principles
- Environment setup
- **Communication preferences and workflow rules**
- **References other files for current work** (no duplication)

**context/STATUS.md** - Current state with auto-generated Quick Reference
- **Quick Reference section (auto-generated, DO NOT edit manually)**
  - Project info, URLs, tech stack from .context-config.json
  - Current phase, active tasks, status indicator
  - Documentation health from validation
- Current phase/focus
- Active tasks (checkboxes)
- Work in progress
- Recent accomplishments
- Next session priorities
- **Single source of truth for "what's happening now"**

**context/DECISIONS.md** - Decision log (critical for AI agents)
- Initialize with template and "Guidelines for AI Agents" section
- Empty active decisions table ready for use
- Example decision showing proper format
- **Critical for AI agents to understand WHY choices were made**

**context/SESSIONS.md** - History (structured, comprehensive)
- First entry documenting initialization (with mandatory TL;DR)
- Session index table
- Template for future entries (TL;DR, accomplishments, git operations, tests)
- **Mandatory TL;DR ensures perfect continuity**

### Step 5: Create Configuration

**ACTION:** Use the Bash tool to copy the template config and update placeholders:

```bash
# Download the latest config template from GitHub
curl -sL https://raw.githubusercontent.com/rexkirshner/claude-context-system/main/config/.context-config.template.json -o context/.context-config.json

# Update placeholders (project name, owner, dates)
# Use Read tool to get current config, then Edit tool to replace placeholders with actual values
```

**IMPORTANT:** You MUST:
1. Use Read tool to read `context/.context-config.json`
2. Use Edit tool to replace ALL placeholders:
   - `[Your Name]` → actual owner name
   - `[Project Name]` → actual project name
   - `[web-app|cli|library|api]` → actual project type
   - `[YYYY-MM-DD]` → today's date

### Step 6: Optional Enhancements

**ACTION:** Prompt user for optional files based on project complexity

#### 6.1: CODE_MAP.md (Optional)

**Evaluate adoption criteria:**

```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📍 Optional: CODE_MAP.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "CODE_MAP.md helps navigate code in complex projects."
echo ""
echo "Answer these questions:"
echo ""
echo "1. Project has >20 files across multiple directories? [y/N]"
read -n 1 HAS_SIZE
echo ""

echo "2. Multiple developers or frequent AI agent handoffs? [y/N]"
read -n 1 HAS_TEAM
echo ""

echo "3. Clear separation (services, functions, components)? [y/N]"
read -n 1 HAS_STRUCTURE
echo ""

echo "4. Finding code takes >5 minutes? [y/N]"
read -n 1 HAS_PAIN
echo ""

# Count yes answers
SCORE=0
[[ $HAS_SIZE =~ ^[Yy]$ ]] && SCORE=$((SCORE + 1))
[[ $HAS_TEAM =~ ^[Yy]$ ]] && SCORE=$((SCORE + 1))
[[ $HAS_STRUCTURE =~ ^[Yy]$ ]] && SCORE=$((SCORE + 1))
[[ $HAS_PAIN =~ ^[Yy]$ ]] && SCORE=$((SCORE + 1))

echo ""
if [ $SCORE -eq 0 ] || [ $SCORE -eq 1 ]; then
  echo "📊 Score: $SCORE/4 - CODE_MAP not recommended for this project size"
  echo "You can add it later with /add-code-map if needed"
elif [ $SCORE -eq 2 ] || [ $SCORE -eq 3 ]; then
  echo "📊 Score: $SCORE/4 - CODE_MAP optional (marginal value)"
  read -p "Create CODE_MAP.md? [y/N]: " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    cp templates/CODE_MAP.template.md context/CODE_MAP.md
    echo "✅ Created CODE_MAP.md - customize it with your project structure"
  else
    echo "⏭️  Skipped CODE_MAP.md"
  fi
else
  echo "📊 Score: $SCORE/4 - CODE_MAP recommended for complex projects"
  read -p "Create CODE_MAP.md? [Y/n]: " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    cp templates/CODE_MAP.template.md context/CODE_MAP.md
    echo "✅ Created CODE_MAP.md - customize it with your project structure"
  else
    echo "⏭️  Skipped CODE_MAP.md"
  fi
fi
```

#### 6.2: Additional AI Headers (Optional)

**If team uses multiple AI tools:**

```bash
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 Optional: Additional AI Tool Headers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Do you use other AI coding tools besides Claude? [y/N]"
read -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo ""
  echo "Select AI tools (space-separated numbers, enter when done):"
  echo "  1. Cursor"
  echo "  2. Aider"
  echo "  3. GitHub Copilot"
  echo "  4. Other (will prompt for name)"
  echo ""
  read -p "Selection: " TOOLS

  # Create selected headers
  for tool in $TOOLS; do
    case $tool in
      1) cp templates/cursor.md.template context/cursor.md
         echo "✅ Created cursor.md" ;;
      2) cp templates/aider.md.template context/aider.md
         echo "✅ Created aider.md" ;;
      3) cp templates/codex.md.template context/codex.md
         echo "✅ Created codex.md" ;;
      4) read -p "Enter AI tool name: " CUSTOM_TOOL
         /add-ai-header "$CUSTOM_TOOL" ;;
    esac
  done
else
  echo "⏭️  Skipped additional AI headers"
  echo "💡 Tip: Use /add-ai-header [tool] to add later"
fi
```

### Step 7: Explain Dual-Purpose Philosophy

After initialization, explain to the user:

```
✅ Context System Initialized (v2.1.0)

Created 4 core files + 1 AI header:
- context/claude.md - AI header (entry point for Claude)
- context/CONTEXT.md - Orientation (platform-neutral, ~300 lines)
- context/STATUS.md - Current state (with auto-generated Quick Reference)
- context/DECISIONS.md - Decision log (WHY choices made)
- context/SESSIONS.md - History (mandatory TL;DR, auto-logged git ops)
- context/.context-config.json - Configuration

Optional files created (if selected):
- context/CODE_MAP.md - Code location guide (if complex project)
- context/[tool].md - Additional AI headers (if multi-tool team)

⚡ Two-Tier Workflow:

**Tier 1: Quick Updates (Most Sessions)**
Run /save at session end - 2-3 minutes
- Updates STATUS.md (current tasks, blockers, next steps)
- Auto-generates Quick Reference section in STATUS.md
- Minimal overhead, continuous work

**Tier 2: Comprehensive Documentation (Occasional)**
Run /save-full before breaks/handoffs - 10-15 minutes
- Everything /save does
- PLUS: Creates detailed SESSIONS.md entry
- PLUS: Documents mental models and decision rationale
- Use ~3-5 times per 20 sessions

**Time Investment for 20 Sessions:**
- 17× /save: ~40-50 min
- 3× /save-full: ~30-45 min
- Total: ~70-95 min (50% reduction from v1.8.0)

🎯 Philosophy:

**Within sessions:** TodoWrite for productivity (minimal overhead)
**At save points:** /save for quick state capture (2-3 min)
**Before breaks:** /save-full for comprehensive docs (10-15 min)

This system enables AI agents to:
- Review your code with full context
- Understand WHY you made decisions
- Take over development seamlessly
- Learn from your problem-solving approaches

📊 Single Source of Truth:

Each piece of information lives in ONE place:
- Current tasks → STATUS.md
- Quick reference info → STATUS.md (auto-generated section at top)
- Project overview → CONTEXT.md (platform-neutral)
- Decision rationale → DECISIONS.md
- History + mental models → SESSIONS.md (created by /save-full with mandatory TL;DR)

🤖 For AI Agents:

**DECISIONS.md is critical** - Captures WHY choices were made:
- Rationale and constraints
- Alternatives considered
- Tradeoffs accepted

**SESSIONS.md captures thinking** - AI agents learn from:
- Your mental models
- Problem-solving approaches
- Evolution of your understanding

📈 Growing Your Documentation:

When complexity demands it, I'll suggest:
- **CODE_MAP.md** → Code location guide (for complex projects)
- **PRD.md** → Product vision documentation
- **ARCHITECTURE.md** → System design documentation
- **[tool].md** → Additional AI headers (for multi-tool teams)

Next Steps:
1. Review context/CONTEXT.md for accuracy
2. Use TodoWrite during active work
3. Run /save at session end (2-3 min quick update)
4. Run /save-full before breaks/handoffs (10-15 min comprehensive)
5. Use /code-review for AI agent review when ready
6. Start coding!
```

### Step 7: Cleanup Installation Files

**IMPORTANT:** Remove the installation files that were downloaded from GitHub to keep the project clean.

**ACTION:** Use the Bash tool to remove installation directory:

```bash
# Check if we're in a nested installation (common pattern)
if [ -d "../claude-context-system" ]; then
  echo "🧹 Removing installation files..."
  rm -rf ../claude-context-system
  echo "✅ Installation files removed"
elif [ -d "./claude-context-system" ]; then
  echo "🧹 Removing installation files..."
  rm -rf ./claude-context-system
  echo "✅ Installation files removed"
else
  echo "⏭️  No installation files found (already clean)"
fi

# Also check for downloaded zip
if [ -f "../claude-context-system.zip" ]; then
  rm -f ../claude-context-system.zip
  echo "✅ Removed installation zip"
fi
```

## Template Content Guidelines

When filling templates, use this priority:

1. **From project files**: Use actual data from package.json, README, git
2. **Inferred from structure**: Make educated guesses from folder layout
3. **Generic placeholders**: Use `[TODO: Add ...]` for unknown info
4. **Smart defaults**: Always include standard preferences and workflow rules

## On-Demand File Creation

When `/save-context` runs, it should check if additional documentation is needed:

**Check for ARCHITECTURE.md need:**
- Project has >20 files in src/
- Multiple directories with different purposes
- Complex dependency relationships
- Ask: "Your architecture is getting complex. Should I create ARCHITECTURE.md for AI agents to understand system design?"

**Check for PRD.md need:**
- Product vision discussed multiple times
- Feature roadmap getting complex
- Ask: "Product scope is expanding. Should I create PRD.md to document vision and roadmap for AI agent context?"

**v2.0 Note:** We always create DECISIONS.md because it's critical for AI agents to understand WHY choices were made. Only ARCHITECTURE.md and PRD.md are suggested on-demand when complexity demands it.

## Important Notes

- Always include workflow preferences in CONTEXT.md
- CONTEXT.md must include "no lazy coding" and "simplicity first" rules
- Configuration must enforce "no push without approval"
- STATUS.md is single source of truth for current state
- **DECISIONS.md is critical for AI agents** - always create it
- CONTEXT.md references other files, doesn't duplicate
- SESSIONS.md uses structured format (40-60 lines with mental models)
- **Structured ≠ minimal** - AI agents need comprehensive depth
- Quick Reference section in STATUS.md is auto-generated, never edited manually
- Use bullet points and clear headings
- **Dual purpose:** developer productivity + AI agent review/takeover

## Error Handling

If errors occur:
- Report what failed clearly
- Show what was successfully created
- Provide manual recovery steps
- Never leave partial initialization

## Success Criteria

Command succeeds when:
- 4 core files + 1 AI header (claude.md, CONTEXT.md, STATUS.md, DECISIONS.md, SESSIONS.md) created with available data
- All files use v2.1 structure and format
- STATUS.md includes auto-generated Quick Reference section
- Configuration valid
- Installation files cleaned up
- User understands dual-purpose philosophy (developer + AI agent)
- User knows DECISIONS.md is for AI agent understanding
- User can immediately run /save or /save-full
- Clear next steps provided
