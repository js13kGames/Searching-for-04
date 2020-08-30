#!/bin/sh
cp -av *.png ../dist/
cp -av *.txt ../dist/
cp index.html index.css ../dist/
rollup mainloop.js --format cjs --file ../dist/bundle.js
cd ../dist
terser bundle.js -o mainloop.js --compress --mangle --mangle-props --timings --toplevel --module --mangle-props
#rm bundle.js