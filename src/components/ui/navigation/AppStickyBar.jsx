import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppStickyBar = ({
  children,
  left,
  center,
  right,
  position = "top", // top | bottom
  variant = "surface", // surface | soft | bordered | transparent
  rounded = "none", // none | sm | md | lg | full
  elevation = true,
  blur = false,
  divider = true,
  fullWidth = true,
  maxWidth = "100%",
  offsetTop = 0,
  offsetBottom = 0,
  zIndex = 1100,
  padding = "12px 16px",
  minHeight = 64,
  containerSx = {},
  contentSx = {},
  sx = {},
  ...props
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const radiusMap = {
    none: "0px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    full: "999px",
  };

  const resolvedRadius = radiusMap[rounded] || radiusMap.none;
  const isTop = position === "top";

  const variantStyles = {
    surface: {
      backgroundColor: t.surface,
      border: divider
        ? isTop
          ? `0 solid transparent`
          : `1px solid transparent`
        : "1px solid transparent",
      borderTop: !isTop && divider ? `1px solid ${t.border}` : undefined,
      borderBottom: isTop && divider ? `1px solid ${t.border}` : undefined,
    },

    soft: {
      backgroundColor: t.surfaceAlt,
      border: `1px solid ${t.border}`,
    },

    bordered: {
      backgroundColor: t.surface,
      border: `1px solid ${t.border}`,
    },

    transparent: {
      backgroundColor: "transparent",
      border: divider
        ? isTop
          ? `0 solid transparent`
          : `1px solid transparent`
        : "1px solid transparent",
      borderTop: !isTop && divider ? `1px solid ${t.border}` : undefined,
      borderBottom: isTop && divider ? `1px solid ${t.border}` : undefined,
    },
  };

  const appliedVariant = variantStyles[variant] || variantStyles.surface;

  const shadowValue = elevation ? (isTop ? t.shadowSm : t.shadowMd) : "none";

  const stickyPositionStyles = isTop
    ? {
        position: "sticky",
        top: offsetTop,
      }
    : {
        position: "sticky",
        bottom: offsetBottom,
      };

  const hasSlots =
    left !== undefined || center !== undefined || right !== undefined;

  return (
    <Box
      sx={{
        width: fullWidth ? "100%" : "auto",
        zIndex,
        ...stickyPositionStyles,
        ...sx,
      }}
      {...props}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth,
          mx: "auto",
          minHeight,
          px: 0,
          ...appliedVariant,
          borderRadius: resolvedRadius,
          boxShadow: shadowValue,
          backdropFilter: blur ? "blur(10px)" : "none",
          WebkitBackdropFilter: blur ? "blur(10px)" : "none",
          transition:
            "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, backdrop-filter 0.18s ease",
          ...(blur && {
            backgroundColor:
              variant === "transparent"
                ? theme === "dark"
                  ? "rgba(31,41,55,0.72)"
                  : "rgba(255,255,255,0.72)"
                : appliedVariant.backgroundColor,
          }),
          ...containerSx,
        }}
      >
        {hasSlots ? (
          <Box
            sx={{
              minHeight,
              px: 2,
              py: 1.25,
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)",
              alignItems: "center",
              gap: 1.5,
              ...contentSx,
            }}
          >
            <Box
              sx={{
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 1,
              }}
            >
              {left}
            </Box>

            <Box
              sx={{
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {center}
            </Box>

            <Box
              sx={{
                minWidth: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              {right}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              minHeight,
              p: padding,
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              ...contentSx,
            }}
          >
            {children}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AppStickyBar;
