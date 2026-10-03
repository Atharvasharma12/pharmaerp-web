import React from "react";
import { Chip, IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppBadge = ({
  label,
  children,
  variant = "soft", // soft | contained | outlined | text
  colorVariant = "primary", // primary | success | error | warning | info | dark | neutral
  size = "medium", // small | medium | large
  rounded = "full", // sm | md | lg | full
  startIcon,
  endIcon,
  dot = false,
  removable = false,
  onDelete,
  disabled = false,
  clickable = false,
  onClick,
  sx = {},
  ...props
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
      minHeight: 24,
      fontSize: "0.72rem",
      px: 1,
      gap: 0.5,
      iconSize: 14,
      dotSize: 7,
      deleteIconSize: 14,
    },
    medium: {
      minHeight: 28,
      fontSize: "0.78rem",
      px: 1.25,
      gap: 0.625,
      iconSize: 16,
      dotSize: 8,
      deleteIconSize: 16,
    },
    large: {
      minHeight: 34,
      fontSize: "0.86rem",
      px: 1.5,
      gap: 0.75,
      iconSize: 18,
      dotSize: 9,
      deleteIconSize: 18,
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;

  const variantStyles = {
    contained: {
      backgroundColor: active.main,
      color: active.contrast,
      border: `1px solid ${active.main}`,
      "&:hover": clickable
        ? {
            backgroundColor: active.hover,
            borderColor: active.hover,
          }
        : undefined,
    },

    outlined: {
      backgroundColor: "transparent",
      color: active.main,
      border: `1px solid ${active.border}`,
      "&:hover": clickable
        ? {
            backgroundColor: active.soft,
            borderColor: active.main,
          }
        : undefined,
    },

    text: {
      backgroundColor: "transparent",
      color: active.main,
      border: "1px solid transparent",
      "&:hover": clickable
        ? {
            backgroundColor: active.soft,
          }
        : undefined,
    },

    soft: {
      backgroundColor: active.soft,
      color: active.main,
      border: `1px solid transparent`,
      "&:hover": clickable
        ? {
            backgroundColor: active.soft,
            filter: "brightness(0.98)",
            borderColor: active.border,
          }
        : undefined,
    },
  };

  const appliedVariant = variantStyles[variant] || variantStyles.soft;

  const contentColor = variant === "contained" ? active.contrast : active.main;

  const deleteIconColor =
    variant === "contained" ? active.contrast : active.main;

  const resolvedLabel = label ?? children;

  const renderStart = () => {
    if (dot) {
      return (
        <span
          style={{
            width: activeSize.dotSize,
            height: activeSize.dotSize,
            minWidth: activeSize.dotSize,
            borderRadius: "999px",
            display: "inline-block",
            backgroundColor: contentColor,
          }}
        />
      );
    }

    if (startIcon) {
      return startIcon;
    }

    return null;
  };

  return (
    <Chip
      label={resolvedLabel}
      disabled={disabled}
      clickable={clickable || !!onClick}
      onClick={onClick}
      onDelete={removable ? onDelete : undefined}
      deleteIcon={
        removable ? (
          <CloseRoundedIcon
            sx={{
              fontSize: activeSize.deleteIconSize,
              color: `${deleteIconColor} !important`,
            }}
          />
        ) : undefined
      }
      icon={renderStart()}
      {...props}
      sx={{
        height: "auto",
        minHeight: activeSize.minHeight,
        borderRadius: radiusMap[rounded] || radiusMap.full,
        fontSize: activeSize.fontSize,
        fontWeight: 600,
        px: activeSize.px,
        py: 0.25,
        gap: activeSize.gap,
        transition:
          "background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease, transform 0.18s ease",
        cursor: clickable || onClick ? "pointer" : "default",
        ...appliedVariant,

        "& .MuiChip-label": {
          paddingLeft: 0,
          paddingRight: 0,
          display: "flex",
          alignItems: "center",
          gap: activeSize.gap,
          lineHeight: 1.2,
          color: "inherit",
        },

        "& .MuiChip-icon": {
          marginLeft: 0,
          marginRight: 0,
          color: "inherit",
          fontSize: activeSize.iconSize,
        },

        "& .MuiChip-deleteIcon": {
          margin: 0,
          marginLeft: 6,
          color: `${deleteIconColor} !important`,
          opacity: 0.9,
          transition: "opacity 0.18s ease, transform 0.18s ease",
          "&:hover": {
            opacity: 1,
            transform: "scale(1.04)",
          },
        },

        "& .MuiChip-avatar": {
          width: activeSize.iconSize + 6,
          height: activeSize.iconSize + 6,
          fontSize: activeSize.fontSize,
        },

        "&:focus-visible": {
          outline: "none",
          boxShadow: t.focusRing,
        },

        "&:active": clickable || onClick ? { transform: "scale(0.985)" } : {},

        "&.Mui-disabled": {
          backgroundColor:
            variant === "contained" || variant === "soft"
              ? t.disabledBg
              : "transparent",
          color: t.disabledText,
          borderColor:
            variant === "outlined" ? t.disabledBorder : "transparent",
          cursor: "not-allowed",
          opacity: 1,
        },

        ...sx,
      }}
    />
  );
};

export default AppBadge;
