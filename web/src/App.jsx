import { useEffect, useRef, useState } from 'react';
import createModule from "/public/sph.js";
import Canvas from './components/Canvas';
import useTheme from "./useTheme";
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';


const App = () => {
  const [isDark, setIsDark] = useTheme(true);

  return (
    <div className={`flex flex-col h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <Header isDark={isDark} setIsDark={setIsDark} />

      <main className="flex flex-1 overflow-hidden">
        <div className="flex flex items-center justify-center bg-gray-950 dark:bg-gray-900">
          <Canvas />
        </div>

        <ControlPanel />
      </main>
    </div>
  );
}

export default App;