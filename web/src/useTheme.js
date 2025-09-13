/**
 * @brief implements theme toggle functionality
 * 
 * @author Dr. Rediet Worku aka Aethiopis II ben Zahab
 * @date 11th of Sept 2025, Wednesday (Ethiopic New Year)
 */
import { useState, useEffect } from "react";

export default function useTheme(defaultDark = true) {
    const [isDark, setIsDark] = useState(() => {
        // read user preference from local storage
        const saved = localStorage.getItem("theme");
        if (saved) return saved === "dark";
        return defaultDark;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } // end if Dark mode
        else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } // end else
    }, [isDark]);

    return [isDark, setIsDark];
} // end useTheme