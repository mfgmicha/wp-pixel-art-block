#!/bin/bash

rm -rf output
mkdir -p output
bunx @wp-playground/cli@latest \
    run-blueprint \
    --mount=./pixel-art-creator.zip:/plugin.zip \
    --mount=./.wordpress/export-static-site:/wordpress/wp-content/plugins/export-static-site \
    --mount=./output:/output \
    --blueprint=.wordpress/blueprint-gh-pages.json

cd output
unzip -q export.zip
rm export.zip
