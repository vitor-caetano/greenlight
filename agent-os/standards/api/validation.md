# Validation Pattern

Validation logic lives in `internal/data/` alongside the model. Handlers never implement validation rules inline.

**In the handler:**
```go
v := validator.New()

if data.ValidateMovie(v, movie); !v.Valid() {
    app.failedValidationResponse(w, r, v.Errors)
    return
}
```

**In internal/data/movies.go:**
```go
func ValidateMovie(v *validator.Validator, movie *Movie) {
    v.Check(movie.Title != "", "title", "must be provided")
    v.Check(len(movie.Title) <= 500, "title", "must not be more than 500 bytes long")
    v.Check(movie.Year >= 1888, "year", "must be greater than 1888")
    ...
}
```

- Always create a fresh `validator.New()` per request
- Validation errors return 422 Unprocessable Entity via `failedValidationResponse`
- `v.Errors` is `map[string]string` — field name → error message
- Query param validation also uses the validator (e.g. `ValidateFilters`)
