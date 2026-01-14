#!/bin/bash
# scripts/verification/verify-production.sh

set -e

echo "🔍 Verifying OnaAseyori Production Setup"
echo "================================================"

check_service() {
    local service=$1
    local url=$2
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
        echo "✅ $service is accessible"
        return 0
    else
        echo "❌ $service is not accessible"
        return 1
    fi
}

check_database() {
    echo "Checking database connectivity..."
    
    if docker-compose -f docker-compose.prod.yml exec postgres-primary \
        pg_isready -U futureskills_admin; then
        echo "✅ Database is accessible"
        return 0
    else
        echo "❌ Database is not accessible"
        return 1
    fi
}

check_redis() {
    echo "Checking Redis connectivity..."
    
    if docker-compose -f docker-compose.prod.yml exec redis \
        redis-cli ping | grep -q "PONG"; then
        echo "✅ Redis is accessible"
        return 0
    else
        echo "❌ Redis is not accessible"
        return 1
    fi
}

check_ssl() {
    echo "Checking SSL certificates..."
    
    local domains=(
        "api.futureskillssyntax.com"
        "app.futureskillssyntax.com"
        "admin.futureskillssyntax.com"
    )
    
    for domain in "${domains[@]}"; do
        if echo | openssl s_client -connect "$domain:443" -servername "$domain" 2>/dev/null | \
            openssl x509 -noout -dates | grep -q "notAfter"; then
            echo "✅ SSL certificate for $domain is valid"
        else
            echo "❌ SSL certificate for $domain is invalid or missing"
            return 1
        fi
    done
}

check_monitoring() {
    echo "Checking monitoring services..."
    
    local services=(
        "http://localhost:9090"  # Prometheus
        "http://localhost:3001"  # Grafana
        "http://localhost:9093"  # AlertManager
    )
    
    for service in "${services[@]}"; do
        if curl -s -o /dev/null -w "%{http_code}" "$service" | grep -q "200\|302\|401"; then
            echo "✅ Monitoring service at $service is accessible"
        else
            echo "❌ Monitoring service at $service is not accessible"
            return 1
        fi
    done
}

check_backups() {
    echo "Checking backup configuration..."
    
    # Check if backup script exists
    if [ -f "scripts/backup/automated-backup.sh" ]; then
        echo "✅ Backup script exists"
    else
        echo "❌ Backup script missing"
        return 1
    fi
    
    # Check if cron job is set up
    if crontab -l | grep -q "automated-backup.sh"; then
        echo "✅ Backup cron job is configured"
    else
        echo "⚠️  Backup cron job is not configured"
    fi
}

# Run all checks
echo ""
echo "Running production verification checks..."
echo ""

failed_checks=0

check_service "Backend API" "https://api.futureskillssyntax.com/health" || ((failed_checks++))
check_service "Frontend App" "https://app.futureskillssyntax.com" || ((failed_checks++))
check_service "Admin Dashboard" "https://admin.futureskillssyntax.com" || ((failed_checks++))
check_database || ((failed_checks++))
check_redis || ((failed_checks++))
check_ssl || ((failed_checks++))
check_monitoring || ((failed_checks++))
check_backups || ((failed_checks++))

echo ""
echo "================================================"

if [ $failed_checks -eq 0 ]; then
    echo "🎉 All production checks passed! OnaAseyori is ready."
    exit 0
else
    echo "⚠️  $failed_checks check(s) failed. Please review and fix."
    exit 1
fi