import React from "react";
import { Box } from "@mui/material";

import {
  AppStack,
  SearchFilter,
  SelectFilter,
  DateRangeFilter,
  StatusFilter,
  SavedFilters,
  FilterChipList,
  AppButton,
} from "@/components";

const FilterBar = ({
  values = {},
  onChange,

  filters = [],
  onRemoveFilter,
  onClearFilters,

  showSearch = true,
  searchName = "search",
  searchLabel = "Search",
  searchPlaceholder = "Search...",

  showStatus = false,
  statusName = "status",
  statusLabel = "Status",
  statusOptions = [],

  showSavedFilters = false,
  savedFilterName = "savedFilter",
  savedFilterOptions = [],
  onSavedFilterChange,

  selects = [],
  dateRanges = [],

  leftContent,
  rightContent,
  actions,

  showChips = true,
  showClear = true,
  clearLabel = "Clear",

  dense = false,
  disabled = false,
  loading = false,

  sticky = false,
  bordered = false,
  surface = false,

  sx = {},
  fieldsSx = {},
  chipsSx = {},
  actionsSx = {},

  ...props
}) => {
  const fieldSize = dense ? "small" : "medium";

  const handleChange = (name) => (eventOrValue, maybeValue) => {
    const value = maybeValue ?? eventOrValue?.target?.value ?? eventOrValue;

    onChange?.({
      ...values,
      [name]: value,
    });
  };

  const handleSavedFilterChange = (eventOrValue, maybeValue) => {
    const value = maybeValue ?? eventOrValue?.target?.value ?? eventOrValue;

    onChange?.({
      ...values,
      [savedFilterName]: value,
    });

    onSavedFilterChange?.(value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        position: sticky ? "sticky" : "relative",
        top: sticky ? 0 : "auto",
        zIndex: sticky ? 9 : "auto",
        backgroundColor: surface ? "var(--color-surface)" : "var(--color-bg)",
        border: bordered ? "1px solid var(--color-border)" : "none",
        borderRadius: bordered ? "14px" : 0,
        px: bordered ? 1.5 : 0,
        py: bordered ? 1.25 : 0,
        ...sx,
      }}
      {...props}
    >
      <AppStack spacing={1.25} fullWidth>
        <AppStack
          direction={{ xs: "column", md: "row" }}
          align={{ xs: "stretch", md: "center" }}
          justify="space-between"
          spacing={1}
          fullWidth
        >
          <AppStack
            direction={{ xs: "column", sm: "row" }}
            align={{ xs: "stretch", sm: "center" }}
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            sx={{
              flex: 1,
              minWidth: 0,
              ...fieldsSx,
            }}
          >
            {leftContent}

            {showSearch ? (
              <SearchFilter
                name={searchName}
                label={searchLabel}
                placeholder={searchPlaceholder}
                value={values[searchName] || ""}
                onChange={handleChange(searchName)}
                size={fieldSize}
                disabled={disabled}
                loading={loading}
              />
            ) : null}

            {showStatus ? (
              <StatusFilter
                name={statusName}
                label={statusLabel}
                value={values[statusName] || ""}
                onChange={handleChange(statusName)}
                options={statusOptions}
                size={fieldSize}
                disabled={disabled}
                loading={loading}
              />
            ) : null}

            {showSavedFilters ? (
              <SavedFilters
                name={savedFilterName}
                value={values[savedFilterName] || ""}
                onChange={handleSavedFilterChange}
                options={savedFilterOptions}
                size={fieldSize}
                disabled={disabled}
                loading={loading}
              />
            ) : null}

            {selects.map((filter) => (
              <SelectFilter
                key={filter.name}
                {...filter}
                value={values[filter.name] ?? filter.value ?? ""}
                onChange={handleChange(filter.name)}
                size={filter.size || fieldSize}
                disabled={disabled || filter.disabled}
                loading={loading || filter.loading}
              />
            ))}

            {dateRanges.map((filter) => (
              <DateRangeFilter
                key={filter.name}
                {...filter}
                value={values[filter.name] ?? filter.value}
                onChange={handleChange(filter.name)}
                size={filter.size || fieldSize}
                disabled={disabled || filter.disabled}
                loading={loading || filter.loading}
              />
            ))}
          </AppStack>

          <AppStack
            direction="row"
            align="center"
            justify={{ xs: "flex-start", md: "flex-end" }}
            spacing={1}
            useFlexGap
            flexWrap="wrap"
            sx={actionsSx}
          >
            {rightContent}

            {actions}

            {showClear ? (
              <AppButton
                variant="outlined"
                colorVariant="dark"
                size={fieldSize}
                onClick={onClearFilters}
                disabled={disabled || loading}
              >
                {clearLabel}
              </AppButton>
            ) : null}
          </AppStack>
        </AppStack>

        {showChips ? (
          <FilterChipList
            filters={filters}
            onRemove={onRemoveFilter}
            onClearAll={onClearFilters}
            sx={chipsSx}
          />
        ) : null}
      </AppStack>
    </Box>
  );
};

export default FilterBar;
