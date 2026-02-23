# References

## Files Modified
- `cmd/api/main.go` — config struct + flag registration
- `cmd/api/routes.go` — middleware chain + handler registration

## Related Code
- `cmd/api/middleware.go` — middleware implementations
- `cmd/api/routes.go:34` — original full middleware chain

## Related MVP Roadmap Item
> "Need to have alternate clean (without middleware) routes that will enable the app to be used from an external API Gateway tool"
