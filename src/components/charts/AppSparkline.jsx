import React, { useMemo } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppSparkline = ({
  data = [],
  xData,

  title,
  value,
  subtitle,
  footer,

  height = 72,
  width = "100%",

  colorVariant = "primary", // primary | success | error | warning | info | neutral | dark
  variant = "line", // line | area | bar

  showArea = true,
  showTooltip = true,
  showHighlight = true,

  trend, // { value: "+12.5%", direction: "up" | "down" | "neutral", label?: "vs last month" }

  loading = false,
  emptyText = "No sparkline data",

  valueFormatter,
  sx = {},
  chartSx = {},
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const isDark = theme === "dark";
  const hasData = Array.isArray(data) && data.length > 0;

  const getColor = (variantName) => {
    const map = {
      primary: t.primary,
      success: t.success,
      error: t.error,
      warning: t.warning,
      info: t.info,
      neutral: isDark ? t.neutral[500] : t.neutral[600],
      dark: isDark ? t.neutral[100] : t.neutral[900],
    };

    return map[variantName] || t.primary;
  };

  const activeColor = getColor(colorVariant);

  const normalizedData = useMemo(() => {
    return data.map((item) => {
      if (typeof item === "number") return item;
      return Number(item?.value) || 0;
    });
  }, [data]);

  const normalizedXData = useMemo(() => {
    if (Array.isArray(xData) && xData.length > 0) return xData;

    return data.map((item, index) => {
      if (item && typeof item === "object") {
        return item.label ?? item.date ?? item.name ?? index;
      }

      return index;
    });
  }, [data, xData]);

  const trendMap = {
    up: {
      color: t.success,
      soft: t.successSoft,
      icon: <TrendingUpRoundedIcon sx={{ fontSize: 15 }} />,
    },
    down: {
      color: t.error,
      soft: t.errorSoft,
      icon: <TrendingDownRoundedIcon sx={{ fontSize: 15 }} />,
    },
    neutral: {
      color: t.textMuted,
      soft: t.surfaceHover,
      icon: <RemoveRoundedIcon sx={{ fontSize: 15 }} />,
    },
  };

  const resolvedTrend = trend?.direction
    ? trendMap[trend.direction] || trendMap.neutral
    : null;

  const renderTrend = () => {
    if (!trend?.value) return null;

    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.45,
          px: 0.85,
          py: 0.45,
          borderRadius: "999px",
          backgroundColor: resolvedTrend?.soft || t.surfaceHover,
          color: resolvedTrend?.color || t.textMuted,
          fontSize: "0.72rem",
          fontWeight: 800,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
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

  if (loading) {
    return (
      <Box
        sx={{
          width,
          borderRadius: "16px",
          border: `1px solid ${t.border}`,
          backgroundColor: t.surface,
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.2,
          ...sx,
        }}
      >
        <Skeleton
          variant="text"
          width="42%"
          height={18}
          sx={{ bgcolor: t.surfaceHover, transform: "none" }}
        />
        <Skeleton
          variant="text"
          width="30%"
          height={30}
          sx={{ bgcolor: t.surfaceHover, transform: "none" }}
        />
        <Skeleton
          variant="rounded"
          width="100%"
          height={height}
          sx={{ bgcolor: t.surfaceHover, borderRadius: "12px" }}
        />
      </Box>
    );
  }

  if (!hasData) {
    return (
      <Box
        sx={{
          width,
          minHeight: height + 72,
          borderRadius: "16px",
          border: `1px dashed ${t.border}`,
          backgroundColor: t.surfaceAlt,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          ...sx,
        }}
      >
        <Typography
          sx={{
            color: t.textMuted,
            fontSize: "0.88rem",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {emptyText}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width,
        borderRadius: "16px",
        border: `1px solid ${t.border}`,
        backgroundColor: t.surface,
        p: 2,
        overflow: "hidden",
        ...sx,
      }}
    >
      {(title || value || subtitle || trend?.value) && (
        <Box
          sx={{
            mb: 1.25,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1.5,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            {title && (
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  color: t.textMuted,
                  lineHeight: 1.2,
                }}
              >
                {title}
              </Typography>
            )}

            {value !== undefined && value !== null && (
              <Typography
                sx={{
                  mt: title ? 0.6 : 0,
                  fontSize: "1.55rem",
                  fontWeight: 900,
                  color: t.text,
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                }}
              >
                {value}
              </Typography>
            )}

            {subtitle && (
              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: "0.78rem",
                  color: t.textMuted,
                  lineHeight: 1.35,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {renderTrend()}
        </Box>
      )}

      <Box
        sx={{
          height,
          width: "100%",
          color: activeColor,
          "& .MuiLineElement-root": {
            strokeWidth: 2.5,
          },
          "& .MuiAreaElement-root": {
            fillOpacity: showArea ? (isDark ? 0.24 : 0.16) : 0,
          },
          "& .MuiBarElement-root": {
            rx: 4,
          },
          ...chartSx,
        }}
      >
        <SparkLineChart
          data={normalizedData}
          xAxis={{
            data: normalizedXData,
          }}
          height={height}
          colors={[activeColor]}
          curve="monotoneX"
          plotType={variant === "bar" ? "bar" : "line"}
          area={variant !== "bar" && showArea}
          showTooltip={showTooltip}
          showHighlight={showHighlight}
          valueFormatter={valueFormatter}
          margin={{
            top: 8,
            right: 8,
            bottom: 8,
            left: 8,
          }}
        />
      </Box>

      {footer && (
        <Typography
          sx={{
            mt: 1,
            fontSize: "0.75rem",
            color: t.textMuted,
            lineHeight: 1.35,
          }}
        >
          {footer}
        </Typography>
      )}
    </Box>
  );
};

export default AppSparkline;
