"use client";

// Small shared toggle used in desktop and mobile navigation.
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      className={`pressable inline-flex min-w-[44px] min-h-[44px] items-center justify-center rounded-full border border-gray-700 bg-gray-900/80 text-white transition hover:border-[#d8a43f] hover:text-[#d8a43f] ${className}`}
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3v2.25M12 18.75V21M4.97 4.97l1.59 1.59M17.44 17.44l1.59 1.59M3 12h2.25M18.75 12H21M4.97 19.03l1.59-1.59M17.44 6.56l1.59-1.59M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.64 13a1 1 0 00-1.05-.14 8 8 0 01-10.45-10.45 1 1 0 00-1.2-1.3A10 10 0 1013 21.64a1 1 0 00-.14-1.05A8.03 8.03 0 0112 12c0-.34.02-.67.06-1a1 1 0 00-1.3-1.06 6 6 0 107.3 7.3A1 1 0 0019 15.94c-.33.04-.66.06-1 .06a8.03 8.03 0 013.64-3z" />
        </svg>
      )}
    </button>
  );
}
