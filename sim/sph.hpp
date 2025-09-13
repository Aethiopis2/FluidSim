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
#include <vector>
#include <cstdint>




//============================================================|
//          CLASS
//============================================================|
class Sph
{
public:

    Sph() = default;
    void Init_Particles(const int n = 1000);

    void Set_Gravity(const float g);
    uintptr_t Get_X();
    uintptr_t Get_Y();
    uintptr_t Get_Vx();
    uintptr_t Get_Vy();
    int Get_Num_Particles() const;

    void Set_Velocity(const int index, const float vx, const float vy);
    void Set_Velocity_All(const float vx, const float vy);

    void Step_Particles(const int dx);

private:

    int num_particles = 0;
    std::vector<float> x, y, vx, vy;
    float gravity = 9.8;
};