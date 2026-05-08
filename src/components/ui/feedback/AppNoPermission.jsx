import React from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AppEmptyState from "./AppEmptyState";
import { AppButton } from "@/components";

const AppNoPermission = ({
  title = "Access denied",
  description = "You don’t have permission to view this content.",
  actionText = "Go back",
  onAction,
  showAction = false,
  size = "page", // small | medium | large | page
  fullHeight = true,
  sx = {},
}) => {
  return (
    <AppEmptyState
      title={title}
      description={description}
      size={size}
      fullHeight={fullHeight}
      icon={<LockOutlinedIcon fontSize="inherit" />}
      action={
        showAction && onAction ? (
          <AppButton
            variant="outlined"
            colorVariant="primary"
            onClick={onAction}
          >
            {actionText}
          </AppButton>
        ) : null
      }
      sx={sx}
    />
  );
};

export default AppNoPermission;
