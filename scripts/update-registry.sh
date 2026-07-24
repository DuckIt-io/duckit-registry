#!/bin/bash

# Script to update and publish Duckit registry
set -e

echo "Updating Duckit Registry..."

cd "$(dirname "$0")/.."

echo "Generating registry..."
cd packages/cli
npm run generate-registry

cd ../../registry

if git diff --quiet registry.json; then
    echo "No changes to registry"
else
    echo "Changes detected in registry.json"
    echo "Publishing new version..."
    npm version patch
    npm publish --access public

    git add registry.json package.json
    git commit -m "chore: update registry [skip ci]"
    git push origin main

    echo "Registry updated and published!"
fi
