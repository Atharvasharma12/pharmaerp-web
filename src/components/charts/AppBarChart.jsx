import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppBarChart = ({
  data = [],
  bars = [],
  xKey = "label",
  title,
  subtitle,
  height = 320,
  variant = "grouped", // grouped | stacked
  layout = "vertical", // vertical | horizontal
  showLegend = true,
  showGrid = true,
  loading = false,
  emptyText = "No chart data available",
  valueFormatter,
  sx = {},
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const hasData = Array.isArray(data) && data.length > 0;

  // 🎨 map color variants to tokens
  const getColor = (variant) => {
    const map = {
      primary: t.primary,
      success: t.success,
      error: t.error,
      warning: t.warning,
      info: t.info,
      neutral: t.textMuted,
      dark: theme === "dark" ? "#fff" : "#000",
    };
    return map[variant] || t.primary;
  };

  // 📊 transform bars into MUI series
  const series = useMemo(() => {
    return bars.map((bar) => ({
      dataKey: bar.key,
      label: bar.label || bar.key,
      stack: variant === "stacked" ? "total" : undefined,
      color: getColor(bar.colorVariant),
      valueFormatter: valueFormatter,
    }));
  }, [bars, variant, valueFormatter]);

  // 🧾 x-axis labels
  const xLabels = data.map((item) => item[xKey]);

  // 📦 dataset
  const dataset = data;

  // 🔄 loading
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
        }}
      >
        <Typography sx={{ color: t.textMuted }}>Loading chart...</Typography>
      </Box>
    );
  }

  // 🚫 empty
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
        }}
      >
        <Typography sx={{ color: t.textMuted }}>{emptyText}</Typography>
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
              }}
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography
              sx={{
                fontSize: "0.85rem",
                color: t.textMuted,
                mt: 0.5,
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
        <BarChart
          height={height}
          dataset={dataset}
          xAxis={[
            layout === "vertical"
              ? {
                  scaleType: "band",
                  dataKey: xKey,
                  tickLabelStyle: {
                    fill: t.textMuted,
                    fontSize: 12,
                  },
                }
              : {
                  tickLabelStyle: {
                    fill: t.textMuted,
                  },
                },
          ]}
          yAxis={[
            layout === "vertical"
              ? {
                  tickLabelStyle: {
                    fill: t.textMuted,
                    fontSize: 12,
                  },
                }
              : {
                  scaleType: "band",
                  dataKey: xKey,
                  tickLabelStyle: {
                    fill: t.textMuted,
                  },
                },
          ]}
          series={series}
          grid={{
            horizontal: showGrid,
            vertical: false,
          }}
          layout={layout === "horizontal" ? "horizontal" : "vertical"}
          slotProps={{
            legend: {
              hidden: !showLegend,
              labelStyle: {
                fill: t.text,
                fontSize: 12,
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default AppBarChart;
