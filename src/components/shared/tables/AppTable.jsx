import React, { useMemo } from "react";
import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import {
  AppEmptyTable,
  AppLoader,
  AppRowActions,
  AppTableSkeleton,
} from "@/components";

const AppTable = ({
  columns = [],
  rows = [],
  getRowId = (row) => row.id,

  loading = false,
  skeleton = true,

  selectable = false,
  selectedIds = [],
  onSelectRow,
  onSelectAll,

  showRowActions = false,
  rowActionsProps = {},
  onView,
  onEdit,
  onDelete,
  onDuplicate,

  emptyTitle,
  emptyDescription,
  emptyVariant = "empty",
  emptyActionLabel,
  onEmptyAction,

  dense = false,
  bordered = true,
  rounded = true,
  hover = true,
  stickyHeader = false,

  minWidth = 720,
  maxHeight,

  sx = {},
  containerSx = {},
  tableSx = {},
  headSx = {},
  bodySx = {},
  rowSx = {},
  cellSx = {},

  ...props
}) => {
  const rowIds = useMemo(() => rows.map(getRowId), [rows, getRowId]);

  const selectedCount = selectedIds.length;
  const allSelected = rows.length > 0 && selectedCount === rows.length;
  const partiallySelected = selectedCount > 0 && selectedCount < rows.length;

  const visibleColumns = useMemo(
    () => columns.filter((column) => !column.hidden),
    [columns],
  );

  const totalColumns =
    visibleColumns.length + (selectable ? 1 : 0) + (showRowActions ? 1 : 0);

  const handleSelectAll = (event) => {
    onSelectAll?.(event.target.checked ? rowIds : []);
  };

  const handleSelectRow = (row) => (event) => {
    const rowId = getRowId(row);
    onSelectRow?.(rowId, event.target.checked, row);
  };

  if (loading && skeleton) {
    return (
      <AppTableSkeleton
        rows={6}
        columns={totalColumns || 4}
        dense={dense}
        sx={sx}
      />
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        ...sx,
      }}
      {...props}
    >
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          maxHeight,
          overflow: "auto",
          border: bordered ? "1px solid var(--color-border)" : "none",
          borderRadius: rounded ? "14px" : 0,
          backgroundColor: "var(--color-surface)",
          boxShadow: "none",
          ...containerSx,
        }}
      >
        <Table
          stickyHeader={stickyHeader}
          size={dense ? "small" : "medium"}
          sx={{
            minWidth,
            "& th": {
              backgroundColor: "var(--color-surface-alt)",
              color: "var(--color-text-muted)",
              fontWeight: 800,
              fontSize: dense ? "0.74rem" : "0.78rem",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              borderColor: "var(--color-border)",
              whiteSpace: "nowrap",
            },
            "& td": {
              color: "var(--color-text)",
              fontSize: dense ? "0.8rem" : "0.86rem",
              fontWeight: 500,
              borderColor: "var(--color-border)",
            },
            ...tableSx,
          }}
        >
          <TableHead sx={headSx}>
            <TableRow>
              {selectable ? (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={partiallySelected}
                    onChange={handleSelectAll}
                    disabled={loading || rows.length === 0}
                  />
                </TableCell>
              ) : null}

              {visibleColumns.map((column) => (
                <TableCell
                  key={column.id || column.key}
                  align={column.align || "left"}
                  width={column.width}
                  sx={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    ...column.headerSx,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}

              {showRowActions ? (
                <TableCell align="right" width={80}>
                  Actions
                </TableCell>
              ) : null}
            </TableRow>
          </TableHead>

          <TableBody sx={bodySx}>
            {loading && !skeleton ? (
              <TableRow>
                <TableCell colSpan={totalColumns}>
                  <AppLoader
                    size="small"
                    center
                    sx={{
                      minHeight: 160,
                    }}
                  />
                </TableCell>
              </TableRow>
            ) : null}

            {!loading && rows.length === 0 ? (
              <AppEmptyTable
                asTableRow
                colSpan={totalColumns}
                title={emptyTitle}
                description={emptyDescription}
                variant={emptyVariant}
                actionLabel={emptyActionLabel}
                onAction={onEmptyAction}
                bordered={false}
                surface={false}
                sx={{
                  border: "none",
                }}
              />
            ) : null}

            {!loading &&
              rows.map((row, rowIndex) => {
                const rowId = getRowId(row);
                const selected = selectedIds.includes(rowId);

                return (
                  <TableRow
                    key={rowId}
                    hover={hover}
                    selected={selected}
                    sx={{
                      backgroundColor: selected
                        ? "var(--color-primary-soft)"
                        : "transparent",
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                      ...rowSx,
                    }}
                  >
                    {selectable ? (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected}
                          onChange={handleSelectRow(row)}
                        />
                      </TableCell>
                    ) : null}

                    {visibleColumns.map((column) => {
                      const value = row[column.key];

                      return (
                        <TableCell
                          key={column.id || column.key}
                          align={column.align || "left"}
                          sx={{
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                            whiteSpace: column.noWrap ? "nowrap" : "normal",
                            ...cellSx,
                            ...column.cellSx,
                          }}
                        >
                          {column.render
                            ? column.render(value, row, rowIndex)
                            : (value ?? "-")}
                        </TableCell>
                      );
                    })}

                    {showRowActions ? (
                      <TableCell align="right">
                        <AppRowActions
                          row={row}
                          onView={onView}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onDuplicate={onDuplicate}
                          {...rowActionsProps}
                        />
                      </TableCell>
                    ) : null}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AppTable;
