import React from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppCheckbox = ({
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
  indeterminate = false,
  helperText,
  error = false,
  fullWidth = false,
  rounded = "sm", // sm | md | lg | full
  sx = {},
  checkboxSx = {},
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
      border: t.primary,
    },
    success: {
      main: t.success,
      hover: t.successHover,
      soft: t.successSoft,
      contrast: t.successContrast,
      border: t.success,
    },
    error: {
      main: t.error,
      hover: t.errorHover,
      soft: t.errorSoft,
      contrast: t.errorContrast,
      border: t.error,
    },
    warning: {
      main: t.warning,
      hover: t.warningHover,
      soft: t.warningSoft,
      contrast: t.warningContrast,
      border: t.warning,
    },
    info: {
      main: t.info,
      hover: t.infoHover,
      soft: t.infoSoft,
      contrast: t.infoContrast,
      border: t.info,
    },
    dark: {
      main: isDark ? t.neutral[100] : t.neutral[900],
      hover: isDark ? t.neutral[200] : t.neutral[800],
      soft: isDark ? t.surfaceHover : t.neutral[100],
      contrast: isDark ? t.text : t.textInverse,
      border: isDark ? t.borderStrong : t.neutral[400],
    },
    neutral: {
      main: isDark ? t.neutral[500] : t.neutral[700],
      hover: isDark ? t.neutral[400] : t.neutral[800],
      soft: isDark ? t.surfaceHover : t.neutral[100],
      contrast: isDark ? t.textInverse : "#ffffff",
      border: isDark ? t.neutral[400] : t.neutral[400],
    },
  };

  const active = error
    ? colorMap.error
    : colorMap[colorVariant] || colorMap.primary;

  const sizeMap = {
    small: {
      checkboxSize: 16,
      iconFontSize: 16,
      labelFontSize: "0.82rem",
      helperFontSize: "0.74rem",
      gap: 0.75,
      padding: 0.5,
    },
    medium: {
      checkboxSize: 18,
      iconFontSize: 18,
      labelFontSize: "0.9rem",
      helperFontSize: "0.78rem",
      gap: 1,
      padding: 0.75,
    },
    large: {
      checkboxSize: 20,
      iconFontSize: 20,
      labelFontSize: "0.98rem",
      helperFontSize: "0.82rem",
      gap: 1.1,
      padding: 0.9,
    },
  };

  const radiusMap = {
    sm: "6px",
    md: "8px",
    lg: "10px",
    full: "999px",
  };

  const activeSize = sizeMap[size] || sizeMap.medium;
  const iconRadius = radiusMap[rounded] || radiusMap.sm;

  const uncheckedIcon = (
    <span
      style={{
        width: activeSize.checkboxSize,
        height: activeSize.checkboxSize,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: iconRadius,
        border: `1.5px solid ${disabled ? t.disabledBorder : error ? t.error : t.borderStrong}`,
        backgroundColor: disabled ? t.disabledBg : t.surface,
        boxSizing: "border-box",
        transition:
          "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
      }}
    />
  );

  const checkedIcon = (
    <span
      style={{
        width: activeSize.checkboxSize,
        height: activeSize.checkboxSize,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: iconRadius,
        border: `1.5px solid ${disabled ? t.disabledBorder : active.main}`,
        backgroundColor: disabled ? t.disabledBg : active.main,
        color: disabled ? t.disabledText : active.contrast,
        boxSizing: "border-box",
        transition:
          "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
      }}
    >
      <CheckRoundedIcon
        sx={{
          fontSize: activeSize.iconFontSize,
        }}
      />
    </span>
  );

  const indeterminateIcon = (
    <span
      style={{
        width: activeSize.checkboxSize,
        height: activeSize.checkboxSize,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: iconRadius,
        border: `1.5px solid ${disabled ? t.disabledBorder : active.main}`,
        backgroundColor: disabled ? t.disabledBg : active.main,
        color: disabled ? t.disabledText : active.contrast,
        boxSizing: "border-box",
        transition:
          "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
      }}
    >
      <RemoveRoundedIcon
        sx={{
          fontSize: activeSize.iconFontSize,
        }}
      />
    </span>
  );

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
          <Checkbox
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={onChange}
            name={name}
            value={value}
            disabled={disabled}
            indeterminate={indeterminate}
            disableRipple
            icon={uncheckedIcon}
            checkedIcon={checkedIcon}
            indeterminateIcon={indeterminateIcon}
            sx={{
              p: activeSize.padding,
              borderRadius: iconRadius,
              color: disabled ? t.disabledText : t.textMuted,
              transition:
                "background-color 0.18s ease, color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
              "&:hover": {
                backgroundColor: disabled ? "transparent" : active.soft,
              },
              "&.Mui-focusVisible": {
                boxShadow: t.focusRing,
              },
              "&:active": {
                transform: disabled ? "none" : "scale(0.98)",
              },
              "&.Mui-disabled": {
                color: t.disabledText,
              },
              ...checkboxSx,
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
            ml:
              labelPlacement === "start"
                ? 0
                : `calc(${activeSize.checkboxSize}px + ${activeSize.gap * 8}px)`,
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

export default AppCheckbox;
