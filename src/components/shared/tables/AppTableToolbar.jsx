import React from "react";
import { Box } from "@mui/material";

import {
  AppStack,
  AppTableSearch,
  AppColumnManager,
  AppBulkActions,
  AppExport,
} from "@/components";

const AppTableToolbar = ({
  title,
  subtitle,

  searchValue = "",
  onSearchChange,
  onSearch,
  onSearchClear,
  searchPlaceholder = "Search table...",
  showSearch = true,
  searchProps = {},

  columns = [],
  visibleColumns,
  onColumnChange,
  showColumnManager = true,
  columnManagerProps = {},

  selectedRows = [],
  selectedIds = [],
  onClearSelection,
  bulkActions = [],
  showBulkActions = true,
  bulkActionsProps = {},

  exportData = [],
  exportFilename = "table-export",
  onExport,
  showExport = true,
  exportProps = {},

  actions,
  leftActions,
  rightActions,

  dense = false,
  sticky = false,

  sx = {},
  leftSx = {},
  rightSx = {},

  ...props
}) => {
  const selectedCount = selectedIds.length || selectedRows.length;

  return (
    <Box
      sx={{
        width: "100%",
        position: sticky ? "sticky" : "relative",
        top: sticky ? 0 : "auto",
        zIndex: sticky ? 10 : "auto",
        backgroundColor: "var(--color-bg)",
        borderBottom: sticky ? "1px solid var(--color-border)" : "none",
        py: dense ? 1 : 1.5,
        ...sx,
      }}
      {...props}
    >
      <AppStack
        direction={{ xs: "column", md: "row" }}
        align={{ xs: "stretch", md: "center" }}
        justify="space-between"
        spacing={1.5}
        fullWidth
      >
        <AppStack
          direction={{ xs: "column", sm: "row" }}
          align={{ xs: "stretch", sm: "center" }}
          spacing={1}
          sx={{
            minWidth: 0,
            flex: 1,
            ...leftSx,
          }}
        >
          {leftActions}

          {showSearch ? (
            <AppTableSearch
              value={searchValue}
              onChange={onSearchChange}
              onSearch={onSearch}
              onClear={onSearchClear}
              placeholder={searchPlaceholder}
              dense={dense}
              fullWidth
              width={360}
              {...searchProps}
            />
          ) : null}
        </AppStack>

        <AppStack
          direction="row"
          align="center"
          justify={{ xs: "flex-start", md: "flex-end" }}
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          sx={{
            flexShrink: 0,
            ...rightSx,
          }}
        >
          {showBulkActions && selectedCount > 0 ? (
            <AppBulkActions
              selectedRows={selectedRows}
              selectedIds={selectedIds}
              selectedCount={selectedCount}
              onClearSelection={onClearSelection}
              actions={bulkActions}
              dense={dense}
              {...bulkActionsProps}
            />
          ) : null}

          {rightActions}

          {actions}

          {showColumnManager ? (
            <AppColumnManager
              columns={columns}
              visibleColumns={visibleColumns}
              onChange={onColumnChange}
              dense={dense}
              {...columnManagerProps}
            />
          ) : null}

          {showExport ? (
            <AppExport
              data={exportData}
              filename={exportFilename}
              onExport={onExport}
              dense={dense}
              {...exportProps}
            />
          ) : null}
        </AppStack>
      </AppStack>
    </Box>
  );
};

export default AppTableToolbar;
