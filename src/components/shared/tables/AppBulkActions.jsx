import React from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import {
  AppBox,
  AppStack,
  AppText,
  AppButton,
  AppDropdown,
  AppIconButton,
} from "@/components";

const AppBulkActions = ({
  selectedRows = [],
  selectedIds = [],
  selectedCount,

  actions = [],
  onClearSelection,

  label,
  clearTooltip = "Clear selection",

  dense = false,
  disabled = false,
  loading = false,

  showCount = true,
  showClear = true,

  triggerLabel = "Bulk actions",
  triggerVariant = "contained",
  triggerColorVariant = "primary",

  sx = {},
  ...props
}) => {
  const count = selectedCount ?? selectedIds.length ?? selectedRows.length;

  if (!count) return null;

  const menuItems = actions.map((action) => ({
    label: action.label,
    icon: action.icon,
    disabled: disabled || loading || action.disabled,
    danger: action.danger,
    onClick: () =>
      action.onClick?.({
        selectedRows,
        selectedIds,
        selectedCount: count,
      }),
  }));

  return (
    <AppBox
      surface
      bordered
      rounded
      sx={{
        px: dense ? 1 : 1.25,
        py: dense ? 0.65 : 0.85,
        display: "flex",
        alignItems: "center",
        gap: 1,
        ...sx,
      }}
      {...props}
    >
      <AppStack direction="row" align="center" spacing={1}>
        {showCount ? (
          <AppText
            sx={{
              fontSize: dense ? "0.76rem" : "0.82rem",
              fontWeight: 700,
              color: "var(--color-text)",
              whiteSpace: "nowrap",
            }}
          >
            {label || `${count} selected`}
          </AppText>
        ) : null}

        {actions.length > 0 ? (
          <AppDropdown
            label={triggerLabel}
            items={menuItems}
            triggerType="button"
            variant={triggerVariant}
            colorVariant={triggerColorVariant}
            size={dense ? "small" : "medium"}
            disabled={disabled || loading}
            loading={loading}
            menuMinWidth={190}
          />
        ) : null}

        {showClear ? (
          <AppIconButton
            icon={<CloseRoundedIcon />}
            tooltip={clearTooltip}
            variant="text"
            colorVariant="dark"
            size="small"
            onClick={onClearSelection}
            disabled={disabled || loading}
          />
        ) : null}
      </AppStack>
    </AppBox>
  );
};

export default AppBulkActions;
