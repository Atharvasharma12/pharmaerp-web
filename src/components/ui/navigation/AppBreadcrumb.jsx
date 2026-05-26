import React from "react";
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppBreadcrumb = ({
  items = [],
  variant = "text", // text | soft | contained | outlined
  colorVariant = "primary", // primary | success | error | warning | info | dark | neutral
  size = "medium", // small | medium | large
  rounded = "md", // sm | md | lg | full
  separator,
  maxItems,
  showHome = false,
  homeLabel = "Home",
  homeHref,
  homeIcon = <HomeRoundedIcon />,
  onHomeClick,
  disabled = false,
  capitalize = false,
  elevation = false,
  sx = {},
  itemSx = {},
  currentItemSx = {},
  ...props
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const isDark = activeMode === "dark";
  const t = getThemeTokens(activeMode, colorTheme);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const colorMap = {
    primary: {
      main: t.primary,
      hover: t.primaryHover,
      contrast: t.primaryContrast,
      soft: t.primarySoft,
      border: t.primary,
    },
    success: {
      main: t.success,
      hover: t.successHover,
      contrast: t.successContrast,
      soft: t.successSoft,
      border: t.success,
    },
    error: {
      main: t.error,
      hover: t.errorHover,
      contrast: t.errorContrast,
      soft: t.errorSoft,
      border: t.error,
    },
    warning: {
      main: t.warning,
      hover: t.warningHover,
      contrast: t.warningContrast,
      soft: t.warningSoft,
      border: t.warning,
    },
    info: {
      main: t.info,
      hover: t.infoHover,
      contrast: t.infoContrast,
      soft: t.infoSoft,
      border: t.info,
    },
    dark: {
      main: isDark ? t.neutral[100] : t.neutral[900],
      hover: isDark ? t.neutral[200] : t.neutral[800],
      contrast: isDark ? t.text : t.textInverse,
      soft: isDark ? t.surfaceHover : t.neutral[100],
      border: isDark ? t.borderStrong : t.neutral[300],
    },
    neutral: {
      main: isDark ? t.neutral[500] : t.neutral[600],
      hover: isDark ? t.neutral[400] : t.neutral[700],
      contrast: isDark ? t.neutral[900] : "#ffffff",
      soft: isDark ? t.surfaceHover : t.neutral[100],
      border: isDark ? t.neutral[400] : t.neutral[300],
    },
  };

  const active = colorMap[colorVariant] || colorMap.primary;

  const radiusMap = {
    sm: "6px",
    md: "8px",
    lg: "10px",
    full: "999px",
  };

  const sizeMap = {
    small: {
      minHeight: 28,
      fontSize: "0.76rem",
      px: 0.9,
      py: 0.35,
      gap: 0.45,
      iconSize: 15,
      separatorSize: 16,
    },
    medium: {
      minHeight: 34,
      fontSize: "0.84rem",
      px: 1.1,
      py: 0.45,
      gap: 0.55,
      iconSize: 17,
      separatorSize: 18,
    },
    large: {
      minHeight: 40,
      fontSize: "0.92rem",
      px: 1.3,
      py: 0.55,
      gap: 0.65,
      iconSize: 19,
      separatorSize: 20,
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;
  const resolvedRadius = radiusMap[rounded] || radiusMap.md;

  const resolvedItems = React.useMemo(() => {
    const cloned = [...items];

    if (showHome) {
      cloned.unshift({
        label: homeLabel,
        href: homeHref,
        onClick: onHomeClick,
        icon: homeIcon,
      });
    }

    return cloned;
  }, [items, showHome, homeLabel, homeHref, onHomeClick, homeIcon]);

  const finalMaxItems =
    typeof maxItems === "number" && maxItems >= 2 ? maxItems : undefined;

  const collapsedData = React.useMemo(() => {
    if (!finalMaxItems || resolvedItems.length <= finalMaxItems) {
      return {
        visibleItems: resolvedItems,
        hiddenItems: [],
        isCollapsed: false,
      };
    }

    const itemsBefore = 1;
    const itemsAfter = Math.max(finalMaxItems - 2, 1);

    const start = resolvedItems.slice(0, itemsBefore);
    const end = resolvedItems.slice(resolvedItems.length - itemsAfter);
    const hidden = resolvedItems.slice(
      itemsBefore,
      resolvedItems.length - itemsAfter,
    );

    return {
      visibleItems: [...start, { __collapsed: true }, ...end],
      hiddenItems: hidden,
      isCollapsed: hidden.length > 0,
    };
  }, [resolvedItems, finalMaxItems]);

  const handleOpenMenu = (event) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const wrapperStyles = {
    display: "inline-flex",
    alignItems: "center",
    minHeight: activeSize.minHeight,
    borderRadius: resolvedRadius,
    transition:
      "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
    boxShadow: elevation ? t.shadowXs : "none",
    ...getWrapperVariantStyles({
      variant,
      t,
      active,
    }),
  };

  const baseItemStyles = {
    minHeight: activeSize.minHeight,
    borderRadius: resolvedRadius,
    px: activeSize.px,
    py: activeSize.py,
    display: "inline-flex",
    alignItems: "center",
    gap: activeSize.gap,
    fontSize: activeSize.fontSize,
    fontWeight: 600,
    lineHeight: 1.2,
    textDecoration: "none",
    whiteSpace: "nowrap",
    transition:
      "background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
    color: t.textMuted,

    "& svg": {
      fontSize: activeSize.iconSize,
    },

    "&:focus-visible": {
      outline: "none",
      boxShadow: t.focusRing,
    },
  };

  const clickableItemStyles = {
    cursor: "pointer",

    "&:hover": {
      backgroundColor: variant === "text" ? t.hoverOverlay : active.soft,
      color: active.main,
    },

    "&:active": {
      transform: "translateY(0)",
    },
  };

  const currentItemStyles = {
    color: active.main,
    fontWeight: 700,
    backgroundColor: variant === "soft" ? active.soft : "transparent",
    border:
      variant === "outlined" || variant === "contained"
        ? `1px solid ${variant === "contained" ? "transparent" : active.border}`
        : "1px solid transparent",
  };

  const renderItemContent = (item) => (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: activeSize.gap,
        minWidth: 0,
      }}
    >
      {item.icon ? (
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "inherit",
          }}
        >
          {item.icon}
        </Box>
      ) : null}

      <Box
        component="span"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          textTransform: capitalize ? "capitalize" : "none",
        }}
      >
        {item.label}
      </Box>
    </Box>
  );

  const renderItem = (item, index, isLast) => {
    if (item.__collapsed) {
      return (
        <IconButton
          key={`collapsed-${index}`}
          size="small"
          onClick={handleOpenMenu}
          disabled={disabled}
          sx={{
            width: activeSize.minHeight - 4,
            height: activeSize.minHeight - 4,
            borderRadius: resolvedRadius,
            color: t.textMuted,
            transition:
              "background-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease",
            "&:hover": {
              backgroundColor: active.soft,
              color: active.main,
            },
            "&:focus-visible": {
              outline: "none",
              boxShadow: t.focusRing,
            },
            "&.Mui-disabled": {
              color: t.disabledText,
            },
          }}
        >
          <MoreHorizRoundedIcon sx={{ fontSize: activeSize.iconSize }} />
        </IconButton>
      );
    }

    const itemDisabled = disabled || item.disabled;
    const isClickable = !isLast && !itemDisabled && (item.onClick || item.href);
    const commonSx = {
      ...baseItemStyles,
      ...(isClickable ? clickableItemStyles : {}),
      ...(isLast ? currentItemStyles : {}),
      ...(item.sx || {}),
      ...(isLast ? currentItemSx : itemSx),
      ...(itemDisabled
        ? {
            color: t.disabledText,
            cursor: "not-allowed",
            pointerEvents: "none",
          }
        : {}),
    };

    if (isLast || !isClickable) {
      return (
        <Typography
          key={item.key || `${item.label}-${index}`}
          component="span"
          aria-current={isLast ? "page" : undefined}
          sx={commonSx}
        >
          {renderItemContent(item)}
        </Typography>
      );
    }

    return (
      <Link
        key={item.key || `${item.label}-${index}`}
        href={item.href}
        underline="none"
        color="inherit"
        onClick={item.onClick}
        sx={commonSx}
      >
        {renderItemContent(item)}
      </Link>
    );
  };

  return (
    <>
      <Box sx={{ width: "100%", ...sx }}>
        <Box sx={wrapperStyles}>
          <Breadcrumbs
            separator={
              separator ?? (
                <NavigateNextRoundedIcon
                  sx={{
                    fontSize: activeSize.separatorSize,
                    color: t.textDisabled,
                  }}
                />
              )
            }
            aria-label="breadcrumb"
            sx={{
              width: "100%",
              px: variant === "text" ? 0 : 0.5,
              py: variant === "text" ? 0 : 0.5,

              "& .MuiBreadcrumbs-ol": {
                flexWrap: "nowrap",
                alignItems: "center",
              },

              "& .MuiBreadcrumbs-li": {
                display: "inline-flex",
                alignItems: "center",
                minWidth: 0,
              },

              "& .MuiBreadcrumbs-separator": {
                mx: 0.5,
                color: t.textDisabled,
                userSelect: "none",
              },
            }}
            {...props}
          >
            {collapsedData.visibleItems.map((item, index) => {
              const isLast = index === collapsedData.visibleItems.length - 1;
              return renderItem(item, index, isLast);
            })}
          </Breadcrumbs>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            backgroundColor: t.surface,
            color: t.text,
            border: `1px solid ${t.border}`,
            borderRadius: resolvedRadius,
            boxShadow: t.shadowLg,
            backgroundImage: "none",
          },
        }}
      >
        {collapsedData.hiddenItems.map((item, index) => {
          const itemDisabled = disabled || item.disabled;
          const clickable = !itemDisabled && (item.onClick || item.href);

          return (
            <MenuItem
              key={item.key || `${item.label}-hidden-${index}`}
              component={clickable && item.href ? "a" : "li"}
              href={clickable && item.href ? item.href : undefined}
              onClick={(event) => {
                if (itemDisabled) return;
                item.onClick?.(event);
                handleCloseMenu();
              }}
              disabled={itemDisabled}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: activeSize.gap,
                fontSize: activeSize.fontSize,
                color: t.text,
                minHeight: activeSize.minHeight,
                transition: "background-color 0.18s ease, color 0.18s ease",
                "&:hover": {
                  backgroundColor: active.soft,
                  color: active.main,
                },
              }}
            >
              {item.icon ? (
                <Box
                  component="span"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "& svg": {
                      fontSize: activeSize.iconSize,
                    },
                  }}
                >
                  {item.icon}
                </Box>
              ) : null}
              <span>{item.label}</span>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

function getWrapperVariantStyles({ variant, t, active }) {
  switch (variant) {
    case "soft":
      return {
        backgroundColor: active.soft,
        border: "1px solid transparent",
        px: 0.5,
        py: 0.5,
      };

    case "contained":
      return {
        backgroundColor: t.surface,
        border: `1px solid ${t.border}`,
        px: 0.5,
        py: 0.5,
      };

    case "outlined":
      return {
        backgroundColor: "transparent",
        border: `1px solid ${t.border}`,
        px: 0.5,
        py: 0.5,
      };

    case "text":
    default:
      return {
        backgroundColor: "transparent",
        border: "none",
        px: 0,
        py: 0,
      };
  }
}

export default AppBreadcrumb;
