import React from "react";
import {
  AppCard,
  AppStack,
  AppGrid,
  AppHeading,
  AppText,
  AppStatusBadge,
  AppAvatar,
  AppTimeline,
  AppButton,
} from "@/components";

const ApprovalFlow = ({
  title = "Approval Flow",
  description,
  status = "pending",

  requester,
  approvers = [],
  steps = [],

  primaryAction,
  secondaryAction,

  showRequester = true,
  showApprovers = true,
  showTimeline = true,

  loading = false,
  emptyText = "No approval steps available.",

  sx = {},
}) => {
  const hasSteps = steps.length > 0;
  const hasApprovers = approvers.length > 0;

  return (
    <AppCard
      title={title}
      subtitle={description}
      variant="default"
      padding="lg"
      rounded="xl"
      shadow="sm"
      bordered
      sx={sx}
    >
      <AppStack spacing={3}>
        <AppStack direction="row" justify="space-between" align="center">
          <AppStatusBadge status={status} showIcon />

          <AppStack direction="row" spacing={1}>
            {secondaryAction && (
              <AppButton
                variant="outlined"
                colorVariant={secondaryAction.colorVariant || "dark"}
                size="small"
                loading={secondaryAction.loading}
                disabled={secondaryAction.disabled || loading}
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </AppButton>
            )}

            {primaryAction && (
              <AppButton
                variant="contained"
                colorVariant={primaryAction.colorVariant || "primary"}
                size="small"
                loading={primaryAction.loading}
                disabled={primaryAction.disabled || loading}
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </AppButton>
            )}
          </AppStack>
        </AppStack>

        {(showRequester || showApprovers) && (
          <AppGrid xs={1} md={2} gap={2}>
            {showRequester && requester && (
              <AppStack surface bordered rounded spacing={1.5} sx={{ p: 2 }}>
                <AppText color="var(--color-text-muted)" weight={700}>
                  Requested By
                </AppText>

                <AppAvatar
                  src={requester.avatar}
                  name={requester.name}
                  subtitle={requester.role}
                  showName
                  size="small"
                />
              </AppStack>
            )}

            {showApprovers && (
              <AppStack surface bordered rounded spacing={1.5} sx={{ p: 2 }}>
                <AppText color="var(--color-text-muted)" weight={700}>
                  Approvers
                </AppText>

                {hasApprovers ? (
                  <AppStack spacing={1}>
                    {approvers.map((approver, index) => (
                      <AppStack
                        key={approver.id || index}
                        direction="row"
                        align="center"
                        justify="space-between"
                        spacing={1}
                      >
                        <AppAvatar
                          src={approver.avatar}
                          name={approver.name}
                          subtitle={approver.role}
                          showName
                          size="small"
                        />

                        <AppStatusBadge
                          status={approver.status || "pending"}
                          size="small"
                        />
                      </AppStack>
                    ))}
                  </AppStack>
                ) : (
                  <AppText color="var(--color-text-muted)">
                    No approvers assigned.
                  </AppText>
                )}
              </AppStack>
            )}
          </AppGrid>
        )}

        {showTimeline && (
          <AppStack spacing={1.5}>
            <AppHeading level={6}>Approval Timeline</AppHeading>

            {hasSteps ? (
              <AppTimeline items={steps} showAvatar colorVariant="primary" />
            ) : (
              <AppText color="var(--color-text-muted)">{emptyText}</AppText>
            )}
          </AppStack>
        )}
      </AppStack>
    </AppCard>
  );
};

export default ApprovalFlow;
