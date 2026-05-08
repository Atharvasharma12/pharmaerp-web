import React from "react";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

import {
  AppCard,
  AppStack,
  AppBox,
  AppHeading,
  AppText,
  AppBadge,
  AppEmptyState,
  AppInlineLoader,
  AuditTrailItem,
} from "@/components";

const ActivityFeed = ({
  title = "Activity Feed",
  description,

  items = [],

  loading = false,
  loadingText = "Loading activity...",

  emptyTitle = "No activity yet",
  emptyDescription = "Recent activity will appear here.",

  showHeader = true,
  showCount = true,

  compact = false,
  maxHeight,
  scrollable = false,

  itemVariant = "inline", // inline | card

  sx = {},
}) => {
  const hasItems = items.length > 0;

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
                label={`${items.length} item${items.length === 1 ? "" : "s"}`}
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

        {!loading && !hasItems && (
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

        {!loading && hasItems && (
          <AppStack
            spacing={1.2}
            sx={{
              maxHeight,
              overflowY: scrollable ? "auto" : undefined,
              pr: scrollable ? 0.5 : 0,
            }}
          >
            {items.map((item, index) => (
              <AuditTrailItem
                key={item.id || index}
                item={item}
                compact={compact}
                variant={itemVariant}
              />
            ))}
          </AppStack>
        )}
      </AppStack>
    </AppCard>
  );
};

export default ActivityFeed;
