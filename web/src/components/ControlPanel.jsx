import React from 'react'

const ControlPanel = () => {
  return (
    <aside className='w-72 border-l border-gray-700 bg-gray-800 dark:bg-gray-850 p-4 flex flex-col gap-4'>
        <h2 className="text-xl font-bold">Controls</h2>
        <div className="flex flex-col gap-3">
            <label className="flex flex-col">
              <span className="text-sm">VX</span>
              <input
                type="number"
                id="vx"
                step="0.01"
                defaultValue="0.01"
                className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>
            <label className="flex flex-col">
              <span className="text-sm">VY</span>
              <input
                type="number"
                id="vy"
                step="0.01"
                defaultValue="-0.01"
                className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </label>
            <button
              id="applyBtn"
              className="mt-2 p-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
            >
              Apply Velocities
            </button>
            <hr />
            <label className="flex flex-col">
                <span className="text-sm">Particle count</span>
                <input id="count" type="number" defaultValue={500} 
                className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"/>
            </label>
            <br />
            <button id="reinitBtn" 
            className="mt-2 p-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold transition">
                Reinit particles
            </button>
          </div>
    </aside>
  )
}

export default ControlPanel