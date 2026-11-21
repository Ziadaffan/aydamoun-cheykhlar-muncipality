'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { THEME_PREFERENCES, ThemePreference } from '../../utils/theme.utils';

const ICONS: Record<ThemePreference, typeof Sun> = { system: Monitor, light: Sun, dark: Moon };
const LABEL_KEYS: Record<ThemePreference, string> = {
  system: 'navigation.main.themeSystem',
  light: 'navigation.main.themeLight',
  dark: 'navigation.main.themeDark',
};

type ThemeSwitcherProps = {
  isMobile?: boolean;
};

/** System / light / dark toggle, styled like the LanguageSwitcher next to it. */
export default function ThemeSwitcher({ isMobile = false }: ThemeSwitcherProps) {
  const { t } = useTranslation();
  const { preference, setPreference } = useTheme();

  return (
    <div
      role="group"
      aria-label={t('navigation.main.theme')}
      className={`inline-flex shrink-0 overflow-hidden rounded-full border border-blue-800/30 bg-white/60 ${isMobile ? 'self-start' : ''}`}
    >
      {THEME_PREFERENCES.map(option => {
        const Icon = ICONS[option];
        const label = t(LABEL_KEYS[option]);
        const selected = option === preference;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={selected}
            aria-label={label}
            title={label}
            onClick={() => setPreference(option)}
            className={`inline-flex cursor-pointer items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none focus-visible:ring-inset ${
              selected ? 'bg-blue-800 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-800'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {isMobile && <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );
}
