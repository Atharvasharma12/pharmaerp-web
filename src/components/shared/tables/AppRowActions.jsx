import React, { useMemo, useState } from "react";
import {
  VisibilityOutlined,
  EditOutlined,
  DeleteOutlineRounded,
  ContentCopyRounded,
} from "@mui/icons-material";

import { AppMenu, ConfirmDialog } from "@/components";

const AppRowActions = ({
  row,

  actions,
  onView,
  onEdit,
  onDelete,
  onDuplicate,

  showView = true,
  showEdit = true,
  showDelete = true,
  showDuplicate = false,

  trigger,
  triggerTooltip = "Row actions",
  disabled = false,

  deleteTitle = "Delete item?",
  deleteDescription = "Are you sure you want to delete this item? This action cannot be undone.",
  deleteAlertTitle = "Permanent action",
  deleteAlertMessage = "This record will be removed permanently.",
  deleteConfirmText = "Delete",
  deleteCancelText = "Cancel",
  deleteLoading = false,

  menuMinWidth = 190,
  menuMaxWidth = 280,

  onActionClick,
}) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const defaultActions = useMemo(() => {
    const list = [];

    if (showView && onView) {
      list.push({
        id: "view",
        label: "View",
        icon: <VisibilityOutlined />,
        onClick: () => {
          onView(row);
          onActionClick?.("view", row);
        },
      });
    }

    if (showEdit && onEdit) {
      list.push({
        id: "edit",
        label: "Edit",
        icon: <EditOutlined />,
        onClick: () => {
          onEdit(row);
          onActionClick?.("edit", row);
        },
      });
    }

    if (showDuplicate && onDuplicate) {
      list.push({
        id: "duplicate",
        label: "Duplicate",
        icon: <ContentCopyRounded />,
        onClick: () => {
          onDuplicate(row);
          onActionClick?.("duplicate", row);
        },
      });
    }

    if (showDelete && onDelete) {
      if (list.length > 0) {
        list.push({
          id: "divider-before-delete",
          type: "divider",
        });
      }

      list.push({
        id: "delete",
        label: "Delete",
        icon: <DeleteOutlineRounded />,
        danger: true,
        onClick: () => {
          setDeleteOpen(true);
          onActionClick?.("delete_open", row);
        },
      });
    }

    return list;
  }, [
    row,
    onView,
    onEdit,
    onDelete,
    onDuplicate,
    showView,
    showEdit,
    showDelete,
    showDuplicate,
    onActionClick,
  ]);

  const finalActions = actions || defaultActions;

  const handleDeleteConfirm = async () => {
    await onDelete?.(row);
    onActionClick?.("delete_confirm", row);
    setDeleteOpen(false);
  };

  return (
    <>
      <AppMenu
        trigger={trigger}
        triggerTooltip={triggerTooltip}
        items={finalActions}
        disabled={disabled}
        minWidth={menuMinWidth}
        maxWidth={menuMaxWidth}
        dense
      />

      {onDelete && (
        <ConfirmDialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDeleteConfirm}
          title={deleteTitle}
          description={deleteDescription}
          confirmText={deleteConfirmText}
          cancelText={deleteCancelText}
          severity="error"
          loading={deleteLoading}
          alertTitle={deleteAlertTitle}
          alertMessage={deleteAlertMessage}
          closeOnBackdrop={false}
        />
      )}
    </>
  );
};

export default AppRowActions;
