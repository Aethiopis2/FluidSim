import { useEffect, useReducer, useRef, useState } from 'react'
import createModule from "/public/sph.js";

const Canvas = () => {
    const canvasRef = useRef(null);
    const [moduleReady, setModuleReady] = useState(false);
    const simRef = useRef(null);    // will hold new Module.Sph
    const xView = useRef(null);     // FloatArray32 view into WASM for X
    const yView = useRef(null);     // FloatArray32 view into WASM for Y
    const posBuffer = useRef(null); // FloatArray32 interleaved values
    const glRef = useRef(null);
    const bufRef = useRef(null);
    const numRef = useRef(0);
  
    // resizing
    useEffect(() => {
        const canvas = canvasRef.current;
        const resize = () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        };
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        let mounted = true;

        (async () => {
            const Module = await createModule();
            if (!mounted) return;

            // instantiate the simulator class
            const sim = new Module.Sph();
            simRef.current = {Module, sim};

            // init from UI input or default
            const initN = parseInt(document.getElementById("count")?.value || 500, 10);
            sim.initParticles(initN);
            numRef.current = initN;

            const xPtr = sim.getX();
            const yPtr = sim.getY();
            xView.current = new Float32Array(Module.HEAPF32.buffer, xPtr, initN);
            yView.current = new Float32Array(Module.HEAPF32.buffer, yPtr, initN);

            // CPU side interleaved positions, [x,y, x,y, ...]
            posBuffer.current = new Float32Array(initN * 2);

            // setup apply button to setup global velocities
            document.getElementById("applyBtn").addEventListener("click",
                () => {
                    const vx = parseFloat(document.getElementById("vx").value) || 0;
                    const vy = parseFloat(document.getElementById("vy").value) || 0;
                    console.log(sim.getVX(), sim.getVY());
                    sim.setVelocityAll(vx, vy);
                }
            );

            document.getElementById("reinitBtn").addEventListener("click",
                () => {
                    const newN = Math.max(1, 
                        parseInt(document.getElementById("count").value || 100, 10));
                    
                    sim.initParticles(newN);
                    numRef.current = newN;

                    // recreate views/buffer
                    const nxPtr = sim.getX();
                    const nyPtr = sim.getY();
                    xView.current = new Float32Array(Module.HEAPF32.buffer, nxPtr, newN);
                    yView.current = new Float32Array(Module.HEAPF32.buffer, nyPtr, newN);

                    // recreate GPU size if GL is initialized
                    if (glRef.current && bufRef.current) {
                        glRef.current.bindBuffer(glRef.current.ARRAY_BUFFER, bufRef.current);
                        glRef.current.bufferData(glRef.current.ARRAY_BUFFER, 
                            posBuffer.current.byteLength, glRef.current.DYNAMIC_DRAW);
                    } // end if
                }
            );

            setModuleReady(true);
        })();

        return () => { mounted = false };
    }, []);

    useEffect(() => {
        // webgl init and render loop
        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl2");
        if (!gl) {
            console.error("WebGL2 not supported.");
            return;
        } // end if
        glRef.current = gl;

        // simple shaders
        const vs = `#version 300 es
        in vec2 a_pos;
        uniform vec2 u_resolution;
        void main() {
            // convert pixels to clipspace
            vec2 clip = (a_pos / u_resolution) * 2.0 - 1.0;
            // flip Y
            clip.y = -clip.y;
            gl_Position = vec4(clip, 0.0, 1.0);
            gl_PointSize = 4.0;
        }`;

        const fs = `#version 300 es
        precision highp float;
        out vec4 outColor;

        void main() {
            // gl_PointCoord is built-in vec2 [0,1] inside each point
            vec2 uv = gl_PointCoord * 2.0 - 1.0;  // [-1,1] range
            float r = dot(uv, uv);
            if (r > 1.0) discard;                 // clip outside circle
            outColor = vec4(0.12, 0.55, 0.95, 1.0);
        }`;

        function compile(shType, src) {
            const s = gl.createShader(shType);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(s));
            } // end if

            return s;
        } // end compile

        const prog = gl.createProgram();
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(prog));
        } // end if
        gl.useProgram(prog);

        // attributes/uniforms
        const aPosLoc = gl.getAttribLocation(prog, "a_pos");
        const uResLoc = gl.getUniformLocation(prog, "u_resolution");

        // GPU buffer for positions
        const posBuf = gl.createBuffer();
        bufRef.current = posBuf;
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);

        // alloc some size to init later on
        const initialN = numRef.current || 500;
        gl.bufferData(gl.ARRAY_BUFFER, initialN * 2 * 4, gl.DYNAMIC_DRAW);

        gl.enableVertexAttribArray(aPosLoc);
        // a_pos is vec2 (2 floats), stride 0, offset 0
        gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

        // render loop
        let raf = 0;
        let lastTime = 1;

        function frame(now) {
            if (!lastTime) lastTime = now;
            let dt = (now - lastTime) / 1000.0;
            lastTime = now;

            // Clamp dt (avoid giant steps after tab switch)
            if (dt > 0.033) dt = 0.033; // cap at ~30fps step

            const simState = simRef.current;
            if (simState && xView.current && yView.current && posBuffer.current) {
                const N = numRef.current;
                const w = canvas.width, h = canvas.height;
                const X = xView.current;
                const Y = yView.current;
                const P = posBuffer.current;

                // interleave into P
                for (let i = 0, j = 0; i < N; i++, j += 2) {
                    P[j] = X[i] * w;
                    P[j + 1] = Y[i] * h;
                } // end for

                // update GPU buffer
                gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, P);

                // clear and draw
                gl.viewport(0, 0, w, h);
                gl.clearColor(0.06, 0.06, 0.07, 1.0);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.uniform2f(uResLoc, canvas.width, canvas.height);
                gl.drawArrays(gl.POINTS, 0, N);

                // step sim in WASM
                simState.sim.setpParticles(dt);
            } // end if

            raf = requestAnimationFrame(frame);
        } // end frame

        raf = requestAnimationFrame(frame);

        return () => cancelAnimationFrame(raf);
    }, [moduleReady]);

    return (<canvas 
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid #333" }} />);
}

export default Canvas