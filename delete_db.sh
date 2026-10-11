#!/usr/bin/env bash
# ==============================================================================
# 01Blog - Database Deletion Script (Wipes Database, Volumes & Uploads)
# ==============================================================================

set -e

echo "=================================================="
echo "🗑️  01Blog - Deleting Database and Volumes"
echo "=================================================="

export PATH="$HOME/bin:$HOME/.docker/cli-plugins:$HOME/.local/pgsql/usr/lib/postgresql/16/bin:$HOME/.local/pgsql/usr/bin:$PATH"
export LD_LIBRARY_PATH="$HOME/.local/pgsql/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH"
if [ -z "$DOCKER_HOST" ] && [ -S "$XDG_RUNTIME_DIR/docker.sock" ]; then
    export DOCKER_HOST="unix://$XDG_RUNTIME_DIR/docker.sock"
fi

# 1. Stop and remove Docker containers and volumes
if command -v docker >/dev/null 2>&1 && docker ps -a | grep -q "01blog-postgres"; then
    echo "🐳 Removing Docker container and volume..."
    docker compose down -v || docker-compose down -v
    echo "✅ Docker database and volumes destroyed."
fi

# 2. Drop user-space PostgreSQL database if running
if command -v psql >/dev/null 2>&1; then
    echo "Disconnecting active PostgreSQL sessions..."
    psql -h localhost -p 5432 -U postgres -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'blog_db' AND pid <> pg_backend_pid();" >/dev/null 2>&1 || true
    echo "Dropping database 'blog_db'..."
    psql -h localhost -p 5432 -U postgres -d postgres -c "DROP DATABASE IF EXISTS blog_db;" >/dev/null 2>&1 || true
fi

# 3. Clean test media uploads (preserving preset avatars)
echo "Cleaning test upload media..."
if [ -d "backend/uploads" ]; then
    find backend/uploads -maxdepth 1 -type f -delete 2>/dev/null || true
fi

echo "=================================================="
echo "✅ Database completely deleted and removed."
echo "👉 Now you can run './mvnw spring-boot:run' to test fresh startup!"
echo "=================================================="
