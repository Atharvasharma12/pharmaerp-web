import React from "react";
import {
  AppCard,
  AppStepper,
  AppHeading,
  AppText,
  AppStack,
  AppStatusBadge,
  AppAvatar,
  AppGrid,
} from "@/components";

const ApprovalStepper = ({
  title = "Approval Progress",
  description,

  steps = [],
  activeStep = 0,

  approvers = [],

  orientation = "horizontal",
  size = "medium",

  clickable = false,
  onStepClick,

  showApprovers = true,
  showHeader = true,
  showStepStatus = true,

  currentStatus = "pending",

  sx = {},
}) => {
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

            {showStepStatus && (
              <AppStatusBadge status={currentStatus} size="small" showIcon />
            )}
          </AppStack>
        )}

        <AppStepper
          steps={steps}
          activeStep={activeStep}
          orientation={orientation}
          size={size}
          clickable={clickable}
          onStepClick={onStepClick}
          showDescription
        />

        {showApprovers && approvers.length > 0 && (
          <AppStack spacing={1.5}>
            <AppHeading
              level={6}
              sx={{
                fontSize: "0.9rem",
              }}
            >
              Approvers
            </AppHeading>

            <AppGrid xs={1} sm={2} md={2} lg={3} gap={1.5}>
              {approvers.map((approver, index) => (
                <AppStack
                  key={approver.id || index}
                  direction="row"
                  align="center"
                  justify="space-between"
                  spacing={1}
                  surface
                  bordered
                  rounded
                  sx={{
                    p: 1.5,
                  }}
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
            </AppGrid>
          </AppStack>
        )}
      </AppStack>
    </AppCard>
  );
};

export default ApprovalStepper;
