"use client";

import { useState, useEffect, useCallback } from "react";
import type { ThemeMode } from "@/types";

const VALID_THEMES: ThemeMode[] = ["dark", "light", "matrix", "party"];
const STORAGE_KEY = "rumbo-theme";
const DEFAULT_THEME: ThemeMode = "dark";

const THEME_CONFIGS: Record<ThemeMode, Record<string, string>> = {
  dark: {
    "color-bg": "#0a0a0f",
    "color-bg-secondary": "#111118",
    "color-bg-card": "rgba(255,255,255,0.04)",
    "color-primary": "#7c3aed",
    "color-secondary": "#a855f7",
    "color-text": "#f8fafc",
    "color-text-muted": "#94a3b8",
    "color-border": "rgba(139,92,246,0.2)",
  },
  light: {
    "color-bg": "#f8fafc",
    "color-bg-secondary": "#f1f5f9",
    "color-bg-card": "rgba(0,0,0,0.03)",
    "color-primary": "#6d28d9",
    "color-secondary": "#9333ea",
    "color-text": "#0f172a",
    "color-text-muted": "#475569",
    "color-border": "rgba(109,40,217,0.2)",
  },
  matrix: {
    "color-bg": "#001100",
    "color-bg-secondary": "#001a00",
    "color-bg-card": "rgba(0,255,65,0.05)",
    "color-primary": "#00ff41",
    "color-secondary": "#00cc33",
    "color-text": "#00ff41",
    "color-text-muted": "#00aa22",
    "color-border": "rgba(0,255,65,0.3)",
  },
  party: {
    "color-bg": "#0d0020",
    "color-bg-secondary": "#1a0035",
    "color-bg-card": "rgba(255,0,110,0.08)",
    "color-primary": "#ff006e",
    "color-secondary": "#ffbe0b",
    "color-text": "#ffffff",
    "color-text-muted": "#e0e0e0",
    "color-border": "rgba(255,0,110,0.3)",
  },
};

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  const applyTheme = useCallback((mode: ThemeMode) => {
    // Remove all theme classes atomically, then add the new one
    const root = document.documentElement;
    root.classList.remove(...VALID_THEMES);
    root.classList.add(mode);

    // Apply CSS custom properties
    const config = THEME_CONFIGS[mode];
    Object.entries(config).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initial = saved && VALID_THEMES.includes(saved) ? saved : DEFAULT_THEME;
    applyTheme(initial);
    setThemeState(initial);
  }, [applyTheme]);

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      applyTheme(mode);
      setThemeState(mode);
      localStorage.setItem(STORAGE_KEY, mode);
    },
    [applyTheme]
  );

  return { theme, setTheme, mounted };
}
