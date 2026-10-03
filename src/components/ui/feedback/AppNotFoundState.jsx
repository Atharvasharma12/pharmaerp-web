import React from "react";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import AppEmptyState from "./AppEmptyState";
import { AppButton } from "@/components";

const AppNotFoundState = ({
  title = "Not found",
  description = "The resource you’re looking for doesn’t exist.",
  actionText = "Go to dashboard",
  onAction,
  showAction = true,
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
      icon={<SearchOffRoundedIcon fontSize="inherit" />}
      action={
        showAction && onAction ? (
          <AppButton
            variant="contained"
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

export default AppNotFoundState;
