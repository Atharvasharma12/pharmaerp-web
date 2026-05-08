import React from "react";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import AppEmptyState from "./AppEmptyState";
import { AppButton } from "@/components";

const AppErrorState = ({
  title = "Something went wrong",
  description = "We couldn’t load this data. Please try again.",
  actionText = "Retry",
  onRetry,
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
      icon={<ErrorOutlineRoundedIcon fontSize="inherit" />}
      action={
        showAction && onRetry ? (
          <AppButton variant="soft" colorVariant="error" onClick={onRetry}>
            {actionText}
          </AppButton>
        ) : null
      }
      sx={sx}
    />
  );
};

export default AppErrorState;
