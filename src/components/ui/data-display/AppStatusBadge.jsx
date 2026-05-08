import React from "react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import PendingRoundedIcon from "@mui/icons-material/PendingRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import { AppBadge } from "@/components";

const AppStatusBadge = ({
  status = "active",
  label,
  size = "medium", // small | medium | large
  variant = "soft", // soft | contained | outlined | text
  rounded = "full",
  showDot = true,
  showIcon = false,
  sx = {},
  ...props
}) => {
  const statusMap = {
    active: {
      label: "Active",
      colorVariant: "success",
      icon: <CheckCircleRoundedIcon />,
    },
    inactive: {
      label: "Inactive",
      colorVariant: "neutral",
      icon: <PauseCircleRoundedIcon />,
    },
    pending: {
      label: "Pending",
      colorVariant: "warning",
      icon: <PendingRoundedIcon />,
    },
    approved: {
      label: "Approved",
      colorVariant: "success",
      icon: <CheckCircleRoundedIcon />,
    },
    rejected: {
      label: "Rejected",
      colorVariant: "error",
      icon: <CancelRoundedIcon />,
    },
    draft: {
      label: "Draft",
      colorVariant: "neutral",
      icon: <PendingRoundedIcon />,
    },
    blocked: {
      label: "Blocked",
      colorVariant: "error",
      icon: <ErrorRoundedIcon />,
    },
    completed: {
      label: "Completed",
      colorVariant: "success",
      icon: <CheckCircleRoundedIcon />,
    },
    failed: {
      label: "Failed",
      colorVariant: "error",
      icon: <CancelRoundedIcon />,
    },
    processing: {
      label: "Processing",
      colorVariant: "info",
      icon: <PendingRoundedIcon />,
    },
  };

  const activeStatus = statusMap[status] || statusMap.active;

  return (
    <AppBadge
      label={label || activeStatus.label}
      variant={variant}
      colorVariant={activeStatus.colorVariant}
      size={size}
      rounded={rounded}
      dot={showDot && !showIcon}
      startIcon={showIcon ? activeStatus.icon : undefined}
      sx={sx}
      {...props}
    />
  );
};

export default AppStatusBadge;
