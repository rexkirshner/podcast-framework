---
name: update-context-system
description: Update Claude Context System to latest version from GitHub
---

# /update-context-system Command

Update your project's Claude Context System to the latest version from GitHub using the automated installer script.

## When to Use This Command

- Periodically (monthly) to get latest improvements
- When new features or bug fixes are released
- Before initializing new projects (get latest templates)

**Run periodically** to stay up to date with improvements.

## What This Command Does

1. Downloads latest installer from GitHub
2. Checks if update is needed (compares versions)
3. Backs up existing installation
4. Updates all slash commands (`.claude/commands/*.md`)
5. Updates scripts (validation, helpers)
6. Updates templates for reference
7. Updates configuration schemas
8. Reports everything that changed

## Important: How to Execute This Command

**CRITICAL:** You MUST use the Bash tool to execute all commands in this file. Do NOT describe the commands to the user - EXECUTE them.

Each bash code block in this file should be run using the Bash tool. This is an automated update process.

**CRITICAL WORKING DIRECTORY RULE:**
- User will run this command FROM the project directory
- Do NOT try to cd into the project directory yourself
- All paths in commands are relative to project root
- If Step 0 fails, tell user to cd to correct directory
- Do NOT attempt complex path escaping with spaces
- Trust that user's current directory is correct when they run the command

## Important: Version Check First

**CRITICAL:** This command compares version numbers. If local version matches GitHub version, the command MUST exit immediately without making ANY changes. Only proceed with updates if GitHub version is newer.

## Execution Steps

### Step 0: Verify Working Directory

**CRITICAL:** Ensure we're in the correct project directory before proceeding.

```bash
# Check if context/.context-config.json exists
if [ ! -f "context/.context-config.json" ]; then
  echo ""
  echo "❌ ERROR: Not in correct project directory"
  echo ""
  echo "Current directory: $(pwd)"
  echo ""
  echo "This command must be run from the project root directory that contains:"
  echo "  - context/.context-config.json"
  echo "  - .claude/commands/"
  echo ""
  echo "Common issues:"
  echo "  1. Running from parent folder instead of project folder"
  echo "  2. Running from nested subdirectory"
  echo ""

  # Try to detect if we're in a parent folder
  if [ -d "inevitable-eth/context" ] || [ -d "*/context" ]; then
    echo "💡 Detected project in subdirectory!"
    echo ""
    echo "Try:"
    echo "  cd inevitable-eth  (or whatever your project folder is)"
    echo "  /update-context-system"
  fi

  echo ""
  echo "Cancelled. Please cd to the project directory and try again."
  exit 1
fi

echo "✅ Working directory verified"
echo "Project: $(pwd)"
echo ""
```

### Step 1: Check Current Version

**ACTION:** Use the Bash tool to check the current version:

```bash
CURRENT_VERSION=$(grep -m 1 '"version":' context/.context-config.json | cut -d'"' -f4 2>/dev/null || echo "unknown")
echo "📦 Current version: $CURRENT_VERSION"
echo "🔍 Checking for updates from GitHub..."
```

### Step 2: Run Installer Script

**ACTION:** Use the Bash tool to download and run the installer:

```bash
# Download the latest installer
curl -sL https://raw.githubusercontent.com/rexkirshner/claude-context-system/main/install.sh -o /tmp/claude-context-install.sh

# Make it executable
chmod +x /tmp/claude-context-install.sh

# Run the installer (it handles version checking and backups)
/tmp/claude-context-install.sh

# Clean up
rm -f /tmp/claude-context-install.sh
```

The installer will:
- Check if you already have the latest version (and exit if you do)
- Back up your existing installation
- Download all latest files
- Update commands, templates, scripts, and configuration
- Verify the installation
- Report what was updated

**After the installer completes:**
- Review the output to see what was updated
- Installer will show version change (if any)
- Installer will list all updated files

### Step 3: Check Version and Migration Path

**ACTION:** Check current version to determine if migration is needed:

```bash
echo ""
CURRENT_VERSION=$(grep -m 1 '"version":' context/.context-config.json | cut -d'"' -f4 2>/dev/null || echo "unknown")

echo "📦 Current version: $CURRENT_VERSION"
echo ""

if [[ "$CURRENT_VERSION" == "2.0.0" ]]; then
  echo "🔄 Migration to v2.1.0 available!"
  echo ""
  echo "⚠️  v2.1.0 includes file consolidation:"
  echo "   - QUICK_REF.md merged into STATUS.md (auto-generated section)"
  echo "   - Creates claude.md AI header"
  echo "   - Reduces file count: 6 → 5 files"
  echo "   - Adds automated staleness detection"
  echo ""
  echo "Migration time: 10-15 minutes"
  echo "Difficulty: Easy (mostly automatic)"
  echo ""
  echo "📖 Full migration guide:"
  echo "  https://github.com/rexkirshner/claude-context-system/blob/main/MIGRATION_GUIDE_v2.0_to_v2.1.md"
  echo ""
  echo "Quick migration (copy-paste to terminal):"
  echo "  curl -sL https://raw.githubusercontent.com/rexkirshner/claude-context-system/main/MIGRATION_GUIDE_v2.0_to_v2.1.md | grep -A 100 'Run in terminal:' | bash"
  echo ""
elif [[ "$CURRENT_VERSION" == "1.9.0" ]]; then
  echo "🔄 Migration to v2.0.0 available!"
  echo ""
  echo "⚠️  v2.0.0 includes major file structure changes:"
  echo "   - CLAUDE.md → CONTEXT.md"
  echo "   - Creates STATUS.md (single source of truth)"
  echo "   - Creates DECISIONS.md, SESSIONS.md (structured)"
  echo "   - Auto-generates Quick Reference"
  echo ""
  echo "Migration options:"
  echo "  1. MANUAL: Follow MIGRATION_GUIDE.md (recommended)"
  echo "  2. AUTOMATED: Use migration script (backup first)"
  echo ""
  echo "For manual migration, see:"
  echo "  https://github.com/rexkirshner/claude-context-system/blob/main/MIGRATION_GUIDE.md"
  echo ""
elif [[ "$CURRENT_VERSION" < "1.9.0" ]]; then
  echo "🔄 Multi-step migration required..."
  echo ""
  echo "Your version: $CURRENT_VERSION"
  echo "Latest version: 2.1.0"
  echo ""
  echo "Migration path:"
  echo "  1. Upgrade to v1.9.0 first"
  echo "  2. Then upgrade to v2.0.0"
  echo "  3. Finally upgrade to v2.1.0"
  echo ""
  echo "Start with:"
  echo "  https://github.com/rexkirshner/claude-context-system/releases"
  echo ""
else
  echo "✅ Already on latest version structure"
fi
```

