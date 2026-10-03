import React, { forwardRef, useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppInput = forwardRef(function AppInput(
  {
    label,
    helperText,
    errorText,
    value,
    defaultValue,
    onChange,
    type = "text",
    name,
    id,
    placeholder,
    fullWidth = true,
    disabled = false,
    readOnly = false,
    required = false,
    error = false,
    success = false,
    loading = false,
    clearable = false,
    onClear,
    size = "medium", // small | medium | large
    variant = "surface", // surface | soft | bordered
    colorVariant = "primary", // primary | success | error | warning | info | dark | neutral
    rounded = "md", // sm | md | lg | xl | full
    startAdornment,
    endAdornment,
    prefix,
    suffix,
    startIcon,
    endIcon,
    multiline = false,
    minRows,
    maxRows,
    rows,
    passwordToggle = true,
    autoComplete,
    autoFocus = false,
    sx = {},
    inputSx = {},
    formControlSx = {},
    labelSx = {},
    helperTextSx = {},
    inputProps = {},
    ...props
  },
  ref,
) {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const isDark = activeMode === "dark";
  const t = getThemeTokens(activeMode, colorTheme);

  const [internalType, setInternalType] = useState(type);
  const isPasswordType = type === "password";
  const resolvedType = isPasswordType && passwordToggle ? internalType : type;

  const hasValue =
    value !== undefined && value !== null && String(value).length > 0;

  const showError = Boolean(error || errorText);
  const resolvedColorVariant = showError
    ? "error"
    : success
      ? "success"
      : colorVariant;

  const colorMap = {
    primary: {
      main: t.primary,
      hover: t.primaryHover,
      soft: t.primarySoft,
      border: t.primary,
      contrast: t.primaryContrast,
    },
    success: {
      main: t.success,
      hover: t.successHover,
      soft: t.successSoft,
      border: t.success,
      contrast: t.successContrast,
    },
    error: {
      main: t.error,
      hover: t.errorHover,
      soft: t.errorSoft,
      border: t.error,
      contrast: t.errorContrast,
    },
    warning: {
      main: t.warning,
      hover: t.warningHover,
      soft: t.warningSoft,
      border: t.warning,
      contrast: t.warningContrast,
    },
    info: {
      main: t.info,
      hover: t.infoHover,
      soft: t.infoSoft,
      border: t.info,
      contrast: t.infoContrast,
    },
    dark: {
      main: isDark ? t.neutral[100] : t.neutral[900],
      hover: isDark ? t.neutral[200] : t.neutral[800],
      soft: isDark ? t.surfaceHover : t.neutral[100],
      border: isDark ? t.borderStrong : t.neutral[300],
      contrast: isDark ? t.text : t.textInverse,
    },
    neutral: {
      main: isDark ? t.neutral[500] : t.neutral[600],
      hover: isDark ? t.neutral[400] : t.neutral[700],
      soft: isDark ? t.surfaceHover : t.neutral[100],
      border: isDark ? t.neutral[400] : t.neutral[300],
      contrast: isDark ? t.text : t.textInverse,
    },
  };

  const active = colorMap[resolvedColorVariant] || colorMap.primary;

  const radiusMap = {
    sm: "8px",
    md: "12px",
    lg: "14px",
    xl: "16px",
    full: "999px",
  };

  const sizeMap = {
    small: {
      minHeight: multiline ? undefined : 36,
      fontSize: "0.82rem",
      px: 1.25,
      py: multiline ? 1 : 0.8,
      labelSize: "0.82rem",
      helperSize: "0.74rem",
      iconSize: 18,
    },
    medium: {
      minHeight: multiline ? undefined : 42,
      fontSize: "0.88rem",
      px: 1.5,
      py: multiline ? 1.1 : 0.95,
      labelSize: "0.86rem",
      helperSize: "0.78rem",
      iconSize: 19,
    },
    large: {
      minHeight: multiline ? undefined : 48,
      fontSize: "0.94rem",
      px: 1.75,
      py: multiline ? 1.2 : 1.05,
      labelSize: "0.9rem",
      helperSize: "0.8rem",
      iconSize: 20,
    },
  };

  const currentSize = sizeMap[size] || sizeMap.medium;
  const resolvedId = id || name || label?.toLowerCase?.().replace(/\s+/g, "-");

  const variantStyles = {
    surface: {
      backgroundColor: t.surface,
      borderColor: t.border,
      hoverBg: t.surface,
    },
    soft: {
      backgroundColor: t.surfaceAlt,
      borderColor: "transparent",
      hoverBg: t.surfaceAlt,
    },
    bordered: {
      backgroundColor: "transparent",
      borderColor: t.border,
      hoverBg: "transparent",
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.surface;

  const handleClear = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (onClear) {
      onClear(event);
      return;
    }

    if (onChange) {
      onChange({
        target: {
          name,
          value: "",
        },
      });
    }
  };

  const togglePasswordVisibility = () => {
    setInternalType((prev) => (prev === "password" ? "text" : "password"));
  };

  const helperMessage = useMemo(() => {
    if (showError && errorText) return errorText;
    return helperText;
  }, [showError, errorText, helperText]);

  const renderAdornmentContent = (position) => {
    const content = [];

    if (position === "start") {
      if (prefix) {
        content.push(
          <Typography
            key="prefix"
            sx={{
              color: t.textMuted,
              fontSize: currentSize.fontSize,
              fontWeight: 600,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {prefix}
          </Typography>,
        );
      }

      if (startIcon) {
        content.push(
          <Box
            key="start-icon"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: t.textMuted,
              "& svg": {
                fontSize: currentSize.iconSize,
              },
            }}
          >
            {startIcon}
          </Box>,
        );
      }

      if (startAdornment) {
        content.push(
          <React.Fragment key="start-adornment">
            {startAdornment}
          </React.Fragment>,
        );
      }
    }

    if (position === "end") {
      if (loading) {
        content.push(
          <CircularProgress
            key="loading"
            size={16}
            thickness={4.5}
            sx={{
              color: active.main,
            }}
          />,
        );
      }

      if (suffix) {
        content.push(
          <Typography
            key="suffix"
            sx={{
              color: t.textMuted,
              fontSize: currentSize.fontSize,
              fontWeight: 600,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {suffix}
          </Typography>,
        );
      }

      if (endAdornment) {
        content.push(
          <React.Fragment key="end-adornment">{endAdornment}</React.Fragment>,
        );
      }

      if (endIcon) {
        content.push(
          <Box
            key="end-icon"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: t.textMuted,
              "& svg": {
                fontSize: currentSize.iconSize,
              },
            }}
          >
            {endIcon}
          </Box>,
        );
      }

      if (clearable && !disabled && !readOnly && hasValue) {
        content.push(
          <IconButton
            key="clear"
            size="small"
            onClick={handleClear}
            sx={{
              width: 26,
              height: 26,
              color: t.textMuted,
              transition: "background-color 0.18s ease, color 0.18s ease",
              "&:hover": {
                backgroundColor: t.surfaceHover,
                color: t.text,
              },
              "&:focus-visible": {
                outline: "none",
                boxShadow: t.focusRing,
              },
            }}
          >
            <ClearRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>,
        );
      }

      if (isPasswordType && passwordToggle && !loading) {
        content.push(
          <IconButton
            key="password-toggle"
            size="small"
            onClick={togglePasswordVisibility}
            sx={{
              width: 28,
              height: 28,
              color: t.textMuted,
              transition: "background-color 0.18s ease, color 0.18s ease",
              "&:hover": {
                backgroundColor: t.surfaceHover,
                color: t.text,
              },
              "&:focus-visible": {
                outline: "none",
                boxShadow: t.focusRing,
              },
            }}
          >
            {resolvedType === "password" ? (
              <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
            ) : (
              <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>,
        );
      }
    }

    if (!content.length) return null;

    return (
      <InputAdornment
        position={position}
        sx={{
          ml: position === "end" ? 0.25 : 0,
          mr: position === "start" ? 0.25 : 0,
          "& .MuiTypography-root": {
            color: t.textMuted,
          },
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {content}
        </Box>
      </InputAdornment>
    );
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      error={showError}
      disabled={disabled}
      required={required}
      sx={{
        width: fullWidth ? "100%" : "auto",
        ...formControlSx,
      }}
    >
      {label ? (
        <InputLabel
          htmlFor={resolvedId}
          shrink={Boolean(
            placeholder || hasValue || defaultValue || multiline || autoFocus,
          )}
          sx={{
            position: "static",
            transform: "none",
            mb: 0.75,
            color: showError ? active.main : t.textMuted,
            fontSize: currentSize.labelSize,
            fontWeight: 700,
            lineHeight: 1.2,

            "&.Mui-focused": {
              color: active.main,
            },

            "&.Mui-disabled": {
              color: t.disabledText,
            },

            ...labelSx,
          }}
        >
          {label}
        </InputLabel>
      ) : null}

      <OutlinedInput
        id={resolvedId}
        ref={ref}
        name={name}
        type={resolvedType}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        multiline={multiline}
        minRows={minRows}
        maxRows={maxRows}
        rows={rows}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        startAdornment={renderAdornmentContent("start")}
        endAdornment={renderAdornmentContent("end")}
        inputProps={{
          ...inputProps,
          ...props.inputProps,
        }}
        {...props}
        sx={{
          borderRadius: radiusMap[rounded] || radiusMap.md,
          fontSize: currentSize.fontSize,
          color: t.text,
          backgroundColor: currentVariant.backgroundColor,
          minHeight: currentSize.minHeight,
          transition:
            "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease",

          "& .MuiOutlinedInput-input": {
            px: currentSize.px,
            py: currentSize.py,
            fontSize: currentSize.fontSize,
            lineHeight: 1.45,
            color: t.text,

            "&::placeholder": {
              color: t.textMuted,
              opacity: 1,
            },

            "&.Mui-disabled": {
              WebkitTextFillColor: t.disabledText,
            },
          },

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: showError ? active.border : currentVariant.borderColor,
            transition: "border-color 0.18s ease, border-width 0.18s ease",
          },

          "&:hover": {
            backgroundColor: currentVariant.hoverBg,

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: showError ? active.hover : active.hover,
            },
          },

          "&.Mui-focused": {
            backgroundColor: currentVariant.backgroundColor,
            boxShadow: t.focusRing,

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: active.main,
              borderWidth: "1px",
            },
          },

          "&.Mui-disabled": {
            backgroundColor: t.disabledBg,

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: t.disabledBorder,
            },
          },

          "&.MuiInputBase-readOnly": {
            backgroundColor: t.readOnlyBg,
          },

          ...inputSx,
          ...sx,
        }}
      />

      {helperMessage ? (
        <FormHelperText
          sx={{
            mt: 0.75,
            mx: 0,
            color: showError ? active.main : t.textMuted,
            fontSize: currentSize.helperSize,
            lineHeight: 1.4,
            fontWeight: showError ? 600 : 500,

            "&.Mui-disabled": {
              color: t.disabledText,
            },

            ...helperTextSx,
          }}
        >
          {helperMessage}
        </FormHelperText>
      ) : null}
    </FormControl>
  );
});

export default AppInput;
