---
name: pr
description: Create a pull request from the current branch with comprehensive analysis
disable-model-invocation: true
---

# Pull Request Skill

Create a pull request following this workflow:

## Phase 1: Understand Current State

Run these in parallel:
```bash
git status                           # Current branch and state
git remote -v                        # Verify remote
git log main..HEAD --oneline        # All commits in this branch
git diff main...HEAD                # All changes from base branch
```

Check if branch is pushed to remote and up-to-date.

## Phase 2: Analyze ALL Commits

**IMPORTANT**: Review ALL commits that will be included in the PR, not just the latest one!

For each commit, understand:
- What was changed
- Why it was changed
- How it fits into the overall feature/fix

Look at the complete diff from when the branch diverged from main.

## Phase 3: Search for PR Template

Check if repository has a PR template:
```bash
# Look for template files
find . -name "pull_request_template.md" -o -path "*/.github/PULL_REQUEST_TEMPLATE*"
```

If template exists, use it to structure the PR description.

## Phase 4: Draft PR Title & Description

**Title** (under 70 characters):
- Clear and descriptive
- Matches the overall purpose of all commits
- Uses imperative mood

**Description format**:
```markdown
## Summary
- [Key change 1]
- [Key change 2]
- [Key change 3]

## Changes
- Added: [new features/files]
- Modified: [updated functionality]
- Fixed: [bug fixes]

## Test Plan
- [ ] [How to test this PR]
- [ ] [Verification steps]

## Notes
[Any important context, decisions, or follow-up items]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

## Phase 5: Push Branch (if needed)

If branch isn't pushed or is behind:
```bash
git push -u origin <branch-name>
```

## Phase 6: Create PR

Use `gh` CLI with heredoc for clean formatting:
```bash
gh pr create --title "PR title here" --body "$(cat <<'EOF'
## Summary
...

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Options to support:
- `--draft` - Create as draft PR
- `--base <branch>` - Target branch (default: main)

## Phase 7: Return PR URL

Show the user:
- ✅ PR created
- 🔗 URL: [link]
- 📊 Stats: [commits count], [files changed]
- 🎯 Base: [target branch]
