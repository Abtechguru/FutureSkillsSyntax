-- postgres/backup/configure_backups.sql
-- Configure PostgreSQL for continuous archiving

-- Enable WAL archiving
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'gzip -c %p > /wal_archive/%f.gz && aws s3 cp /wal_archive/%f.gz s3://futureskills-wal-backups/wal/%f.gz';

-- Set checkpoint intervals for optimal backup performance
ALTER SYSTEM SET checkpoint_timeout = '15min';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET max_wal_size = '2GB';
ALTER SYSTEM SET min_wal_size = '1GB';

-- Enable backup from standby
ALTER SYSTEM SET hot_standby = on;
ALTER SYSTEM SET hot_standby_feedback = on;

-- Create backup user with limited privileges
CREATE ROLE backup_user WITH LOGIN PASSWORD '${BACKUP_USER_PASSWORD}';
GRANT CONNECT ON DATABASE futureskills_prod TO backup_user;
GRANT USAGE ON SCHEMA public TO backup_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO backup_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO backup_user;

-- Create function to monitor backup status
CREATE OR REPLACE FUNCTION backup_status()
RETURNS TABLE (
    last_backup_time TIMESTAMP,
    backup_size_mb NUMERIC,
    backup_duration INTERVAL,
    backup_success BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        backup_time,
        pg_size_pretty(pg_database_size('futureskills_prod'))::NUMERIC,
        AGE(NOW(), backup_time),
        true
    FROM backup_history
    ORDER BY backup_time DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create backup history table
CREATE TABLE IF NOT EXISTS backup_history (
    id BIGSERIAL PRIMARY KEY,
    backup_time TIMESTAMP DEFAULT NOW(),
    backup_type VARCHAR(20) NOT NULL,
    backup_size BIGINT,
    checksum VARCHAR(64),
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for backup history queries
CREATE INDEX idx_backup_history_time ON backup_history(backup_time);
CREATE INDEX idx_backup_history_type ON backup_history(backup_type);

-- Grant permissions
GRANT SELECT ON backup_history TO backup_user;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO backup_user;