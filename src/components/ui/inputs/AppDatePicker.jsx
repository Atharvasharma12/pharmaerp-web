import React from "react";
import { FormControl, FormHelperText, Typography } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppDatePicker = ({
  label,
  value = null,
  onChange,
  name,
  colorVariant = "primary",
  size = "medium",
  disabled = false,
  required = false,
  helperText,
  error = false,
  fullWidth = false,
  readOnly = false,
  placeholder = "Select date",
  format = "DD/MM/YYYY",
  minDate,
  maxDate,
  disablePast = false,
  disableFuture = false,
  showToday = true,
  showClear = true,
  sx = {},
  inputSx = {},
  labelSx = {},
  helperTextSx = {},
  ...props
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const isDark = activeMode === "dark";
  const t = getThemeTokens(activeMode, colorTheme);

  const colorMap = {
    primary: { main: t.primary, hover: t.primaryHover, soft: t.primarySoft },
    success: { main: t.success, hover: t.successHover, soft: t.successSoft },
    error: { main: t.error, hover: t.errorHover, soft: t.errorSoft },
    warning: { main: t.warning, hover: t.warningHover, soft: t.warningSoft },
    info: { main: t.info, hover: t.infoHover, soft: t.infoSoft },
    dark: {
      main: isDark ? t.neutral[100] : t.neutral[900],
      hover: isDark ? t.neutral[200] : t.neutral[800],
      soft: isDark ? t.surfaceHover : t.neutral[100],
    },
    neutral: {
      main: isDark ? t.neutral[400] : t.neutral[700],
      hover: isDark ? t.neutral[300] : t.neutral[800],
      soft: isDark ? t.surfaceHover : t.neutral[100],
    },
  };

  const active = error
    ? colorMap.error
    : colorMap[colorVariant] || colorMap.primary;

  const sizeMap = {
    small: {
      inputHeight: 38,
      fontSize: "0.82rem",
      helperFontSize: "0.74rem",
      labelFontSize: "0.82rem",
      iconSize: 18,
      px: 1.25,
    },
    medium: {
      inputHeight: 44,
      fontSize: "0.9rem",
      helperFontSize: "0.78rem",
      labelFontSize: "0.88rem",
      iconSize: 20,
      px: 1.5,
    },
    large: {
      inputHeight: 50,
      fontSize: "0.98rem",
      helperFontSize: "0.82rem",
      labelFontSize: "0.94rem",
      iconSize: 22,
      px: 1.75,
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;

  const handleChange = (newValue) => {
    if (readOnly || disabled) return;
    onChange?.(newValue);
  };

  const actions = [];
  if (showClear) actions.push("clear");
  if (showToday) actions.push("today");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormControl
        error={error}
        disabled={disabled}
        required={required}
        sx={{
          width: fullWidth ? "100%" : 260,
          minWidth: 0,
          ...sx,
        }}
      >
        {label ? (
          <Typography
            sx={{
              mb: 0.75,
              color: disabled ? t.disabledText : error ? t.error : t.text,
              fontSize: activeSize.labelFontSize,
              fontWeight: 600,
              lineHeight: 1.35,
              ...labelSx,
            }}
          >
            {label}
          </Typography>
        ) : null}

        <DatePicker
          value={value}
          onChange={handleChange}
          format={format}
          disabled={disabled}
          readOnly={readOnly}
          minDate={minDate}
          maxDate={maxDate}
          disablePast={disablePast}
          disableFuture={disableFuture}
          slots={{
            openPickerIcon: CalendarMonthRoundedIcon,
          }}
          slotProps={{
            textField: {
              name,
              fullWidth: true,
              error,
              placeholder,
              required,
            },
            field: {
              readOnly,
            },
            openPickerButton: {
              disabled,
            },
            actionBar: {
              actions,
            },
            popper: {
              sx: {
                "& .MuiPaper-root": {
                  borderRadius: "16px",
                  border: `1px solid ${t.border}`,
                  backgroundColor: t.surface,
                  boxShadow: t.shadowLg,
                },
                "& .MuiPickersDay-root": {
                  borderRadius: "10px",
                  fontWeight: 500,
                },
                "& .MuiPickersDay-root.Mui-selected": {
                  backgroundColor: active.main,
                  color: "#ffffff",
                },
                "& .MuiPickersDay-root.Mui-selected:hover": {
                  backgroundColor: active.hover,
                },
                "& .MuiPickersDay-root:hover": {
                  backgroundColor: active.soft,
                },
                "& .MuiDialogActions-root button": {
                  color: active.main,
                  fontWeight: 700,
                  textTransform: "none",
                },
              },
            },
          }}
          sx={{
            width: "100%",

            "& .MuiInputBase-root": {
              minHeight: activeSize.inputHeight,
              borderRadius: "14px",
              backgroundColor: disabled ? t.disabledBg : t.surface,
              color: disabled ? t.disabledText : t.text,
              fontSize: activeSize.fontSize,
              transition:
                "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
            },

            "& .MuiInputBase-input": {
              padding: `${(activeSize.inputHeight - 20) / 2}px ${activeSize.px}px`,
              fontSize: activeSize.fontSize,
              color: disabled ? t.disabledText : t.text,
            },

            "& .MuiOutlinedInput-notchedOutline": {
              borderWidth: "1.5px",
              borderColor: disabled
                ? t.disabledBorder
                : error
                  ? t.error
                  : t.borderStrong,
            },

            "& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: disabled ? t.disabledBorder : active.hover,
            },

            "& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: disabled ? t.disabledBorder : active.main,
              },

            "& .MuiInputBase-root.Mui-focused": {
              boxShadow: disabled ? "none" : t.focusRing,
            },

            "& .MuiInputAdornment-root .MuiIconButton-root": {
              color: disabled ? t.disabledText : error ? t.error : active.main,
              borderRadius: "10px",
              mr: 0.25,
            },

            "& .MuiInputAdornment-root .MuiIconButton-root:hover": {
              backgroundColor: disabled ? "transparent" : active.soft,
            },

            "& .MuiSvgIcon-root": {
              fontSize: activeSize.iconSize,
            },

            "& .MuiInputBase-root.Mui-disabled": {
              backgroundColor: t.disabledBg,
            },

            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: t.disabledText,
            },

            ...inputSx,
          }}
          {...props}
        />

        {helperText ? (
          <FormHelperText
            sx={{
              mt: 0.75,
              ml: 0.25,
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
    </LocalizationProvider>
  );
};

export default AppDatePicker;
