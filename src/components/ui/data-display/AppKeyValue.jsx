import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";
import AppBadge from "./AppBadge";

const AppKeyValue = ({
  label,
  value,
  icon,
  badge,
  badgeColor = "primary",
  direction = "row", // row | column
  align = "start", // start | center | end | space-between
  size = "medium", // small | medium | large
  muted = false,
  ellipsis = true,
  sx = {},
  labelSx = {},
  valueSx = {},
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const t = getThemeTokens(activeMode, colorTheme);

  const sizeMap = {
    small: {
      label: "0.72rem",
      value: "0.8rem",
      gap: 0.5,
    },
    medium: {
      label: "0.78rem",
      value: "0.88rem",
      gap: 0.75,
    },
    large: {
      label: "0.82rem",
      value: "0.95rem",
      gap: 1,
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;

  const justifyMap = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    "space-between": "space-between",
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: direction === "column" ? "column" : "row",
        alignItems: direction === "column" ? "flex-start" : "center",
        justifyContent:
          direction === "row"
            ? justifyMap[align] || "flex-start"
            : "flex-start",
        gap: activeSize.gap,
        minWidth: 0,
        ...sx,
      }}
    >
      {/* Label */}
      {label ? (
        <Typography
          sx={{
            fontSize: activeSize.label,
            color: muted ? t.textDisabled : t.textMuted,
            fontWeight: 600,
            whiteSpace: "nowrap",
            ...labelSx,
          }}
        >
          {label}
        </Typography>
      ) : null}

      {/* Value */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          minWidth: 0,
        }}
      >
        {icon ? (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              color: t.textMuted,
              "& svg": {
                fontSize: 16,
              },
            }}
          >
            {icon}
          </Box>
        ) : null}

        <Typography
          sx={{
            fontSize: activeSize.value,
            color: t.text,
            fontWeight: 700,
            minWidth: 0,
            overflow: ellipsis ? "hidden" : "visible",
            textOverflow: ellipsis ? "ellipsis" : "unset",
            whiteSpace: ellipsis ? "nowrap" : "normal",
            ...valueSx,
          }}
        >
          {value ?? "-"}
        </Typography>

        {badge ? (
          <AppBadge
            label={badge}
            size="small"
            variant="soft"
            colorVariant={badgeColor}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default AppKeyValue;
