import React, { forwardRef, useMemo, useState } from "react";
import {
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppMultiSelect = forwardRef(function AppMultiSelect(
  {
    label,
    helperText,
    errorText,
    value = [],
    defaultValue,
    onChange,
    name,
    id,
    placeholder = "Select options",
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
    options = [],
    optionLabelKey = "label",
    optionValueKey = "value",
    getOptionLabel,
    getOptionValue,
    renderOption,
    renderTag,
    renderValue,
    displayEmpty = true,
    showCheckbox = true,
    showCheckIcon = false,
    showChips = true,
    limitTags = 2,
    menuMaxHeight = 320,
    autoFocus = false,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    showSelectAll = true,
    showCloseAction = true,
    selectAllLabel = "Select all",
    deselectAllLabel = "Clear all",
    closeLabel = "Close",
    sx = {},
    inputSx = {},
    formControlSx = {},
    labelSx = {},
    helperTextSx = {},
    selectProps = {},
    menuProps = {},
    inputProps = {},
    ...props
  },
  ref,
) {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const isDark = activeMode === "dark";
  const t = getThemeTokens(activeMode, colorTheme);

  const resolvedId = id || name || label?.toLowerCase?.().replace(/\s+/g, "-");
  const showError = Boolean(error || errorText);
  const resolvedColorVariant = showError
    ? "error"
    : success
      ? "success"
      : colorVariant;

  const isControlledOpen = typeof controlledOpen === "boolean";
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlledOpen ? controlledOpen : internalOpen;

  const safeValue = Array.isArray(value) ? value : [];

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
      py: 0.7,
      labelSize: "0.82rem",
      helperSize: "0.74rem",
      iconSize: 18,
      menuItemMinHeight: 34,
      chipHeight: 22,
      chipFontSize: "0.7rem",
    },
    medium: {
      minHeight: 42,
      fontSize: "0.88rem",
      px: 1.5,
      py: 0.85,
      labelSize: "0.86rem",
      helperSize: "0.78rem",
      iconSize: 19,
      menuItemMinHeight: 40,
      chipHeight: 24,
      chipFontSize: "0.74rem",
    },
    large: {
      minHeight: 48,
      fontSize: "0.94rem",
      px: 1.75,
      py: 0.95,
      labelSize: "0.9rem",
      helperSize: "0.8rem",
      iconSize: 20,
      menuItemMinHeight: 46,
      chipHeight: 26,
      chipFontSize: "0.78rem",
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

  const resolvedOptions = useMemo(() => {
    return options.map((option, index) => {
      const optionValue = getOptionValue
        ? getOptionValue(option)
        : (option?.[optionValueKey] ?? option?.value ?? index);

      const optionLabel = getOptionLabel
        ? getOptionLabel(option)
        : (option?.[optionLabelKey] ?? option?.label ?? String(optionValue));

      return {
        raw: option,
        value: optionValue,
        label: optionLabel,
        disabled: Boolean(option?.disabled),
      };
    });
  }, [options, getOptionLabel, getOptionValue, optionLabelKey, optionValueKey]);

  const enabledOptions = resolvedOptions.filter((option) => !option.disabled);
  const enabledValues = enabledOptions.map((option) => option.value);
  const selectedOptions = resolvedOptions.filter((option) =>
    safeValue.includes(option.value),
  );

  const hasValue = safeValue.length > 0;
  const allSelected =
    enabledValues.length > 0 &&
    enabledValues.every((optionValue) => safeValue.includes(optionValue));
  const partiallySelected = safeValue.length > 0 && !allSelected;

  const emitChange = (nextValue) => {
    onChange?.({
      target: {
        name,
        value: nextValue,
      },
    });
  };

  const setOpenState = (next) => {
    if (!isControlledOpen) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  const handleClear = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (onClear) {
      onClear(event);
      return;
    }

    emitChange([]);
  };

  const handleDeleteChip = (chipValue) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (readOnly || disabled) return;

    const nextValue = safeValue.filter((item) => item !== chipValue);
    emitChange(nextValue);
  };

  const handleToggleSelectAll = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled || readOnly) return;

    if (allSelected) {
      emitChange([]);
      return;
    }

    emitChange(enabledValues);
  };

  const handleCloseMenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenState(false);
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

  const defaultRenderTags = (selected) => {
    const visibleItems =
      limitTags >= 0 ? selected.slice(0, limitTags) : selected;
    const hiddenCount =
      limitTags >= 0 && selected.length > limitTags
        ? selected.length - limitTags
        : 0;

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.5,
          minWidth: 0,
        }}
      >
        {visibleItems.map((option) => (
          <Chip
            key={String(option.value)}
            label={option.label}
            size="small"
            onMouseDown={(event) => event.stopPropagation()}
            onDelete={
              readOnly || disabled ? undefined : handleDeleteChip(option.value)
            }
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
        ))}

        {hiddenCount > 0 ? (
          <Chip
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
          />
        ) : null}
      </Box>
    );
  };

  const renderSelectedValue = (selected) => {
    const selectedList = Array.isArray(selected) ? selected : [];
    const selectedResolved = resolvedOptions.filter((option) =>
      selectedList.includes(option.value),
    );

    if (renderValue) {
      return renderValue(
        selectedList,
        selectedResolved.map((item) => item.raw),
        selectedResolved,
      );
    }

    if (!selectedList.length) {
      return (
        <Typography
          component="span"
          sx={{
            color: t.textMuted,
            fontSize: currentSize.fontSize,
          }}
        >
          {placeholder}
        </Typography>
      );
    }

    if (!showChips) {
      return (
        <Typography
          component="span"
          sx={{
            color: t.text,
            fontSize: currentSize.fontSize,
            lineHeight: 1.4,
          }}
        >
          {selectedResolved.map((item) => item.label).join(", ")}
        </Typography>
      );
    }

    return renderTag
      ? renderTag(
          selectedResolved.map((item) => item.raw),
          selectedResolved,
        )
      : defaultRenderTags(selectedResolved);
  };

  const IconComponent = (iconProps) => (
    <KeyboardArrowDownRoundedIcon
      {...iconProps}
      sx={{
        fontSize: currentSize.iconSize + 2,
        color: t.textMuted,
        right: 12,
        pointerEvents: "none",
      }}
    />
  );

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

      <Select
        multiple
        id={resolvedId}
        ref={ref}
        name={name}
        value={safeValue}
        defaultValue={defaultValue}
        onChange={onChange}
        displayEmpty={displayEmpty}
        disabled={disabled}
        autoFocus={autoFocus}
        open={open}
        onOpen={() => setOpenState(true)}
        onClose={() => setOpenState(false)}
        input={
          <OutlinedInput
            readOnly={readOnly}
            startAdornment={renderAdornmentContent("start")}
            endAdornment={renderAdornmentContent("end")}
            inputProps={{
              ...inputProps,
              ...props.inputProps,
            }}
          />
        }
        IconComponent={IconComponent}
        renderValue={renderSelectedValue}
        MenuProps={{
          PaperProps: {
            sx: {
              mt: 0.75,
              borderRadius: "12px",
              border: `1px solid ${t.border}`,
              backgroundColor: t.surface,
              boxShadow: t.shadowLg,
              backgroundImage: "none",
              maxHeight: menuMaxHeight,
              overflow: "auto",
            },
          },
          MenuListProps: {
            sx: {
              p: 0.75,
            },
          },
          ...menuProps,
        }}
        {...selectProps}
        {...props}
        sx={{
          borderRadius: radiusMap[rounded] || radiusMap.md,
          fontSize: currentSize.fontSize,
          color: t.text,
          backgroundColor: currentVariant.backgroundColor,
          minHeight: currentSize.minHeight,
          transition:
            "background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease",

          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 0.5,
            minHeight: "unset",
            px: currentSize.px,
            py: currentSize.py,
            fontSize: currentSize.fontSize,
            lineHeight: 1.45,
            color: hasValue ? t.text : t.textMuted,
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

            "& .MuiSelect-select": {
              WebkitTextFillColor: t.disabledText,
            },
          },

          ...inputSx,
          ...sx,
        }}
      >
        {(showSelectAll || showCloseAction) && (
          <ListSubheader
            disableSticky={false}
            onMouseDown={(event) => event.preventDefault()}
            sx={{
              backgroundColor: t.surface,
              borderBottom: `1px solid ${t.border}`,
              px: 1,
              py: 0.75,
              mb: 0.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  minWidth: 0,
                }}
              >
                {showSelectAll ? (
                  <Box
                    component="button"
                    type="button"
                    onClick={handleToggleSelectAll}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    style={{
                      appearance: "none",
                      border: "none",
                      background: "transparent",
                      padding: 0,
                      margin: 0,
                      cursor: disabled || readOnly ? "not-allowed" : "pointer",
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: 1,
                        py: 0.625,
                        borderRadius: "10px",
                        color:
                          disabled || readOnly ? t.disabledText : active.main,
                        backgroundColor:
                          allSelected || partiallySelected
                            ? active.soft
                            : "transparent",
                        transition:
                          "background-color 0.18s ease, color 0.18s ease",
                        "&:hover": {
                          backgroundColor:
                            disabled || readOnly ? "transparent" : active.soft,
                        },
                      }}
                    >
                      <Checkbox
                        checked={allSelected}
                        indeterminate={partiallySelected}
                        disableRipple
                        size="small"
                        sx={{
                          p: 0,
                          color: t.textMuted,
                          "&.Mui-checked": {
                            color: active.main,
                          },
                          "&.MuiCheckbox-indeterminate": {
                            color: active.main,
                          },
                        }}
                      />
                      <DoneAllRoundedIcon sx={{ fontSize: 17 }} />
                      <Typography
                        sx={{
                          fontSize: currentSize.fontSize,
                          fontWeight: 700,
                          color: "inherit",
                          lineHeight: 1.2,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {allSelected ? deselectAllLabel : selectAllLabel}
                      </Typography>
                    </Box>
                  </Box>
                ) : null}
              </Box>

              {showCloseAction ? (
                <Box
                  component="button"
                  type="button"
                  onClick={handleCloseMenu}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  style={{
                    appearance: "none",
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    margin: 0,
                    cursor: "pointer",
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.625,
                      px: 1,
                      py: 0.625,
                      borderRadius: "10px",
                      color: t.textMuted,
                      transition:
                        "background-color 0.18s ease, color 0.18s ease",
                      "&:hover": {
                        backgroundColor: t.surfaceHover,
                        color: t.text,
                      },
                    }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 17 }} />
                    <Typography
                      sx={{
                        fontSize: currentSize.fontSize,
                        fontWeight: 700,
                        color: "inherit",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {closeLabel}
                    </Typography>
                  </Box>
                </Box>
              ) : null}
            </Box>
          </ListSubheader>
        )}

        {resolvedOptions.map((option) => {
          const isSelected = safeValue.includes(option.value);

          return (
            <MenuItem
              key={String(option.value)}
              value={option.value}
              disabled={option.disabled}
              sx={{
                minHeight: currentSize.menuItemMinHeight,
                borderRadius: "10px",
                mx: 0.25,
                my: 0.125,
                px: 1.25,
                py: 0.9,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                color: isSelected ? active.main : t.text,
                backgroundColor: isSelected ? active.soft : "transparent",
                transition:
                  "background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease",

                "&:hover": {
                  backgroundColor: isSelected ? active.soft : t.surfaceHover,
                },

                "&.Mui-selected": {
                  backgroundColor: active.soft,
                  color: active.main,
                },

                "&.Mui-selected:hover": {
                  backgroundColor: active.soft,
                },

                "&.Mui-disabled": {
                  color: t.disabledText,
                },
              }}
            >
              {renderOption ? (
                renderOption(option.raw, {
                  selected: isSelected,
                  option,
                })
              ) : (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    {showCheckbox ? (
                      <Checkbox
                        checked={isSelected}
                        size="small"
                        disableRipple
                        sx={{
                          p: 0,
                          color: t.textMuted,
                          "&.Mui-checked": {
                            color: active.main,
                          },
                        }}
                      />
                    ) : null}

                    <Typography
                      sx={{
                        fontSize: currentSize.fontSize,
                        fontWeight: isSelected ? 700 : 500,
                        color: "inherit",
                        lineHeight: 1.35,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {option.label}
                    </Typography>
                  </Box>

                  {showCheckIcon && isSelected ? (
                    <CheckRoundedIcon
                      sx={{
                        fontSize: 18,
                        color: active.main,
                        flexShrink: 0,
                      }}
                    />
                  ) : null}
                </>
              )}
            </MenuItem>
          );
        })}
      </Select>

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

export default AppMultiSelect;
