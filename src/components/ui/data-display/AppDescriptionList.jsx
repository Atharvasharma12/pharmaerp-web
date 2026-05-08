import React from "react";
import { Box } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";
import AppKeyValue from "./AppKeyValue";
import AppCard from "./AppCard";

const AppDescriptionList = ({
  items = [],
  columns = 2, // 1 | 2 | 3 | 4
  variant = "default", // default | card
  size = "medium", // small | medium | large
  bordered = false,
  striped = false,
  dense = false,
  labelWidth,
  align = "start",
  sx = {},
  itemSx = {},
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const gridTemplate =
    typeof columns === "number"
      ? `repeat(${columns}, minmax(0, 1fr))`
      : columns;

  const content = (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: gridTemplate,
        gap: dense ? 1.25 : 2,
        width: "100%",
      }}
    >
      {items.map((item, index) => (
        <Box
          key={item.key || index}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: bordered ? 1.5 : 0,
            py: bordered ? 1 : 0.5,
            border:
              bordered && variant !== "card" ? `1px solid ${t.border}` : "none",
            borderRadius: bordered ? "10px" : 0,
            backgroundColor:
              striped && index % 2 === 0 ? t.surfaceAlt : "transparent",
            minWidth: 0,
            ...itemSx,
            ...item.sx,
          }}
        >
          <AppKeyValue
            label={item.label}
            value={item.value}
            icon={item.icon}
            badge={item.badge}
            badgeColor={item.badgeColor}
            direction="column"
            align={align}
            size={size}
            {...item.props}
          />
        </Box>
      ))}
    </Box>
  );

  if (variant === "card") {
    return (
      <AppCard padding={dense ? "sm" : "md"} variant="default" sx={sx}>
        {content}
      </AppCard>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        ...sx,
      }}
    >
      {content}
    </Box>
  );
};

export default AppDescriptionList;
