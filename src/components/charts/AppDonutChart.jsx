import React, { useMemo } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppDonutChart = ({
  data = [],
  title,
  subtitle,

  height = 320,
  innerRadius = 65,
  outerRadius = 110,
  paddingAngle = 2,
  cornerRadius = 7,
  startAngle = 0,
  endAngle = 360,

  centerLabel,
  centerValue,
  centerSubtitle,

  showLegend = true,
  showLabels = false,
  labelType = "percent", // value | percent | both

  loading = false,
  emptyText = "No chart data available",

  valueFormatter,
  sx = {},
  chartSx = {},
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const hasData = Array.isArray(data) && data.length > 0;

  const getColor = (colorVariant = "primary", index = 0) => {
    const semanticMap = {
      primary: t.primary,
      success: t.success,
      error: t.error,
      warning: t.warning,
      info: t.info,
      neutral: theme === "dark" ? t.neutral[500] : t.neutral[600],
      dark: theme === "dark" ? t.neutral[100] : t.neutral[900],
    };

    const palette = [
      t.primary,
      t.success,
      t.warning,
      t.info,
      t.error,
      theme === "dark" ? t.neutral[400] : t.neutral[500],
      theme === "dark" ? t.neutral[300] : t.neutral[700],
    ];

    return semanticMap[colorVariant] || palette[index % palette.length];
  };

  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  }, [data]);

  const formatValue = (value) => {
    if (valueFormatter) return valueFormatter(value);
    return value;
  };

  const chartData = useMemo(() => {
    return data.map((item, index) => {
      const value = Number(item.value) || 0;
      const percent = total > 0 ? (value / total) * 100 : 0;

      return {
        id: item.id ?? item.label ?? index,
        label: item.label ?? `Item ${index + 1}`,
        value,
        color: item.color || getColor(item.colorVariant, index),
        percent,
      };
    });
  }, [data, total]);

  const getArcLabel = (item) => {
    if (!showLabels) return "";

    const percent =
      item.percent ?? (total > 0 ? (item.value / total) * 100 : 0);
    const percentText = `${percent.toFixed(0)}%`;
    const valueText = `${formatValue(item.value)}`;

    if (labelType === "value") return valueText;
    if (labelType === "both") return `${valueText} • ${percentText}`;
    return percentText;
  };

  if (loading) {
    return (
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
              width: 118,
              height: 118,
              borderRadius: "999px",
              border: `14px solid ${t.surfaceHover}`,
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
  }

  if (!hasData) {
    return (
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
          position: "relative",
          borderRadius: "16px",
          backgroundColor: t.surface,
          border: `1px solid ${t.border}`,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {(centerLabel || centerValue || centerSubtitle) && (
          <Box
            sx={{
              position: "absolute",
              left: showLegend ? "37%" : "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
              textAlign: "center",
              pointerEvents: "none",
              maxWidth: 120,
            }}
          >
            {centerLabel && (
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  color: t.textMuted,
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {centerLabel}
              </Typography>
            )}

            {centerValue && (
              <Typography
                sx={{
                  mt: 0.35,
                  fontSize: "1.35rem",
                  color: t.text,
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                }}
              >
                {centerValue}
              </Typography>
            )}

            {centerSubtitle && (
              <Typography
                sx={{
                  mt: 0.35,
                  fontSize: "0.72rem",
                  color: t.textMuted,
                  fontWeight: 600,
                  lineHeight: 1.25,
                }}
              >
                {centerSubtitle}
              </Typography>
            )}
          </Box>
        )}

        <PieChart
          height={height}
          series={[
            {
              data: chartData,
              innerRadius,
              outerRadius,
              paddingAngle,
              cornerRadius,
              startAngle,
              endAngle,
              arcLabel: getArcLabel,
              arcLabelMinAngle: 14,
              highlightScope: { faded: "global", highlighted: "item" },
              faded: {
                innerRadius,
                additionalRadius: -6,
                color: t.surfaceHover,
              },
              valueFormatter: (item) => formatValue(item.value),
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
              fill: `${t.text} !important`,
              fontSize: 11,
              fontWeight: 800,
            },
            ...chartSx,
          }}
        />
      </Box>
    </Box>
  );
};

export default AppDonutChart;
