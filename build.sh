#!/bin/sh
#
# Build script for yasmf-next
# execute in project root
# requires requirejs, js-beautify, groc, sass to be installed
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
r.js -o ./build.js
r.js -o ./build-min.js
#
# compile SASS (requires sass from sass-lang.com)
echo "SASS Build..."
sass --trace ./lib/yasmf.scss ./dist/yasmf.css
echo "Done."
#
# generate docs
groc

