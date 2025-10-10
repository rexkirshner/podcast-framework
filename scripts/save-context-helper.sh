#!/bin/bash

# save-context-helper.sh
# Pre-populates session data for /save-context command
# v1.8.0 - Reduces manual typing while capturing comprehensive context

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
CONTEXT_DIR="${BASE_DIR}/context"

echo -e "${BLUE}📝 Save Context Helper (v1.8.0)${NC}"
echo ""

# =============================================================================
# Step 1: Verify context exists
# =============================================================================

if [ ! -d "$CONTEXT_DIR" ]; then
  echo -e "${YELLOW}⚠️  Context directory not found${NC}"
  echo "Run /init-context first to initialize the context system"
  exit 1
fi

if [ ! -f "$CONTEXT_DIR/SESSIONS.md" ]; then
  echo -e "${YELLOW}⚠️  SESSIONS.md not found${NC}"
  echo "Run /init-context first to initialize the context system"
  exit 1
fi

# =============================================================================
# Step 2: Auto-detect session number
# =============================================================================

echo -e "${BLUE}🔢 Detecting session number...${NC}"

LAST_SESSION=$(grep -c "^## Session" "$CONTEXT_DIR/SESSIONS.md" 2>/dev/null || echo "0")
NEXT_SESSION=$((LAST_SESSION + 1))

echo "   Next session: $NEXT_SESSION"
echo ""

# =============================================================================
# Step 3: Gather git information
# =============================================================================

echo -e "${BLUE}📊 Gathering git information...${NC}"

GIT_LOG=""
GIT_STATUS=""
GIT_DIFF=""
GIT_STAGED=""

if git rev-parse --git-dir > /dev/null 2>&1; then
  # Get recent commits
  GIT_LOG=$(git log --oneline -5 2>/dev/null || echo "No commits")

  # Get current status
  GIT_STATUS=$(git status --short 2>/dev/null || echo "No changes")

  # Get unstaged diff summary
  GIT_DIFF=$(git diff --stat 2>/dev/null || echo "No unstaged changes")

  # Get staged diff summary
  GIT_STAGED=$(git diff --cached --stat 2>/dev/null || echo "No staged changes")

  echo "   ✅ Git data collected"
else
  echo "   ⏭️  Not a git repository (skipping git data)"
fi

echo ""

# =============================================================================
# Step 4: Extract file changes
# =============================================================================

echo -e "${BLUE}📁 Analyzing file changes...${NC}"

NEW_FILES=""
MODIFIED_FILES=""
DELETED_FILES=""

if git rev-parse --git-dir > /dev/null 2>&1; then
  # Get new files (untracked or added)
  NEW_FILES=$(git status --short | grep "^??\|^A " | awk '{print $2}' | head -10 || echo "")

  # Get modified files
  MODIFIED_FILES=$(git status --short | grep "^ M\|^M " | awk '{print $2}' | head -10 || echo "")

  # Get deleted files
  DELETED_FILES=$(git status --short | grep "^ D\|^D " | awk '{print $2}' | head -10 || echo "")

  NEW_COUNT=$(echo "$NEW_FILES" | grep -c . || echo "0")
  MOD_COUNT=$(echo "$MODIFIED_FILES" | grep -c . || echo "0")
  DEL_COUNT=$(echo "$DELETED_FILES" | grep -c . || echo "0")

  echo "   New: $NEW_COUNT | Modified: $MOD_COUNT | Deleted: $DEL_COUNT"
fi

echo ""

# =============================================================================
# Step 5: Generate pre-populated template
# =============================================================================

echo -e "${BLUE}📝 Generating session template...${NC}"

TODAY=$(date +%Y-%m-%d)
SESSION_TEMPLATE="${CONTEXT_DIR}/.session-${NEXT_SESSION}-draft.md"

cat > "$SESSION_TEMPLATE" <<EOF
## Session ${NEXT_SESSION} | ${TODAY} | [PHASE NAME - UPDATE ME]

**Duration:** [X]h | **Focus:** [Brief description] | **Status:** ✅/⏳

### Changed

- ✅ [Key accomplishment 1 with context]
- ✅ [Key accomplishment 2 with context]

### Problem Solved

**Issue:** [What problem did this session address?]

**Constraints:** [What limitations existed?]

**Approach:** [How did you solve it? What was your thinking?]

**Why this approach:** [Rationale for the chosen solution]

### Decisions

- **[Decision topic]:** [What and why] → See DECISIONS.md [ID]
- [Or: No significant decisions this session]

### Files

EOF

