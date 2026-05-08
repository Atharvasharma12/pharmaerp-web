import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";
import { AppButton, AppIconButton } from "@/components";

const AppDialog = ({
  open = false,
  onClose,

  title,
  subtitle,
  children,

  maxWidth = "sm", // xs | sm | md | lg | xl | false
  fullWidth = true,
  fullScreen = false,

  showHeader = true,
  showClose = true,
  closeOnBackdrop = true,

  showActions = false,
  actions,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  onCancel,
  onConfirm,
  confirmLoading = false,
  confirmDisabled = false,
  cancelProps = {},
  confirmProps = {},

  headerSx = {},
  contentSx = {},
  actionsSx = {},
  paperSx = {},
  titleSx = {},
  subtitleSx = {},

  ...props
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const handleClose = (event, reason) => {
    if (!closeOnBackdrop && reason === "backdropClick") return;
    onClose?.(event, reason);
  };

  const handleCancel = (event) => {
    onCancel?.(event);
    if (!onCancel) {
      handleClose(event, "cancelClick");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      fullScreen={fullScreen}
      slotProps={{
        paper: {
          sx: {
            borderRadius: fullScreen ? 0 : "18px",
            backgroundColor: t.surface,
            color: t.text,
            backgroundImage: "none",
            border: fullScreen ? "none" : `1px solid ${t.border}`,
            boxShadow: t.shadowXl,
            overflow: "hidden",
            ...paperSx,
          },
        },
        backdrop: {
          sx: {
            backgroundColor: t.overlay,
          },
        },
      }}
      {...props}
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

      <DialogContent
        sx={{
          px: 2.5,
          py: 2,
          color: t.text,
          backgroundColor: t.surface,
          ...contentSx,
        }}
      >
        {children}
      </DialogContent>

      {(showActions || actions) && (
        <>
          <Divider sx={{ borderColor: t.border }} />

          <DialogActions
            sx={{
              px: 2.5,
              py: 1.6,
              gap: 1,
              backgroundColor: t.surface,
              ...actionsSx,
            }}
          >
            {actions || (
              <>
                <AppButton
                  variant="outlined"
                  colorVariant="dark"
                  onClick={handleCancel}
                  {...cancelProps}
                >
                  {cancelLabel}
                </AppButton>

                <AppButton
                  variant="contained"
                  colorVariant="primary"
                  onClick={onConfirm}
                  loading={confirmLoading}
                  disabled={confirmDisabled}
                  {...confirmProps}
                >
                  {confirmLabel}
                </AppButton>
              </>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default AppDialog;
