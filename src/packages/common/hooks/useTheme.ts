'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { THEME_STORAGE_KEY, ThemePreference, readThemePreference } from '../utils/theme.utils';

const CHANGE_EVENT = 'themepreferencechange';

declare global {
  interface Window {
    __applyTheme?: () => void;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

/** The visitor's theme choice (system / light / dark), saved in localStorage and applied to <html>. */
export function useTheme() {
  const preference = useSyncExternalStore<ThemePreference>(subscribe, readThemePreference, () => 'system');

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      if (next === 'system') localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable: still switch for this page view */
    }
    if (window.__applyTheme) {
      window.__applyTheme();
    } else {
      const dark = next === 'dark' || (next === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', dark);
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { preference, setPreference };
}
