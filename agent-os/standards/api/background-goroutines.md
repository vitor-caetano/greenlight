# Background Goroutines

Never use raw `go func()`. Always use `app.background()` for async work:

```go
app.background(func() {
    err := app.mailer.Send(user.Email, "user_welcome.tmpl", data)
    if err != nil {
        app.logger.Error(err.Error())
    }
})
```

`app.background()` provides:
1. **Panic recovery** — panics are caught and logged; the server does not crash
2. **Graceful shutdown** — uses `app.wg` (sync.WaitGroup) so the server waits for all background tasks before exiting

- Current use: sending welcome and activation emails after user registration/token creation
- Do not use for long-running background services — only for short request-scoped async tasks
