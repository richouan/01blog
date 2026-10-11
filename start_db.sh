#!/usr/bin/env bash
# ==============================================================================
# 01Blog - Database Startup Script
# ==============================================================================
# Automatically detects the running environment:
# 1. If PostgreSQL is already running on port 5432, informs the developer.
# 2. If Docker is available, spins up the official PostgreSQL 16 container.
# 3. If in Zone01 non-sudo Linux workstation, starts user-space pg_ctl under ~/pgdata.
# ==============================================================================

set -e

# Include rootless docker paths if installed
export PATH="$HOME/bin:$HOME/.docker/cli-plugins:$PATH"
if [ -z "$DOCKER_HOST" ] && [ -S "$XDG_RUNTIME_DIR/docker.sock" ]; then
    export DOCKER_HOST="unix://$XDG_RUNTIME_DIR/docker.sock"
fi

PORT=5432
DB_NAME="blog_db"

echo "=================================================="
echo "🐘 01Blog - PostgreSQL Database Service Manager"
echo "=================================================="

# Check if PostgreSQL is already accessible on port 5432
if nc -z localhost $PORT 2>/dev/null || timeout 1 bash -c "cat < /dev/null > /dev/tcp/127.0.0.1/$PORT" 2>/dev/null; then
    echo "✅ PostgreSQL is already active and listening on port $PORT."
    exit 0
fi

# Check if Docker is installed. If not, auto-install rootless Docker
if ! command -v docker >/dev/null 2>&1; then
    echo "📦 Docker not detected. Automatically installing rootless Docker for Zone01..."
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    if [ -f "$SCRIPT_DIR/install_docker_rootless.sh" ]; then
        bash "$SCRIPT_DIR/install_docker_rootless.sh"
    elif [ -f "./install_docker_rootless.sh" ]; then
        bash "./install_docker_rootless.sh"
    fi
    export PATH="$HOME/bin:$HOME/.docker/cli-plugins:$PATH"
    export DOCKER_HOST="unix://$XDG_RUNTIME_DIR/docker.sock"
fi

# Case 1: Docker is available
if command -v docker >/dev/null 2>&1; then
    # Ensure Docker daemon is running
    if ! docker info >/dev/null 2>&1; then
        echo "🚀 Starting rootless Docker daemon..."
        systemctl --user start docker.service 2>/dev/null || nohup dockerd-rootless.sh > ~/docker-rootless.log 2>&1 &
        sleep 3
    fi

    echo "🐳 Starting PostgreSQL 16 container via Docker Compose..."
    docker compose up -d postgres || docker-compose up -d postgres
    echo "✅ PostgreSQL started inside Docker container on port $PORT."
    exit 0
fi

# Case 2: Zone01 Non-Sudo Linux Environment (~/.local/pgsql & ~/pgdata)
PGSQL_BIN="$HOME/.local/pgsql/usr/lib/postgresql/16/bin"
PGSQL_LIB="$HOME/.local/pgsql/usr/lib/x86_64-linux-gnu"
PGDATA_DIR="$HOME/pgdata"

if [ -d "$PGSQL_BIN" ] && [ -d "$PGDATA_DIR" ]; then
    echo "🐧 Zone01 user-space PostgreSQL detected."
    export PATH="$PGSQL_BIN:$HOME/.local/pgsql/usr/bin:$PATH"
    export LD_LIBRARY_PATH="$PGSQL_LIB:$LD_LIBRARY_PATH"

    echo "Starting pg_ctl service under $PGDATA_DIR..."
    pg_ctl -D "$PGDATA_DIR" -o "-k /tmp -p $PORT" -l "$PGDATA_DIR/logfile" start

    sleep 1

    # Verify if blog_db exists, create if not
    if ! psql -h localhost -p $PORT -U postgres -lqt 2>/dev/null | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
        echo "Creating database '$DB_NAME'..."
        createdb -h localhost -p $PORT -U postgres "$DB_NAME" 2>/dev/null || true
    fi

    echo "✅ Zone01 user-space PostgreSQL 16 is now running on port $PORT."
    exit 0
fi

echo "❌ Could not find Docker or Zone01 user-space PostgreSQL in $PGSQL_BIN."
echo "Please verify your database configuration or install Docker."
exit 1
