// src/components/shared/forms/AppFormActions.jsx

import React from "react";

import { AppButton, AppFormRow } from "@/components";

const AppFormActions = ({
  submitText = "Submit",
  cancelText = "Cancel",
  resetText = "Reset",

  onSubmit,
  onCancel,
  onReset,

  showSubmit = true,
  showCancel = false,
  showReset = false,

  submitLoading = false,
  cancelLoading = false,
  resetLoading = false,

  submitDisabled = false,
  cancelDisabled = false,
  resetDisabled = false,

  align = "right", // left | center | right | space-between
  direction = "row", // row | column
  fullWidth = false,
  sticky = false,

  submitProps = {},
  cancelProps = {},
  resetProps = {},

  children,
  sx = {},
}) => {
  const justifyMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
    "space-between": "space-between",
  };

  return (
    <AppFormRow
      gap={1.25}
      align={direction === "column" ? "stretch" : "center"}
      justify={justifyMap[align] || justifyMap.right}
      wrap={direction !== "column"}
      sx={{
        flexDirection: direction,
        alignItems: direction === "column" ? "stretch" : "center",

        ...(sticky && {
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          py: 1.5,
          backgroundColor: "var(--app-color-bg)",
          borderTop: "1px solid var(--app-color-border)",
        }),

        ...sx,
      }}
    >
      {children}

      {showReset ? (
        <AppButton
          type="button"
          variant="outlined"
          colorVariant="dark"
          fullWidth={fullWidth || direction === "column"}
          loading={resetLoading}
          disabled={resetDisabled}
          onClick={onReset}
          {...resetProps}
        >
          {resetText}
        </AppButton>
      ) : null}

      {showCancel ? (
        <AppButton
          type="button"
          variant="text"
          colorVariant="dark"
          fullWidth={fullWidth || direction === "column"}
          loading={cancelLoading}
          disabled={cancelDisabled}
          onClick={onCancel}
          {...cancelProps}
        >
          {cancelText}
        </AppButton>
      ) : null}

      {showSubmit ? (
        <AppButton
          type="submit"
          variant="contained"
          colorVariant="primary"
          fullWidth={fullWidth || direction === "column"}
          loading={submitLoading}
          disabled={submitDisabled}
          onClick={onSubmit}
          {...submitProps}
        >
          {submitText}
        </AppButton>
      ) : null}
    </AppFormRow>
  );
};

export default AppFormActions;
