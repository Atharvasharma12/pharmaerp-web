import React from "react";
import { Divider } from "@mui/material";

import {
  AppBox,
  AppStack,
  AppText,
  AppHeading,
  AppBadge,
  AppStatusBadge,
  AppKeyValue,
  AppSkeleton,
} from "@/components";

const KeyValueList = ({
  title,
  description,
  items = [],

  loading = false,
  skeletonCount = 5,

  variant = "default", // default | card | minimal
  size = "medium",
  direction = "row", // row | column

  bordered = true,
  surface = true,
  rounded = true,
  divider = true,
  dense = false,

  emptyText = "No data available.",

  sx = {},
  itemSx = {},
  headerSx = {},
  ...props
}) => {
  const renderLoading = () => (
    <AppStack spacing={dense ? 1 : 1.5}>
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <AppStack key={index} direction="row" justify="space-between" gap={2}>
          <AppSkeleton width="32%" height={16} />
          <AppSkeleton width="48%" height={18} />
        </AppStack>
      ))}
    </AppStack>
  );

  const content = loading ? (
    renderLoading()
  ) : items?.length ? (
    <AppStack
      spacing={0}
      divider={
        divider ? <Divider sx={{ borderColor: "var(--color-border)" }} /> : null
      }
    >
      {items.map((item, index) => (
        <AppBox
          key={item.key || item.label || index}
          sx={{
            py: dense ? 1 : 1.25,
            px: variant === "minimal" ? 0 : 0.25,
            ...itemSx,
            ...item.sx,
          }}
        >
          <AppStack
            direction={direction}
            align={direction === "row" ? "center" : "flex-start"}
            justify={direction === "row" ? "space-between" : "flex-start"}
            gap={direction === "row" ? 2 : 0.6}
          >
            <AppKeyValue
              label={item.label}
              value={item.value}
              icon={item.icon}
              badge={item.badge}
              badgeColor={item.badgeColor}
              direction={direction === "row" ? "row" : "column"}
              align={direction === "row" ? "space-between" : "start"}
              size={size}
              muted={item.muted}
              ellipsis={item.ellipsis ?? true}
              sx={{ flex: 1, minWidth: 0 }}
              {...item.props}
            />

            {item.status ? (
              <AppStatusBadge
                status={item.status}
                label={item.statusLabel}
                size="small"
                showDot
              />
            ) : null}

            {item.tag ? (
              <AppBadge
                label={item.tag}
                size="small"
                variant="soft"
                colorVariant={item.tagColor || "primary"}
              />
            ) : null}

            {item.action ? item.action : null}
          </AppStack>
        </AppBox>
      ))}
    </AppStack>
  ) : (
    <AppText color="var(--color-text-muted)">{emptyText}</AppText>
  );

  if (variant === "minimal") {
    return (
      <AppBox sx={sx} {...props}>
        {(title || description) && (
          <AppBox sx={{ mb: 2, ...headerSx }}>
            {title ? (
              <AppHeading level={6} weight={700}>
                {title}
              </AppHeading>
            ) : null}

            {description ? (
              <AppText
                color="var(--color-text-muted)"
                sx={{ mt: 0.4, fontSize: "0.84rem" }}
              >
                {description}
              </AppText>
            ) : null}
          </AppBox>
        )}

        {content}
      </AppBox>
    );
  }

  return (
    <AppBox
      surface={surface}
      bordered={bordered}
      rounded={rounded}
      p={variant === "card" ? 2.5 : 2}
      sx={sx}
      {...props}
    >
      {(title || description) && (
        <AppBox sx={{ mb: 2, ...headerSx }}>
          {title ? (
            <AppHeading level={6} weight={700}>
              {title}
            </AppHeading>
          ) : null}

          {description ? (
            <AppText
              color="var(--color-text-muted)"
              sx={{ mt: 0.4, fontSize: "0.84rem" }}
            >
              {description}
            </AppText>
          ) : null}
        </AppBox>
      )}

      {content}
    </AppBox>
  );
};

export default KeyValueList;
