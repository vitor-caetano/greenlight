# Greenlight

A JSON API for managing movie data, built with Go and PostgreSQL.

## Prerequisites

- Go 1.25+
- PostgreSQL
- Docker (for container builds)
- Kind + kubectl (for local Kubernetes)

## Getting Started

```bash
# Run the API server locally
make run/api

# Run tests
go test -race -vet=off ./...

# Full audit (vet, staticcheck, tests)
make audit
```

## Docker

### GHCR Authentication

Create a GitHub Personal Access Token (PAT) with `read:packages` and `write:packages` scopes, then log in:

```bash
# Using Makefile (set GITHUB_USER and GITHUB_PAT env vars)
make docker/login

# Or manually
echo $GITHUB_PAT | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

### Build and Push

```bash
# Build the Docker image (tagged with git ref + latest)
make docker/build

# Push to GHCR
make docker/push
```

### Run Locally

```bash
docker run --rm -p 4000:4000 ghcr.io/vitor-caetano/greenlight:latest \
  -db-dsn="postgres://..." \
  -smtp-username="..." \
  -smtp-password="..."
```

## Kubernetes Deployment

Kubernetes manifests live in `apps/` and are automatically synced by ArgoCD.

### Manifests

| File | Description |
|------|-------------|
| `apps/namespace.yaml` | `greenlight` namespace |
| `apps/deployment.yaml` | API deployment (2 replicas, health checks, resource limits) |
| `apps/service.yaml` | ClusterIP service on port 4000 |
| `apps/configmap.yaml` | Non-sensitive configuration |
| `apps/secret.yaml` | Secrets (replace placeholder values before deploying) |
| `apps/ingress.yaml` | Ingress resource (Traefik) |

### Manual Apply

```bash
kubectl apply -f apps/
```

### Updating Secrets

Encode your real values and update `apps/secret.yaml`:

```bash
echo -n 'your-db-dsn' | base64
echo -n 'your-smtp-user' | base64
echo -n 'your-smtp-pass' | base64
```
