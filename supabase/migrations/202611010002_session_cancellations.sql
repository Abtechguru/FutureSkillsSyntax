-- Adds cancellation audit fields for the integer-ID ORM schema.
-- Apply only AFTER reconciling the existing UUID-based Supabase bootstrap
-- with the application's integer-ID user and mentorship models.
DO $$
DECLARE id_type TEXT;
BEGIN
    SELECT data_type INTO id_type
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'id';
    IF id_type NOT IN ('integer', 'bigint') THEN
        RAISE EXCEPTION 'Users ID schema is incompatible; reconcile UUID/integer IDs before this migration';
    END IF;
END $$;

ALTER TABLE public.mentorship_sessions
    ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
    ADD COLUMN IF NOT EXISTS cancelled_by INTEGER;
