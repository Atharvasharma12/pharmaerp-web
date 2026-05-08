import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppTabs = ({
  tabs = [],
  value = 0,
  onChange,
  variant = "line", // line | pills | soft | enclosed | text
  colorVariant = "primary", // primary | success | error | warning | info | dark | neutral
  size = "medium", // small | medium | large
  rounded = "md", // sm | md | lg | full
  fullWidth = false,
  centered = false,
  scrollable = false,
  showPanels = false,
  panelSx = {},
  disabled = false,
  elevation = false,
  stretch = false,
  tabMinWidth = 0,
  sx = {},
  tabsSx = {},
  tabSx = {},
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = getThemeTokens(theme);

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
    dark: {
      main: isDark ? t.neutral[100] : t.neutral[900],
      hover: isDark ? t.neutral[200] : t.neutral[800],
      contrast: isDark ? t.text : t.textInverse,
      soft: isDark ? t.surfaceHover : t.neutral[100],
      border: isDark ? t.borderStrong : t.neutral[300],
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

  const radiusMap = {
    sm: "6px",
    md: "8px",
    lg: "10px",
    full: "999px",
  };

  const sizeMap = {
    small: {
      minHeight: 32,
      fontSize: "0.78rem",
      px: 1.25,
      py: 0.55,
      gap: 0.5,
      iconSize: 16,
      badgeSize: 18,
      badgeFontSize: "0.68rem",
      wrapperPadding: "4px",
    },
    medium: {
      minHeight: 38,
      fontSize: "0.86rem",
      px: 1.75,
      py: 0.75,
      gap: 0.625,
      iconSize: 18,
      badgeSize: 20,
      badgeFontSize: "0.72rem",
      wrapperPadding: "5px",
    },
    large: {
      minHeight: 44,
      fontSize: "0.94rem",
      px: 2.1,
      py: 0.95,
      gap: 0.75,
      iconSize: 20,
      badgeSize: 22,
      badgeFontSize: "0.76rem",
      wrapperPadding: "6px",
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;
  const resolvedRadius = radiusMap[rounded] || radiusMap.md;
  const isLineVariant = variant === "line";

  const handleChange = (event, newValue) => {
    if (disabled) return;
    onChange?.(event, newValue);
  };

  const getWrapperStyles = () => {
    const common = {
      width: "100%",
      transition:
        "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
      ...(elevation ? { boxShadow: t.shadowXs } : {}),
    };

    switch (variant) {
      case "pills":
        return {
          ...common,
          backgroundColor: t.surfaceAlt,
          border: `1px solid ${t.border}`,
          borderRadius: resolvedRadius,
          p: activeSize.wrapperPadding,
        };

      case "soft":
        return {
          ...common,
          backgroundColor: active.soft,
          border: `1px solid transparent`,
          borderRadius: resolvedRadius,
          p: activeSize.wrapperPadding,
        };

      case "enclosed":
        return {
          ...common,
          backgroundColor: t.surface,
          border: `1px solid ${t.border}`,
          borderRadius: resolvedRadius,
          p: activeSize.wrapperPadding,
        };

      case "text":
        return {
          ...common,
          backgroundColor: "transparent",
          border: "none",
          borderRadius: 0,
          p: 0,
        };

      case "line":
      default:
        return {
          ...common,
          backgroundColor: "transparent",
          borderBottom: `1px solid ${t.border}`,
          borderRadius: 0,
          p: 0,
        };
    }
  };

  const getTabsStyles = () => {
    return {
      minHeight: "unset",

      "& .MuiTabs-flexContainer": {
        gap: 4,
      },

      "& .MuiTabs-indicator": isLineVariant
        ? {
            display: "block",
            height: 3,
            borderRadius: "999px 999px 0 0",
            backgroundColor: active.main,
          }
        : {
            display: "none",
          },

      "& .MuiTabs-scrollButtons": {
        color: t.textMuted,
      },
    };
  };

  const getTabStyles = () => {
    const common = {
      minHeight: activeSize.minHeight,
      minWidth: tabMinWidth,
      px: activeSize.px,
      py: activeSize.py,
      fontSize: activeSize.fontSize,
      fontWeight: 600,
      textTransform: "none",
      lineHeight: 1.2,
      color: t.textMuted,
      alignItems: "center",
      justifyContent: "center",
      opacity: 1,
      flex: stretch || fullWidth ? 1 : undefined,
      transition:
        "background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",

      "& .MuiTab-iconWrapper": {
        marginBottom: 0,
        marginRight: 8,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",

        "& svg": {
          fontSize: activeSize.iconSize,
        },
      },

      "&:hover": {
        color: active.main,
      },

      "&.Mui-focusVisible": {
        boxShadow: t.focusRing,
      },

      "&.Mui-disabled": {
        color: t.disabledText,
        opacity: 1,
      },
    };

    switch (variant) {
      case "pills":
        return {
          ...common,
          borderRadius: resolvedRadius,
          backgroundColor: "transparent",
          border: "1px solid transparent",

          "&:hover": {
            backgroundColor: active.soft,
            color: active.main,
          },

          "&.Mui-selected": {
            backgroundColor: active.main,
            color: active.contrast,
            borderColor: active.main,
            fontWeight: 700,
            boxShadow: elevation ? t.shadowSm : "none",
          },

          "&.Mui-selected:hover": {
            backgroundColor: active.hover,
            color: active.contrast,
            borderColor: active.hover,
          },
        };

      case "soft":
        return {
          ...common,
          borderRadius: resolvedRadius,
          backgroundColor: "transparent",
          border: "1px solid transparent",

          "&:hover": {
            backgroundColor: active.soft,
            color: active.main,
          },

          "&.Mui-selected": {
            backgroundColor: active.soft,
            color: active.main,
            borderColor: active.border,
            fontWeight: 700,
          },

          "&.Mui-selected:hover": {
            backgroundColor: active.soft,
            color: active.main,
          },
        };

      case "enclosed":
        return {
          ...common,
          borderRadius: resolvedRadius,
          backgroundColor: "transparent",
          border: "1px solid transparent",

          "&:hover": {
            backgroundColor: t.surfaceHover,
            color: active.main,
          },

          "&.Mui-selected": {
            backgroundColor: t.surface,
            color: active.main,
            borderColor: t.border,
            fontWeight: 700,
            boxShadow: t.shadowXs,
          },

          "&.Mui-selected:hover": {
            backgroundColor: t.surface,
            color: active.main,
          },
        };

      case "text":
        return {
          ...common,
          borderRadius: resolvedRadius,
          backgroundColor: "transparent",
          border: "1px solid transparent",

          "&:hover": {
            backgroundColor: active.soft,
            color: active.main,
          },

          "&.Mui-selected": {
            backgroundColor: "transparent",
            color: active.main,
            fontWeight: 700,
          },

          "&.Mui-selected:hover": {
            backgroundColor: active.soft,
            color: active.main,
          },
        };

      case "line":
      default:
        return {
          ...common,
          borderRadius: `${resolvedRadius} ${resolvedRadius} 0 0`,
          backgroundColor: "transparent",
          border: "1px solid transparent",
          borderBottom: "none",

          "&:hover": {
            backgroundColor: t.hoverOverlay,
            color: active.main,
          },

          "&.Mui-selected": {
            color: active.main,
            fontWeight: 700,
            backgroundColor: active.soft,
          },

          "&.Mui-selected:hover": {
            backgroundColor: active.soft,
            color: active.main,
          },
        };
    }
  };

  const renderBadge = (badge, selected = false) => {
    if (badge === undefined || badge === null) return null;

    const isPillSelected = variant === "pills" && selected;

    return (
      <Box
        component="span"
        sx={{
          minWidth: activeSize.badgeSize,
          height: activeSize.badgeSize,
          px: 0.75,
          borderRadius: "999px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: activeSize.badgeFontSize,
          fontWeight: 700,
          lineHeight: 1,
          backgroundColor: isPillSelected
            ? "rgba(255,255,255,0.18)"
            : active.soft,
          color: isPillSelected ? active.contrast : active.main,
          border: isPillSelected
            ? "1px solid rgba(255,255,255,0.2)"
            : "1px solid transparent",
        }}
      >
        {badge}
      </Box>
    );
  };

  const currentTab =
    tabs.find((tab, index) => (tab.value ?? index) === value) ?? null;

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <Box sx={getWrapperStyles()}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant={
            scrollable ? "scrollable" : fullWidth ? "fullWidth" : "standard"
          }
          centered={!scrollable && centered}
          scrollButtons={scrollable ? "auto" : false}
          allowScrollButtonsMobile={scrollable}
          sx={{
            ...getTabsStyles(),
            ...tabsSx,
          }}
          {...props}
        >
          {tabs.map((item, index) => {
            const tabValue = item.value ?? index;
            const selected = value === tabValue;

            return (
              <Tab
                key={item.key || itemValueKey(item, index)}
                value={tabValue}
                disabled={disabled || item.disabled}
                disableRipple
                icon={item.icon}
                iconPosition={item.iconPosition || "start"}
                label={
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: activeSize.gap,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>{item.label}</span>
                    {renderBadge(item.badge, selected)}
                  </Box>
                }
                sx={{
                  ...getTabStyles(),
                  ...(item.sx || {}),
                  ...tabSx,
                }}
              />
            );
          })}
        </Tabs>
      </Box>

      {showPanels && currentTab?.content !== undefined ? (
        <Box
          role="tabpanel"
          sx={{
            mt: 2,
            color: t.text,
            ...panelSx,
          }}
        >
          {currentTab.content}
        </Box>
      ) : null}
    </Box>
  );
};

const itemValueKey = (item, index) => {
  if (item?.key) return item.key;
  if (item?.value !== undefined) return `tab-${String(item.value)}`;
  if (item?.label) return `tab-${String(item.label)}-${index}`;
  return `tab-${index}`;
};

export default AppTabs;
