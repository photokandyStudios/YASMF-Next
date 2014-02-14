#!/bin/sh
#
# Build script for yasmf-util
#
# execute in project root
#
# requires node to be installed
#
#
# Copy assets
echo "Copying assets..."
cp -r ./lib/yasmf-assets ./dist
#
# Build RequireJS
echo "RequireJS Build..."
node ./vendor/requirejs/node_modules/requirejs/bin/r.js -o ./build.js
#
# compile SASS (requires sass from sass-lang.com)
echo "SASS Build..."
sass --trace ./lib/yasmf.scss ./dist/yasmf.css
echo "Done."


