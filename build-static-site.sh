#!/bin/bash

set -x

echo "=== Starting static site generation ==="
echo "Cleaning output directory..."
rm -rf output
mkdir -p output
echo "Running WordPress Playground blueprint..."
bunx @wp-playground/cli@latest \
    run-blueprint \
    --mount=./pixel-art-creator.zip:/plugin.zip \
    --mount=./.wordpress/export-static-site:/wordpress/wp-content/plugins/export-static-site \
    --mount=./output:/output \
    --blueprint=.wordpress/blueprint-gh-pages.json

echo "Checking for export.zip..."
ls -la output/
if [ ! -f output/export.zip ]; then
    echo "ERROR: export.zip not found!"
    exit 1
fi
echo "Extracting static site..."
cd output
unzip -q export.zip
rm export.zip
echo "=== Done! ==="
