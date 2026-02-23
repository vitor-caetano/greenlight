# Error Responses

Never write error JSON inline. Always use the named error methods on `*application`:

| Method | Status | When to use |
|---|---|---|
| `serverErrorResponse` | 500 | Unexpected errors (also logs the error) |
| `notFoundResponse` | 404 | Resource not found |
| `badRequestResponse` | 400 | Malformed request / JSON parse errors |
| `failedValidationResponse` | 422 | Business rule validation failures |
| `editConflictResponse` | 409 | Optimistic lock conflict (retry) |
| `rateLimitExceededResponse` | 429 | Rate limit hit |
| `invalidCredentialsResponse` | 401 | Wrong username/password |
| `invalidAuthenticationTokenResponse` | 401 | Missing/invalid Bearer token |
| `authenticationRequiredResponse` | 401 | Unauthenticated access to protected route |
| `inactiveAccountResponse` | 403 | Account not yet activated |
| `notPermittedResponse` | 403 | Insufficient permissions |

- Only `serverErrorResponse` logs the error server-side
- All methods call `errorResponse` which calls `writeJSON` — never call `w.WriteHeader` for errors manually
- Always `return` immediately after calling an error method in a handler
