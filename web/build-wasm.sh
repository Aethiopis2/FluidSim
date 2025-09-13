#!/usr/bin/env bash
EMCC=emcc

$EMCC ../sim/sph.cpp ../sim/bindings.cpp \
    -o public/sph.js \
    -s MODULARIZE \
    -s EXPORT_ES6=1 \
    -s ENVIRONMENT=web \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s EXPORTED_RUNTIME_METHODS='["HEAPF32"]' \
    --bind
echo "sph.wasm build finished & sph.js generated"