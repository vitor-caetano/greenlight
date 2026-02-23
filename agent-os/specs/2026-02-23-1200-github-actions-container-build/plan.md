# GitHub Actions CI Workflow — Container Build & Push

## Context

The Greenlight roadmap has one remaining Phase 1 item: a GitHub Actions workflow to automatically build and push both the backend (Go API) and UI (React/Nginx) Docker images to GitHub Container Registry (ghcr.io) on every push to `main`. Currently this is done manually via `make docker/build && make docker/push`.

The workflow also gates on tests passing — running `go test -race` and `go vet` before building images.

---

## Task 1: Save Spec Documentation

Create `agent-os/specs/2026-02-23-1200-github-actions-container-build/` with:
- `plan.md` — this full plan
- `shape.md` — shaping notes
- `references.md` — existing Dockerfiles and Makefile patterns

---

## Task 2: Create GitHub Actions CI Workflow

Create `.github/workflows/ci.yml`.

### Trigger
```yaml
on:
  push:
    branches: [main]
```

### Jobs

**Job 1: `test`** (ubuntu-latest)
- Checkout repo
- Setup Go (use version from `go.mod`)
- Run `go vet ./...`
- Run `go test -race -vet=off ./...`

**Job 2: `build-and-push`** (ubuntu-latest, needs: test)
- Checkout repo
- Login to GHCR using `docker/login-action@v3` with `GITHUB_TOKEN` (no extra secrets needed)
- Set up Docker Buildx (`docker/setup-buildx-action@v3`)
- Extract metadata for tags: `latest` + short SHA (`${{ github.sha }}` truncated to 7 chars)
- Build and push **backend** image:
  - Context: `.` (repo root)
  - Dockerfile: `./Dockerfile`
  - Tags:
    - `ghcr.io/vitor-caetano/greenlight:latest`
    - `ghcr.io/vitor-caetano/greenlight:${{ github.sha[:7] }}`
- Build and push **UI** image:
  - Context: `./ui`
  - Dockerfile: `./ui/Dockerfile`
  - Tags:
    - `ghcr.io/vitor-caetano/greenlight-ui:latest`
    - `ghcr.io/vitor-caetano/greenlight-ui:${{ github.sha[:7] }}`

### Permissions (at workflow level)
```yaml
permissions:
  contents: read
  packages: write  # required to push to GHCR
```

### Key implementation notes
- Use `docker/metadata-action@v5` to generate tags cleanly
- Short SHA via `${{ github.sha }}` — use `github.sha` and slice in metadata action with `type=sha,format=short`
- The UI build context must be `ui/` (matches `CLAUDE.md` instruction and current Makefile)
- `GITHUB_TOKEN` is auto-provisioned; no extra secrets needed for GHCR push

---

## Critical Files

| File | Action |
|------|--------|
| `.github/workflows/ci.yml` | **Create** (new workflow) |
| `Dockerfile` | Read-only reference (backend build) |
| `ui/Dockerfile` | Read-only reference (UI build) |
| `Makefile` | Read-only reference (image names, registry vars) |
| `agent-os/product/roadmap.md` | Update `[ ]` → `[x]` for this feature |

---

## Verification

1. Push a commit to `main` and confirm the Actions tab shows the workflow running
2. Verify `test` job passes before `build-and-push` starts
3. Check `ghcr.io/vitor-caetano/greenlight` in GitHub Packages — should have `latest` and `<sha>` tags
4. Check `ghcr.io/vitor-caetano/greenlight-ui` — same tags
5. Confirm existing Kubernetes pods can pull the new `:latest` image
