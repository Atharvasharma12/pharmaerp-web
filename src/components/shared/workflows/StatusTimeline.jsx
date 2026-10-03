import React from "react";
import {
  AppCard,
  AppTimeline,
  AppHeading,
  AppText,
  AppStack,
  AppStatusBadge,
} from "@/components";

const StatusTimeline = ({
  title = "Status Timeline",
  description,

  status = "processing",

  items = [],

  timelineSize = "medium",
  colorVariant = "primary",

  showStatus = true,
  showHeader = true,

  emptyTitle = "No timeline available",
  emptyDescription = "Status updates will appear here.",

  sx = {},
}) => {
  const hasItems = items.length > 0;

  return (
    <AppCard
      variant="default"
      padding="lg"
      rounded="xl"
      shadow="sm"
      bordered
      sx={sx}
    >
      <AppStack spacing={3}>
        {showHeader && (
          <AppStack
            direction="row"
            justify="space-between"
            align="flex-start"
            spacing={2}
          >
            <AppStack spacing={0.5}>
              <AppHeading level={6}>{title}</AppHeading>

              {description && (
                <AppText color="var(--color-text-muted)">{description}</AppText>
              )}
            </AppStack>

            {showStatus && (
              <AppStatusBadge status={status} size="small" showIcon />
            )}
          </AppStack>
        )}

        {hasItems ? (
          <AppTimeline
            items={items}
            size={timelineSize}
            colorVariant={colorVariant}
            showAvatar
            showConnector
          />
        ) : (
          <AppStack
            align="center"
            justify="center"
            spacing={1}
            sx={{
              py: 5,
              textAlign: "center",
            }}
          >
            <AppHeading
              level={6}
              sx={{
                fontSize: "0.95rem",
              }}
            >
              {emptyTitle}
            </AppHeading>

            <AppText
              color="var(--color-text-muted)"
              sx={{
                maxWidth: 420,
              }}
            >
              {emptyDescription}
            </AppText>
          </AppStack>
        )}
      </AppStack>
    </AppCard>
  );
};

export default StatusTimeline;
