#!/bin/bash

# Configuration
TARGETS=("apps/api" "apps/mobile" "packages" "infrastructure" ".github/workflows" "docs")
BACKEND_SRC="backend"
FRONTEND_SRC="frontend"

echo "--- Initializing Monorepo Restructure ---"

# 1. Create directory structure
for dir in "${TARGETS[@]}"; do
    mkdir -p "$dir" && echo "✅ Created $dir" || echo "❌ Failed $dir"
done

# 2. Copy files (Safety first: copy, don't move)
cp -R "$BACKEND_SRC/"* "apps/api/"
cp -R "$FRONTEND_SRC/"* "apps/mobile/"
echo "✅ Files copied to target directories"

# 3. Verification
if [ -f "apps/api/package.json" ] && [ -f "apps/mobile/package.json" ]; then
    echo "✅ Verification successful: package.json files exist in target directories."
else
    echo "❌ Verification failed: Critical files missing."
    exit 1
fi

echo "--- Restructure Preview Complete ---"
echo "Review the files in apps/api/ and apps/mobile/."
read -p "Are you sure you want to delete the original $BACKEND_SRC/ and $FRONTEND_SRC/ directories? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -rf "$BACKEND_SRC" "$FRONTEND_SRC"
    echo "✅ Originals removed."
else
    echo "⚠️ Originals kept. Manual cleanup required."
fi