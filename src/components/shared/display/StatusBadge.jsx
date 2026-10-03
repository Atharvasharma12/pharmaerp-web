import React from "react";
import { AppStatusBadge } from "@/components";

const StatusBadge = ({
  status = "active",
  label,
  size = "medium",
  variant = "soft",
  rounded = "full",
  showDot = true,
  showIcon = false,
  sx = {},
  ...props
}) => {
  return (
    <AppStatusBadge
      status={status}
      label={label}
      size={size}
      variant={variant}
      rounded={rounded}
      showDot={showDot}
      showIcon={showIcon}
      sx={sx}
      {...props}
    />
  );
};

export default StatusBadge;
