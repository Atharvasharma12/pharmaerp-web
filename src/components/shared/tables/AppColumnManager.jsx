import React, { useMemo } from "react";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";

import {
  AppDropdown,
  AppCheckbox,
  AppStack,
  AppText,
  AppButton,
} from "@/components";

const AppColumnManager = ({
  columns = [],
  visibleColumns,
  onChange,

  label = "Columns",
  tooltip = "Manage columns",

  disabled = false,
  loading = false,
  dense = false,

  showReset = true,
  resetLabel = "Reset",
  selectAllLabel = "Select all",

  triggerType = "button",
  size,
  variant = "outlined",
  colorVariant = "dark",

  sx = {},
  ...props
}) => {
  const columnItems = useMemo(
    () =>
      columns.filter(
        (column) =>
          column &&
          column.key &&
          column.label &&
          column.hideFromColumnManager !== true,
      ),
    [columns],
  );

  const allColumnKeys = useMemo(
    () => columnItems.map((column) => column.key),
    [columnItems],
  );

  const activeColumns = visibleColumns || allColumnKeys;

  const allSelected =
    allColumnKeys.length > 0 &&
    allColumnKeys.every((key) => activeColumns.includes(key));

  const partiallySelected =
    activeColumns.length > 0 && activeColumns.length < allColumnKeys.length;

  const handleToggleColumn = (key) => {
    if (disabled || loading) return;

    const nextColumns = activeColumns.includes(key)
      ? activeColumns.filter((item) => item !== key)
      : [...activeColumns, key];

    onChange?.(nextColumns);
  };

  const handleSelectAll = () => {
    if (disabled || loading) return;
    onChange?.(allSelected ? [] : allColumnKeys);
  };

  const handleReset = () => {
    if (disabled || loading) return;
    onChange?.(allColumnKeys);
  };

  return (
    <AppDropdown
      label={label}
      icon={<ViewColumnRoundedIcon />}
      triggerType={triggerType}
      variant={variant}
      colorVariant={colorVariant}
      size={size || (dense ? "small" : "medium")}
      disabled={disabled}
      loading={loading}
      menuMinWidth={240}
      closeOnItemClick={false}
      tooltip={tooltip}
      sx={sx}
      {...props}
    >
      <AppStack
        spacing={1}
        sx={{
          p: 1,
          minWidth: 220,
        }}
      >
        <AppStack
          direction="row"
          align="center"
          justify="space-between"
          spacing={1}
        >
          <AppText
            sx={{
              fontSize: "0.78rem",
              fontWeight: 800,
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Visible columns
          </AppText>

          {showReset ? (
            <AppButton
              variant="text"
              colorVariant="primary"
              size="small"
              onClick={handleReset}
              disabled={disabled || loading}
            >
              {resetLabel}
            </AppButton>
          ) : null}
        </AppStack>

        <AppCheckbox
          label={selectAllLabel}
          checked={allSelected}
          indeterminate={partiallySelected}
          onChange={handleSelectAll}
          disabled={disabled || loading}
          size={dense ? "small" : "medium"}
        />

        <AppStack spacing={0.5}>
          {columnItems.map((column) => (
            <AppCheckbox
              key={column.key}
              label={column.label}
              checked={activeColumns.includes(column.key)}
              onChange={() => handleToggleColumn(column.key)}
              disabled={disabled || loading || column.required}
              size={dense ? "small" : "medium"}
            />
          ))}
        </AppStack>
      </AppStack>
    </AppDropdown>
  );
};

export default AppColumnManager;
