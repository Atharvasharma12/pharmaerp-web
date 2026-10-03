import React from "react";

import {
  AppBox,
  AppStack,
  AppText,
  AppHeading,
  AppDescriptionList,
  AppSkeleton,
} from "@/components";

const DescriptionList = ({
  title,
  description,
  items = [],

  columns = 2,
  loading = false,
  skeletonCount = 6,

  variant = "default", // default | card | minimal
  size = "medium",

  bordered = false,
  striped = false,
  dense = false,

  emptyText = "No details available.",

  sx = {},
  headerSx = {},
  listSx = {},
  itemSx = {},
  ...props
}) => {
  const renderLoading = () => (
    <AppBox
      sx={{
        display: "grid",
        gridTemplateColumns:
          typeof columns === "number"
            ? `repeat(${columns}, minmax(0, 1fr))`
            : columns,
        gap: dense ? 1.25 : 2,
      }}
    >
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <AppStack key={index} spacing={0.7}>
          <AppSkeleton width="42%" height={15} />
          <AppSkeleton width="78%" height={22} />
        </AppStack>
      ))}
    </AppBox>
  );

  const renderContent = () => {
    if (loading) return renderLoading();

    if (!items?.length) {
      return <AppText color="var(--color-text-muted)">{emptyText}</AppText>;
    }

    return (
      <AppDescriptionList
        items={items}
        columns={columns}
        variant={variant === "card" ? "card" : "default"}
        size={size}
        bordered={bordered}
        striped={striped}
        dense={dense}
        sx={listSx}
        itemSx={itemSx}
      />
    );
  };

  if (variant === "minimal") {
    return (
      <AppBox sx={sx} {...props}>
        {(title || description) && (
          <AppBox sx={{ mb: 2, ...headerSx }}>
            {title && (
              <AppHeading level={6} weight={700}>
                {title}
              </AppHeading>
            )}

            {description && (
              <AppText
                color="var(--color-text-muted)"
                sx={{ mt: 0.4, fontSize: "0.84rem" }}
              >
                {description}
              </AppText>
            )}
          </AppBox>
        )}

        {renderContent()}
      </AppBox>
    );
  }

  return (
    <AppBox
      surface
      bordered
      rounded
      p={variant === "card" ? 0 : 2}
      sx={sx}
      {...props}
    >
      {(title || description) && (
        <AppBox sx={{ mb: 2, px: variant === "card" ? 0 : 0, ...headerSx }}>
          {title && (
            <AppHeading level={6} weight={700}>
              {title}
            </AppHeading>
          )}

          {description && (
            <AppText
              color="var(--color-text-muted)"
              sx={{ mt: 0.4, fontSize: "0.84rem" }}
            >
              {description}
            </AppText>
          )}
        </AppBox>
      )}

      {renderContent()}
    </AppBox>
  );
};

export default DescriptionList;
