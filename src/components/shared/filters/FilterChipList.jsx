import React from "react";
import { Box, Stack } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { AppBadge, AppButton } from "@/components";

const FilterChipList = ({
  filters = [],
  onRemove,
  onClearAll,

  clearLabel = "Clear all",
  showClearAll = true,

  size = "small",
  colorVariant = "primary",
  empty = null,

  sx = {},
  ...props
}) => {
  const activeFilters = filters.filter(
    (filter) =>
      filter &&
      filter.value !== undefined &&
      filter.value !== null &&
      filter.value !== "" &&
      !(Array.isArray(filter.value) && filter.value.length === 0),
  );

  if (!activeFilters.length) {
    return empty;
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      useFlexGap
      flexWrap="wrap"
      alignItems="center"
      sx={sx}
      {...props}
    >
      {activeFilters.map((filter) => (
        <AppBadge
          key={filter.key || filter.name}
          label={`${filter.label}: ${
            Array.isArray(filter.displayValue || filter.value)
              ? (filter.displayValue || filter.value).join(", ")
              : filter.displayValue || filter.value
          }`}
          size={size}
          variant="soft"
          colorVariant={filter.colorVariant || colorVariant}
          removable
          onDelete={() => onRemove?.(filter.key || filter.name, filter)}
          endIcon={<CloseRoundedIcon />}
        />
      ))}

      {showClearAll ? (
        <Box>
          <AppButton
            variant="text"
            colorVariant="dark"
            size="small"
            onClick={onClearAll}
          >
            {clearLabel}
          </AppButton>
        </Box>
      ) : null}
    </Stack>
  );
};

export default FilterChipList;
