export type ThemeMode = 'claro' | 'oscuro';

const THEME_CLASS_DARK = 'dark';
const THEME_STORAGE_KEY = 'app-theme';

export const applyThemeClass = (mode: ThemeMode) => {
  const root = document.documentElement;

  if (mode === 'oscuro') {
    root.classList.add(THEME_CLASS_DARK);
  } else {
    root.classList.remove(THEME_CLASS_DARK);
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
  }
};

export const loadStoredTheme = (): ThemeMode | null => {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (value === 'claro' || value === 'oscuro') {
      return value;
    }
    return null;
  } catch {
    return null;
  }
};
