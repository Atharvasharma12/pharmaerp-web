import React, { forwardRef, useMemo } from "react";
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
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppTextarea = forwardRef(function AppTextarea(
  {
    label,
    helperText,
    errorText,
    value,
    defaultValue,
    onChange,
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
    minRows = 4,
    maxRows,
    rows,
    resize = "vertical", // none | both | horizontal | vertical
    showCount = false,
    maxLength,
    autoComplete,
    autoFocus = false,
    sx = {},
    inputSx = {},
    formControlSx = {},
    labelSx = {},
    helperTextSx = {},
    counterSx = {},
    inputProps = {},
    ...props
  },
  ref,
) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const t = getThemeTokens(theme);

  const currentValue =
    value !== undefined && value !== null ? String(value) : undefined;
  const hasValue = Boolean(
    (currentValue ?? defaultValue ?? "").toString().length > 0,
  );

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
    },
    success: {
      main: t.success,
      hover: t.successHover,
      soft: t.successSoft,
      border: t.success,
    },
    error: {
      main: t.error,
      hover: t.errorHover,
      soft: t.errorSoft,
      border: t.error,
    },
    warning: {
      main: t.warning,
      hover: t.warningHover,
      soft: t.warningSoft,
      border: t.warning,
    },
    info: {
      main: t.info,
      hover: t.infoHover,
      soft: t.infoSoft,
      border: t.info,
    },
    dark: {
      main: isDark ? t.neutral[100] : t.neutral[900],
      hover: isDark ? t.neutral[200] : t.neutral[800],
      soft: isDark ? t.surfaceHover : t.neutral[100],
      border: isDark ? t.borderStrong : t.neutral[300],
    },
    neutral: {
      main: isDark ? t.neutral[500] : t.neutral[600],
      hover: isDark ? t.neutral[400] : t.neutral[700],
      soft: isDark ? t.surfaceHover : t.neutral[100],
      border: isDark ? t.neutral[400] : t.neutral[300],
    },
  };

  const active = colorMap[resolvedColorVariant] || colorMap.primary;

  const radiusMap = {
    sm: "8px",
    md: "12px",
    lg: "14px",
    xl: "16px",
    full: "20px",
  };

  const sizeMap = {
    small: {
      fontSize: "0.82rem",
      px: 1.25,
      py: 1,
      labelSize: "0.82rem",
      helperSize: "0.74rem",
      iconSize: 18,
    },
    medium: {
      fontSize: "0.88rem",
      px: 1.5,
      py: 1.1,
      labelSize: "0.86rem",
      helperSize: "0.78rem",
      iconSize: 19,
    },
    large: {
      fontSize: "0.94rem",
      px: 1.75,
      py: 1.2,
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

  const helperMessage = useMemo(() => {
    if (showError && errorText) return errorText;
    return helperText;
  }, [showError, errorText, helperText]);

  const charCount = currentValue?.length ?? 0;

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
            sx={{ color: active.main }}
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
    }

    if (!content.length) return null;

    return (
      <InputAdornment
        position={position}
        sx={{
          alignSelf: "flex-start",
          mt: 1,
          ml: position === "end" ? 0.25 : 0,
          mr: position === "start" ? 0.25 : 0,
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
          shrink
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
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        multiline
        minRows={rows ? undefined : minRows}
        maxRows={rows ? undefined : maxRows}
        rows={rows}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        startAdornment={renderAdornmentContent("start")}
        endAdornment={renderAdornmentContent("end")}
        inputProps={{
          maxLength,
          ...inputProps,
          ...props.inputProps,
        }}
        {...props}
        sx={{
          borderRadius: radiusMap[rounded] || radiusMap.md,
          fontSize: currentSize.fontSize,
          color: t.text,
          backgroundColor: currentVariant.backgroundColor,
          alignItems: "flex-start",
          transition:
            "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease",

          "& .MuiOutlinedInput-input": {
            px: currentSize.px,
            py: currentSize.py,
            fontSize: currentSize.fontSize,
            lineHeight: 1.55,
            color: t.text,
            resize,

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
              borderColor: active.hover,
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

      {(helperMessage || showCount) && (
        <Box
          sx={{
            mt: 0.75,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <FormHelperText
            sx={{
              mt: 0,
              mx: 0,
              flex: 1,
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
            {helperMessage || " "}
          </FormHelperText>

          {showCount ? (
            <Typography
              sx={{
                flexShrink: 0,
                color:
                  maxLength && charCount > maxLength ? t.error : t.textMuted,
                fontSize: currentSize.helperSize,
                fontWeight: 600,
                lineHeight: 1.4,
                ...counterSx,
              }}
            >
              {charCount}
              {maxLength ? `/${maxLength}` : ""}
            </Typography>
          ) : null}
        </Box>
      )}
    </FormControl>
  );
});

export default AppTextarea;
