import React from "react";

import {
  AppBox,
  AppStack,
  AppButton,
  AppText,
  SearchFilter,
  SelectFilter,
  DateRangeFilter,
  StatusFilter,
  SavedFilters,
  FilterChipList,
} from "@/components";

const AdvancedFilterPanel = ({
  values = {},
  onChange,

  filters = [],
  onRemoveFilter,
  onClearFilters,

  title = "Advanced Filters",
  description,

  searchable = true,
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

  actions,
  footer,

  collapsible = false,
  collapsed = false,

  dense = false,
  disabled = false,
  loading = false,

  showChips = true,
  showClear = true,
  clearLabel = "Clear filters",

  columns = 2,

  sx = {},
  headerSx = {},
  fieldsSx = {},
  chipsSx = {},
  footerSx = {},

  ...props
}) => {
  const fieldSize = dense ? "small" : "medium";

  const handleFieldChange = (name) => (eventOrValue, maybeValue) => {
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

  if (collapsible && collapsed) {
    return null;
  }

  return (
    <AppBox
      surface
      bordered
      rounded
      sx={{
        width: "100%",
        p: dense ? 1.5 : 2,
        ...sx,
      }}
      {...props}
    >
      <AppStack spacing={2}>
        <AppStack spacing={0.5} sx={headerSx}>
          <AppText
            sx={{
              fontSize: dense ? "0.9rem" : "1rem",
              fontWeight: 800,
              color: "var(--color-text)",
            }}
          >
            {title}
          </AppText>

          {description ? (
            <AppText
              sx={{
                fontSize: "0.82rem",
                color: "var(--color-text-muted)",
                lineHeight: 1.5,
              }}
            >
              {description}
            </AppText>
          ) : null}
        </AppStack>

        <AppBox
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: `repeat(${columns}, minmax(0, 1fr))`,
            },
            gap: 1.25,
            ...fieldsSx,
          }}
        >
          {searchable ? (
            <SearchFilter
              name={searchName}
              label={searchLabel}
              placeholder={searchPlaceholder}
              value={values[searchName] || ""}
              onChange={handleFieldChange(searchName)}
              size={fieldSize}
              disabled={disabled}
              loading={loading}
              fullWidth
            />
          ) : null}

          {showStatus ? (
            <StatusFilter
              name={statusName}
              label={statusLabel}
              value={values[statusName] || ""}
              onChange={handleFieldChange(statusName)}
              options={statusOptions}
              size={fieldSize}
              disabled={disabled}
              loading={loading}
              fullWidth
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
              fullWidth
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
              fullWidth
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
              fullWidth
            />
          ))}
        </AppBox>

        {showChips ? (
          <>
            <FilterChipList
              filters={filters}
              onRemove={onRemoveFilter}
              onClearAll={onClearFilters}
              sx={chipsSx}
            />
          </>
        ) : null}

        <AppStack
          direction="row"
          align="center"
          justify="space-between"
          spacing={1}
          sx={footerSx}
        >
          <AppStack
            direction="row"
            align="center"
            spacing={1}
            useFlexGap
            flexWrap="wrap"
          >
            {actions}
          </AppStack>

          <AppStack direction="row" align="center" spacing={1}>
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

            {footer}
          </AppStack>
        </AppStack>
      </AppStack>
    </AppBox>
  );
};

export default AdvancedFilterPanel;
