-- Additive migration. Apply with psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/0001_harness_network.sql
BEGIN;
CREATE TABLE IF NOT EXISTS harnesses (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id),
 source_url text NOT NULL, title text NOT NULL, description text NOT NULL DEFAULT '', topic text NOT NULL DEFAULT 'workflow',
 snapshot jsonb NOT NULL, created_at timestamp NOT NULL DEFAULT now(), updated_at timestamp NOT NULL DEFAULT now(), UNIQUE(user_id, source_url)
);
CREATE TABLE IF NOT EXISTS harness_versions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), harness_id uuid NOT NULL REFERENCES harnesses(id),
 commit_sha text NOT NULL, snapshot jsonb NOT NULL, created_at timestamp NOT NULL DEFAULT now(), UNIQUE(harness_id, commit_sha)
);
CREATE TABLE IF NOT EXISTS harness_saves (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id),
 harness_id text NOT NULL, created_at timestamp NOT NULL DEFAULT now(), UNIQUE(user_id, harness_id)
);
CREATE TABLE IF NOT EXISTS harness_follows (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id),
 owner text NOT NULL, created_at timestamp NOT NULL DEFAULT now(), UNIQUE(user_id, owner)
);
CREATE INDEX IF NOT EXISTS harnesses_updated_idx ON harnesses(updated_at DESC);
COMMIT;
