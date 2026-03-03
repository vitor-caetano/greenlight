# Developer Portal for Commercial API Integration — Extracted Domain, Models, APIs

**Source:** Conversation between user and assistant (Abbott Developer Portal project spec + derived backend design artifacts).  
**Document date generated:** 2026-03-03

---

## 1) Input Specification (provided)

### Business Requirements Document
- **Project Title:** Developer Portal for Commercial API Integration  
- **Prepared For:** Third-Party Vendor SOW assessment  
- **Prepared By:** Abbott  
- **Date:** July 2025  

### Executive summary
Streamline partner onboarding, reduce manual effort, and improve partner experience via a centralized automated developer portal.

### Business objectives
- Reduce onboarding time from **3–9 months** to **under 30 days**
- Automate **sandbox & production setup** and documentation access
- Provide a unified, branded experience for API partners

### Stakeholders
GSM, BD, R&D, PMO, US Commercial, EMEA, Regulatory, Privacy, Quality

### Current state & pain points
Manual / fragmented onboarding using email, ReadMe, JIRA, ShareFile; manual sandbox setup; no public API acknowledgment; 3–9 months typical timeline.

### Future state vision
- Limited and Full Access phases
- Automated sandbox provisioning
- Consolidated docs, branding, support ticketing
- Public-facing API acknowledgment

### Functional requirements (high level)
- Partner registration & access request form; free account; blocked domains list (e.g., Dexcom, Gmail, AOL, Yahoo, Outlook)
- Limited content access after login until back-end approvals complete
- Status shown as **approved/pending** only (no stage-by-stage UI)
- Account status changes after X days inactive; process to re-enable
- Org/team: first Org Lead registers and can invite 4 developers; lead can delete staff
- Login supports Org Lead + invited developers
- Sandbox agreement acceptance during registration
- Automated sandbox configuration: dev inputs URLs for API testing scenario
- API docs access: OAuth process + endpoints guidance
- Upload integration demo (recording/screenshots) to validate sandbox testing completion
- Submit support tickets to Abbott Jira (**Full Access only**)
- Branding/logo guidance page and assets
- Production configuration submission (gated by internal reviews)

### Non-functional requirements
Secure auth & access control; scalable architecture; responsive UI/UX.

### Process flow (simplified)
1. Developer registers and accepts sandbox agreement
2. Gains Limited access to docs and sandbox tools
3. Can request Full access; triggers Abbott internal review + business agreement
4. After business agreement: Full access, support tickets, production configuration

### Assumptions
- R&D resources Q4 2025 for Limited Access only
- Legal provides sandbox agreement; privacy provides privacy notice
- Initial launch: limited access; not publicly indexed
- Account approvals not managed in UI; Abbott manually approves in external system, portal reflects it
- Content populated by R&D APIs and/or CMS (TBD)
- No CRM or production key provisioning in initial scope
- BTS hosts website

### Out of scope (phase 1)
CRM integration; quality change notification automation; public SEO discoverability; detailed backend stage status; BD/regulatory/privacy reviews in UI.

### Gaps
Backend approvals & ongoing mgmt definition; content strategy; dynamic vs static content decision.

---

## 2) Extracted & Refined Domain (bounded contexts)

### A. Identity & Access
Authentication, sessions, roles/permissions, blocked email domains, inactivity rules.

### B. Organization & Team Management
Org registration, invite up to 4 additional developers (total 5 including lead), member lifecycle.

### C. Onboarding & Access Lifecycle
Limited vs Full access, UI-safe status (pending/approved), inactivity and re-enable.

### D. Agreements & Compliance
Versioned legal docs (Sandbox TOU, Privacy Notice) and acceptance tracking.

### E. Sandbox Provisioning
Store sandbox configuration inputs and trigger automated provisioning (async jobs).

### F. Documentation & Content
Docs behind login; content source may be CMS or API-fed; keep abstraction flexible.

### G. Integration Demo Submission
Upload demo artifacts (video/screenshots) + metadata.

### H. Support Ticketing (Full Access)
Create tickets that feed Abbott Jira; gated by Full access only.

### I. Branding Assets
Logo guidance page + downloadable assets.

### J. Production Configuration (Full Access)
Collect production config submissions; gated by internal review workflow.

### K. Admin / External Approval Sync
Approval updates pushed from Abbott external system (webhook) or pulled (sync job).

---

## 3) Core Data Models (suggested)

