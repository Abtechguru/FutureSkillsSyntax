-- Add expiry to email verification tokens.
-- Apply only after confirming the authoritative database schema.
-- This migration is additive and does not reconcile the legacy UUID/int ID mismatch.
ALTER TABLE IF EXISTS public.users
    ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_verification_token_expires
    ON public.users(verification_token_expires)
    WHERE verification_token IS NOT NULL;
