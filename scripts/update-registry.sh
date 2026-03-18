#!/bin/bash

# Script to update and publish Duckit registry
set -e

echo "🔄 Updating Duckit Registry..."

# Navigate to project root
cd "$(dirname "$0")/.."

# Generate registry with latest component files
echo "📦 Generating registry..."
cd packages/duckit-cli
npm run generate-registry

# Navigate to registry folder
cd ../../registry

# Check if there are changes
if git diff --quiet registry.json; then
    echo "✅ No changes to registry"
else
    echo "📝 Changes detected in registry.json"
    
    # Bump version and publish
    echo "🚀 Publishing new version..."
    npm version patch
    npm publish --access public
    
    # Commit changes
    git add registry.json package.json
    git commit -m "chore: Update registry [skip ci]"
    git push origin main
    
    echo "✅ Registry updated and published!"
fi
