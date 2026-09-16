"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "avaliatech-theme";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  if (typeof document !== "undefined") {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    document.documentElement.style.colorScheme = theme;
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const initialTheme: Theme = savedTheme ? savedTheme : "dark";

    setTheme(initialTheme);
    applyTheme(initialTheme);
    setIsReady(true);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";

    setTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
  }

  const isDark = theme === "dark";
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? "Alternar para tema claro" : "Alternar para tema escuro";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      className="fixed bottom-5 right-5 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-navy-700 bg-navy-900 text-gold-400 shadow-xl transition-all duration-200 hover:scale-110 hover:border-gold-500/50 focus:outline-none focus:ring-4 focus:ring-gold-500/20 active:scale-95 cursor-pointer"
    >
      {isReady ? <Icon className="h-4 w-4" strokeWidth={2.2} /> : null}
    </button>
  );
}
