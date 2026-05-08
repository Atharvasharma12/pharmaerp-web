import React from "react";
import {
  AppCard,
  AppStack,
  AppButton,
  AppText,
  AppTooltip,
} from "@/components";

const WorkflowActions = ({
  actions = [],
  align = "right",
  direction = "row",
  size = "small",
  variant = "card", // card | inline
  loading = false,
  disabled = false,
  title,
  description,
  sx = {},
}) => {
  const content = (
    <AppStack spacing={1.5} sx={sx}>
      {(title || description) && (
        <AppStack spacing={0.5}>
          {title && <AppText weight={800}>{title}</AppText>}
          {description && (
            <AppText color="var(--color-text-muted)">{description}</AppText>
          )}
        </AppStack>
      )}

      <AppStack
        direction={direction}
        spacing={1}
        align="center"
        justify={
          align === "left"
            ? "flex-start"
            : align === "center"
              ? "center"
              : "flex-end"
        }
        wrap="wrap"
      >
        {actions.map((action, index) => {
          const button = (
            <AppButton
              key={action.id || action.label || index}
              variant={action.variant || "contained"}
              colorVariant={action.colorVariant || "primary"}
              size={action.size || size}
              loading={action.loading || loading}
              disabled={disabled || action.disabled}
              startIcon={action.startIcon}
              endIcon={action.endIcon}
              onClick={action.onClick}
              sx={action.sx}
            >
              {action.label}
            </AppButton>
          );

          return action.tooltip ? (
            <AppTooltip
              key={action.id || action.label || index}
              title={action.tooltip}
            >
              <span>{button}</span>
            </AppTooltip>
          ) : (
            button
          );
        })}
      </AppStack>
    </AppStack>
  );

  if (variant === "inline") {
    return content;
  }

  return (
    <AppCard variant="soft" padding="md" rounded="lg" shadow="none" bordered>
      {content}
    </AppCard>
  );
};

export default WorkflowActions;
