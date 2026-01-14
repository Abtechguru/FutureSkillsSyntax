#!/bin/bash
# scripts/deployment/deploy-production.sh

set -e

echo "🚀 OnaAseyori Production Deployment"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
DEPLOYMENT_ID=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/futureskills/deployment_${DEPLOYMENT_ID}.log"

# Logging functions
log() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
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

# Validation functions
validate_environment() {
    log "Validating environment configuration..."
    
    # Check required files
    for file in ".env.production" "docker-compose.prod.yml" "docker-compose.monitoring.yml"; do
        if [ ! -f "$file" ]; then
            error "Missing required file: $file"
            exit 1
        fi
    done
    
    # Check environment variables
    if [ -z "$DATABASE_URL" ] || [ -z "$SECRET_KEY" ] || [ -z "$AWS_ACCESS_KEY_ID" ]; then
        error "Missing required environment variables"
        exit 1
    fi
    
    success "Environment validation passed"
}

check_dependencies() {
    log "Checking system dependencies..."
    
    # Required commands
    for cmd in docker docker-compose aws git openssl; do
        if ! command -v $cmd &> /dev/null; then
            error "Missing dependency: $cmd"
            exit 1
        fi
    done
    
    # Docker daemon check
    if ! docker info &> /dev/null; then
        error "Docker daemon is not running"
        exit 1
    fi
    
    success "All dependencies available"
}

deploy_database() {
    log "Deploying database..."
    
    # Backup current database
    log "Creating pre-deployment backup..."
    ./scripts/backup/automated-backup.sh daily
    
    # Run migrations
    log "Running database migrations..."
    docker-compose -f docker-compose.prod.yml run --rm backend \
        python -m alembic upgrade head
    
    # Verify migrations
    log "Verifying database state..."
    docker-compose -f docker-compose.prod.yml exec postgres-primary \
        psql -U futureskills_admin -d futureskills_prod -c "\dt"
    
    success "Database deployment completed"
}

deploy_backend() {
    log "Deploying backend application..."
    
    # Build backend image
    log "Building backend Docker image..."
    docker build -f backend/Dockerfile.prod -t futureskills-backend:latest ./backend
    
    # Stop and remove old containers
    log "Stopping existing backend containers..."
    docker-compose -f docker-compose.prod.yml stop backend || true
    docker-compose -f docker-compose.prod.yml rm -f backend || true
    
    # Start new container
    log "Starting new backend container..."
    docker-compose -f docker-compose.prod.yml up -d backend
    
    # Health check
    log "Performing health check..."
    sleep 10
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        success "Backend health check passed"
    else
        error "Backend health check failed"
        exit 1
    fi
    
    success "Backend deployment completed"
}

deploy_frontend() {
    log "Deploying frontend application..."
    
    # Build frontend
    log "Building frontend..."
    cd frontend/web
    npm ci
    npm run build
    
    # Deploy to S3 and CloudFront
    log "Deploying to CDN..."
    npm run deploy:prod
    
    cd ../..
    
    success "Frontend deployment completed"
}

deploy_monitoring() {
    log "Deploying monitoring stack..."
    
    # Start monitoring services
    docker-compose -f docker-compose.monitoring.yml up -d
    
    # Wait for services to be ready
    sleep 30
    
    # Verify services
    for service in prometheus grafana alertmanager; do
        if docker-compose -f docker-compose.monitoring.yml ps | grep "$service.*Up" > /dev/null; then
            log "$service is running"
        else
            warning "$service may not be running properly"
        fi
    done
    
    success "Monitoring stack deployed"
}

run_tests() {
    log "Running post-deployment tests..."
    
    # API tests
    log "Testing API endpoints..."
    endpoints=(
        "https://api.futureskillssyntax.com/health"
        "https://api.futureskillssyntax.com/api/v1/auth/health"
        "https://api.futureskillssyntax.com/docs"
    )
    
    for endpoint in "${endpoints[@]}"; do
        if curl -s -o /dev/null -w "%{http_code}" "$endpoint" | grep -q "200"; then
            log "✓ $endpoint"
        else
            error "✗ $endpoint"
            return 1
        fi
    done
    
    # Frontend tests
    log "Testing frontend..."
    if curl -s -o /dev/null -w "%{http_code}" "https://app.futureskillssyntax.com" | grep -q "200"; then
        log "✓ Frontend is accessible"
    else
        error "✗ Frontend is not accessible"
        return 1
    fi
    
    # Database connectivity test
    log "Testing database connectivity..."
    if docker-compose -f docker-compose.prod.yml exec backend \
        python -c "import asyncio; from app.core.database import engine; import asyncio; async def test(): async with engine.connect(): print('OK'); asyncio.run(test())"; then
        log "✓ Database connectivity test passed"
    else
        error "✗ Database connectivity test failed"
        return 1
    fi
    
    success "All post-deployment tests passed"
}

cleanup() {
    log "Cleaning up old resources..."
    
    # Remove old Docker images
    log "Removing old Docker images..."
    docker image prune -af --filter "until=24h"
    
    # Clean up Docker volumes
    log "Cleaning up unused volumes..."
    docker volume prune -f
    
    # Remove old logs
    log "Cleaning up old logs..."
    find /var/log/futureskills -name "*.log" -mtime +7 -delete
    
    success "Cleanup completed"
}

notify_deployment() {
    local status=$1
    
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
                        \"title\": \"$emoji FutureSkillsSyntax Deployment $status\",
                        \"fields\": [
                            {
                                \"title\": \"Environment\",
                                \"value\": \"$ENVIRONMENT\",
                                \"short\": true
                            },
                            {
                                \"title\": \"Deployment ID\",
                                \"value\": \"$DEPLOYMENT_ID\",
                                \"short\": true
                            },
                            {
                                \"title\": \"Timestamp\",
                                \"value\": \"$(date)\",
                                \"short\": false
                            }
                        ]
                    }
                ]
            }" \
            "$SLACK_WEBHOOK_URL"
    fi
}

# Main deployment process
main() {
    log "Starting FutureSkillsSyntax deployment to $ENVIRONMENT"
    log "Deployment ID: $DEPLOYMENT_ID"
    
    # Step 1: Validate
    validate_environment
    check_dependencies
    
    # Step 2: Pull latest code
    log "Pulling latest code..."
    git pull origin main
    
    # Step 3: Deploy components
    deploy_database
    deploy_backend
    deploy_frontend
    deploy_monitoring
    
    # Step 4: Run tests
    if run_tests; then
        success "Deployment validation successful"
    else
        error "Deployment validation failed"
        notify_deployment "failed"
        exit 1
    fi
    
    # Step 5: Cleanup
    cleanup
    
    # Step 6: Notify
    notify_deployment "success"
    
    success "🎉 FutureSkillsSyntax deployment to $ENVIRONMENT completed successfully!"
    log "Deployment completed at: $(date)"
    log "Log file: $LOG_FILE"
}

# Handle script arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        *)
            error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Execute main function
if [ "$DRY_RUN" = true ]; then
    log "Dry run mode enabled. Would execute:"
    log "  Environment: $ENVIRONMENT"
    log "  Skip tests: ${SKIP_TESTS:-false}"
else
    main
fi