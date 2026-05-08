import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import {
  AppSearchInput,
  AppIconButton,
  AppShortcutHint,
  AppLoader,
  AppTooltip,
} from "@/components";

import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppTableSearch = ({
  value,
  defaultValue = "",
  onChange,
  onSearch,
  onClear,

  placeholder = "Search table...",
  label,
  helperText,

  debounce = 300,
  minLength = 0,

  loading = false,
  disabled = false,
  clearable = true,

  fullWidth = false,
  width = 320,
  size = "medium",
  variant = "surface",
  rounded = "md",

  showResultCount = false,
  resultCount = 0,
  totalCount = 0,
  resultLabel = "results",

  showShortcut = true,
  shortcutKeys = ["cmd", "k"],
  focusShortcut = true,

  autoFocus = false,
  dense = false,

  tooltip = "",
  sx = {},
  inputSx = {},
  wrapperSx = {},
  metaSx = {},

  ...props
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const inputRef = useRef(null);
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(defaultValue);
  const searchValue = isControlled ? value : internalValue;

  const hasValue = Boolean(String(searchValue || "").trim());

  const normalizedValue = useMemo(
    () => String(searchValue || "").trim(),
    [searchValue],
  );

  const canSearch = normalizedValue.length >= minLength;

  useEffect(() => {
    if (!focusShortcut) return;

    const handleKeyDown = (event) => {
      const isMac =
        typeof navigator !== "undefined" &&
        /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

      const modifierPressed = isMac ? event.metaKey : event.ctrlKey;

      if (modifierPressed && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.querySelector?.("input")?.focus?.();
        inputRef.current?.focus?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusShortcut]);

  useEffect(() => {
    if (!onSearch) return;

    const timer = window.setTimeout(() => {
      if (canSearch || normalizedValue.length === 0) {
        onSearch(normalizedValue);
      }
    }, debounce);

    return () => {
      window.clearTimeout(timer);
    };
  }, [normalizedValue, debounce, canSearch, onSearch]);

  const handleChange = (event) => {
    const nextValue = event?.target?.value ?? "";

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onChange?.(event, nextValue);
  };

  const handleClear = (event) => {
    if (!isControlled) {
      setInternalValue("");
    }

    onClear?.(event);

    onChange?.(
      {
        target: {
          value: "",
          name: props.name,
        },
      },
      "",
    );

    onSearch?.("");
  };

  const metaText = useMemo(() => {
    if (!showResultCount) return "";

    if (loading) return "Searching...";

    if (!hasValue) {
      return totalCount > 0 ? `${totalCount} total` : "";
    }

    return `${resultCount} ${resultLabel}`;
  }, [
    showResultCount,
    loading,
    hasValue,
    totalCount,
    resultCount,
    resultLabel,
  ]);

  const searchInput = (
    <AppSearchInput
      ref={inputRef}
      value={searchValue}
      onChange={handleChange}
      onClear={handleClear}
      placeholder={placeholder}
      label={label}
      helperText={helperText}
      clearable={clearable}
      disabled={disabled}
      loading={loading}
      autoFocus={autoFocus}
      fullWidth
      size={dense ? "small" : size}
      variant={variant}
      rounded={rounded}
      startIcon={<SearchRoundedIcon />}
      endAdornment={
        showShortcut && !hasValue && !loading ? (
          <AppShortcutHint
            keys={shortcutKeys}
            size="small"
            variant="subtle"
            muted
          />
        ) : null
      }
      inputSx={{
        ...inputSx,
      }}
      {...props}
    />
  );

  return (
    <Box
      sx={{
        width: fullWidth ? "100%" : width,
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
        ...sx,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          ...wrapperSx,
        }}
      >
        {tooltip ? (
          <AppTooltip title={tooltip} placement="top">
            <Box>{searchInput}</Box>
          </AppTooltip>
        ) : (
          searchInput
        )}

        {hasValue && clearable && !disabled ? (
          <AppIconButton
            icon={<CloseRoundedIcon />}
            tooltip="Clear search"
            variant="text"
            colorVariant="dark"
            size="small"
            onClick={handleClear}
            sx={{
              position: "absolute",
              right: loading ? 38 : 6,
              top: label ? 34 : "50%",
              transform: label ? "none" : "translateY(-50%)",
              width: 28,
              height: 28,
              minWidth: 28,
              zIndex: 2,
              display: "none",
            }}
          />
        ) : null}
      </Box>

      {metaText ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            minHeight: 18,
            ...metaSx,
          }}
        >
          {loading ? (
            <AppLoader
              size="small"
              center={false}
              sx={{
                width: "auto",
                minHeight: "auto",
              }}
            />
          ) : null}

          <Typography
            sx={{
              color: t.textMuted,
              fontSize: dense ? "0.72rem" : "0.78rem",
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {metaText}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

export default AppTableSearch;
