import React from "react";
import {
  Box,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppPagination = ({
  page = 1,
  count = 1,
  onChange,
  totalItems,
  pageSize,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
  showPageSize = false,
  showSummary = true,
  showTotal = true,
  size = "medium", // small | medium | large
  variant = "outlined", // outlined | soft | text
  rounded = "md", // sm | md | lg | full
  align = "space-between", // left | center | right | space-between
  compact = false,
  disabled = false,
  sx = {},
  paginationSx = {},
  summarySx = {},
  ...props
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const isDark = activeMode === "dark";
  const t = getThemeTokens(activeMode, colorTheme);

  const radiusMap = {
    sm: "6px",
    md: "8px",
    lg: "10px",
    full: "999px",
  };

  const sizeMap = {
    small: {
      paginationSize: "small",
      minWidth: 28,
      height: 28,
      fontSize: "0.76rem",
      selectMinWidth: 72,
      gap: 1,
    },
    medium: {
      paginationSize: "medium",
      minWidth: 34,
      height: 34,
      fontSize: "0.82rem",
      selectMinWidth: 84,
      gap: 1.25,
    },
    large: {
      paginationSize: "large",
      minWidth: 40,
      height: 40,
      fontSize: "0.9rem",
      selectMinWidth: 96,
      gap: 1.5,
    },
  };

  const activeSize = sizeMap[size] || sizeMap.medium;

  const variantStyles = {
    outlined: {
      backgroundColor: "transparent",
      border: `1px solid ${t.border}`,
      color: t.text,
      hoverBg: t.surfaceHover,
      selectedBg: t.primary,
      selectedColor: t.primaryContrast,
      selectedBorder: t.primary,
    },
    soft: {
      backgroundColor: t.primarySoft,
      border: "1px solid transparent",
      color: t.primary,
      hoverBg: t.surfaceHover,
      selectedBg: t.primary,
      selectedColor: t.primaryContrast,
      selectedBorder: t.primary,
    },
    text: {
      backgroundColor: "transparent",
      border: "1px solid transparent",
      color: t.text,
      hoverBg: t.surfaceHover,
      selectedBg: t.primarySoft,
      selectedColor: t.primary,
      selectedBorder: "transparent",
    },
  };

  const activeVariant = variantStyles[variant] || variantStyles.outlined;

  const justifyContentMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
    "space-between": "space-between",
  };

  const safePage = Math.max(1, Number(page) || 1);
  const safeCount = Math.max(1, Number(count) || 1);
  const safePageSize = Number(pageSize) || pageSizeOptions[0] || 10;

  const startItem =
    totalItems && totalItems > 0 ? (safePage - 1) * safePageSize + 1 : 0;

  const endItem =
    totalItems && totalItems > 0
      ? Math.min(safePage * safePageSize, totalItems)
      : 0;

  const handlePageChange = (_, value) => {
    if (disabled) return;
    onChange?.(value);
  };

  const handlePageSizeChange = (event) => {
    if (disabled) return;
    onPageSizeChange?.(Number(event.target.value));
  };

  const summaryText = showSummary
    ? totalItems
      ? `Showing ${startItem}-${endItem}${showTotal ? ` of ${totalItems}` : ""}`
      : `Page ${safePage} of ${safeCount}`
    : null;

  return (
    <Stack
      direction={compact ? "column" : { xs: "column", sm: "row" }}
      alignItems={compact ? "stretch" : { xs: "stretch", sm: "center" }}
      justifyContent={justifyContentMap[align] || "space-between"}
      spacing={activeSize.gap}
      sx={{
        width: "100%",
        opacity: disabled ? 0.72 : 1,
        ...sx,
      }}
      {...props}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={activeSize.gap}
        flexWrap="wrap"
        sx={{
          minWidth: 0,
        }}
      >
        {showSummary && (
          <Typography
            variant="body2"
            sx={{
              color: t.textMuted,
              fontSize: activeSize.fontSize,
              whiteSpace: "nowrap",
              ...summarySx,
            }}
          >
            {summaryText}
          </Typography>
        )}

        {showPageSize && onPageSizeChange && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography
              variant="body2"
              sx={{
                color: t.textMuted,
                fontSize: activeSize.fontSize,
                whiteSpace: "nowrap",
              }}
            >
              Rows per page
            </Typography>

            <Select
              size="small"
              value={safePageSize}
              onChange={handlePageSizeChange}
              disabled={disabled}
              sx={{
                minWidth: activeSize.selectMinWidth,
                height: activeSize.height,
                color: t.text,
                backgroundColor: t.surfaceAlt,
                borderRadius: radiusMap[rounded] || radiusMap.md,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: t.border,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: t.primaryHover,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: t.primary,
                  borderWidth: "1.5px",
                },
                "& .MuiSelect-icon": {
                  color: t.textMuted,
                },
                "&.Mui-disabled": {
                  backgroundColor: t.disabledBg,
                  color: t.disabledText,
                },
              }}
            >
              {pageSizeOptions.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  sx={{
                    color: t.text,
                    fontSize: activeSize.fontSize,
                    backgroundColor: t.surface,
                    "&:hover": {
                      backgroundColor: t.surfaceHover,
                    },
                    "&.Mui-selected": {
                      backgroundColor: t.primarySoft,
                      color: t.primary,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: t.primarySoft,
                    },
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        )}
      </Stack>

      <Box
        sx={{
          display: "flex",
          justifyContent:
            align === "space-between"
              ? { xs: "flex-start", sm: "flex-end" }
              : justifyContentMap[align] || "flex-end",
          width: compact ? "100%" : "auto",
        }}
      >
        <Pagination
          page={safePage}
          count={safeCount}
          onChange={handlePageChange}
          disabled={disabled}
          size={activeSize.paginationSize}
          color="standard"
          siblingCount={compact ? 0 : 1}
          boundaryCount={compact ? 1 : 1}
          sx={{
            "& .MuiPagination-ul": {
              gap: 0.5,
              flexWrap: "wrap",
            },

            "& .MuiPaginationItem-root": {
              minWidth: activeSize.minWidth,
              height: activeSize.height,
              fontSize: activeSize.fontSize,
              fontWeight: 600,
              borderRadius: radiusMap[rounded] || radiusMap.md,
              color: activeVariant.color,
              backgroundColor: activeVariant.backgroundColor,
              border: activeVariant.border,
              transition:
                "background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
            },

            "& .MuiPaginationItem-root:hover": {
              backgroundColor: activeVariant.hoverBg,
              borderColor:
                variant === "outlined"
                  ? t.borderStrong
                  : activeVariant.selectedBorder,
            },

            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: activeVariant.selectedBg,
              color: activeVariant.selectedColor,
              borderColor: activeVariant.selectedBorder,
              boxShadow: t.shadowXs,
            },

            "& .MuiPaginationItem-root.Mui-selected:hover": {
              backgroundColor:
                variant === "text" ? t.primarySoft : t.primaryHover,
              color: variant === "text" ? t.primary : t.primaryContrast,
              borderColor: variant === "text" ? "transparent" : t.primaryHover,
            },

            "& .MuiPaginationItem-ellipsis": {
              border: "1px solid transparent",
              backgroundColor: "transparent",
              color: t.textMuted,
            },

            "& .MuiPaginationItem-previousNext, & .MuiPaginationItem-firstLast":
              {
                color: t.text,
              },

            "& .MuiPaginationItem-root.Mui-disabled": {
              backgroundColor:
                variant === "soft" ? t.disabledBg : "transparent",
              color: t.disabledText,
              borderColor:
                variant === "outlined" ? t.disabledBorder : "transparent",
            },

            "& .MuiPaginationItem-root:focus-visible": {
              outline: "none",
              boxShadow: t.focusRing,
            },

            ...paginationSx,
          }}
        />
      </Box>
    </Stack>
  );
};

export default AppPagination;
