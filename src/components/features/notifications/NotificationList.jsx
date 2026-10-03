import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { AppButton } from "@/components";
import NotificationItem from "./NotificationItem";

const NotificationList = ({
  notifications = [],
  loading = false,
  emptyText = "No notifications yet",
  onMarkAllRead,
  onNotificationClick,
}) => {
  const hasNotifications = notifications.length > 0;
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 380,
        bgcolor: "background.paper",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Notifications
          </Typography>

          {unreadCount > 0 && (
            <Typography variant="caption" color="text.secondary">
              {unreadCount} unread
            </Typography>
          )}
        </Box>

        {unreadCount > 0 && (
          <AppButton
            size="small"
            variant="text"
            colorVariant="primary"
            onClick={onMarkAllRead}
            disabled={loading}
          >
            Mark all read
          </AppButton>
        )}
      </Box>

      <Divider />

      {!hasNotifications ? (
        <Box
          sx={{
            px: 2,
            py: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {emptyText}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            maxHeight: 420,
            overflowY: "auto",
          }}
        >
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id || index}>
              <NotificationItem
                notification={notification}
                onClick={() => onNotificationClick?.(notification)}
              />

              {index !== notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default NotificationList;
