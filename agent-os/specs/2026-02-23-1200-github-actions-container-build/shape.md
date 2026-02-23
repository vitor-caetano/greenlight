# Shape Notes — GitHub Actions CI Workflow

## Problem

Images are currently built and pushed manually via `make docker/build && make docker/push`. This requires developer intervention on every merge to `main` and makes it easy to forget or skip.

## Appetite

Small — a single YAML file. No new dependencies, no code changes.

## Solution

A GitHub Actions workflow file at `.github/workflows/ci.yml` that:
1. Runs Go tests (`go vet`, `go test -race`) as a gate
2. On test success, builds and pushes both images to GHCR using the built-in `GITHUB_TOKEN`

## Rabbit Holes to Avoid

- **Do not** add secrets for GHCR — `GITHUB_TOKEN` with `packages: write` is sufficient
- **Do not** cache Docker layers unless build times become a problem (premature optimization)
- **Do not** trigger on PRs for image pushes — only `main` branch merges should produce registry images
- **Do not** run tests inside Docker — use the native Go toolchain in the runner

## Out of Scope

- Deployment (ArgoCD handles that via GitOps)
- Vulnerability scanning (can be added later)
- Multi-arch builds (single `linux/amd64` is fine for now)
