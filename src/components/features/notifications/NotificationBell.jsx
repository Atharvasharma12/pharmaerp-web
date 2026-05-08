import React from "react";
import { Badge, Box } from "@mui/material";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import { AppIconButton } from "@/components";

const NotificationBell = ({
  unreadCount = 0,
  onClick,
  loading = false,
  disabled = false,
  tooltip = "Notifications",
}) => {
  const hasUnread = unreadCount > 0;

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center" }}>
      <Badge
        badgeContent={unreadCount}
        color="error"
        max={99}
        invisible={!hasUnread}
        overlap="circular"
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <AppIconButton
          icon={<NotificationsNoneRoundedIcon />}
          onClick={onClick}
          loading={loading}
          disabled={disabled}
          tooltip={tooltip}
          variant="soft"
          colorVariant="dark"
          rounded="full"
          size="medium"
          aria-label="Open notifications"
        />
      </Badge>
    </Box>
  );
};

export default NotificationBell;
