import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppKpiCard = ({
  title,
  value,
  subtitle,
  icon,
  footer,
  trend, // { value: "+12.4%", direction: "up" | "down" | "neutral", label?: "vs last month" }
  badge, // string | node
  variant = "surface", // surface | soft | outlined
  colorVariant = "primary", // primary | success | error | warning | info | dark | neutral
  size = "medium", // small | medium | large
  loading = false,
  compact = false,
  elevation = true,
  fullHeight = false,
  onClick,
  sx = {},
  contentSx = {},
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = getThemeTokens(theme);

  const colorMap = {
    primary: {
      main: t.primary,
      hover: t.primaryHover,
      soft: t.primarySoft,
      contrast: t.primaryContrast,
      border: t.primary,
    },
    success: {
      main: t.success,
      hover: t.successHover,
      soft: t.successSoft,
      contrast: t.successContrast,
      border: t.success,
    },
    error: {
      main: t.error,
      hover: t.errorHover,
      soft: t.errorSoft,
      contrast: t.errorContrast,
      border: t.error,
    },
    warning: {
      main: t.warning,
      hover: t.warningHover,
      soft: t.warningSoft,
      contrast: t.warningContrast,
      border: t.warning,
    },
    info: {
      main: t.info,
      hover: t.infoHover,
      soft: t.infoSoft,
      contrast: t.infoContrast,
      border: t.info,
    },
    dark: {
      main: isDark ? t.neutral[100] : t.neutral[900],
      hover: isDark ? t.neutral[200] : t.neutral[800],
      soft: isDark ? t.surfaceHover : t.neutral[100],
      contrast: isDark ? t.text : t.textInverse,
      border: isDark ? t.borderStrong : t.neutral[300],
    },
    neutral: {
      main: isDark ? t.neutral[500] : t.neutral[600],
      hover: isDark ? t.neutral[400] : t.neutral[700],
      soft: isDark ? t.surfaceHover : t.neutral[100],
      contrast: isDark ? t.text : t.textInverse,
      border: isDark ? t.neutral[400] : t.neutral[300],
    },
  };

  const active = colorMap[colorVariant] || colorMap.primary;

  const sizeMap = {
    small: {
      p: 1.5,
      iconBox: 34,
      titleSize: "0.78rem",
      valueSize: "1.25rem",
      subtitleSize: "0.76rem",
      badgeSize: "0.68rem",
      gap: 1,
      footerGap: 1,
    },
    medium: {
      p: 2,
      iconBox: 42,
      titleSize: "0.84rem",
      valueSize: "1.7rem",
      subtitleSize: "0.82rem",
      badgeSize: "0.72rem",
      gap: 1.25,
      footerGap: 1.25,
    },
    large: {
      p: 2.5,
      iconBox: 48,
      titleSize: "0.9rem",
      valueSize: "2rem",
      subtitleSize: "0.88rem",
      badgeSize: "0.76rem",
      gap: 1.5,
      footerGap: 1.5,
    },
  };

  const currentSize = sizeMap[size] || sizeMap.medium;

  const trendMap = {
    up: {
      color: t.success,
      soft: t.successSoft,
      icon: <TrendingUpRoundedIcon sx={{ fontSize: 16 }} />,
    },
    down: {
      color: t.error,
      soft: t.errorSoft,
      icon: <TrendingDownRoundedIcon sx={{ fontSize: 16 }} />,
    },
    neutral: {
      color: t.textMuted,
      soft: t.surfaceHover,
      icon: <RemoveRoundedIcon sx={{ fontSize: 16 }} />,
    },
  };

  const resolvedTrend = trend?.direction
    ? trendMap[trend.direction] || trendMap.neutral
    : null;

  const variantStyles = {
    surface: {
      backgroundColor: t.surface,
      border: `1px solid ${t.border}`,
    },
    soft: {
      backgroundColor: active.soft,
      border: `1px solid transparent`,
    },
    outlined: {
      backgroundColor: t.surface,
      border: `1px solid ${active.border}`,
    },
  };

  const appliedVariant = variantStyles[variant] || variantStyles.surface;

  const clickable = typeof onClick === "function";

  const renderBadge = () => {
    if (!badge) return null;

    return (
      <Box
        sx={{
          px: 1,
          py: 0.4,
          borderRadius: "999px",
          backgroundColor: active.soft,
          color: active.main,
          border: `1px solid transparent`,
          fontSize: currentSize.badgeSize,
          fontWeight: 700,
          lineHeight: 1,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          whiteSpace: "nowrap",
        }}
      >
        {badge}
      </Box>
    );
  };

  const renderTrend = () => {
    if (!trend?.value) return null;

    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          px: 0.85,
          py: 0.45,
          borderRadius: "999px",
          backgroundColor: resolvedTrend?.soft || t.surfaceHover,
          color: resolvedTrend?.color || t.textMuted,
          fontSize: currentSize.badgeSize,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "inherit",
          }}
        >
          {resolvedTrend?.icon}
        </Box>

        <Box component="span">{trend.value}</Box>

        {trend.label ? (
          <Box
            component="span"
            sx={{
              color: t.textMuted,
              fontWeight: 600,
            }}
          >
            {trend.label}
          </Box>
        ) : null}
      </Box>
    );
  };

  const renderLoading = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: currentSize.gap,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Skeleton
          variant="text"
          width={110}
          height={20}
          sx={{ bgcolor: t.surfaceHover, transform: "none" }}
        />
        <Skeleton
          variant="rounded"
          width={60}
          height={24}
          sx={{ bgcolor: t.surfaceHover }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Skeleton
            variant="text"
            width="55%"
            height={38}
            sx={{ bgcolor: t.surfaceHover, transform: "none" }}
          />
          <Skeleton
            variant="text"
            width="70%"
            height={18}
            sx={{ bgcolor: t.surfaceHover, transform: "none" }}
          />
        </Box>

        <Skeleton
          variant="rounded"
          width={currentSize.iconBox}
          height={currentSize.iconBox}
          sx={{ bgcolor: t.surfaceHover }}
        />
      </Box>

      <Skeleton
        variant="rounded"
        width={120}
        height={28}
        sx={{ bgcolor: t.surfaceHover }}
      />
    </Box>
  );

  return (
    <Box
      onClick={onClick}
      sx={{
        width: "100%",
        height: fullHeight ? "100%" : "auto",
        borderRadius: "16px",
        p: currentSize.p,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: currentSize.gap,
        transition:
          "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
        boxShadow: elevation ? t.shadowSm : "none",
        cursor: clickable ? "pointer" : "default",
        ...appliedVariant,

        "&:hover": clickable
          ? {
              boxShadow: elevation ? t.shadowLg : "none",
              transform: "translateY(-2px)",
            }
          : undefined,

        "&:focus-visible": clickable
          ? {
              outline: "none",
              boxShadow: `${t.focusRing}, ${elevation ? t.shadowLg : "none"}`,
            }
          : undefined,

        ...sx,
      }}
      {...props}
    >
      {loading ? (
        renderLoading()
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 1.5,
              ...contentSx,
            }}
          >
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: compact ? 0.75 : 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                {title ? (
                  <Typography
                    sx={{
                      fontSize: currentSize.titleSize,
                      fontWeight: 700,
                      color: t.textMuted,
                      lineHeight: 1.2,
                    }}
                  >
                    {title}
                  </Typography>
                ) : (
                  <span />
                )}

                {renderBadge()}
              </Box>

              {value !== undefined && value !== null ? (
                <Typography
                  sx={{
                    fontSize: currentSize.valueSize,
                    fontWeight: 800,
                    color: t.text,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    wordBreak: "break-word",
                  }}
                >
                  {value}
                </Typography>
              ) : null}

              {subtitle ? (
                <Typography
                  sx={{
                    fontSize: currentSize.subtitleSize,
                    color: t.textMuted,
                    lineHeight: 1.45,
                  }}
                >
                  {subtitle}
                </Typography>
              ) : null}
            </Box>

            {icon ? (
              <Box
                sx={{
                  width: currentSize.iconBox,
                  height: currentSize.iconBox,
                  minWidth: currentSize.iconBox,
                  borderRadius: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: active.soft,
                  color: active.main,
                  border: `1px solid transparent`,
                  "& svg": {
                    fontSize: currentSize.iconBox * 0.5,
                  },
                }}
              >
                {icon}
              </Box>
            ) : null}
          </Box>

          {(trend?.value || footer) && (
            <Box
              sx={{
                display: "flex",
                alignItems: compact ? "flex-start" : "center",
                justifyContent: "space-between",
                flexDirection: compact ? "column" : "row",
                gap: currentSize.footerGap,
                pt: compact ? 0.25 : 0.5,
              }}
            >
              {renderTrend()}

              {footer ? (
                <Box
                  sx={{
                    color: t.textMuted,
                    fontSize: currentSize.subtitleSize,
                    lineHeight: 1.4,
                  }}
                >
                  {footer}
                </Box>
              ) : null}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default AppKpiCard;
