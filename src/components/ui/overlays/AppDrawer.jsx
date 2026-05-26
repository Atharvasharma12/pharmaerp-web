import React from "react";
import { Box, Drawer, Typography, Divider } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";
import { AppButton, AppIconButton } from "@/components";

const AppDrawer = ({
  open = false,
  onClose,

  title,
  subtitle,
  children,

  anchor = "right", // left | right | top | bottom
  width = 420,
  height = "auto",

  showHeader = true,
  showClose = true,
  closeOnBackdrop = true,

  footer,
  showFooter = false,
  primaryActionLabel = "Save",
  secondaryActionLabel = "Cancel",
  onPrimaryAction,
  onSecondaryAction,
  primaryActionProps = {},
  secondaryActionProps = {},
  primaryLoading = false,
  primaryDisabled = false,

  headerSx = {},
  bodySx = {},
  footerSx = {},
  paperSx = {},
  titleSx = {},
  subtitleSx = {},

  ...props
}) => {
  const { mode, theme, colorTheme } = useTheme();

  const activeMode = mode || theme;
  const t = getThemeTokens(activeMode, colorTheme);

  const isHorizontal = anchor === "left" || anchor === "right";

  const handleClose = (event, reason) => {
    if (!closeOnBackdrop && reason === "backdropClick") return;
    onClose?.(event, reason);
  };

  return (
    <Drawer
      open={open}
      anchor={anchor}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            width: isHorizontal ? { xs: "100%", sm: width } : "100%",
            height: isHorizontal ? "100%" : height,
            maxHeight: isHorizontal ? "100%" : "90vh",
            backgroundColor: t.surface,
            color: t.text,
            backgroundImage: "none",
            borderLeft: anchor === "right" ? `1px solid ${t.border}` : "none",
            borderRight: anchor === "left" ? `1px solid ${t.border}` : "none",
            borderTop: anchor === "bottom" ? `1px solid ${t.border}` : "none",
            borderBottom: anchor === "top" ? `1px solid ${t.border}` : "none",
            boxShadow: t.shadowXl,
            ...paperSx,
          },
        },
      }}
      {...props}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {showHeader && (
          <>
            <Box
              sx={{
                px: 2.5,
                py: 2,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 2,
                ...headerSx,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                {title && (
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: t.text,
                      lineHeight: 1.3,
                      ...titleSx,
                    }}
                  >
                    {title}
                  </Typography>
                )}

                {subtitle && (
                  <Typography
                    sx={{
                      mt: 0.4,
                      fontSize: "0.82rem",
                      color: t.textMuted,
                      lineHeight: 1.45,
                      ...subtitleSx,
                    }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>

              {showClose && (
                <AppIconButton
                  icon={<CloseRoundedIcon />}
                  variant="text"
                  colorVariant="dark"
                  size="small"
                  rounded="full"
                  tooltip="Close"
                  onClick={handleClose}
                />
              )}
            </Box>

            <Divider sx={{ borderColor: t.border }} />
          </>
        )}

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            px: 2.5,
            py: 2,
            ...bodySx,
          }}
        >
          {children}
        </Box>

        {(showFooter || footer) && (
          <>
            <Divider sx={{ borderColor: t.border }} />

            <Box
              sx={{
                px: 2.5,
                py: 1.6,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 1,
                backgroundColor: t.surface,
                ...footerSx,
              }}
            >
              {footer || (
                <>
                  <AppButton
                    variant="outlined"
                    colorVariant="dark"
                    onClick={onSecondaryAction || handleClose}
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
                </>
              )}
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default AppDrawer;
