#!/bin/bash

# Build and start containers
echo "Building and starting containers..."
docker compose up -d --build

# Show logs
echo "Showing logs..."
docker compose logs -f &

# Run Prisma migrations
echo "Running Prisma migrations..."
docker compose exec web npx prisma migrate deploy

echo "All done!" 