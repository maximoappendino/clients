#!/usr/bin/env bash
# Usage:
#   ./serve.sh                        → list available examples
#   ./serve.sh saas/lawyer            → serve that example on :3000
#   ./serve.sh saas/lawyer 8080       → custom port

ROOT="$(cd "$(dirname "$0")" && pwd)"
EXAMPLES="$ROOT/_examples"

if [ -z "$1" ]; then
  echo ""
  echo "  Available examples:"
  echo ""
  for dir in "$EXAMPLES"/*/*; do
    [ -f "$dir/index.html" ] && echo "    ./serve.sh $(basename $(dirname $dir))/$(basename $dir)"
  done
  echo ""
  echo "  Usage: ./serve.sh <category/name> [port]"
  echo ""
  exit 0
fi

PORT="${2:-3000}"

# Resolve target: check _examples/ first, then root clients/ folder
if [ -f "$EXAMPLES/$1/index.html" ]; then
  TARGET="$EXAMPLES/$1"
  DISPLAY="_examples/$1"
elif [ -f "$ROOT/$1/index.html" ]; then
  TARGET="$ROOT/$1"
  DISPLAY="$1"
else
  echo "Not found: $1 (looked in _examples/$1 and $1/)"
  exit 1
fi

echo ""
echo "  Serving: $DISPLAY"
echo "  URL:     http://localhost:$PORT/$DISPLAY/"
echo "  Ctrl+C to stop."
echo ""

cd "$ROOT"
python3 -m http.server "$PORT"
