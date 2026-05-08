import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppLoader = ({
  size = "medium", // small | medium | large | page | fullscreen
  variant = "spinner", // spinner | dots | pulse
  colorVariant = "primary", // primary | success | error | warning | info
  text = "",
  fullScreen = false,
  center = true,
  overlay = false,
  thickness = 4.5,
  sx = {},
  textSx = {},
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const colorMap = {
    primary: t.primary,
    success: t.success,
    error: t.error,
    warning: t.warning,
    info: t.info,
  };

  const activeColor = colorMap[colorVariant] || colorMap.primary;

  const sizeMap = {
    small: {
      spinner: 18,
      dot: 6,
      minHeight: 40,
      fontSize: "0.78rem",
      gap: 1,
    },
    medium: {
      spinner: 28,
      dot: 8,
      minHeight: 80,
      fontSize: "0.86rem",
      gap: 1.2,
    },
    large: {
      spinner: 42,
      dot: 10,
      minHeight: 140,
      fontSize: "0.95rem",
      gap: 1.5,
    },
    page: {
      spinner: 48,
      dot: 11,
      minHeight: "60vh",
      fontSize: "1rem",
      gap: 1.6,
    },
    fullscreen: {
      spinner: 52,
      dot: 12,
      minHeight: "100vh",
      fontSize: "1rem",
      gap: 1.8,
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;

  const wrapperStyles = {
    width: "100%",
    minHeight: fullScreen ? "100vh" : activeSize.minHeight,
    display: center ? "flex" : "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: activeSize.gap,
    color: t.text,
    ...(overlay && {
      position: "fixed",
      inset: 0,
      zIndex: 1300,
      backgroundColor: t.overlay,
      backdropFilter: "blur(4px)",
    }),
    ...sx,
  };

  const renderLoader = () => {
    if (variant === "dots") {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.8,
          }}
        >
          {[0, 1, 2].map((item) => (
            <Box
              key={item}
              sx={{
                width: activeSize.dot,
                height: activeSize.dot,
                borderRadius: "50%",
                backgroundColor: activeColor,
                animation: "app-loader-dots 0.9s ease-in-out infinite",
                animationDelay: `${item * 0.15}s`,
                "@keyframes app-loader-dots": {
                  "0%, 80%, 100%": {
                    transform: "scale(0.7)",
                    opacity: 0.45,
                  },
                  "40%": {
                    transform: "scale(1)",
                    opacity: 1,
                  },
                },
              }}
            />
          ))}
        </Box>
      );
    }

    if (variant === "pulse") {
      return (
        <Box
          sx={{
            width: activeSize.spinner,
            height: activeSize.spinner,
            borderRadius: "50%",
            backgroundColor: activeColor,
            animation: "app-loader-pulse 1s ease-in-out infinite",
            "@keyframes app-loader-pulse": {
              "0%": {
                transform: "scale(0.85)",
                opacity: 0.45,
              },
              "50%": {
                transform: "scale(1)",
                opacity: 1,
              },
              "100%": {
                transform: "scale(0.85)",
                opacity: 0.45,
              },
            },
          }}
        />
      );
    }

    return (
      <CircularProgress
        size={activeSize.spinner}
        thickness={thickness}
        sx={{
          color: activeColor,
        }}
      />
    );
  };

  return (
    <Box sx={wrapperStyles}>
      {renderLoader()}

      {text ? (
        <Typography
          variant="body2"
          sx={{
            color: overlay ? t.textInverse : t.textMuted,
            fontSize: activeSize.fontSize,
            fontWeight: 500,
            ...textSx,
          }}
        >
          {text}
        </Typography>
      ) : null}
    </Box>
  );
};

export default AppLoader;
