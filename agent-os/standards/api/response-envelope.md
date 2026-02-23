# JSON Response Envelope

All API responses wrap data in a named key using the `envelope` type:

```go
type envelope map[string]any
```

**Success:**
```json
{ "movie": { "id": 1, "title": "..." } }
{ "movies": [...], "metadata": { "total_records": 20 } }
```

**Error:**
```json
{ "error": "the requested resource could not be found" }
```

- Key name matches the resource type (`movie`, `movies`, `token`, `user`)
- Never return raw JSON without an envelope key
- Multiple top-level keys are allowed (e.g. `movies` + `metadata`)
- Use `writeJSON(w, status, envelope{"key": data}, headers)` — never `json.Encode` directly
