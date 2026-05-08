import React, { useState } from "react";
import { Box } from "@mui/material";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import { AppButton, AppIconButton, AppDialog, FilterBar } from "@/components";

const FilterDialog = ({
  filters = [],
  values = {},
  onChange,
  onReset,
  onApply,

  title = "Filters",
  subtitle = "Apply filters to refine table data.",

  trigger,
  triggerText = "Filters",
  triggerTooltip = "Open filters",

  open: controlledOpen,
  onOpen,
  onClose,

  applyText = "Apply",
  resetText = "Reset",
  cancelText = "Cancel",

  disabled = false,
  loading = false,

  size = "small",
  maxWidth = "sm",

  showSearch = true,
  searchKey = "search",
  searchPlaceholder = "Search...",

  showReset = true,

  triggerVariant = "button", // button | icon
}) => {
  const isControlled = typeof controlledOpen === "boolean";
  const [internalOpen, setInternalOpen] = useState(false);
  const [draftValues, setDraftValues] = useState(values);

  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpen = () => {
    if (disabled) return;

    setDraftValues(values);

    if (!isControlled) {
      setInternalOpen(true);
    }

    onOpen?.();
  };

  const handleClose = () => {
    if (!isControlled) {
      setInternalOpen(false);
    }

    onClose?.();
  };

  const handleDraftChange = (nextValues) => {
    setDraftValues(nextValues);
  };

  const handleReset = () => {
    const resetValues = {};

    filters.forEach((filter) => {
      if (
        filter.type === "multiSelect" ||
        filter.type === "multiselect" ||
        filter.type === "multi"
      ) {
        resetValues[filter.key] = [];
      } else if (filter.type === "switch") {
        resetValues[filter.key] = false;
      } else if (filter.type === "date") {
        resetValues[filter.key] = null;
      } else {
        resetValues[filter.key] = "";
      }
    });

    if (showSearch) {
      resetValues[searchKey] = "";
    }

    setDraftValues(resetValues);
    onReset?.(resetValues);
  };

  const handleApply = () => {
    onChange?.(draftValues);
    onApply?.(draftValues);
    handleClose();
  };

  const cancelButtonSx = {
    backgroundColor: "var(--app-color-surface-alt)",
    color: "var(--app-color-text)",
    border: "1px solid var(--app-color-border-strong)",

    "&:hover": {
      backgroundColor: "var(--app-color-surface-hover)",
      borderColor: "var(--app-color-primary)",
      color: "var(--app-color-text)",
    },
  };

  return (
    <>
      {trigger ? (
        React.cloneElement(trigger, {
          onClick: handleOpen,
          disabled,
        })
      ) : triggerVariant === "icon" ? (
        <AppIconButton
          icon={<FilterAltRoundedIcon />}
          variant="soft"
          colorVariant="primary"
          rounded="full"
          tooltip={triggerTooltip}
          onClick={handleOpen}
          disabled={disabled}
        />
      ) : (
        <AppButton
          variant="soft"
          colorVariant="primary"
          startIcon={<FilterAltRoundedIcon />}
          onClick={handleOpen}
          disabled={disabled}
        >
          {triggerText}
        </AppButton>
      )}

      <AppDialog
        open={open}
        onClose={handleClose}
        title={title}
        subtitle={subtitle}
        maxWidth={maxWidth}
        fullWidth
        showActions={false}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FilterBar
            filters={filters}
            values={draftValues}
            onChange={handleDraftChange}
            onReset={handleReset}
            showSearch={showSearch}
            searchKey={searchKey}
            searchPlaceholder={searchPlaceholder}
            showReset={false}
            disabled={disabled}
            loading={loading}
            size={size}
            direction="column"
            sx={{
              gap: 1.5,
              "& .MuiFormControl-root": {
                width: "100%",
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              pt: 1,
            }}
          >
            {showReset ? (
              <AppButton
                variant="text"
                colorVariant="dark"
                startIcon={<RestartAltRoundedIcon />}
                onClick={handleReset}
                disabled={disabled || loading}
                sx={{
                  color: "var(--app-color-text-muted)",
                  "&:hover": {
                    color: "var(--app-color-text)",
                    backgroundColor: "var(--app-color-surface-hover)",
                  },
                }}
              >
                {resetText}
              </AppButton>
            ) : (
              <Box />
            )}

            <Box sx={{ display: "flex", gap: 1 }}>
              <AppButton
                variant="soft"
                colorVariant="dark"
                onClick={handleClose}
                disabled={loading}
                sx={cancelButtonSx}
              >
                {cancelText}
              </AppButton>

              <AppButton
                variant="contained"
                colorVariant="primary"
                startIcon={<FilterAltRoundedIcon />}
                onClick={handleApply}
                loading={loading}
                disabled={disabled}
              >
                {applyText}
              </AppButton>
            </Box>
          </Box>
        </Box>
      </AppDialog>
    </>
  );
};

export default FilterDialog;