# Add new files
if [ -n "$NEW_FILES" ] && [ "$NEW_FILES" != "" ]; then
  while IFS= read -r file; do
    if [ -n "$file" ]; then
      echo "**NEW:** \`${file}\` - [Purpose and key contents]" >> "$SESSION_TEMPLATE"
    fi
  done <<< "$NEW_FILES"
fi

# Add modified files
if [ -n "$MODIFIED_FILES" ] && [ "$MODIFIED_FILES" != "" ]; then
  while IFS= read -r file; do
    if [ -n "$file" ]; then
      echo "**MOD:** \`${file}\` - [What changed and why]" >> "$SESSION_TEMPLATE"
    fi
  done <<< "$MODIFIED_FILES"
fi

# Add deleted files
if [ -n "$DELETED_FILES" ] && [ "$DELETED_FILES" != "" ]; then
  while IFS= read -r file; do
    if [ -n "$file" ]; then
      echo "**DEL:** \`${file}\` - [Why removed]" >> "$SESSION_TEMPLATE"
    fi
  done <<< "$DELETED_FILES"
fi

# If no files changed
if [ -z "$NEW_FILES" ] && [ -z "$MODIFIED_FILES" ] && [ -z "$DELETED_FILES" ]; then
  echo "[No file changes detected - was this a planning/research session?]" >> "$SESSION_TEMPLATE"
fi

cat >> "$SESSION_TEMPLATE" <<EOF

### Mental Models

**Current understanding:** [Explain your mental model of the system]

**Key insights:**
- [Insight 1 that AI agents should know]
- [Insight 2]

**Gotchas discovered:**
- [Thing 1 that wasn't obvious]
- [Thing 2]

### Work In Progress

**Task:** [What's incomplete - be specific]

**Location:** \`file.ts:145\` in \`functionName()\`

**Current approach:** [Detailed mental model of what you're doing]

**Why this approach:** [Rationale]

**Next specific action:** [Exact next step]

**Context needed:** [What you need to remember to resume]

### TodoWrite State

**Captured from TodoWrite:**
- ✅ [Completed todo 1]
- [ ] [Incomplete todo - in WIP]

[TODO: Extract actual TodoWrite state if available]

### Next Session

**Priority:** [Most important next action]

**Blockers:** [None / List blockers with details]

EOF

echo "   ✅ Template created: ${SESSION_TEMPLATE}"
echo ""

# =============================================================================
# Step 6: Show git summary
# =============================================================================

if [ -n "$GIT_LOG" ] && [ "$GIT_LOG" != "No commits" ]; then
  echo -e "${BLUE}📜 Recent commits:${NC}"
  echo "$GIT_LOG" | head -5 | sed 's/^/   /'
  echo ""
fi

if [ -n "$GIT_STATUS" ] && [ "$GIT_STATUS" != "No changes" ]; then
  echo -e "${BLUE}📊 Git status:${NC}"
  echo "$GIT_STATUS" | sed 's/^/   /'
  echo ""
fi

# =============================================================================
# Step 7: Instructions
# =============================================================================

echo -e "${GREEN}✅ Session template ready!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "   1. Open: ${SESSION_TEMPLATE}"
echo "   2. Fill in the [BRACKETED] placeholders:"
echo "      - Phase name"
echo "      - Duration and focus"
echo "      - Problem solved (issue, constraints, approach, why)"
echo "      - Mental models (current understanding, insights, gotchas)"
echo "      - Work in progress (if any)"
echo "      - Next session priorities"
echo "   3. Review file changes and add context"
echo "   4. Add entry to SESSIONS.md when ready"
echo "   5. Update STATUS.md with current state"
echo "   6. Clean up draft: rm ${SESSION_TEMPLATE}"
echo ""
echo -e "${YELLOW}💡 Tip:${NC} The template has git data pre-populated."
echo "   Focus on the WHY (mental models, rationale) - that's what AI agents need!"
echo ""

# =============================================================================
# Optional: Open in editor
# =============================================================================

read -p "Open template in editor now? [y/N] " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  if [ -n "$EDITOR" ]; then
    $EDITOR "$SESSION_TEMPLATE"
  elif command -v code &> /dev/null; then
    code "$SESSION_TEMPLATE"
  elif command -v vim &> /dev/null; then
    vim "$SESSION_TEMPLATE"
  elif command -v nano &> /dev/null; then
    nano "$SESSION_TEMPLATE"
  else
    echo "No editor found. Please open manually: ${SESSION_TEMPLATE}"
  fi
fi

exit 0
