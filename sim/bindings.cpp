/**
 * @brief 
 * 
 * @author Dr. Rediet Worku aka Aethiopis II ben Zahab
 * @date 11th of Sept 2025, Wednesday (Ethiopic New Year)
 */
#pragma once

//============================================================|
//          INCLUDES
//============================================================|
#include "sph.hpp"
#include <emscripten/emscripten.h>



//============================================================|
//          EXPORTS
//============================================================|
extern "C" {
    EMSCRIPTEN_KEEPALIVE void SPH_Init(int n) { sph_init(n); }
    EMSCRIPTEN_KEEPALIVE void SPH_Step() { sph_step(); }
    EMSCRIPTEN_KEEPALIVE float* SPH_GetX() { return sph_getX(); }
    EMSCRIPTEN_KEEPALIVE float* SPH_GetY() { return sph_getY(); }
    EMSCRIPTEN_KEEPALIVE int SPH_Count() { return sph_count(); }
}