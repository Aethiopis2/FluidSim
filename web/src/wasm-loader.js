/**
 * @brief loading module for WASM functions
 * 
 * @author Dr. Rediet Worku aka Aethiopis II ben Zahab
 * @date 11th of Sept 2025, Wednesday (Ethiopic New Year)
 */
import createSphModule from "../public/sph.js";

export async function loadSPHModule() {
    const mod = await createSphModule();

    // init particles in C++
    const N = 100;
    mod._SPH_Init(N);

    const n = mod._SPH_Count();
    const xPtr = mod._SPH_GetX();
    const yPtr = mod._SPH_GetY();

    // Create typed array views into WASM memory
    const X = new Float32Array(mod.HEAPF32.buffer, xPtr, n);
    const Y = new Float32Array(mod.HEAPF32.buffer, yPtr, n);

    return {
        step: () => mod._SPH_Step(),
        count: N,
        X,
        Y
    };
} // end loadSPHModule