# Standards

## `api/input-structs` — Anonymous Input Struct in Handler

Handler declares an anonymous struct for JSON input directly in the function body. No shared input types.

```go
func (app *application) registerOrgHandler(w http.ResponseWriter, r *http.Request) {
    var input struct {
        OrganizationName string `json:"organization_name"`
        Name             string `json:"name"`
        Email            string `json:"email"`
        Password         string `json:"password"`
    }

    err := app.readJSON(w, r, &input)
    // ...
}
```

## `api/validation` — Validation Functions in `internal/data/`

Each model has a standalone `Validate*` function that takes a `*validator.Validator` and the model pointer. Called in the handler after populating the model.

```go
// internal/data/organizations.go
func ValidateOrganization(v *validator.Validator, org *Organization) {
    v.Check(org.Name != "", "organization_name", "must be provided")
    v.Check(len(org.Name) <= 500, "organization_name", "must not be more than 500 bytes long")
}

// internal/data/portal_users.go
func ValidatePortalUser(v *validator.Validator, user *PortalUser) {
    v.Check(user.Name != "", "name", "must be provided")
    v.Check(len(user.Name) <= 500, "name", "must not be more than 500 bytes long")
    ValidateEmail(v, user.Email)
    ValidatePasswordPlaintext(v, *user.Password.plaintext)
}
```

## `api/error-responses` — Standard Error Helpers

Handlers use the application's error response helpers for consistent error formatting:

- `app.badRequestResponse(w, r, err)` — 400, malformed JSON or blocked domain
- `app.failedValidationResponse(w, r, v.Errors)` — 422, validation failures
- `app.serverErrorResponse(w, r, err)` — 500, unexpected errors (DB failures, etc.)

Duplicate email maps to `failedValidationResponse` with `"email": "a user with this email address already exists in this organization"`.

## `api/response-envelope` — Envelope Pattern

All JSON responses use the `envelope` type wrapping data under named keys:

```go
err = app.writeJSON(w, http.StatusCreated, envelope{
    "organization": org,
    "user":         user,
}, nil)
```

Response shape:
```json
{
  "organization": { ... },
  "user": { ... }
}
```
