'use client';

import { useCallback, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

interface UseThemeReturn {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'ailav-theme';

let currentTheme: Theme = 'light';
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return 'light';
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);

  // Initialize on first subscribe (client-side only)
  if (listeners.size === 1) {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') {
      currentTheme = saved;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      currentTheme = 'dark';
    }
    document.documentElement.dataset.theme = currentTheme;

    // Listen for system preference changes
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        currentTheme = e.matches ? 'dark' : 'light';
        document.documentElement.dataset.theme = currentTheme;
        notify();
      }
    };
    mql.addEventListener('change', handler);
  }

  return () => {
    listeners.delete(callback);
  };
}

function applyTheme(next: Theme) {
  currentTheme = next;
  document.documentElement.dataset.theme = next;
  localStorage.setItem(STORAGE_KEY, next);
  notify();
}

export function useTheme(): UseThemeReturn {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  return { theme, isDark: theme === 'dark', toggleTheme };
}
