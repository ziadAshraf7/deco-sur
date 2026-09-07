#!/bin/sh
set -e

echo "Waiting for database at ${DB_HOST:-mysql}:${DB_PORT:-3306}..."
# Small wait loop so we don't race the mysql container on first boot
ATTEMPTS=0
until node -e "require('net').createConnection({host: process.env.DB_HOST || 'mysql', port: process.env.DB_PORT || 3306}).on('connect', () => process.exit(0)).on('error', () => process.exit(1))"; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "$ATTEMPTS" -ge 30 ]; then
    echo "Database did not become available in time." >&2
    exit 1
  fi
  sleep 2
done

echo "Applying Prisma migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec "$@"
