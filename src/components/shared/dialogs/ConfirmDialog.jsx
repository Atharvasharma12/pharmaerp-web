import React from "react";
import { Box, Typography } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";
import { AppDialog, AppButton, AppAlert } from "@/components";

const ConfirmDialog = ({
  open = false,
  onClose,
  onConfirm,

  title = "Are you sure?",
  description = "This action cannot be undone.",

  confirmText = "Confirm",
  cancelText = "Cancel",

  severity = "warning", // warning | error | info | success
  variant = "soft", // soft | outlined | filled

  loading = false,
  disabled = false,

  showAlert = true,
  alertTitle,
  alertMessage,

  maxWidth = "xs",
  closeOnBackdrop = false,

  confirmButtonProps = {},
  cancelButtonProps = {},

  children,
  sx = {},
  ...props
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const severityIconMap = {
    warning: <WarningAmberRoundedIcon />,
    error: <DeleteOutlineRoundedIcon />,
    info: <InfoOutlinedIcon />,
    success: <InfoOutlinedIcon />,
  };

  const handleConfirm = async (event) => {
    if (disabled || loading) return;
    await onConfirm?.(event);
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      fullWidth
      showClose={!loading}
      closeOnBackdrop={closeOnBackdrop}
      showActions={false}
      paperSx={{
        maxWidth: 420,
        ...sx,
      }}
      contentSx={{
        pt: 2,
      }}
      {...props}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {description && (
          <Typography
            sx={{
              fontSize: "0.9rem",
              lineHeight: 1.6,
              color: t.textMuted,
            }}
          >
            {description}
          </Typography>
        )}

        {showAlert && (alertTitle || alertMessage) && (
          <AppAlert
            severity={severity}
            variant={variant}
            dense
            icon={severityIconMap[severity]}
            title={alertTitle}
          >
            {alertMessage}
          </AppAlert>
        )}

        {children}

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1,
            pt: 1,
          }}
        >
          <AppButton
            variant="outlined"
            colorVariant="dark"
            onClick={onClose}
            disabled={loading}
            {...cancelButtonProps}
          >
            {cancelText}
          </AppButton>

          <AppButton
            variant="contained"
            colorVariant={severity === "error" ? "error" : severity}
            onClick={handleConfirm}
            loading={loading}
            disabled={disabled}
            {...confirmButtonProps}
          >
            {confirmText}
          </AppButton>
        </Box>
      </Box>
    </AppDialog>
  );
};

export default ConfirmDialog;
