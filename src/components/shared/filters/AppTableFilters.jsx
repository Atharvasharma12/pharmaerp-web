import React from "react";
import { Box } from "@mui/material";

import {
  AppStack,
  SearchFilter,
  SelectFilter,
  DateRangeFilter,
  StatusFilter,
  FilterChipList,
  AppButton,
} from "@/components";

const AppTableFilters = ({
  values = {},
  onChange,
  onRemove,
  onClear,

  search = true,
  searchName = "search",
  searchPlaceholder = "Search...",
  searchLabel = "Search",

  status = true,
  statusName = "status",
  statusOptions,
  statusLabel = "Status",

  selects = [],
  dateRanges = [],

  filters = [],
  showChips = true,

  showClear = true,
  clearLabel = "Clear filters",

  dense = false,
  disabled = false,
  loading = false,

  layout = "inline", // inline | grid | stack
  columns = 4,

  sx = {},
  fieldsSx = {},
  chipsSx = {},
  actionsSx = {},

  ...props
}) => {
  const handleFieldChange = (name) => (eventOrValue, maybeValue) => {
    const value = maybeValue ?? eventOrValue?.target?.value ?? eventOrValue;

    onChange?.({
      ...values,
      [name]: value,
    });
  };

  const fieldSize = dense ? "small" : "medium";

  return (
    <Box
      sx={{
        width: "100%",
        ...sx,
      }}
      {...props}
    >
      <AppStack spacing={1.25}>
        <Box
          sx={{
            display: layout === "grid" ? "grid" : "flex",
            gridTemplateColumns:
              layout === "grid"
                ? `repeat(${columns}, minmax(0, 1fr))`
                : undefined,
            flexDirection: layout === "stack" ? "column" : "row",
            alignItems: layout === "inline" ? "center" : "stretch",
            gap: 1,
            flexWrap: "wrap",
            ...fieldsSx,
          }}
        >
          {search ? (
            <SearchFilter
              name={searchName}
              label={searchLabel}
              placeholder={searchPlaceholder}
              value={values[searchName] || ""}
              onChange={handleFieldChange(searchName)}
              size={fieldSize}
              disabled={disabled}
              loading={loading}
            />
          ) : null}

          {status ? (
            <StatusFilter
              name={statusName}
              label={statusLabel}
              value={values[statusName] || ""}
              onChange={handleFieldChange(statusName)}
              options={statusOptions}
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
              onChange={handleFieldChange(filter.name)}
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
              onChange={handleFieldChange(filter.name)}
              size={filter.size || fieldSize}
              disabled={disabled || filter.disabled}
              loading={loading || filter.loading}
            />
          ))}

          {showClear ? (
            <Box sx={actionsSx}>
              <AppButton
                variant="outlined"
                colorVariant="dark"
                size={fieldSize}
                onClick={onClear}
                disabled={disabled || loading}
              >
                {clearLabel}
              </AppButton>
            </Box>
          ) : null}
        </Box>

        {showChips ? (
          <FilterChipList
            filters={filters}
            onRemove={onRemove}
            onClearAll={onClear}
            sx={chipsSx}
          />
        ) : null}
      </AppStack>
    </Box>
  );
};

export default AppTableFilters;
