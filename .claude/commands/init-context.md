---
name: init-context
description: Initialize Claude Context System for this project
---

# /init-context Command

Initialize a **minimal, focused** context system for this project. Starts with just the essentials (CLAUDE.md, SESSIONS.md, tasks/), then grows naturally as your project needs more documentation.

**Philosophy:** Start simple, add complexity only when needed.

**See also:**
- `.claude/docs/command-philosophy.md` for core principles
- `/init-context-full` for comprehensive 8-file setup (complex projects only)

## What This Command Does

Creates **3 core files** that provide 80% of the value:
1. **CLAUDE.md** - Project context + your preferences (the "how to work with this project" guide)
2. **SESSIONS.md** - Session history (what happened when)
3. **tasks/** - Action tracking (what's next, what's in progress)

Other files (ARCHITECTURE.md, DECISIONS.md, etc.) can be added later when needed.

## Why Start Minimal?

**Real-world feedback shows:**
- SESSIONS.md and CLAUDE.md provide most of the value
- Creating 8 files upfront feels like overhead for simple projects
- Better to grow documentation as complexity grows
- Avoids "documentation for documentation's sake"

**You can always:**
- Add PRD.md when product vision gets complex
- Add ARCHITECTURE.md when technical design needs documenting
- Add DECISIONS.md when tracking rationale becomes important
- Run `/init-context-full` if you need everything now

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
mkdir -p context/tasks
mkdir -p artifacts/code-reviews
mkdir -p artifacts/lighthouse
mkdir -p artifacts/performance
mkdir -p artifacts/security
mkdir -p artifacts/bundle-analysis
mkdir -p artifacts/coverage
```

### Step 4: Generate Core Documentation Files

Create the **3 essential files** from templates:

**context/CLAUDE.md** - Developer guide
- Project overview (from README or git description)
- Tech stack (from package analysis)
- Commands (from package.json scripts or Makefile)
- Architecture basics (inferred from folder structure)
- **Communication preferences and workflow rules**
- **"Core Development Methodology" section**
- Current status and next steps

**context/SESSIONS.md** - Session history
- First entry documenting initialization
- Template for future entries

**context/tasks/next-steps.md** - Action items
- Initial next steps based on project state
- If new project: setup tasks
- If existing: current state analysis

**context/tasks/todo.md** - Current session
- Empty template ready for use

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

### Step 6: Explain Progressive Enhancement

After initialization, explain to the user:

```
✅ Context System Initialized (Minimal Mode)

Created 3 essential files:
- context/CLAUDE.md - Project guide + your preferences
- context/SESSIONS.md - Session history
- context/tasks/next-steps.md - Action items
- context/tasks/todo.md - Current tasks
- context/.context-config.json - Configuration

📊 Why only 3 files?
Real-world usage shows SESSIONS.md + CLAUDE.md provide 80% of value.
Other documentation grows naturally as your project needs it.

📈 Growing Your Documentation:

As your project evolves, I'll suggest creating additional files when helpful:

- **PRD.md** → When product vision gets complex
- **ARCHITECTURE.md** → When technical design needs documenting
- **DECISIONS.md** → When tracking rationale becomes important
- **CODE_STYLE.md** → When coding standards need formalizing
- **KNOWN_ISSUES.md** → When bugs/limitations need tracking

I'll ask you before creating these. No overhead unless you need it.

💡 Need everything now?
Run `/init-context-full` for comprehensive 8-file setup.

Next Steps:
1. Review context/CLAUDE.md for accuracy
2. Run /save-context after making changes
3. Start coding!
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
- Ask: "Your architecture is getting complex. Should I create ARCHITECTURE.md to document it?"

**Check for DECISIONS.md need:**
- Made 3+ significant technical decisions this session
- Discussed tradeoffs or alternatives
- Ask: "We've made several important technical decisions. Should I create DECISIONS.md to track them?"

**Check for CODE_STYLE.md need:**
- User mentioned code quality standards multiple times
- Inconsistencies in code style observed
- Ask: "You've mentioned code quality standards. Should I create CODE_STYLE.md to formalize them?"

**Check for KNOWN_ISSUES.md need:**
- Tracking 3+ bugs or limitations
- Issues mentioned across multiple sessions
- Ask: "We're tracking several bugs. Should I create KNOWN_ISSUES.md?"

**Check for PRD.md need:**
- Product vision discussed multiple times
- Feature roadmap getting complex
- Ask: "Product scope is expanding. Should I create PRD.md to document vision and roadmap?"

## Important Notes

- Always include workflow preferences in CLAUDE.md
- CLAUDE.md must include "no lazy coding" and "simplicity first" rules
- Configuration must enforce "no push without approval"
- Documentation should be scannable in 5 minutes per file
- Use bullet points and clear headings
- Start minimal, grow naturally

## Error Handling

If errors occur:
- Report what failed clearly
- Show what was successfully created
- Provide manual recovery steps
- Never leave partial initialization

## Success Criteria

Command succeeds when:
- Core 3 files created and filled with available data
- Configuration valid
- Installation files cleaned up
- User understands progressive enhancement approach
- User can immediately run /save-context
- Clear next steps provided
