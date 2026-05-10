#!/bin/bash
# Dummy deploy script for honeypot
# This script is intentionally simple - attackers may replace it

echo "Starting deployment..."
echo "Environment: staging"
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

# Simulate deployment steps
sleep 1
echo "Deploying application..."

sleep 1
echo "Deployment complete!"

exit 0
