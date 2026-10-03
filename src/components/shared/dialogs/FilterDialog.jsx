import React, { useEffect, useState } from "react";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";

import {
  AppButton,
  AppIconButton,
  AppDialog,
  AppStack,
  FilterBar,
} from "@/components";

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

  closeOnBackdrop = true,

  sx = {},
}) => {
  const isControlled = typeof controlledOpen === "boolean";

  const [internalOpen, setInternalOpen] = useState(false);
  const [draftValues, setDraftValues] = useState(values);

  const open = isControlled ? controlledOpen : internalOpen;

  useEffect(() => {
    if (open) {
      setDraftValues(values);
    }
  }, [open, values]);

  const handleOpen = () => {
    if (disabled) return;

    setDraftValues(values);

    if (!isControlled) {
      setInternalOpen(true);
    }

    onOpen?.();
  };

  const handleClose = () => {
    if (loading) return;

    if (!isControlled) {
      setInternalOpen(false);
    }

    onClose?.();
  };

  const handleDraftChange = (nextValues) => {
    setDraftValues(nextValues);
  };

  const getEmptyValueByType = (type) => {
    const normalizedType = String(type || "").toLowerCase();

    if (
      normalizedType === "multiselect" ||
      normalizedType === "multi-select" ||
      normalizedType === "multi"
    ) {
      return [];
    }

    if (normalizedType === "switch" || normalizedType === "checkbox") {
      return false;
    }

    if (
      normalizedType === "date" ||
      normalizedType === "daterange" ||
      normalizedType === "date-range"
    ) {
      return null;
    }

    return "";
  };

  const handleReset = () => {
    if (disabled || loading) return;

    const resetValues = {};

    filters.forEach((filter) => {
      resetValues[filter.key] = getEmptyValueByType(filter.type);
    });

    if (showSearch) {
      resetValues[searchKey] = "";
    }

    setDraftValues(resetValues);
    onReset?.(resetValues);
  };

  const handleApply = () => {
    if (disabled || loading) return;

    onChange?.(draftValues);
    onApply?.(draftValues);
    handleClose();
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
        showClose={!loading}
        closeOnBackdrop={closeOnBackdrop && !loading}
        showActions={false}
        paperSx={sx}
      >
        <AppStack spacing={2}>
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

          <AppStack
            direction="row"
            align="center"
            justify="space-between"
            spacing={1}
            sx={{
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
                  color: "var(--color-text-muted)",
                }}
              >
                {resetText}
              </AppButton>
            ) : (
              <span />
            )}

            <AppStack direction="row" spacing={1}>
              <AppButton
                variant="outlined"
                colorVariant="dark"
                onClick={handleClose}
                disabled={loading}
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
            </AppStack>
          </AppStack>
        </AppStack>
      </AppDialog>
    </>
  );
};

export default FilterDialog;
