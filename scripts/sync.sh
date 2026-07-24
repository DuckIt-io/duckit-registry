#!/bin/bash
# Sync components from DuckitIo source to duckit-registry
# Usage: SOURCE_DIR=/path/to/components bash scripts/sync.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Source: can be overridden via env var
SOURCE_DIR="${SOURCE_DIR:-/home/alpiawo/Projects/Alfi/MyDevelop/web/DuckitIo/src/components/ui}"

# Destination
DEST_DIR="$PROJECT_ROOT/src/components/ui"

echo "Syncing components from DuckitIo..."
echo "  Source: $SOURCE_DIR"
echo "  Destination: $DEST_DIR"

mkdir -p "$DEST_DIR"

count=0
skipped=0
for file in "$SOURCE_DIR"/*.tsx; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    if [[ "$filename" != *.stories.tsx ]]; then
      cp "$file" "$DEST_DIR/"
      echo "    $filename"
      count=$((count + 1))
    else
      echo "    $filename (skipped)"
      skipped=$((skipped + 1))
    }
  fi
done

echo ""
echo "Sync complete! Copied: $count, Skipped: $skipped"
echo ""
echo "Next: cd packages/cli && npm run generate-registry"
