# Shape: Developer Portal Registration Flow

## Problem

Manual partner onboarding takes 3-9 months. Partners need a self-service registration flow to create an organization and initial lead user account, eliminating the manual intake process.

## Solution

`POST /v1/auth/register` — atomic organization + lead user creation with domain blocking.

**Request body:**
```json
{
  "organization_name": "Acme Health",
  "name": "Jane Doe",
  "email": "jane@acmehealth.com",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "organization": { "id": "uuid", "name": "Acme Health", "primary_domain": "acmehealth.com", ... },
  "user": { "id": "uuid", "email": "jane@acmehealth.com", "role": "ORG_LEAD", "activated": false, ... }
}
```

## Design Decisions

- **UUID IDs** — `gen_random_uuid()` via pgcrypto for all three tables (organizations, blocked_email_domains, portal_users)
- **citext emails** — case-insensitive email comparison at the database level for both blocked domains and portal users
- **Blocked free email domains** — gmail.com, yahoo.com, hotmail.com, outlook.com, aol.com pre-seeded; dexcom.com also blocked
- **ORG_LEAD role** — first registered user automatically becomes organization lead with future invite capabilities
- **activated=false default** — users require explicit activation (email verification) before gaining full access
- **Atomic transaction** — organization and user created in a single DB transaction with 5-second timeout; rollback on any failure
- **Domain extraction** — email domain extracted and stored as `primary_domain` on the organization

## Scope

Phase 1 MVP — Limited Access registration only. No invite flow, no access profile creation, no agreement acceptance yet.
