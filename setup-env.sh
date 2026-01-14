#!/bin/bash

# Generate secure secrets
export PRODUCTION_SECRET_KEY=$(openssl rand -hex 32)
export DB_PASSWORD=$(openssl rand -hex 16)
export REDIS_PASSWORD=$(openssl rand -hex 16)

# Load environment variables
set -a
source .env.production
set +a

# Create Kubernetes secrets (if using K8s)
kubectl create secret generic futureskills-secrets \
  --from-literal=database-url="${DATABASE_URL}" \
  --from-literal=secret-key="${SECRET_KEY}" \
  --from-literal=redis-url="${REDIS_URL}" \
  --dry-run=client -o yaml > kubernetes/secrets.yaml

# Create Docker secrets
echo "${DB_PASSWORD}" | docker secret create db_password -
echo "${SECRET_KEY}" | docker secret create app_secret -