#!/bin/bash
# scripts/backup/automated-backup.sh

set -e

# Configuration
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
S3_BUCKET="futureskills-backups-${AWS_ACCOUNT_ID}"
LOG_FILE="/var/log/backup.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

# Load environment variables
if [ -f /etc/futureskills/.env ]; then
    source /etc/futureskills/.env
fi

create_backup_directory() {
    log "Creating backup directory..."
    mkdir -p "$BACKUP_DIR/daily"
    mkdir -p "$BACKUP_DIR/weekly"
    mkdir -p "$BACKUP_DIR/monthly"
    success "Backup directories created"
}

perform_database_backup() {
    local backup_type=$1
    local backup_path="$BACKUP_DIR/$backup_type/full_backup_$DATE.sql"
    
    log "Starting $backup_type database backup..."
    
    # Perform backup using pg_dump
    PGPASSWORD=$POSTGRES_PASSWORD pg_dump \
        -h $POSTGRES_HOST \
        -p $POSTGRES_PORT \
        -U $POSTGRES_USER \
        -d $POSTGRES_DB \
        --clean \
        --if-exists \
        --create \
        --no-password \
        --verbose \
        --format=c \
        --blobs \
        --no-owner \
        --no-privileges \
        -f "$backup_path"
    
    if [ $? -eq 0 ]; then
        success "Database backup created: $backup_path"
        
        # Get backup size
        BACKUP_SIZE=$(du -h "$backup_path" | cut -f1)
        log "Backup size: $BACKUP_SIZE"
        
        # Create checksum
        sha256sum "$backup_path" > "$backup_path.sha256"
        
        # Verify backup
        verify_backup "$backup_path"
        
    else
        error "Database backup failed!"
        exit 1
    fi
}

perform_wal_backup() {
    log "Starting WAL backup..."
    
    # Archive WAL files
    /usr/bin/archive_wal.sh
    
    success "WAL backup completed"
}

verify_backup() {
    local backup_file=$1
    
    log "Verifying backup integrity..."
    
    # Verify checksum
    if sha256sum -c "$backup_file.sha256" > /dev/null 2>&1; then
        success "Backup integrity verified"
    else
        error "Backup integrity check failed!"
        exit 1
    fi
    
    # Test restore on a temporary database
    test_restore "$backup_file"
}

test_restore() {
    local backup_file=$1
    
    log "Testing backup restoration..."
    
    # Create a test database
    TEST_DB="backup_test_$(date +%s)"
    
    PGPASSWORD=$POSTGRES_PASSWORD createdb \
        -h $POSTGRES_HOST \
        -p $POSTGRES_PORT \
        -U $POSTGRES_USER \
        "$TEST_DB"
    
    if [ $? -eq 0 ]; then
        # Try to restore
        PGPASSWORD=$POSTGRES_PASSWORD pg_restore \
            -h $POSTGRES_HOST \
            -p $POSTGRES_PORT \
            -U $POSTGRES_USER \
            -d "$TEST_DB" \
            --clean \
            --if-exists \
            --no-owner \
            --no-privileges \
            --verbose \
            "$backup_file"
        
        if [ $? -eq 0 ]; then
            success "Backup restoration test successful"
        else
            error "Backup restoration test failed!"
        fi
        
        # Clean up test database
        PGPASSWORD=$POSTGRES_PASSWORD dropdb \
            -h $POSTGRES_HOST \
            -p $POSTGRES_PORT \
            -U $POSTGRES_USER \
            "$TEST_DB"
            
    else
        warning "Could not create test database, skipping restore test"
    fi
}

upload_to_s3() {
    local backup_type=$1
    local backup_path="$BACKUP_DIR/$backup_type/full_backup_$DATE.sql"
    
    log "Uploading backup to S3..."
    
    # Upload to S3 with appropriate storage class
    if [ "$backup_type" == "daily" ]; then
        storage_class="STANDARD"
    elif [ "$backup_type" == "weekly" ]; then
        storage_class="STANDARD_IA"
    else
        storage_class="GLACIER"
    fi
    
    aws s3 cp "$backup_path" \
        "s3://$S3_BUCKET/database/$backup_type/full_backup_$DATE.sql" \
        --storage-class "$storage_class"
    
    aws s3 cp "$backup_path.sha256" \
        "s3://$S3_BUCKET/database/$backup_type/full_backup_$DATE.sql.sha256"
    
    success "Backup uploaded to S3"
}

cleanup_old_backups() {
    log "Cleaning up old backups..."
    
    # Local cleanup
    find "$BACKUP_DIR/daily" -name "*.sql" -mtime +$RETENTION_DAYS -delete
    find "$BACKUP_DIR/daily" -name "*.sha256" -mtime +$RETENTION_DAYS -delete
    
    find "$BACKUP_DIR/weekly" -name "*.sql" -mtime +90 -delete
    find "$BACKUP_DIR/weekly" -name "*.sha256" -mtime +90 -delete
    
    # S3 lifecycle policies handle remote cleanup
    success "Old backups cleaned up"
}

notify_backup_status() {
    local status=$1
    local backup_type=$2
    
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        if [ "$status" == "success" ]; then
            emoji="✅"
            color="good"
        else
            emoji="❌"
            color="danger"
        fi
        
        curl -X POST -H 'Content-type: application/json' \
            --data "{
                \"attachments\": [
                    {
                        \"color\": \"$color\",
                        \"title\": \"$emoji Database Backup $status\",
                        \"fields\": [
                            {
                                \"title\": \"Type\",
                                \"value\": \"$backup_type\",
                                \"short\": true
                            },
                            {
                                \"title\": \"Date\",
                                \"value\": \"$(date)\",
                                \"short\": true
                            },
                            {
                                \"title\": \"Environment\",
                                \"value\": \"$ENVIRONMENT\",
                                \"short\": true
                            }
                        ]
                    }
                ]
            }" \
            "$SLACK_WEBHOOK_URL"
    fi
}

# Main backup logic
main() {
    local backup_type="daily"
    
    # Determine backup type based on day
    DAY_OF_WEEK=$(date +%u)
    DAY_OF_MONTH=$(date +%d)
    
    if [ "$DAY_OF_MONTH" == "01" ]; then
        backup_type="monthly"
    elif [ "$DAY_OF_WEEK" == "7" ]; then  # Sunday
        backup_type="weekly"
    fi
    
    log "Starting $backup_type backup process..."
    
    # Create directories
    create_backup_directory
    
    # Perform backup
    if perform_database_backup "$backup_type"; then
        # Upload to S3
        upload_to_s3 "$backup_type"
        
        # Perform WAL backup (for point-in-time recovery)
        perform_wal_backup
        
        # Cleanup old backups
        cleanup_old_backups
        
        # Notify success
        notify_backup_status "success" "$backup_type"
        
        success "Backup process completed successfully!"
    else
        error "Backup process failed!"
        notify_backup_status "failed" "$backup_type"
        exit 1
    fi
}

# Handle script arguments
case "$1" in
    "daily")
        backup_type="daily"
        ;;
    "weekly")
        backup_type="weekly"
        ;;
    "monthly")
        backup_type="monthly"
        ;;
    *)
        backup_type="auto"
        ;;
esac

# Run main function
main "$backup_type"