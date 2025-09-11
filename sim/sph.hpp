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
#include <cstdint>


//============================================================|
//          EXPORTS
//============================================================|
extern "C" {
    void sph_init(int n);
    void sph_step();
    float* sph_getX();
    float* sph_getY();
    int sph_count();
}