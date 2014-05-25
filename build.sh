#!/bin/sh
#
# Build script for yasmf-util
# execute in project root
# requires node, js-beautify, groc to be installed
#
# Copy assets
echo "Copying assets..."
cp -r ./lib/yasmf-assets ./dist
#
# beautify
echo "Beautifying lib, site, demo, dist..."
sh ./beautify.shl
#
# Build RequireJS
echo "RequireJS Build..."
node ./vendor/requirejs/node_modules/requirejs/bin/r.js -o ./build.js
node ./vendor/requirejs/node_modules/requirejs/bin/r.js -o ./build-min.js
#
# compile SASS (requires sass from sass-lang.com)
echo "SASS Build..."
sass --trace ./lib/yasmf.scss ./dist/yasmf.css
echo "Done."
#
# generate docs
groc

