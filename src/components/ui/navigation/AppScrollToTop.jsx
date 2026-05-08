import React, { useEffect, useMemo, useState } from "react";
import { Box, Fade, Tooltip } from "@mui/material";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import AppIconButton from "@/components/ui/buttons/AppIconButton";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppScrollToTop = ({
  threshold,
  showAfter = 240,
  behavior = "smooth", // smooth | auto
  position = "bottom-right", // bottom-right | bottom-left | top-right | top-left
  offset,
  offsetX = 24,
  offsetY = 24,
  size = "medium", // small | medium | large
  variant = "contained", // contained | outlined | text | soft | gradient
  colorVariant = "primary", // primary | success | error | warning | info | dark | neutral
  rounded = "full", // sm | md | lg | full
  tooltip = "Scroll to top",
  container,
  zIndex = 1200,
  showShadow = true,
  disabled = false,
  icon,
  label,
  children,
  alwaysVisible = false,
  hideWhenAtTop = true,
  onClick,
  sx = {},
  ...props
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);
  const [visible, setVisible] = useState(alwaysVisible);

  const resolvedThreshold =
    typeof threshold === "number" ? threshold : showAfter;

  const resolvedOffsetX = typeof offset === "number" ? offset : offsetX;
  const resolvedOffsetY = typeof offset === "number" ? offset : offsetY;

  useEffect(() => {
    if (alwaysVisible) {
      setVisible(true);
      return undefined;
    }

    const target =
      container && typeof container === "object" && "current" in container
        ? container.current
        : container || window;

    if (!target) return undefined;

    const getScrollTop = () => {
      if (target === window) {
        return window.scrollY || document.documentElement.scrollTop || 0;
      }

      return target.scrollTop || 0;
    };

    const handleScroll = () => {
      const shouldShow = getScrollTop() > resolvedThreshold;
      setVisible(hideWhenAtTop ? shouldShow : true);
    };

    handleScroll();
    target.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      target.removeEventListener("scroll", handleScroll);
    };
  }, [alwaysVisible, container, hideWhenAtTop, resolvedThreshold]);

  const handleScrollToTop = (event) => {
    if (disabled) return;

    onClick?.(event);

    const target =
      container && typeof container === "object" && "current" in container
        ? container.current
        : container || window;

    if (!target) return;

    if (target === window) {
      window.scrollTo({
        top: 0,
        behavior,
      });
      return;
    }

    target.scrollTo({
      top: 0,
      behavior,
    });
  };

  const positionStyles = useMemo(() => {
    const base = {
      position: "fixed",
      zIndex,
    };

    switch (position) {
      case "bottom-left":
        return {
          ...base,
          left: resolvedOffsetX,
          bottom: resolvedOffsetY,
        };

      case "top-right":
        return {
          ...base,
          right: resolvedOffsetX,
          top: resolvedOffsetY,
        };

      case "top-left":
        return {
          ...base,
          left: resolvedOffsetX,
          top: resolvedOffsetY,
        };

      case "bottom-right":
      default:
        return {
          ...base,
          right: resolvedOffsetX,
          bottom: resolvedOffsetY,
        };
    }
  }, [position, resolvedOffsetX, resolvedOffsetY, zIndex]);

  const content = children || icon || <KeyboardArrowUpRoundedIcon />;

  const buttonNode = (
    <Box
      sx={{
        ...positionStyles,
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        ...(showShadow
          ? {
              filter: `drop-shadow(${t.shadowLg})`,
            }
          : {}),
        ...sx,
      }}
    >
      <AppIconButton
        type="button"
        onClick={handleScrollToTop}
        size={size}
        variant={variant}
        colorVariant={colorVariant}
        rounded={rounded}
        disabled={disabled}
        elevation={showShadow}
        aria-label={typeof label === "string" ? label : tooltip}
        sx={{
          flexShrink: 0,
        }}
        {...props}
      >
        {content}
      </AppIconButton>

      {label ? (
        <Box
          onClick={disabled ? undefined : handleScrollToTop}
          sx={{
            px: 1.25,
            minHeight: size === "small" ? 32 : size === "large" ? 44 : 38,
            display: "inline-flex",
            alignItems: "center",
            borderRadius: rounded === "full" ? "999px" : "10px",
            backgroundColor: t.surface,
            color: t.text,
            border: `1px solid ${t.border}`,
            boxShadow: t.shadowSm,
            fontSize:
              size === "small"
                ? "0.76rem"
                : size === "large"
                  ? "0.9rem"
                  : "0.82rem",
            fontWeight: 600,
            whiteSpace: "nowrap",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.7 : 1,
            transition:
              "background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.18s ease",
            "&:hover": disabled
              ? {}
              : {
                  backgroundColor: t.surfaceHover,
                  borderColor: t.borderStrong,
                },
          }}
        >
          {label}
        </Box>
      ) : null}
    </Box>
  );

  return (
    <Fade in={visible} timeout={220} unmountOnExit>
      <Box>
        {tooltip ? <Tooltip title={tooltip}>{buttonNode}</Tooltip> : buttonNode}
      </Box>
    </Fade>
  );
};

export default AppScrollToTop;
