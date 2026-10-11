#!/usr/bin/env bash
# ==============================================================================
# 01Blog - Database Reset Script (Fresh Database & Pristine State)
# ==============================================================================

set -e

PORT=5432
DB_NAME="blog_db"

echo "=================================================="
echo "🧹 01Blog - Resetting Database & Media to Clean State"
echo "=================================================="

# Ensure rootless docker paths if installed
export PATH="$HOME/bin:$HOME/.docker/cli-plugins:$HOME/.local/pgsql/usr/lib/postgresql/16/bin:$HOME/.local/pgsql/usr/bin:$PATH"
export LD_LIBRARY_PATH="$HOME/.local/pgsql/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH"
if [ -z "$DOCKER_HOST" ] && [ -S "$XDG_RUNTIME_DIR/docker.sock" ]; then
    export DOCKER_HOST="unix://$XDG_RUNTIME_DIR/docker.sock"
fi

# Check if running via Docker
if command -v docker >/dev/null 2>&1 && docker ps | grep -q "01blog-postgres"; then
    echo "🐳 Resetting Docker PostgreSQL volume..."
    docker compose down -v || docker-compose down -v
    docker compose up -d || docker-compose up -d
    echo "Waiting for Docker PostgreSQL to be ready..."
    sleep 2
else
    # 1. Terminate any active connections to blog_db in user-space
    echo "1. Disconnecting active sessions..."
    psql -h localhost -p $PORT -U postgres -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();" >/dev/null 2>&1 || true

    # 2. Drop and recreate blog_db
    echo "2. Recreating '$DB_NAME'..."
    psql -h localhost -p $PORT -U postgres -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
    psql -h localhost -p $PORT -U postgres -d postgres -c "CREATE DATABASE $DB_NAME;"
    psql -h localhost -p $PORT -U postgres -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO postgres;"
fi

# 3. Clean test media uploads (preserving preset avatars)
echo "3. Cleaning test upload media..."
if [ -d "backend/uploads" ]; then
    find backend/uploads -maxdepth 1 -type f -delete 2>/dev/null || true
fi

echo "=================================================="
echo "✅ Database '$DB_NAME' is completely clean!"
echo "👉 Now start your backend: cd backend && ./mvnw spring-boot:run"
echo "👉 Now start your frontend: cd frontend && npm start"
echo "👉 The FIRST user to register will automatically become ROLE_ADMIN."
echo "=================================================="
