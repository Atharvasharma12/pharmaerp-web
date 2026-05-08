// src/components/shared/forms/AppFormSection.jsx

import React from "react";
import { Box, Divider, Typography } from "@mui/material";

import { AppCard, AppFormGrid, AppFormRow, AppFieldHint } from "@/components";

const AppFormSection = ({
  children,

  title,
  subtitle,
  description,
  icon,
  actions,

  variant = "default", // default | card | plain | soft
  columns = 1,
  gap = 2,
  spacing = 2,

  divider = false,
  bordered = true,
  padding = "md",
  rounded = "lg",
  shadow = "none",

  fullWidth = true,
  disabled = false,

  sx = {},
  headerSx = {},
  contentSx = {},
  titleSx = {},
  subtitleSx = {},
  descriptionSx = {},

  ...props
}) => {
  const hasHeader = title || subtitle || description || icon || actions;

  const getGridColumns = (value) => {
    if (typeof value === "object") return value;

    return {
      xs: 1,
      md: value >= 2 ? 2 : 1,
      lg: value,
    };
  };

  const getPadding = () => {
    if (padding === "sm") return 1.5;
    if (padding === "lg") return 3;
    return 2;
  };

  const headerNode = hasHeader ? (
    <AppFormRow
      align="flex-start"
      justify="space-between"
      gap={2}
      sx={{
        mb: children ? spacing : 0,
        opacity: disabled ? 0.72 : 1,
        ...headerSx,
      }}
    >
      <AppFormRow
        align="flex-start"
        gap={1.25}
        wrap={false}
        sx={{
          minWidth: 0,
          width: "auto",
        }}
      >
        {icon ? (
          <Box
            sx={{
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "12px",
              backgroundColor: "var(--app-color-primary-soft)",
              color: "var(--app-color-primary)",
              "& svg": {
                fontSize: 20,
              },
            }}
          >
            {icon}
          </Box>
        ) : null}

        <Box sx={{ minWidth: 0 }}>
          {title ? (
            <Typography
              sx={{
                color: disabled
                  ? "var(--app-color-text-disabled)"
                  : "var(--app-color-text)",
                fontSize: "1rem",
                fontWeight: 800,
                lineHeight: 1.25,
                ...titleSx,
              }}
            >
              {title}
            </Typography>
          ) : null}

          {subtitle ? (
            <AppFieldHint
              sx={{
                mt: 0.35,
                color: disabled
                  ? "var(--app-color-text-disabled)"
                  : "var(--app-color-text-muted)",
                fontSize: "0.88rem",
                fontWeight: 500,
                ...subtitleSx,
              }}
            >
              {subtitle}
            </AppFieldHint>
          ) : null}

          {description ? (
            <AppFieldHint
              sx={{
                mt: 0.5,
                color: disabled
                  ? "var(--app-color-text-disabled)"
                  : "var(--app-color-text-muted)",
                ...descriptionSx,
              }}
            >
              {description}
            </AppFieldHint>
          ) : null}
        </Box>
      </AppFormRow>

      {actions ? (
        <AppFormRow
          align="center"
          gap={1}
          sx={{
            width: "auto",
            flexShrink: 0,
          }}
        >
          {actions}
        </AppFormRow>
      ) : null}
    </AppFormRow>
  ) : null;

  const contentNode = (
    <>
      {headerNode}

      {divider && hasHeader && children ? (
        <Divider
          sx={{
            mb: spacing,
            borderColor: "var(--app-color-border)",
          }}
        />
      ) : null}

      {children ? (
        <AppFormGrid columns={getGridColumns(columns)} gap={gap} sx={contentSx}>
          {children}
        </AppFormGrid>
      ) : null}
    </>
  );

  if (variant === "card") {
    return (
      <AppCard
        variant="default"
        bordered={bordered}
        padding={padding}
        rounded={rounded}
        shadow={shadow}
        disabled={disabled}
        sx={{
          width: fullWidth ? "100%" : "auto",
          ...sx,
        }}
        {...props}
      >
        {contentNode}
      </AppCard>
    );
  }

  return (
    <Box
      sx={{
        width: fullWidth ? "100%" : "auto",
        minWidth: 0,
        opacity: disabled ? 0.72 : 1,

        border:
          variant === "soft" && bordered
            ? "1px solid var(--app-color-border)"
            : "1px solid transparent",

        backgroundColor:
          variant === "soft" ? "var(--app-color-surface-alt)" : "transparent",

        borderRadius: variant === "soft" ? "14px" : 0,
        p: variant === "soft" ? getPadding() : 0,

        ...sx,
      }}
      {...props}
    >
      {contentNode}
    </Box>
  );
};

export default AppFormSection;
