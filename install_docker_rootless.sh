#!/usr/bin/env bash
# ==============================================================================
# 01Blog - Rootless Docker Installer for Zone01 Student Workstations
# ==============================================================================

set -e

echo "📦 Installing Docker (rootless)..."

# Download and install Docker rootless (with SKIP_IPTABLES=1 for Zone01 non-sudo compatibility)
curl -fsSL https://get.docker.com/rootless | SKIP_IPTABLES=1 sh

echo "✅ Docker rootless installed."

# Run rootless setup, skip iptables check, continue on error
echo "⚙️ Running dockerd-rootless-setuptool.sh with --skip-iptables..."
~/bin/dockerd-rootless-setuptool.sh install --skip-iptables || echo "⚠️ Skipping setup tool errors."

# Set up environment variables for both bash and zsh
echo "⚙️ Setting up environment variables..."

for rc in ~/.zshrc ~/.bashrc; do
  if [ -f "$rc" ]; then
    if ! grep -q "DOCKER_HOST" "$rc"; then
      echo 'export PATH=$HOME/bin:$PATH' >> "$rc"
      echo 'export DOCKER_HOST=unix://$XDG_RUNTIME_DIR/docker.sock' >> "$rc"
    fi
  fi
done

export PATH=$HOME/bin:$PATH
export DOCKER_HOST=unix://$XDG_RUNTIME_DIR/docker.sock

echo "✅ Environment configured."

# Start the rootless Docker daemon in background
echo "🚀 Starting Docker daemon (rootless) in background..."
nohup dockerd-rootless.sh > ~/docker-rootless.log 2>&1 &

echo "✅ Docker daemon started in background (log: ~/docker-rootless.log)"

# Install Docker Compose v2
echo "📦 Installing Docker Compose v2..."
mkdir -p ~/.docker/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.26.1/docker-compose-linux-x86_64 \
  -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose

for rc in ~/.zshrc ~/.bashrc; do
  if [ -f "$rc" ]; then
    if ! grep -q "cli-plugins" "$rc"; then
      echo 'export PATH=$HOME/.docker/cli-plugins:$PATH' >> "$rc"
    fi
  fi
done

export PATH=$HOME/.docker/cli-plugins:$PATH

echo "✅ Docker Compose installed."

# Verify installation
echo "🔍 Verifying installation..."
docker --version || echo "⚠️ Docker not found in PATH yet."
docker compose version || echo "⚠️ Docker Compose not found in PATH yet."

echo ""
echo "✅ All done! Run 'source ~/.zshrc' or 'source ~/.bashrc' to apply environment changes."