**About v2.0.0 Migration:**

Automated migration with dry-run, backup, and rollback is planned for v2.1. For now, v2.0.0 migration is manual:

1. Read [MIGRATION_GUIDE.md](https://github.com/rexkirshner/claude-context-system/blob/main/MIGRATION_GUIDE.md)
2. Backup your `context/` folder
3. Follow the step-by-step migration process
4. Verify with `/validate-context`

**Why manual for now?**
- v2.0.0 focuses on getting the new structure right
- Automated migration requires extensive testing (10+ real projects)
- Manual migration ensures you understand changes
- v2.1 will add full automation with safety features

### Step 4: Review Template Updates (Optional)

After the installer completes, you may want to review if any template files have significant updates that should be applied to your context files.

**ACTION:** Check for template changes:

```bash
echo ""
echo "📋 Reviewing template updates..."
echo ""

# Compare templates with your context files (if they exist)
if [ -f "context/CONTEXT.md" ] && [ -f "templates/CONTEXT.template.md" ]; then
  echo "ℹ️  CONTEXT.md template available in templates/"
  echo "   Review templates/CONTEXT.template.md for new sections you might want to add"
fi

if [ -f "context/STATUS.md" ] && [ -f "templates/STATUS.template.md" ]; then
  echo "ℹ️  STATUS.md template available in templates/"
  echo "   Review templates/STATUS.template.md for structural improvements"
fi

if [ -f "context/DECISIONS.md" ] && [ -f "templates/DECISIONS.template.md" ]; then
  echo "ℹ️  DECISIONS.md template available in templates/"
  echo "   Review templates/DECISIONS.template.md for new guidelines"
fi

echo ""
echo "💡 Tip: Compare templates with your context files manually to identify"
echo "   useful additions. Your project-specific content remains untouched."
```

Templates are reference files - you choose what to adopt.

### Step 5: Generate Update Report

Provide a clear summary to the user:

```
✅ Claude Context System Updated

## Version
[OLD_VERSION] → [NEW_VERSION]

## What Was Updated

**System Files:**
- Slash commands (.claude/commands/) - v2.0.0 command prompts
- Helper scripts (scripts/) - v1.9.0 automation (v2.0 migration in v2.1)
- Templates (templates/) - v2.0.0 file structure
- Configuration schemas (config/) - v2.0.0 schema

**Your Project Files:**
- Version number in context/.context-config.json
- No changes to your context documentation (CONTEXT.md, STATUS.md, etc.)

## Template Updates Available

Review templates/ directory for new reference content you may want to adopt:
- templates/CONTEXT.template.md
- templates/STATUS.template.md (includes Quick Reference section at top in v2.1)
- templates/DECISIONS.template.md
- templates/SESSIONS.template.md
- templates/CODE_MAP.template.md (optional)

## Next Steps

1. Review template files if desired
2. Run /save-context to document this update
3. Continue working with latest system!

---

📚 Full changelog: https://github.com/rexkirshner/claude-context-system/releases
```

## Important Notes

### What Gets Updated

- ✅ All slash commands (always)
- ✅ Scripts and templates (reference files)
- ✅ Configuration schemas
- ✅ Version number in config
- ❌ Never: Your context documentation (you choose what to update)
- ❌ Never: Project-specific content

### Safety

- Installer creates backups before updating
- Your context files (CONTEXT.md, STATUS.md, etc.) are never touched
- Templates are references - you decide what to adopt
- Can restore from backup if needed: `.claude-backup-[timestamp]/`

### Version Management

- Version stored in `context/.context-config.json`
- Format: `major.minor.patch` (e.g., "1.8.0")
- Check GitHub releases for changelog

## Error Handling

**If GitHub is unreachable:**
```
❌ Cannot reach GitHub
- Check internet connection
- Try again later
- Manual update: download from https://github.com/rexkirshner/claude-context-system
```

**If installer fails:**
```
❌ Installation failed
- Check error output above
- Your original files are backed up in .claude-backup-[timestamp]/
- Restore if needed: cp -r .claude-backup-*/.claude .
```

## Success Criteria

Update succeeds when:
- Installer completes without errors
- All files verified
- Version number updated in config
- Update report generated
- User informed of changes

**Perfect update:**
- System files auto-updated
- Project content untouched
- Clear report of what changed
- Ready to continue work immediately
