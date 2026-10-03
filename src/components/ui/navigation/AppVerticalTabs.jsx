import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";
import { AppBadge, AppShortcutHint } from "@/components";

const AppVerticalTabs = ({
  tabs = [],
  value = 0,
  onChange,
  variant = "soft", // soft | line | pills | cards
  colorVariant = "primary", // primary | success | error | warning | info | neutral
  size = "medium", // small | medium | large
  showPanels = true,
  fullHeight = false,
  width = 260,
  contentWidth = "1fr",
  disabled = false,
  showShortcuts = false,
  sx = {},
  tabsSx = {},
  tabSx = {},
  panelSx = {},
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const isDark = activeMode === "dark";
  const t = getThemeTokens(activeMode, colorTheme);

  const colorMap = {
    primary: {
      main: t.primary,
      hover: t.primaryHover,
      contrast: t.primaryContrast,
      soft: t.primarySoft,
      border: t.primary,
    },
    success: {
      main: t.success,
      hover: t.successHover,
      contrast: t.successContrast,
      soft: t.successSoft,
      border: t.success,
    },
    error: {
      main: t.error,
      hover: t.errorHover,
      contrast: t.errorContrast,
      soft: t.errorSoft,
      border: t.error,
    },
    warning: {
      main: t.warning,
      hover: t.warningHover,
      contrast: t.warningContrast,
      soft: t.warningSoft,
      border: t.warning,
    },
    info: {
      main: t.info,
      hover: t.infoHover,
      contrast: t.infoContrast,
      soft: t.infoSoft,
      border: t.info,
    },
    neutral: {
      main: isDark ? t.neutral[500] : t.neutral[600],
      hover: isDark ? t.neutral[400] : t.neutral[700],
      contrast: isDark ? t.neutral[900] : "#ffffff",
      soft: isDark ? t.surfaceHover : t.neutral[100],
      border: isDark ? t.neutral[400] : t.neutral[300],
    },
  };

  const active = colorMap[colorVariant] || colorMap.primary;

  const sizeMap = {
    small: {
      py: 0.85,
      px: 1,
      icon: 17,
      label: "0.8rem",
      desc: "0.72rem",
      gap: 1,
      badge: "small",
    },
    medium: {
      py: 1,
      px: 1.25,
      icon: 19,
      label: "0.88rem",
      desc: "0.78rem",
      gap: 1.2,
      badge: "small",
    },
    large: {
      py: 1.2,
      px: 1.5,
      icon: 21,
      label: "0.96rem",
      desc: "0.84rem",
      gap: 1.4,
      badge: "medium",
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;

  const currentTab =
    tabs.find((tab, index) => (tab.value ?? index) === value) ?? null;

  const handleChange = (tabValue, tab) => {
    if (disabled || tab.disabled) return;
    onChange?.(tabValue, tab);
  };

  const getTabStyles = (selected, tabDisabled) => {
    const base = {
      width: "100%",
      border: "none",
      outline: "none",
      textAlign: "left",
      cursor: disabled || tabDisabled ? "not-allowed" : "pointer",
      opacity: disabled || tabDisabled ? 0.5 : 1,
      display: "flex",
      alignItems: "center",
      gap: activeSize.gap,
      px: activeSize.px,
      py: activeSize.py,
      borderRadius: "12px",
      backgroundColor: "transparent",
      color: selected ? active.main : t.textMuted,
      transition:
        "background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
      position: "relative",
      fontFamily: "inherit",
    };

    if (variant === "line") {
      return {
        ...base,
        borderRadius: "10px",
        borderLeft: `3px solid ${selected ? active.main : "transparent"}`,
        backgroundColor: selected ? active.soft : "transparent",
        "&:hover": {
          backgroundColor:
            disabled || tabDisabled ? "transparent" : t.surfaceHover,
          color: disabled || tabDisabled ? t.textMuted : active.main,
        },
      };
    }

    if (variant === "pills") {
      return {
        ...base,
        borderRadius: "999px",
        backgroundColor: selected ? active.main : "transparent",
        color: selected ? active.contrast : t.textMuted,
        "&:hover": {
          backgroundColor:
            disabled || tabDisabled
              ? "transparent"
              : selected
                ? active.hover
                : active.soft,
          color:
            disabled || tabDisabled
              ? t.textMuted
              : selected
                ? active.contrast
                : active.main,
        },
      };
    }

    if (variant === "cards") {
      return {
        ...base,
        border: `1px solid ${selected ? active.border : t.border}`,
        backgroundColor: selected ? active.soft : t.surface,
        boxShadow: selected ? t.shadowXs : "none",
        "&:hover": {
          backgroundColor: disabled || tabDisabled ? t.surface : active.soft,
          color: disabled || tabDisabled ? t.textMuted : active.main,
          borderColor: disabled || tabDisabled ? t.border : active.border,
        },
      };
    }

    return {
      ...base,
      backgroundColor: selected ? active.soft : "transparent",
      border: `1px solid ${selected ? active.border : "transparent"}`,
      "&:hover": {
        backgroundColor: disabled || tabDisabled ? "transparent" : active.soft,
        color: disabled || tabDisabled ? t.textMuted : active.main,
      },
    };
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: fullHeight ? "100%" : "auto",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: `${typeof width === "number" ? `${width}px` : width} ${contentWidth}`,
        },
        gap: 2,
        ...sx,
      }}
    >
      <Box
        role="tablist"
        aria-orientation="vertical"
        sx={{
          width: "100%",
          borderRadius: "16px",
          border: variant === "cards" ? "none" : `1px solid ${t.border}`,
          backgroundColor: variant === "cards" ? "transparent" : t.surface,
          p: variant === "cards" ? 0 : 1,
          display: "flex",
          flexDirection: "column",
          gap: 0.75,
          ...tabsSx,
        }}
      >
        {tabs.map((tab, index) => {
          const tabValue = tab.value ?? index;
          const selected = value === tabValue;

          return (
            <Box
              key={tab.key || tab.label || index}
              component="button"
              type="button"
              role="tab"
              aria-selected={selected}
              disabled={disabled || tab.disabled}
              onClick={() => handleChange(tabValue, tab)}
              sx={{
                ...getTabStyles(selected, tab.disabled),
                ...tab.sx,
                ...tabSx,
              }}
            >
              {tab.icon ? (
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "inherit",
                    "& svg": {
                      fontSize: activeSize.icon,
                    },
                  }}
                >
                  {tab.icon}
                </Box>
              ) : null}

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: activeSize.label,
                    fontWeight: selected ? 800 : 600,
                    color: "inherit",
                    lineHeight: 1.25,
                  }}
                >
                  {tab.label}
                </Typography>

                {tab.description ? (
                  <Typography
                    sx={{
                      fontSize: activeSize.desc,
                      color:
                        selected && variant === "pills"
                          ? "rgba(255,255,255,0.78)"
                          : t.textMuted,
                      lineHeight: 1.35,
                      mt: 0.25,
                    }}
                  >
                    {tab.description}
                  </Typography>
                ) : null}
              </Box>

              {tab.badge !== undefined && tab.badge !== null ? (
                <AppBadge
                  size={activeSize.badge}
                  variant={
                    selected && variant === "pills" ? "contained" : "soft"
                  }
                  colorVariant={
                    selected && variant === "pills" ? "dark" : colorVariant
                  }
                  label={tab.badge}
                />
              ) : null}

              {showShortcuts && tab.shortcut ? (
                <AppShortcutHint
                  keys={tab.shortcut}
                  size="small"
                  muted={!selected}
                  sx={{ flexShrink: 0 }}
                />
              ) : null}
            </Box>
          );
        })}
      </Box>

      {showPanels ? (
        <Box
          role="tabpanel"
          sx={{
            minWidth: 0,
            borderRadius: "16px",
            border: `1px solid ${t.border}`,
            backgroundColor: t.surface,
            p: 2,
            color: t.text,
            ...panelSx,
          }}
        >
          {currentTab?.content}
        </Box>
      ) : null}
    </Box>
  );
};

export default AppVerticalTabs;
