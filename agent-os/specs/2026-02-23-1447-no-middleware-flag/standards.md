# Standards

## Go Conventions
- Boolean config flags use `flag.BoolVar` with explicit default
- Middleware is composed functionally (each wraps the next)
- Config struct fields use camelCase

## Security
- `recoverPanic` is always applied — never removed, even in gateway mode
- Gateway mode is opt-in (default false) to prevent accidental exposure
- Document clearly that gateway mode disables authentication

## Naming
- Flag: `-no-middleware` (kebab-case, consistent with other flags)
- Struct field: `noMiddleware` (camelCase)
