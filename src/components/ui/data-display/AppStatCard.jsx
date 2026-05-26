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
    <AppCard variant={variant} padding="md" shadow="xs" rounded="lg" sx={sx}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        {/* Left */}
        <Box>
          {title && (
            <Typography
              sx={{
                fontSize: "0.82rem",
                color: t.textMuted,
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
          )}

          {value && (
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: t.text,
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>
          )}

          {subtitle && (
            <Typography
              sx={{
                fontSize: "0.78rem",
                color: t.textMuted,
                mt: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Right Icon */}
        {icon && (
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              backgroundColor: active.soft,
              color: active.main,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              "& svg": {
                fontSize: 22,
              },

              ...iconSx,
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      {/* Trend */}
      {(trend || trendValue) && (
        <Box mt={1.5} display="flex" alignItems="center" gap={1}>
          {trend && activeTrend?.icon && (
            <Box
              sx={{
                color: activeTrend.color,
                display: "flex",
                alignItems: "center",

                "& svg": {
                  fontSize: 16,
                },
              }}
            >
              {activeTrend.icon}
            </Box>
          )}

          {trendValue && (
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
          )}
        </Box>
      )}
    </AppCard>
  );
};

export default AppStatCard;
