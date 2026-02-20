# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Greenlight is a JSON API for managing movie data, built with Go and PostgreSQL. It features user authentication with token-based auth, role-based permissions, rate limiting, CORS support, and email notifications via SMTP.

## Development Commands

### Running the Application

```bash
# Run the API server (uses .envrc for DB connection)
make run/api

# Run with custom flags
go run ./cmd/api -db-dsn="<dsn>" -port=4000 -env=development
```

### Running the UI (Local Development)

Requires the API already running. In a separate terminal:

    cd ui
    pnpm install   # first time only
    pnpm dev       # http://localhost:5173

Vite proxies all `/v1` requests to `http://localhost:4000` (configured in `vite.config.ts`).

**Building the UI image** (for Kubernetes):

    docker build -t ghcr.io/vitor-caetano/greenlight-ui:latest -f ui/Dockerfile ui/
    docker push ghcr.io/vitor-caetano/greenlight-ui:latest

Note: build context is `ui/` — it is excluded from the root `.dockerignore`.

### Database Operations

```bash
# Connect to PostgreSQL database
make db/psql

# Create a new migration
make db/migrations/new name=<migration_name>

# Apply all migrations (requires confirmation)
make db/migrations/up
```

### Code Quality

```bash
# Format code, tidy dependencies, and vendor modules
make tidy

# Run full audit: verify deps, vet, staticcheck, and tests with race detector
make audit

# Individual checks
go vet ./...
go tool staticcheck ./...
go test -race -vet=off ./...
```

### Building

```bash
# Build for local and Linux AMD64
make build/api
```

## Architecture

### Project Structure

- `cmd/api/` - HTTP server and handlers
- `internal/data/` - Data models (movies, users, tokens, permissions)
- `internal/mailer/` - Email sending functionality
- `internal/validator/` - Request validation utilities
- `internal/vcs/` - Version control info
- `migrations/` - Database migration files

### HTTP Request Flow

Requests pass through middleware chain (defined in `routes.go:34`):
1. `metrics` - Request/response metrics tracking
2. `recoverPanic` - Panic recovery
3. `enableCORS` - CORS header handling
4. `rateLimit` - IP-based rate limiting with token bucket
5. `authenticate` - Bearer token authentication
6. Route handlers with `requirePermission` wrapper for authorization

### Data Layer

All models follow the same pattern:
- `Models` struct in `internal/data/models.go` aggregates all model types
- Each model (MovieModel, UserModel, etc.) has a `DB *sql.DB` field
- Database errors use custom error types: `ErrRecordNotFound`, `ErrEditConflict`
- `NewModels(db)` factory function initializes all models

### Authentication & Authorization

- Token-based authentication via `Authorization: Bearer <token>` header
- `authenticate` middleware extracts token and loads user into request context
- `requireAuthenticatedUser` ensures user is not anonymous
- `requireActivatedUser` ensures user account is activated
- `requirePermission(code, handler)` checks specific permission (e.g., "movies:read", "movies:write")
- Permissions stored in DB and checked per-request

### Configuration

- Environment variables sourced from `.envrc` (use with direnv)
- Command-line flags override defaults (see `cmd/api/main.go:65-87`)
- Critical flags: `-db-dsn`, `-port`, `-env`, `-limiter-*`, `-smtp-*`, `-cors-trusted-origins`

### Helper Utilities

Key helpers in `cmd/api/helpers.go`:
- `readJSON()` - Strict JSON parsing with 1MB limit, unknown fields rejected
- `writeJSON()` - Indented JSON response with envelope pattern
- `readIDParam()` - Extract and validate URL path ID parameter
- `background()` - Execute function in goroutine with panic recovery and waitgroup tracking

### Email System

Email templates in `internal/mailer/templates/`:
- `user_welcome.tmpl` - Welcome email
- `token_activation.tmpl` - Account activation token
- `token_password_reset.tmpl` - Password reset token

SMTP configuration via command-line flags or environment.

### Migrations

Migration files use sequential numbering: `000001_*.sql`, `000002_*.sql`, etc.

Database schema includes:
- movies table with check constraints and indexes
- users table with bcrypt password hashes
- tokens table for authentication, activation, and password reset tokens
- permissions and user_permissions tables for RBAC

### Rate Limiting

Per-IP rate limiting using token bucket algorithm (via `golang.org/x/time/rate`).
- In-memory client map with automatic cleanup of inactive IPs (3-minute timeout)
- Configurable RPS and burst via flags
- Real IP detection via X-Forwarded-For headers

### Versioning

Version info embedded at build time via `internal/vcs/vcs.go`.
- Exposed via `-version` flag
- Published to `/debug/vars` endpoint via expvar

### Testing

Run tests with race detector enabled:
```bash
go test -race -vet=off ./...
```

### Deployment

Production deployment via `make production/deploy/api`:
- Builds Linux AMD64 binary
- Copies binary, migrations, systemd service, and Caddyfile to production server
- Runs migrations and restarts services
