#!/bin/sh
#
# Build script for yasmf-next
# execute in project root
# requires requirejs, js-beautify, groc, sass to be installed
#
# Copy assets
echo "Copying assets..."
cp -r ./resources/ai-export/images/*.png ./lib/yasmf-assets
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
# GZIP (so we can get compression savings)
echo "GZIPping..."
gzip < ./dist/yasmf.min.js > ./dist/yasmf.min.js.gzip
gzip < ./dist/yasmf.css > ./dist/yasmf.css.gzip

# generate docs
groc
docco --layout parallel --output ./docco ./lib/yasmf.js ./lib/yasmf.scss
docco --layout parallel --output ./docco/ui ./lib/yasmf/ui/*.js
docco --layout parallel --output ./docco/util ./lib/yasmf/util/*.js
