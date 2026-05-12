import React from "react";

import {
  AppSection,
  AppStack,
  AppGrid,
  AppText,
  AppHeading,
  AppButton,
  AppIconButton,
  AppDescriptionList,
  AppAccordion,
  AppSkeleton,
  AppBox,
} from "@/components";

const DetailsSection = ({
  title,
  description,
  items = [],

  columns = {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
  },

  loading = false,

  variant = "default", // default | accordion | compact
  size = "medium",

  bordered = true,
  surface = true,
  rounded = true,
  divider = false,

  collapsible = false,
  defaultExpanded = true,

  action,
  actions = [],

  emptyText = "No details available.",

  contentSx = {},
  sx = {},
  ...props
}) => {
  const renderActions = () => {
    if (!actions?.length && !action) return null;

    return (
      <AppStack direction="row" align="center" gap={1} wrap="wrap">
        {actions.map((item, index) => {
          if (item.iconOnly) {
            return (
              <AppIconButton
                key={item.key || index}
                icon={item.icon}
                tooltip={item.tooltip}
                variant={item.variant || "soft"}
                colorVariant={item.colorVariant || "primary"}
                size={item.size || "small"}
                onClick={item.onClick}
              />
            );
          }

          return (
            <AppButton
              key={item.key || index}
              variant={item.variant || "contained"}
              colorVariant={item.colorVariant || "primary"}
              size={item.size || "small"}
              startIcon={item.startIcon}
              endIcon={item.endIcon}
              onClick={item.onClick}
            >
              {item.label}
            </AppButton>
          );
        })}

        {action}
      </AppStack>
    );
  };

  const renderLoading = () => {
    return (
      <AppGrid
        xs={columns.xs}
        sm={columns.sm}
        md={columns.md}
        lg={columns.lg}
        gap={2}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <AppStack key={index} spacing={0.7}>
            <AppSkeleton width="40%" height={16} />
            <AppSkeleton width="80%" height={24} />
          </AppStack>
        ))}
      </AppGrid>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderLoading();
    }

    if (!items?.length) {
      return <AppText color="var(--color-text-muted)">{emptyText}</AppText>;
    }

    if (variant === "accordion") {
      return (
        <AppAccordion
          defaultExpanded={defaultExpanded}
          items={items.map((item, index) => ({
            key: item.key || index,
            title: item.title || item.label,
            description: item.description,
            badge: item.badge,
            badgeColor: item.badgeColor,
            icon: item.icon,
            content: item.content || (
              <AppDescriptionList
                items={item.items || []}
                columns={1}
                size={size}
              />
            ),
          }))}
        />
      );
    }

    return (
      <AppDescriptionList
        items={items}
        columns={{
          xs: columns.xs,
          sm: columns.sm,
          md: columns.md,
          lg: columns.lg,
        }}
        size={size}
        bordered={variant !== "compact"}
      />
    );
  };

  if (collapsible) {
    return (
      <AppAccordion
        defaultExpanded={defaultExpanded}
        items={[
          {
            title,
            description,
            badge: items?.length ? `${items.length}` : undefined,
            content: <AppBox sx={contentSx}>{renderContent()}</AppBox>,
          },
        ]}
        sx={sx}
        {...props}
      />
    );
  }

  return (
    <AppSection
      title={title}
      description={description}
      action={renderActions()}
      bordered={bordered}
      surface={surface}
      rounded={rounded}
      divider={divider}
      sx={sx}
      contentSx={contentSx}
      {...props}
    >
      {renderContent()}
    </AppSection>
  );
};

export default DetailsSection;
