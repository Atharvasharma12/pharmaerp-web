import React from "react";
import { Box, Typography } from "@mui/material";

import { AppDrawer, AppButton } from "@/components";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppSidePanel = ({
  open = false,
  onClose,

  title,
  subtitle,
  children,

  anchor = "right",
  width = 480,

  showHeader = true,
  showClose = true,
  closeOnBackdrop = true,

  showFooter = true,
  footer,

  primaryActionLabel = "Save",
  secondaryActionLabel = "Cancel",
  onPrimaryAction,
  onSecondaryAction,

  primaryLoading = false,
  primaryDisabled = false,
  secondaryDisabled = false,

  primaryActionProps = {},
  secondaryActionProps = {},

  contentPadding = 2.5,
  stickyFooter = true,

  bodySx = {},
  footerSx = {},
  paperSx = {},

  ...props
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const handleSecondaryAction = (event) => {
    if (onSecondaryAction) {
      onSecondaryAction(event);
      return;
    }

    onClose?.(event, "secondaryClick");
  };

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      anchor={anchor}
      width={width}
      showHeader={showHeader}
      showClose={showClose}
      closeOnBackdrop={closeOnBackdrop}
      showFooter={showFooter}
      paperSx={{
        maxWidth: "100%",
        ...paperSx,
      }}
      bodySx={{
        px: contentPadding,
        py: contentPadding,
        backgroundColor: t.bg,
        ...bodySx,
      }}
      footerSx={{
        position: stickyFooter ? "sticky" : "static",
        bottom: 0,
        zIndex: 1,
        backgroundColor: t.surface,
        ...footerSx,
      }}
      footer={
        footer || (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AppButton
              variant="outlined"
              colorVariant="dark"
              onClick={handleSecondaryAction}
              disabled={secondaryDisabled || primaryLoading}
              {...secondaryActionProps}
            >
              {secondaryActionLabel}
            </AppButton>

            <AppButton
              variant="contained"
              colorVariant="primary"
              onClick={onPrimaryAction}
              loading={primaryLoading}
              disabled={primaryDisabled}
              {...primaryActionProps}
            >
              {primaryActionLabel}
            </AppButton>
          </Box>
        )
      }
      {...props}
    >
      {children ? (
        children
      ) : (
        <Box
          sx={{
            border: `1px dashed ${t.border}`,
            borderRadius: "14px",
            p: 2,
            backgroundColor: t.surface,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.86rem",
              fontWeight: 600,
              color: t.textMuted,
            }}
          >
            No content added.
          </Typography>
        </Box>
      )}
    </AppDrawer>
  );
};

export default AppSidePanel;
