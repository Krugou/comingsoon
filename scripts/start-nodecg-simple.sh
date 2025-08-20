#!/bin/bash
set -euo pipefail

echo "[nodecg] Starting NodeCG with live 'comingsoon' bundle (bash script)..."

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( dirname "$SCRIPT_DIR" )"
INSTANCE_DIR="$ROOT_DIR/nodecg-instance"
BUNDLE_NAME="comingsoon"
BUNDLES_DIR="$INSTANCE_DIR/bundles"
BUNDLE_LINK="$BUNDLES_DIR/$BUNDLE_NAME"
PORT="${PORT:-9090}"

mkdir -p "$BUNDLES_DIR"

if [ ! -f "$INSTANCE_DIR/package.json" ]; then
  echo "[nodecg] Creating NodeCG instance directory..."
  mkdir -p "$INSTANCE_DIR"
  cat > "$INSTANCE_DIR/package.json" << 'EOF'
{
  "name": "nodecg-instance",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "nodecg": "^2.2.1"
  }
}
EOF
fi

if [ ! -L "$INSTANCE_DIR/node_modules" ]; then
  if [ -d "$ROOT_DIR/node_modules" ]; then
    ln -s "$ROOT_DIR/node_modules" "$INSTANCE_DIR/node_modules"
  fi
fi

if [ ! -d "$ROOT_DIR/node_modules/nodecg" ]; then
  echo "[nodecg] Installing dependencies in root..."
  ( cd "$ROOT_DIR" && npm install )
fi

if [ ! -L "$BUNDLE_LINK" ] && [ ! -d "$BUNDLE_LINK" ]; then
  echo "[nodecg] Linking bundle -> $BUNDLE_LINK"
  if ln -s "$ROOT_DIR" "$BUNDLE_LINK" 2>/dev/null; then
    echo "[nodecg] Symlink created."
  else
    echo "[nodecg] Symlink failed, falling back to copy."
    rsync -a --delete --exclude 'nodecg-instance' --exclude 'node_modules' "$ROOT_DIR/" "$BUNDLE_LINK/"
  fi
fi

echo "[nodecg] Launching on port $PORT ..."
echo "[nodecg] Graphics: http://localhost:$PORT/bundles/$BUNDLE_NAME/graphics/"
echo "[nodecg] Dashboard: http://localhost:$PORT/#/bundle/$BUNDLE_NAME"

cd "$INSTANCE_DIR"
exec npx nodecg start --port "$PORT"
# ...existing code...

echo "[nodecg] Launching on port $PORT ..."
echo "[nodecg] Graphics: http://localhost:$PORT/bundles/$BUNDLE_NAME/graphics/"
echo "[nodecg] Dashboard: http://localhost:$PORT/#/bundle/$BUNDLE_NAME"

cd "$INSTANCE_DIR"
exec npx nodecg start --port "$PORT"
