import React from "react";
import { Box, Typography } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

import { AppDialog, AppButton, AppLoadingButton } from "@/components";
import { useTheme } from "@/contexts/ThemeContext";
import { getThemeTokens } from "@/theme/getThemeTokens";

const AppConfirmModal = ({
  open = false,
  onClose,
  onConfirm,
  onCancel,

  title = "Are you sure?",
  message = "This action cannot be undone.",
  description,

  variant = "warning", // warning | error | info | success
  icon,
  showIcon = true,

  confirmLabel = "Confirm",
  cancelLabel = "Cancel",

  loading = false,
  confirmDisabled = false,
  cancelDisabled = false,

  closeOnBackdrop = false,
  maxWidth = "xs",
  fullWidth = true,

  contentSx = {},
  iconSx = {},
  messageSx = {},
  descriptionSx = {},
  cancelProps = {},
  confirmProps = {},

  ...props
}) => {
  const { theme } = useTheme();
  const t = getThemeTokens(theme);

  const variantMap = {
    warning: {
      color: t.warning,
      soft: t.warningSoft,
      icon: <WarningAmberRoundedIcon />,
      confirmColor: "warning",
    },
    error: {
      color: t.error,
      soft: t.errorSoft,
      icon: <DeleteOutlineRoundedIcon />,
      confirmColor: "error",
    },
    info: {
      color: t.info,
      soft: t.infoSoft,
      icon: <InfoOutlinedIcon />,
      confirmColor: "info",
    },
    success: {
      color: t.success,
      soft: t.successSoft,
      icon: <CheckCircleOutlineRoundedIcon />,
      confirmColor: "success",
    },
  };

  const active = variantMap[variant] || variantMap.warning;

  const handleCancel = (event) => {
    onCancel?.(event);
    onClose?.(event, "cancelClick");
  };

  const handleConfirm = (event) => {
    onConfirm?.(event);
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      closeOnBackdrop={closeOnBackdrop}
      showActions
      showClose={!loading}
      actions={
        <>
          <AppButton
            variant="outlined"
            colorVariant="dark"
            onClick={handleCancel}
            disabled={cancelDisabled || loading}
            {...cancelProps}
          >
            {cancelLabel}
          </AppButton>

          <AppLoadingButton
            variant="contained"
            colorVariant={active.confirmColor}
            loading={loading}
            loadingText={confirmLabel}
            onClick={handleConfirm}
            disabled={confirmDisabled || loading}
            {...confirmProps}
          >
            {confirmLabel}
          </AppLoadingButton>
        </>
      }
      {...props}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          ...contentSx,
        }}
      >
        {showIcon ? (
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "14px",
              backgroundColor: active.soft,
              color: active.color,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              "& svg": {
                fontSize: 24,
              },
              ...iconSx,
            }}
          >
            {icon || active.icon}
          </Box>
        ) : null}

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: t.text,
              lineHeight: 1.5,
              ...messageSx,
            }}
          >
            {message}
          </Typography>

          {description ? (
            <Typography
              sx={{
                mt: 0.65,
                fontSize: "0.82rem",
                fontWeight: 500,
                color: t.textMuted,
                lineHeight: 1.5,
                ...descriptionSx,
              }}
            >
              {description}
            </Typography>
          ) : null}
        </Box>
      </Box>
    </AppDialog>
  );
};

export default AppConfirmModal;
