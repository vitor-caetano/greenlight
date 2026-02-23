# Handler Input Structs

Each handler defines its own local anonymous struct for JSON request parsing. Never use model types (e.g. `data.Movie`) as the decode target.

```go
func (app *application) createMovieHandler(w http.ResponseWriter, r *http.Request) {
    var input struct {
        Title   string       `json:"title"`
        Year    int32        `json:"year"`
        Runtime data.Runtime `json:"runtime"`
        Genres  []string     `json:"genres"`
    }
    err := app.readJSON(w, r, &input)
    ...
    movie := &data.Movie{
        Title:   input.Title,
        ...
    }
}
```

- Input struct only contains fields the client is allowed to provide
- Internal fields (`ID`, `Version`, `CreatedAt`) are never in the input struct
- After parsing, manually copy input fields onto the model struct
- For PATCH: use pointer types (`*string`, `*int32`) for optional fields; `nil` means "not provided"