### 3.1 User
```json
{
  "id": "usr_...",
  "email": "dev@partner.com",
  "name": "Jane Doe",
  "status": "ACTIVE | INACTIVE | SUSPENDED",
  "lastLoginAt": "2026-03-03T12:34:56Z",
  "inactivatedAt": "2026-02-01T00:00:00Z",
  "organizationId": "org_...",
  "role": "ORG_LEAD | DEV_MEMBER",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### 3.2 Organization
```json
{
  "id": "org_...",
  "name": "Partner Company",
  "primaryDomain": "partner.com",
  "status": "ACTIVE | LOCKED",
  "memberLimit": 5,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### 3.3 Invitation
```json
{
  "id": "inv_...",
  "organizationId": "org_...",
  "email": "newdev@partner.com",
  "role": "DEV_MEMBER",
  "status": "PENDING | ACCEPTED | EXPIRED | REVOKED",
  "token": "opaque",
  "expiresAt": "...",
  "createdByUserId": "usr_..."
}
```

### 3.4 Access Profile (UI-safe)
```json
{
  "organizationId": "org_...",
  "accessLevel": "LIMITED | FULL",
  "approvalStatus": "PENDING | APPROVED | REJECTED",
  "statusReason": "optional short text",
  "lastStatusChangeAt": "...",
  "source": "ABBOTT_EXTERNAL_SYSTEM"
}
```

### 3.5 Agreement (versioned)
```json
{
  "id": "agr_...",
  "type": "SANDBOX_TOU | PRIVACY_NOTICE",
  "version": "2025-07",
  "title": "Sandbox License & Terms",
  "contentUrl": "https://...",
  "publishedAt": "..."
}
```

### 3.6 Agreement Acceptance
```json
{
  "id": "acc_...",
  "agreementId": "agr_...",
  "userId": "usr_...",
  "acceptedAt": "...",
  "ipAddress": "optional",
  "userAgent": "optional"
}
```

### 3.7 Sandbox Configuration
```json
{
  "id": "sbx_...",
  "organizationId": "org_...",
  "submittedByUserId": "usr_...",
  "environment": "SANDBOX",
  "callbackUrls": ["https://app.partner.com/callback"],
  "redirectUris": ["https://app.partner.com/oauth/callback"],
  "allowedOrigins": ["https://app.partner.com"],
  "notes": "optional",
  "status": "DRAFT | SUBMITTED | PROVISIONING | ACTIVE | FAILED",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### 3.8 Provisioning Job
```json
{
  "id": "job_...",
  "type": "SANDBOX_PROVISION | PROD_CONFIG_REVIEW",
  "entityRef": {"type": "SandboxConfig", "id": "sbx_..."},
  "status": "QUEUED | RUNNING | SUCCEEDED | FAILED",
  "error": "optional",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### 3.9 Demo Submission
```json
{
  "id": "demo_...",
  "organizationId": "org_...",
  "submittedByUserId": "usr_...",
  "type": "VIDEO | SCREENSHOTS",
  "files": [
    {"fileId": "fil_...", "filename": "demo.mp4", "contentType": "video/mp4"}
  ],
  "status": "SUBMITTED | UNDER_REVIEW | ACCEPTED | REJECTED",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### 3.10 File / Asset
```json
{
  "id": "fil_...",
  "storageProvider": "S3",
  "bucket": "...",
  "key": "...",
  "url": "pre-signed-or-cdn",
  "sha256": "optional",
  "sizeBytes": 12345,
  "contentType": "image/png",
  "createdAt": "..."
}
```

### 3.11 Support Ticket (Jira mirror)
```json
{
  "id": "tkt_...",
  "organizationId": "org_...",
  "createdByUserId": "usr_...",
  "category": "QUESTION | ISSUE | BUG | OTHER",
  "title": "string",
  "description": "string",
  "status": "OPEN | IN_PROGRESS | RESOLVED | CLOSED",
  "externalRef": {"system": "JIRA", "key": "ADC-123"},
  "createdAt": "...",
  "updatedAt": "..."
}
```

### 3.12 Production Configuration Submission
```json
{
  "id": "prd_...",
  "organizationId": "org_...",
  "submittedByUserId": "usr_...",
  "environment": "PRODUCTION",
  "config": { "redirectUris": [], "allowedOrigins": [] },
  "status": "DRAFT | SUBMITTED | IN_REVIEW | APPROVED | REJECTED",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 4) Proposed Backend Endpoints (possible REST surface)

### Auth & session
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET  /me`

### Agreements
- `GET /agreements?type=SANDBOX_TOU`
- `POST /agreements/{agreementId}/accept`

### Org & team
- `GET /orgs/{orgId}`
- `GET /orgs/{orgId}/members`
- `POST /orgs/{orgId}/invites`
- `POST /invites/{token}/accept`
- `DELETE /orgs/{orgId}/members/{userId}`

### Access profile & onboarding
- `GET /orgs/{orgId}/access-profile`
- `POST /orgs/{orgId}/full-access-requests`

### Sandbox configuration & provisioning
- `POST /orgs/{orgId}/sandbox-configs`
- `PUT  /sandbox-configs/{id}`
- `POST /sandbox-configs/{id}/submit`
- `GET  /sandbox-configs/{id}`
- `GET  /orgs/{orgId}/sandbox-configs`
- `GET  /jobs/{jobId}`

### Documentation & content
- `GET /content/pages`
- `GET /content/pages/{slug}`

### Demo upload
- `POST /uploads/presign`
- `POST /orgs/{orgId}/demo-submissions`
- `GET  /orgs/{orgId}/demo-submissions`
- `GET  /demo-submissions/{id}`

### Support tickets (Full access only)
- `POST /orgs/{orgId}/tickets`
- `GET  /orgs/{orgId}/tickets`

### Branding assets
- `GET /branding/assets`
- `GET /branding/guidelines` (optional)

### Production configuration (Full access only)
- `POST /orgs/{orgId}/production-configs`
- `PUT  /production-configs/{id}`
- `POST /production-configs/{id}/submit`
- `GET  /orgs/{orgId}/production-configs`

### Inactivity & re-enable
- `POST /me/reactivation-requests`

### External approval sync (Abbott system)
- `POST /integrations/abbott/approvals` (signed webhook)

---

## 5) OpenAPI 3.0 skeleton (earlier version)

> Note: A larger “complete OpenAPI starter” was later produced in the conversation; see section 7.

(For brevity in this MD, the full earlier skeleton is omitted because it is superseded by the complete version below.)

---

## 6) Postgres ERD-style schema (DDL)

```sql
-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS citext;     -- case-insensitive email

-- ---------- ENUMS ----------
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('ORG_LEAD', 'DEV_MEMBER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE access_level AS ENUM ('LIMITED', 'FULL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE agreement_type AS ENUM ('SANDBOX_TOU', 'PRIVACY_NOTICE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE invite_status AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE environment AS ENUM ('SANDBOX', 'PRODUCTION');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE env_config_status AS ENUM (
    'DRAFT', 'SUBMITTED', 'PROVISIONING', 'ACTIVE', 'FAILED',
    'IN_REVIEW', 'APPROVED', 'REJECTED'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE job_type AS ENUM ('SANDBOX_PROVISION', 'PROD_CONFIG_REVIEW');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE job_status AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE demo_type AS ENUM ('VIDEO', 'SCREENSHOTS');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE demo_status AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ticket_category AS ENUM ('QUESTION', 'ISSUE', 'BUG', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- ORGS ----------
CREATE TABLE IF NOT EXISTS organizations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  primary_domain  text NULL,
  status          text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'LOCKED')),
  member_limit    integer NOT NULL DEFAULT 5 CHECK (member_limit BETWEEN 1 AND 50),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orgs_primary_domain ON organizations (primary_domain);

-- ---------- USERS ----------
CREATE TABLE IF NOT EXISTS users (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email            citext NOT NULL,
  name             text NOT NULL,
  password_hash    text NULL,  -- nullable if SSO; otherwise required
  role             user_role NOT NULL,
  status           user_status NOT NULL DEFAULT 'ACTIVE',
  last_login_at    timestamptz NULL,
  inactivated_at   timestamptz NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_users_org_email UNIQUE (organization_id, email)
);

CREATE INDEX IF NOT EXISTS idx_users_org ON users (organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- ---------- BLOCKED EMAIL DOMAINS ----------
CREATE TABLE IF NOT EXISTS blocked_email_domains (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain      text NOT NULL UNIQUE,
  reason      text NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------- INVITATIONS ----------
CREATE TABLE IF NOT EXISTS invitations (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email            citext NOT NULL,
  role             user_role NOT NULL DEFAULT 'DEV_MEMBER',
  status           invite_status NOT NULL DEFAULT 'PENDING',
  token_hash       text NOT NULL UNIQUE,        -- store hash of token, not the token
  expires_at       timestamptz NOT NULL,
  created_by       uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ck_invites_role_member_only CHECK (role IN ('DEV_MEMBER')),
  CONSTRAINT uq_invites_org_email_pending UNIQUE (organization_id, email, status)
);

CREATE INDEX IF NOT EXISTS idx_invites_org ON invitations (organization_id);
CREATE INDEX IF NOT EXISTS idx_invites_expires ON invitations (expires_at);

-- ---------- ACCESS PROFILE ----------
CREATE TABLE IF NOT EXISTS access_profiles (
  organization_id       uuid PRIMARY KEY REFERENCES organizations(id) ON DELETE CASCADE,
  access_level          access_level NOT NULL DEFAULT 'LIMITED',
  approval_status       approval_status NOT NULL DEFAULT 'PENDING',
  status_reason         text NULL,
  last_status_change_at timestamptz NOT NULL DEFAULT now(),
  source                text NOT NULL DEFAULT 'ABBOTT_EXTERNAL_SYSTEM',
  external_reference    text NULL
);

-- ---------- FULL ACCESS REQUESTS (optional history) ----------
CREATE TABLE IF NOT EXISTS full_access_requests (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by      uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status          text NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'CANCELLED', 'DECIDED')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_far_org ON full_access_requests (organization_id);

-- ---------- AGREEMENTS ----------
CREATE TABLE IF NOT EXISTS agreements (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type         agreement_type NOT NULL,
  version      text NOT NULL,           -- e.g., "2025-07"
  title        text NOT NULL,
  content_url  text NOT NULL,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_agreements_type_version UNIQUE (type, version)
);

CREATE INDEX IF NOT EXISTS idx_agreements_type_published ON agreements (type, published_at DESC);

-- ---------- AGREEMENT ACCEPTANCES ----------
CREATE TABLE IF NOT EXISTS agreement_acceptances (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id uuid NOT NULL REFERENCES agreements(id) ON DELETE RESTRICT,
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  accepted_at  timestamptz NOT NULL DEFAULT now(),
  ip_address   inet NULL,
  user_agent   text NULL,
  CONSTRAINT uq_acceptances_user_agreement UNIQUE (user_id, agreement_id)
);

CREATE INDEX IF NOT EXISTS idx_acceptances_user ON agreement_acceptances (user_id);

-- ---------- FILES ----------
CREATE TABLE IF NOT EXISTS files (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_provider text NOT NULL DEFAULT 'S3',
  bucket           text NOT NULL,
  object_key       text NOT NULL,
  url              text NULL,
  sha256           text NULL,
  size_bytes       bigint NOT NULL CHECK (size_bytes >= 0),
  content_type     text NOT NULL,
  created_by       uuid NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_files_created_by ON files (created_by);

-- ---------- ENVIRONMENT CONFIGS ----------
CREATE TABLE IF NOT EXISTS environment_configs (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  environment      environment NOT NULL,
  status           env_config_status NOT NULL DEFAULT 'DRAFT',
  submitted_by     uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  config           jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes            text NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_envcfg_org_env ON environment_configs (organization_id, environment);
CREATE INDEX IF NOT EXISTS idx_envcfg_status ON environment_configs (status);

-- ---------- JOBS ----------
CREATE TABLE IF NOT EXISTS jobs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type         job_type NOT NULL,
  status       job_status NOT NULL DEFAULT 'QUEUED',
  entity_type  text NOT NULL,
  entity_id    uuid NOT NULL,
  error        text NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jobs_entity ON jobs (entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs (status);

-- ---------- DEMO SUBMISSIONS ----------
CREATE TABLE IF NOT EXISTS demo_submissions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  submitted_by     uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  type             demo_type NOT NULL,
  status           demo_status NOT NULL DEFAULT 'SUBMITTED',
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_demo_org ON demo_submissions (organization_id);

CREATE TABLE IF NOT EXISTS demo_submission_files (
  demo_submission_id uuid NOT NULL REFERENCES demo_submissions(id) ON DELETE CASCADE,
  file_id            uuid NOT NULL REFERENCES files(id) ON DELETE RESTRICT,
  PRIMARY KEY (demo_submission_id, file_id)
);

-- ---------- TICKETS ----------
CREATE TABLE IF NOT EXISTS tickets (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by       uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  category         ticket_category NOT NULL,
  title            text NOT NULL,
  description      text NOT NULL,
  status           ticket_status NOT NULL DEFAULT 'OPEN',
  jira_key         text NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tickets_org ON tickets (organization_id);
CREATE INDEX IF NOT EXISTS idx_tickets_jira_key ON tickets (jira_key);

-- ---------- BRANDING ASSETS ----------
CREATE TABLE IF NOT EXISTS branding_assets (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  kind        text NOT NULL CHECK (kind IN ('LOGO', 'ICON', 'GUIDELINE_PDF', 'OTHER')),
  file_id     uuid NOT NULL REFERENCES files(id) ON DELETE RESTRICT,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_branding_active ON branding_assets (is_active);

-- ---------- CONTENT PAGES (optional) ----------
CREATE TABLE IF NOT EXISTS content_pages (
  slug        text PRIMARY KEY,
  title       text NOT NULL,
  body        text NOT NULL,
  scope       text NOT NULL CHECK (scope IN ('LIMITED', 'FULL')),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_scope ON content_pages (scope);
```

---

## 7) Complete OpenAPI starter (latest)

The conversation produced a full single-file OpenAPI starter (YAML) including:
- health check
- auth/register/login/logout/refresh
- agreements list + accept
- org + members + invites + remove member
- access profile + full access request + reactivation request
- sandbox configs CRUD + submit (async job)
- production configs list/create + submit (Full only)
- uploads presign
- demo submissions list/create
- tickets list/create (Full only)
- branding assets
- content pages list/get
- jobs get
- external approvals webhook endpoint (signed)

If you want this MD to include the entire OpenAPI YAML verbatim as the final artifact, tell me and I’ll append it in full (it’s already available in the conversation; I kept this document smaller).

---

## 8) Minimal RBAC and access gating matrix

### Roles
- `ORG_LEAD`: organization owner/admin (invites, removes users)
- `DEV_MEMBER`: invited developer

### Org access profile
- `approvalStatus`: `PENDING | APPROVED` (optionally `REJECTED`)
- `accessLevel`: `LIMITED | FULL`

### Global rules
- If `users.status != ACTIVE`: deny everything except `/auth/*`, `/me`, and `/me/reactivation-requests`
- If caller not in `{orgId}`: deny org-scoped endpoints

### Full-only features require
- `accessLevel = FULL` **and** `approvalStatus = APPROVED`

### Endpoint gating (summary)
| Endpoint | Login | Org member | ORG_LEAD | Full Approved |
|---|---:|---:|---:|---:|
| `POST /auth/register` | No | - | - | No |
| `POST /auth/login` | No | - | - | No |
| `GET /me` | Yes | - | No | No |
| `GET /agreements` | No | - | No | No |
| `POST /agreements/{id}/accept` | Yes | - | No | No |
| `GET /orgs/{orgId}` | Yes | Yes | No | No |
| `GET /orgs/{orgId}/members` | Yes | Yes | No | No |
| `POST /orgs/{orgId}/invites` | Yes | Yes | **Yes** | No |
| `DELETE /orgs/{orgId}/members/{userId}` | Yes | Yes | **Yes** | No |
| `GET /orgs/{orgId}/access-profile` | Yes | Yes | No | No |
| `POST /orgs/{orgId}/full-access-requests` | Yes | Yes | (optional ORG_LEAD) | No |
| `GET/POST /orgs/{orgId}/sandbox-configs` | Yes | Yes | No | No |
| `POST /sandbox-configs/{id}/submit` | Yes | Yes | No | No (TOU required) |
| `GET/POST /orgs/{orgId}/production-configs` | Yes | Yes | No | **Yes** |
| `POST /production-configs/{id}/submit` | Yes | Yes | No | **Yes** |
| `POST /uploads/presign` | Yes | - | No | No |
| `GET/POST /orgs/{orgId}/demo-submissions` | Yes | Yes | No | No |
| `GET/POST /orgs/{orgId}/tickets` | Yes | Yes | No | **Yes** |
| `GET /branding/assets` | Yes | - | No | No |
| `GET /content/pages*` | Yes | - | No | No (scope filtered) |
| `GET /jobs/{jobId}` | Yes | Yes (ownership) | No | No |
| `POST /integrations/abbott/approvals` | Webhook auth | - | - | - |

---

## 9) Implementation policy checks (recommended)
- Enforce domain blocks on registration + invites.
- Enforce team size: allow invites only if `members + pending_invites < 5`.
- Require recorded Sandbox TOU acceptance before sandbox submit.
- Do not leak internal approval stages; UI sees only pending/approved + limited/full.
- Full-only endpoints must check both `accessLevel=FULL` and `approvalStatus=APPROVED`.

---
