import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppShortcutHint = ({
  keys,
  label,
  variant = "soft", // soft | outlined | subtle | filled
  size = "medium", // small | medium | large
  rounded = "md", // sm | md | lg | full
  direction = "row", // row | column
  separator = "+",
  platformAware = true,
  muted = false,
  inline = true,
  sx = {},
  keySx = {},
  labelSx = {},
  ...props
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const t = getThemeTokens(activeMode, colorTheme);

  const radiusMap = {
    sm: "6px",
    md: "8px",
    lg: "10px",
    full: "999px",
  };

  const sizeMap = {
    small: {
      keyMinWidth: 20,
      keyHeight: 22,
      keyPx: 0.75,
      keyFontSize: "0.68rem",
      labelFontSize: "0.72rem",
      gap: 0.5,
      separatorFontSize: "0.7rem",
    },
    medium: {
      keyMinWidth: 24,
      keyHeight: 26,
      keyPx: 1,
      keyFontSize: "0.76rem",
      labelFontSize: "0.8rem",
      gap: 0.75,
      separatorFontSize: "0.78rem",
    },
    large: {
      keyMinWidth: 28,
      keyHeight: 30,
      keyPx: 1.2,
      keyFontSize: "0.84rem",
      labelFontSize: "0.9rem",
      gap: 1,
      separatorFontSize: "0.86rem",
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;

  const isMac =
    typeof navigator !== "undefined" &&
    /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

  const normalizeKey = (key) => {
    if (!platformAware || !key) return key;

    const map = {
      cmd: isMac ? "⌘" : "Ctrl",
      command: isMac ? "⌘" : "Ctrl",
      ctrl: isMac ? "⌃" : "Ctrl",
      control: isMac ? "⌃" : "Ctrl",
      alt: isMac ? "⌥" : "Alt",
      option: isMac ? "⌥" : "Alt",
      shift: isMac ? "⇧" : "Shift",
      enter: isMac ? "↩" : "Enter",
      return: isMac ? "↩" : "Enter",
      backspace: isMac ? "⌫" : "Backspace",
      delete: isMac ? "⌦" : "Delete",
      esc: "Esc",
      escape: "Esc",
      tab: "Tab",
      up: "↑",
      down: "↓",
      left: "←",
      right: "→",
    };

    const normalized = String(key).trim();
    const lower = normalized.toLowerCase();

    return map[lower] || normalized;
  };

  const resolvedKeys = Array.isArray(keys)
    ? keys
    : typeof keys === "string"
      ? keys
          .split("+")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const displayKeys = resolvedKeys.map(normalizeKey);

  const variantStyles = {
    soft: {
      keyBg: t.surfaceAlt,
      keyColor: muted ? t.textMuted : t.text,
      keyBorder: t.border,
      containerBg: "transparent",
    },
    outlined: {
      keyBg: "transparent",
      keyColor: muted ? t.textMuted : t.text,
      keyBorder: t.borderStrong,
      containerBg: "transparent",
    },
    subtle: {
      keyBg: t.surfaceHover,
      keyColor: muted ? t.textMuted : t.text,
      keyBorder: "transparent",
      containerBg: "transparent",
    },
    filled: {
      keyBg: t.primarySoft,
      keyColor: t.primary,
      keyBorder: "transparent",
      containerBg: "transparent",
    },
  };

  const activeVariant = variantStyles[variant] || variantStyles.soft;

  const rootDirection = direction === "column" ? "column" : "row";

  return (
    <Stack
      direction={rootDirection}
      alignItems={rootDirection === "row" ? "center" : "flex-start"}
      spacing={activeSize.gap}
      sx={{
        display: inline ? "inline-flex" : "flex",
        width: inline ? "auto" : "100%",
        color: t.text,
        ...sx,
      }}
      {...props}
    >
      {label ? (
        <Typography
          component="span"
          sx={{
            fontSize: activeSize.labelFontSize,
            lineHeight: 1.2,
            fontWeight: 500,
            color: muted ? t.textMuted : t.text,
            whiteSpace: "nowrap",
            ...labelSx,
          }}
        >
          {label}
        </Typography>
      ) : null}

      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        flexWrap="wrap"
        sx={{
          rowGap: 0.5,
        }}
      >
        {displayKeys.map((key, index) => (
          <React.Fragment key={`${key}-${index}`}>
            <Box
              component="kbd"
              sx={{
                minWidth: activeSize.keyMinWidth,
                height: activeSize.keyHeight,
                px: activeSize.keyPx,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: radiusMap[rounded] || radiusMap.md,
                border:
                  activeVariant.keyBorder === "transparent"
                    ? "1px solid transparent"
                    : `1px solid ${activeVariant.keyBorder}`,
                backgroundColor: activeVariant.keyBg,
                color: activeVariant.keyColor,
                fontFamily: `"Inter", sans-serif`,
                fontSize: activeSize.keyFontSize,
                fontWeight: 700,
                lineHeight: 1,
                whiteSpace: "nowrap",
                boxShadow: t.shadowXs,
                userSelect: "none",
                letterSpacing: "0.01em",
                ...keySx,
              }}
            >
              {key}
            </Box>

            {index < displayKeys.length - 1 ? (
              <Typography
                component="span"
                sx={{
                  fontSize: activeSize.separatorFontSize,
                  lineHeight: 1,
                  color: t.textMuted,
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                {separator}
              </Typography>
            ) : null}
          </React.Fragment>
        ))}
      </Stack>
    </Stack>
  );
};

export default AppShortcutHint;
