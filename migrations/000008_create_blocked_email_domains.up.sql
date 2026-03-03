CREATE TABLE IF NOT EXISTS blocked_email_domains (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    domain citext UNIQUE NOT NULL,
    reason text NOT NULL DEFAULT '',
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW()
);

INSERT INTO blocked_email_domains (domain, reason) VALUES
    ('gmail.com', 'free email provider'),
    ('yahoo.com', 'free email provider'),
    ('hotmail.com', 'free email provider'),
    ('outlook.com', 'free email provider'),
    ('aol.com', 'free email provider'),
    ('dexcom.com', 'blocked domain');
