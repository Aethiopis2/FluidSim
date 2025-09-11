#!/usr/bin/env bash
EMCC=emcc # assume emsdk activated

$EMCC ../sim/sph.cpp ../sim/bindings.cpp -O3 -s WASM=1 \
  -s MODULARIZE=1 -s EXPORT_NAME="createSphModule" \
  -s EXPORTED_FUNCTIONS='["_SPH_Init","_SPH_Step","_SPH_GetX","_SPH_GetY","_SPH_Count"]' \
  -s EXPORTED_RUNTIME_METHODS='["cwrap","getValue","setValue"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -o public/sph.js

echo "WASM stub build finished"