import React from "react";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

import {
  AppCard,
  AppStack,
  AppBox,
  AppHeading,
  AppText,
  AppBadge,
  AppTable,
  AppEmptyState,
  AppInlineLoader,
} from "@/components";

const AuditLog = ({
  title = "Audit Log",
  description,

  rows = [],
  columns,

  loading = false,
  loadingText = "Loading audit log...",

  showHeader = true,
  showCount = true,

  dense = true,
  maxHeight = 520,

  emptyTitle = "No audit records",
  emptyDescription = "System audit events will appear here.",

  sx = {},
}) => {
  const defaultColumns = [
    {
      key: "time",
      label: "Time",
      minWidth: 150,
      render: (value) => value || "-",
    },
    {
      key: "user",
      label: "User",
      minWidth: 160,
      render: (value) => value?.name || value || "-",
    },
    {
      key: "action",
      label: "Action",
      minWidth: 120,
      render: (value) => (
        <AppBadge
          label={value || "Activity"}
          size="small"
          variant="soft"
          colorVariant={
            value === "deleted" || value === "rejected"
              ? "error"
              : value === "created" || value === "approved"
                ? "success"
                : value === "updated"
                  ? "info"
                  : "neutral"
          }
        />
      ),
    },
    {
      key: "module",
      label: "Module",
      minWidth: 120,
      render: (value) => value || "-",
    },
    {
      key: "description",
      label: "Description",
      minWidth: 260,
      render: (value) => value || "-",
    },
    {
      key: "ipAddress",
      label: "IP Address",
      minWidth: 130,
      render: (value) => value || "-",
    },
  ];

  const hasRows = rows.length > 0;

  return (
    <AppCard
      variant="default"
      padding="lg"
      rounded="xl"
      shadow="none"
      bordered
      sx={sx}
    >
      <AppStack spacing={2}>
        {showHeader && (
          <AppStack
            direction="row"
            align="flex-start"
            justify="space-between"
            spacing={2}
          >
            <AppBox sx={{ minWidth: 0 }}>
              <AppHeading level={6}>{title}</AppHeading>

              {description && (
                <AppText color="var(--color-text-muted)" sx={{ mt: 0.4 }}>
                  {description}
                </AppText>
              )}
            </AppBox>

            {showCount && (
              <AppBadge
                label={`${rows.length} record${rows.length === 1 ? "" : "s"}`}
                size="small"
                variant="soft"
                colorVariant="primary"
              />
            )}
          </AppStack>
        )}

        {loading && (
          <AppBox
            bordered
            rounded
            sx={{
              py: 4,
              backgroundColor: "var(--color-surface-alt)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppInlineLoader text={loadingText} />
          </AppBox>
        )}

        {!loading && !hasRows && (
          <AppEmptyState
            title={emptyTitle}
            description={emptyDescription}
            icon={<HistoryRoundedIcon />}
            size="medium"
            fullHeight={false}
            sx={{
              minHeight: 220,
              border: "1px dashed var(--color-border)",
              borderRadius: "16px",
              backgroundColor: "var(--color-surface-alt)",
            }}
          />
        )}

        {!loading && hasRows && (
          <AppTable
            columns={columns || defaultColumns}
            rows={rows}
            dense={dense}
            maxHeight={maxHeight}
            stickyHeader
            bordered
            rounded
            getRowId={(row) => row.id}
          />
        )}
      </AppStack>
    </AppCard>
  );
};

export default AuditLog;
