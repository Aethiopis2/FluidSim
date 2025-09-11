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
#include <vector>
#include <cstdlib>



//============================================================|
//          GLOBS
//============================================================|
static int N = 0;
static float* X = nullptr;
static float* Y = nullptr;




//============================================================|
//          FUNCTIONS
//============================================================|
extern "C" {

/**
 * @brief initalizes the particle system
 */
void sph_init(int n)
{
    N = n;
    X = new float [N];
    Y = new float [N];

    for (int i = 0; i < N; ++i)
    {
        X[i] = rand() % 800;
        Y[i] = rand() % 600;
    }
} // end sph_init

//============================================================|
/**
 * @brief moves the fluid (dummy for now)
 */
void sph_step()
{
    // simple random motion
    for (int i = 0;i < N; i++)
    {
        X[i] += ((rand() % 100)/50.0f -1.0f);
        Y[i] += ((rand() % 100)/50.0f -1.0f);
        
        if(X[i]<0) X[i]=0; if(X[i]>800) X[i]=800;
        if(Y[i]<0) Y[i]=0; if(Y[i]>600) Y[i]=600;
    } // end for
} // end sph_step

//============================================================|
/**
 * @brief returns a pointer to X buffers
 */
float* sph_getX() { return X; }

//============================================================|
/**
 * @brief returns a pointer to Y buffers
 */
float* sph_getY() { return Y; }

//============================================================|
/**
 * @brief returns count of particles
 */
int sph_count() { return N; }
}