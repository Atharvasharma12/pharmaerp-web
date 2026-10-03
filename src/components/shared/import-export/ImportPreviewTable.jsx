import React from "react";
import PreviewRoundedIcon from "@mui/icons-material/PreviewRounded";

import {
  AppCard,
  AppStack,
  AppHeading,
  AppText,
  AppAlert,
  AppTable,
  AppTablePagination,
  AppEmptyState,
  AppStatusBadge,
} from "@/components";

const ImportPreviewTable = ({
  title = "Import Preview",
  description = "Review imported records before confirming the import.",

  columns = [],
  rows = [],

  page = 1,
  pageSize = 10,
  totalItems,

  onPageChange,
  onPageSizeChange,

  loading = false,

  errors = [],
  warnings = [],

  selectable = false,
  selectedIds = [],
  onSelectRow,
  onSelectAll,

  showRowStatus = true,

  bordered = true,
  rounded = true,

  sx = {},
}) => {
  const safeRows = Array.isArray(rows) ? rows : [];

  const finalColumns = showRowStatus
    ? [
        {
          key: "__status",
          label: "Status",
          width: 120,
          render: (_, row) => (
            <AppStatusBadge
              status={row.status || "processing"}
              size="small"
              showIcon
              showDot={false}
            />
          ),
        },
        ...columns,
      ]
    : columns;

  return (
    <AppCard
      bordered={bordered}
      rounded={rounded ? "lg" : "md"}
      padding="md"
      fullHeight
      sx={sx}
    >
      <AppStack spacing={2}>
        <AppStack direction="row" align="center" justify="space-between">
          <AppStack spacing={0.4}>
            <AppHeading level={6}>{title}</AppHeading>

            <AppText
              sx={{
                color: "var(--color-text-muted)",
              }}
            >
              {description}
            </AppText>
          </AppStack>

          <PreviewRoundedIcon
            sx={{
              color: "var(--color-primary)",
            }}
          />
        </AppStack>

        {errors.length > 0 ? (
          <AppAlert
            severity="error"
            variant="soft"
            title={`${errors.length} Error${
              errors.length > 1 ? "s" : ""
            } Found`}
          >
            {errors[0]}
          </AppAlert>
        ) : null}

        {warnings.length > 0 ? (
          <AppAlert
            severity="warning"
            variant="soft"
            title={`${warnings.length} Warning${
              warnings.length > 1 ? "s" : ""
            }`}
          >
            {warnings[0]}
          </AppAlert>
        ) : null}

        {safeRows.length > 0 ? (
          <>
            <AppTable
              columns={finalColumns}
              rows={safeRows}
              loading={loading}
              selectable={selectable}
              selectedIds={selectedIds}
              onSelectRow={onSelectRow}
              onSelectAll={onSelectAll}
              bordered={false}
              stickyHeader
              maxHeight={420}
            />

            <AppTablePagination
              page={page}
              pageSize={pageSize}
              totalItems={totalItems || safeRows.length}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </>
        ) : (
          <AppEmptyState
            icon={<PreviewRoundedIcon fontSize="inherit" />}
            title="No preview data available"
            description="Upload a valid import file to preview records."
            size="medium"
          />
        )}
      </AppStack>
    </AppCard>
  );
};

export default ImportPreviewTable;
