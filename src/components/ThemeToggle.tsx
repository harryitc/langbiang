"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
      aria-pressed={dark}
      title={dark ? "Chế độ sáng" : "Chế độ tối"}
      className="glass glass-adaptive group fixed bottom-6 right-6 z-[9997] flex h-13 w-13 items-center justify-center overflow-hidden rounded-full text-leaf-deep shadow-soft transition hover:scale-110 hover:text-sunset dark:text-leaf-bright dark:hover:text-sun"
      style={{ height: 52, width: 52 }}
    >
      <span className="relative block h-6 w-6" aria-hidden>
        {/* Sun */}
        <svg
          viewBox="0 0 24 24"
          className={`absolute inset-0 h-6 w-6 transition-all duration-500 ${
            dark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        {/* Moon */}
        <svg
          viewBox="0 0 24 24"
          className={`absolute inset-0 h-6 w-6 transition-all duration-500 ${
            dark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
          }`}
          fill="currentColor"
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      </span>
    </button>
  );
}
