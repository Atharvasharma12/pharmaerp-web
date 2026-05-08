// src/components/shared/forms/AppFormErrorSummary.jsx

import React from "react";
import { Box, Typography } from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import { AppAlert, AppFieldHint } from "@/components";

const AppFormErrorSummary = ({
  errors = {},
  title = "Please fix the following errors",
  message,
  visible = true,
  showIcon = true,
  closable = false,
  onClose,
  maxErrors,
  fieldLabels = {},
  variant = "soft",
  severity = "error",
  dense = false,
  sx = {},
  listSx = {},
  itemSx = {},
}) => {
  const errorList = Object.entries(errors || {})
    .map(([fieldName, error]) => {
      const text =
        typeof error === "string" ? error : error?.message || error?.text || "";

      if (!text) return null;

      return {
        fieldName,
        label: fieldLabels[fieldName] || fieldName,
        text,
      };
    })
    .filter(Boolean);

  const visibleErrors =
    typeof maxErrors === "number" ? errorList.slice(0, maxErrors) : errorList;

  const hiddenCount = errorList.length - visibleErrors.length;

  if (!visible || errorList.length === 0) {
    return null;
  }

  return (
    <AppAlert
      title={title}
      severity={severity}
      variant={variant}
      dense={dense}
      showIcon={showIcon}
      closable={closable}
      onClose={onClose}
      icon={<ErrorOutlineRoundedIcon />}
      sx={sx}
    >
      {message ? (
        <AppFieldHint
          sx={{
            mt: 0,
            mb: visibleErrors.length ? 0.75 : 0,
          }}
        >
          {message}
        </AppFieldHint>
      ) : null}

      <Box
        component="ul"
        sx={{
          m: 0,
          pl: 2.25,
          display: "flex",
          flexDirection: "column",
          gap: 0.35,
          ...listSx,
        }}
      >
        {visibleErrors.map((item) => (
          <Box
            component="li"
            key={item.fieldName}
            sx={{
              color: "var(--app-color-text-muted)",
              fontSize: "0.82rem",
              lineHeight: 1.45,
              ...itemSx,
            }}
          >
            <Typography
              component="span"
              sx={{
                color: "var(--app-color-text)",
                fontSize: "inherit",
                fontWeight: 700,
              }}
            >
              {item.label}:
            </Typography>{" "}
            {item.text}
          </Box>
        ))}

        {hiddenCount > 0 ? (
          <Box
            component="li"
            sx={{
              color: "var(--app-color-text-muted)",
              fontSize: "0.82rem",
              lineHeight: 1.45,
              ...itemSx,
            }}
          >
            +{hiddenCount} more error{hiddenCount > 1 ? "s" : ""}
          </Box>
        ) : null}
      </Box>
    </AppAlert>
  );
};

export default AppFormErrorSummary;
