import React from "react";
import { Box, Typography } from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";
import AppBadge from "./AppBadge";
import AppAvatar from "./AppAvatar";

const AppTimeline = ({
  items = [],
  size = "medium", // small | medium | large
  colorVariant = "primary", // primary | success | error | warning | info
  showConnector = true,
  showAvatar = false,
  sx = {},
  itemSx = {},
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
      dot: 24,
      icon: 15,
      title: "0.82rem",
      desc: "0.74rem",
      gap: 1,
    },
    medium: {
      dot: 30,
      icon: 17,
      title: "0.9rem",
      desc: "0.8rem",
      gap: 1.25,
    },
    large: {
      dot: 36,
      icon: 20,
      title: "0.98rem",
      desc: "0.86rem",
      gap: 1.5,
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;

  const getItemColor = (item) => {
    if (item.colorVariant && colorMap[item.colorVariant]) {
      return colorMap[item.colorVariant];
    }

    if (item.completed) return t.success;
    if (item.error) return t.error;
    if (item.active) return activeColor;

    return t.borderStrong;
  };

  const getItemIcon = (item) => {
    if (item.icon) return item.icon;
    if (item.completed) return <CheckRoundedIcon />;
    return <RadioButtonUncheckedRoundedIcon />;
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const itemColor = getItemColor(item);

        return (
          <Box
            key={item.key || index}
            sx={{
              display: "grid",
              gridTemplateColumns: `${activeSize.dot}px 1fr`,
              columnGap: activeSize.gap,
              position: "relative",
              pb: isLast ? 0 : 2.5,
              ...itemSx,
              ...item.sx,
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {showConnector && !isLast ? (
                <Box
                  sx={{
                    position: "absolute",
                    top: activeSize.dot,
                    bottom: -20,
                    width: "2px",
                    backgroundColor: item.completed ? t.success : t.border,
                  }}
                />
              ) : null}

              <Box
                sx={{
                  width: activeSize.dot,
                  height: activeSize.dot,
                  borderRadius: "999px",
                  backgroundColor:
                    item.active || item.completed || item.error
                      ? itemColor
                      : t.surfaceAlt,
                  color:
                    item.active || item.completed || item.error
                      ? t.primaryContrast
                      : t.textMuted,
                  border: `1px solid ${itemColor}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,

                  "& svg": {
                    fontSize: activeSize.icon,
                  },
                }}
              >
                {getItemIcon(item)}
              </Box>
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: activeSize.title,
                      fontWeight: 800,
                      color: t.text,
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </Typography>

                  {item.description ? (
                    <Typography
                      sx={{
                        fontSize: activeSize.desc,
                        color: t.textMuted,
                        lineHeight: 1.5,
                        mt: 0.35,
                      }}
                    >
                      {item.description}
                    </Typography>
                  ) : null}
                </Box>

                {item.badge ? (
                  <AppBadge
                    label={item.badge}
                    size="small"
                    colorVariant={item.badgeColor || "primary"}
                    variant="soft"
                  />
                ) : null}
              </Box>

              {(item.time || item.user || item.avatar) && (
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  {showAvatar && (item.user || item.avatar) ? (
                    <AppAvatar
                      src={item.avatar}
                      name={item.user}
                      size="xs"
                      showName={!!item.user}
                      subtitle=""
                    />
                  ) : null}

                  {item.time ? (
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        color: t.textMuted,
                        fontWeight: 500,
                      }}
                    >
                      {item.time}
                    </Typography>
                  ) : null}
                </Box>
              )}

              {item.content ? <Box sx={{ mt: 1.2 }}>{item.content}</Box> : null}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default AppTimeline;
