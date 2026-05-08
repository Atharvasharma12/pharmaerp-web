import React, { useMemo } from "react";
import { Box, Divider, Typography } from "@mui/material";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

import {
  AppTable,
  AppCard,
  AppCheckbox,
  AppRowActions,
  AppEmptyTable,
  AppTableSkeleton,
  AppLoader,
} from "@/components";

import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppResponsiveTable = ({
  columns = [],
  rows = [],
  getRowId = (row) => row.id,

  loading = false,
  skeleton = true,

  emptyTitle = "No data found",
  emptyDescription = "There are no records to display.",
  emptyVariant = "empty",

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

  mobileBreakpoint = "md", // xs | sm | md | lg
  mobileTitleKey,
  mobileSubtitleKey,
  mobileDescriptionKey,

  renderMobileTitle,
  renderMobileSubtitle,
  renderMobileDescription,
  renderMobileFooter,
  renderMobileCard,

  hideColumnsOnMobile = [],
  mobileVisibleColumnIds,

  dense = false,
  bordered = true,
  rounded = true,
  hover = true,
  stickyHeader = false,
  minWidth = 720,
  maxHeight,

  cardVariant = "default",
  cardPadding = "md",
  cardShadow = "sm",

  sx = {},
  tableSx = {},
  mobileSx = {},
  cardSx = {},
  fieldSx = {},
  labelSx = {},
  valueSx = {},

  tableProps = {},
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const rowIds = useMemo(() => rows.map(getRowId), [rows, getRowId]);

  const selectedCount = selectedIds.length;
  const allSelected = rows.length > 0 && selectedCount === rows.length;
  const partiallySelected = selectedCount > 0 && selectedCount < rows.length;

  const desktopDisplay = {
    xs: "none",
    [mobileBreakpoint]: "block",
  };

  const mobileDisplay = {
    xs: "block",
    [mobileBreakpoint]: "none",
  };

  const mobileColumns = useMemo(() => {
    return columns.filter((column) => {
      const columnId = column.id || column.key;

      if (mobileVisibleColumnIds?.length) {
        return mobileVisibleColumnIds.includes(columnId);
      }

      if (hideColumnsOnMobile.includes(columnId)) {
        return false;
      }

      if (column.hideOnMobile) {
        return false;
      }

      return true;
    });
  }, [columns, mobileVisibleColumnIds, hideColumnsOnMobile]);

  const handleSelectAll = (event) => {
    onSelectAll?.(event.target.checked ? rowIds : []);
  };

  const handleSelectRow = (row) => (event) => {
    const rowId = getRowId(row);
    onSelectRow?.(rowId, event.target.checked, row);
  };

  const getValue = (row, column, rowIndex) => {
    const value = row[column.key];

    if (column.renderMobile) {
      return column.renderMobile(value, row, rowIndex);
    }

    if (column.render) {
      return column.render(value, row, rowIndex);
    }

    return value ?? "-";
  };

  const getMobileTitle = (row, rowIndex) => {
    if (renderMobileTitle) return renderMobileTitle(row, rowIndex);
    if (mobileTitleKey) return row[mobileTitleKey];

    const firstColumn = columns[0];
    return firstColumn ? row[firstColumn.key] : `Row ${rowIndex + 1}`;
  };

  const getMobileSubtitle = (row, rowIndex) => {
    if (renderMobileSubtitle) return renderMobileSubtitle(row, rowIndex);
    if (mobileSubtitleKey) return row[mobileSubtitleKey];
    return null;
  };

  const getMobileDescription = (row, rowIndex) => {
    if (renderMobileDescription) return renderMobileDescription(row, rowIndex);
    if (mobileDescriptionKey) return row[mobileDescriptionKey];
    return null;
  };

  if (loading && skeleton) {
    return (
      <Box sx={{ width: "100%", ...sx }}>
        <Box sx={{ display: desktopDisplay }}>
          <AppTableSkeleton
            rows={6}
            columns={
              columns.length + (selectable ? 1 : 0) + (showRowActions ? 1 : 0)
            }
          />
        </Box>

        <Box
          sx={{
            display: mobileDisplay,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.25,
            }}
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <AppCard
                key={index}
                variant="default"
                padding="md"
                shadow="none"
                bordered
              >
                <AppLoader
                  size="small"
                  variant="pulse"
                  center
                  sx={{
                    minHeight: 80,
                  }}
                />
              </AppCard>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  if (!loading && rows.length === 0) {
    return (
      <AppEmptyTable
        title={emptyTitle}
        description={emptyDescription}
        variant={emptyVariant}
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
    >
      <Box sx={{ display: desktopDisplay, ...tableSx }}>
        <AppTable
          columns={columns}
          rows={rows}
          getRowId={getRowId}
          loading={loading}
          skeleton={false}
          selectable={selectable}
          selectedIds={selectedIds}
          onSelectRow={onSelectRow}
          onSelectAll={onSelectAll}
          showRowActions={showRowActions}
          rowActionsProps={rowActionsProps}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          dense={dense}
          bordered={bordered}
          rounded={rounded}
          hover={hover}
          stickyHeader={stickyHeader}
          minWidth={minWidth}
          maxHeight={maxHeight}
          emptyTitle={emptyTitle}
          emptyDescription={emptyDescription}
          {...tableProps}
        />
      </Box>

      <Box
        sx={{
          display: mobileDisplay,
          width: "100%",
          ...mobileSx,
        }}
      >
        {selectable ? (
          <Box
            sx={{
              mb: 1,
              px: 1,
              py: 0.85,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              border: bordered ? `1px solid ${t.border}` : "none",
              borderRadius: rounded ? "12px" : 0,
              backgroundColor: t.surface,
            }}
          >
            <AppCheckbox
              checked={allSelected}
              indeterminate={partiallySelected}
              onChange={handleSelectAll}
              disabled={loading || rows.length === 0}
              label="Select all"
              size="small"
            />

            <Typography
              sx={{
                color: t.textMuted,
                fontSize: "0.76rem",
                fontWeight: 700,
              }}
            >
              {selectedCount} selected
            </Typography>
          </Box>
        ) : null}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: dense ? 1 : 1.25,
          }}
        >
          {rows.map((row, rowIndex) => {
            const rowId = getRowId(row);
            const selected = selectedIds.includes(rowId);

            if (renderMobileCard) {
              return renderMobileCard(row, {
                rowIndex,
                rowId,
                selected,
                columns: mobileColumns,
              });
            }

            return (
              <AppCard
                key={rowId}
                variant={cardVariant}
                padding={cardPadding}
                shadow={cardShadow}
                bordered={bordered}
                hoverable={hover}
                sx={{
                  backgroundColor: selected ? t.primarySoft : t.surface,
                  borderColor: selected ? t.primary : t.border,
                  ...cardSx,
                }}
                header={
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        sx={{
                          color: t.text,
                          fontSize: "0.95rem",
                          fontWeight: 800,
                          lineHeight: 1.3,
                          wordBreak: "break-word",
                        }}
                      >
                        {getMobileTitle(row, rowIndex)}
                      </Typography>

                      {getMobileSubtitle(row, rowIndex) ? (
                        <Typography
                          sx={{
                            mt: 0.35,
                            color: t.textMuted,
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            lineHeight: 1.4,
                            wordBreak: "break-word",
                          }}
                        >
                          {getMobileSubtitle(row, rowIndex)}
                        </Typography>
                      ) : null}

                      {getMobileDescription(row, rowIndex) ? (
                        <Typography
                          sx={{
                            mt: 0.5,
                            color: t.textMuted,
                            fontSize: "0.78rem",
                            lineHeight: 1.5,
                            wordBreak: "break-word",
                          }}
                        >
                          {getMobileDescription(row, rowIndex)}
                        </Typography>
                      ) : null}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        flexShrink: 0,
                      }}
                    >
                      {selectable ? (
                        <AppCheckbox
                          checked={selected}
                          onChange={handleSelectRow(row)}
                          size="small"
                          checkboxSx={{ p: 0.4 }}
                        />
                      ) : null}

                      {showRowActions ? (
                        <AppRowActions
                          row={row}
                          onView={onView}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onDuplicate={onDuplicate}
                          triggerTooltip="Row actions"
                          triggerIcon={<MoreHorizRoundedIcon />}
                          {...rowActionsProps}
                        />
                      ) : null}
                    </Box>
                  </Box>
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: dense ? 0.75 : 1,
                  }}
                >
                  {mobileColumns.map((column, columnIndex) => {
                    const columnId = column.id || column.key;
                    const value = getValue(row, column, rowIndex);

                    return (
                      <Box key={columnId}>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "minmax(90px, 38%) 1fr",
                            gap: 1,
                            alignItems: "flex-start",
                            ...fieldSx,
                          }}
                        >
                          <Typography
                            sx={{
                              color: t.textMuted,
                              fontSize: "0.74rem",
                              fontWeight: 800,
                              lineHeight: 1.4,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              ...labelSx,
                              ...column.mobileLabelSx,
                            }}
                          >
                            {column.mobileLabel || column.label}
                          </Typography>

                          <Box
                            sx={{
                              minWidth: 0,
                              color: t.text,
                              fontSize: "0.84rem",
                              fontWeight: 600,
                              lineHeight: 1.45,
                              wordBreak: "break-word",
                              ...valueSx,
                              ...column.mobileValueSx,
                            }}
                          >
                            {value}
                          </Box>
                        </Box>

                        {columnIndex !== mobileColumns.length - 1 ? (
                          <Divider
                            sx={{
                              mt: dense ? 0.75 : 1,
                              borderColor: t.divider,
                            }}
                          />
                        ) : null}
                      </Box>
                    );
                  })}

                  {renderMobileFooter ? (
                    <Box sx={{ pt: 0.5 }}>
                      {renderMobileFooter(row, rowIndex)}
                    </Box>
                  ) : null}
                </Box>
              </AppCard>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default AppResponsiveTable;
