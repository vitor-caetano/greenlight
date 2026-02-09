---
skill: sync
description: Safely sync current branch with remote tracking branch
---

# Sync Skill

Sync the current branch with its remote tracking branch.

## Phase 1: Safety Checks

Check current state:
```bash
git status                    # Any uncommitted changes?
git log --oneline -5         # Recent local commits
git fetch origin             # Get latest remote state
git log HEAD..@{u} --oneline # Commits on remote but not local
```

**If there are uncommitted changes:**
- Warn the user
- Ask if they want to:
  1. Stash changes first
  2. Commit changes first
  3. Discard changes (DANGEROUS - confirm explicitly)
  4. Abort sync

## Phase 2: Show What Will Be Pulled

Display:
- Number of commits to pull
- Summary of those commits
- Any potential conflicts (if detectable)

## Phase 3: Sync

**Default method (merge):**
```bash
git pull origin <current-branch>
```

**If --rebase flag is used:**
```bash
git pull --rebase origin <current-branch>
```

## Phase 4: Handle Conflicts

**If conflicts occur:**
1. Show conflicted files:
   ```bash
   git status
   ```

2. Provide guidance:
   ```
   ⚠️  Conflicts detected in:
   - file1.go
   - file2.go

   Next steps:
   1. Resolve conflicts in each file
   2. Stage resolved files: git add <file>
   3. Continue: git merge --continue (or git rebase --continue if rebasing)
   ```

3. **DO NOT automatically resolve conflicts** - let the user handle them

## Phase 5: Summary

Show result:
- ✅ Synced successfully
- 📥 Pulled: [N commits]
- 📝 Latest commit: [commit message]
- ⚠️  Conflicts: [if any, list files]

## Usage Examples

```bash
/sync              # Pull with merge
/sync --rebase     # Pull with rebase (cleaner history)
```
