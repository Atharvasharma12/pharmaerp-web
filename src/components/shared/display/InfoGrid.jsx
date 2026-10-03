import React from "react";

import {
  AppGrid,
  AppCard,
  AppStack,
  AppText,
  AppHeading,
  AppBadge,
  AppStatusBadge,
  AppAvatar,
  AppTooltip,
  AppSkeleton,
  AppBox,
  AppIconButton,
} from "@/components";

const InfoGrid = ({
  items = [],

  columns = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
  },

  loading = false,
  skeletonCount = 6,

  variant = "default", // default | compact | bordered
  size = "medium",

  cardVariant = "default",
  hoverable = true,
  bordered = true,
  rounded = "lg",
  shadow = "sm",

  onItemClick,

  emptyText = "No information available.",

  sx = {},
  cardSx = {},
  ...props
}) => {
  const renderSkeletons = () => {
    return Array.from({ length: skeletonCount }).map((_, index) => (
      <AppCard
        key={index}
        variant={cardVariant}
        rounded={rounded}
        shadow={shadow}
        bordered={bordered}
        padding="md"
      >
        <AppStack spacing={1.5}>
          <AppStack direction="row" justify="space-between" align="center">
            <AppSkeleton width="40%" height={16} />
            <AppSkeleton variant="circular" width={34} height={34} />
          </AppStack>

          <AppSkeleton width="75%" height={26} />

          <AppSkeleton width={["90%", "65%"]} count={2} height={14} />
        </AppStack>
      </AppCard>
    ));
  };

  if (!loading && !items?.length) {
    return (
      <AppBox
        bordered
        rounded
        surface
        p={3}
        sx={{
          textAlign: "center",
        }}
      >
        <AppText color="var(--color-text-muted)">{emptyText}</AppText>
      </AppBox>
    );
  }

  return (
    <AppGrid
      xs={columns.xs}
      sm={columns.sm}
      md={columns.md}
      lg={columns.lg}
      gap={2}
      sx={sx}
      {...props}
    >
      {loading
        ? renderSkeletons()
        : items.map((item, index) => {
            const clickable = Boolean(item.onClick || onItemClick);

            return (
              <AppCard
                key={item.key || item.id || index}
                variant={item.cardVariant || cardVariant}
                bordered={item.bordered ?? bordered}
                rounded={item.rounded || rounded}
                shadow={item.shadow || shadow}
                hoverable={item.hoverable ?? hoverable}
                clickable={clickable}
                padding={variant === "compact" ? "sm" : "md"}
                onClick={() => {
                  item.onClick?.(item, index);
                  onItemClick?.(item, index);
                }}
                sx={{
                  height: "100%",
                  ...cardSx,
                  ...item.sx,
                }}
              >
                <AppStack spacing={variant === "compact" ? 1 : 1.5}>
                  {/* Header */}
                  {(item.title || item.icon || item.avatar || item.action) && (
                    <AppStack
                      direction="row"
                      justify="space-between"
                      align="flex-start"
                      gap={1}
                    >
                      <AppStack
                        direction="row"
                        align="center"
                        gap={1}
                        sx={{ minWidth: 0 }}
                      >
                        {item.avatar ? (
                          <AppAvatar
                            {...item.avatar}
                            size={item.avatar.size || "small"}
                          />
                        ) : item.icon ? (
                          <AppBox
                            sx={{
                              width: 38,
                              height: 38,
                              minWidth: 38,
                              borderRadius: "12px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: `var(--color-${
                                item.colorVariant || "primary"
                              }-soft)`,
                              color: `var(--color-${
                                item.colorVariant || "primary"
                              })`,
                              "& svg": {
                                fontSize: 20,
                              },
                            }}
                          >
                            {item.icon}
                          </AppBox>
                        ) : null}

                        <AppBox sx={{ minWidth: 0 }}>
                          {item.title ? (
                            <AppHeading
                              level={6}
                              weight={700}
                              sx={{
                                fontSize: "0.92rem",
                                lineHeight: 1.3,
                              }}
                            >
                              {item.title}
                            </AppHeading>
                          ) : null}

                          {item.subtitle ? (
                            <AppText
                              color="var(--color-text-muted)"
                              sx={{
                                fontSize: "0.78rem",
                                mt: 0.2,
                              }}
                            >
                              {item.subtitle}
                            </AppText>
                          ) : null}
                        </AppBox>
                      </AppStack>

                      {item.action ? (
                        <AppTooltip title={item.action.tooltip || ""}>
                          <AppIconButton
                            icon={item.action.icon}
                            size="small"
                            variant={item.action.variant || "soft"}
                            colorVariant={item.action.colorVariant || "primary"}
                            onClick={(event) => {
                              event.stopPropagation();
                              item.action.onClick?.(item, index);
                            }}
                          />
                        </AppTooltip>
                      ) : null}
                    </AppStack>
                  )}

                  {/* Main Value */}
                  {item.value !== undefined ? (
                    <AppHeading
                      level={4}
                      weight={800}
                      sx={{
                        fontSize:
                          variant === "compact"
                            ? "1.35rem"
                            : {
                                xs: "1.45rem",
                                sm: "1.6rem",
                              },
                        lineHeight: 1.15,
                      }}
                    >
                      {item.value}
                    </AppHeading>
                  ) : null}

                  {/* Description */}
                  {item.description ? (
                    <AppText
                      color="var(--color-text-muted)"
                      sx={{
                        fontSize: size === "small" ? "0.78rem" : "0.84rem",
                        lineHeight: 1.55,
                      }}
                    >
                      {item.description}
                    </AppText>
                  ) : null}

                  {/* Footer */}
                  {(item.badge || item.status || item.footer || item.meta) && (
                    <AppStack
                      direction="row"
                      justify="space-between"
                      align="center"
                      gap={1}
                      wrap="wrap"
                      sx={{ mt: "auto" }}
                    >
                      <AppStack
                        direction="row"
                        align="center"
                        gap={1}
                        wrap="wrap"
                      >
                        {item.badge ? (
                          <AppBadge
                            label={item.badge}
                            size="small"
                            variant="soft"
                            colorVariant={item.badgeColor || "primary"}
                          />
                        ) : null}

                        {item.status ? (
                          <AppStatusBadge
                            status={item.status}
                            size="small"
                            showDot
                          />
                        ) : null}
                      </AppStack>

                      {item.footer || item.meta ? (
                        <AppText
                          color="var(--color-text-muted)"
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          {item.footer || item.meta}
                        </AppText>
                      ) : null}
                    </AppStack>
                  )}
                </AppStack>
              </AppCard>
            );
          })}
    </AppGrid>
  );
};

export default InfoGrid;
