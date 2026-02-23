# Shape: `-no-middleware` Flag

## Problem

When running behind an API Gateway (Kong, AWS API GW, etc.), the gateway handles:
- Authentication
- Rate limiting
- CORS

The Go app's own middleware duplicates this work and can cause conflicts.

## Solution

Add a `-no-middleware` boolean flag. When set:
- Middleware chain reduced to `recoverPanic` only (safety net kept)
- `requirePermission` wrappers bypassed — all routes open
- metrics, CORS, rate limiting, and authentication removed

## Design Decisions

- `recoverPanic` is always kept as a safety net regardless of mode
- The `perm` helper pattern keeps route registration DRY
- Default is `false` — existing behaviour unchanged
- Flag name uses `=` syntax: `-no-middleware=true` (avoids flag.Parse stopping early on boolean flags)

## Config Flag

```go
flag.BoolVar(&cfg.noMiddleware, "no-middleware", false, "Disable middleware stack (for use behind an API Gateway)")
```

## Middleware Chains

**Normal mode:**
```
metrics → recoverPanic → enableCORS → rateLimit → authenticate → router
```

**Gateway mode (`-no-middleware=true`):**
```
recoverPanic → router
```
