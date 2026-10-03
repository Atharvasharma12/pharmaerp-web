import React from "react";
import { Box, Typography } from "@mui/material";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";
import AppCard from "./AppCard";
import AppBadge from "./AppBadge";

const AppStatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend, // up | down | neutral
  trendValue,
  colorVariant = "primary", // primary | success | error | warning | info
  variant = "default", // default | soft | outlined
  loading = false,
  sx = {},
  iconSx = {},
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const t = getThemeTokens(activeMode, colorTheme);

  const colorMap = {
    primary: { main: t.primary, soft: t.primarySoft },
    success: { main: t.success, soft: t.successSoft },
    error: { main: t.error, soft: t.errorSoft },
    warning: { main: t.warning, soft: t.warningSoft },
    info: { main: t.info, soft: t.infoSoft },
    neutral: { main: t.neutral || t.textMuted, soft: t.surfaceAlt },
  };

  const active = colorMap[colorVariant] || colorMap.primary;

  const trendMap = {
    up: {
      icon: <TrendingUpRoundedIcon />,
      color: t.success,
    },
    down: {
      icon: <TrendingDownRoundedIcon />,
      color: t.error,
    },
    neutral: {
      icon: null,
      color: t.textMuted,
    },
  };

  const activeTrend = trendMap[trend];

  return (
    <AppCard
      variant={variant}
      padding="none"
      shadow="xs"
      rounded="lg"
      sx={sx}
      contentSx={{
        p: 1.5,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: icon ? "38px minmax(0, 1fr)" : "1fr",
          alignItems: "flex-start",
          gap: 1.75,
        }}
      >
        {/* Left Icon */}
        {icon ? (
          <Box
            sx={{
              width: 38,
              height: 38,
              minWidth: 38,
              borderRadius: "11px",
              backgroundColor: active.soft,
              color: active.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 0,

              "& svg": {
                fontSize: 19,
              },

              ...iconSx,
            }}
          >
            {icon}
          </Box>
        ) : null}

        {/* Right Info */}
        <Box sx={{ minWidth: 0 }}>
          {title ? (
            <Typography
              sx={{
                fontSize: "11px",
                color: t.textMuted,
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
          ) : null}

          {value !== undefined && value !== null ? (
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: 800,
                color: t.text,
                lineHeight: 1.15,
              }}
            >
              {loading ? "..." : value}
            </Typography>
          ) : null}

          {subtitle ? (
            <Typography
              sx={{
                fontSize: "11px",
                color: t.textMuted,
                mt: 0.65,
                lineHeight: "16px",
              }}
            >
              {subtitle}
            </Typography>
          ) : null}
        </Box>
      </Box>

      {(trend || trendValue) && (
        <Box mt={1.5} display="flex" alignItems="center" gap={1}>
          {trend && activeTrend?.icon ? (
            <Box
              sx={{
                color: activeTrend.color,
                display: "flex",
                alignItems: "center",
                lineHeight: 0,

                "& svg": {
                  fontSize: 16,
                },
              }}
            >
              {activeTrend.icon}
            </Box>
          ) : null}

          {trendValue ? (
            <AppBadge
              label={trendValue}
              size="small"
              variant="soft"
              colorVariant={
                trend === "up"
                  ? "success"
                  : trend === "down"
                    ? "error"
                    : "neutral"
              }
            />
          ) : null}
        </Box>
      )}
    </AppCard>
  );
};

export default AppStatCard;
