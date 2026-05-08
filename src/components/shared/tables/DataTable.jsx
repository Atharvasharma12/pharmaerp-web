import React, { useMemo, useState } from "react";
import { Box } from "@mui/material";

import {
  AppResponsiveTable,
  AppTableToolbar,
  AppTablePagination,
  FilterChipList,
} from "@/components";

const DataTable = ({
  columns = [],
  rows = [],
  getRowId = (row) => row.id,

  loading = false,

  searchable = true,
  searchValue = "",
  onSearchChange,
  onSearch,
  onSearchClear,
  searchPlaceholder = "Search table...",

  filters = [],
  onFilterRemove,
  onFiltersClear,
  showFilterChips = true,

  selectable = false,
  selectedIds,
  onSelectedIdsChange,

  showRowActions = false,
  rowActionsProps = {},
  onView,
  onEdit,
  onDelete,
  onDuplicate,

  pagination = true,
  page = 1,
  pageSize = 10,
  totalItems,
  onPageChange,
  onPageSizeChange,

  showToolbar = true,
  toolbarActions,
  leftToolbarActions,
  rightToolbarActions,

  showColumnManager = true,
  visibleColumns,
  onColumnChange,

  showExport = true,
  exportData,
  exportFilename = "table-export",
  onExport,

  emptyTitle,
  emptyDescription,
  emptyVariant = "empty",

  dense = false,
  bordered = true,
  rounded = true,
  hover = true,
  stickyHeader = false,

  sx = {},
  toolbarSx = {},
  filterChipSx = {},
  tableSx = {},
  paginationSx = {},

  tableProps = {},
  toolbarProps = {},
  paginationProps = {},
}) => {
  const [internalSelectedIds, setInternalSelectedIds] = useState([]);

  const activeSelectedIds = selectedIds ?? internalSelectedIds;

  const activeColumns = useMemo(() => {
    if (!visibleColumns?.length) return columns;

    return columns.filter((column) =>
      visibleColumns.includes(column.key || column.id),
    );
  }, [columns, visibleColumns]);

  const activeTotalItems = totalItems ?? rows.length;

  const handleSelectRow = (rowId, checked) => {
    const nextSelectedIds = checked
      ? [...activeSelectedIds, rowId]
      : activeSelectedIds.filter((id) => id !== rowId);

    if (onSelectedIdsChange) {
      onSelectedIdsChange(nextSelectedIds);
    } else {
      setInternalSelectedIds(nextSelectedIds);
    }
  };

  const handleSelectAll = (nextSelectedIds) => {
    if (onSelectedIdsChange) {
      onSelectedIdsChange(nextSelectedIds);
    } else {
      setInternalSelectedIds(nextSelectedIds);
    }
  };

  const handleClearSelection = () => {
    if (onSelectedIdsChange) {
      onSelectedIdsChange([]);
    } else {
      setInternalSelectedIds([]);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        ...sx,
      }}
    >
      {showToolbar ? (
        <AppTableToolbar
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onSearch={onSearch}
          onSearchClear={onSearchClear}
          searchPlaceholder={searchPlaceholder}
          showSearch={searchable}
          columns={columns}
          visibleColumns={visibleColumns}
          onColumnChange={onColumnChange}
          showColumnManager={showColumnManager}
          selectedIds={activeSelectedIds}
          onClearSelection={handleClearSelection}
          showExport={showExport}
          exportData={exportData || rows}
          exportFilename={exportFilename}
          onExport={onExport}
          actions={toolbarActions}
          leftActions={leftToolbarActions}
          rightActions={rightToolbarActions}
          dense={dense}
          sx={toolbarSx}
          {...toolbarProps}
        />
      ) : null}

      {showFilterChips ? (
        <FilterChipList
          filters={filters}
          onRemove={onFilterRemove}
          onClearAll={onFiltersClear}
          sx={filterChipSx}
        />
      ) : null}

      <AppResponsiveTable
        columns={activeColumns}
        rows={rows}
        getRowId={getRowId}
        loading={loading}
        selectable={selectable}
        selectedIds={activeSelectedIds}
        onSelectRow={handleSelectRow}
        onSelectAll={handleSelectAll}
        showRowActions={showRowActions}
        rowActionsProps={rowActionsProps}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        emptyVariant={emptyVariant}
        dense={dense}
        bordered={bordered}
        rounded={rounded}
        hover={hover}
        stickyHeader={stickyHeader}
        sx={tableSx}
        {...tableProps}
      />

      {pagination ? (
        <AppTablePagination
          page={page}
          pageSize={pageSize}
          totalItems={activeTotalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          dense={dense}
          sx={paginationSx}
          {...paginationProps}
        />
      ) : null}
    </Box>
  );
};

export default DataTable;
