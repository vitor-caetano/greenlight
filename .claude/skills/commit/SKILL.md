---
name: commit
description: Create a git commit from current changes with proper analysis and safety checks
disable-model-invocation: true
---

# Commit Skill

Create a git commit following this comprehensive workflow:

## Phase 1: Analysis

Run these commands in parallel to understand the current state:
- `git status` - See all changed and untracked files
- `git diff` - See actual code changes (both staged and unstaged)
- `git log --oneline -5` - See recent commit message style

## Phase 2: Safety Checks

**CRITICAL - Check for sensitive files:**
- `.env`, `.env.local`, `.env.production`
- Any files with "secret", "password", "key", "token" in the name
- `.mcp.json`, `credentials.json`, config files with API keys
- Private keys (`.pem`, `.key`, `.p12`)

**If sensitive files are detected:**
- STOP and warn the user
- Recommend adding them to `.gitignore`
- Do NOT commit them

## Phase 3: Stage Files

**Prefer specific file staging** rather than `git add -A` or `git add .`:
```bash
git add file1.go file2.go file3.go
```

Only stage files that should be committed, excluding:
- Sensitive/credential files
- Build artifacts
- Temporary files
- IDE-specific configs (unless intentionally shared)

## Phase 4: Draft Commit Message

Create a commit message that:
1. **Subject line** (50-70 chars):
   - Uses imperative mood: "Add feature" not "Added feature"
   - Is specific and clear
   - Follows the repo's style (check recent commits)

2. **Body** (optional, wrap at 72 chars):
   - Explains WHY the change was made
   - Provides context if needed
   - References issues if applicable

3. **Always ends with**:
   ```
   Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
   ```

## Phase 5: Create Commit

Use heredoc format for proper message formatting:
```bash
git commit -m "$(cat <<'EOF'
Subject line here

Optional body explaining why this change was made.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

## Phase 6: Verify

Run `git status` to confirm commit was created successfully.

## Phase 7: Push (if requested)

If the user wants to push:
```bash
git push origin <branch-name>
```

**ONLY push if explicitly requested** - don't assume.

## Output Summary

Provide a clear summary:
- ✅ Files committed: [list]
- 📝 Commit SHA: [sha]
- 💬 Message: [first line]
- 🚀 Pushed: [yes/no]
- ⚠️  Excluded files: [list any excluded files]
