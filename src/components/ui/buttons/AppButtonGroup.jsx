import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppButtonGroup = ({
  children,
  orientation = "horizontal", // horizontal | vertical
  fullWidth = false,
  spacing = 0,
  variant = "contained", // for consistency only (passed to children if needed)
  size = "medium",
  colorVariant = "primary",
  rounded = "md",
  sx = {},
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const isVertical = orientation === "vertical";

  const radiusMap = {
    sm: "6px",
    md: "8px",
    lg: "10px",
  };

  const borderRadius = radiusMap[rounded] || radiusMap.md;

  const getChildStyles = (index, total) => {
    if (spacing > 0) return {}; // spacing mode = no merging

    const first = index === 0;
    const last = index === total - 1;

    if (isVertical) {
      return {
        borderRadius: 0,
        ...(first && {
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
        }),
        ...(last && {
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
        }),
        ...(index !== total - 1 && {
          borderBottom: `1px solid ${t.border}`,
        }),
      };
    }

    return {
      borderRadius: 0,
      ...(first && {
        borderTopLeftRadius: borderRadius,
        borderBottomLeftRadius: borderRadius,
      }),
      ...(last && {
        borderTopRightRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
      }),
      ...(index !== total - 1 && {
        borderRight: `1px solid ${t.border}`,
      }),
    };
  };

  const items = React.Children.toArray(children).filter(Boolean);

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: isVertical ? "column" : "row",
        width: fullWidth ? "100%" : "auto",
        gap: spacing,
        ...sx,
      }}
    >
      {items.map((child, index) => {
        if (!React.isValidElement(child)) return child;

        return React.cloneElement(child, {
          size: child.props.size || size,
          variant: child.props.variant || variant,
          colorVariant: child.props.colorVariant || colorVariant,
          sx: {
            ...getChildStyles(index, items.length),
            ...(child.props.sx || {}),
          },
          fullWidth: fullWidth && !isVertical,
        });
      })}
    </Box>
  );
};

export default AppButtonGroup;
