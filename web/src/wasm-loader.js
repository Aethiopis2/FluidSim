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
    mod._SPH_Init(100);

    const n = mod._SPH_Count();
    const xPtr = mod._SPH_GetX();
    const yPtr = mod._SPH_GetY();

    // Create typed array views into WASM memory
    const X = new Float32Array(mod.HEAPF32.buffer, xPtr, n);
    const Y = new Float32Array(mod.HEAPF32.buffer, yPtr, n);

    return {
        step: () => mod._SPH_Step(),
        getPositions: () => {
        const arr = new Float32Array(n * 2);
            for (let i = 0; i < n; i++) {
                arr[2 * i] = X[i];
                arr[2 * i + 1] = Y[i];
            } // end for
            return arr;
        }
    };
} // end loadSPHModule