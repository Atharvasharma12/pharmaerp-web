import React from "react";
import {
  AppCard,
  AppTimeline,
  AppHeading,
  AppText,
  AppStack,
  AppButton,
} from "@/components";

const ApprovalHistory = ({
  title = "Approval History",
  description,

  items = [],

  emptyTitle = "No approval history",
  emptyDescription = "Workflow activity will appear here.",

  showHeader = true,
  showFooter = false,

  footerAction,

  timelineSize = "medium",

  loading = false,

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
          <AppStack spacing={0.5}>
            <AppHeading level={6}>{title}</AppHeading>

            {description && (
              <AppText color="var(--color-text-muted)">{description}</AppText>
            )}
          </AppStack>
        )}

        {hasItems ? (
          <AppTimeline
            items={items}
            size={timelineSize}
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

        {showFooter && footerAction && (
          <AppStack direction="row" justify="flex-end">
            <AppButton
              variant={footerAction.variant || "outlined"}
              colorVariant={footerAction.colorVariant || "primary"}
              size={footerAction.size || "small"}
              startIcon={footerAction.startIcon}
              endIcon={footerAction.endIcon}
              loading={footerAction.loading || loading}
              disabled={footerAction.disabled}
              onClick={footerAction.onClick}
            >
              {footerAction.label}
            </AppButton>
          </AppStack>
        )}
      </AppStack>
    </AppCard>
  );
};

export default ApprovalHistory;
