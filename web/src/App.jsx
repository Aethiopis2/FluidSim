import { useEffect, useRef } from 'react'
import { loadSPHModule } from './wasm-loader';

const App = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    (async () => {
      const sph = await loadSPHModule();
      const N = 100;    // number of particles

      function draw() {
        const positions = sph.getPositions(); // float array of x,y's
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "blue";

        for (let i = 0; i < N; ++i) {
          ctx.beginPath();
          ctx.arc(positions[2 * i], positions[2 * i + 1], 3, 0, 2 * Math.PI);
          ctx.fill();
        } // end for

        sph.step();
        requestAnimationFrame(draw);
      } // end draw

      draw();
    })();
  }, []);

  return <canvas ref={canvasRef} width={800} height={600} style={{border: "1px solid black"}} />
}

export default App