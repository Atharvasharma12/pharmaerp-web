import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";
import AppBadge from "./AppBadge";

const AppAvatar = ({
  src,
  alt = "",
  name = "",
  initials = "",
  icon = null,
  size = "medium", // xs | small | medium | large | xl
  shape = "circle", // circle | rounded | square
  colorVariant = "primary", // primary | success | error | warning | info | dark | neutral
  status, // online | offline | busy | away
  showStatus = false,
  badge,
  showName = false,
  subtitle = "",
  clickable = false,
  disabled = false,
  onClick,
  sx = {},
  avatarSx = {},
  nameSx = {},
  subtitleSx = {},
  ...props
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const isDark = activeMode === "dark";
  const t = getThemeTokens(activeMode, colorTheme);

  const colorMap = {
    primary: {
      main: t.primary,
      soft: t.primarySoft,
      contrast: t.primaryContrast,
    },
    success: {
      main: t.success,
      soft: t.successSoft,
      contrast: t.successContrast,
    },
    error: {
      main: t.error,
      soft: t.errorSoft,
      contrast: t.errorContrast,
    },
    warning: {
      main: t.warning,
      soft: t.warningSoft,
      contrast: t.warningContrast,
    },
    info: {
      main: t.info,
      soft: t.infoSoft,
      contrast: t.infoContrast,
    },
    dark: {
      main: isDark ? t.neutral[100] : t.neutral[900],
      soft: isDark ? t.surfaceHover : t.neutral[100],
      contrast: isDark ? t.text : t.textInverse,
    },
    neutral: {
      main: isDark ? t.neutral[500] : t.neutral[600],
      soft: isDark ? t.surfaceHover : t.neutral[100],
      contrast: isDark ? t.neutral[900] : "#ffffff",
    },
  };

  const active = colorMap[colorVariant] || colorMap.primary;

  const sizeMap = {
    xs: {
      avatar: 26,
      fontSize: "0.7rem",
      icon: 15,
      name: "0.78rem",
      subtitle: "0.7rem",
      status: 7,
    },
    small: {
      avatar: 34,
      fontSize: "0.78rem",
      icon: 18,
      name: "0.84rem",
      subtitle: "0.74rem",
      status: 8,
    },
    medium: {
      avatar: 42,
      fontSize: "0.9rem",
      icon: 22,
      name: "0.9rem",
      subtitle: "0.78rem",
      status: 9,
    },
    large: {
      avatar: 54,
      fontSize: "1rem",
      icon: 26,
      name: "0.98rem",
      subtitle: "0.82rem",
      status: 10,
    },
    xl: {
      avatar: 72,
      fontSize: "1.25rem",
      icon: 34,
      name: "1.05rem",
      subtitle: "0.88rem",
      status: 12,
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;

  const radiusMap = {
    circle: "50%",
    rounded: "12px",
    square: "8px",
  };

  const statusColorMap = {
    online: t.success,
    offline: t.textDisabled,
    busy: t.error,
    away: t.warning,
  };

  const resolvedInitials =
    initials ||
    name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((item) => item[0])
      .join("")
      .toUpperCase();

  const avatarNode = (
    <Box
      sx={{
        position: "relative",
        width: activeSize.avatar,
        height: activeSize.avatar,
        flexShrink: 0,
      }}
    >
      <Avatar
        src={src}
        alt={alt || name}
        onClick={disabled ? undefined : onClick}
        {...props}
        sx={{
          width: activeSize.avatar,
          height: activeSize.avatar,
          borderRadius: radiusMap[shape] || radiusMap.circle,
          backgroundColor: active.soft,
          color: active.main,
          border: `1px solid ${t.border}`,
          fontSize: activeSize.fontSize,
          fontWeight: 800,
          cursor: clickable || onClick ? "pointer" : "default",
          opacity: disabled ? 0.55 : 1,
          transition:
            "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",

          "&:hover":
            clickable || onClick
              ? {
                  transform: disabled ? "none" : "translateY(-1px)",
                  boxShadow: disabled ? "none" : t.shadowSm,
                  borderColor: disabled ? t.border : active.main,
                }
              : {},

          "&:focus-visible": {
            outline: "none",
            boxShadow: t.focusRing,
          },

          ...avatarSx,
        }}
      >
        {icon || resolvedInitials || (
          <PersonRoundedIcon sx={{ fontSize: activeSize.icon }} />
        )}
      </Avatar>

      {showStatus && status ? (
        <Box
          sx={{
            position: "absolute",
            right: 1,
            bottom: 1,
            width: activeSize.status,
            height: activeSize.status,
            borderRadius: "999px",
            backgroundColor: statusColorMap[status] || statusColorMap.offline,
            border: `2px solid ${t.surface}`,
          }}
        />
      ) : null}

      {badge ? (
        <Box
          sx={{
            position: "absolute",
            top: -6,
            right: -8,
          }}
        >
          <AppBadge
            label={badge}
            size="small"
            variant="contained"
            colorVariant="error"
          />
        </Box>
      ) : null}
    </Box>
  );

  if (!showName) {
    return avatarNode;
  }

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.2,
        minWidth: 0,
        opacity: disabled ? 0.65 : 1,
        ...sx,
      }}
    >
      {avatarNode}

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: activeSize.name,
            fontWeight: 700,
            color: t.text,
            lineHeight: 1.25,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            ...nameSx,
          }}
        >
          {name || alt || "User"}
        </Typography>

        {subtitle ? (
          <Typography
            sx={{
              fontSize: activeSize.subtitle,
              color: t.textMuted,
              lineHeight: 1.3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              ...subtitleSx,
            }}
          >
            {subtitle}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
};

export default AppAvatar;
