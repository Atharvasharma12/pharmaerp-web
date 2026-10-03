import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
} from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppSwitch = ({
  label,
  checked = false,
  defaultChecked,
  onChange,
  name,
  value,
  colorVariant = "primary", // primary | success | error | warning | info | dark | neutral
  size = "medium", // small | medium | large
  labelPlacement = "end", // end | start | top | bottom
  disabled = false,
  required = false,
  helperText,
  error = false,
  fullWidth = false,
  readOnly = false,
  sx = {},
  switchSx = {},
  labelSx = {},
  helperTextSx = {},
  ...props
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const isDark = activeMode === "dark";
  const t = getThemeTokens(activeMode, colorTheme);

  const colorMap = {
    primary: {
      main: t.primary,
      hover: t.primaryHover,
      soft: t.primarySoft,
      contrast: t.primaryContrast,
      trackOff: isDark ? t.neutral[700] : t.neutral[300],
    },
    success: {
      main: t.success,
      hover: t.successHover,
      soft: t.successSoft,
      contrast: t.successContrast,
      trackOff: isDark ? t.neutral[700] : t.neutral[300],
    },
    error: {
      main: t.error,
      hover: t.errorHover,
      soft: t.errorSoft,
      contrast: t.errorContrast,
      trackOff: isDark ? t.neutral[700] : t.neutral[300],
    },
    warning: {
      main: t.warning,
      hover: t.warningHover,
      soft: t.warningSoft,
      contrast: t.warningContrast,
      trackOff: isDark ? t.neutral[700] : t.neutral[300],
    },
    info: {
      main: t.info,
      hover: t.infoHover,
      soft: t.infoSoft,
      contrast: t.infoContrast,
      trackOff: isDark ? t.neutral[700] : t.neutral[300],
    },
    dark: {
      main: isDark ? t.neutral[100] : t.neutral[900],
      hover: isDark ? t.neutral[200] : t.neutral[800],
      soft: isDark ? t.surfaceHover : t.neutral[100],
      contrast: isDark ? t.text : t.textInverse,
      trackOff: isDark ? t.neutral[700] : t.neutral[300],
    },
    neutral: {
      main: isDark ? t.neutral[500] : t.neutral[700],
      hover: isDark ? t.neutral[400] : t.neutral[800],
      soft: isDark ? t.surfaceHover : t.neutral[100],
      contrast: "#ffffff",
      trackOff: isDark ? t.neutral[700] : t.neutral[300],
    },
  };

  const active = error
    ? colorMap.error
    : colorMap[colorVariant] || colorMap.primary;

  const sizeMap = {
    small: {
      width: 44,
      height: 26,
      thumb: 18,
      offset: 4,
      translateX: 18,
      labelFontSize: "0.82rem",
      helperFontSize: "0.74rem",
      gap: 0.75,
    },
    medium: {
      width: 54,
      height: 32,
      thumb: 22,
      offset: 5,
      translateX: 22,
      labelFontSize: "0.9rem",
      helperFontSize: "0.78rem",
      gap: 1,
    },
    large: {
      width: 64,
      height: 38,
      thumb: 26,
      offset: 6,
      translateX: 26,
      labelFontSize: "0.98rem",
      helperFontSize: "0.82rem",
      gap: 1.1,
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;

  const handleChange = (e, nextChecked) => {
    if (readOnly || disabled) return;
    onChange?.(e, nextChecked);
  };

  const helperMarginLeft =
    labelPlacement === "start" || !label
      ? 0
      : `calc(${activeSize.width}px + ${activeSize.gap * 8}px)`;

  return (
    <FormControl
      error={error}
      disabled={disabled}
      required={required}
      sx={{
        width: fullWidth ? "100%" : "auto",
        minWidth: 0,
        ...sx,
      }}
    >
      <FormControlLabel
        label={label}
        labelPlacement={labelPlacement}
        control={
          <Switch
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={handleChange}
            name={name}
            value={value}
            disabled={disabled}
            disableRipple
            sx={{
              width: activeSize.width,
              height: activeSize.height,
              p: 0,
              m: 0,
              position: "relative",
              overflow: "visible",
              flexShrink: 0,

              "& .MuiSwitch-switchBase": {
                p: 0,
                m: 0,
                position: "absolute",
                left: activeSize.offset,
                top: "50%",
                transform: "translate(0, -50%)",
                transitionDuration: "180ms",
                color: "#ffffff",

                "&.Mui-checked": {
                  transform: `translate(${activeSize.translateX}px, -50%)`,
                  color: "#ffffff",

                  "& + .MuiSwitch-track": {
                    backgroundColor: disabled ? t.disabledBg : active.main,
                    borderColor: disabled ? t.disabledBorder : active.main,
                    opacity: 1,
                  },

                  "&:hover + .MuiSwitch-track": {
                    backgroundColor: disabled ? t.disabledBg : active.hover,
                  },
                },

                "&.Mui-disabled + .MuiSwitch-track": {
                  opacity: 1,
                  backgroundColor: t.disabledBg,
                  borderColor: t.disabledBorder,
                },

                "&.Mui-focusVisible .MuiSwitch-thumb": {
                  boxShadow: t.focusRing,
                },
              },

              "& .MuiSwitch-thumb": {
                width: activeSize.thumb,
                height: activeSize.thumb,
                boxSizing: "border-box",
                backgroundColor: "#ffffff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                transition:
                  "background-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
              },

              "& .MuiSwitch-track": {
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                borderRadius: 999,
                backgroundColor: disabled
                  ? t.disabledBg
                  : error
                    ? t.errorSoft
                    : active.trackOff,
                border: `1px solid ${
                  disabled ? t.disabledBorder : error ? t.error : "transparent"
                }`,
                opacity: 1,
                transition:
                  "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
              },

              "&:hover .MuiSwitch-track": {
                backgroundColor:
                  disabled || checked ? undefined : active.trackOff,
              },

              ...(readOnly && {
                opacity: 1,
                "& .MuiSwitch-switchBase": {
                  cursor: "default",
                },
                "& .MuiSwitch-thumb": {
                  boxShadow: "0 1px 4px rgba(0,0,0,0.14)",
                },
              }),

              ...switchSx,
            }}
            {...props}
          />
        }
        sx={{
          margin: 0,
          gap: activeSize.gap,
          alignItems:
            labelPlacement === "top" || labelPlacement === "bottom"
              ? "flex-start"
              : "center",
          width: fullWidth ? "100%" : "auto",
          userSelect: "none",

          "& .MuiFormControlLabel-label": {
            color: disabled ? t.disabledText : error ? t.error : t.text,
            fontSize: activeSize.labelFontSize,
            fontWeight: 500,
            lineHeight: 1.4,
            transition: "color 0.18s ease",
            ...labelSx,
          },
        }}
      />

      {helperText ? (
        <FormHelperText
          sx={{
            mt: 0.5,
            ml: helperMarginLeft,
            color: error ? t.error : t.textMuted,
            fontSize: activeSize.helperFontSize,
            lineHeight: 1.45,
            ...helperTextSx,
          }}
        >
          {helperText}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
};

export default AppSwitch;
