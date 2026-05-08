import React from "react";
import { Box, Skeleton } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppSkeleton = ({
  variant = "rectangular", // text | circular | rectangular | rounded
  width = "100%",
  height = 18,
  count = 1,
  gap = 1,
  animation = "wave", // pulse | wave | false
  rounded = true,
  colorVariant = "default", // default | primary | success | error | warning | info
  fullWidth = true,
  sx = {},
  itemSx = {},
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const colorMap = {
    default: {
      base: t.surfaceAlt,
      highlight: t.surfaceHover,
    },
    primary: {
      base: t.primarySoft,
      highlight: t.hoverOverlay,
    },
    success: {
      base: t.successSoft,
      highlight: t.hoverOverlay,
    },
    error: {
      base: t.errorSoft,
      highlight: t.hoverOverlay,
    },
    warning: {
      base: t.warningSoft,
      highlight: t.hoverOverlay,
    },
    info: {
      base: t.infoSoft,
      highlight: t.hoverOverlay,
    },
  };

  const activeColor = colorMap[colorVariant] || colorMap.default;

  const getItemWidth = (index) => {
    if (Array.isArray(width)) {
      return width[index] || width[width.length - 1];
    }

    if (count > 1 && variant === "text" && index === count - 1) {
      return "72%";
    }

    return width;
  };

  return (
    <Box
      sx={{
        width: fullWidth ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
        gap,
        ...sx,
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          variant={variant}
          animation={animation}
          width={getItemWidth(index)}
          height={height}
          sx={{
            bgcolor: activeColor.base,
            borderRadius: variant === "circular" ? "50%" : rounded ? 2 : 0,

            "&::after": {
              background: `linear-gradient(
                90deg,
                transparent,
                ${activeColor.highlight},
                transparent
              )`,
            },

            ...itemSx,
          }}
        />
      ))}
    </Box>
  );
};

export default AppSkeleton;
