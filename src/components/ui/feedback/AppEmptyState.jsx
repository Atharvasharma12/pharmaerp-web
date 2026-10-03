import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppEmptyState = ({
  title = "No data found",
  description = "",
  icon = null,
  action = null,
  size = "medium", // small | medium | large | page
  align = "center", // center | left
  fullHeight = false,
  sx = {},
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const t = getThemeTokens(activeMode, colorTheme);

  const sizeMap = {
    small: {
      icon: 32,
      title: "0.9rem",
      desc: "0.75rem",
      gap: 1,
    },
    medium: {
      icon: 44,
      title: "1rem",
      desc: "0.85rem",
      gap: 1.2,
    },
    large: {
      icon: 56,
      title: "1.1rem",
      desc: "0.9rem",
      gap: 1.4,
    },
    page: {
      icon: 64,
      title: "1.2rem",
      desc: "0.95rem",
      gap: 1.6,
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: fullHeight ? "60vh" : "auto",
        display: "flex",
        alignItems: align === "center" ? "center" : "flex-start",
        justifyContent: align === "center" ? "center" : "flex-start",
        textAlign: align,
        flexDirection: "column",
        gap: activeSize.gap,
        color: t.textMuted,
        ...sx,
      }}
    >
      {icon ? (
        <Box
          sx={{
            fontSize: activeSize.icon,
            color: t.primarySoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
      ) : null}

      <Typography
        sx={{
          fontSize: activeSize.title,
          fontWeight: 600,
          color: t.text,
        }}
      >
        {title}
      </Typography>

      {description ? (
        <Typography
          sx={{
            fontSize: activeSize.desc,
            color: t.textMuted,
            maxWidth: 420,
          }}
        >
          {description}
        </Typography>
      ) : null}

      {action ? <Box mt={1}>{action}</Box> : null}
    </Box>
  );
};

export default AppEmptyState;
