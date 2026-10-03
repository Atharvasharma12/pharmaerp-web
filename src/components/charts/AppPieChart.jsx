import React, { useMemo } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppPieChart = ({
  data = [],
  title,
  subtitle,
  height = 320,
  variant = "donut", // pie | donut
  innerRadius,
  outerRadius,
  paddingAngle = 2,
  cornerRadius = 6,
  startAngle = 0,
  endAngle = 360,
  showLegend = true,
  showLabels = true,
  labelType = "value", // value | percent | both
  loading = false,
  emptyText = "No chart data available",
  valueFormatter,
  sx = {},
  chartSx = {},
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const t = getThemeTokens(activeMode, colorTheme);

  const hasData = Array.isArray(data) && data.length > 0;

  const getColor = (colorVariant = "primary", index = 0) => {
    const semanticMap = {
      primary: t.primary,
      success: t.success,
      error: t.error,
      warning: t.warning,
      info: t.info,
      neutral: activeMode === "dark" ? t.neutral[500] : t.neutral[600],
      dark: activeMode === "dark" ? t.neutral[100] : t.neutral[900],
    };

    const palette = [
      t.primary,
      t.success,
      t.warning,
      t.info,
      t.error,
      activeMode === "dark" ? t.neutral[400] : t.neutral[500],
      activeMode === "dark" ? t.neutral[300] : t.neutral[700],
    ];

    return semanticMap[colorVariant] || palette[index % palette.length];
  };

  const total = useMemo(
    () =>
      data.reduce((sum, item) => {
        const value = Number(item.value) || 0;
        return sum + value;
      }, 0),
    [data],
  );

  const formatValue = (value) => {
    if (valueFormatter) return valueFormatter(value);
    return value;
  };

  const resolvedInnerRadius = innerRadius ?? (variant === "donut" ? 60 : 0);
  const resolvedOuterRadius = outerRadius ?? 110;

  const chartData = useMemo(() => {
    return data.map((item, index) => {
      const value = Number(item.value) || 0;
      const percent = total > 0 ? (value / total) * 100 : 0;

      return {
        id: item.id ?? item.label ?? index,
        label: item.label ?? `Item ${index + 1}`,
        value,
        color: item.color || getColor(item.colorVariant, index),
        formattedValue: formatValue(value),
        percent,
      };
    });
  }, [data, total]);

  const getArcLabel = (item) => {
    if (!showLabels) return "";

    const safePercent =
      item.percent ?? (total > 0 ? (item.value / total) * 100 : 0);
    const percentText = `${safePercent.toFixed(0)}%`;
    const valueText = `${formatValue(item.value)}`;

    switch (labelType) {
      case "percent":
        return percentText;
      case "both":
        return `${valueText} • ${percentText}`;
      case "value":
      default:
        return valueText;
    }
  };

  const renderLoading = () => (
    <Box
      sx={{
        height,
        borderRadius: "16px",
        border: `1px solid ${t.border}`,
        backgroundColor: t.surfaceAlt,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
    >
      <Stack spacing={1.25} alignItems="center">
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "999px",
            border: `10px solid ${t.surfaceHover}`,
            borderTopColor: t.primary,
          }}
        />
        <Typography
          sx={{
            color: t.textMuted,
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          Loading chart...
        </Typography>
      </Stack>
    </Box>
  );

  const renderEmpty = () => (
    <Box
      sx={{
        height,
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
          fontSize: "0.92rem",
          fontWeight: 600,
          textAlign: "center",
        }}
      >
        {emptyText}
      </Typography>
    </Box>
  );

  if (loading) {
    return renderLoading();
  }

  if (!hasData) {
    return renderEmpty();
  }

  return (
    <Box sx={{ width: "100%", ...sx }}>
      {(title || subtitle) && (
        <Box sx={{ mb: 2 }}>
          {title && (
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1rem",
                color: t.text,
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
          )}

          {subtitle && (
            <Typography
              sx={{
                mt: 0.5,
                fontSize: "0.85rem",
                color: t.textMuted,
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      <Box
        sx={{
          borderRadius: "16px",
          backgroundColor: t.surface,
          border: `1px solid ${t.border}`,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PieChart
          height={height}
          series={[
            {
              data: chartData,
              innerRadius: resolvedInnerRadius,
              outerRadius: resolvedOuterRadius,
              paddingAngle,
              cornerRadius,
              startAngle,
              endAngle,
              arcLabel: getArcLabel,
              arcLabelMinAngle: 12,
              highlightScope: { faded: "global", highlighted: "item" },
              faded: {
                innerRadius: resolvedInnerRadius,
                additionalRadius: -6,
                color: t.surfaceHover,
              },
            },
          ]}
          slotProps={{
            legend: {
              hidden: !showLegend,
              direction: "column",
              position: { vertical: "middle", horizontal: "right" },
              padding: 0,
              labelStyle: {
                fill: t.text,
                fontSize: 12,
              },
            },
          }}
          sx={{
            "& .MuiChartsLegend-label": {
              fill: `${t.text} !important`,
            },
            "& .MuiPieArcLabel-root": {
              fill: `${variant === "donut" ? t.text : t.textInverse} !important`,
              fontSize: 11,
              fontWeight: 700,
            },
            "& .MuiChartsTooltip-root": {
              backgroundColor: t.surface,
            },
            ...chartSx,
          }}
        />
      </Box>
    </Box>
  );
};

export default AppPieChart;
