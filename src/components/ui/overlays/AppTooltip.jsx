import React from "react";
import { Tooltip, Zoom } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppTooltip = ({
  children,
  title,
  placement = "top",
  arrow = true,
  enterDelay = 300,
  leaveDelay = 0,
  disabled = false,
  variant = "default", // default | dark | light | primary | success | error | warning | info
  size = "medium", // small | medium | large
  maxWidth = 260,
  followCursor = false,
  open,
  onOpen,
  onClose,
  sx = {},
  slotProps = {},
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = getThemeTokens(theme);

  if (!title || disabled) {
    return children;
  }

  const sizeMap = {
    small: {
      fontSize: "0.72rem",
      px: 1,
      py: 0.55,
      borderRadius: "6px",
    },
    medium: {
      fontSize: "0.78rem",
      px: 1.2,
      py: 0.7,
      borderRadius: "8px",
    },
    large: {
      fontSize: "0.86rem",
      px: 1.5,
      py: 0.9,
      borderRadius: "10px",
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;

  const variantMap = {
    default: {
      bg: isDark ? "#f9fafb" : "#111827",
      color: isDark ? "#111827" : "#ffffff",
      border: isDark ? "rgba(255,255,255,0.18)" : "transparent",
    },
    dark: {
      bg: isDark ? "#f9fafb" : "#111827",
      color: isDark ? "#111827" : "#ffffff",
      border: isDark ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.12)",
    },
    light: {
      bg: isDark ? t.surfaceAlt : "#ffffff",
      color: t.text,
      border: t.borderStrong || t.border,
    },
    primary: {
      bg: t.primary,
      color: t.primaryContrast || "#ffffff",
      border: t.primary,
    },
    success: {
      bg: t.success,
      color: t.successContrast || "#ffffff",
      border: t.success,
    },
    error: {
      bg: t.error,
      color: t.errorContrast || "#ffffff",
      border: t.error,
    },
    warning: {
      bg: t.warning,
      color: t.warningContrast || "#ffffff",
      border: t.warning,
    },
    info: {
      bg: t.info,
      color: t.infoContrast || "#ffffff",
      border: t.info,
    },
  };

  const activeVariant = variantMap[variant] || variantMap.default;

  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow={arrow}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      followCursor={followCursor}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      slots={{
        transition: Zoom,
      }}
      slotProps={{
        ...slotProps,
        tooltip: {
          ...slotProps.tooltip,
          sx: {
            backgroundColor: activeVariant.bg,
            color: activeVariant.color,
            border: `1px solid ${activeVariant.border}`,
            borderRadius: activeSize.borderRadius,
            px: activeSize.px,
            py: activeSize.py,
            fontSize: activeSize.fontSize,
            fontWeight: 700,
            lineHeight: 1.45,
            maxWidth,
            boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.45)" : t.shadowMd,
            backgroundImage: "none",
            ...slotProps.tooltip?.sx,
            ...sx,
          },
        },
        arrow: {
          ...slotProps.arrow,
          sx: {
            color: activeVariant.bg,
            "&::before": {
              border: `1px solid ${activeVariant.border}`,
              boxSizing: "border-box",
            },
            ...slotProps.arrow?.sx,
          },
        },
      }}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default AppTooltip;
