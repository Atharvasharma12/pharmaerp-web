import React from "react";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import {
  AppDialog,
  AppAlert,
  AppStack,
  AppBox,
  AppText,
  AppHeading,
  AppButton,
  AppLoadingButton,
  AppBadge,
} from "@/components";

const DeleteConfirmDialog = ({
  open = false,
  onClose,
  onConfirm,

  title = "Delete item?",
  description = "Are you sure you want to delete this item? This action cannot be undone.",

  itemName,
  itemType = "record",

  confirmText = "Delete",
  cancelText = "Cancel",

  loading = false,
  disabled = false,

  severity = "error",

  showWarning = true,
  warningTitle = "Permanent action",
  warningMessage = "Deleted data cannot be recovered later.",

  showItemBadge = true,

  maxWidth = "xs",

  confirmButtonProps = {},
  cancelButtonProps = {},

  sx = {},
}) => {
  const handleClose = () => {
    if (loading) return;
    onClose?.();
  };

  return (
    <AppDialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth
      showActions={false}
      title={title}
      subtitle={`Confirm deletion of selected ${itemType}.`}
      paperSx={sx}
    >
      <AppStack spacing={2.5}>
        <AppStack direction="row" align="flex-start" spacing={1.5}>
          <AppBox
            sx={{
              width: 52,
              height: 52,
              minWidth: 52,
              borderRadius: "16px",
              backgroundColor: "var(--color-error-soft)",
              color: "var(--color-error)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DeleteOutlineRoundedIcon
              sx={{
                fontSize: 28,
              }}
            />
          </AppBox>

          <AppStack spacing={0.75}>
            <AppHeading level={6} weight={800}>
              {title}
            </AppHeading>

            <AppText
              sx={{
                color: "var(--color-text-muted)",
                lineHeight: 1.6,
              }}
            >
              {description}
            </AppText>
          </AppStack>
        </AppStack>

        {showItemBadge && itemName ? (
          <AppStack direction="row" align="center" spacing={1}>
            <AppText
              weight={700}
              sx={{
                fontSize: "0.84rem",
              }}
            >
              Selected:
            </AppText>

            <AppBadge
              label={itemName}
              colorVariant="error"
              variant="soft"
              size="medium"
            />
          </AppStack>
        ) : null}

        {showWarning ? (
          <AppAlert
            severity={severity}
            variant="soft"
            title={warningTitle}
            icon={<WarningAmberRoundedIcon />}
          >
            {warningMessage}
          </AppAlert>
        ) : null}

        <AppStack
          direction="row"
          justify="flex-end"
          spacing={1.25}
          sx={{
            pt: 0.5,
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
            colorVariant="error"
            loading={loading}
            loadingText="Deleting..."
            startIcon={<DeleteOutlineRoundedIcon />}
            onClick={onConfirm}
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

export default DeleteConfirmDialog;
