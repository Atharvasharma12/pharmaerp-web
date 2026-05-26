import React from "react";
import { Box, Skeleton } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppTableSkeleton = ({
  rows = 6,
  columns = 5,
  showHeader = true,
  showToolbar = true,
  rowHeight = 52,
  headerHeight = 44,
  toolbarHeight = 56,
  gap = 1,
  rounded = true,
  sx = {},
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const t = getThemeTokens(activeMode, colorTheme);

  const skeletonSx = {
    bgcolor: t.surfaceAlt,
    borderRadius: rounded ? 2 : 0,
    "&::after": {
      background: `linear-gradient(90deg, transparent, ${t.surfaceHover}, transparent)`,
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        border: `1px solid ${t.border}`,
        borderRadius: 3,
        backgroundColor: t.surface,
        overflow: "hidden",
        ...sx,
      }}
    >
      {showToolbar && (
        <Box
          sx={{
            height: toolbarHeight,
            px: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${t.border}`,
            gap: 2,
          }}
        >
          <Skeleton animation="wave" width={180} height={26} sx={skeletonSx} />
          <Skeleton animation="wave" width={120} height={34} sx={skeletonSx} />
        </Box>
      )}

      {showHeader && (
        <Box
          sx={{
            height: headerHeight,
            px: 2,
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            alignItems: "center",
            gap,
            backgroundColor: t.surfaceAlt,
            borderBottom: `1px solid ${t.border}`,
          }}
        >
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton
              key={index}
              animation="wave"
              width={index === columns - 1 ? "65%" : "82%"}
              height={18}
              sx={skeletonSx}
            />
          ))}
        </Box>
      )}

      <Box>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              height: rowHeight,
              px: 2,
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
              alignItems: "center",
              gap,
              borderBottom:
                rowIndex === rows - 1 ? "none" : `1px solid ${t.divider}`,
            }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                animation="wave"
                width={
                  colIndex === 0
                    ? "70%"
                    : colIndex === columns - 1
                      ? "55%"
                      : "85%"
                }
                height={18}
                sx={skeletonSx}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AppTableSkeleton;
