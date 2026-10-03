import React, { forwardRef, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppAutocomplete = forwardRef(function AppAutocomplete(
  {
    label,
    helperText,
    errorText,
    value,
    defaultValue = null,
    onChange,
    inputValue,
    onInputChange,
    name,
    id,
    placeholder = "Search or select option",
    fullWidth = true,
    disabled = false,
    readOnly = false,
    required = false,
    error = false,
    success = false,
    loading = false,
    clearable = true,
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
    options = [],
    multiple = false,
    freeSolo = false,
    disableCloseOnSelect,
    filterSelectedOptions = false,
    autoHighlight = true,
    autoComplete = true,
    autoSelect = false,
    openOnFocus = false,
    limitTags = 2,
    showCheckbox = true,
    showCheckIcon = true,
    showSearchIcon = false,
    optionLabelKey = "label",
    optionValueKey = "value",
    getOptionLabel,
    getOptionValue,
    isOptionEqualToValue,
    filterOptions,
    groupBy,
    renderOption,
    renderTag,
    noOptionsText = "No options found",
    loadingText = "Loading...",
    menuMaxHeight = 320,
    autoFocus = false,
    sx = {},
    inputSx = {},
    formControlSx = {},
    labelSx = {},
    helperTextSx = {},
    autocompleteSx = {},
    textFieldProps = {},
    ...props
  },
  ref,
) {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const isDark = activeMode === "dark";
  const t = getThemeTokens(activeMode, colorTheme);

  const [internalInputValue, setInternalInputValue] = useState("");

  const resolvedId = id || name || label?.toLowerCase?.().replace(/\s+/g, "-");
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
      minHeight: 36,
      fontSize: "0.82rem",
      px: 1.25,
      py: 0.75,
      labelSize: "0.82rem",
      helperSize: "0.74rem",
      iconSize: 18,
      chipHeight: 22,
      chipFontSize: "0.7rem",
      optionMinHeight: 36,
    },
    medium: {
      minHeight: 42,
      fontSize: "0.88rem",
      px: 1.5,
      py: 0.9,
      labelSize: "0.86rem",
      helperSize: "0.78rem",
      iconSize: 19,
      chipHeight: 24,
      chipFontSize: "0.74rem",
      optionMinHeight: 42,
    },
    large: {
      minHeight: 48,
      fontSize: "0.94rem",
      px: 1.75,
      py: 1,
      labelSize: "0.9rem",
      helperSize: "0.8rem",
      iconSize: 20,
      chipHeight: 26,
      chipFontSize: "0.78rem",
      optionMinHeight: 46,
    },
  };

  const currentSize = sizeMap[size] || sizeMap.medium;

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

  const resolvedGetOptionLabel = (option) => {
    if (getOptionLabel) return getOptionLabel(option);
    if (typeof option === "string") return option;
    return option?.[optionLabelKey] ?? option?.label ?? "";
  };

  const resolvedGetOptionValue = (option) => {
    if (getOptionValue) return getOptionValue(option);
    if (typeof option === "string") return option;
    return option?.[optionValueKey] ?? option?.value ?? option;
  };

  const resolvedIsOptionEqualToValue = (option, selectedValue) => {
    if (isOptionEqualToValue)
      return isOptionEqualToValue(option, selectedValue);
    return (
      resolvedGetOptionValue(option) === resolvedGetOptionValue(selectedValue)
    );
  };

  const currentInputValue =
    inputValue !== undefined ? inputValue : internalInputValue;

  const hasSelectedValue = multiple
    ? Array.isArray(value) && value.length > 0
    : value !== undefined && value !== null && value !== "";

  const hasTypedValue =
    currentInputValue !== undefined &&
    currentInputValue !== null &&
    String(currentInputValue).length > 0;

  const handleInputChange = (event, nextValue, reason) => {
    if (inputValue === undefined) {
      setInternalInputValue(nextValue);
    }
    onInputChange?.(event, nextValue, reason);
  };

  const handleClear = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (onClear) {
      onClear(event);
      return;
    }

    if (multiple) {
      onChange?.(event, []);
    } else {
      onChange?.(event, null);
    }

    if (inputValue === undefined) {
      setInternalInputValue("");
    }
  };

  const renderExtraStartAdornment = () => {
    const content = [];

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

    if (showSearchIcon) {
      content.push(
        <SearchRoundedIcon
          key="search-icon"
          sx={{
            color: t.textMuted,
            fontSize: currentSize.iconSize,
          }}
        />,
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
        <React.Fragment key="start-adornment">{startAdornment}</React.Fragment>,
      );
    }

    if (!content.length) return null;

    return (
      <InputAdornment position="start" sx={{ mr: 0.25 }}>
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

  const renderExtraEndAdornment = (paramsEndAdornment) => {
    const content = [];

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

    if (
      clearable &&
      !disabled &&
      !readOnly &&
      (hasSelectedValue || hasTypedValue)
    ) {
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

    if (paramsEndAdornment) {
      content.push(
        <React.Fragment key="mui-end">{paramsEndAdornment}</React.Fragment>,
      );
    }

    if (!content.length) return null;

    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        {content}
      </Box>
    );
  };

  const defaultRenderTags = (tagValue, getTagProps) => {
    const visibleItems =
      limitTags >= 0 ? tagValue.slice(0, limitTags) : tagValue;
    const hiddenCount =
      limitTags >= 0 && tagValue.length > limitTags
        ? tagValue.length - limitTags
        : 0;

    return [
      ...visibleItems.map((option, index) => {
        const tagProps = getTagProps({ index });

        return (
          <Chip
            {...tagProps}
            key={String(resolvedGetOptionValue(option))}
            label={resolvedGetOptionLabel(option)}
            size="small"
            deleteIcon={<CloseRoundedIcon sx={{ fontSize: 16 }} />}
            sx={{
              height: currentSize.chipHeight,
              maxWidth: 160,
              borderRadius: "999px",
              backgroundColor: active.soft,
              color: active.main,
              border: "1px solid transparent",
              fontSize: currentSize.chipFontSize,
              fontWeight: 700,
              "& .MuiChip-label": {
                px: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
              "& .MuiChip-deleteIcon": {
                color: `${active.main} !important`,
                fontSize: 16,
              },
            }}
          />
        );
      }),
      ...(hiddenCount > 0
        ? [
            <Chip
              key="hidden-count"
              label={`+${hiddenCount}`}
              size="small"
              sx={{
                height: currentSize.chipHeight,
                borderRadius: "999px",
                backgroundColor: t.surfaceHover,
                color: t.textMuted,
                fontSize: currentSize.chipFontSize,
                fontWeight: 700,
                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />,
          ]
        : []),
    ];
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

      <Autocomplete
        ref={ref}
        id={resolvedId}
        options={options}
        multiple={multiple}
        freeSolo={freeSolo}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        inputValue={currentInputValue}
        onInputChange={handleInputChange}
        disabled={disabled}
        readOnly={readOnly}
        autoHighlight={autoHighlight}
        autoComplete={autoComplete}
        autoSelect={autoSelect}
        openOnFocus={openOnFocus}
        filterSelectedOptions={filterSelectedOptions}
        disableCloseOnSelect={disableCloseOnSelect ?? (multiple ? true : false)}
        getOptionLabel={resolvedGetOptionLabel}
        isOptionEqualToValue={resolvedIsOptionEqualToValue}
        filterOptions={filterOptions}
        groupBy={groupBy}
        noOptionsText={noOptionsText}
        loading={loading}
        loadingText={loadingText}
        popupIcon={
          <KeyboardArrowDownRoundedIcon
            sx={{
              fontSize: currentSize.iconSize + 2,
              color: t.textMuted,
            }}
          />
        }
        clearIcon={
          <ClearRoundedIcon
            sx={{
              fontSize: 18,
              color: t.textMuted,
            }}
          />
        }
        renderTags={(tagValue, getTagProps) =>
          renderTag
            ? renderTag(tagValue, getTagProps)
            : defaultRenderTags(tagValue, getTagProps)
        }
        renderOption={(optionProps, option, state) => {
          if (renderOption) {
            return renderOption(optionProps, option, state);
          }

          return (
            <Box
              component="li"
              {...optionProps}
              sx={{
                minHeight: currentSize.optionMinHeight,
                borderRadius: "10px",
                mx: 0.25,
                my: 0.125,
                px: 1.25,
                py: 0.9,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                color: state.selected ? active.main : t.text,
                backgroundColor: state.selected ? active.soft : "transparent",
                transition:
                  "background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease",

                "&[aria-selected='true']": {
                  backgroundColor: `${active.soft} !important`,
                  color: active.main,
                },

                "&:hover": {
                  backgroundColor: `${state.selected ? active.soft : t.surfaceHover} !important`,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  minWidth: 0,
                  flex: 1,
                }}
              >
                {multiple && showCheckbox ? (
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={state.selected}
                      readOnly
                      style={{
                        accentColor: active.main,
                        pointerEvents: "none",
                      }}
                    />
                  </Box>
                ) : null}

                <Typography
                  sx={{
                    fontSize: currentSize.fontSize,
                    fontWeight: state.selected ? 700 : 500,
                    color: "inherit",
                    lineHeight: 1.35,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {resolvedGetOptionLabel(option)}
                </Typography>
              </Box>

              {showCheckIcon && state.selected ? (
                <CheckRoundedIcon
                  sx={{
                    fontSize: 18,
                    color: active.main,
                    flexShrink: 0,
                  }}
                />
              ) : null}
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            autoFocus={autoFocus}
            placeholder={placeholder}
            error={showError}
            {...textFieldProps}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  {renderExtraStartAdornment()}
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: renderExtraEndAdornment(
                params.InputProps.endAdornment,
              ),
              sx: {
                borderRadius: radiusMap[rounded] || radiusMap.md,
                fontSize: currentSize.fontSize,
                color: t.text,
                backgroundColor: currentVariant.backgroundColor,
                minHeight: currentSize.minHeight,
                transition:
                  "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease",

                "& .MuiAutocomplete-input": {
                  fontSize: currentSize.fontSize,
                  lineHeight: 1.45,
                  color: t.text,
                },

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: showError
                    ? active.border
                    : currentVariant.borderColor,
                  transition:
                    "border-color 0.18s ease, border-width 0.18s ease",
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

                  "& .MuiAutocomplete-input": {
                    WebkitTextFillColor: t.disabledText,
                  },
                },

                ...inputSx,
                ...sx,
              },
            }}
          />
        )}
        slotProps={{
          paper: {
            sx: {
              mt: 0.75,
              borderRadius: "12px",
              border: `1px solid ${t.border}`,
              backgroundColor: t.surface,
              boxShadow: t.shadowLg,
              backgroundImage: "none",
              overflow: "hidden",
            },
          },
          listbox: {
            sx: {
              p: 0.75,
              maxHeight: menuMaxHeight,
              overflow: "auto",
            },
          },
          popper: {
            sx: {
              "& .MuiAutocomplete-noOptions": {
                color: t.textMuted,
                fontSize: currentSize.fontSize,
              },
              "& .MuiAutocomplete-loading": {
                color: t.textMuted,
                fontSize: currentSize.fontSize,
              },
            },
          },
        }}
        sx={{
          "& .MuiAutocomplete-tag": {
            m: 0,
          },
          ...autocompleteSx,
        }}
        {...props}
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

export default AppAutocomplete;
