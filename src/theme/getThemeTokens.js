import { colorTokens, DEFAULT_COLOR_THEME, THEME_NAMES } from "./tokens";

export const THEME_MODES = {
  LIGHT: "light",
  DARK: "dark",
};

export const DEFAULT_THEME_MODE = THEME_MODES.LIGHT;

export const getThemeTokens = (
  mode = DEFAULT_THEME_MODE,
  colorTheme = DEFAULT_COLOR_THEME,
) => {
  const safeMode =
    mode === THEME_MODES.DARK ? THEME_MODES.DARK : THEME_MODES.LIGHT;

  const safeColorTheme = colorTokens[colorTheme]
    ? colorTheme
    : DEFAULT_COLOR_THEME;

  return (
    colorTokens[safeColorTheme]?.[safeMode] ||
    colorTokens[DEFAULT_COLOR_THEME]?.[safeMode] ||
    colorTokens[THEME_NAMES.EMERALD][THEME_MODES.LIGHT]
  );
};
