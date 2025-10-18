"use client";

import { useState, useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export function ThemeToggle() {
  const [theme, setTheme] = useState<string>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  if (!mounted) {
    return (
      <nav aria-label="Theme toggle control">
        <button
        
          aria-label="Toggle dark/light mode"
          disabled
        >
          <FiMoon />
          <span className="ml-1 hidden md:inline">Dark Mode</span>
        </button>
      </nav>
    );
  }

  return (
    <nav aria-label="Theme toggle control">
      <button
        className="btn btn-sm p-2"
        onClick={toggleTheme}
        aria-label="Toggle dark/light mode"
      >
        {theme === "light" ? <FiMoon /> : <FiSun />}
        <span className="ml-1 hidden md:inline">
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </span>
      </button>
    </nav>
  );
}
