/**
 * @brief binds the modules for emscripten to export to wasm
 * 
 * @author Dr. Rediet Worku aka Aethiopis II ben Zahab
 * @date 11th of Sept 2025, Wednesday (Ethiopic New Year)
 */

//============================================================|
//          INCLUDES
//============================================================|
#include <emscripten/bind.h>
#include "sph.hpp"

using namespace emscripten;


//============================================================|
//          EXPORTS
//============================================================|
EMSCRIPTEN_BINDINGS(FluidSim) {
    class_<Sph>("Sph")
        .constructor<>()
        .function("initParticles", &Sph::Init_Particles)
        .function("setGravity", &Sph::Set_Gravity)
        .function("getX", &Sph::Get_X)
        .function("getY", &Sph::Get_Y)
        .function("getVX", &Sph::Get_Vx)
        .function("getVY", &Sph::Get_Vy)
        .function("getNumParticles", &Sph::Get_Num_Particles)
        .function("setVelocity", &Sph::Set_Velocity)
        .function("setVelocityAll", &Sph::Set_Velocity_All)
        .function("setpParticles", &Sph::Step_Particles);
}
// extern "C" {
//     EMSCRIPTEN_KEEPALIVE void SPH_Init(int n) { sph_init(n); }
//     EMSCRIPTEN_KEEPALIVE void SPH_Step() { sph_step(); }
//     EMSCRIPTEN_KEEPALIVE float* SPH_GetX() { return sph_getX(); }
//     EMSCRIPTEN_KEEPALIVE float* SPH_GetY() { return sph_getY(); }
//     EMSCRIPTEN_KEEPALIVE int SPH_Count() { return sph_count(); }
// }