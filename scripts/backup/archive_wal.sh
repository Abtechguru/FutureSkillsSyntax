#!/bin/bash
# scripts/backup/archive_wal.sh

set -e

# Configuration
WAL_ARCHIVE_DIR="/wal_archive"
S3_WAL_BUCKET="futureskills-wal-backups-${AWS_ACCOUNT_ID}"
LOG_FILE="/var/log/wal_archive.log"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

archive_wal_files() {
    log "Starting WAL file archiving..."
    
    # Find and archive WAL files
    find /var/lib/postgresql/data/pg_wal -name "*.backup" -mmin +5 | while read wal_file; do
        filename=$(basename "$wal_file")
        
        # Compress WAL file
        gzip -c "$wal_file" > "$WAL_ARCHIVE_DIR/$filename.gz"
        
        # Upload to S3
        aws s3 cp "$WAL_ARCHIVE_DIR/$filename.gz" \
            "s3://$S3_WAL_BUCKET/wal/$filename.gz" \
            --storage-class STANDARD_IA
        
        if [ $? -eq 0 ]; then
            log "Archived WAL file: $filename"
            
            # Clean up local copy
            rm -f "$WAL_ARCHIVE_DIR/$filename.gz"
            rm -f "$wal_file"
        else
            log "Failed to archive WAL file: $filename"
        fi
    done
    
    log "WAL archiving completed"
}

# Create archive directory
mkdir -p "$WAL_ARCHIVE_DIR"

# Run archiving
archive_wal_files