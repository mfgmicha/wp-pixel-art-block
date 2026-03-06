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
    --mount=./output:/output \
    --blueprint=.wordpress/blueprint-gh-pages.json

echo "Checking for index.html..."
ls -la output/
if [ ! -f output/index.html ]; then
    echo "ERROR: index.html not found!"
    exit 1
fi
echo "=== Done! ==="
