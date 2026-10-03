// src/components/shared/forms/AppForm.jsx

import React from "react";
import { Box } from "@mui/material";

import { AppFormActions, AppFormErrorSummary, AppFormRow } from "@/components";

const AppForm = ({
  children,

  onSubmit,
  onReset,

  errors = {},
  fieldLabels = {},

  showErrorSummary = false,
  errorSummaryTitle = "Please fix the following errors",
  errorSummaryMessage,

  showActions = false,

  submitText = "Submit",
  cancelText = "Cancel",
  resetText = "Reset",

  onCancel,

  submitLoading = false,
  submitDisabled = false,
  cancelDisabled = false,
  resetDisabled = false,

  showCancel = false,
  showReset = false,

  actionsAlign = "right",
  actionsSticky = false,

  spacing = 2.5,
  noValidate = true,
  fullWidth = true,

  actionsProps = {},
  errorSummaryProps = {},

  sx = {},
  ...props
}) => {
  const hasErrors = Boolean(errors && Object.keys(errors).length);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (submitDisabled || submitLoading) return;

    onSubmit?.(event);
  };

  const handleReset = (event) => {
    onReset?.(event);
  };

  return (
    <Box
      component="form"
      noValidate={noValidate}
      onSubmit={handleSubmit}
      onReset={handleReset}
      sx={{
        width: fullWidth ? "100%" : "auto",
        minWidth: 0,
        ...sx,
      }}
      {...props}
    >
      <AppFormRow direction="column" gap={spacing} align="stretch" wrap={false}>
        {showErrorSummary && hasErrors ? (
          <AppFormErrorSummary
            errors={errors}
            fieldLabels={fieldLabels}
            title={errorSummaryTitle}
            message={errorSummaryMessage}
            {...errorSummaryProps}
          />
        ) : null}

        {children}

        {showActions ? (
          <AppFormActions
            submitText={submitText}
            cancelText={cancelText}
            resetText={resetText}
            onCancel={onCancel}
            submitLoading={submitLoading}
            submitDisabled={submitDisabled}
            cancelDisabled={cancelDisabled}
            resetDisabled={resetDisabled}
            showCancel={showCancel}
            showReset={showReset}
            align={actionsAlign}
            sticky={actionsSticky}
            {...actionsProps}
          />
        ) : null}
      </AppFormRow>
    </Box>
  );
};

export default AppForm;
