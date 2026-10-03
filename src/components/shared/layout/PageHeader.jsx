import React from "react";

import {
  AppBox,
  AppStack,
  AppHeading,
  AppText,
  AppBreadcrumb,
} from "@/components";

const PageHeader = ({
  title,
  subtitle,

  breadcrumbItems = [],

  actions,
  extra,

  align = "flex-start",
  justify = "space-between",

  stacked = false,

  divider = false,

  sx = {},
  contentSx = {},
}) => {
  return (
    <AppBox
      sx={{
        width: "100%",
        pb: divider ? 2 : 0,
        borderBottom: divider ? "1px solid var(--color-border)" : "none",
        ...sx,
      }}
    >
      <AppStack
        direction={stacked ? "column" : "row"}
        align={stacked ? "stretch" : align}
        justify={justify}
        spacing={2}
        fullWidth
      >
        <AppBox
          sx={{
            flex: 1,
            minWidth: 0,
            ...contentSx,
          }}
        >
          {breadcrumbItems?.length > 0 && (
            <AppBreadcrumb
              items={breadcrumbItems}
              size="small"
              sx={{
                mb: 1,
              }}
            />
          )}

          {title && (
            <AppHeading
              level={4}
              weight={800}
              sx={{
                lineHeight: 1.15,
              }}
            >
              {title}
            </AppHeading>
          )}

          {subtitle && (
            <AppText
              color="var(--color-text-muted)"
              sx={{
                mt: 0.75,
                maxWidth: 900,
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </AppText>
          )}

          {extra && (
            <AppBox
              sx={{
                mt: 1.5,
              }}
            >
              {extra}
            </AppBox>
          )}
        </AppBox>

        {actions && (
          <AppBox
            sx={{
              flexShrink: 0,
              display: "flex",
              alignItems: stacked ? "stretch" : "flex-start",
              justifyContent: "flex-end",
            }}
          >
            {actions}
          </AppBox>
        )}
      </AppStack>
    </AppBox>
  );
};

export default PageHeader;
