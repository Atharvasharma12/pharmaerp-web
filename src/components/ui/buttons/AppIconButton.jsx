import React from "react";
import { IconButton, Box } from "@mui/material";

import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";
import { AppLoader, AppTooltip } from "@/components";

const AppIconButton = ({
  icon,
  children,
  onClick,
  type = "button",
  variant = "contained", // contained | outlined | text | soft | gradient
  colorVariant = "primary", // primary | success | error | warning | info | dark
  size = "medium", // small | medium | large
  rounded = "md", // sm | md | lg | full
  disabled = false,
  loading = false,
  elevation = false,

  tooltip = "",
  tooltipPlacement = "top",
  tooltipVariant = "default",
  tooltipSize = "medium",
  tooltipDisabled = false,

  loaderVariant = "spinner", // spinner | dots | pulse
  sx = {},
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = getThemeTokens(theme);

  const colorMap = {
    primary: {
      main: t.primary,
      hover: t.primaryHover,
      text: t.primaryContrast,
      soft: t.primarySoft,
      border: t.primary,
    },
    success: {
      main: t.success,
      hover: t.successHover,
      text: t.successContrast,
      soft: t.successSoft,
      border: t.success,
    },
    error: {
      main: t.error,
      hover: t.errorHover,
      text: t.errorContrast,
      soft: t.errorSoft,
      border: t.error,
    },
    warning: {
      main: t.warning,
      hover: t.warningHover,
      text: t.warningContrast,
      soft: t.warningSoft,
      border: t.warning,
    },
    info: {
      main: t.info,
      hover: t.infoHover,
      text: t.infoContrast,
      soft: t.infoSoft,
      border: t.info,
    },
    dark: {
      main: isDark ? t.neutral[100] : t.neutral[900],
      hover: isDark ? t.neutral[200] : t.neutral[800],
      text: isDark ? t.text : t.textInverse,
      soft: isDark ? t.surfaceHover : t.neutral[100],
      border: isDark ? t.borderStrong : t.neutral[300],
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
      buttonSize: 32,
      iconSize: 18,
      loaderSize: "small",
    },
    medium: {
      buttonSize: 38,
      iconSize: 20,
      loaderSize: "small",
    },
    large: {
      buttonSize: 44,
      iconSize: 22,
      loaderSize: "small",
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;

  const baseStyles = {
    width: activeSize.buttonSize,
    height: activeSize.buttonSize,
    minWidth: activeSize.buttonSize,
    borderRadius: radiusMap[rounded] || radiusMap.md,
    boxShadow: "none",
    transition:
      "background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease",

    "& svg": {
      fontSize: activeSize.iconSize,
    },

    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: elevation ? t.shadowMd : "none",
    },

    "&:active": {
      transform: "translateY(0)",
      boxShadow: elevation ? t.shadowSm : "none",
    },

    "&:focus-visible": {
      outline: "none",
      boxShadow: `${t.focusRing}${elevation ? `, ${t.shadowMd}` : ""}`,
    },

    "&.Mui-disabled": {
      backgroundColor:
        variant === "contained" || variant === "gradient" || variant === "soft"
          ? t.disabledBg
          : "transparent",
      color: t.disabledText,
      borderColor: variant === "outlined" ? t.disabledBorder : "transparent",
      boxShadow: "none",
      transform: "none",
      cursor: "not-allowed",
      pointerEvents: "auto",
    },
  };

  const variantStyles = {
    contained: {
      backgroundColor: active.main,
      color: active.text,
      border: `1px solid ${active.main}`,

      "&:hover": {
        backgroundColor: active.hover,
        borderColor: active.hover,
        boxShadow: elevation ? t.shadowLg : "none",
      },

      "&:active": {
        backgroundColor: active.hover,
        filter: "brightness(0.98)",
      },
    },

    outlined: {
      backgroundColor: "transparent",
      color: active.main,
      border: `1px solid ${active.border}`,

      "&:hover": {
        backgroundColor: active.soft,
        borderColor: active.main,
      },

      "&:active": {
        backgroundColor: t.activeOverlay,
      },
    },

    text: {
      backgroundColor: "transparent",
      color: active.main,
      border: "1px solid transparent",

      "&:hover": {
        backgroundColor: active.soft,
      },

      "&:active": {
        backgroundColor: t.activeOverlay,
      },
    },

    soft: {
      backgroundColor: active.soft,
      color: active.main,
      border: "1px solid transparent",

      "&:hover": {
        backgroundColor: active.soft,
        borderColor: active.border,
        filter: "brightness(0.98)",
      },

      "&:active": {
        backgroundColor: active.soft,
        filter: "brightness(0.95)",
      },
    },

    gradient: {
      backgroundImage: `linear-gradient(135deg, ${active.main}, ${active.hover})`,
      color: active.text,
      border: "none",

      "&:hover": {
        filter: "brightness(1.03)",
        boxShadow: elevation ? t.shadowLg : t.shadowSm,
      },

      "&:active": {
        filter: "brightness(0.97)",
      },
    },
  };

  const appliedVariant = variantStyles[variant] || variantStyles.contained;

  const loaderColor =
    variant === "outlined" || variant === "text" || variant === "soft"
      ? active.main
      : active.text;

  const buttonNode = (
    <span>
      <IconButton
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        {...props}
        sx={{
          ...baseStyles,
          ...appliedVariant,
          ...sx,
        }}
      >
        {loading ? (
          <AppLoader
            size={activeSize.loaderSize}
            variant={loaderVariant}
            colorVariant={colorVariant === "dark" ? "primary" : colorVariant}
            center={false}
            sx={{
              width: "auto",
              minHeight: "auto",
              display: "inline-flex",
              color: loaderColor,
              "& .MuiCircularProgress-root": {
                color: loaderColor,
              },
            }}
          />
        ) : (
          icon || children
        )}
      </IconButton>
    </span>
  );

  return (
    <AppTooltip
      title={tooltip}
      placement={tooltipPlacement}
      variant={tooltipVariant}
      size={tooltipSize}
      disabled={tooltipDisabled || !tooltip}
    >
      {buttonNode}
    </AppTooltip>
  );
};

export default AppIconButton;
