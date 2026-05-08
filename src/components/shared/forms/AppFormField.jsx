// src/components/shared/forms/AppFormField.jsx

import React from "react";
import { Box, Typography } from "@mui/material";

import {
  AppInput,
  AppTextarea,
  AppSelect,
  AppMultiSelect,
  AppCheckbox,
  AppRadio,
  AppSwitch,
  AppDatePicker,
  AppFileUpload,
  AppRequiredMark,
  AppFieldHint,
} from "@/components";

const AppFormField = ({
  type = "input", // input | textarea | select | multiselect | checkbox | radio | switch | date | file | custom

  name,
  label,
  value,
  defaultValue,
  checked,
  defaultChecked,
  onChange,

  error,
  errors = {},
  helperText,

  required = false,
  disabled = false,
  readOnly = false,
  fullWidth = true,

  component,
  children,

  wrapperSx = {},
  labelSx = {},
  fieldSx = {},
  hintSx = {},

  ...props
}) => {
  const fieldError = error || errors?.[name];

  const errorText =
    typeof fieldError === "string"
      ? fieldError
      : fieldError?.message || fieldError?.text || "";

  const finalHelperText = errorText || helperText;

  const commonProps = {
    name,
    label,
    value,
    defaultValue,
    onChange,
    required,
    disabled,
    readOnly,
    fullWidth,
    error: Boolean(fieldError),
    errorText,
    helperText: finalHelperText,
    sx: fieldSx,
    ...props,
  };

  const choiceProps = {
    ...props,
    name,
    label,
    value,
    checked,
    defaultChecked,
    onChange,
    required,
    disabled,
    readOnly,
    error: Boolean(fieldError),
    helperText: finalHelperText,
    fullWidth,
    sx: fieldSx,
  };

  const renderField = () => {
    if (type === "custom") {
      return component || children;
    }

    if (type === "textarea") {
      return <AppTextarea {...commonProps} />;
    }

    if (type === "select") {
      return <AppSelect {...commonProps} />;
    }

    if (type === "multiselect") {
      return <AppMultiSelect {...commonProps} value={value || []} />;
    }

    if (type === "checkbox") {
      return <AppCheckbox {...choiceProps} />;
    }

    if (type === "radio") {
      return <AppRadio {...choiceProps} />;
    }

    if (type === "switch") {
      return <AppSwitch {...choiceProps} />;
    }

    if (type === "date") {
      return <AppDatePicker {...commonProps} />;
    }

    if (type === "file") {
      return <AppFileUpload {...commonProps} />;
    }

    return <AppInput {...commonProps} />;
  };

  return (
    <Box
      sx={{
        width: fullWidth ? "100%" : "auto",
        minWidth: 0,
        opacity: disabled ? 0.72 : 1,
        ...wrapperSx,
      }}
    >
      {type === "custom" && label ? (
        <Typography
          sx={{
            mb: 0.75,
            color: fieldError
              ? "var(--app-color-error)"
              : "var(--app-color-text)",
            fontSize: "0.88rem",
            fontWeight: 600,
            lineHeight: 1.35,
            ...labelSx,
          }}
        >
          {label}
          {required ? <AppRequiredMark /> : null}
        </Typography>
      ) : null}

      {renderField()}

      {type === "custom" && finalHelperText ? (
        <AppFieldHint
          color={
            fieldError
              ? "var(--app-color-error)"
              : "var(--app-color-text-muted)"
          }
          sx={hintSx}
        >
          {finalHelperText}
        </AppFieldHint>
      ) : null}
    </Box>
  );
};

export default AppFormField;
