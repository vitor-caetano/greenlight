# References

## Files Created
- `cmd/api/auth.go` — registration handler (`registerOrgHandler`) and `extractEmailDomain` helper
- `internal/data/organizations.go` — Organization model, OrganizationModel, ValidateOrganization
- `internal/data/portal_users.go` — PortalUser model, PortalUserModel, ValidatePortalUser, ErrDuplicateOrgEmail
- `internal/data/registration.go` — `RegisterOrgAndLead` atomic transaction function
- `internal/data/blocked_domains.go` — BlockedDomainModel with `Exists` method

## Files Modified
- `internal/data/models.go` — added Organizations, BlockedDomains, PortalUsers to Models struct and NewModels
- `cmd/api/routes.go` — added `POST /v1/auth/register` route

## Migrations
- `migrations/000007_create_organizations_table.up.sql` / `.down.sql`
- `migrations/000008_create_blocked_email_domains.up.sql` / `.down.sql`
- `migrations/000009_create_portal_users_table.up.sql` / `.down.sql`

## Related Code
- `cmd/api/users.go` — existing user registration pattern (similar handler structure)
- `internal/data/users.go` — existing UserModel with password hashing pattern
- `developer-portal-memory.md` — full developer portal spec and design context
