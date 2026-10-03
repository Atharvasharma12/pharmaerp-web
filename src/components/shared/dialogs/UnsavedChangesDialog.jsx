import React from "react";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import {
  AppDialog,
  AppAlert,
  AppStack,
  AppBox,
  AppText,
  AppHeading,
  AppButton,
  AppLoadingButton,
} from "@/components";

const UnsavedChangesDialog = ({
  open = false,
  onClose,

  onSave,
  onDiscard,
  onCancel,

  title = "Unsaved changes",
  description = "You have unsaved changes. Do you want to save before leaving?",

  warningTitle = "Changes may be lost",
  warningMessage = "If you leave without saving, your latest changes will be discarded.",

  saveText = "Save changes",
  discardText = "Discard",
  cancelText = "Cancel",

  saveLoading = false,
  discardLoading = false,

  saveDisabled = false,
  discardDisabled = false,

  showSave = true,
  showDiscard = true,
  showWarning = true,

  maxWidth = "xs",

  saveButtonProps = {},
  discardButtonProps = {},
  cancelButtonProps = {},

  sx = {},
}) => {
  const isLoading = saveLoading || discardLoading;

  const handleClose = () => {
    if (isLoading) return;
    onClose?.();
  };

  const handleCancel = () => {
    if (isLoading) return;

    if (onCancel) {
      onCancel();
      return;
    }

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
      subtitle="Confirm what should happen with your pending changes."
      closeOnBackdrop={!isLoading}
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
              backgroundColor: "var(--color-warning-soft)",
              color: "var(--color-warning)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningAmberRoundedIcon
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

        {showWarning ? (
          <AppAlert severity="warning" variant="soft" title={warningTitle}>
            {warningMessage}
          </AppAlert>
        ) : null}

        <AppStack
          direction={{ xs: "column", sm: "row" }}
          justify="flex-end"
          spacing={1.25}
          sx={{
            pt: 0.5,
          }}
        >
          <AppButton
            variant="outlined"
            colorVariant="dark"
            onClick={handleCancel}
            disabled={isLoading}
            {...cancelButtonProps}
          >
            {cancelText}
          </AppButton>

          {showDiscard ? (
            <AppLoadingButton
              variant="soft"
              colorVariant="error"
              loading={discardLoading}
              loadingText="Discarding..."
              startIcon={<LogoutRoundedIcon />}
              onClick={onDiscard}
              disabled={discardDisabled || saveLoading}
              {...discardButtonProps}
            >
              {discardText}
            </AppLoadingButton>
          ) : null}

          {showSave ? (
            <AppLoadingButton
              variant="contained"
              colorVariant="primary"
              loading={saveLoading}
              loadingText="Saving..."
              startIcon={<SaveRoundedIcon />}
              onClick={onSave}
              disabled={saveDisabled || discardLoading}
              {...saveButtonProps}
            >
              {saveText}
            </AppLoadingButton>
          ) : null}
        </AppStack>
      </AppStack>
    </AppDialog>
  );
};

export default UnsavedChangesDialog;
