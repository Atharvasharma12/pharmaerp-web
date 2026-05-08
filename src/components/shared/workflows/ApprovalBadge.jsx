import React from "react";
import { AppBadge, AppTooltip } from "@/components";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import PendingRoundedIcon from "@mui/icons-material/PendingRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";

const ApprovalBadge = ({
  status = "pending",

  label,

  size = "medium",
  variant = "soft",

  rounded = "full",

  showIcon = true,
  showDot = false,

  tooltip,

  clickable = false,
  onClick,

  sx = {},
  ...props
}) => {
  const statusMap = {
    approved: {
      label: "Approved",
      colorVariant: "success",
      icon: <CheckCircleRoundedIcon />,
    },

    pending: {
      label: "Pending Approval",
      colorVariant: "warning",
      icon: <PendingRoundedIcon />,
    },

    rejected: {
      label: "Rejected",
      colorVariant: "error",
      icon: <CancelRoundedIcon />,
    },

    cancelled: {
      label: "Cancelled",
      colorVariant: "neutral",
      icon: <PauseCircleRoundedIcon />,
    },

    escalated: {
      label: "Escalated",
      colorVariant: "info",
      icon: <AutorenewRoundedIcon />,
    },

    failed: {
      label: "Failed",
      colorVariant: "error",
      icon: <ErrorRoundedIcon />,
    },

    draft: {
      label: "Draft",
      colorVariant: "neutral",
      icon: <PendingRoundedIcon />,
    },

    in_review: {
      label: "In Review",
      colorVariant: "info",
      icon: <AutorenewRoundedIcon />,
    },
  };

  const active = statusMap[status] || statusMap.pending;

  const badge = (
    <AppBadge
      label={label || active.label}
      variant={variant}
      colorVariant={active.colorVariant}
      size={size}
      rounded={rounded}
      startIcon={showIcon ? active.icon : undefined}
      dot={showDot && !showIcon}
      clickable={clickable}
      onClick={onClick}
      sx={sx}
      {...props}
    />
  );

  if (!tooltip) {
    return badge;
  }

  return (
    <AppTooltip title={tooltip}>
      <span>{badge}</span>
    </AppTooltip>
  );
};

export default ApprovalBadge;
