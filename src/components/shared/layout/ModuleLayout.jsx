import React from "react";

import { AppBox, AppStack, AppStickyBar, PageContainer } from "@/components";

import PageHeader from "./PageHeader";

const ModuleLayout = ({
  children,

  title,
  subtitle,

  breadcrumbItems = [],

  headerActions,
  headerExtra,

  toolbar,

  stickyHeader = false,
  stickyToolbar = false,

  maxWidth = "xl",

  spacing = 3,

  contentSx = {},
  sx = {},
}) => {
  return (
    <PageContainer
      maxWidth={maxWidth}
      sx={{
        ...sx,
      }}
    >
      <AppStack spacing={spacing} fullWidth>
        {stickyHeader ? (
          <AppStickyBar
            position="top"
            variant="transparent"
            blur
            elevation={false}
            divider={false}
            contentSx={{
              px: 0,
              py: 0,
            }}
          >
            <PageHeader
              title={title}
              subtitle={subtitle}
              breadcrumbItems={breadcrumbItems}
              actions={headerActions}
              extra={headerExtra}
            />
          </AppStickyBar>
        ) : (
          <PageHeader
            title={title}
            subtitle={subtitle}
            breadcrumbItems={breadcrumbItems}
            actions={headerActions}
            extra={headerExtra}
          />
        )}

        {toolbar ? (
          stickyToolbar ? (
            <AppStickyBar
              position="top"
              variant="transparent"
              blur
              elevation={false}
              offsetTop={8}
              contentSx={{
                px: 0,
                py: 0,
              }}
            >
              {toolbar}
            </AppStickyBar>
          ) : (
            toolbar
          )
        ) : null}

        <AppBox
          sx={{
            width: "100%",
            minWidth: 0,
            ...contentSx,
          }}
        >
          {children}
        </AppBox>
      </AppStack>
    </PageContainer>
  );
};

export default ModuleLayout;
