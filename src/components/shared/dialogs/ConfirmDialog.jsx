import React from "react";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

import {
  AppDialog,
  AppAlert,
  AppStack,
  AppText,
  AppButton,
  AppLoadingButton,
} from "@/components";

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
  const severityIconMap = {
    warning: <WarningAmberRoundedIcon />,
    error: <DeleteOutlineRoundedIcon />,
    info: <InfoOutlinedIcon />,
    success: <CheckCircleOutlineRoundedIcon />,
  };

  const confirmColorMap = {
    warning: "warning",
    error: "error",
    info: "info",
    success: "success",
  };

  const handleClose = () => {
    if (loading) return;
    onClose?.();
  };

  const handleConfirm = async (event) => {
    if (disabled || loading) return;
    await onConfirm?.(event);
  };

  return (
    <AppDialog
      open={open}
      onClose={handleClose}
      title={title}
      maxWidth={maxWidth}
      fullWidth
      showClose={!loading}
      closeOnBackdrop={closeOnBackdrop && !loading}
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
      <AppStack spacing={2}>
        {description ? (
          <AppText
            sx={{
              color: "var(--color-text-muted)",
              lineHeight: 1.6,
              fontSize: "0.9rem",
            }}
          >
            {description}
          </AppText>
        ) : null}

        {showAlert && (alertTitle || alertMessage) ? (
          <AppAlert
            severity={severity}
            variant={variant}
            dense
            icon={severityIconMap[severity] || severityIconMap.warning}
            title={alertTitle}
          >
            {alertMessage}
          </AppAlert>
        ) : null}

        {children}

        <AppStack
          direction="row"
          justify="flex-end"
          align="center"
          spacing={1}
          sx={{
            pt: 1,
          }}
        >
          <AppButton
            variant="outlined"
            colorVariant="dark"
            onClick={handleClose}
            disabled={loading}
            {...cancelButtonProps}
          >
            {cancelText}
          </AppButton>

          <AppLoadingButton
            variant="contained"
            colorVariant={confirmColorMap[severity] || "primary"}
            loading={loading}
            loadingText="Please wait..."
            onClick={handleConfirm}
            disabled={disabled}
            {...confirmButtonProps}
          >
            {confirmText}
          </AppLoadingButton>
        </AppStack>
      </AppStack>
    </AppDialog>
  );
};

export default ConfirmDialog;
