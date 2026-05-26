import React from "react";
import { Box, Typography } from "@mui/material";
import AppLoader from "./AppLoader";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppInlineLoader = ({
  text = "",
  variant = "spinner", // spinner | dots | pulse
  colorVariant = "primary",
  size = "small", // small | medium
  direction = "row", // row | column
  sx = {},
  textSx = {},
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const t = getThemeTokens(activeMode, colorTheme);

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: direction,
        gap: 1,
        color: t.textMuted,
        ...sx,
      }}
    >
      <AppLoader
        size={size}
        variant={variant}
        colorVariant={colorVariant}
        center={false}
        sx={{
          width: "auto",
          minHeight: "auto",
          display: "inline-flex",
        }}
      />

      {text ? (
        <Typography
          component="span"
          sx={{
            fontSize: size === "small" ? "0.78rem" : "0.86rem",
            fontWeight: 500,
            color: t.textMuted,
            lineHeight: 1.4,
            ...textSx,
          }}
        >
          {text}
        </Typography>
      ) : null}
    </Box>
  );
};

export default AppInlineLoader;
