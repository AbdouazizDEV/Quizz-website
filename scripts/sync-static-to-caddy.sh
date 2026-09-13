#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-$ROOT/../Quizzback/server/deploy/powerful/static}"

echo "Build Quizzweb…"
npm --prefix "$ROOT" run build

echo "Sync dist → $TARGET"
mkdir -p "$TARGET"
rsync -a --delete "$ROOT/dist/" "$TARGET/"

echo "OK — copiez deploy/powerful/static sur le VPS (/srv/quizzweb) ou relancez Caddy."
