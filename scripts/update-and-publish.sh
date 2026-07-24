#!/bin/bash

# Complete workflow: Sync -> Generate -> Publish

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "========================================"
echo "  Duckit Registry Update Workflow"
echo "========================================"
echo ""

echo "Step 1/3: Syncing components..."
bash "$SCRIPT_DIR/sync.sh"
echo ""

echo "Step 2/3: Generating registry..."
cd "$PROJECT_ROOT/packages/cli"

if [ ! -d "node_modules" ]; then
    npm install
fi

npm run generate-registry
echo ""

echo "========================================"
echo "  Registry Generated Successfully!"
echo "========================================"
echo ""
echo "To publish registry:"
echo "  cd $PROJECT_ROOT/registry"
echo "  npm version patch"
echo "  npm publish --access public"
echo ""
echo "To publish CLI (if updated):"
echo "  cd $PROJECT_ROOT/packages/cli"
echo "  npm version patch"
echo "  npm publish --access public"
