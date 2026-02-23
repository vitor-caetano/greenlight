# Plan: `-no-middleware` Flag for API Gateway Mode

## Context

Greenlight needs to support operation behind an external API Gateway (e.g. Kong, AWS API GW) that handles rate limiting, authentication, and CORS externally. When running in this mode, the Go app should serve clean routes without its own middleware stack, trusting the gateway to handle those concerns.

## Tasks

### Task 1: Add `noMiddleware` config flag
- Add `noMiddleware bool` to `config` struct in `cmd/api/main.go`
- Register `-no-middleware` CLI flag

### Task 2: Update `routes()` to conditionally skip middleware
- Add `perm` local helper that bypasses `requirePermission` when no-middleware mode is active
- Conditional return: bare `recoverPanic(router)` vs full middleware chain

## Verification

```bash
# Normal mode
go run ./cmd/api -db-dsn="..." -port=4000

# Gateway mode
go run ./cmd/api -db-dsn="..." -port=4000 -no-middleware=true

# Confirm clean routes work without auth token
curl localhost:4000/v1/movies         # 200 (no 401)
curl localhost:4000/v1/healthcheck    # 200

# Confirm normal mode still requires auth
curl localhost:4000/v1/movies         # 401 without token

make audit
```
