#!/bin/bash
set -e

echo "🦕 Dino-Atlas: Seeding PocketBase..."

PB_URL="${POCKETBASE_URL:-http://localhost:8090}"
PB_EMAIL="${POCKETBASE_ADMIN_EMAIL:-admin@example.com}"
PB_PASSWORD="${POCKETBASE_ADMIN_PASSWORD}"

if [ -z "$PB_PASSWORD" ]; then
  echo "Error: POCKETBASE_ADMIN_PASSWORD not set"
  exit 1
fi

echo "PocketBase URL: $PB_URL"
echo "Admin: $PB_EMAIL"

# TODO: Import collections schema
# TODO: Seed dino species data
# TODO: Seed AI models & routing config

echo "✅ Seeding complete!"
