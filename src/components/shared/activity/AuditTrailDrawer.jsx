import React from "react";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import {
  AppDrawer,
  AppStack,
  AppBox,
  AppText,
  AppBadge,
  AppButton,
  AppEmptyState,
  AppInlineLoader,
  ActivityFeed,
  AuditLog,
  ChangeHistory,
} from "@/components";

const AuditTrailDrawer = ({
  open = false,
  onClose,

  title = "Audit Trail",
  subtitle = "View activity, audit logs, and field changes.",

  mode = "activity", // activity | audit | changes

  activities = [],
  auditRows = [],
  changes = [],

  loading = false,

  width = 560,

  showExport = true,
  onExport,

  sx = {},
}) => {
  const totalCount =
    mode === "audit"
      ? auditRows.length
      : mode === "changes"
        ? changes.length
        : activities.length;

  const renderContent = () => {
    if (loading) {
      return (
        <AppBox
          bordered
          rounded
          sx={{
            py: 5,
            backgroundColor: "var(--color-surface-alt)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <AppInlineLoader text="Loading audit trail..." />
        </AppBox>
      );
    }

    if (mode === "audit") {
      return (
        <AuditLog
          title=""
          rows={auditRows}
          showHeader={false}
          maxHeight="calc(100vh - 220px)"
          sx={{
            border: "none",
            boxShadow: "none",
          }}
        />
      );
    }

    if (mode === "changes") {
      return (
        <ChangeHistory
          title=""
          changes={changes}
          showHeader={false}
          sx={{
            border: "none",
            boxShadow: "none",
          }}
        />
      );
    }

    if (activities.length === 0) {
      return (
        <AppEmptyState
          title="No activity found"
          description="Activity will appear here when users make changes."
          icon={<HistoryRoundedIcon />}
          size="medium"
          fullHeight={false}
          sx={{
            minHeight: 260,
            border: "1px dashed var(--color-border)",
            borderRadius: "16px",
            backgroundColor: "var(--color-surface-alt)",
          }}
        />
      );
    }

    return (
      <ActivityFeed
        title=""
        items={activities}
        showHeader={false}
        itemVariant="inline"
        sx={{
          border: "none",
          boxShadow: "none",
        }}
      />
    );
  };

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      width={width}
      bodySx={sx}
      footer={
        <AppStack direction="row" spacing={1} justify="space-between" fullWidth>
          <AppBadge
            label={`${totalCount} record${totalCount === 1 ? "" : "s"}`}
            size="small"
            variant="soft"
            colorVariant="primary"
          />

          {showExport && (
            <AppButton
              variant="outlined"
              colorVariant="primary"
              size="small"
              startIcon={<DownloadRoundedIcon />}
              onClick={onExport}
            >
              Export
            </AppButton>
          )}
        </AppStack>
      }
    >
      <AppStack spacing={2}>
        <AppStack direction="row" spacing={1} align="center" wrap="wrap">
          <AppBadge
            label={
              mode === "audit"
                ? "Audit Log"
                : mode === "changes"
                  ? "Changes"
                  : "Activity"
            }
            colorVariant="primary"
            variant="soft"
          />

          <AppText color="var(--color-text-muted)">
            Latest system and user activity.
          </AppText>
        </AppStack>

        {renderContent()}
      </AppStack>
    </AppDrawer>
  );
};

export default AuditTrailDrawer;
