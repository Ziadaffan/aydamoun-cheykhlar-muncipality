// Theme (light / dark / follow the system). Shared by the inline bootstrap script in app/layout.tsx
// (a server component, so this module must stay free of 'use client') and the useTheme hook.

export type ThemePreference = 'system' | 'light' | 'dark';
export const THEME_PREFERENCES: readonly ThemePreference[] = ['system', 'light', 'dark'];

/** localStorage key holding the visitor's choice; absent = follow the system. */
export const THEME_STORAGE_KEY = 'theme';

/**
 * Runs in <head> before first paint: puts `dark` on <html> when the saved choice (or, on "system", the OS)
 * asks for it, then keeps following OS changes and choices made in other tabs. Exposes window.__applyTheme
 * for the hook to call after a change.
 */
export const themeBootstrapScript = `(function(){try{var k='${THEME_STORAGE_KEY}',m=window.matchMedia('(prefers-color-scheme: dark)');function a(){var p=null;try{p=localStorage.getItem(k)}catch(e){}var d=p==='dark'||(p!=='light'&&m.matches);document.documentElement.classList.toggle('dark',d)}a();window.__applyTheme=a;if(m.addEventListener)m.addEventListener('change',a);else if(m.addListener)m.addListener(a);window.addEventListener('storage',function(e){if(e.key===k)a()})}catch(e){}})();`;

export function readThemePreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage unavailable */
  }
  return 'system';
}

/** Whether the page is currently dark (the class the bootstrap script maintains). */
export function isDarkTheme(): boolean {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
}
