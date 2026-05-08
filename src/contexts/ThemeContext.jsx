import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { getThemeTokens, createAppTheme } from "@/theme";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    const t = getThemeTokens(theme);

    root.classList.remove("dark");

    if (theme === "dark") {
      root.classList.add("dark");
    }

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

    localStorage.setItem("theme", theme);
  }, [theme]);

  const muiTheme = useMemo(() => createAppTheme(theme), [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme,
    }),
    [theme],
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
