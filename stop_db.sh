#!/usr/bin/env bash
# ==============================================================================
# 01Blog - Database Shutdown Script
# ==============================================================================

set -e

echo "=================================================="
echo "🛑 01Blog - Stopping Database Service"
echo "=================================================="

# Stop Docker container if running
if command -v docker >/dev/null 2>&1 && docker ps | grep -q "01blog-postgres"; then
    echo "Stopping Docker container..."
    docker compose down || docker-compose down
    echo "✅ Docker database stopped."
    exit 0
fi

# Stop Zone01 user-space pg_ctl if running
PGSQL_BIN="$HOME/.local/pgsql/usr/lib/postgresql/16/bin"
PGDATA_DIR="$HOME/pgdata"

if [ -d "$PGSQL_BIN" ] && [ -d "$PGDATA_DIR" ]; then
    export PATH="$PGSQL_BIN:$HOME/.local/pgsql/usr/bin:$PATH"
    if pg_ctl -D "$PGDATA_DIR" status >/dev/null 2>&1; then
        echo "Stopping Zone01 user-space pg_ctl..."
        pg_ctl -D "$PGDATA_DIR" stop
        echo "✅ Zone01 PostgreSQL stopped."
        exit 0
    fi
fi

echo "ℹ️ No running database service found."
