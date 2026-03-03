CREATE TABLE IF NOT EXISTS portal_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL REFERENCES organizations (id),
    email citext NOT NULL,
    name text NOT NULL,
    password_hash bytea NOT NULL,
    role text NOT NULL DEFAULT 'DEV_MEMBER' CHECK (role IN ('ORG_LEAD', 'DEV_MEMBER')),
    status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    activated bool NOT NULL DEFAULT false,
    last_login_at timestamp(0) with time zone,
    inactivated_at timestamp(0) with time zone,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    updated_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    version integer NOT NULL DEFAULT 1,
    UNIQUE (organization_id, email)
);

CREATE INDEX IF NOT EXISTS portal_users_organization_id_idx ON portal_users (organization_id);
CREATE INDEX IF NOT EXISTS portal_users_email_idx ON portal_users (email);
