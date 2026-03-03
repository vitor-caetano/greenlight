# Plan: Developer Portal Registration Flow

## Context

Registration is the first step in the developer portal. Before partners can request API access, accept agreements, or manage team members, they need an organization and a lead user account. This endpoint bootstraps both in a single atomic operation.

## Tasks

### Task 1: Create migrations

- **000007** — `organizations` table: UUID PK, name, primary_domain, status (ACTIVE/LOCKED), member_limit (default 5), timestamps, version. Index on primary_domain.
- **000008** — `blocked_email_domains` table: UUID PK, citext domain (unique), reason, created_at. Pre-seed with gmail.com, yahoo.com, hotmail.com, outlook.com, aol.com, dexcom.com.
- **000009** — `portal_users` table: UUID PK, organization_id FK, citext email, name, password_hash, role (ORG_LEAD/DEV_MEMBER), status (ACTIVE/INACTIVE/SUSPENDED), activated (default false), timestamps, version. Unique constraint on (organization_id, email). Indexes on organization_id and email.

### Task 2: Create data models

- `internal/data/organizations.go` — Organization struct, OrganizationModel, ValidateOrganization
- `internal/data/portal_users.go` — PortalUser struct, PortalUserModel, ValidatePortalUser, ErrDuplicateOrgEmail
- `internal/data/blocked_domains.go` — BlockedDomainModel with Exists(domain) method

### Task 3: Create registration transaction

- `internal/data/registration.go` — `RegisterOrgAndLead(db, org, user)` function
- Begins transaction, inserts org, inserts user with org.ID, commits
- Maps duplicate key constraint violation to ErrDuplicateOrgEmail

### Task 4: Create handler and route

- `cmd/api/auth.go` — `registerOrgHandler` reads JSON input, extracts email domain, checks blocked domains, validates models, calls RegisterOrgAndLead, returns 201 with envelope
- `cmd/api/routes.go` — register `POST /v1/auth/register` route

### Task 5: Update Models struct

- Add Organizations, BlockedDomains, PortalUsers to Models struct and NewModels factory in `internal/data/models.go`

## Verification

```bash
make audit

# Successful registration
curl -X POST localhost:4000/v1/auth/register -d '{
  "organization_name": "Test Org",
  "name": "Test User",
  "email": "test@company.com",
  "password": "pa55word123"
}'
# Expected: 201 with organization and user

# Blocked domain rejection
curl -X POST localhost:4000/v1/auth/register -d '{
  "organization_name": "Gmail Org",
  "name": "Test User",
  "email": "test@gmail.com",
  "password": "pa55word123"
}'
# Expected: 400 bad request — blocked domain

# Duplicate email rejection
# Repeat the first curl — Expected: 422 with duplicate email error
```
