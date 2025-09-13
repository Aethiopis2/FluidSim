import React from 'react'
import { Switch } from "@headlessui/react";
import useTheme from '../useTheme'

const Header = ({isDark, setIsDark}) => {
  return (
    <header className='flex items-center justify-between px-4 py-3 shadow-md bg-gray-800 dark:bg-gray-900'>
        <div className='flex items-center gap-3'>
            <Switch
            checked={isDark}
            onChange={setIsDark}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              isDark ? "bg-gray-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDark ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </Switch>
          <h1 className="text-lg font-semibold tracking-wide">Red's Fluid Sim</h1>
        </div>
    </header>
  )
}

export default Header