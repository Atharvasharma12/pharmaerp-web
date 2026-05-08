import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppLineChart = ({
  data = [],
  lines = [],
  xKey = "label",
  title,
  subtitle,
  height = 320,
  curve = "linear", // linear | monotone | step | stepBefore | stepAfter | natural
  showLegend = true,
  showGrid = true,
  showArea = false,
  stacked = false,
  loading = false,
  emptyText = "No chart data available",
  valueFormatter,
  xValueFormatter,
  sx = {},
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const hasData = Array.isArray(data) && data.length > 0;

  const getColor = (variant) => {
    const map = {
      primary: t.primary,
      success: t.success,
      error: t.error,
      warning: t.warning,
      info: t.info,
      neutral: theme === "dark" ? t.neutral[500] : t.neutral[600],
      dark: theme === "dark" ? t.neutral[100] : t.neutral[900],
    };

    return map[variant] || t.primary;
  };

  const resolvedLines =
    lines.length > 0
      ? lines
      : [
          {
            key: "value",
            label: "Value",
            colorVariant: "primary",
          },
        ];

  const series = useMemo(() => {
    return resolvedLines.map((line) => ({
      dataKey: line.key,
      label: line.label || line.key,
      color: getColor(line.colorVariant),
      curve: line.curve || curve,
      area: line.area ?? showArea,
      showMark: line.showMark ?? true,
      stack: stacked || line.stacked ? "total" : undefined,
      valueFormatter: valueFormatter
        ? (value) => valueFormatter(value, line)
        : undefined,
    }));
  }, [resolvedLines, curve, showArea, stacked, valueFormatter]);

  if (loading) {
    return (
      <Box
        sx={{
          height,
          borderRadius: "16px",
          border: `1px solid ${t.border}`,
          backgroundColor: t.surfaceAlt,
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 1.25,
          ...sx,
        }}
      >
        {[72, 88, 64, 92].map((w, index) => (
          <Box
            key={index}
            sx={{
              height: 14,
              width: `${w}%`,
              borderRadius: "999px",
              backgroundColor: t.surfaceHover,
            }}
          />
        ))}
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
          borderRadius: "16px",
          backgroundColor: t.surface,
          border: `1px solid ${t.border}`,
          p: 2,
        }}
      >
        <LineChart
          dataset={data}
          height={height}
          series={series}
          xAxis={[
            {
              scaleType: "point",
              dataKey: xKey,
              valueFormatter: xValueFormatter,
              tickLabelStyle: {
                fill: t.textMuted,
                fontSize: 12,
              },
            },
          ]}
          yAxis={[
            {
              tickLabelStyle: {
                fill: t.textMuted,
                fontSize: 12,
              },
            },
          ]}
          grid={{
            horizontal: showGrid,
            vertical: false,
          }}
          slotProps={{
            legend: {
              hidden: !showLegend,
              labelStyle: {
                fill: t.text,
                fontSize: 12,
              },
            },
          }}
          sx={{
            "& .MuiChartsAxis-line": {
              stroke: t.border,
            },
            "& .MuiChartsAxis-tick": {
              stroke: t.border,
            },
            "& .MuiChartsGrid-line": {
              stroke: t.divider,
            },
            "& .MuiMarkElement-root": {
              stroke: t.surface,
              strokeWidth: 2,
            },
            "& .MuiAreaElement-root": {
              fillOpacity: theme === "dark" ? 0.22 : 0.16,
            },
            "& .MuiChartsLegend-label": {
              fill: `${t.text} !important`,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default AppLineChart;
