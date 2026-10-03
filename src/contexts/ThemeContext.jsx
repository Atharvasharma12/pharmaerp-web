import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { createAppTheme, getThemeTokens } from "@/theme";
import { DEFAULT_COLOR_THEME, THEME_NAMES } from "@/theme/tokens";
import { DEFAULT_THEME_MODE, THEME_MODES } from "@/theme/getThemeTokens";

const ThemeContext = createContext(null);

const STORAGE_KEYS = {
  MODE: "themeMode",
  COLOR_THEME: "colorTheme",
};

const getSafeMode = (mode) => {
  return mode === THEME_MODES.DARK ? THEME_MODES.DARK : THEME_MODES.LIGHT;
};

const getSafeColorTheme = (colorTheme) => {
  return Object.values(THEME_NAMES).includes(colorTheme)
    ? colorTheme
    : DEFAULT_COLOR_THEME;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem(STORAGE_KEYS.MODE);
    return getSafeMode(savedMode || DEFAULT_THEME_MODE);
  });

  const [colorTheme, setColorTheme] = useState(() => {
    const savedColorTheme = localStorage.getItem(STORAGE_KEYS.COLOR_THEME);
    return getSafeColorTheme(savedColorTheme || DEFAULT_COLOR_THEME);
  });

  useEffect(() => {
    const root = document.documentElement;
    const safeMode = getSafeMode(mode);
    const safeColorTheme = getSafeColorTheme(colorTheme);
    const t = getThemeTokens(safeMode, safeColorTheme);

    root.classList.remove("dark");

    if (safeMode === THEME_MODES.DARK) {
      root.classList.add("dark");
    }

    root.dataset.theme = safeColorTheme;
    root.dataset.mode = safeMode;

    root.style.setProperty("--app-color-bg", t.bg);
    root.style.setProperty("--app-color-surface", t.surface);
    root.style.setProperty("--app-color-surface-alt", t.surfaceAlt);
    root.style.setProperty("--app-color-surface-hover", t.surfaceHover);
    root.style.setProperty("--app-color-surface-active", t.surfaceActive);

    root.style.setProperty("--app-color-border", t.border);
    root.style.setProperty("--app-color-border-strong", t.borderStrong);
    root.style.setProperty("--app-color-divider", t.divider);

    root.style.setProperty("--app-color-text", t.text);
    root.style.setProperty("--app-color-text-muted", t.textMuted);
    root.style.setProperty("--app-color-text-disabled", t.textDisabled);
    root.style.setProperty("--app-color-text-inverse", t.textInverse);

    root.style.setProperty("--app-color-primary", t.primary);
    root.style.setProperty("--app-color-primary-hover", t.primaryHover);
    root.style.setProperty("--app-color-primary-soft", t.primarySoft);
    root.style.setProperty("--app-color-primary-contrast", t.primaryContrast);

    root.style.setProperty("--app-color-success", t.success);
    root.style.setProperty("--app-color-success-hover", t.successHover);
    root.style.setProperty("--app-color-success-soft", t.successSoft);
    root.style.setProperty("--app-color-success-contrast", t.successContrast);

    root.style.setProperty("--app-color-error", t.error);
    root.style.setProperty("--app-color-error-hover", t.errorHover);
    root.style.setProperty("--app-color-error-soft", t.errorSoft);
    root.style.setProperty("--app-color-error-contrast", t.errorContrast);

    root.style.setProperty("--app-color-warning", t.warning);
    root.style.setProperty("--app-color-warning-hover", t.warningHover);
    root.style.setProperty("--app-color-warning-soft", t.warningSoft);
    root.style.setProperty("--app-color-warning-contrast", t.warningContrast);

    root.style.setProperty("--app-color-info", t.info);
    root.style.setProperty("--app-color-info-hover", t.infoHover);
    root.style.setProperty("--app-color-info-soft", t.infoSoft);
    root.style.setProperty("--app-color-info-contrast", t.infoContrast);

    root.style.setProperty("--app-color-neutral-50", t.neutral[50]);
    root.style.setProperty("--app-color-neutral-100", t.neutral[100]);
    root.style.setProperty("--app-color-neutral-200", t.neutral[200]);
    root.style.setProperty("--app-color-neutral-300", t.neutral[300]);
    root.style.setProperty("--app-color-neutral-400", t.neutral[400]);
    root.style.setProperty("--app-color-neutral-500", t.neutral[500]);
    root.style.setProperty("--app-color-neutral-600", t.neutral[600]);
    root.style.setProperty("--app-color-neutral-700", t.neutral[700]);
    root.style.setProperty("--app-color-neutral-800", t.neutral[800]);
    root.style.setProperty("--app-color-neutral-900", t.neutral[900]);

    root.style.setProperty("--app-color-disabled-bg", t.disabledBg);
    root.style.setProperty("--app-color-disabled-text", t.disabledText);
    root.style.setProperty("--app-color-disabled-border", t.disabledBorder);

    root.style.setProperty("--app-color-readonly-bg", t.readOnlyBg);

    root.style.setProperty("--app-color-hover-overlay", t.hoverOverlay);
    root.style.setProperty("--app-color-active-overlay", t.activeOverlay);
    root.style.setProperty("--app-color-overlay", t.overlay);

    root.style.setProperty("--app-focus-ring", t.focusRing);

    root.style.setProperty("--app-shadow-xs", t.shadowXs);
    root.style.setProperty("--app-shadow-sm", t.shadowSm);
    root.style.setProperty("--app-shadow-md", t.shadowMd);
    root.style.setProperty("--app-shadow-lg", t.shadowLg);
    root.style.setProperty("--app-shadow-xl", t.shadowXl);

    localStorage.setItem(STORAGE_KEYS.MODE, safeMode);
    localStorage.setItem(STORAGE_KEYS.COLOR_THEME, safeColorTheme);
  }, [mode, colorTheme]);

  const muiTheme = useMemo(
    () => createAppTheme(mode, colorTheme),
    [mode, colorTheme],
  );

  const isDark = mode === THEME_MODES.DARK;

  const toggleTheme = () => {
    setMode((prev) =>
      prev === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT,
    );
  };

  const toggleMode = toggleTheme;

  const value = useMemo(
    () => ({
      mode,
      theme: mode,
      colorTheme,

      isDark,
      isLight: mode === THEME_MODES.LIGHT,

      setMode,
      setTheme: setMode,
      setColorTheme,

      toggleMode,
      toggleTheme,

      availableModes: Object.values(THEME_MODES),
      availableColorThemes: Object.values(THEME_NAMES),
    }),
    [mode, colorTheme, isDark],
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};
