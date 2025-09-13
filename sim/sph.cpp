/**
 * @brief 
 * 
 * @author Dr. Rediet Worku aka Aethiopis II ben Zahab
 * @date 11th of Sept 2025, Wednesday (Ethiopic New Year)
 */

//============================================================|
//          INCLUDES
//============================================================|
#include "sph.hpp"
#include <cstdlib>




//============================================================|
//          GLOBS
//============================================================|



//============================================================|
//          CLASS IMP
//============================================================|
/**
 * @brief initalizes the particle system
 * 
 * @param n count of particles
 */
void Sph::Init_Particles(const int n)
{
    num_particles = n;
    x.resize(n);
    y.resize(n);
    vx.resize(n);
    vy.resize(n);

    // spread particles
    for (int i = 0; i < num_particles; i++)
    {
        x[i] = (float)i * 0.02f;
        y[i] = 0.5f;
        vx[i] = vy[i] = 0.0f;
    } // end for
} // end Init_Particles

//============================================================|
/**
 * @brief set's gravity, maybe you wanna simulate on the moon
 * 
 * @param _gx x component of new gravity
 * @param _gy y component of new gravity
 */
void Sph::Set_Gravity(const float g)
{
    gravity = g;
} // end Set_Gravity

//============================================================|
/**
 * @brief returns a pointer to X axis/value buffers
 */
uintptr_t Sph::Get_X() { return reinterpret_cast<uintptr_t>(x.data()); }

//============================================================|
/**
 * @brief returns a pointer to Y axis/value buffers
 */
uintptr_t Sph::Get_Y() { return reinterpret_cast<uintptr_t>(y.data()); }

//============================================================|
/**
 * @brief returns a pointer to x-velocity buffers
 */
uintptr_t Sph::Get_Vx() { return reinterpret_cast<uintptr_t>(vx.data()); }

//============================================================|
/**
 * @brief returns a pointer to y-velocity buffers
 */
uintptr_t Sph::Get_Vy() { return reinterpret_cast<uintptr_t>(vy.data()); }

//============================================================|
/**
 * @brief returns count of particles
 */
int Sph::Get_Num_Particles() const { return num_particles; }

//============================================================|
/**
 * @brief set's the velocity of a particle at a given index
 * 
 * @param index of the velocity vector, i.e. which particle's
 * @param vX x component of the velocity
 * @param vY y component of the velocity
 */
void Sph::Set_Velocity(const int index, const float vX, const float vY)
{
    if (index >= 0 && index < num_particles)
    {
        vx[index] = vX;
        vy[index] = vY;
    } // end if
} // end Set_Velocity

//============================================================|
/**
 * @brief set's the velocities of all particles at a given speed
 * 
 * @param vX x component of velocity to set
 * @param vY y component of velocity to set
 */
void Sph::Set_Velocity_All(const float vX, const float vY)
{
    for (int i = 0; i < num_particles; i++)
    {
        vx[i] = vX;
        vy[i] = vY;
    } // end for
} // end Set_Velocity_All

//============================================================|
/**
 * @brief moves the particles according to velocities
 * 
 * @param dt a change in time
 */
void Sph::Step_Particles(const int dt)
{
    for (int i = 0; i < num_particles; i++)
    {
        vy[i] -= gravity * dt;  // Apply gravity
        x[i] += vx[i] * dt;
        y[i] += vy[i] * dt;

        // Simple floor collision
        if (y[i] < 0.0f) {
            y[i] = 0.0f;
            vy[i] *= -0.5f; // bounce
        } // end if bounce
    } // end for
} // end Step_Particles