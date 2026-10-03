import React from "react";
import { Box, Tooltip } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";
import AppAvatar from "./AppAvatar";

const AppAvatarGroup = ({
  items = [],
  max = 4,
  size = "medium",
  spacing = -10,
  showTooltip = true,
  bordered = true,
  onClick,
  sx = {},
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const t = getThemeTokens(activeMode, colorTheme);

  const visibleItems = items.slice(0, max);
  const remaining = items.length - max;

  const sizeMap = {
    xs: 26,
    small: 34,
    medium: 42,
    large: 54,
    xl: 72,
  };

  const avatarSize = sizeMap[size] || sizeMap.medium;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        ...sx,
      }}
    >
      {visibleItems.map((item, index) => {
        const content = (
          <Box
            key={item.id || index}
            sx={{
              ml: index === 0 ? 0 : `${spacing}px`,
              position: "relative",
              zIndex: items.length - index,
            }}
          >
            <AppAvatar
              {...item}
              size={size}
              onClick={onClick}
              sx={{
                border: bordered ? `2px solid ${t.surface}` : "none",
              }}
            />
          </Box>
        );

        return showTooltip && item.name ? (
          <Tooltip key={index} title={item.name}>
            {content}
          </Tooltip>
        ) : (
          content
        );
      })}

      {remaining > 0 && (
        <Box
          sx={{
            ml: `${spacing}px`,
            zIndex: 0,
          }}
        >
          <AppAvatar
            size={size}
            initials={`+${remaining}`}
            colorVariant="neutral"
            sx={{
              backgroundColor: t.surfaceAlt,
              color: t.textMuted,
              border: bordered ? `2px solid ${t.surface}` : "none",
              fontWeight: 700,
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default AppAvatarGroup;
